import React from "react"
import { Text, View, StatusBar, TouchableOpacity } from "react-native"
import { ColorKeys, getThemeColor } from "../../constants/Colors"
import HeaderStyled from "./styles"
import { IconButton } from "react-native-paper"

interface Props {
  title: string
  onCancel: () => void
}
const Header = (props: Props) => {

  return (
    <View>
      <StatusBar
        backgroundColor={getThemeColor(ColorKeys.headerBackground)}
        barStyle="light-content"
      />
      <HeaderStyled.Header>
        <HeaderStyled.Title>{props.title}</HeaderStyled.Title>
        <TouchableOpacity onPress={props.onCancel}>
          <IconButton icon={"close"} iconColor={getThemeColor(ColorKeys.invertedText)} style={{ marginVertical: 0 }} />
        </TouchableOpacity>
      </HeaderStyled.Header>
    </View>
  )
}

export default Header
