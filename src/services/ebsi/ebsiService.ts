import axios from 'axios'
import { convertUriToObject } from '../../utils/url'
import {
	CredentialOffer,
	OpenIdCredentialIssuer,
	CredentialResponse,
	IDTokenRequest,
	TokenResponse,
	OpenIdConfiguration,
	PresentationDefinition,
	AuthorizationRequest,
	AuthorizationDetail,
	HolderServiceWalletMetadata,
	RedirectionInfo,
} from './types'
import { decodeJwt, decodeProtectedHeader } from 'jose'
import { keyFromJWK } from '../../utils/crypto'
import ebsiI18nKeys from './i18n/keys'
import { CredentialData } from '../../types/keychain'
import { v4 as uuidv4 } from 'uuid'
import { signJWT } from '../../utils/jwt'

export const getCredentialOffer = async (credential_offer_uri: string) => {
	const credentialOffer: CredentialOffer = await fetch(credential_offer_uri)
		.then((response) => {
			if (!response.ok) {
				throw new Error(ebsiI18nKeys.ERROR_CREDENTIAL_OFFER)
			}
			return response.json()
		})
		.catch((error) => {
			throw new Error(ebsiI18nKeys.ERROR_CREDENTIAL_OFFER)
		})

	return credentialOffer
}

export const getOpenIdCredentialIssuer = async (credential_issuer: string) => {
	const urlCredentialIssuer = `${credential_issuer}/.well-known/openid-credential-issuer`
	const openIdCredentialIssuer: OpenIdCredentialIssuer = await axios
		.get(urlCredentialIssuer)
		.then((result) => result.data)
		.catch((error) => {
			throw new Error(ebsiI18nKeys.ERROR_OPENID_ISSUER)
		})

	return openIdCredentialIssuer
}

export const getOpenIdConfiguration = async (authorization_server: string) => {
	const authorizationServer = authorization_server
	const authorizationServerURL = `${authorizationServer}/.well-known/openid-configuration`
	const openIdConfiguration: OpenIdConfiguration = await axios
		.get(authorizationServerURL)
		.then((result) => result.data)
		.catch((error) => {
			throw new Error(ebsiI18nKeys.ERROR_OPENID_CONFIGURATION)
		})

	return openIdConfiguration
}

export const authorizationRequest = async ({
	issuerState: issuerState,
	ebsiDid,
	challenge,
	authorizationEndpoint,
	types,
	locations,
}: {
	issuerState: string
	authorizationEndpoint: string
	ebsiDid: string
	challenge: string
	types: string[]
	locations: string
}) => {
	const params: AuthorizationRequest = {
		response_type: 'code',
		scope: 'openid',
		state: 'vcfghhj',
		client_id: ebsiDid,
		authorization_details: JSON.stringify([
			{
				type: 'openid_credential',
				locations: [locations],
				format: 'jwt_vc',
				types: types,
			} as AuthorizationDetail,
		]),
		client_metadata: JSON.stringify({
			vp_formats_supported: {
				jwt_vp: { alg_values_supported: ['ES256'] },
				jwt_vc: { alg_values_supported: ['ES256'] },
			},
			response_types_supported: ['vp_token', 'id_token'],
			authorization_endpoint: 'https://www.example.com',
		} as HolderServiceWalletMetadata),
		code_challenge: challenge,
		code_challenge_method: 'S256',
		nonce: 'glkFFoisdfEui4312',
		redirect_uri: 'https://www.example.com',
		issuer_state: issuerState,
	}

	const queryString = new URLSearchParams(params).toString()
	const urlWithParams = `${authorizationEndpoint}?${queryString}`

	const authRequestUri = await fetch(urlWithParams)
		.then((response) => response.url)
		.catch((error) => {
			console.error(error)
			throw new Error(ebsiI18nKeys.ERROR_AUTHORIZATION_REQUEST)
		})

	const redirectionInfo: RedirectionInfo = convertUriToObject(authRequestUri!) as any

	const { error, error_description } = redirectionInfo ?? {}
	if (error || error_description) {
		throw error_description.split('+').join(' ')
	}

	return redirectionInfo
}

export const getIdTokenRequest = async (authorizationRequestObject: RedirectionInfo): Promise<string> => {
	if (authorizationRequestObject.request_uri) {
		const idTokenRequest: string = await axios
			.get(authorizationRequestObject.request_uri)
			.then((response) => response.data)

		return idTokenRequest
	} else if (authorizationRequestObject.request) {
		return authorizationRequestObject.request as string
	} else throw ebsiI18nKeys.ERROR_IDTOKEN_REQUEST
}

export const getKeyFromTokenRequest = async ({ token, jwks_uri }: { token: string; jwks_uri: string }) => {
	const { kid: protectedHeaderKid }: any = decodeProtectedHeader(token)
	const jwksUriData = await axios.get(jwks_uri).then((result) => result.data)
	const selectedKey = jwksUriData.keys.find(({ kid }: { kid: string }) => kid.includes(protectedHeaderKid))

	if (!selectedKey) throw ebsiI18nKeys.ERROR_VALIDATION_JWT
	const key = await keyFromJWK(selectedKey)

	return key
}

