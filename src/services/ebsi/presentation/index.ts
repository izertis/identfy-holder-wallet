import {
	CredentialOffer,
	OpenIdCredentialIssuer,
	OpenIdConfiguration,
	HooksEbsi,
	CredentialResponse,
	TokenResponse,
	PresentationDefinition,
	AuthorizationResponse,
	RedirectionInfo,
} from '../types'
import {
	getKeyFromTokenRequest,
	getCredentialRequest,
	sendTokenRequest,
	redirectVPTokenResponse,
	getPresentationDefinition,
} from '../ebsiService'
import { createVpTokenResponse } from '../utils'
import RequestPresentationModal from '../../../components/RequestPresentationModal'
import { getAuthorizationResponseParams } from '../../../utils/url'
import { parseJwt } from '../../../utils/crypto'
import ebsiI18nKeys from '../i18n/keys'
import { getPrivateKey } from '../../../utils/keychain'

export const createEbsiPresentation = async (
	credentialOffer: CredentialOffer,
	openIdCredentialIssuer: OpenIdCredentialIssuer,
	openIdConfiguration: OpenIdConfiguration,
	redirectInfo: RedirectionInfo,
	ebsiDid: string,
	verifier: string,
	{ showModal }: HooksEbsi
) => {
	try {
		const privateKey = await getPrivateKey()
		let presentationDefinition: PresentationDefinition
		if (redirectInfo.presentation_definition) {
			presentationDefinition = JSON.parse(redirectInfo.presentation_definition)
		} else if (redirectInfo.presentation_definition_uri) {
			presentationDefinition = await getPresentationDefinition(redirectInfo.presentation_definition_uri)
		} else {
			throw new Error(ebsiI18nKeys.ERROR_PRESENTATION_DEFINITION)
		}

		const credential = await new Promise<CredentialResponse>((resolve, reject) =>
			showModal?.({
				Component: RequestPresentationModal,
				modalProps: {},
				onAccept: async (verifiableCredential: any) => {
					const key = await getKeyFromTokenRequest({
						token: redirectInfo.request,
						jwks_uri: openIdConfiguration.jwks_uri,
					})

					const { signedToken: vp_token, header: headerTokenResponse } = await createVpTokenResponse(
						{
							vpTokenRequest: redirectInfo.request,
							credential_issuer: openIdCredentialIssuer.credential_issuer,
							authorization_server: openIdCredentialIssuer.authorization_server,
							verifiableCredential,
						},
						key
					)

					//  Make an post request sending the vp_token to get Authorisation response
					const vpToken: string = vp_token!
					const { redirect_uri, state } = parseJwt(redirectInfo.request)
					let authorizationResponse = await redirectVPTokenResponse({
						redirect_uri,
						vp_token: vpToken,
						state,
						presentation_definition: presentationDefinition,
					})

					const { code: authorizationResponseCode }: AuthorizationResponse =
						getAuthorizationResponseParams(authorizationResponse)

					// Make post request with Token Request
					const tokenResponse: TokenResponse = await sendTokenRequest({
						ebsiDid: ebsiDid!,
						code: authorizationResponseCode,
						verifier: verifier,
						tokenEndpoint: openIdConfiguration.token_endpoint,
					})

					// Make credential request, the credential response will be the requested credential
					const credentialResponse: CredentialResponse = await getCredentialRequest({
						kid: headerTokenResponse.kid,
						c_nonce: tokenResponse.c_nonce,
						accessToken: tokenResponse.access_token,
						issuerDid: ebsiDid!,
						types: credentialOffer.credentials?.[0]?.types,
						openIdCredentialIssuer,
						privateKey,
					})

					resolve(credentialResponse)
				},
				onCancel: () => reject(ebsiI18nKeys.ERROR_CANCEL_PRESENTATION),
			})
		)

		return credential
	} catch (error) {
		if (error) {
			throw error
		} else {
			throw new Error(ebsiI18nKeys.ERROR_PRESENTATION)
		}
	}
}
