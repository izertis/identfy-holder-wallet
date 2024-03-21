import { useContext } from 'react'
import { ModalContextProps } from '../../context/Modal.context'
import { createEbsiCredential, createEbsiCredentialPreauthorized } from './credential'
import { MessageContext } from '../../context/UserMessage.context'
import i18next from 'i18next'
import localeES from './i18n/es'
import { useTranslation } from 'react-i18next'
import { createEbsiPresentation } from './presentation'
import {
	authorizationRequest,
	getCredentialOffer,
	getOpenIdConfiguration,
	getOpenIdCredentialIssuer,
} from './ebsiService'
import { extractCredentialOfferUri } from '../../utils/url'
import {
	CredentialOffer,
	CredentialResponse,
	DeferredCredential,
	OpenIdConfiguration,
	OpenIdCredentialIssuer,
} from './types'
import { useNavigation } from '@react-navigation/native'
import { getDid, saveCredential, saveDeferredCredential } from '../../utils/keychain'
import { messageError } from './utils'
import ebsiI18nKeys from './i18n/keys'
import useModal from '../../hooks/useModal'
import { generateCodeVerifierAndChallenge } from '../../utils/pkceGenerator'

export const useEbsi = () => {
	const bundleName = 'ebsi'
	i18next.addResourceBundle('es', bundleName, localeES)
	const { t } = useTranslation(bundleName)
	const { showModal } = useModal() as ModalContextProps
	const { showMessage } = useContext(MessageContext)
	const navigation = useNavigation()

	const handleEbsiQR = async (data: string): Promise<boolean> => {
		const credentialOfferUri = extractCredentialOfferUri(data)
		const ebsiDid = await getDid('ebsi')
		const { verifier, challenge } = await generateCodeVerifierAndChallenge()
		let content

		if (!ebsiDid) throw new Error(t(ebsiI18nKeys.ERROR_EBSI_DID)!)

		try {
			const credentialOffer: CredentialOffer = await getCredentialOffer(credentialOfferUri)

			const openIdCredentialIssuer: OpenIdCredentialIssuer = await getOpenIdCredentialIssuer(
				credentialOffer.credential_issuer
			)

			const openIdConfiguration: OpenIdConfiguration = await getOpenIdConfiguration(
				openIdCredentialIssuer.authorization_server
			)

			// Authorization request is only executed if is an authorized flow
			const isAuthorizedFlow = 'authorization_code' in credentialOffer.grants
			const isPreauthorizedFlow = 'urn:ietf:params:oauth:grant-type:pre-authorized_code' in credentialOffer.grants
			let redirectInfo
			if (isAuthorizedFlow) {
				redirectInfo = await authorizationRequest({
					issuerState: credentialOffer?.grants?.authorization_code?.issuer_state,
					ebsiDid: ebsiDid!,
					challenge: challenge,
					authorizationEndpoint: openIdConfiguration?.authorization_endpoint,
					types: credentialOffer?.credentials[0].types,
					locations: openIdCredentialIssuer.credential_issuer,
				})
			}

			const isVcPresentation = redirectInfo && redirectInfo.response_type === 'vp_token'

			if (isAuthorizedFlow && !isVcPresentation) {
				const credentialResponse: CredentialResponse = await createEbsiCredential(
					credentialOffer,
					openIdCredentialIssuer,
					openIdConfiguration,
					redirectInfo!,
					ebsiDid!,
					verifier,
					{
						t,
						showModal,
						showMessage,
					}
				)
				const isInTimeFlow = 'credential' in credentialResponse
				const isDeferredFlow = 'acceptance_token' in credentialResponse

				if (isAuthorizedFlow && isInTimeFlow) {
					saveCredential(credentialResponse.credential, 'credential')
					content = t(ebsiI18nKeys.SUCCESS)
				} else if (isDeferredFlow) {
					const deferredCredential: DeferredCredential = {
						credential_endpoint: openIdCredentialIssuer.deferred_credential_endpoint,
						acceptance_token: credentialResponse.acceptance_token,
					}
					saveDeferredCredential(deferredCredential, 'ebsi', openIdCredentialIssuer.deferred_credential_endpoint)
					content = t(ebsiI18nKeys.SUCCESS_DEFERRED)
				}
			} else if (isPreauthorizedFlow) {
				const credentialResponse = await createEbsiCredentialPreauthorized(
					{ credentialOffer, openIdCredentialIssuer, openIdConfiguration, ebsiDid },
					{ showModal }
				)
				const isInTimeFlow = 'credential' in credentialResponse
				const isDeferredFlow = 'acceptance_token' in credentialResponse

				if (isPreauthorizedFlow && isInTimeFlow) {
					saveCredential(credentialResponse.credential, 'credential')
					content = t(ebsiI18nKeys.SUCCESS)
				} else if (isDeferredFlow) {
					const deferredCredential: DeferredCredential = {
						credential_endpoint: openIdCredentialIssuer.deferred_credential_endpoint,
						acceptance_token: credentialResponse.acceptance_token,
					}
					saveDeferredCredential(deferredCredential, 'ebsi', openIdCredentialIssuer.deferred_credential_endpoint)
					content = t(ebsiI18nKeys.SUCCESS_DEFERRED)
				}
			} else if (isAuthorizedFlow && isVcPresentation) {
				const credentialResponse: CredentialResponse = await createEbsiPresentation(
					credentialOffer,
					openIdCredentialIssuer,
					openIdConfiguration,
					redirectInfo!,
					ebsiDid!,
					verifier,
					{
						t,
						showModal,
						showMessage,
					}
				)
				saveCredential(credentialResponse.credential, 'presentation')
				content = t(ebsiI18nKeys.SUCCESS_PRESENTATION)
			}
			showMessage({ content, type: 'success' })
			return true
		} catch (error) {
			// @ts-ignore
			messageError(error.message || (error as string), { t, showMessage })
			return false
		} finally {
			setTimeout(() => {
				navigation.navigate('Root')
			}, 1000)
		}
	}
	return { handleEbsiQR }
}
