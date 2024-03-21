import '@ethersproject/shims'
import { BNInput, ec as EC } from 'elliptic'
import { base64url } from 'jose'
import { sha256 } from 'ethereumjs-util'
import { bufferFromUtf8 } from './string'
import { utils as ethersUtils } from 'ethers'
import ebsiI18nKeys from '../services/Ebsi/i18n/keys'

type SignConfig = {
	publicKey?: string
	privateKey?: string
}

export function base64urlEncode(str: string | number[] | Uint8Array | Buffer) {
	let data: string | Uint8Array = str as any
	if (typeof str === typeof []) {
		data = Uint8Array.from(str as number[])
	}
	return base64url.encode(data)
}

export function base64urlDecode(derSign: string | number[] | Uint8Array) {
	let data: string | Uint8Array = derSign as any
	if (typeof derSign === typeof []) {
		data = Uint8Array.from(derSign as number[])
	}
	return base64url.decode(data)
}

const hashDigestSha256 = (token: string) => {
	const tokenBuffer = bufferFromUtf8(token)
	const sha256Hash = ethersUtils.sha256(tokenBuffer).substring(2) as BNInput
	return sha256Hash
}

const signWithP256 = async (dataBuffer: BNInput, { privateKey, publicKey }: SignConfig = {}) => {
	var ec = new EC('p256')
	let key
	if (privateKey) {
		key = ec.keyFromPrivate(privateKey.substring(2) as string)
	} else if (publicKey) {
		key = ec.keyFromPublic(publicKey.substring(2) as string)
	} else {
		key = ec.genKeyPair()
	}
	// Generate keys
	// Sign the message's hash (input must be an array, or a hex-string)
	var signature = key.sign(dataBuffer)

	// Random invalid hex string error posibly here
	const signatureR = signature.r.toString(16)
	const signatureS = signature.s.toString(16)
	const signUnencoded = signatureR.concat(signatureS)
	const sign = base64urlEncode(Buffer.from(signUnencoded, 'hex'))
	return sign
}

const sign = async (token: any, config?: SignConfig) => {
	const hashDigest = hashDigestSha256(token)
	const sign = await signWithP256(hashDigest, config)
	return sign
}

export type HeaderJWT = {
	alg: 'ES256' | 'RS256'
	typ: string
	kid?: string
}

export const signJWT = async ({
	header = {
		alg: 'ES256',
		typ: 'JWT',
	},
	payload,
	privateKey,
}: {
	header?: HeaderJWT
	payload: any
	privateKey: string | null
}) => {
	if (!privateKey) {
		throw ebsiI18nKeys.ERROR_NO_PRIVATE_KEY
	}
	try {
		const segments = []

		segments.push(base64urlEncode(bufferFromUtf8(JSON.stringify(header))))
		segments.push(base64urlEncode(bufferFromUtf8(JSON.stringify(payload))))
		segments.push(await sign(segments.join('.'), { privateKey }))

		return segments.join('.')
	} catch (error) {
		console.error('Error signing JWT - jwt utils:', error)
		throw error
	}
}

export const verifyJwt = async (token: any, key?: any) => {
	const [header, payload, signature] = token.split('.')
	const tokenUnsigned = `${header}.${payload}`

	const signPayload = sha256(Buffer.from(tokenUnsigned, 'utf-8'))
	const base64Signature = base64urlDecode(signature)
	const r = base64Signature.slice(0, 32)
	const s = base64Signature.slice(32)
	var ec = new EC('p256')
	return ec.verify(signPayload, { r, s }, key)
}
