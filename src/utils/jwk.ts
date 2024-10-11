import { base64url } from 'jose'
import elliptic from 'elliptic'

const { ec: EC } = elliptic

// TODO: no devolver any, sino una estructura JWK. Valorar utilizar la propia de JOSE

export function jwkFromSecretKey(secretKey: string, curve = 'p256'): any {
	const ec = new EC(curve)

	const safeSecretKey = secretKey.startsWith('0x') ? secretKey.slice(2) : secretKey

	const keyPair = ec.keyFromPrivate(safeSecretKey)
	const x = keyPair.getPublic().getX().toBuffer('be', 32)
	const y = keyPair.getPublic().getY().toBuffer('be', 32)
	const d = keyPair.getPrivate().toBuffer('be', 32)

	//TODO: improve
	const crv = curve == 'p256' ? 'P-256' : curve

	const jwk = {
		crv,
		kty: 'EC',
		d: base64url.encode(d),
		x: base64url.encode(x),
		y: base64url.encode(y),
	}

	return jwk
}

export function jwkFromPublicKey(publicKey: string, curve = 'p256'): any {
	const ec = new EC(curve)

	const publicKeyWithoutPrefix = publicKey.startsWith('0x') ? publicKey.slice(2) : publicKey

	// publicKey must be uncompressed. Prefixes 02 and 03 are not allowed
	if (publicKeyWithoutPrefix.startsWith('02') || publicKeyWithoutPrefix.startsWith('03')) {
		throw new Error('Compressed public keys are not allowed')
	}

	// Elliptic require uncompressed public key started with 04
	// https://github.com/indutny/elliptic/blob/master/README.md/
	// https://github.com/indutny/elliptic/issues/138
	const safePublicKey = '04' + publicKeyWithoutPrefix

	const keyPair = ec.keyFromPublic(safePublicKey, 'hex')
	const x = keyPair.getPublic().getX().toBuffer('be', 32)
	const y = keyPair.getPublic().getY().toBuffer('be', 32)

	//TODO: improve
	const crv = curve == 'p256' ? 'P-256' : curve

	const jwk = {
		crv,
		kty: 'EC',
		x: base64url.encode(x),
		y: base64url.encode(y),
	}

	return jwk
}
