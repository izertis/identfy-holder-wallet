import * as Keychain from 'react-native-keychain'
import LocalStorageService, { STORAGE_KEYS } from '../services/LocalStorage.service'
import { decryptData } from './crypto'
import { DeferredCredential } from '../services/open-id/types'
import { ActionLog, CredentialData, PresentationData, TrustedFramework } from '../services/open-id/types'
import OpenIdService from '../services/OpenId.service'
import { KeyChainData } from '../types/keychain'
import { decodeJwt } from 'jose'

const noKeychainError = 'No keychain stored'

export const setKeychainDataObject = async (data: KeyChainData): Promise<Keychain.Result | null | false> => {
	return await Keychain.setGenericPassword('VaccinesData', JSON.stringify(data)).catch(() => null)
}

export const getKeychainDataObject = async (): Promise<KeyChainData | null> => {
	try {
		const credentials = await Keychain.getGenericPassword()

		if (credentials) {
			return JSON.parse(credentials.password)
		} else {
			console.warn('No credentials stored')
			return null
		}
	} catch (error) {
		return null
	}
}

export const checkPin = async (pin: string): Promise<boolean> => {
	try {
		const keyChainDataObject = await getKeychainDataObject()
		const encryptedKey = keyChainDataObject?.encryptedPrivateKey

		if (!encryptedKey) return false

		const isDecryptionSuccessful = decryptData(encryptedKey, pin)

		return !!isDecryptionSuccessful
	} catch (error) {
		console.error(error)
		return false
	}
}

export const getPrivateKey = async (): Promise<string | null> => {
	const LocalPin = await LocalStorageService.getData(STORAGE_KEYS.PIN)
	const keyChainDataObject = await getKeychainDataObject()

	const encryptedKey = keyChainDataObject?.encryptedPrivateKey

	if (!encryptedKey) return null

	const decrypted = decryptData(encryptedKey, LocalPin)
	return decrypted
}

// JWK KEYPAIR FROM WALLET KEYS
export const saveJWKKeys = async (privateKeyJWK: any, publicKeyJWK: any, privateKeyHex: any, publicKeyHex: any) => {
	const keyChainDataObject = await getKeychainDataObject()
	if (!keyChainDataObject) {
		return null
	}

	const JWKprivateKeyJSON = JSON.stringify(privateKeyJWK)
	const JWKpublicKeyJSON = JSON.stringify(publicKeyJWK)
	const HexPrivateKeyJSON = JSON.stringify(privateKeyHex)
	const HexPublicKeyJSON = JSON.stringify(publicKeyHex)

	keyChainDataObject.JWKKeys = {
		privateKeyJWK: JWKprivateKeyJSON,
		publicKeyJWK: JWKpublicKeyJSON,
		privateKeyHex: HexPrivateKeyJSON,
		publicKeyHex: HexPublicKeyJSON,
	}

	await setKeychainDataObject(keyChainDataObject)
	return keyChainDataObject.JWKKeys
}

export const getJWKKeys = async (): Promise<{
	privateKeyJWK: any
	publicKeyJWK: any
	privateKeyHex: string
	publicKeyHex: string
} | null> => {
	const keyChainDataObject = await getKeychainDataObject()

	if (!keyChainDataObject || !keyChainDataObject.JWKKeys) {
		return null
	}

	const privateKeyJWK = JSON.parse(keyChainDataObject.JWKKeys.privateKeyJWK)
	const publicKeyJWK = JSON.parse(keyChainDataObject.JWKKeys.publicKeyJWK)
	const privateKeyHex = JSON.parse(keyChainDataObject.JWKKeys.privateKeyHex)
	const publicKeyHex = JSON.parse(keyChainDataObject.JWKKeys.publicKeyHex)

	return {
		privateKeyJWK: privateKeyJWK,
		publicKeyJWK: publicKeyJWK,
		privateKeyHex: privateKeyHex,
		publicKeyHex: publicKeyHex,
	}
}

// Second keypair for transaction signing
export const saveSignatureKeys = async (keyPair: { privateKey: string; publicKey: string }) => {
	const keyChainDataObject = await getKeychainDataObject()
	if (!keyChainDataObject) {
		return null
	}

	keyChainDataObject.signatureKeyPair = keyPair

	await setKeychainDataObject(keyChainDataObject)
	return keyChainDataObject.signatureKeyPair
}

export const getSignatureKeys = async (): Promise<{ privateKey: string; publicKey: string } | null> => {
	const keyChainDataObject = await getKeychainDataObject()

	if (!keyChainDataObject || !keyChainDataObject.signatureKeyPair) {
		return null
	}

	return keyChainDataObject.signatureKeyPair
}

export const saveDID = async (did: string, framework: TrustedFramework): Promise<boolean> => {
	const keyChainDataObject = await getKeychainDataObject()

	if (!keyChainDataObject || !did) {
		return false
	}
	if (!keyChainDataObject.did) {
		keyChainDataObject.did = {}
	}

	keyChainDataObject.did[framework] = did

	await setKeychainDataObject(keyChainDataObject)
	await LocalStorageService.storeBool(STORAGE_KEYS.IS_DID_CREATED, true)
	return true
}

