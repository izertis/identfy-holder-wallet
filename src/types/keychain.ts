import { derivationPathItems } from '../interfaces/wallet'
import { DeferredCredential as EbsiDeferredCredential } from '../services/Ebsi/types'

export type chainType = 'lacchain' | 'alastria' | 'ebsi'

export type CredentialData = {
	id: string
	issuer: string
	validFrom: any
	expirationDate: any
	credential: any
	status: 'active' | 'revoked'
}

export type PresentationData = {
	id: string
	issuer: string
	validFrom: any
	expirationDate: any
	credential: any
	status: 'active' | 'revoked'
}

export type ActionLog = {
	id: string
	actionType: 'Credential added' | 'Credential expired' | 'Presentation emitted' | 'Presentation revoked'
	issuer: string
	date: Date | string
	data?: any
}

export type KeyChainData = {
	wallet?: string
	privateKey?: string
	mnemonicHash?: string
	pin?: string
	did?: { lacchain?: string; alastria?: Record<string, string>; ebsi?: string }
	JWKKeys?: { privateKeyJWK: string; publicKeyJWK: string; privateKeyHex: string; publicKeyHex: string }
	signatureKeyPair?: { publicKey: string; privateKey: string }
	credentials?: CredentialData[]
	presentations?: PresentationData[]
	deferred_credentials?: {
		ebsi?: EbsiDeferredCredential[]
		lacchain?: any[]
		alastria?: any[]
	}
	derivationPathStorage?: derivationPathItems[]
	actionLogs?: ActionLog[]
}
