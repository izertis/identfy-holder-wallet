import axios from 'axios'
import { useState } from 'react'
import { getDid, getPrivateKey, getWalletAddress } from '../../utils/keychain'
import { convertUriToObject } from '../../utils/url'
import { HeaderJWT, signJWT } from '../../utils/jwt'
import { lacchainDIDBasicConfiguration } from './constants'
import LacchainDID from './DIDConfig/did'

type MatchingObject = {
	token: string
	url: string
}

export const useMatchingID = () => {
	const [isLoading, setIsLoading] = useState(false)

	const handleMatchingID = async (qrURL: string) => {
		const privateKey = await getPrivateKey()
		const address = await getWalletAddress()
		const lacchainDid = await getDid('lacchain')

		const { token: idToken, url } = convertUriToObject(qrURL) as MatchingObject

		try {
			setIsLoading(true)
			if (!idToken) {
				throw new Error('No idToken found in the URL')
			}

			// Get kid from didDocument
			const did = new LacchainDID({
				...lacchainDIDBasicConfiguration,
				address: `0x${address}`,
				controllerPrivateKey: privateKey,
			})

			const didDocument = await did.getDocument()

			const kid = didDocument.verificationMethod[1].id

			//  Objects to sign
			const header: HeaderJWT = {
				typ: 'JWT',
				alg: 'ES256',
				kid: kid,
			}

			const payload = {
				idToken,
				did: lacchainDid,
			}

			// Sign the data
			const signedJWT = await signJWT({ header, payload, privateKey })

			const urlWithToken = `${url}?token=${idToken}`

			const result = await axios.put(urlWithToken, { jwt: signedJWT })

			return result
		} catch (error) {
			throw error
		} finally {
			setIsLoading(false)
		}
	}

	return {
		handleMatchingID,
		isLoading,
	}
}
