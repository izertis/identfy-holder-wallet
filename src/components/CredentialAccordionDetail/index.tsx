import React from 'react'
import { useTranslation } from 'react-i18next'
import localeES from './i18n/es'
import { Container, LabelText, Row, ValueText } from './styles'
import i18next from 'i18next'
import AccordionDetailI18nKeys from './i18n/keys'
import { getTimeFormat } from '../../utils/dates'

interface CredentialAccordionDetailProps {
  id?: string
  type?: string[]
  organization?: string
  trustedFramework?: string
  issuanceDate?: string
  validFrom?: string
  status?: string
  additionalInfo?: { [key: string]: any } // Additional JSON data
}

const CredentialAccordionDetail: React.FC<CredentialAccordionDetailProps> = ({
  id,
  type,
  organization,
  trustedFramework,
  issuanceDate,
  validFrom,
  status,
  additionalInfo,
}) => {

  const bundle = "AccordionDetail"
  i18next.addResourceBundle("es", bundle, localeES)
  const { t } = useTranslation(bundle)

  let translatedStatus
  if (status === 'Revoked') {
    translatedStatus = t(AccordionDetailI18nKeys.REVOKED)
  } else {
    translatedStatus = t(AccordionDetailI18nKeys.VALID)
  }

  return (
    <Container>
      {id && (
        <Row style={{ alignItems: 'flex-start' }}>
          <LabelText>{t(AccordionDetailI18nKeys.ID)}</LabelText>
          <ValueText
            maxWidth='80%'
            numberOfLines={3}
            ellipsizeMode="tail"
          >
            {id}
          </ValueText>
        </Row>
      )}
      {organization && (
        <Row>
          <LabelText>{t(AccordionDetailI18nKeys.ORGANIZATION)}</LabelText>
          <ValueText
            maxWidth='60%'
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {organization}
          </ValueText>
        </Row>
      )}
      {trustedFramework && (
        <Row>
          <LabelText>{t(AccordionDetailI18nKeys.TRUSTED_FRAMEWORK)}</LabelText>
          <ValueText
            maxWidth='60%'
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {trustedFramework}
          </ValueText>
        </Row>
      )}
      {issuanceDate && (
        <Row>
          <LabelText>{t(AccordionDetailI18nKeys.ISSUANCE_DATE)}</LabelText>
          <ValueText
            maxWidth='60%'
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {getTimeFormat(issuanceDate!)}
          </ValueText>
        </Row>
      )}
      {validFrom && (
        <Row>
          <LabelText>{t(AccordionDetailI18nKeys.VALID_FROM)}</LabelText>
          <ValueText
            maxWidth='60%'
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {getTimeFormat(validFrom!)}
          </ValueText>
        </Row>
      )}

      <Row>
        <LabelText>{t(AccordionDetailI18nKeys.STATUS)}</LabelText>
        <ValueText
          maxWidth='60%'
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {translatedStatus ?? t(AccordionDetailI18nKeys.UNDETERMINED)}
        </ValueText>
      </Row>

      {type && (
        <Row>
          <LabelText>{t(AccordionDetailI18nKeys.CREDENTIAL)}</LabelText>
          <ValueText
            maxWidth='60%'
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {type}
          </ValueText>
        </Row>
      )}

      {/* Additional Info Section */}
      {additionalInfo && Object.keys(additionalInfo).length > 0 && (
        <>
          <Row marginTop={'10px'}>
            <LabelText fontWeight='bold'>{t('Información RAW: ')}</LabelText>
          </Row>
          {Object.entries(additionalInfo).map(([key, value]) => (
            <Row key={key}>
              <LabelText>{key}{': '}</LabelText>
              <ValueText
                maxWidth='65%'
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {String(value)}
              </ValueText>
            </Row>
          ))}
        </>
      )}
    </Container>
  )
}

export default CredentialAccordionDetail
