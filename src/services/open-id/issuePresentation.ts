import jwt from 'jsonwebtoken'
import { SignJWT as SignJWTJose } from 'jose'
import RequestPresentationModal from '../../components/RequestPresentationModal'
import { signJWT } from '../../utils/jwt'
import { getDid, getPrivateKey, saveCredential } from '../../utils/keychain'
import OpenIdService from '../OpenId.service'
import openIdI18nKeys from '../i18n/keys'
import { ModalType, OpenIdConfiguration, PresentationDefinition, PresentationOffer } from './types'
import { createVp, getTrustedFrameworkFromDid } from './utils'
import { ALASTRIA_DID_METHOD } from '../alastria/constants'

export const issuePresentation = async (
	presentationToken: string,
	openIdConfiguration: OpenIdConfiguration,
	{ t, showModal }: ModalType
) => {
	try {
		if (!t) throw new Error('Error translating')

		const privateKey = await getPrivateKey()

		const isEpic = openIdConfiguration.subject_trust_frameworks_supported[0] === ALASTRIA_DID_METHOD

		const subjectDid = !isEpic ? await getDid('ebsi') : await getDid('alastria')

		if (!subjectDid) throw new Error(t(openIdI18nKeys.ERROR_NO_DID))

		const trustedFramework = getTrustedFrameworkFromDid(subjectDid)

		const decodedToken = jwt.decode(presentationToken, { complete: true })

		const presentationOffer = decodedToken?.payload as PresentationOffer

		if (!presentationOffer) throw new Error(t(openIdI18nKeys.ERROR_PRESENTATION_OFFER))

		let presentationDefinition: PresentationDefinition = await OpenIdService.getPresentationDefinition(
			presentationToken
		)

		// Stop presentation process if field.path is empty (incorrect presentation definition)
		const descriptors = presentationDefinition.input_descriptors
		if (descriptors.some((elm) => elm.constraints?.fields.some((field) => !field.path.length))) {
			throw new Error(t(openIdI18nKeys.ERROR_INVALID_PRESENTATION_DEFINITION))
		}

		const presentations = await new Promise<string[]>((resolve, reject) =>
			showModal?.({
				Component: RequestPresentationModal,
				modalProps: { presentationDefinition },
				onAccept: async (verifiableCredential: any) => {
					try {
						const vp = createVp({ holder: subjectDid, verifiableCredential })
						const state = presentationOffer.state

						const vp_token_header = {
							alg: trustedFramework === 'ebsi' ? 'ES256' : 'ES256K',
							typ: 'JWT',
							kid: subjectDid,
						}

						const vp_token_payload = {
							nonce: presentationOffer.nonce,
							vp,
							...(state != null && { state }),
						}

						const unsignedVpToken: any = new SignJWTJose(vp_token_payload)
							.setProtectedHeader(vp_token_header)
							.setIssuedAt()
							.setIssuer(subjectDid)
							.setSubject(subjectDid)
							.setAudience(presentationOffer.client_id)
							.setNotBefore(Math.floor(Date.now() / 1000))
							.setExpirationTime('15m')

						let { _protectedHeader: header, _payload: payload } = unsignedVpToken
						const signedVpToken = await signJWT({ header, trustedFramework, payload, privateKey })

						await OpenIdService.sendVPTokenResponse({ presentationOffer, signedVpToken, state, presentationDefinition })

						resolve(verifiableCredential)
					} catch (error) {
						reject(error)
					}
				},
				onCancel: () => reject(new Error(t(openIdI18nKeys.ERROR_CANCEL_PRESENTATION))),
			})
		)

		for (const item of presentations) {
			await saveCredential(item, 'presentation')
		}

		return t(openIdI18nKeys.SUCCESS_PRESENTATION)
	} catch (error) {
		throw error
	}
}
