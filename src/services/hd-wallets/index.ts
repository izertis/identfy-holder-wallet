import Wallet, { hdkey } from 'ethereumjs-wallet'
import { derivationPathFormats, derivationPathSeetingsDefault } from './constants'
import { generateRandomPathValue, numberToPathValue, concatenateConsecutiveLetters } from './functions'
import { validKeysType, settingType } from './types'

/**
 * This function formats a key in a derivation path according to the given settings.
 * @param key - A valid key for a derivation path.
 * @param settings - The settings for generating the derivation path.
 * @returns The formatted path value for the given key.
 */
const formatKey = (key: validKeysType, settings: settingType) => {
	const settingKeyValue = settings[key]
	let pathValue
	if (key === 'm') {
		pathValue = key
	} else if (settingKeyValue === 'random') {
		pathValue = generateRandomPathValue(key)
	} else if (settingKeyValue === undefined) {
		throw `${key} is not defined`
	} else {
		pathValue = numberToPathValue(settingKeyValue)
	}

	return pathValue
}

/**
 * This function gets a list of keys in a derivation path format.
 * @param format - The format of the derivation path.
 * @returns An array of valid keys for the derivation path.
 */
const getPathKeyList = (format: derivationPathFormats) => {
	const path = concatenateConsecutiveLetters(format)
	return path.map((pathKey) => pathKey as validKeysType)
}

/**
 * This function generates a derivation path format. If no argument is passed it will generate a security derivation path.
 * @param format (optional) - The format of the derivation path.
 * @returns A string representation of the generated derivation path.
 */
export const generateDerivationPath = (
	format: derivationPathFormats = derivationPathFormats.MAIN_IDENTITY,
	pathSettings: settingType = {}
) => {
	pathSettings = { ...derivationPathSeetingsDefault, ...pathSettings }
	const keyPathList: validKeysType[] = getPathKeyList(format)
	return keyPathList.map((key: keyof settingType) => formatKey(key, pathSettings)).join('/')
}

/**
 * This function takes a derivation path and a private key, derives an HD wallet key based on the provided path and private key, and returns it.
 * @param {string} privateKey The private key used to derive the HD wallet key.
 * @param {string} derivationPath The Ethereum derivation path used to derive the new wallet.
 * @returns {Promise<hdkey | undefined>} The derived HD wallet.
 */
export const getWalletFromDerivation = async (
	privateKey: string,
	derivationPath: string
): Promise<hdkey | undefined> => {
	if (!privateKey) return undefined

	const privateKeyWithoutPrefix = privateKey.startsWith('0x') ? privateKey.slice(2) : privateKey

	const hdwallet = hdkey.fromMasterSeed(Buffer.from(privateKeyWithoutPrefix, 'hex'))
	const derivedHdWallet = hdwallet.derivePath(derivationPath)

	return derivedHdWallet
}

/**
 * Composes a DID derivation path based on the provided DID and derivation path.
 * @param {any} did The DID (Decentralized Identifier) to be included in the composed path.
 * @param {string} derivationPath The Ethereum derivation path to be included in the composed path.
 * @returns {string} The composed DID derivation path.
 */
export const composeDidDerivationPath = (did: any, derivationPath: string): string => {
	if (did.includes('#')) did.split('#')[0]
	if (did.includes('dp=')) {
		return `${did}/${derivationPath.substring(2)}`
	} else {
		return `${did}?dp=${derivationPath}`
	}
}

/**
 * Generates an identity wallet based on the provided mnemonic and security path.
 * @param {string} mnemonic The mnemonic used to generate the identity wallet.
 * @param {string} securityPath The security path used to derive the identity wallet.
 * @returns {Wallet | undefined} The generated identity wallet.
 */
export const generateIdentityWallet = (mnemonic: string, securityPath: string): Wallet | undefined => {
	if (!mnemonic) return undefined

	const hdwallet = hdkey.fromMasterSeed(Buffer.from(mnemonic))
	const derivedWallet = hdwallet.derivePath(securityPath).getWallet()

	return derivedWallet
}
