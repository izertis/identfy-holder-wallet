import React, { useState } from "react"
import { LayoutChangeEvent, LayoutRectangle, View } from "react-native"

type childrenType =JSX.Element | ((component: any, props: any) => JSX.Element)
interface Props {
  childrenProps?: object | ((config?: any, dimensions?: any) => object)
  element: JSX.Element
  children: childrenType
} 

/*
  This component is a wrapper used to get information about the layout and dimensions of a React Native component. This is useful for making styling changes to components based on their position on the screen or the size of the user's screen.

  LayoutWrapper accepts the following props:

  childrenProps: An object or a function that returns an object that is passed as props to child components.
  element – The React Native component that is wrapped with the LayoutWrapper.
  children: The child components to render within the LayoutWrapper.
*/

const LayoutWrapper = (props: Props) => {
  const [layout, setLayout] = useState<LayoutChangeEvent | null>(null)
  const [dimensions, setDimensions] = useState<LayoutRectangle | null>(null)

  const getChildrenProps = (layout: any, dimensions: any) => {
    let childrenProps: any = {}
    if (props.childrenProps && typeof props.childrenProps === typeof {}) {
      childrenProps = props.childrenProps
    } else if (props.childrenProps && layout && dimensions) {
      const auxChildrenProps: any = props.childrenProps
      childrenProps = auxChildrenProps(layout, dimensions)
    } else if (layout && dimensions) {
      childrenProps = { layout, dimensions }
    }
    return childrenProps
  }
  const getChildren = (element: childrenType, childrenProps: any) => {
    let children: JSX.Element

    if (typeof element === "function") {
      children = element(props.element, childrenProps)
    } else  {
      children = element
    } 
    return children
  }

  const childrenProps: any = getChildrenProps(layout, dimensions)
  const children: JSX.Element = getChildren(props.children || props.element, childrenProps)

  return (
    <View>
      {layout && dimensions && React.cloneElement(children)}
      {(!layout || !dimensions) &&
        React.cloneElement(<View>{props.element}</View>, {
          style: { position: "absolute", top: -10000 },
          onLayout: (event: LayoutChangeEvent) => {
            setLayout(event)
            setDimensions(event.nativeEvent.layout)
          },
        })}
    </View>
  )
}

export default LayoutWrapper
