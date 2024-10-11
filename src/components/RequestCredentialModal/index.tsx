import { useState } from "react"
import RequestCredentialModalStyled from "./styles"
import { ModalProps } from "../../context/Modal.context"
import Header from "../Header"
import i18next from "i18next"
import localeES from "./i18n/es"
import { useTranslation } from "react-i18next"
import requestCredentialModalI18nKeys from "./i18n/keys"
import DropDownPicker from "../DropDownPicker"
import { View } from "../Themed"
import { filterCredentialType } from "../../services/open-id/utils"
import { Text } from "react-native"

const RequestCredentialModal = (props: ModalProps) => {
  const [data, setData] = useState("")
  const bundleName = "RequestCredentialModal"
  i18next.addResourceBundle("es", bundleName, localeES)
  const { t } = useTranslation(bundleName)

  const handleAccept = (data: string) => {
    if (data) {
      try {
        const parsedData = JSON.parse(data)
        props.onAccept?.(parsedData)
      } catch (error) {
        console.error("Error parsing data:", error)
      }
    } else if (props.onCancel) {
      props.onCancel?.()
    }
  }
  if (props.modalProps.trustedFramework === 'epic') props.modalProps.trustedFramework = 'Alastria epic'

  const credentialParams = {
    [requestCredentialModalI18nKeys.ENTITY]: props.modalProps?.entity,
    [requestCredentialModalI18nKeys.NETWORK]: props.modalProps?.trustedFramework.toUpperCase(),
  }

  const dropdownItems = props.modalProps.availableCredentials.map((item: { types: string[] }) => {
    const filteredTypes = filterCredentialType(item.types) ?? ''
    const label = filteredTypes.pop() ?? ''
    return { label, value: JSON.stringify(item) }
  })

  const getButtonText = (): string => {
    if (data) {
      return requestCredentialModalI18nKeys.REQUEST
    } else {
      return requestCredentialModalI18nKeys.CANCEL
    }
  }

  return (
    <RequestCredentialModalStyled.ModalContainer>
      <View>
        <Header
          title={t(requestCredentialModalI18nKeys.TITLE)}
          onCancel={() => props.onCancel?.()}
        />
        <RequestCredentialModalStyled.ModalContent>
          <RequestCredentialModalStyled.ModalText>
            {t(requestCredentialModalI18nKeys.DESCRIPTION)}
          </RequestCredentialModalStyled.ModalText>
          <RequestCredentialModalStyled.CredentialContainer>
            {Object.entries(credentialParams).map(([key, value]) => (

              <RequestCredentialModalStyled.ModalTextContent key={`ModalTextContent-${key}`}>
                <RequestCredentialModalStyled.ModalBoldText>
                  {t(key)}
                </RequestCredentialModalStyled.ModalBoldText>
                <Text numberOfLines={1} ellipsizeMode="tail" style={{ width: 270 }} >
                  <RequestCredentialModalStyled.ModalText>
                    {value}
                  </RequestCredentialModalStyled.ModalText>
                </Text>
              </RequestCredentialModalStyled.ModalTextContent>
            ))}
          </RequestCredentialModalStyled.CredentialContainer>
          <RequestCredentialModalStyled.ModalText>
            {t(requestCredentialModalI18nKeys.CREDENTIAL_REQUEST_DESCRIPTION)}
          </RequestCredentialModalStyled.ModalText>
          <RequestCredentialModalStyled.DropDownPickerContainer>
            <DropDownPicker onChange={setData} items={dropdownItems} />
          </RequestCredentialModalStyled.DropDownPickerContainer>
        </RequestCredentialModalStyled.ModalContent>
      </View>
      <RequestCredentialModalStyled.ButtonContainer>
        <RequestCredentialModalStyled.Button
          onPress={() => handleAccept(data)}
        >
          {t(getButtonText())}
        </RequestCredentialModalStyled.Button>
      </RequestCredentialModalStyled.ButtonContainer>
    </RequestCredentialModalStyled.ModalContainer>
  )
}

export default RequestCredentialModal
