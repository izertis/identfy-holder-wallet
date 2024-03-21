import {
  derivationPathFormats, // import the format constants for the derivation path
  derivationPathSeetingsDefault, // import the default settings for random path generation
} from './constants'

import {
  concatenateConsecutiveLetters, // import a function to concatenate consecutive letters in a string
  numberToPathValue, // import a function to convert a number to a path value
  generateRandomPathValue, // import a function to generate a path value
} from './functions'

import {
  settingType, // import a custom type representing the settings for generating a derivation path
  validKeysType, // import a custom type representing the valid keys for a derivation path
} from './types'

import Wallet, { hdkey } from 'ethereumjs-wallet'
import { ethers } from 'ethers'
import { getPrivateKey } from '../../utils/keychain'

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
  pathSettings: settingType ={}
) => {
  pathSettings = { ...derivationPathSeetingsDefault, ...pathSettings }
  const keyPathList: validKeysType[] = getPathKeyList(format)
  return keyPathList.map((key: keyof settingType) => formatKey(key, pathSettings)).join('/')
}

/**
 * This function takes a privateKey or a mnemonic, derives the wallet private key based on the provided security path, and returns it.
 * @param {string} param0.privateKey The private key used to derive the security path.
 * @param {string} param0.mnemonic The mnemonic used to derive the security path.
 * @param {string} securityPath The Ethereum derivation path used to derive the private key.
 * @returns {string} The derived private key.
 */
export const getSecurityPrivateKey = (
  { privateKey, mnemonic }: { privateKey?: string; mnemonic?: string },
  securityPath: string
): string | undefined => {
  if (!mnemonic && !privateKey) return undefined
  const configuration = mnemonic ? 'utf8' : 'hex'

  const privateKeyWithoutPrefix = privateKey?.startsWith('0x') ? privateKey?.slice(2) : privateKey
  const masterSeed = privateKey ? privateKeyWithoutPrefix : mnemonic

  const hdwallet = hdkey.fromMasterSeed(Buffer.from(masterSeed || '', configuration))

  const derivedWallet = hdwallet.derivePath(securityPath).getWallet()
  const securityPrivateKey = '0x' + derivedWallet.getPrivateKey().toString('hex')

  return securityPrivateKey
}

/**
 * This function takes a derivation path, derives a new wallet key based on the provided path and returns it. To do so, it uses the main private key stored in the keychain
 * @param {string} derivationPath The Ethereum derivation path used to derive the private key.
 * @returns {string} The derived new wallet.
 */
export const getWalletFromDerivation = async (derivationPath: string): Promise<Wallet | undefined> => {
  const privateKey = await getPrivateKey()
  if (!privateKey) return undefined

  const privateKeyWithoutPrefix = privateKey.startsWith('0x') ? privateKey.slice(2) : privateKey

  const hdwallet = hdkey.fromMasterSeed(Buffer.from(privateKeyWithoutPrefix, 'hex'))

  const derivedHdWallet = hdwallet.derivePath(derivationPath).getWallet()

  return derivedHdWallet
}

/**
 * This function takes a mnemonic and a derivation path, generates the wallet private key, and returns an ethers.js Wallet object.
 * @param {string} mnemonic The mnemonic used to derive the security path and the private key.
 * @param {string} derivationPath The Ethereum derivation path used to derive the private key.
 * @returns {Object} An ethers.js Wallet object.
 */
export const generateWallet = (mnemonic: string, derivationPath: string) => {
  const privateKey = getSecurityPrivateKey({ mnemonic }, derivationPath)

  if (!privateKey) {
    return
  }
  const wallet = new ethers.Wallet(privateKey)

  return wallet
}

const derivationPathUtils = {
  generateDerivationPath,
  generateWallet,
  getWalletFromDerivation,
  derivationPathFormats: derivationPathFormats,
}

export default derivationPathUtils
