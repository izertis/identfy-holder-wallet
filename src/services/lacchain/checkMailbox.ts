import { getDid, getJWKKeys, getPrivateKey, saveCredential } from '../../utils/keychain'
import moment from 'moment'
import { TokenSigner } from 'jsontokens'
import * as eccryptoJS from 'eccrypto-js'
import { decryptMailboxMessages } from './utils'

export const checkMailbox = async () => {
	const privateKey = await getPrivateKey()

	const did = await getDid('lacchain')

	// 1. Create and sign JWT

	const payload = {
		iat: Math.floor(Date.now() / 1000),
		exp: moment().add(1, 'days').valueOf(),
		sub: did,
		iss: did,
	}

	const receiverToken = new TokenSigner('ES256K', privateKey?.substring(2)!).sign(payload)

	// 2. Send the request to Mailbox API:

	let requestOptions = {
		method: 'get',
		headers: {
			'Content-Type': 'application/json',
			token: receiverToken,
		},
	}

	const result = await fetch(`${process.env.LAC_MAILBOX_URL!}/vc`, requestOptions)
	if (!(result.status >= 200 && result.status < 300)) {
		return false
	}

	const body: any = await result.json()

	// 3. Decrypt received message

	if (body.length > 0) {
		// body is an array of messages
		const JWKKeys = await getJWKKeys()
		const decryptPrivateKey = JWKKeys?.privateKeyHex
		const myPrvKeytoBuffer = eccryptoJS.hexToBuffer(decryptPrivateKey!)
		const decryptedAndFormattedMessages = await decryptMailboxMessages(myPrvKeytoBuffer, body)

		for (let message of decryptedAndFormattedMessages) {
			if (typeof message === 'string' && message.startsWith('ey')) {
				await saveCredential(message, 'credential')
			}
			if (typeof message !== 'object') {
				message = JSON.parse(message)
			}

			await saveCredential(message, 'credential')
		}

		// 4. Delete messages from mailbox

		requestOptions = {
			method: 'delete',
			headers: {
				'Content-Type': 'application/json',
				token: receiverToken,
			},
		}

		const result = await fetch(`${process.env.LAC_MAILBOX_URL!}/vc`, requestOptions)
		if (!(result.status >= 200 && result.status < 300)) {
			return false
		}

		return true
	} else {
		console.warn('There are no messages to fetch from mailbox')
		return false
	}
}
