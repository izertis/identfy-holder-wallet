import { ViewStyle } from "react-native"

export type ConfigurationType = {
  withDropdownArrow?: boolean
  withItemCheckBox?: boolean
}
export type DropDownItemArrowConfigType = {
  position?: "left" | "center" | "right"
  style?: ViewStyle
}