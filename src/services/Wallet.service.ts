import { WalletSecurityInformation } from '../interfaces/wallet'
import { saveJWKKeys, setKeychainDataObject } from '../utils/keychain'
import { derivationPathFormats } from './hd-wallets/constants'
import { KeyChainData } from '../types/keychain'
import { ec as EC } from 'elliptic'
import { base64url } from 'jose'
import { generateMnemonic } from '@dreson4/react-native-quick-bip39'
import { encryptData } from '../utils/crypto'
import LocalStorageService, { STORAGE_KEYS } from './LocalStorage.service'
import { generateDerivationPath, generateIdentityWallet } from './hd-wallets'

export const createEncryptedWallet = async (pin: string): Promise<WalletSecurityInformation> => {
	const mnemonic = generateMnemonic()

	const derivationPath = generateDerivationPath(derivationPathFormats.MAIN_IDENTITY)
	const identityWallet = generateIdentityWallet(mnemonic, derivationPath)

	if (!identityWallet) throw 'Error, mnemonic is undefined'

	const walletPrivateKey = identityWallet.getPrivateKeyString()

	const encryptedWalletPrivateKey = encryptData(walletPrivateKey, pin)

	const keychainData: KeyChainData = {
		encryptedPrivateKey: encryptedWalletPrivateKey,
	}
	await setKeychainDataObject(keychainData)

	// TO DO: When we remove all unnecessary information from the keychain, do not store the PIN. The user will need to enter the PIN every time they want to use the private key.
	await LocalStorageService.storeData(STORAGE_KEYS.PIN, pin)

	// Generate JWK from wallet private key
	const secp256k1 = new EC('secp256k1')
	const keyPair = secp256k1.keyFromPrivate(walletPrivateKey.substring(2))
	const x = keyPair.getPublic().getX().toBuffer('be', 32)
	const y = keyPair.getPublic().getY().toBuffer('be', 32)

	const d = keyPair.getPrivate().toBuffer('be', 32)

	const privateKeyHex = d.toString('hex')
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
		mnemonicPhrase: mnemonic,
		derivationPath,
	}
}
