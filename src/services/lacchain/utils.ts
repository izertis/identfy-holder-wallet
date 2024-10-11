import 'react-native-get-random-values'
import '@ethersproject/shims'
import elliptic from 'elliptic'
import ethutils from 'ethereumjs-util'
import bs58 from 'bs58'
import { lacchainDIDBasicConfiguration } from './constants'
import { Contract } from 'ethers'
import { GasModelProvider } from '@lacchain/gas-model-provider'
import * as eccryptoJS from 'eccrypto-js'

const gProvider = new GasModelProvider(lacchainDIDBasicConfiguration.rpcUrl)

/**
 * Create a key pair using the secp256k1 algorithm.
 * @returns {Object} An object containing the address, publicKey, and privateKey.
 */
export function createKeyPair(): { address: string; publicKey: string; privateKey: string } {
	const secp256k1 = new elliptic.ec('secp256k1')
	const kp = secp256k1.genKeyPair()
	const publicKey = kp.getPublic('hex')
	const privateKey = kp.getPrivate('hex')
	const address = toEthereumAddress(publicKey)
	return { address, publicKey, privateKey }
}

export function toEthereumAddress(hexPublicKey: string) {
	return `0x${ethutils
		.keccak256(Buffer.from(hexPublicKey.slice(2), 'hex'))
		.slice(-20)
		.toString('hex')}`
}

export function stripHexPrefix(str: string) {
	return str.startsWith('0x') ? str.slice(2) : str
}

export function leftPad(data: any, size = 64) {
	if (data.length === size) return data
	return '0'.repeat(size - data.length) + data
}

export async function signData(identity: any, key: any, data: any, nonce: any, registry: any) {
	//@ts-ignore
	const paddedNonce = leftPad(Buffer.from([nonce], 64).toString('hex'))
	const dataToSign = `1900${stripHexPrefix(registry)}${paddedNonce}${stripHexPrefix(identity)}${data}`
	//@ts-ignore
	const hash = Buffer.from(ethutils.sha3(Buffer.from(dataToSign, 'hex')))
	const signature = ethutils.ecsign(hash, Buffer.from(key, 'hex'))
	return {
		r: `0x${signature.r.toString('hex')}`,
		s: `0x${signature.s.toString('hex')}`,
		v: signature.v,
	}
}

export function stringToBytes32(str: string) {
	const buffstr = '0x' + Buffer.from(str).slice(0, 32).toString('hex')
	return buffstr + '0'.repeat(66 - buffstr.length)
}

export function stringToBytes(str: string) {
	return '0x' + Buffer.from(str).toString('hex')
}

export function bytes32toString(bytes32: any) {
	return Buffer.from(bytes32.slice(2), 'hex').toString('utf8').replace(/\0+$/, '')
}

type Parts = {
	did: string
	method: string
	network: string
	id: string
	path?: string
	fragment?: string
}

export function parseDID(did: string) {
	if (did === '') throw new Error('Missing DID')
	const sections = did.match(/^did:([a-zA-Z0-9_]+):([a-zA-Z0-9_]+):([:[a-zA-Z0-9_.-]+)(\/[^#]*)?(#.*)?$/)
	if (sections) {
		const parts: Parts = {
			did: sections[0],
			method: sections[1],
			network: sections[2],
			id: `0x${sections[3]}`,
		}
		if (sections[4]) parts.path = sections[4]
		if (sections[5]) parts.fragment = sections[5].slice(1)
		return parts
	}
	throw new Error('Invalid DID')
}

export function getRelationship(verificationMethods: any, relationships: any) {
	return relationships
		.map((relationship: any) => verificationMethods.find((vm: any) => vm.id === relationship))
		.filter((vm: any) => vm)
}

export function getExistingMethods(verificationMethods: any, relationships: any) {
	return relationships.filter((relationship: any) => verificationMethods.find((vm: any) => vm.id === relationship))
}

export function attributeToHex(key: string, value: any) {
	const match = key.match(/(vm|auth|asse|keya|dele|invo|svc)\/(\w+)?\/(\w+)?\/(\w+)?$/)
	if (match) {
		const encoding = match[4]
		if (encoding === 'base64') {
			return `0x${Buffer.from(value, 'base64').toString('hex')}`
		} else if (encoding === 'base58') {
			//@ts-ignore
			return `0x${bs58.decode(value).toString('hex')}`
		}
	}
	if (value.match(/^0x[0-9a-fA-F]*$/)) {
		return value
	}
	return `0x${Buffer.from(value).toString('hex')}`
}

export const keyAlgorithms = {
	jwk: 'JsonWebKey2020',
	esecp256k1vk: 'EcdsaSecp256k1VerificationKey2019',
	esecp256k1rm: 'EcdsaSecp256k1RecoveryMethod2020',
	edd25519vk: 'Ed25519VerificationKey2018',
	gpgvk: 'GpgVerificationKey2020',
	rsavk: 'RsaVerificationKey2018',
	x25519ka: 'X25519KeyAgreementKey2019',
	ssecp256k1vk: 'SchnorrSecp256k1VerificationKey2019',
}

export const checkTxExecution = async (receipt: any, contract: Contract) => {
	try {
		const events = await contract.queryFilter(
			contract.filters.DIDAttributeChanged(receipt.from),
			receipt.blockNumber,
			receipt.blockNumber
		)

		if (events.length > 0) {
			return { executed: true }
		} else {
			throw new Error('No events found')
		}
	} catch (error) {
		throw error
	}
}

const formatMailboxMessage = (input: any): eccryptoJS.Encrypted => {
	return {
		ciphertext: Buffer.from(input.ciphertext.data),
		ephemPublicKey: Buffer.from(input.ephemPublicKey.data),
		iv: Buffer.from(input.iv.data),
		mac: Buffer.from(input.mac.data),
	}
}

export const decryptMailboxMessages = async (privateKeyBuffer: Buffer, encryptedMessages: any) => {
	const decryptedAndFormattedMessages = []

	for (const encryptedMessage of encryptedMessages) {
		const formattedMessage = formatMailboxMessage(encryptedMessage)
		const decryptedData = await eccryptoJS.decrypt(privateKeyBuffer, formattedMessage)
		const data = decryptedData.toString() as any
		decryptedAndFormattedMessages.push(data)
	}

	return decryptedAndFormattedMessages
}
