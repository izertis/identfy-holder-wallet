import React from 'react'
import ActionButton, {
  ButtonContainer,
} from '../../../../components/atomic_components/ActionButton'
import { TEST_LABELS } from '../../constants/testLabels'
import { ColorKeys, getThemeColor } from '../../../../constants/Colors'
import { useTranslation } from 'react-i18next'
import { SCREEN } from '../../../../constants/screens'
import CredentialsI18nKeys from '../../i18n/keys'

interface Props {
  onPress?: () => void
}
const ButtonScanner = (props: Props) => {
  const { t } = useTranslation(SCREEN.Credentials)
  return (
    <ButtonContainer>
      <ActionButton
        buttonColor={getThemeColor(ColorKeys.primary)}
        testID={TEST_LABELS.ActionButton}
        size={82}
        onPress={props.onPress}
      >
        {t(CredentialsI18nKeys.BUTTON_SCAN)}
      </ActionButton>
    </ButtonContainer>
  )
}

export default ButtonScanner
