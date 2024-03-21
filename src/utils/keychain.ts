import 'react-native-get-random-values'
import '@ethersproject/shims'
import { utils } from 'ethers'
import * as Keychain from 'react-native-keychain'
import { derivationPathItems } from '../interfaces/wallet'
import LocalStorageService, { STORAGE_KEYS } from '../services/LocalStorage.service'
import { parseJwt } from './crypto'
import { DeferredCredential } from '../services/Ebsi/types'
import { getDeferredCredentialResponse } from '../services/Ebsi/ebsiService'
import { ActionLog, CredentialData, KeyChainData, PresentationData, chainType } from '../types/keychain'

const noKeychainError = 'No keychain stored'

export const setKeychainDataObject = async (data: KeyChainData): Promise<Keychain.Result | null | false> => {
	return await Keychain.setGenericPassword('VacinnesData', JSON.stringify(data)).catch(() => null)
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
	const keyChainDataObject = await getKeychainDataObject()
	return keyChainDataObject?.pin === pin
}

export const changePin = async (pin: string) => {
	const keyChainDataObject = await getKeychainDataObject()
	if (!keyChainDataObject) {
		return null
	}
	keyChainDataObject.pin = pin
	await setKeychainDataObject(keyChainDataObject)
	return keyChainDataObject.pin
}

export const getPrivateKey = async (): Promise<string | null> => {
	const keyChainDataObject = await getKeychainDataObject()
	return keyChainDataObject?.privateKey || null
}

export const getWalletAddress = async (): Promise<string | null> => {
	const keyChainDataObject = await getKeychainDataObject()
	if (!keyChainDataObject?.wallet) {
		return null
	}
	const wallet = JSON.parse(keyChainDataObject.wallet)
	return wallet.address
}

