import styled from "styled-components/native"
import { DescriptionText } from "../atomic_components/Text/variants"
import Icon from "react-native-vector-icons/MaterialIcons"
import { ColorKeys, getThemeColor } from "../../constants/Colors"
import { safeStyledText } from "../atomic_components/Text"

const DropDownStyled = {
  RelativeView: styled.View<{ withListArrow?: boolean }>`
    position: relative;
    width: auto;
    top: ${({ withListArrow }) => (withListArrow ? "10px" : "0px")};
  `,
  DropDownContainer: styled.View`
    z-index: 10;
  `,
  DropDownTouchableContainer: styled.TouchableOpacity`
    display: flex;
    flex-direction: row;
    align-items: center;
  `,
  DescriptionText: safeStyledText(DescriptionText)<{
    open: boolean
    theme?: "dark" | "light"
    activationColor?: string
  }>`
    color: ${({ open, theme, activationColor }:any) =>
      open
        ? activationColor
          ? getThemeColor(ColorKeys.primary, theme)
          : getThemeColor(ColorKeys.text, theme)
        : getThemeColor(ColorKeys.text, theme)};
  `,
  Icon: styled(Icon).attrs(({ open }: { open: boolean }) => ({
    name: `expand-${open ? "less" : "more"}`,
  }))<{
    open: boolean
    theme?: "dark" | "light"
    activationColor?: string
  }>`
    margin-left: 20px;
    color: ${({ open, theme, activationColor }) =>
      open
        ? activationColor
          ? getThemeColor(ColorKeys.primary, theme)
          : getThemeColor(ColorKeys.text, theme)
        : getThemeColor(ColorKeys.text, theme)};
  `,
}

export default DropDownStyled
