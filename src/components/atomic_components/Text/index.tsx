import { Text } from 'react-native-paper'
import styled from 'styled-components'
import { getThemeColor, ColorKeys } from '../../../constants/Colors'
import { FONT_FAMILY } from '../../../constants/fontFamily'

const getFontFamily = ({
  fontFamily,
  fontWeight,
}: {
  fontFamily?: string
  fontWeight?: string
}) => {
  if (fontFamily && fontWeight) {
    return (
      Object.values(FONT_FAMILY).find(
        (fm) => fm === `${fontFamily}-${fontWeight}`
      ) ?? fontFamily
    )
  } else if (fontFamily) {
    return fontFamily
  } else if (fontWeight) {
    return (
      FONT_FAMILY[`PRINCIPAL_${fontWeight}` as keyof typeof FONT_FAMILY] ??
      FONT_FAMILY.PRINCIPAL
    )
  } else {
    return FONT_FAMILY.PRINCIPAL
  }
}

const TextStyled = styled(Text) <{
  title?: boolean
  bold?: boolean
  alignJustify?: boolean
  style?: any
  theme?: 'light' | 'dark'
  fontFamily?: string
  fontWeight?: string
}>`
  color: ${({ title, theme }) =>
    title
      ? `${getThemeColor(ColorKeys.primary)}`
      : getThemeColor(ColorKeys.text, theme)};
  font-size: 14px;
  font-family: ${({ fontFamily, fontWeight }) =>
    getFontFamily({ fontFamily, fontWeight })};
  text-align: ${({ alignJustify }) => (alignJustify ? 'justify' : 'left')};
  ${({ title, bold, fontWeight }) =>
    title || bold || fontWeight ? `font-weight: ${fontWeight ?? 'bold'};` : ''}
`

export default TextStyled

export const safeStyledText = (component: any): any => {
  try {
    return styled(component)
  } catch (error) {
    return styled(Text)
  }
}
