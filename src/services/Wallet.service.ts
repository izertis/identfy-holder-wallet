import 'react-native-get-random-values'
import '@ethersproject/shims'
import { ethers, utils } from 'ethers'
import { WalletSecurityInformation } from '../interfaces/wallet'
import { saveJWKKeys, setKeychainDataObject } from '../utils/keychain'
import { generateDerivationPath, generateWallet } from './derivationPath'
import { derivationPathFormats } from './derivationPath/constants'
import { KeyChainData } from '../types/keychain'
import { ec as EC } from 'elliptic'
import { base64url } from 'jose'

export const createEncryptedWallet = async (pin: string): Promise<WalletSecurityInformation> => {
	const wallet = ethers.Wallet.createRandom()

	const derivationPath = generateDerivationPath(derivationPathFormats.MAIN_IDENTITY)

	const identityWallet = generateWallet(wallet.mnemonic.phrase, derivationPath)

	// Convert seed phrase to hash format
	const seedPhrase = wallet.mnemonic.phrase
	const seedHash = utils.id(seedPhrase)

	if (!identityWallet) throw 'Error, mnemonic is undefined'
	const encryptedWallet = await identityWallet.encrypt(pin)

	const keychainData: KeyChainData = {
		wallet: encryptedWallet,
		mnemonicHash: seedHash,
		privateKey: identityWallet.privateKey,
		pin,
	}
	await setKeychainDataObject(keychainData)

	// Generate JWK from wallet private key
	const secp256k1 = new EC('secp256k1')
	const privateKey = identityWallet.privateKey
	const keyPair = secp256k1.keyFromPrivate(privateKey)
	const x = keyPair.getPublic().getX().toBuffer('be', 32)
	const y = keyPair.getPublic().getY().toBuffer('be', 32)

	const d = keyPair.getPrivate().toBuffer('be', 32)

	const privateKeyHex = keyPair.getPrivate('hex')
	const publicKeyHex = keyPair.getPublic('hex')

	const publicKeyJWK = {
		crv: 'secp256k1',
		kty: 'EC',
		x: base64url.encode(x),
		y: base64url.encode(y),
	}

	const privateKeyJWK = {
		crv: 'secp256k1',
		kty: 'EC',
		d: base64url.encode(d),
		x: base64url.encode(x),
		y: base64url.encode(y),
	}

	await saveJWKKeys(privateKeyJWK, publicKeyJWK, privateKeyHex, publicKeyHex)

	return {
		mnemonicPhrase: wallet.mnemonic.phrase,
		derivationPath,
	}
}
