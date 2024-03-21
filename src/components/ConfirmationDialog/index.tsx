import { Dialog, Paragraph, Portal } from 'react-native-paper'
import { ButtonContainer, StyledButton } from './styles'
import { ColorKeys, getThemeColor } from '../../constants/Colors'
import i18next from 'i18next'
import { useTranslation } from 'react-i18next'
import localeES from './i18n/es'
import ConfirmationDialogI18nKeys from './i18n/keys'


export default function ConfirmationDialog(props: {
  visible: boolean,
  message?: string,
  onCancel: () => void,
  onPress: () => void,
  titleLabel?: string,
  cancelButtonLabel?: string,
  continueButtonLabel?: string,
  danger?: boolean,
  children?: React.ReactNode
}): JSX.Element {

  const bundle = "ConfirmDialog"
  i18next.addResourceBundle("es", bundle, localeES)
  const { t } = useTranslation(bundle)

  const titleLabel = props.titleLabel || t(ConfirmationDialogI18nKeys.DIALOG_TITLE)
  const cancelButtonLabel = props.cancelButtonLabel || t(ConfirmationDialogI18nKeys.BUTTON_CANCEL)
  const continueButtonLabel = props.continueButtonLabel || t(ConfirmationDialogI18nKeys.BUTTON_CONFIRM)

  return (
    <Portal>
      <Dialog
        visible={props.visible}
        dismissable={false}
        onDismiss={props.onCancel}
        style={{ backgroundColor: getThemeColor(ColorKeys.background) }}
      >
        <Dialog.Title style={{ fontWeight: 'bold' }}>{titleLabel}</Dialog.Title>
        <Dialog.Content>{
          props.message
            ? <Paragraph>{props.message}</Paragraph>
            : props.children
        }</Dialog.Content>
        <ButtonContainer>
          <Dialog.Actions>
            <StyledButton textColor={getThemeColor(ColorKeys.text)} buttonColor={getThemeColor(ColorKeys.primary)} uppercase={false} onPress={props.onCancel}>{cancelButtonLabel}</StyledButton>
          </Dialog.Actions>
          <Dialog.Actions>
            <StyledButton textColor={getThemeColor(ColorKeys.text)} buttonColor={props.danger ? 'red' : getThemeColor(ColorKeys.primary)} uppercase={false} onPress={props.onPress}>{continueButtonLabel}</StyledButton>
          </Dialog.Actions>
        </ButtonContainer>
      </Dialog>
    </Portal>
  )
}