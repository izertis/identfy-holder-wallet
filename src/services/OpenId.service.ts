import axios from 'axios'
import {
	AuthorizationDetail,
	AuthorizationRequest,
	CredentialOffer,
	CredentialResponse,
	HolderServiceWalletMetadata,
	OpenIdConfiguration,
	OpenIdCredentialIssuer,
	PresentationDefinition,
	AuthorizationRequestResponse,
	TokenRequest,
	TokenResponse,
	PresentationOffer,
} from './open-id/types'
import { convertUriToObject } from '../utils/url'
import { decodeJwt, decodeProtectedHeader } from 'jose'
import { keyFromJWK, selectCurve } from '../utils/crypto'
import { v4 as uuidv4 } from 'uuid'
import openIdI18nKeys from './i18n/keys'
import i18next from 'i18next'
import localeES from './i18n/es'
import { decodeToken } from 'jsontokens'

const bundleName = 'openId'
i18next.addResourceBundle('es', bundleName, localeES)

class OpenId {
	t: (key: string) => string
	constructor() {
		this.t = i18next.getFixedT('es', bundleName)
	}

	async getCredentialOffer(credential_offer_uri: string) {
		const credentialOffer: CredentialOffer = await fetch(credential_offer_uri)
			.then((response) => {
				if (!response.ok) {
					throw 'fetching error'
				}
				return response.json()
			})
			.catch((error) => {
				throw new Error(`${this.t(openIdI18nKeys.ERROR_CREDENTIAL_OFFER)} - ${error}`)
			})

		return credentialOffer
	}

	async getOpenIdCredentialIssuer(credential_issuer: string) {
		const urlCredentialIssuer = `${credential_issuer}/.well-known/openid-credential-issuer`
		const openIdCredentialIssuer: OpenIdCredentialIssuer = await axios
			.get(urlCredentialIssuer)
			.then((result) => result.data)
			.catch((error) => {
				throw new Error(`${this.t(openIdI18nKeys.ERROR_OPENID_ISSUER)} - ${error}`)
			})

		return openIdCredentialIssuer
	}

	async getOpenIdConfiguration(authorization_server: string) {
		const authorizationServer = authorization_server
		const authorizationServerURL = `${authorizationServer}/.well-known/openid-configuration`
		const openIdConfiguration: OpenIdConfiguration = await axios
			.get(authorizationServerURL)
			.then((result) => result.data)
			.catch((error) => {
				throw new Error(`${this.t(openIdI18nKeys.ERROR_OPENID_CONFIGURATION)} - ${error}`)
			})

		return openIdConfiguration
	}

