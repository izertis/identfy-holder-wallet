import React, { useEffect, useRef, useState } from "react"
import { Animated } from "react-native"

interface Props {
  height: number
  children: JSX.Element
  duration?: { in?: number; out?: number } | number
  isExpanded: boolean
}
const AnimatedView = (props: Props) => {
  useEffect(() => {
    if (props.isExpanded) {
      fadeIn(props.height)
    } else {
      fadeOut()
    }
  }, [props.isExpanded, props.height])

  const fadeAnim = useRef(new Animated.Value(0)).current
  const fadeIn = (height?: number) => {
    const propsDuration: any = props.duration
    const duration = propsDuration?.in || propsDuration || 500
    if (height) {
      Animated.timing(fadeAnim, {
        toValue: height,
        duration: duration,
        useNativeDriver: false,
      }).start()
    }
  }

  const fadeOut = () => {
    const propsDuration: any = props.duration
    const duration = propsDuration?.out || propsDuration || 500
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: duration,
      useNativeDriver: false,
    }).start()
  }
  return (
    <Animated.View
      style={[
        {
          maxHeight: fadeAnim,
          height: fadeAnim,
          overflow: "hidden",
        },
      ]}
    >
      {props.children}
    </Animated.View>
  )
}

export default AnimatedView