export const getDid = async (framework: TrustedFramework): Promise<string | null> => {
	const keyChainDataObject = await getKeychainDataObject()

	if (!keyChainDataObject) {
		return null
	}

	const did = keyChainDataObject.did?.[framework]

	if (did === null || did === undefined) {
		throw new Error(`No existe un DID para ${framework}, por favor crea uno`)
	}

	return did
}

export const getDidList = async (): Promise<Array<{ network: string; entity: string; did: string | undefined }>> => {
	const keyChainDataObject = await getKeychainDataObject()
	const didList = []

	if (keyChainDataObject?.did) {
		if (keyChainDataObject.did.alastria) {
			didList.push({
				network: 'Red T',
				entity: 'alastria',
				did: keyChainDataObject.did.alastria,
			})
		}

		if (keyChainDataObject.did.lacchain) {
			didList.push({
				network: 'main',
				entity: 'lacchain',
				did: keyChainDataObject.did.lacchain,
			})
		}

		if (keyChainDataObject.did.ebsi) {
			didList.push({
				network: 'main',
				entity: 'ebsi',
				did: keyChainDataObject.did.ebsi,
			})
		}
	}

	return didList
}

// CREDENTIALS METHODS
export const saveCredential = async (item: string, itemType: 'presentation' | 'credential') => {
	try {
		let formattedItem: any = getFormattedCredential(item)
		const keyChainDataObject = await getKeychainDataObject()

		if (!keyChainDataObject) {
			throw noKeychainError
		}

		if (itemType === 'presentation') {
			// Presentations will be added reagardless if same credential with same id exist
			if (!keyChainDataObject.presentations) {
				keyChainDataObject.presentations = []
			}

			formattedItem.status = 'Active'

			keyChainDataObject.presentations.push(formattedItem)

			addActionLog(
				keyChainDataObject,
				'Presentation emitted',
				formattedItem.id,
				formattedItem.issuer,
				formattedItem.validFrom
			)
		} else if (itemType === 'credential') {
			if (!keyChainDataObject.credentials) {
				keyChainDataObject.credentials = []
			}
			formattedItem.status = 'Active'
			keyChainDataObject.credentials = keyChainDataObject.credentials
				.filter(({ id }: any) => id !== formattedItem.id)
				.concat([formattedItem])

			addActionLog(
				keyChainDataObject,
				'Credential added',
				formattedItem.id,
				formattedItem.issuer,
				formattedItem.validFrom
			)
		}
		await setKeychainDataObject(keyChainDataObject)

		return true
	} catch (error) {
		console.error('Error saving credential:', error)
		return false
	}
}

export const saveDeferredCredential = async (credential: DeferredCredential): Promise<boolean> => {
	const keyChainDataObject = await getKeychainDataObject()

	if (!keyChainDataObject) {
		throw noKeychainError
	}

	const deferredCredential = { ...credential }

	if (!keyChainDataObject.deferred_credentials) {
		keyChainDataObject.deferred_credentials = []
	}

	keyChainDataObject.deferred_credentials.push(deferredCredential)

	keyChainDataObject.deferred_credentials = keyChainDataObject.deferred_credentials.filter((obj) => !!obj)

	await setKeychainDataObject(keyChainDataObject)

	return true
}

const getFormattedCredential = (credential: any) => {
	let credentialObject

	if (!credential) {
		throw new Error('Credential is undefined')
	}

	if (typeof credential === 'string' && credential.startsWith('ey')) {
		credentialObject = decodeJwt(credential).vc
	} else {
		credentialObject = typeof credential === 'string' ? JSON.parse(credential) : credential
	}

	let id: string
	let issuer: string
	let validFrom: string
	let expirationDate: string
	let timestamp: string
	let status: 'Active' | 'Revoked'

	const isLacchainCredential = credentialObject.data && credentialObject.data.issuer.startsWith('did:lac')

	if (isLacchainCredential) {
		id = credentialObject.data.id
		issuer = credentialObject.data.issuer
		validFrom = credentialObject.data.issuanceDate
		expirationDate = credentialObject.data.expirationDate
		timestamp = new Date().toISOString()
		status = 'Active'
	} else {
		id = credentialObject.id
		issuer = credentialObject.issuer
		validFrom = credentialObject.validFrom
		expirationDate = credentialObject.expirationDate
		timestamp = new Date().toISOString()
		status = 'Active'
	}

	return {
		id,
		issuer,
		validFrom,
		expirationDate,
		timestamp,
		status,
		credential,
	}
}