export const checkSecurityPhrase = async (securityPhrase: string): Promise<boolean> => {
	const keyChainDataObject = await getKeychainDataObject()
	return keyChainDataObject?.mnemonicHash === utils.id(securityPhrase)
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

export const saveDID = async (
	did: string,
	chain_type: chainType,
	identifier?: string // nuevo parámetro opcional para Alastria
): Promise<boolean> => {
	const keychainObject: KeyChainData | null = await getKeychainDataObject()
	if (!keychainObject || !did) {
		return false
	}
	if (!keychainObject.did) {
		keychainObject.did = {}
	}
	if (chain_type === 'alastria') {
		const alastriaChain = chain_type as 'alastria'
		if (!identifier) {
			console.error('An identifier is required for Alastria DIDs')
			return false
		}
		if (!keychainObject.did[alastriaChain]) {
			keychainObject.did[alastriaChain] = {}
		}
		keychainObject.did[alastriaChain][identifier] = did
	} else {
		keychainObject.did[chain_type] = did
	}
	await setKeychainDataObject(keychainObject)
	await LocalStorageService.storeBool(STORAGE_KEYS.IS_DID_CREATED, true)
	return true
}

export const getDid = async (chain_type: chainType, identifier?: string): Promise<string | null> => {
	const keyChainDataObject = await getKeychainDataObject()
	if (chain_type === 'alastria' && identifier) {
		const alastriaChain = chain_type as 'alastria'
		const alastriaDids = keyChainDataObject?.did?.[alastriaChain] || {}
		const did = alastriaDids[identifier]
		return did || null
	} else if (chain_type === 'alastria' && !identifier) {
		console.error('An identifier is required for Alastria DIDs')
		return null
	} else {
		const simpleChain = chain_type as 'lacchain' | 'ebsi'
		return keyChainDataObject?.did?.[simpleChain] || null
	}
}

export const getDidList = async () => {
	const keyChainDataObject = await getKeychainDataObject()
	const didListAlastriaObject = keyChainDataObject?.did?.alastria || {}
	const didListAlastria = Object.entries(didListAlastriaObject).map(([key, value]) => ({
		network: key,
		entity: 'alastria',
		did: value,
	}))
	const didLacchain = {
		network: 'main',
		entity: 'lacchain',
		did: await getDid('lacchain'),
	}
	const didEbsi = { network: 'main', entity: 'ebsi', did: await getDid('ebsi') }
	return [...didListAlastria, didLacchain, didEbsi]
}

export const getDidPendingList = async () => {
	const keyChainDataObject = await getKeychainDataObject()
	const didListAlastriaObject = keyChainDataObject?.did?.alastria || {
		network: 'main',
		entity: 'alastria',
		did: undefined,
	}
	const didListAlastria = Object.entries(didListAlastriaObject).map(([key, value]) => ({
		network: key,
		entity: 'alastria',
		did: value,
	}))
	const didLacchain = {
		network: 'main',
		entity: 'lacchain',
		did: await getDid('lacchain'),
	}
	const didEbsi = { network: 'main', entity: 'ebsi', did: await getDid('ebsi') }
	return [...didListAlastria, didLacchain, didEbsi].filter(({ did }) => !did)
}

//DERIVATION PATH METHODS
export const saveDerivationPathItem = async (id: string, derivationPath: string): Promise<boolean> => {
	const keyChainDataObject: KeyChainData | null = await getKeychainDataObject()
	if (!keyChainDataObject || !derivationPath || !id) {
		return false
	}
	if (!keyChainDataObject.derivationPathStorage) {
		keyChainDataObject.derivationPathStorage = []
	}
	keyChainDataObject.derivationPathStorage.push({
		id: id,
		derivationPath: derivationPath,
	})
	await setKeychainDataObject(keyChainDataObject)
	return true
}

export const checkDerivationPathExist = async (id: string) => {
	const keyChainDataObject: KeyChainData | null = await getKeychainDataObject()
	const derivationPath = keyChainDataObject?.derivationPathStorage || []
	return !!derivationPath.find((obj: any) => obj.id === id)
}

export const getDerivationPathItem = async (id: string): Promise<derivationPathItems | null> => {
	const keyChainDataObject: KeyChainData | null = await getKeychainDataObject()
	if (!keyChainDataObject || !keyChainDataObject.derivationPathStorage) {
		return null
	}
	const matchingObject = keyChainDataObject.derivationPathStorage.find((obj) => obj.id === id)

	return matchingObject || null
}

export const saveDerivationChild = async (
	id: string,
	keyChild: string,
	derivationPathChild: string
): Promise<boolean> => {
	const keyChainDataObject: KeyChainData | null = await getKeychainDataObject()
	if (!keyChainDataObject || !keyChainDataObject.derivationPathStorage) {
		return false
	}
	const matchingObject: any = keyChainDataObject.derivationPathStorage.find((obj) => obj.id === id)
	if (!matchingObject) {
		throw new Error(`Id ${id} does not exist!`)
	}
	if (!matchingObject.children) {
		matchingObject.children = {}
	}
	if (matchingObject.children[keyChild]) {
		throw new Error(`KeyChild ${keyChild} already exists!`)
	}
	matchingObject.children[keyChild] = derivationPathChild
	await setKeychainDataObject(keyChainDataObject)
	return true
}

export const getDerivationChild = async (id: string, keyChild: string): Promise<string | null> => {
	const keyChainDataObject: KeyChainData | null = await getKeychainDataObject()
	if (!keyChainDataObject || !keyChainDataObject.derivationPathStorage) {
		return null
	}
	const matchingObject = keyChainDataObject.derivationPathStorage.find((obj) => obj.id === id)
	if (!matchingObject || !matchingObject.children || !matchingObject.children[keyChild]) {
		return null
	}
	return matchingObject.children[keyChild]
}

export const removeDerivationChild = async (id: string, keyChild: string): Promise<boolean> => {
	const keyChainDataObject: KeyChainData | null = await getKeychainDataObject()
	if (!keyChainDataObject || !keyChainDataObject.derivationPathStorage) {
		return false
	}
	const matchingObject: any = keyChainDataObject.derivationPathStorage.find((obj) => obj.id === id)
	if (!matchingObject) {
		throw new Error(`Id ${id} not found`)
	}
	if (!matchingObject.children || !matchingObject.children[keyChild]) {
		throw new Error(`Child key ${keyChild} not found`)
	}
	delete matchingObject.children[keyChild]
	await setKeychainDataObject(keyChainDataObject)

	return true
}

// CREDENTIALS METHODS
export const saveCredential = async (item: string, itemType: 'presentation' | 'credential') => {
	let formatedItem: any
	formatedItem = getFormattedCredential(item as string)
	const keychain: KeyChainData | null = await getKeychainDataObject()
	if (!keychain) {
		throw noKeychainError
	}

	if (itemType === 'presentation') {
		if (!keychain.presentations) {
			keychain.presentations = []
		}
		formatedItem.status = 'active'

		keychain.presentations =
			keychain.presentations?.filter(({ id }: any) => id !== formatedItem.id)?.concat([formatedItem]) || []
		addActionLog(keychain, 'Presentation emitted', formatedItem.id, formatedItem.issuer, formatedItem.validFrom)
	} else if (itemType === 'credential') {
		if (!keychain.credentials) {
			keychain.credentials = []
		}
		formatedItem.status = 'active'
		keychain.credentials =
			keychain.credentials?.filter(({ id }: any) => id !== formatedItem.id)?.concat([formatedItem]) || []
		addActionLog(keychain, 'Credential added', formatedItem.id, formatedItem.issuer, formatedItem.validFrom)
	}

	setKeychainDataObject(keychain)
	return true
}

export const saveDeferredCredential = async (
	credential: DeferredCredential,
	chain_type: chainType,
	deferred_endpoint: string
) => {
	const keychain: KeyChainData | null = await getKeychainDataObject()
	if (!keychain) {
		throw noKeychainError
	}
	const DeferredCredential = { ...credential, deferred_endpoint }
	if (!keychain.deferred_credentials) {
		keychain.deferred_credentials = {} as any
	}
	if (!keychain.deferred_credentials?.[chain_type]) {
		keychain.deferred_credentials = {
			...keychain.deferred_credentials,
			[chain_type]: [],
		} as any
	}
	keychain.deferred_credentials![chain_type] = keychain.deferred_credentials?.[chain_type]?.concat([
		DeferredCredential,
	]) ?? [DeferredCredential]
	keychain.deferred_credentials![chain_type] = keychain.deferred_credentials![chain_type]?.filter((obj) => !!obj)
	setKeychainDataObject(keychain)
	return true
}

const getFormattedCredential = (credential: string) => {
	let credentialObject
	if (credential == undefined) throw new Error('Credential is undefined')
	if (credential?.startsWith('ey')) {
		credentialObject = parseJwt(credential).vc
	} else {
		credentialObject = JSON.parse(credential)
	}

	let id: string
	let issuer: string
	let validFrom: string
	let expirationDate: string
	let status: 'active' | 'revoked'

	const isLacchainCredential = credentialObject.data && credentialObject.data.issuer.startsWith('did:lac')

	if (isLacchainCredential) {
		id = credentialObject.data.id
		issuer = credentialObject.data.issuer
		validFrom = credentialObject.data.issuanceDate
		expirationDate = credentialObject.data.expirationDate
		status = 'active'
	} else {
		id = credentialObject.id
		issuer = credentialObject.issuer
		validFrom = credentialObject.validFrom
		expirationDate = credentialObject.expirationDate
		status = 'active'
	}

	return {
		id,
		issuer,
		validFrom,
		expirationDate,
		status,
		credential,
	}
}

export const getCredential = async (id: string) => {
	const keychain: KeyChainData | null = await getKeychainDataObject()
	if (!keychain) {
		throw noKeychainError
	}
	const credential = keychain.credentials?.find((vc) => vc.id === id)
	return credential
}

export const resolveKeychainDeferredCredentials = async () => {
	try {
		const keychain: KeyChainData | null = await getKeychainDataObject()

		if (!keychain || !keychain.deferred_credentials || !keychain.deferred_credentials.ebsi) {
			return
		}

		const credentialsEbsi: (string | DeferredCredential)[] = await Promise.all(
			keychain.deferred_credentials.ebsi.map(async (defCredential: DeferredCredential) => {
				const credential = await getDeferredCredentialResponse({
					acceptance_token: defCredential.acceptance_token,
					deferredEndpoint: defCredential.credential_endpoint,
				})

				credential && (await saveCredential(credential.credential, 'credential'))

				return credential?.credential ?? defCredential
			})
		)

		const credentialsEbsiResolved = credentialsEbsi
			.filter((credential) => typeof credential === 'string')
			.map((credential) => getFormattedCredential(credential as string))

		const credentialsEbsiDeferred = credentialsEbsi.filter(
			(credential) => typeof credential !== 'string'
		) as DeferredCredential[]

		keychain.deferred_credentials.ebsi = credentialsEbsiDeferred
		keychain.credentials = (keychain.credentials || []).concat(credentialsEbsiResolved)
	} catch (error) {
		console.error('Error resolving deferred credentials:', error)
	}
}

export const getCredentialsList = async () => {
	const keychain: KeyChainData | null = await getKeychainDataObject()
	if (!keychain) {
		throw noKeychainError
	}
	return keychain.credentials?.reverse() ?? []
}

export const getPresentationList = async () => {
	const keychain: KeyChainData | null = await getKeychainDataObject()
	if (!keychain) {
		throw noKeychainError
	}
	const validPresentations = keychain.presentations?.filter((presentation) => presentation.status === 'active')
	return validPresentations?.reverse() ?? []
}

export const revokeItem = async (itemId: string, itemType: 'credential' | 'presentation') => {
	const keychain: KeyChainData | null = await getKeychainDataObject()
	if (!keychain) {
		throw noKeychainError
	}

	let items: (CredentialData | PresentationData)[] | undefined

	if (itemType === 'credential') {
		items = keychain.credentials
	} else if (itemType === 'presentation') {
		items = keychain.presentations
	}

	if (items) {
		const itemIndex = items.findIndex(({ id }) => id === itemId)

		if (itemIndex !== -1) {
			items[itemIndex].status = 'revoked'

			addActionLog(
				keychain,
				`${itemType.charAt(0).toUpperCase() + itemType.slice(1)} revoked` as ActionLog['actionType'],
				items[itemIndex].id,
				items[itemIndex].issuer,
				items[itemIndex].validFrom
			),
				new Date()

			// Actually remove the item from keychain
			items.splice(itemIndex, 1)

			setKeychainDataObject(keychain)
		}
	}
}

export const addActionLog = (
	keychain: KeyChainData,
	actionType: ActionLog['actionType'],
	id: string,
	issuer: string,
	validFrom: Date,
	customDate?: Date
) => {
	const actionLog: ActionLog = {
		id,
		actionType,
		issuer,
		date: customDate || validFrom,
	}

	keychain.actionLogs = keychain.actionLogs ? [...keychain.actionLogs, actionLog] : [actionLog]
}

export const getActionLogs = async () => {
	const keychain: KeyChainData | null = await getKeychainDataObject()

	if (!keychain) {
		throw noKeychainError
	}

	const actionLogs = keychain.actionLogs || []
	return actionLogs.reverse()
}

export const checkAndLogExpiredCredentials = async () => {
	const keychain: KeyChainData | null = await getKeychainDataObject()

	if (!keychain) {
		throw noKeychainError
	}

	if (keychain.credentials && keychain.actionLogs) {
		const currentDate = new Date()

		for (const credential of keychain.credentials) {
			const hasExpiredCredentialLog = keychain.actionLogs.some(
				(log) => log.actionType === 'Credential expired' && log?.id === credential?.id
			)

			if (!hasExpiredCredentialLog && credential.expirationDate && new Date(credential.expirationDate) < currentDate) {
				addActionLog(keychain, 'Credential expired', credential.id, credential.issuer, currentDate)
			}
		}
	}

	setKeychainDataObject(keychain)
}
