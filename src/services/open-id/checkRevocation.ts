import 'react-native-get-random-values'
import '@ethersproject/shims'
import { ethers } from 'ethers'
import { getEthAddressFromExtenderPublicKey } from '../../utils/crypto'
import { CREDENTIALS_CONTRACT_ADDRESS, STATUS_LIST_2021 } from '../alastria/constants'
import { credentialsAbi } from '../alastria/contracts/credentialsAbi'
import { decodeJwt } from 'jose'
import { decodeToken } from 'jsontokens'
import { getTrustedFrameworkFromDid } from './utils'
import { StatusListEntry2021, Vc } from './types'
import { descompressGZIP, getBitFromBitString } from '../../utils/utils'

export const checkRevocationStatus = async (token: string) => {
	const decodedCredential = decodeJwt(token)
	const vc = decodedCredential.vc as Vc
	const issuer = vc.issuer

	let trustedFramework = getTrustedFrameworkFromDid(issuer)

	if (trustedFramework === 'epic') {
		const provider = new ethers.providers.JsonRpcProvider(process.env.NODE_IP)
		const contractAddress = CREDENTIALS_CONTRACT_ADDRESS
		const contractABI = credentialsAbi

		const ownerAddress = getEthAddressFromExtenderPublicKey(decodedCredential.iss)

		const contract = new ethers.Contract(contractAddress, contractABI, provider)

		try {
			const credentialHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(token))

			if (!credentialHash || !ownerAddress) return
			const status = await contract.getObjectStatus(credentialHash, ownerAddress)

			return status
		} catch (error) {
			console.error('Error checking credential status: ', error)
		}
	} else if (trustedFramework === 'ebsi') {
		const status = await checkCredentialStatus(decodedCredential.vc)

		return status
	} else {
		throw new Error('Unrecognised trustedFramework')
	}
}

export async function checkCredentialStatus(vc: any): Promise<any> {
	if (vc.credentialStatus) {
		if (Array.isArray(vc.credentialStatus)) {
			for (const status of vc.credentialStatus) {
				const result = await checkSingleCredentialStatus(status, vc.issuer)
				if (!result.valid) {
					return result
				}
			}
		} else {
			return await checkSingleCredentialStatus(vc.credentialStatus, vc.issuer)
		}
	}
	return { valid: true }
}

async function checkSingleCredentialStatus(status: any, issuer: string): Promise<any> {
	if (status.type !== STATUS_LIST_2021) {
		return { valid: false, error: 'Unsupported credential status type' }
	}
	return await checkStatusList(status as StatusListEntry2021, issuer)
}

async function checkStatusList(credentialStatus: StatusListEntry2021, issuer: string): Promise<any> {
	if (credentialStatus.statusPurpose === 'revocation' || credentialStatus.statusPurpose === 'suspension') {
		if (!credentialStatus.statusListCredential) {
			return {
				valid: false,
				error: 'StatusList2021Entry must contain a statusListCredential parameter',
			}
		}
		const fetchResponse = await fetch(credentialStatus.statusListCredential)
		// Should be in JWT format - we are receiving plain text
		// TODO: Improve, temporary removing "" to avoid errors, but we should look at content type"
		const statusVc = (await fetchResponse.text()).replace(/"/g, '')

		const jwt = decodeToken(statusVc) as any
		const listBase64Uncoded = Buffer.from(jwt.payload.vc.credentialSubject.encodedList, 'base64')
		const gzipUncodedList = await descompressGZIP(listBase64Uncoded)
		const indexValue = getBitFromBitString(gzipUncodedList, parseInt(credentialStatus.statusListIndex))
		if (indexValue === 1) {
			return { valid: false, error: 'is revoked' }
		}
	} else {
		return { valid: false }
	}
	return { valid: true }
}
