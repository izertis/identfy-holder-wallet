import { getPrivateKey, saveDID } from '../../utils/keychain'
import { derivationPathFormats } from '../hd-wallets/constants'
import { generateDerivationPath, getWalletFromDerivation } from '../hd-wallets'
import openIdI18nKeys from '../i18n/keys'
import { ALASTRIA_DID_METHOD, NETWORK_NAME, NETWORK_TYPE } from './constants'

export const createDidAlastria = async () => {
	try {
		const privateKey = await getPrivateKey()
		if (!privateKey) throw openIdI18nKeys.ERROR_NO_PRIVATE_KEY

		const derivedPath = generateDerivationPath(derivationPathFormats.NETWORK_DID)
		const hdWallet = await getWalletFromDerivation(privateKey, derivedPath)

		const did = `did:${ALASTRIA_DID_METHOD}:${NETWORK_TYPE.QUORUM}:${
			NETWORK_NAME.RED_T
		}:${hdWallet?.publicExtendedKey()}`

		await saveDID(did, 'alastria')
	} catch (error) {
		console.error('Error occurred creating Alastria DID:', error)
		throw error
	}
}
