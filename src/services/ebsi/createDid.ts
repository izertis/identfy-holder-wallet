import { util as EbsiResolverUtil } from '@cef-ebsi/key-did-resolver'
import { base64url } from 'jose'
import { getKeychainDataObject, getPrivateKey, saveDID } from '../../utils/keychain'
import { ec as EC } from 'elliptic'
import { KeyChainData } from '../../types/keychain'

export const createDidEbsi = async () => {
	try {
		const keychain: KeyChainData | null = await getKeychainDataObject()

		if (!keychain?.did?.ebsi) {
			const ec = new EC('p256')
			const privateKey = await getPrivateKey()

			const keyPair = ec.keyFromPrivate(privateKey!.substring(2))
			const x = keyPair.getPublic().getX().toBuffer('be', 32)
			const y = keyPair.getPublic().getY().toBuffer('be', 32)

			const publicKey = {
				crv: 'P-256',
				kty: 'EC',
				x: base64url.encode(x),
				y: base64url.encode(y),
			}
			const did = EbsiResolverUtil.createDid(publicKey)

			await saveDID(did, 'ebsi')
		}
	} catch (error) {
		console.error('Error occurred:', error)
		throw error
	}
}
