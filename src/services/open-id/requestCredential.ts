import { getDid, getPrivateKey, saveCredential, saveDeferredCredential } from '../../utils/keychain'
import RequestCredentialModal from '../../components/RequestCredentialModal'
import { decodeJwt } from 'jose'
import {
	CredentialOffer,
	OpenIdCredentialIssuer,
	OpenIdConfiguration,
	AuthorizationRequestResponse,
	AuthorizationResponse,
	TokenResponse,
	PreAuthorizeResponse,
	ModalType,
	PresentationDefinition,
	DeferredCredential,
	chosenCredential,
	GrantType,
} from './types'
import { createTokenResponse, createVp, getTrustedFrameworkFromDid } from './utils'
import { processAuthorizationResponse } from '../../utils/url'
import RequestPreauthorizeUserPinModal from '../../components/RequestPreauthorizeUserPinModal'
import OpenIdService from '../OpenId.service'
import openIdI18nKeys from '../i18n/keys'
import { signJWT } from '../../utils/jwt'
import { generateCodeVerifierAndChallenge } from '../../utils/pkceGenerator'
import { ALASTRIA_DID_METHOD } from '../alastria/constants'
import RequestPresentationModal from '../../components/RequestPresentationModal'

export const requestCredential = async (
	credentialOffer: CredentialOffer,
	openIdCredentialIssuer: OpenIdCredentialIssuer,
	openIdConfiguration: OpenIdConfiguration,
	{ t, showModal }: ModalType
) => {
	if (!t) throw new Error('Error translating')

	const privateKey = await getPrivateKey()

	const isEpic = openIdConfiguration.subject_trust_frameworks_supported[0] === ALASTRIA_DID_METHOD

	const subjectDid = !isEpic ? await getDid('ebsi') : await getDid('alastria')

	if (!subjectDid) throw new Error(t(openIdI18nKeys.ERROR_NO_DID))

	const isPreauthorizedFlow = 'urn:ietf:params:oauth:grant-type:pre-authorized_code' in credentialOffer.grants

	let message
	let presentation = false

	try {
		let chosenCredential: chosenCredential
		let tokenRequestResponse: TokenResponse | PreAuthorizeResponse

		if (isPreauthorizedFlow) {
			// Preauthorized flow
			const preAuthorizedCode =
				credentialOffer?.grants?.['urn:ietf:params:oauth:grant-type:pre-authorized_code']?.['pre-authorized_code']

			if (!preAuthorizedCode) {
				throw new Error(openIdI18nKeys.ERROR_PREAUTHORIZATION)
			}

			const userPinRequired =
				credentialOffer?.grants?.['urn:ietf:params:oauth:grant-type:pre-authorized_code']?.user_pin_required === true

			let userPin
			if (userPinRequired) {
				userPin = await new Promise<any>((resolve, reject) =>
					showModal?.({
						Component: RequestPreauthorizeUserPinModal,
						onAccept: async (user_pin: string) => {
							if (user_pin.length === 0) reject(new Error(openIdI18nKeys.ERROR_NO_PIN))

							resolve(user_pin)
						},
						onCancel: () => reject(new Error(openIdI18nKeys.CANCEL)),
					})
				)
			}

			tokenRequestResponse = await OpenIdService.sendTokenRequest(
				{
					redirect_uri: 'https://www.izertis.com',
					grant_type: Object.keys(credentialOffer.grants)[0] as GrantType,
					...(userPin != null && { user_pin: userPin }),
					'pre-authorized_code': preAuthorizedCode,
				},
				openIdConfiguration.token_endpoint
			)

			if (!tokenRequestResponse) {
				throw new Error(t(openIdI18nKeys.ERROR_PREAUTHORIZATION_PIN))
			}

			chosenCredential = await new Promise((resolve, reject) =>
				showModal?.({
					Component: RequestCredentialModal,
					modalProps: {
						entity: openIdCredentialIssuer.credential_issuer,
						trustedFramework: openIdConfiguration.subject_trust_frameworks_supported[0],
						availableCredentials: credentialOffer.credentials,
					},
					onAccept: resolve,
					onCancel: () => reject(new Error(openIdI18nKeys.CANCEL)),
				})
			)
		} else {
			// Regular flow
			const { verifier, challenge } = await generateCodeVerifierAndChallenge()

			chosenCredential = await new Promise(async (resolve, reject) =>
				showModal?.({
					Component: RequestCredentialModal,
					modalProps: {
						entity: openIdCredentialIssuer.credential_issuer,
						trustedFramework: openIdConfiguration.subject_trust_frameworks_supported[0],
						availableCredentials: credentialOffer.credentials,
					},
					onAccept: resolve,
					onCancel: () => reject(new Error(openIdI18nKeys.CANCEL)),
				})
			)
			const authorizationRequestResponse: AuthorizationRequestResponse = await OpenIdService.sendAuthorizationRequest({
				issuerState: credentialOffer?.grants?.authorization_code?.issuer_state,
				subjectDid: subjectDid,
				challenge: challenge,
				authorizationEndpoint: openIdConfiguration?.authorization_endpoint,
				types: chosenCredential.types,
				locations: openIdCredentialIssuer.credential_issuer,
				scope: openIdConfiguration.scopes_supported,
			})

			const idTokenRequest = await OpenIdService.processTokenRequest(authorizationRequestResponse)

			// TODO: check tokenRequest validation
			// const key = await OpenIdService.getKeyFromTokenRequest({
			// 	token: idTokenRequest,
			// 	jwks_uri: openIdConfiguration.jwks_uri,
			// })

			let tokenResponse

			if (authorizationRequestResponse.response_type === 'id_token') {
				// Credential issuance
				const { signedToken: idToken } = await createTokenResponse({
					credential_issuer: credentialOffer.credential_issuer,
					subjectDid,
					tokenRequest: idTokenRequest,
					authorization_server: openIdCredentialIssuer.authorization_server,
				})

				const { redirect_uri, state }: { redirect_uri: string; state: string } = decodeJwt(idTokenRequest) as any
				tokenResponse = await OpenIdService.sendTokenResponse({
					redirect_uri,
					id_token: idToken,
					...(state != null && { state }),
				})
			} else {
				// Verifiable presentation
				let presentationDefinition: PresentationDefinition = await OpenIdService.getPresentationDefinition(
					authorizationRequestResponse.request
				)

				// Stop presentation process if field.path is empty (incorrect presentation definition)
				const descriptors = presentationDefinition.input_descriptors
				if (descriptors.some((elm) => elm.constraints?.fields.some((field) => !field.path.length))) {
					throw new Error(openIdI18nKeys.ERROR_INVALID_PRESENTATION_DEFINITION)
				}

				const vpToken = await new Promise<string>((resolve, reject) =>
					showModal?.({
						Component: RequestPresentationModal,
						modalProps: { presentationDefinition },
						onAccept: async (verifiableCredential: any) => {
							try {
								const key = await OpenIdService.getKeyFromTokenRequest({
									token: authorizationRequestResponse.request,
									jwks_uri: openIdConfiguration.jwks_uri,
								})

								const vp = createVp({
									holder: subjectDid,
									verifiableCredential,
								})

								const { signedToken: vpToken } = await createTokenResponse({
									tokenRequest: authorizationRequestResponse.request,
									credential_issuer: openIdCredentialIssuer.credential_issuer,
									subjectDid,
									authorization_server: openIdCredentialIssuer.authorization_server,
									extra_payload: { vp },
								})
								resolve(vpToken)
							} catch (error) {
								reject(error)
							}
						},
						onCancel: () => reject(new Error(openIdI18nKeys.ERROR_CANCEL_PRESENTATION)),
					})
				)

				const { redirect_uri, state }: { redirect_uri: string; state: string } = decodeJwt(
					authorizationRequestResponse.request
				) as any
				tokenResponse = await OpenIdService.sendTokenResponse({
					redirect_uri,
					vp_token: vpToken,
					...(state != null && { state }),
					presentation_definition: presentationDefinition,
				})

				presentation = true
			}

			const { code: authorizationResponseCode }: AuthorizationResponse = processAuthorizationResponse(tokenResponse)

			if (authorizationResponseCode.toLowerCase().includes('denied'))
				throw new Error(t(openIdI18nKeys.ERROR_AUTHORIZATION_RESPONSE_CODE))

			tokenRequestResponse = await OpenIdService.sendTokenRequest(
				{
					redirect_uri: 'https://www.izertis.com',
					grant_type: Object.keys(credentialOffer.grants)[0] as any,
					client_id: subjectDid,
					code: authorizationResponseCode,
					code_verifier: verifier,
				},
				openIdConfiguration.token_endpoint
			)
		}

		const trustedFramework = getTrustedFrameworkFromDid(subjectDid)

		const jwt = await signJWT({
			header: {
				typ: 'openid4vci-proof+jwt',
				kid: subjectDid,
			},
			trustedFramework,
			payload: {
				iat: Date.now() / 1000,
				iss: subjectDid,
				aud: openIdCredentialIssuer.credential_issuer,
				exp: Math.floor(Date.now() / 1000) + 300,
				nonce: tokenRequestResponse!.c_nonce,
			},
			privateKey,
		})

		let { acceptance_token, credential } = await OpenIdService.getCredentialRequest({
			accessToken: tokenRequestResponse!.access_token,
			requestedCredential: chosenCredential,
			openIdCredentialIssuer,
			jwt,
		})

		if (acceptance_token) {
			// Deferred credential, save acceptance token for later
			const deferredCredential: DeferredCredential = {
				acceptance_token: acceptance_token,
				credential_endpoint: openIdCredentialIssuer.deferred_credential_endpoint,
			}
			await saveDeferredCredential(deferredCredential)
			message = t(openIdI18nKeys.SUCCESS_DEFERRED)
		} else {
			// Save the credential
			if (!presentation) {
				await saveCredential(credential, 'credential')
				message = t(openIdI18nKeys.SUCCESS)
			} else {
				// TODO: Define information. Storing to show information in both lists (credentials and presentation)
				await saveCredential(credential, 'credential')
				await saveCredential(credential, 'presentation')
				message = t(openIdI18nKeys.SUCCESS_PRESENTATION)
			}
		}
		return message
	} catch (error) {
		throw error
	}
}