	async sendAuthorizationRequest({
		issuerState: issuerState,
		subjectDid,
		challenge,
		authorizationEndpoint,
		types,
		locations,
		scope,
	}: {
		issuerState: string
		authorizationEndpoint: string
		subjectDid: string
		challenge: string
		types: string[]
		locations: string
		scope: string[]
	}) {
		const params: AuthorizationRequest = {
			response_type: 'code',
			scope: Array.isArray(scope) ? scope.join(' ') : scope,
			state: uuidv4(),
			client_id: subjectDid,
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
				authorization_endpoint: 'https://www.izertis.com',
			} as HolderServiceWalletMetadata),
			code_challenge: challenge,
			code_challenge_method: 'S256',
			nonce: 'glkFFoisdfEui4312',
			redirect_uri: 'https://www.izertis.com',
			issuer_state: issuerState,
		}

		const queryString = new URLSearchParams(params).toString()
		const urlWithParams = `${authorizationEndpoint}?${queryString}`

		let authRequestUri
		try {
			const response = await fetch(urlWithParams, { method: 'GET' })
			if (response.status === 302) {
				const location = response.headers.get('Location')
				authRequestUri = location
			}
			authRequestUri = response.url
		} catch (error) {
			throw new Error(`${this.t(openIdI18nKeys.ERROR_AUTHORIZATION_REQUEST)} - ${error}`)
		}

		const authorizationRequestResponse: AuthorizationRequestResponse = convertUriToObject(authRequestUri!) as any

		const { error, error_description } = authorizationRequestResponse ?? {}
		if (error || error_description) {
			throw new Error(error_description.split('+').join(' '))
		}

		return authorizationRequestResponse
	}

	async processTokenRequest(authorizationRequestObject: AuthorizationRequestResponse) {
		if (authorizationRequestObject.request_uri) {
			const idTokenRequest: string = await axios
				.get(authorizationRequestObject.request_uri)
				.then((response) => response.data)
				.catch((error) => {
					throw new Error(`${this.t(openIdI18nKeys.ERROR_IDTOKEN_REQUEST)} - ${error}`)
				})

			return idTokenRequest
		} else if (authorizationRequestObject.request) {
			return authorizationRequestObject.request as string
		} else throw this.t(openIdI18nKeys.ERROR_IDTOKEN_REQUEST)
	}

	async getKeyFromTokenRequest({ token, jwks_uri }: { token: string; jwks_uri: string }) {
		const header = decodeProtectedHeader(token)
		const jwksUriData = await axios.get(jwks_uri).then((result) => result.data)
		const selectedKey = jwksUriData.keys.find(({ kid }: { kid: string }) => kid.includes(header.kid!))

		if (!selectedKey) throw this.t(openIdI18nKeys.ERROR_VALIDATION_JWT)
		const curveName = header.alg
		const curve = selectCurve(curveName as any)
		const key = await keyFromJWK(selectedKey, curve)

		return key
	}

	async getPresentationDefinition(presentationToken: string): Promise<PresentationDefinition> {
		const decodedToken: any = decodeJwt(presentationToken)

		const { payload: presentationOffer } = decodedToken || {}

		let presentationDefinition
		presentationDefinition = decodedToken
		if (presentationDefinition?.presentation_definition) {
			presentationDefinition =
				typeof presentationDefinition.presentation_definition === 'string'
					? JSON.parse(presentationDefinition.presentation_definition)
					: presentationDefinition.presentation_definition
		} else if (presentationOffer?.presentation_definition_uri) {
			const response = await axios.get(presentationOffer.presentation_definition_uri)

			if (response.status === 200) {
				presentationDefinition = response.data
			} else {
				throw new Error(`${this.t(openIdI18nKeys.ERROR_PRESENTATION_DEFINITION)}`)
			}
		} else {
			throw new Error(this.t(openIdI18nKeys.ERROR_PRESENTATION_DEFINITION))
		}

		return presentationDefinition
	}

	async sendTokenResponse({
		redirect_uri,
		vp_token,
		id_token,
		state,
		presentation_definition,
	}: {
		redirect_uri: string
		vp_token?: string
		id_token?: string
		state?: string
		presentation_definition?: PresentationDefinition
	}) {
		try {
			if (!vp_token && !id_token) {
				throw new Error('Neither vp_token nor id_token provided.')
			}

			let data
			if (vp_token && presentation_definition) {
				const vpTokenResponsePayload = decodeJwt(vp_token) as any
				const presentation_submission = JSON.stringify({
					id: uuidv4(),
					definition_id: presentation_definition.id,
					descriptor_map: vpTokenResponsePayload.vp.verifiableCredential.map((credential: string, index: number) => {
						const credentialFormat = credential.includes('.') ? 'jwt_vc' : 'ldp_vc'
						return {
							id: presentation_definition.input_descriptors[index].id,
							path: '$',
							format: 'jwt_vp',
							path_nested: {
								id: presentation_definition.input_descriptors[index].id,
								format: credentialFormat,
								path: `$.vp.verifiableCredential[${index}]`,
							},
						}
					}),
				})
				data = new URLSearchParams({
					vp_token,
					...(state != null && { state }),
					presentation_submission,
				}).toString()
			} else if (id_token) {
				data = new URLSearchParams({
					id_token,
					...(state != null && { state }),
				}).toString()
			}
			let response
			try {
				const result = await axios.post(redirect_uri, data, {
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded',
					},
					maxRedirects: 0,
				})

				if (result.status === 302) {
					const redirectLocation = result.headers['location']
					response = redirectLocation
				} else {
					response = result?.request?.responseURL
				}

				const { error, error_description } = response ?? {}
				if (error || error_description) {
					throw new Error(error_description.split('+').join(' '))
				}
			} catch (error) {
				throw error
			}

			return response
		} catch (error: any) {
			throw new Error(`${this.t(openIdI18nKeys.ERROR_AUTHORIZATION_RESPONSE)} - ${error}`)
		}
	}

	async sendVPTokenResponse({
		presentationOffer,
		signedVpToken,
		state,
		presentationDefinition,
	}: {
		presentationOffer: PresentationOffer
		signedVpToken: string
		state?: string
		presentationDefinition: any
	}): Promise<boolean> {
		let data: string | undefined
		let presentation_submission: string | undefined

		if (signedVpToken && presentationDefinition) {
			const decoded_vp_token = decodeToken(signedVpToken).payload as any
			const credentials = decoded_vp_token.vp.verifiableCredential
			const descriptors = presentationDefinition.input_descriptors

			if (credentials.length !== descriptors.length) {
				throw new Error(`${this.t(openIdI18nKeys.ERROR_INVALID_PRESENTATION)}`)
			}

			presentation_submission = JSON.stringify({
				id: uuidv4(),
				definition_id: presentationDefinition.id,
				descriptor_map: credentials.map((credential: any, index: number) => ({
					id: descriptors[index].id,
					path: '$',
					format: 'jwt_vp',
					path_nested: {
						id: descriptors[index].id,
						format: credential.includes('.') ? 'jwt_vc' : 'ldp_vc',
						path: `$.vp.verifiableCredential[${index}]`,
					},
				})),
			})

			data = new URLSearchParams({
				vp_token: signedVpToken,
				...(state != null && { state }),
				presentation_submission: presentation_submission,
			}).toString()
		}

		const uri = presentationOffer.redirect_uri

		const response = await axios.post(uri, data, {
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			maxRedirects: 0,
		})

		if (response.request.responseURL.includes('error')) {
			const presentationOfferObj: AuthorizationRequestResponse = convertUriToObject(
				response.request.responseURL!
			) as any
			const { error, error_description } = presentationOfferObj || {}

			if (error || error_description) {
				throw new Error(error_description?.split('+').join(' ') ?? 'Unknown error occurred')
			}
		}

		return true
	}

	async sendTokenRequest(params: TokenRequest, tokenEndpoint: string) {
		const requestBody = new URLSearchParams(params as any).toString()
		let tokenRequest: TokenResponse
		try {
			const response = await axios.post(tokenEndpoint, requestBody, {
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
			})
			tokenRequest = response.data
			return tokenRequest
		} catch (error: any) {
			throw new Error(
				`${this.t(openIdI18nKeys.ERROR_SENDING_TOKEN_REQUEST)} - ${error.response.data.error_description}`
			)
		}
	}

	async getCredentialRequest({
		accessToken,
		requestedCredential,
		openIdCredentialIssuer,
		jwt,
	}: {
		accessToken: string
		requestedCredential: any
		openIdCredentialIssuer: OpenIdCredentialIssuer
		jwt: any
	}): Promise<CredentialResponse> {
		try {
			const data = JSON.stringify({
				format: requestedCredential.format,
				types: requestedCredential.types,
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
		} catch (error: any) {
			throw new Error(`${this.t(openIdI18nKeys.ERROR_CREDENTIAL)} - ${error.response.data.error_description}`)
		}
	}

	async getDeferredCredentialRequest({
		acceptance_token,
		deferredEndpoint,
	}: {
		acceptance_token: string
		deferredEndpoint: string
	}) {
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
}

const OpenIdService = new OpenId()

export default OpenIdService
