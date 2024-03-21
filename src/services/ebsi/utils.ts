import { SignJWT as SignJWTJose, decodeJwt } from 'jose'
import { parseJwt } from '../../utils/crypto'
import { HooksEbsi, VPTokenRequestPayload } from './types'
import ebsiI18nKeys from './i18n/keys'
import dayjs from 'dayjs'
import { ec as EC } from 'elliptic'
import { signJWT, verifyJwt } from '../../utils/jwt'
import { validateObject } from '../../utils/utils'
import { getDid, getPrivateKey } from '../../utils/keychain'
import { v4 as uuidv4 } from 'uuid'

const validateTokenRequest = async (
	{
		tokenRequest,
		credential_issuer,
		authorization_server,
	}: {
		tokenRequest: string
		credential_issuer: string
		authorization_server: string
	},
	key: EC.KeyPair
) => {
	try {
		const verify = await verifyJwt(tokenRequest, key)
		if (!verify) throw ebsiI18nKeys.ERROR_VALIDATION_JWT
		const JWTPayload = decodeJwt(tokenRequest)

		const isCorrectGeneralFormat = validateObject(JWTPayload, {
			aud: await getDid('ebsi'),
			response_mode: 'direct_post',
			response_type: JWTPayload.response_type ?? 'id_token',
			client_id: JWTPayload.iss,
			scope: 'openid',
		})
		const isCorrectIssA = validateObject(JWTPayload, {
			iss: credential_issuer,
		})
		const isCorrectIssB = validateObject(JWTPayload, {
			iss: authorization_server,
		})
		const isCorrectFormat = isCorrectGeneralFormat && (isCorrectIssA || isCorrectIssB)
		if (!isCorrectFormat) throw ebsiI18nKeys.ERROR_VALIDATION_JWT
		const expiresJWT = JWTPayload.exp
		const currentUnixDate = dayjs().unix() / 1000
		if (expiresJWT && expiresJWT < currentUnixDate) {
			throw ebsiI18nKeys.ERROR_VALIDATION_JWT
		}
	} catch (error) {
		throw ebsiI18nKeys.ERROR_VALIDATION_JWT
	}
}

const generateJWT = async (idTokenRequest: string, authorizationServer: string, extraPayload: any = {}) => {
	const JWTPayload = decodeJwt(idTokenRequest)
	const holder = {
		did: JWTPayload.aud?.toLocaleString() || '',
	}
	const header = {
		typ: 'JWT',
		alg: 'ES256',
		kid: holder.did,
	}
	const payload = {
		nonce: JWTPayload.nonce,
		...extraPayload,
	}

	const jwt: any = await new SignJWTJose(payload)
		.setProtectedHeader(header)
		.setIssuedAt()
		.setIssuer(holder.did)
		.setSubject(holder.did)
		.setAudience(authorizationServer)
		.setNotBefore(Math.floor(Date.now() / 1000))
		.setExpirationTime('15m')

	return jwt
}

export const getHeaderKidFromDid = (did: string) => {
	return `${did}#${did.split('did:key:').join('')}`
}

export const createTokenResponse = async (
	{
		credential_issuer,
		tokenRequest,
		authorization_server,
		extra_payload,
	}: {
		credential_issuer: string
		tokenRequest: string
		authorization_server: string
		extra_payload?: any
	},
	key: EC.KeyPair
) => {
	const privateKey = await getPrivateKey()
	// Validate that Jwt and Jwk are correct
	authorization_server &&
		(await validateTokenRequest(
			{
				tokenRequest,
				credential_issuer,
				authorization_server,
			},
			key
		))

	// Sign a Jwt token with jwt_request and credential_issuer data
	let { _protectedHeader: header, _payload: payload } = await generateJWT(
		tokenRequest,
		authorization_server,
		extra_payload
	)

	header = { ...header, kid: getHeaderKidFromDid(header.kid) }
	const signedToken = await signJWT({ header, payload, privateKey })

	return { signedToken, header }
}

const getVpRequestFromVerifiableCredentials = ({
	holder,
	verifiableCredential,
}: {
	holder: string
	verifiableCredential: string[]
}) => {
	return {
		'@context': ['https://www.w3.org/2018/credentials/v1'],
		id: `urn:uuid:${uuidv4()}`,
		type: ['VerifiablePresentation'],
		holder,
		verifiableCredential,
	}
}

export const createVpTokenResponse = async (
	{
		vpTokenRequest,
		credential_issuer,
		authorization_server,
		verifiableCredential,
	}: {
		vpTokenRequest: string
		credential_issuer: string
		authorization_server: string
		verifiableCredential: string[]
	},
	key: EC.KeyPair
) => {
	// Validate that Jwt and Jwk are correct
	const vpPayload: VPTokenRequestPayload = parseJwt(vpTokenRequest)
	const vp = getVpRequestFromVerifiableCredentials({
		holder: vpPayload.aud ?? '',
		verifiableCredential,
	})
	const signedToken = await createTokenResponse(
		{
			tokenRequest: vpTokenRequest,
			credential_issuer,
			authorization_server,
			extra_payload: { vp },
		},
		key
	)

	return signedToken
}

export const messageSuccess = ({ showMessage, t }: HooksEbsi) => {
	showMessage?.({
		content: t?.(ebsiI18nKeys.SUCCESS) as string,
		type: 'success',
	})
}

export const messageError = (errorMessage: string, { showMessage, t }: HooksEbsi) => {
	showMessage?.({
		content: t?.(`${errorMessage}`) as string,
		type: 'error',
	})
}
