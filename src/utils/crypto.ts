import 'react-native-get-random-values'
import '@ethersproject/shims'
import Crypto from 'react-native-quick-crypto'
import { JWK, base64url } from 'jose'
import { computePublicKey } from 'ethers/lib/utils'
import { ec as EC } from 'elliptic'
import bs58 from 'bs58'
import sodium from 'react-native-libsodium'
import { BinaryLike } from 'react-native-quick-crypto/lib/typescript/Utils'
import { hdkey } from 'ethereumjs-wallet'
import { publicToAddress, toChecksumAddress } from 'ethereumjs-util'

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

export const generateRandomHex = (num: number) => {
	//@ts-ignore
	const randomString = Crypto.randomBytes(num).toString('hex')
	return randomString
}

export const getPublicKeyFromPrivateKey = (userPrivateKey: string) => {
	return computePublicKey(userPrivateKey)
}

export const digest = async (algorithm: string, data: any) => {
	const digest = Crypto.createHash(algorithm)
	digest.update(data)
	const result = digest.digest()
	return new Uint8Array(result)
}

export const hashSha256 = async (data: any) => {
	const digest = Crypto.createHash('sha256')
	digest.update(data)
	const result = digest.digest('hex')
	return result
}

export const keyFromJWK = async (jwk: JWK, curveParam: string): Promise<EC.KeyPair> => {
	const curve: EC = new EC(curveParam)
	const keyParams: any = {}
	const hasPub = jwk.x && jwk.y
	if (hasPub) {
		keyParams.pub = {
			x: base64urlDecode(jwk.x as string),
			y: base64urlDecode(jwk.y as string),
		}
	}
	const key = curve.keyPair(keyParams)
	return key
}

export const convertBase58ToHex = (publicKeyBase58: string) => {
	const clave = Buffer.from(bs58.decode(publicKeyBase58)).toString()
	const claveJson = JSON.parse(clave)
	const coordX = claveJson.x.replace('_', '/').replace('-', '+')
	const bufferX = Buffer.from(coordX, 'base64')
	const bufStringX = bufferX.toString('hex')
	const coordY = claveJson.y.replace('_', '/').replace('-', '+')
	const bufferY = Buffer.from(coordY, 'base64')
	const bufStringY = bufferY.toString('hex')
	const hexKey = '0x04' + bufStringX + bufStringY
	return hexKey
}

export async function generateKeyPair(): Promise<{ privateKey: string; publicKey: string }> {
	await sodium.ready
	const keyPair = sodium.crypto_sign_keypair()

	const privateKey = Buffer.from(keyPair.privateKey).toString('hex')
	const publicKey = Buffer.from(keyPair.publicKey).toString('hex')

	return {
		privateKey,
		publicKey,
	}
}

export const encryptData = (data: string, password: BinaryLike) => {
	const cipher = Crypto.createCipher('aes-256-cbc', password)
	let encryptedData = cipher.update(JSON.stringify(data), 'utf8', 'hex')
	encryptedData += cipher.final('hex')
	return encryptedData
}

export const decryptData = (encryptedData: string | ArrayBuffer, password: string): any => {
	try {
		const decipher = Crypto.createDecipher('aes-256-cbc', password)
		let decryptedData = decipher.update(encryptedData, 'hex', 'utf8')
		decryptedData += decipher.final('utf8')
		return JSON.parse(decryptedData as string)
	} catch (error) {
		console.error('Error decrypting data: ' + error)
	}
}

export const selectCurve = (alg: 'ES256' | 'ES256K' | undefined) => {
	if (!alg) {
		throw new Error('Algorithm is undefined')
	}
	const curve = alg === 'ES256' ? 'p256' : 'secp256k1'
	return curve
}

export const getXpubFromEpicDID = (did: string): string | null => {
	const prefix = 'did:epic:quor:redT:'
	if (!did.startsWith(prefix)) {
		console.info('Invalid DID prefix')
		return null
	}

	const remainder = did.substring(prefix.length)

	const [baseKey] = remainder.split('?')

	if (!baseKey) {
		console.error('Invalid DID structure, missing base key')
		return null
	}

	return baseKey
}

export const getEthAddressFromExtenderPublicKey = (issuerDid: any) => {
	const xpub = getXpubFromEpicDID(issuerDid)

	if (!xpub) return

	const wallet = hdkey.fromExtendedKey(xpub!).getWallet()
	const publicKey = wallet.getPublicKey()

	const addressBuffer = publicToAddress(publicKey, true)
	const address = toChecksumAddress(`0x${addressBuffer.toString('hex')}`)

	return address
}
