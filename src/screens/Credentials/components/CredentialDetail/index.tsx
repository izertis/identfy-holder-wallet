import { DescriptionText } from '../../../../components/atomic_components/Text/variants'
import { useTranslation } from 'react-i18next'
import { SCREEN } from '../../../../constants/screens'
import CredentialsI18nKeys from '../../i18n/keys'
import CredentialStyled from '../../styles'
import { getTimeFormat } from '../../../../utils/dates'
import PDFGenerator from '../../../../components/PdfGenerator'
import { List } from 'react-native-paper'
import { useCallback, useEffect, useMemo, useState } from 'react'
import jwt from 'jsonwebtoken'
import { Credential } from '../../../../services/open-id/types'
import { filterCredentialType, getTrustedFrameworkFromDid } from '../../../../services/open-id/utils'
import { View } from 'react-native'
import { capitalizeString } from '../../../../utils/string'
import CredentialAccordionDetail from '../../../../components/CredentialAccordionDetail'
import { checkRevocationStatus } from '../../../../services/open-id/checkRevocation'
import { markItemAsRevoked } from '../../../../utils/keychain'
import Loading from '../../../../components/Loading'

interface Props {
	issuer: string
	key?: string
	credential?: Credential | string
	status?: string
	timestamp?: Date
}

const CredentialDetail = (props: Props) => {
	const { t } = useTranslation(SCREEN.Credentials)
	const [expanded, setExpanded] = useState(false)
	const [credentialCurrentStatus, setcredentialCurrentStatus] = useState(props.status)
	const [loading, setLoading] = useState(false)

	const credential = useMemo(() => {
		if (typeof props.credential === 'string') {
			if (props.credential.startsWith('ey')) {
				return jwt.decode(props.credential)
			} else {
				try {
					return JSON.parse(props.credential)
				} catch (error) {
					console.error('Error parsing credential as JSON:', error)
					return null
				}
			}
		}
		return props.credential
	}, [props.credential])

	const handlePress = useCallback(async () => {
		if (!expanded) {
			setExpanded(true)
			setLoading(true)

			// Simulate a delay to see the loader
			await new Promise((resolve) => setTimeout(resolve, 400))

			if (credentialCurrentStatus !== 'Revoked') {
				const revocationStatus = await checkRevocationStatus(props.credential as string)
				if (revocationStatus === 'Revoked' || revocationStatus.valid === false) {
					await markItemAsRevoked(props.timestamp!, 'credential')
					setcredentialCurrentStatus('Revoked')
				}
			}
			setLoading(false)
		} else {
			setExpanded(false)
		}
	}, [expanded, credentialCurrentStatus, props.credential, props.timestamp])

	useEffect(() => {
		setcredentialCurrentStatus(props.status)
	}, [props.status])

	const parsedCredential = useMemo(() => credential?.vc ?? credential?.data ?? {}, [credential])
	const { expirationDate, type, issuanceDate, validFrom, issuer } = parsedCredential

	const formattedExpDate = useMemo(
		() => (expirationDate ? getTimeFormat(expirationDate) : t(CredentialsI18nKeys.NEVER)),
		[expirationDate, t]
	)

	const isExpired = useMemo(() => new Date(expirationDate!) < new Date(), [expirationDate])

	const trustedFramework = useMemo(() => {
		let framework = getTrustedFrameworkFromDid(issuer)
		return framework === 'epic' ? 'Alastria Epic' : framework
	}, [issuer])

	return (
		<CredentialStyled.CredentialDetailContainer>
			<List.Section key={props.key} style={{ width: '100%' }}>
				<CredentialStyled.StyledAccordion
					title={
						<DescriptionText numberOfLines={1} ellipsizeMode='tail'>
							<CredentialStyled.LabelText>{t(CredentialsI18nKeys.CREDENTIAL_DETAIL_TYPE)}</CredentialStyled.LabelText>
							{filterCredentialType(type!)}
						</DescriptionText>
					}
					description={
						<View>
							<DescriptionText>
								<CredentialStyled.LabelText>{t(CredentialsI18nKeys.ISSUANCE_DATE)}</CredentialStyled.LabelText>{' '}
								{getTimeFormat(issuanceDate)}
							</DescriptionText>
							<DescriptionText>
								<CredentialStyled.LabelText>{t(CredentialsI18nKeys.EXPIRES)}</CredentialStyled.LabelText>
								<CredentialStyled.ExpirationText isExpired={isExpired}>
									{formattedExpDate}
								</CredentialStyled.ExpirationText>
							</DescriptionText>
						</View>
					}
					titleNumberOfLines={1}
					descriptionNumberOfLines={1}
					expanded={expanded}
					onPress={handlePress}
				>
					{loading ? (
						<CredentialStyled.LoadingContainer>
							<Loading size='small' />
						</CredentialStyled.LoadingContainer>
					) : (
						<>
							<CredentialAccordionDetail
								organization={props.issuer}
								trustedFramework={capitalizeString(trustedFramework)}
								validFrom={validFrom}
								status={credentialCurrentStatus}
								additionalInfo={parsedCredential.credentialSubject}
							/>
							<List.Item title={<PDFGenerator data={credential} />} />
						</>
					)}
				</CredentialStyled.StyledAccordion>
			</List.Section>
		</CredentialStyled.CredentialDetailContainer>
	)
}

export default CredentialDetail
