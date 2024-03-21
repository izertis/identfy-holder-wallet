import React from "react"
import RequestPresentationModalStyled from "../styles"
import { Checkbox } from "react-native-paper"
import { DescriptionText } from "../../atomic_components/Text/variants"
import { getThemeColor, ColorKeys } from "../../../constants/Colors"
interface Props {
  isCheck: boolean
  onPressCheckBox: () => void
}
const HeaderCredential = (props: Props) => {
  return (
    <RequestPresentationModalStyled.HeaderContainer>
      <Checkbox.Android
        color={getThemeColor(ColorKeys.primary)}
        status={props.isCheck ? "checked" : "unchecked"}
        onPress={props.onPressCheckBox}
      />
      <DescriptionText>Todo</DescriptionText>
    </RequestPresentationModalStyled.HeaderContainer>
  )
}

export default HeaderCredential
