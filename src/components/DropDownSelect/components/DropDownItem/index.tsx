import React from "react"
import { TouchableOpacity } from "react-native"
import CheckBoxStyled from "../../../atomic_components/CheckBox"
import { DescriptionText } from "../../../atomic_components/Text/variants"
import { ConfigurationType } from "../../type"
import DropDownItemStyled from "./styled"
interface Props {
  isSelected: boolean
  text: string
  onPress: () => void
  configuration?: ConfigurationType
}
const DropDownItem = (props: Props) => {
  return (
    <DropDownItemStyled.TouchableOpacity
      onPress={props.onPress}
    >
      {props.configuration?.withItemCheckBox !== false && (
        <CheckBoxStyled checked={props.isSelected} />
      )}
      <DescriptionText >{props.text}</DescriptionText>
    </DropDownItemStyled.TouchableOpacity>
  )
}

export default DropDownItem
