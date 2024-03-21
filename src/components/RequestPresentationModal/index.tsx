import { useEffect, useState } from 'react'
import { ModalProps } from '../../context/Modal.context'
import Header from '../Header'
import i18next from 'i18next'
import localeES from './i18n/es'
import { useTranslation } from 'react-i18next'
import { View } from '../Themed'
import CredentialList from './components/CredentialList'
import { getCredentialsList } from '../../utils/keychain'
import CredentialsEmptyState from './components/CredentialsEmptyState'
import { CredentialData } from '../../types/keychain'
import requestPresentationModalI18nKeys from './i18n/keys'
import RequestPresentationModalStyled from './styles'


const RequestPresentationModal = (props: ModalProps) => {
  const [showSelectCredentials, setShowSelectCredentials] = useState(false)
  const [credentialsSelected, setCredentialsSelected] = useState<string[]>([])
  const [credentials, setCredentials] = useState<CredentialData[]>([])

  const bundleName = 'RequestPresentationModal'
  i18next.addResourceBundle('es', bundleName, localeES)
  const { t } = useTranslation(bundleName)

  useEffect(() => {
    const fetchData = async () => {
      const credentialsList = await getCredentialsList()
      setCredentials(credentialsList)
    }
    fetchData()
  }, [])

  const handleAccept = async (credentialsIds: string[]) => {
    const signedCredentials = credentialsIds.map((credentialId) => {
      const foundCredential = credentials.find(({ id }) => id === credentialId)
      return foundCredential?.credential
    })
    props.onAccept?.(signedCredentials)
  }

  const processCredentials = () => {
    if (!showSelectCredentials) {
      setShowSelectCredentials(true)
    } else if (credentials.length) {
      if (credentialsSelected.length === 0) {
        if (props.onCancel) {
          props.onCancel()
        }
      } else {
        handleAccept(credentialsSelected)
      }
    } else if (props.onCancel) {
      props.onCancel()
    }
  }

  const getButtonText = () => {
    if (!showSelectCredentials) {
      return requestPresentationModalI18nKeys.REQUEST_CONTINUE
    } else if (credentialsSelected.length > 0) {
      return requestPresentationModalI18nKeys.REQUEST
    } else {
      return requestPresentationModalI18nKeys.GO_BACK
    }
  }

  return (
    <RequestPresentationModalStyled.ModalContainer>
      <View>
        <Header
          title={t(requestPresentationModalI18nKeys.TITLE)}
          onCancel={() => props.onCancel?.()}
        />
        <RequestPresentationModalStyled.ModalContent>
          <RequestPresentationModalStyled.ModalText>
            {t(
              !showSelectCredentials
                ? requestPresentationModalI18nKeys.DESCRIPTION
                : requestPresentationModalI18nKeys.SELECT_CREDENTIAL_DESCRIPTION,
              props.modalProps?.identificators ?? {}
            )}
          </RequestPresentationModalStyled.ModalText>

          {showSelectCredentials && (
            <RequestPresentationModalStyled.CredentialContainer>
              {!!credentials?.length ? (
                <CredentialList
                  credentials={credentials}
                  onChangeSelectedCredentials={(selectedCredentials) => {
                    setCredentialsSelected(selectedCredentials)
                  }}
                />
              ) : (
                <CredentialsEmptyState />
              )}
            </RequestPresentationModalStyled.CredentialContainer>
          )}
        </RequestPresentationModalStyled.ModalContent>
      </View>
      <RequestPresentationModalStyled.ButtonContainer>
        <RequestPresentationModalStyled.Button onPress={processCredentials}>
          <RequestPresentationModalStyled.ButtonText>
            {t(getButtonText())}
          </RequestPresentationModalStyled.ButtonText>
        </RequestPresentationModalStyled.Button>
      </RequestPresentationModalStyled.ButtonContainer>
    </RequestPresentationModalStyled.ModalContainer>
  )
}

export default RequestPresentationModal