export const preAuthorizeCredential = async ({
	pre_authorized_code,
	user_pin,
	token_endpoint,
}: {
	pre_authorized_code: string
	user_pin: string
	token_endpoint: string
}) => {
	const params = new URLSearchParams({
		grant_type: 'urn:ietf:params:oauth:grant-type:pre-authorized_code',
		user_pin: user_pin,
		'pre-authorized_code': pre_authorized_code || '',
	}).toString()

	const tokenRequest = await axios
		.post(token_endpoint, params, {
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
		})
		.then((response) => {
			return response.data
		})
		.catch((error) => {
			console.error(error)
			throw new Error(ebsiI18nKeys.ERROR_TOKEN_RESPONSE)
		})
	return tokenRequest
}

export const redirectIDTokenResponse = async ({
	redirect_uri,
	id_token,
	state,
}: {
	redirect_uri: string
	id_token: string | undefined
	state: string
}) => {
	const params = {
		id_token: id_token,
		state: state,
	}
	try {
		const response = await axios.post(redirect_uri, params, {
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
		})

		const redirectUriResponse = response.request.responseURL

		return redirectUriResponse
	} catch (error) {
		console.error(error)
		throw new Error(ebsiI18nKeys.ERROR_AUTHORIZATION_RESPONSE)
	}
}

export const getPresentationDefinition = async (presentation_definition_uri: string) => {
	let presentationDefinition
	const response = await axios.get(presentation_definition_uri)

	if (response.status === 200) {
		presentationDefinition = response.data
	} else {
		throw new Error(ebsiI18nKeys.ERROR_PRESENTATION_DEFINITION)
	}
	return presentationDefinition
}

export const redirectVPTokenResponse = async ({
	redirect_uri,
	vp_token,
	state,
	presentation_definition,
}: {
	redirect_uri: string
	vp_token: string
	state: string
	presentation_definition: PresentationDefinition
}) => {
	const vpTokenResponsePayload = decodeJwt(vp_token) as any

	const presentation_submission = JSON.stringify({
		id: uuidv4(),
		definition_id: presentation_definition.id,
		descriptor_map: vpTokenResponsePayload.vp.verifiableCredential.map((credential: string, index: number) => {
			return {
				id: presentation_definition.input_descriptors[index].id,
				path: '$',
				format: 'jwt_vp',
				path_nested: {
					id: presentation_definition.input_descriptors[index].id,
					format: 'jwt_vc',
					path: `$.verifiableCredential[${index}]`,
				},
			}
		}),
	})

	const data = new URLSearchParams({
		presentation_submission,
		vp_token,
		state,
	}).toString()

	return axios
		.post(redirect_uri, data, {
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
		})
		.then((response) => {
			return response.request.responseURL
		})
		.catch((error) => {
			console.error(error)
			throw new Error(ebsiI18nKeys.ERROR_AUTHORIZATION_RESPONSE)
		})
}

export const sendTokenRequest = async ({ ebsiDid, code, verifier, tokenEndpoint }: IDTokenRequest) => {
	const params = {
		grant_type: 'authorization_code',
		client_id: ebsiDid!,
		code: code,
		client_assertion_type: true,
		code_verifier: verifier,
	}

	const tokenRequestUrl = tokenEndpoint
	const tokenRequest: TokenResponse = await axios
		.post(tokenRequestUrl, params, {
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
		})
		.then((response) => {
			return response.data
		})
		.catch((error) => {
			console.error(error)
			throw new Error(ebsiI18nKeys.ERROR_TOKEN_RESPONSE)
		})

	return tokenRequest
}

export const getDeferredCredentialResponse = async ({
	acceptance_token,
	deferredEndpoint,
}: {
	acceptance_token: string
	deferredEndpoint: string
}): Promise<CredentialData | undefined> => {
	let config = {
		method: 'post',
		maxBodyLength: Infinity,
		url: `${deferredEndpoint}`,
		headers: {
			Accept: 'application/json, application/problem+json',
			Authorization: `Bearer ${acceptance_token}`,
			'Content-Type': 'text/plain',
		},
	}

	const credentialResponse = await axios
		.request(config)
		.then((response) => {
			return response.data
		})
		.catch((error) => undefined)
	return credentialResponse
}

export const getCredentialRequest = async ({
	accessToken,
	types,
	openIdCredentialIssuer,
	kid,
	c_nonce,
	issuerDid,
	privateKey,
}: {
	accessToken: string
	types: string[]
	openIdCredentialIssuer: OpenIdCredentialIssuer
	kid: string
	c_nonce: string
	issuerDid: string
	privateKey: string | null
}): Promise<CredentialResponse> => {
	try {
		const jwt = await signJWT({
			header: {
				typ: 'openid4vci-proof+jwt',
				alg: 'ES256',
				kid,
			},
			payload: {
				iat: Date.now(),
				iss: issuerDid,
				aud: openIdCredentialIssuer.credential_issuer,
				exp: Math.floor(Date.now() / 1000) + 300,
				nonce: c_nonce,
			},
			privateKey,
		})

		if (!jwt) throw 'No jwt'

		const data = JSON.stringify({
			format: 'jwt_vc',
			types,
			proof: {
				proof_type: 'jwt',
				jwt,
			},
		})

		const config = {
			method: 'post',
			url: openIdCredentialIssuer.credential_endpoint,
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${accessToken}`,
			},
			data,
		}

		const response = await axios.request(config)
		return response.data
	} catch (error) {
		throw new Error(ebsiI18nKeys.ERROR_CREDENTIAL)
	}
}
