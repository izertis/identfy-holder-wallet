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

const RequestCredentialModal = (props: ModalProps) => {
  const [data, setData] = useState("")
  const bundleName = "RequestCredentialModal"
  i18next.addResourceBundle("es", bundleName, localeES)
  const { t } = useTranslation(bundleName)
  const handleAccept = (propsModal: any) => {
    props.onAccept?.(propsModal)
    props.onCancel?.()
  }
  const credentialParams = {
    [requestCredentialModalI18nKeys.ENTITY]: props.modalProps?.entity,
    [requestCredentialModalI18nKeys.NETWORK]: props.modalProps?.network,
    [requestCredentialModalI18nKeys.PUBLIC_KEY]: props.modalProps?.publicKey,
  }

  const dropdownItems: any[] = []

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
                <RequestCredentialModalStyled.ModalText>
                  {value}
                </RequestCredentialModalStyled.ModalText>
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
          <RequestCredentialModalStyled.ButtonText>
            {t(requestCredentialModalI18nKeys.REQUEST)}
          </RequestCredentialModalStyled.ButtonText>
        </RequestCredentialModalStyled.Button>
      </RequestCredentialModalStyled.ButtonContainer>
    </RequestCredentialModalStyled.ModalContainer>
  )
}

export default RequestCredentialModal
