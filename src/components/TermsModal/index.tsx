import { Container, ModalText, ModalTitle, ModalView, TextContainer } from "./styles"
import ButtonStyled from "../atomic_components/Button"
import { useTranslation } from "react-i18next"
import localeES from "./i18n/es"
import { ModalProps } from "../../context/Modal.context"
import i18next from "i18next"
import termsModalI18nKeys from "./i18n/keys"
import { Text } from 'react-native'

export default function TermsModal(props: ModalProps): JSX.Element {
  const bundle = "TermsModal"
  i18next.addResourceBundle("es", bundle, localeES)
  const { t } = useTranslation(bundle)

  const onClose = () => {
    props.onCancel!()
  }

  const renderFormattedText = (text: string) => {
    const parts = text.split('**')
    return parts.map((part, index) => {
      if (index % 2 === 0) {
        return <Text key={index}>{part}</Text>
      } else {
        return <Text key={index} style={{ fontWeight: 'bold' }}>{part}</Text>
      }
    })
  }

  return (
    <ModalView>
      <ModalTitle>{t(termsModalI18nKeys.MODAL_TITLE)}</ModalTitle>
      <TextContainer showsVerticalScrollIndicator={true} >
        <ModalText>{renderFormattedText(t(termsModalI18nKeys.TERMS_AND_CONDITIONS_CONTENT))}</ModalText>
        <Container>
          <ButtonStyled
            mode="contained"
            uppercase={false}
            onPress={() => {
              onClose()
            }}
          >
            {props.modalProps?.buttonText ?? t(termsModalI18nKeys.MODAL_BUTTON)}
          </ButtonStyled>
        </Container>
      </TextContainer>
    </ModalView>
  )
}
