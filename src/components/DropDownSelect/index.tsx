import React, { useEffect, useState } from "react"
import { View } from "../Themed"
import DropDownStyled from "./style"
import DropDownItem from "./components/DropDownItem"
import Color, {
  ColorKeys,
  getBackgroundTheme,
  getThemeColor,
} from "../../constants/Colors"
import { TextStyle, ViewStyle } from "react-native"
import { ConfigurationType, DropDownItemArrowConfigType } from "./type"
import DropDownValue from "./components/DropDownValue"
import DropDownItemListArrow from "./components/DropDownItemListArrow"

interface Props {
  title: string
  data: object
  onChange: (selectedData: any) => void
  backgroundColor?: string
  containerStyle: ViewStyle
  withListArrow?: boolean
  listArrowPosition?: "left" | "center" | "right"
  configuration?: ConfigurationType
  titleStyle?: TextStyle
  activationColor?: string
  multiple?: boolean
  valueContentStyle?: ViewStyle
  itemContainerStyle?: ViewStyle
  testID?: string
}

const DropDownSelect = (props: Props) => {
  const [isExpand, setIsExpand] = useState(false)
  const initialSelectedData = Object.fromEntries(
    Object.keys(props.data).map((key) => [key, false])
  )
  const [selectedData, setSelectedData] = useState<any>(initialSelectedData)

  const theme = getBackgroundTheme(props.backgroundColor)

  useEffect(() => {
    props?.onChange?.(selectedData)
  }, [selectedData])
  return (
    <DropDownStyled.DropDownContainer
      style={{
        backgroundColor: props.backgroundColor,
        ...props.containerStyle,
      }}
      testID={props.testID}
    >
      <DropDownValue
        value={props.title}
        isExpand={isExpand}
        setIsExpand={setIsExpand}
        theme={theme}
        configuration={props.configuration}
        titleStyle={props.titleStyle}
        activationColor={props.activationColor}
        dropdownValueContentStyle={props.valueContentStyle}
      />
      {isExpand && (
        <DropDownStyled.RelativeView>
          <View
            style={{
              position: "absolute",
              width: "100%",
              borderWidth: 1,
              zIndex: 10,
              ...props.itemContainerStyle,
            }}
          >
            {props.data &&
              Object.entries(props.data).map(([key, value], index) => (
                <DropDownItem
                  key={`dropDownItem-${key}-${index}`}
                  onPress={() =>
                    setSelectedData({
                      ...(props.multiple
                        ? { ...selectedData }
                        : { ...initialSelectedData }),
                      [key]: !selectedData[key],
                    })
                  }
                  text={value}
                  isSelected={selectedData[key]}
                  configuration={props.configuration}
                />
              ))}
          </View>
          {props.withListArrow && (
            <DropDownItemListArrow
              style={props.itemContainerStyle}
              position={props.listArrowPosition}
            />
          )}
        </DropDownStyled.RelativeView>
      )}
    </DropDownStyled.DropDownContainer>
  )
}

export default DropDownSelect