export const resolveKeychainDeferredCredentials = async () => {
	try {
		const keyChainDataObject = await getKeychainDataObject()
		if (!keyChainDataObject || !keyChainDataObject.deferred_credentials) {
			return
		}

		const updatedDeferredCredentials: DeferredCredential[] = []

		const promises = keyChainDataObject.deferred_credentials.map(async (deferredCredential) => {
			try {
				const credential = await OpenIdService.getDeferredCredentialRequest({
					acceptance_token: deferredCredential.acceptance_token,
					deferredEndpoint: deferredCredential.credential_endpoint,
				})

				if (credential && credential.credential) {
					// Handle credential saving manually because -await saveCredential()- is not working properly here (¿keychain bug?)
					const resolvedCredential = getFormattedCredential(credential.credential) as any
					resolvedCredential.status = 'Active'

					if (!keyChainDataObject.credentials) {
						keyChainDataObject.credentials = []
					}

					keyChainDataObject.credentials = keyChainDataObject.credentials
						.filter(({ id }: any) => id !== resolvedCredential.id)
						.concat([resolvedCredential])

					addActionLog(
						keyChainDataObject,
						'Credential added',
						resolvedCredential.id,
						resolvedCredential.issuer,
						resolvedCredential.validFrom
					)
					//
				} else {
					updatedDeferredCredentials.push(deferredCredential)
				}
			} catch (error) {
				console.warn('Deferred credential not ready:', error)
				updatedDeferredCredentials.push(deferredCredential)
			}
		})

		await Promise.all(promises)

		keyChainDataObject.deferred_credentials = updatedDeferredCredentials

		await setKeychainDataObject(keyChainDataObject)
	} catch (error) {
		console.error('Error resolving deferred credentials:', error)
	}
}

export const getCredentialsList = async () => {
	const keyChainDataObject = await getKeychainDataObject()
	if (!keyChainDataObject) {
		throw noKeychainError
	}
	return keyChainDataObject.credentials?.reverse() ?? []
}

export const getPresentationList = async () => {
	const keyChainDataObject = await getKeychainDataObject()
	if (!keyChainDataObject) {
		throw noKeychainError
	}
	const validPresentations = keyChainDataObject.presentations?.filter(
		(presentation) => presentation.status === 'Active'
	)
	return validPresentations?.reverse() ?? []
}

export const markItemAsRevoked = async (itemId: Date, itemType: 'credential' | 'presentation') => {
	const keyChainDataObject = await getKeychainDataObject()
	if (!keyChainDataObject) {
		throw noKeychainError
	}

	let items: (CredentialData | PresentationData)[] | undefined

	if (itemType === 'credential') {
		items = keyChainDataObject.credentials
	} else if (itemType === 'presentation') {
		items = keyChainDataObject.presentations
	}

	if (items) {
		// Using timestamp instead of id for case when credential has been presented more than once
		const itemIndex = items.findIndex(({ timestamp }) => timestamp === itemId)

		if (itemIndex !== -1) {
			items[itemIndex].status = 'Revoked'

			addActionLog(
				keyChainDataObject,
				`${itemType.charAt(0).toUpperCase() + itemType.slice(1)} revoked` as ActionLog['actionType'],
				items[itemIndex].id,
				items[itemIndex].issuer,
				items[itemIndex].validFrom
			),
				await setKeychainDataObject(keyChainDataObject)
		}
	}
}

export const addActionLog = (
	keyChainDataObject: KeyChainData,
	actionType: ActionLog['actionType'],
	id: string,
	issuer: string,
	validFrom: Date | string,
	customDate?: Date
) => {
	if (!(validFrom instanceof Date)) {
		validFrom = new Date(validFrom)
	}

	const actionLog: ActionLog = {
		id,
		actionType,
		issuer,
		date: customDate || validFrom,
	}

	keyChainDataObject.actionLogs = keyChainDataObject.actionLogs
		? [...keyChainDataObject.actionLogs, actionLog]
		: [actionLog]
}

export const getActionLogs = async () => {
	const keyChainDataObject = await getKeychainDataObject()

	if (!keyChainDataObject) {
		throw noKeychainError
	}

	const actionLogs = keyChainDataObject.actionLogs || []
	return actionLogs.reverse()
}

export const checkAndLogExpiredCredentials = async () => {
	const keyChainDataObject = await getKeychainDataObject()

	if (!keyChainDataObject) {
		throw noKeychainError
	}

	if (keyChainDataObject.credentials && keyChainDataObject.actionLogs) {
		const currentDate = new Date()

		for (const credential of keyChainDataObject.credentials) {
			const hasExpiredCredentialLog = keyChainDataObject.actionLogs.some(
				(log) => log.actionType === 'Credential expired' && log?.id === credential?.id
			)

			if (!hasExpiredCredentialLog && credential.expirationDate && new Date(credential.expirationDate) < currentDate) {
				addActionLog(keyChainDataObject, 'Credential expired', credential.id, credential.issuer, currentDate)
			}
		}
	}

	await setKeychainDataObject(keyChainDataObject)
}

export const deleteAllKeychainData = async () => {
	try {
		await Keychain.resetGenericPassword()
		await LocalStorageService.clearAll()
		return true
	} catch (error) {
		console.error('Error deleting keychain data:', error)
		return false
	}
}

export const checkIfAppWasReinstalled = async () => {
	const wasAppInstalled = await LocalStorageService.getBool(STORAGE_KEYS.APP_WAS_INSTALLED)

	if (!wasAppInstalled) {
		await deleteAllKeychainData()

		await LocalStorageService.storeBool(STORAGE_KEYS.APP_WAS_INSTALLED, true)
	}
}
