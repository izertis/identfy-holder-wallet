import { getDid } from '../../utils/keychain'
import { generateDerivationPath, getWalletFromDerivation, composeDidDerivationPath } from '../hd-wallets'
import { derivationPathFormats } from '../hd-wallets/constants'

/**
 * Get the Alastria signer configuration.
 * @param privateKey - The private key to derive the signer from.
 * @param kid - (optional) The key identifier. Epic could send us expected derivations paths
 * @returns An object containing the signer's secret and composed DID.
 */
export const getAlastriaSignerConfig = async (privateKey: string, kid: string | undefined) => {
	const alastriaDid = kid ? kid : await getDid('alastria')

	const networkPath = generateDerivationPath(derivationPathFormats.NETWORK_DID)
	const hdWallet = await getWalletFromDerivation(privateKey, networkPath)

	// Generate the interacting path for composing the DID - two random ddpp
	const interactingPath = generateDerivationPath(derivationPathFormats.INTERACTING_DID)
	const composedDid = composeDidDerivationPath(alastriaDid, interactingPath)

	const fullDerivationPath = composedDid.split('=')[1]

	// Derive the secret using the HD wallet and full derivation path (given + interacting)
	const secret = hdWallet?.derivePath(fullDerivationPath).getWallet().getPrivateKeyString()

	return { secret, composedDid }
}
