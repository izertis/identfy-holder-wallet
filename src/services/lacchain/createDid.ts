import { generateKeyPair, getPublicKeyFromPrivateKey } from '../../utils/crypto'
import { getJWKKeys, getPrivateKey, getWalletAddress, saveDID, saveSignatureKeys } from '../../utils/keychain'
import { lacchainDIDBasicConfiguration } from './constants'
import { checkTxExecution } from './utils'
import LacchainDID from './DIDConfig/did'
import { ec as EC } from 'elliptic'
import { base64url } from 'jose'

export const createDidLacchain = async () => {
	const privateKey = await getPrivateKey()
	const address = await getWalletAddress()
	const JWKKeys = await getJWKKeys()

	const curve256 = new EC('p256')
	const p256Keys = curve256.keyFromPrivate(privateKey!.substring(2))
	const x = p256Keys.getPublic().getX().toBuffer('be', 32)
	const y = p256Keys.getPublic().getY().toBuffer('be', 32)

	const p256PublicKeyJWK = {
		crv: 'P-256',
		kty: 'EC',
		x: base64url.encode(x),
		y: base64url.encode(y),
	}

	try {
		const did = new LacchainDID({
			...lacchainDIDBasicConfiguration,
			address: `0x${address}`,
			controllerPrivateKey: privateKey,
		})

		const id = did?.id

		const receiptVerification = await did.addVerificationMethod({
			type: 'vm',
			algorithm: 'jwk',
			encoding: 'base58',
			publicKey: JSON.stringify(JWKKeys?.publicKeyJWK),
			controller: did.id,
			expiration: 31536000,
		})

		const receiptVerification2 = await did.addVerificationMethod({
			type: 'vm',
			algorithm: 'jwk',
			encoding: 'base58',
			publicKey: JSON.stringify(p256PublicKeyJWK),
			controller: did.id,
			expiration: 31536000,
		})

		const didDocument = await did.getDocument()

		const receiptAuthentication = await did.addAuthenticationMethod({
			type: 'auth',
			algorithm: 'esecp256k1vk',
			encoding: 'hex',
			publicKey: `${getPublicKeyFromPrivateKey(privateKey!)}`,
			controller: did.id,
			expiration: 31536000,
		})
		//TODO
		// Add second authentication method including the generated p256 key

		const receiptAssertion = await did.bindAssertionMethod(
			didDocument.verificationMethod[didDocument.verificationMethod.length - 2].id
		)

		const signatureKeys = await generateKeyPair()

		await saveSignatureKeys(signatureKeys)

		const receiptKeyAgreement = await did.addKeyAgreement({
			type: 'keya',
			algorithm: 'x25519ka',
			encoding: 'hex',
			publicKey: `0x${signatureKeys.publicKey}`,
			controller: did.id,
		})

		const receiptKeyAgreement2 = await did.bindKeyAgreement(
			didDocument.verificationMethod[didDocument.verificationMethod.length - 2].id
		)

		await Promise.all([
			checkTxExecution(receiptVerification, did.registry.registry),
			checkTxExecution(receiptVerification2, did.registry.registry),
			checkTxExecution(receiptAuthentication, did.registry.registry),
			checkTxExecution(receiptAssertion, did.registry.registry),
			checkTxExecution(receiptKeyAgreement, did.registry.registry),
			checkTxExecution(receiptKeyAgreement2, did.registry.registry),
		])

		await saveDID(id, 'lacchain')
	} catch (error) {
		console.error(`An error ocurred creating LACchain DID:`, error)
		throw error
	}
}
