import 'react-native-get-random-values'
import '@ethersproject/shims'
import { BNInput, ec as EC } from 'elliptic'
import { sha256 } from 'ethereumjs-util'
import { bufferFromUtf8 } from './string'
import { utils as ethersUtils } from 'ethers'
import openIdI18nKeys from '../services/i18n/keys'
import { base64urlDecode, base64urlEncode, selectCurve } from './crypto'
import { getAlastriaSignerConfig } from '../services/alastria/signer'
import { Resolver } from 'did-resolver'
import { getResolver as getEpicResolver } from '../services/alastria/did-resolver/resolver'
import { getResolver as getEbsiResolver } from '@cef-ebsi/key-did-resolver'
import jwt from 'jsonwebtoken'

type SignConfig = {
	publicKey?: string
	privateKey?: string
}

const hashDigestSha256 = (token: string) => {
	const tokenBuffer = bufferFromUtf8(token)
	const sha256Hash = ethersUtils.sha256(tokenBuffer).substring(2) as BNInput
	return sha256Hash
}

const signatureCurve = async (
	dataBuffer: BNInput,
	alg?: 'ES256' | 'ES256K',
	{ privateKey, publicKey }: SignConfig = {}
) => {
	const curveName = selectCurve(alg)
	const ec = new EC(curveName)
	let key
	if (privateKey) {
		key = ec.keyFromPrivate(privateKey.substring(2) as string)
	} else if (publicKey) {
		key = ec.keyFromPublic(publicKey.substring(2) as string)
	} else {
		key = ec.genKeyPair()
	}

	const signature = key.sign(dataBuffer)
	const signUnencoded = Buffer.concat([
		signature.r.toArrayLike(Buffer, 'be', 32),
		signature.s.toArrayLike(Buffer, 'be', 32),
	])
	const sign = base64urlEncode(signUnencoded)

	return sign
}

const sign = async (token: any, alg?: 'ES256' | 'ES256K', config?: SignConfig) => {
	const hashDigest = hashDigestSha256(token)
	const sign = await signatureCurve(hashDigest, alg, config)
	return sign
}

export type HeaderJWT = {
	alg?: 'ES256' | 'ES256K'
	typ: 'JWT' | string
	kid?: string
}

export const signJWT = async ({
	header = {
		typ: 'JWT',
	},
	trustedFramework,
	payload,
	privateKey: providedPrivateKey,
}: {
	header?: HeaderJWT
	trustedFramework?: string
	payload: any
	privateKey: string | null
}) => {
	if (!providedPrivateKey) {
		throw openIdI18nKeys.ERROR_NO_PRIVATE_KEY
	}
	let privateKey

	// TODO: Refactor | with EPIC flow, update alg and claims adding didUrl and privateKey with ddpp applied
	const epicResolver = new Resolver({ ...getEpicResolver() })
	const ebsiResolver = new Resolver({ ...getEbsiResolver() })

	if (trustedFramework === 'epic') {
		const resolvedEpicDid = (await epicResolver.resolve(header.kid!)).didDocument?.verificationMethod![0].id
		const alastriaConfig = await getAlastriaSignerConfig(providedPrivateKey, resolvedEpicDid)

		header.alg = 'ES256K'
		header.kid = alastriaConfig.composedDid
		payload.iss = alastriaConfig.composedDid
		payload.sub = alastriaConfig.composedDid

		if (payload.vp) {
			payload.vp.holder = alastriaConfig.composedDid
		}

		privateKey = alastriaConfig.secret
	} else if (trustedFramework === 'ebsi') {
		header.alg = 'ES256'
		privateKey = providedPrivateKey
		if (header.kid) {
			header.kid = (await ebsiResolver.resolve(header.kid)).didDocument?.verificationMethod![0].id
		}
		// TODO: Get Lacchain's trusted framework for PuntaCana match
	} else {
		header.alg = 'ES256'
		privateKey = providedPrivateKey
		header.kid
	}

	try {
		const segments = []
		const alg = header.alg

		segments.push(base64urlEncode(bufferFromUtf8(JSON.stringify(header))))
		segments.push(base64urlEncode(bufferFromUtf8(JSON.stringify(payload))))
		segments.push(await sign(segments.join('.'), alg, { privateKey }))

		return segments.join('.')
	} catch (error) {
		console.error('Error signing JWT -', error)
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

	const decodedHeader = JSON.parse(Buffer.from(header, 'base64').toString('utf-8'))
	const alg = decodedHeader.alg
	const curve = selectCurve(alg)
	var ec = new EC(curve)

	return ec.verify(signPayload, { r, s }, key)
}

export const isJWT = (token: string): boolean => {
	try {
		const decoded = jwt.decode(token, { complete: true })
		return !!decoded
	} catch (error) {
		return false
	}
}
