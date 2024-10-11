import { useContext } from 'react'
import { ModalContextProps } from '../../context/Modal.context'
import { MessageContext } from '../../context/UserMessage.context'
import i18next from 'i18next'
import { useTranslation } from 'react-i18next'
import { extractCredentialOfferUri } from '../../utils/url'
import { CredentialOffer, OpenIdConfiguration, OpenIdCredentialIssuer, PresentationOffer } from './types'
import { useNavigation } from '@react-navigation/native'
import useModal from '../../hooks/useModal'
import OpenIdService from '../OpenId.service'
import { requestCredential } from './requestCredential'
import localeES from '../i18n/es'
import { issuePresentation } from './issuePresentation'
import { isJWT } from '../../utils/jwt'
import { decodeJwt } from 'jose'

export const useOpenId = () => {
	const bundleName = 'openId'
	i18next.addResourceBundle('es', bundleName, localeES)
	const { t } = useTranslation(bundleName)
	const { showModal } = useModal() as ModalContextProps
	const { showMessage } = useContext(MessageContext)
	const navigation = useNavigation()

	// TODO: Refactor this to unify the flow in a requestCredential function
	const handleCredentialOffer = async (data: string): Promise<boolean> => {
		let credentialOfferUri: string | undefined
		let credentialOffer: CredentialOffer
		let content

		try {
			try {
				credentialOffer = JSON.parse(data)
			} catch (e) {
				// If is not a json object then it's an uri
				credentialOfferUri = extractCredentialOfferUri(data)
				credentialOffer = await OpenIdService.getCredentialOffer(credentialOfferUri)
			}
			if (typeof credentialOffer === 'string' && isJWT(credentialOffer)) {
				// When instead of a credentialOffer we get a presentationOffer
				const presentationOffer: PresentationOffer = decodeJwt(credentialOffer) as any

				const credentialIssuer = presentationOffer.iss

				const openIdConfiguration: OpenIdConfiguration = await OpenIdService.getOpenIdConfiguration(credentialIssuer)

				content = await issuePresentation(credentialOffer, openIdConfiguration, { t, showModal })
				showMessage({ content, type: 'success' })
				return true
			} else {
				const openIdCredentialIssuer: OpenIdCredentialIssuer = await OpenIdService.getOpenIdCredentialIssuer(
					credentialOffer.credential_issuer
				)

				const openIdConfiguration: OpenIdConfiguration = await OpenIdService.getOpenIdConfiguration(
					openIdCredentialIssuer.authorization_server
				)

				content = await requestCredential(credentialOffer, openIdCredentialIssuer, openIdConfiguration, {
					t,
					showModal,
				})
				showMessage({ content, type: 'success' })
				return true
			}
		} catch (error: any) {
			content = t(error.message)
			showMessage({ content, type: 'error' })
			return false
		} finally {
			setTimeout(() => {
				navigation.navigate('Root')
			}, 1000)
		}
	}
	return { handleCredentialOffer }
}
