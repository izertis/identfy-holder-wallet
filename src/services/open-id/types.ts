import { Jwt, JwtHeader, JwtPayload } from 'jsonwebtoken'
import { ModalPropsWithoutIsVisible } from '../../context/Modal.context'

export type ModalType = {
	showModal?: (props?: ModalPropsWithoutIsVisible) => void
	t?: (s: string) => string
	showMessage?: (x: { content: string; type: string }) => void
}

export type Grants = {
	authorization_code: {
		issuer_state: string
	}
	'urn:ietf:params:oauth:grant-type:pre-authorized_code'?: {
		'pre-authorized_code': string
		user_pin_required: boolean
	}
}

export type PreAuthorizeResponse = {
	access_token: string
	token_type: string
	expires_in: number
	id_token: string
	c_nonce: string
	c_nonce_expires_in: number
}

export type CredentialOffer = {
	credential_issuer: string
	credentials: {
		format: string
		types: string[]
		trust_framework: {
			name: string
			type: string
			uri: string
		}
	}[]
	grants: Grants
}

export type PresentationOffer = {
	aud: string
	client_id: string
	exp: number
	iat: number
	iss: string
	nonce: string
	presentation_definition: PresentationDefinition
	redirect_uri: string
	response_mode: string
	response_type: string
	scope: string
	state?: string
}

export type OpenIdCredentialIssuer = {
	credential_issuer: string
	authorization_server: string
	credential_endpoint: string
	deferred_credential_endpoint: string
	credentials_supported: {
		format: string
		types: string[]
		trust_framework: {
			name: string
			type: string
			uri: string
		}
		display: {
			name: string
			locale: string
		}[]
	}[]
}

export type OpenIdConfiguration = {
	redirect_uris: string[]
	issuer: string
	authorization_endpoint: string
	token_endpoint: string
	jwks_uri: string
	scopes_supported: string[]
	response_types_supported: string[]
	response_modes_supported: string[]
	grant_types_supported: string[]
	subject_types_supported: string[]
	id_token_signing_alg_values_supported: string[]
	request_object_signing_alg_values_supported: string[]
	request_parameter_supported: boolean
	request_uri_parameter_supported: boolean
	token_endpoint_auth_methods_supported: string[]
	request_authentication_methods_supported: {
		[key: string]: string[]
	}
	vp_formats_supported: {
		[key: string]: {
			alg_values_supported: string[]
		}
	}
	subject_syntax_types_supported: string[]
	subject_syntax_types_discriminations: string[]
	subject_trust_frameworks_supported: string[]
	id_token_types_supported: string[]
}

export type CredentialResponse = {
	format: 'jwt_vc'
	credential: string
	acceptance_token: string
}

export type AuthorizationRequest = {
	response_type: 'code'
	client_id: string
	redirect_uri: string
	scope: string
	issuer_state?: string
	state?: string
	authorization_details: string
	nonce?: string
	code_challenge?: string
	code_challenge_method?: 'S256' | 'plain'
	client_metadata?: string
}

export type HolderServiceWalletMetadata = {
	authorization_endpoint: string
	response_types_supported: string[]
	vp_formats_supported: {
		jwt_vp: {
			alg_values_supported: string[]
		}
		jwt_vc: {
			alg_values_supported: string[]
		}
	}
	scopes_supported: string[]
	subject_types_supported: string[]
	id_token_signing_alg_values_supported: string[]
	request_object_signing_alg_values_supported: string[]
	subject_syntax_types_supported: string[]
	id_token_types_supported: string[]
}

export type AuthorizationDetail = {
	type: 'openid_credential'
	locations?: string[]
	format: 'jwt_vp' | 'jwt_vc' | string
	types: string[]
}

export type AuthorizationResponse = {
	code: string
	state?: string
}

export type GrantType = 'urn:ietf:params:oauth:grant-type:pre-authorized_code' | 'preauthorized_code'

export type TokenRequest = {
	redirect_uri: string
	grant_type: GrantType
	client_id?: string
	code?: string
	client_assertion_type?: boolean
	code_verifier?: string
	user_pin?: string
	'pre-authorized_code'?: string
}

