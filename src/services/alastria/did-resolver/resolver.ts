import { DID_LD_JSON, SUPPORTED_CONTENT_TYPES } from './constants'
import type { DIDResolutionOptions, DIDResolutionResult, DIDResolver, ParsedDID, Resolvable } from 'did-resolver'
import { parseDidUrl } from './utils'
import { jwkFromPublicKey } from '../../../utils/jwk'
import { hdkey } from 'ethereumjs-wallet'

export function getResolver(): Record<'epic', DIDResolver> {
	function resolve(
		did: string,
		parsed: ParsedDID,
		__: Resolvable,
		didResolutionOptions?: DIDResolutionOptions
	): Promise<DIDResolutionResult> {
		try {
			const contentType = didResolutionOptions?.accept || DID_LD_JSON
			if (!SUPPORTED_CONTENT_TYPES.includes(contentType)) {
				throw new Error(`Representation "${contentType}" is not supported`)
			}

			const didDocument = getDidDocument(did, parsed.didUrl)

			return Promise.resolve({
				didDocument,
				didDocumentMetadata: {},
				didResolutionMetadata: { contentType },
			})
		} catch (e) {
			const message = e instanceof Error ? e.message : 'Unknown error'

			return Promise.resolve({
				didDocument: null,
				didDocumentMetadata: {},
				didResolutionMetadata: {
					error: 'invalidDid',
					message,
				},
			})
		}
	}

	return { epic: resolve }
}

function getDidDocument(did: string, didUrl: string): any {
	const parsed = parseDidUrl(didUrl)
	const kid = didUrl

	let hdWallet = hdkey.fromExtendedKey(parsed.extPK)

	hdWallet = hdWallet.derivePath(parsed.query.replace('dp=', ''))

	const jwk = jwkFromPublicKey(hdWallet.getWallet().getPublicKeyString(), 'secp256k1')

	const didDocument = {
		'@context': ['https://www.w3.org/ns/did/v1', 'https://w3id.org/security/suites/jws-2020/v1'],
		id: `${did}`,
		verificationMethod: [
			{
				id: `${kid}`,
				type: 'JsonWebKey2020',
				controller: `${did}`,
				publicKeyJwk: {
					crv: `${jwk.crv}`,
					kty: `${jwk.kty}`,
					x: `${jwk.x}`,
					y: `${jwk.y}`,
				},
			},
		],
		authentication: [`${kid}`],
		assertionMethod: [`${kid}`],
		capabilityInvocation: [`${kid}`],
		capabilityDelegation: [`${kid}`],
	}
	return didDocument
}
