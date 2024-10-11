import { ActionLog, CredentialData, DeferredCredential, PresentationData } from '../services/open-id/types'

export type KeyChainData = {
	encryptedPrivateKey?: string | ArrayBuffer
	did?: { lacchain?: string; alastria?: string; ebsi?: string }
	JWKKeys?: { privateKeyJWK: string; publicKeyJWK: string; privateKeyHex: string; publicKeyHex: string }
	signatureKeyPair?: { publicKey: string; privateKey: string }
	credentials?: CredentialData[]
	presentations?: PresentationData[]
	deferred_credentials?: DeferredCredential[]
	actionLogs?: ActionLog[]
}
