import { ModalPropsWithoutIsVisible } from '../../context/Modal.context'

export type HooksEbsi = {
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
		user_pin_required: boolean | string
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
	state: string
}

export type IDTokenRequest = {
	ebsiDid: string | null
	code: string
	verifier: string
	tokenEndpoint: string
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

export type RedirectionInfo = {
	client_id: string
	key: string
	nonce: string
	redirect_uri: string
	request_uri: string
	response_mode: string
	response_type: string
	scope: string
	presentation_definition: string
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
}

type InputDescriptor = {
	id: string
	constraints: {
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

type Format = {
	jwt_vc: {
		alg: string[]
	}
	jwt_vp: {
		alg: string[]
	}
}
