import { DescriptionText } from '../../../../components/atomic_components/Text/variants'
import { useTranslation } from 'react-i18next'
import { SCREEN } from '../../../../constants/screens'
import CredentialsI18nKeys from '../../i18n/keys'
import CredentialStyled from '../../styles'
import { getTimeFormat } from '../../../../utils/dates'
import PDFGenerator from '../../../../components/PdfGenerator'
import { List } from 'react-native-paper'
import { useState } from 'react'
import { ColorKeys, getThemeColor } from '../../../../constants/Colors'
import jwt from 'jsonwebtoken'

interface Props {
  date?: string
  title?: string
  issuer?: string
  key?: string
  credential?: string
}
const CredentialDetail = (props: Props) => {
  const { t } = useTranslation(SCREEN.Credentials)

  const [expanded, setExpanded] = useState(false)

  const handlePress = () => setExpanded(!expanded)

  let credential

  if (typeof props.credential === 'string') {
    if (props.credential.startsWith('ey')) {
      credential = jwt.decode(props.credential)
    } else {
      try {
        credential = JSON.parse(props.credential)
      } catch (error) {
        console.error('Error parsing credential as JSON:', error)
      }
    }
  } else {
    credential = props.credential
  }

  return (
    <CredentialStyled.CredentialDetailContainer key={props.key}>
      <List.Section>
        <List.Accordion
          title={
            <CredentialStyled.CredentialDetailTitleContainer>
              <DescriptionText>{getTimeFormat(props.date!)}</DescriptionText>
              <DescriptionText bold>{props.title}</DescriptionText>
            </CredentialStyled.CredentialDetailTitleContainer>
          }
          description={
            <>
              <DescriptionText>
                {t(CredentialsI18nKeys.CREDENTIAL_DETAILS_ISSUER)}
                {': '}
              </DescriptionText>
              <DescriptionText>{props.issuer}</DescriptionText>
            </>
          }
          descriptionNumberOfLines={1}
          expanded={expanded}
          style={{ paddingVertical: -10, backgroundColor: getThemeColor(ColorKeys.background) }}
          onPress={handlePress}>
          <List.Item
            title={<PDFGenerator data={credential} />} />
        </List.Accordion>
      </List.Section>
    </CredentialStyled.CredentialDetailContainer>)
}

export default CredentialDetail
