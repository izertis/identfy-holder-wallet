import { useCallback, useEffect, useMemo, useState } from 'react'
import { ModalProps } from '../../context/Modal.context'
import Header from '../Header'
import i18next from 'i18next'
import localeES from './i18n/es'
import { useTranslation } from 'react-i18next'
import { View } from '../Themed'
import CredentialList from './components/CredentialList'
import { getCredentialsList } from '../../utils/keychain'
import CredentialsEmptyState from './components/CredentialsEmptyState'
import { CredentialData, Format, PresentationDefinition } from '../../services/open-id/types'
import requestPresentationModalI18nKeys from './i18n/keys'
import RequestPresentationModalStyled from './styles'
import jp from 'jsonpath'
import jwt from 'jsonwebtoken'
import { Schema, Validator } from "jsonschema"

const RequestPresentationModal = (props: ModalProps) => {
  const bundleName = 'RequestPresentationModal'
  i18next.addResourceBundle('es', bundleName, localeES)
  const { t } = useTranslation(bundleName)

  const [showSelectCredentials, setShowSelectCredentials] = useState(false)
  const [credentialsSelected, setCredentialsSelected] = useState<string[]>([])
  const [credentials, setCredentials] = useState<CredentialData[]>([])

  const [plainCredentials, setPlainCredentials] = useState<CredentialData[]>([])

  const fetchData = useCallback(async () => {
    // Store credentials with jwt format
    const credentialsList = await getCredentialsList()
    setCredentials(credentialsList)
    // Store plain credentials to use info (alg, nbf...etc.)
    const parsedCredentialsList = credentialsList.map((credential) => {
      const decodedCredentials = jwt.decode(credential.credential as any, { complete: true })
      return { ...credential, credential: decodedCredentials }
    })
    setPlainCredentials(parsedCredentialsList as any)
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const presentationDefinition: PresentationDefinition = props.modalProps.presentationDefinition

  const filteredCredentials = useMemo(() => {
    const currentDateInSeconds = Math.floor(Date.now() / 1000)

    const isNotExpired = (credential: CredentialData) => {
      const exp = credential?.credential?.payload?.exp
      return exp === undefined || currentDateInSeconds <= exp
    }

    const readyToUse = (credential: CredentialData) => {
      const nbf = credential?.credential?.payload?.nbf
      return nbf === undefined || currentDateInSeconds >= nbf
    }

    const isNotRevoked = async (credential: CredentialData) => {
      const status = credential?.status
      const revoked = status === 'Revoked'
      return !revoked
    }

    return plainCredentials.filter(credential => isNotExpired(credential) && readyToUse(credential) && isNotRevoked(credential))
  }, [plainCredentials])

  const validCredentials = useMemo(() => {
    const validCredentialsArray: CredentialData[] = []

    for (const inputDescriptor of presentationDefinition.input_descriptors) {
      const { constraints } = inputDescriptor
      const descriptorFormats = inputDescriptor.format ?? presentationDefinition.format
      const validFormats = Object.keys(descriptorFormats)

      for (const credential of filteredCredentials) {
        if (!credential.credential) continue

        const credentialFormat = credential.credential.header?.typ?.toLowerCase()
        const credentialAlg = credential.credential.header.alg

        const isValidFormat = validFormats.some((format) => format.includes(credentialFormat!))
        const isValidAlg = validFormats.some((format) => {
          return descriptorFormats[format as keyof Format]?.alg.includes(credentialAlg)
        })

        if (isValidFormat && isValidAlg) {

          let isValidCredential = true

          if (constraints && constraints.fields && constraints.fields.length > 0) {

            for (const field of constraints.fields) {

              let fieldValid = false

              for (const path of field.path) {
                // Filter by attribute indicated in presentation definition
                const attribute = jp.query(credential.credential.payload, path, 1)
                if (attribute.length) {
                  if (field.filter) {
                    const validator = new Validator()
                    const validationResult = validator.validate(attribute[0], field.filter as Schema)
                    if (!validationResult.errors.length) {
                      fieldValid = true
                      break
                    }
                  } else {
                    fieldValid = true
                    break
                  }
                }
              }
              if (!fieldValid) {
                isValidCredential = false
                break
              }
            }
          } else {
            // If there are no constraints, all credentials are valid
            if (!validCredentialsArray.includes(credential)) {
              validCredentialsArray.push(credential)
            }
            break
          }
          if (isValidCredential) {
            // Store credential only when all fields have been validated
            if (!validCredentialsArray.includes(credential)) {
              validCredentialsArray.push(credential)
            }
          }

        }
      }
    }
    return validCredentialsArray
  }, [filteredCredentials, presentationDefinition])

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
        props.onCancel?.()
      } else {
        handleAccept(credentialsSelected)
      }
    } else {
      props.onCancel?.()
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
      <Header
        title={t(requestPresentationModalI18nKeys.TITLE)}
        onCancel={() => props.onCancel?.()}
      />
      <View>

        <RequestPresentationModalStyled.ModalContent>
          <RequestPresentationModalStyled.ModalText>
            {t(
              !showSelectCredentials
                ? requestPresentationModalI18nKeys.DESCRIPTION
                : requestPresentationModalI18nKeys.SELECT_CREDENTIAL_DESCRIPTION,
            )}
          </RequestPresentationModalStyled.ModalText>

          {showSelectCredentials && (
            <RequestPresentationModalStyled.CredentialContainer>
              {validCredentials.length ? (
                <CredentialList
                  credentials={validCredentials}
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
          {t(getButtonText())}
        </RequestPresentationModalStyled.Button>
      </RequestPresentationModalStyled.ButtonContainer>
    </RequestPresentationModalStyled.ModalContainer>
  )
}

export default RequestPresentationModal
