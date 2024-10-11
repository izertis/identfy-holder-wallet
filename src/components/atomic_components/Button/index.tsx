import { Button as BaseButton } from 'react-native-paper'
import styled from 'styled-components/native'
import {
  ColorKeys,
  getColorByBackground,
  getThemeColor,
} from '../../../constants/Colors'
import { FONT_FAMILY } from '../../../constants/fontFamily'

const getBackgroundColor = (disabled?: boolean) => {
  return disabled
    ? getThemeColor(ColorKeys.disabled)
    : getThemeColor(ColorKeys.primary)
}

const ButtonStyled = styled(BaseButton).attrs((props) => ({
  labelStyle: {
    letterSpacing: 0.57,
    color: getColorByBackground(
      ColorKeys.buttonText,
      getBackgroundColor(props.disabled)
    ),
    fontFamily: FONT_FAMILY.PRINCIPAL,
    fontWeight: 'bold',
  },
  contentStyle: {
    height: 39,
    width: 224,
    borderRadius: 15,
    backgroundColor: getBackgroundColor(props.disabled),
    fontFamily: FONT_FAMILY.PRINCIPAL,
  },
}))``

export default ButtonStyled
