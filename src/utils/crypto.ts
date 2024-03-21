import '@ethersproject/shims'
import crypto from 'react-native-crypto'
import { JWK } from 'jose'
import { computePublicKey } from 'ethers/lib/utils'
import { ec as EC } from 'elliptic'
import { base64urlDecode } from './jwt'
import bs58 from 'bs58'
import sodium from 'react-native-libsodium'

export const generateRandomHex = (num: number) => {
	const randomString = crypto.randomBytes(num).toString('hex')
	return randomString
}

export const getPublicKeyFromPrivateKey = (userPrivateKey: string) => {
	return computePublicKey(userPrivateKey)
}

export const digest = async (algorithm: string, data: any) => {
	const digest = crypto.createHash(algorithm)
	digest.update(data)
	const result = digest.digest()
	return new Uint8Array(result)
}

export const hashSha256 = async (data: any) => {
	const digest = crypto.createHash('sha256')
	digest.update(data)
	const result = digest.digest('hex')
	return result
}

export function parseJwt(token: string) {
	return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString())
}

export const keyFromJWK = async (jwk: JWK): Promise<EC.KeyPair> => {
	var curve = new EC('p256')
	var keyParams: any = {}
	var hasPub = jwk.x && jwk.y
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

/**
 * Generate a cryptographic key pair using the Sodium library.
 *
 * This function asynchronously generates a key pair suitable for cryptographic
 * signing and verification. It returns a public key and a private key in
 * hexadecimal format.
 *
 * @returns {Promise<{ publicKey: string; privateKey: string }>} A promise that
 * resolves to an object containing the public and private keys.
 */
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