export type TokenResponse = {
	access_token: string
	refresh_token: string
	token_type: string
	expires_in: number
	id_token: string
	c_nonce: string
	c_nonce_expires_in: number
}

export type VPTokenRequestPayload = {
	iss: string
	aud: string
	exp: number
	response_type: string
	response_mode: string
	client_id: string
	redirect_uri: string
	scope: string
	nonce: string
	presentation_definition_uri: string
}

export type AuthorizationRequestResponse = {
	client_id: string
	key: string
	nonce: string
	redirect_uri: string
	request_uri: string
	response_mode: string
	response_type: string
	scope: string
	presentation_definition: PresentationDefinition
	presentation_definition_uri: string
	request: string
	error: string
	error_description: string
}

export type DeferredCredential = {
	credential_endpoint: string
	acceptance_token: string
}

export type PresentationDefinition = {
	id: string
	format: Format
	input_descriptors: InputDescriptor[]
	purpose?: string
}

type InputDescriptor = {
	id: string
	name?: string
	format?: Format
	constraints?: {
		fields: FieldConstraint[]
	}
}

type FieldConstraint = {
	path: string[]
	filter: {
		type: string
		contains: {
			const: string
		}
	}
}

export type Format = {
	jwt_vc?: {
		alg: string[]
	}
	jwt_vp?: {
		alg: string[]
	}
	jwt_vc_json?: {
		alg: string[]
	}
	jwt_vp_json?: {
		alg: string[]
	}
}

export type TrustedFramework = 'lacchain' | 'alastria' | 'ebsi'

export type CredentialData = {
	id: string
	issuer: string
	validFrom: any
	expirationDate: any
	timestamp?: Date
	credential: Credential
	status: 'Active' | 'Revoked'
}

// CREDENTIALS SCHEMA
export type Vc = {
	'@context': string[]
	id: string
	type: string[]
	credentialSchema: {
		id: string
		type: string
	}
	credentialSubject: {
		id: string
	}
	validFrom?: string // Date timestamp. Example: "2010-01-01T19:23:24Z",
	validUntil?: string // Date timestamp. Example: "2010-01-01T19:23:24Z",
	expirationDate?: string // Date timestamp. Example: "2010-01-01T19:23:24Z",
	issuanceDate: string
	issuer: string
	issued?: string
	credentialStatus?: W3CCredentialStatus
	proof?: EmbeddedProof
	[x: string]: any
}

export interface EmbeddedProof {
	id?: string
	type: string
	proofPurpose: string
	verificationMethod: string
	created?: string // Date timestamp. Example: "2010-01-01T19:23:24Z",
	expires?: string // Date timestamp. Example: "2010-01-01T19:23:24Z",
	domain?: string
	challenge?: string
	proofValue: string
	previousProof?: string | string[]
	nonce?: string
}

export interface W3CCredentialStatus {
	id?: string
	type: string
	[key: string]: any
}

export interface StatusListEntry2021 {
	id: string
	type: 'StatusList2021Entry'
	statusPurpose: 'revocation' | 'suspension'
	statusListIndex: string
	statusListCredential: string
}

export interface StatusListCredentialData {
	id: string
	type: 'StatusList2021'
	statusPurpose: 'revocation' | 'suspension'
	encodedList: string
}

export type Credential = {
	header: JwtHeader
	payload: JwtPayload & {
		vc: Vc
	}
}

export type chosenCredential = {
	format: 'jwt_vc' | 'ldp_vc'
	trust_framework: { name: string; type: string; uri: string }
	types: ['VerifiableCredential', 'VerifiableAttestation', string]
}

export type PresentationData = {
	id: string
	issuer: string
	validFrom: any
	expirationDate: any
	timestamp: Date
	credential: Credential
	status: 'Active' | 'Revoked'
}

export type ActionLog = {
	id: string
	actionType: 'Credential added' | 'Credential expired' | 'Presentation emitted' | 'Presentation revoked'
	issuer: string
	date: Date | string
	data?: any
}
