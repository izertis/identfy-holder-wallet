import 'react-native-get-random-values'
import '@ethersproject/shims'
import { ethers } from 'ethers'
import axios from 'axios'
import { getDid, getPrivateKey } from '../../utils/keychain'
import { convertUriToObject } from '../../utils/url'
import { HeaderJWT, signJWT } from '../../utils/jwt'
import { lacchainDIDBasicConfiguration } from './constants'
import LacchainDID from './DIDConfig/did'

type MatchingObject = {
	token: string
	url: string
}

export const useMatchingID = () => {
	const handleMatchingID = async (qrURL: string) => {
		const privateKey = await getPrivateKey()
		const address = ethers.utils.computeAddress(privateKey!)
		const lacchainDid = await getDid('lacchain')

		const { token: idToken, url } = convertUriToObject(qrURL) as MatchingObject

		try {
			if (!idToken) {
				throw new Error('No idToken found in the URL')
			}

			// Get kid from didDocument
			const did = new LacchainDID({
				...lacchainDIDBasicConfiguration,
				address: `${address}`,
				controllerPrivateKey: privateKey,
			})

			const didDocument = await did.getDocument()

			const kid = didDocument.verificationMethod[1].id

			//  Objects to sign
			const header: HeaderJWT = {
				alg: 'ES256',
				typ: 'JWT',
				kid: kid,
			}

			const payload = {
				idToken,
				did: lacchainDid,
			}

			// Sign the data
			const signedJWT = await signJWT({ header, payload, privateKey })

			const urlWithToken = `${url}?token=${idToken}`

			await axios.put(urlWithToken, { jwt: signedJWT })
		} catch (error) {
			throw error
		}
	}

	return { handleMatchingID }
}
