import styled from 'styled-components'
import { ColorKeys, getThemeColor } from '../../../constants/Colors'
import SecuredInput from './components/SecuredInput'
import { FONT_FAMILY } from '../../../constants/fontFamily'

const InputStyled = styled(SecuredInput).attrs((props) => {
  return {
    selectionColor: getThemeColor(ColorKeys.primary),
    errorStyle: {
      color: getThemeColor(ColorKeys.error),
    },
    containerStyle: {
      paddingHorizontal: 0,
    },
    inputContainerStyle: {
      marginTop: 10,
    },
    inputStyle: {
      fontSize: 16,
    },

    placeholderTextColor: getThemeColor(ColorKeys.placeholder),
    underlineColor: getThemeColor(ColorKeys.placeholder),
    theme: { colors: { primary: getThemeColor(ColorKeys.primary) } },
    activeOutlineColor: getThemeColor(ColorKeys.secondary),
    outlineColor: getThemeColor(ColorKeys.secondary),
    contentStyle: { lineHeight: 25, fontFamily: FONT_FAMILY.PRINCIPAL },
    mode: props.mode ?? 'outlined',
  }
}) <any>`
  padding-left: 10px;
`

export const safeStyledInput = (component: any): any => {
  try {
    return styled(component)
  } catch (error) {
    return styled(SecuredInput)
  }
}

export default InputStyled
