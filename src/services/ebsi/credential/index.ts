import { getDid, getPrivateKey } from '../../../utils/keychain'
import RequestCredentialModal from '../../../components/RequestCredentialModal'
import { decodeJwt } from 'jose'
import {
	OpenIdConfiguration,
	OpenIdCredentialIssuer,
	CredentialOffer,
	CredentialResponse,
	TokenResponse,
	HooksEbsi,
	AuthorizationResponse,
	PreAuthorizeResponse,
	RedirectionInfo,
} from '../types'
import { getHeaderKidFromDid } from '../utils'
import {
	getCredentialRequest,
	getIdTokenRequest,
	getKeyFromTokenRequest,
	redirectIDTokenResponse,
	preAuthorizeCredential,
	sendTokenRequest,
} from '../ebsiService'
import { createTokenResponse } from '../utils'
import { getAuthorizationResponseParams } from '../../../utils/url'
import RequestPreauthorizeUserPinModal from '../../../components/RequestPreauthorizeUserPinModal'
import ebsiI18nKeys from '../i18n/keys'

export const createEbsiCredential = async (
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
		const idTokenRequest = await getIdTokenRequest(redirectInfo)

		// Now we have id token in idJWT, also JWK uri from dataConfiguration and also credential issuer. Now we can proceed with ID TOKEN.
		const key = await getKeyFromTokenRequest({ token: idTokenRequest, jwks_uri: openIdConfiguration.jwks_uri })
		const { signedToken: idToken, header: headerTokenResponse } = await createTokenResponse(
			{
				credential_issuer: credentialOffer.credential_issuer,
				tokenRequest: idTokenRequest,
				authorization_server: openIdCredentialIssuer.authorization_server,
			},
			key
		)

		// Make an post request sending the id_token to get Authorisation response
		const { redirect_uri, state }: { redirect_uri: string; state: string } = decodeJwt(idTokenRequest) as any
		let authorizationResponse: string = await redirectIDTokenResponse({
			redirect_uri,
			id_token: idToken,
			state,
		})

		const { code: authorizationResponseCode }: AuthorizationResponse =
			getAuthorizationResponseParams(authorizationResponse)

		// With the value code, obtained of authorization response, make post request to get Token response, this will have an access token
		const tokenResponse: TokenResponse = await sendTokenRequest({
			ebsiDid: ebsiDid!,
			code: authorizationResponseCode,
			verifier: verifier,
			tokenEndpoint: openIdConfiguration.token_endpoint,
		})

		// Make credential request, the credential response will be the requested credential
		const credentialResponse: CredentialResponse = await getCredentialRequest({
			accessToken: tokenResponse.access_token,
			types: credentialOffer.credentials?.[0]?.types,
			openIdCredentialIssuer,
			issuerDid: ebsiDid!,
			kid: headerTokenResponse.kid,
			c_nonce: tokenResponse.c_nonce,
			privateKey,
		})

		await new Promise(async (resolve, reject) =>
			showModal?.({
				Component: RequestCredentialModal,
				modalProps: {
					entity: '',
					network: 'EBSI',
					publicKey: key.getPublic().encode('hex', true),
				},
				onAccept: resolve,
				onCancel: () => reject(ebsiI18nKeys.CANCEL),
			})
		)
		return credentialResponse
	} catch (error) {
		throw error
	}
}

export const createEbsiCredentialPreauthorized = async (
	{
		credentialOffer,
		openIdCredentialIssuer,
		openIdConfiguration,
		ebsiDid,
	}: {
		credentialOffer: CredentialOffer
		openIdCredentialIssuer: OpenIdCredentialIssuer
		openIdConfiguration: OpenIdConfiguration
		ebsiDid: string
	},
	{ showModal }: HooksEbsi
): Promise<CredentialResponse> => {
	const privateKey = await getPrivateKey()
	return new Promise((resolve, reject) => {
		const preAuthorizedCode =
			credentialOffer?.grants?.['urn:ietf:params:oauth:grant-type:pre-authorized_code']?.['pre-authorized_code']

		const userPinRequired =
			credentialOffer?.grants?.['urn:ietf:params:oauth:grant-type:pre-authorized_code']?.user_pin_required === true

		if (userPinRequired) {
			showModal?.({
				Component: RequestPreauthorizeUserPinModal,
				onAccept: async (user_pin: string) => {
					if (!preAuthorizedCode) {
						reject(ebsiI18nKeys.ERROR_PREAUTHORIZATION)
						return
					}

					const tokenResponse: PreAuthorizeResponse = await preAuthorizeCredential({
						pre_authorized_code: preAuthorizedCode,
						user_pin: user_pin,
						token_endpoint: openIdConfiguration.token_endpoint,
					})

					if (!tokenResponse) {
						reject(ebsiI18nKeys.ERROR_PREAUTHORIZATION)
						return
					}

					const credentialResponse: CredentialResponse = await getCredentialRequest({
						accessToken: tokenResponse.access_token,
						types: credentialOffer.credentials?.[0]?.types,
						kid: getHeaderKidFromDid(ebsiDid!),
						issuerDid: ebsiDid!,
						c_nonce: tokenResponse.c_nonce,
						openIdCredentialIssuer,
						privateKey,
					})
					resolve(credentialResponse)
				},
				onCancel: () => reject(ebsiI18nKeys.CANCEL),
			})
		} else {
			if (!preAuthorizedCode) {
				reject(ebsiI18nKeys.ERROR_PREAUTHORIZATION)
				return
			}

			preAuthorizeCredential({
				pre_authorized_code: preAuthorizedCode,
				token_endpoint: openIdConfiguration.token_endpoint,
				user_pin: '',
			})
				.then(async (tokenResponse: PreAuthorizeResponse) => {
					const ebsiDid = await getDid('ebsi')

					const credentialResponse: CredentialResponse = await getCredentialRequest({
						accessToken: tokenResponse.access_token,
						types: credentialOffer.credentials?.[0]?.types,
						kid: getHeaderKidFromDid(ebsiDid!),
						issuerDid: ebsiDid!,
						c_nonce: tokenResponse.c_nonce,
						openIdCredentialIssuer,
						privateKey,
					})
					resolve(credentialResponse)
				})
				.catch((error) => {
					throw error
				})
		}
	})
}
