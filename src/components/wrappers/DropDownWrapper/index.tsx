import { AntDesign } from "@expo/vector-icons"
import React, { useEffect, useRef, useState } from "react"
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  TextStyle,
  ViewStyle,
} from "react-native"
import { Button } from "react-native-paper"
import { ColorKeys, getThemeColor } from "../../../constants/Colors"
import Layout from "../../../constants/Layout"
import { Title } from "../../atomic_components/Text/variants"
import LayoutWrapper from "../LayoutWrapper"
import AnimatedView from "./components/AnimatedView"
import DropDownWrappedStyled from "./style"

type DropDownViewProps = {
  title: string
  children: JSX.Element
  titleStyle?: TextStyle
  style?: ViewStyle
  contentStyled?: ViewStyle
  wrapperStyle?: ViewStyle
  testID?: string
  duration?: { in?: number; out?: number } | number
}

const DropDownView = (props: DropDownViewProps) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [height, setHeight] = useState(0)

  return (
    <DropDownWrappedStyled.Wrapper
      style={{ ...props.wrapperStyle }}
      testID={props.testID}
    >
      <DropDownWrappedStyled.TouchableTitle
        style={{
          ...props.style,
        }}
        onPress={() => setIsExpanded(!isExpanded)}
      >
        <Title style={props.titleStyle}>{props.title}</Title>
        <AntDesign name={isExpanded ? "up" : "down"} size={14} />
      </DropDownWrappedStyled.TouchableTitle>
      <View style={{ position: "relative" }}>
        <DropDownWrappedStyled.ContentView style={props.contentStyled}>
          <LayoutWrapper element={props.children}>
            {(element: JSX.Element, { dimensions }: any) => (
              <AnimatedView
                height={dimensions?.height}
                duration={props.duration}
                isExpanded={isExpanded}
              >
                {element}
              </AnimatedView>
            )}
          </LayoutWrapper>
        </DropDownWrappedStyled.ContentView>
      </View>

    </DropDownWrappedStyled.Wrapper>
  )
}

export default DropDownView
