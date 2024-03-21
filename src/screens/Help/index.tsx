import { useState } from "react"
import { Text, View, StatusBar } from "react-native"
import { NavigationInjectedProps } from "react-navigation"
import NotFoundScreen from "../NotFoundScreen"


interface Props extends NavigationInjectedProps {}

const Help = ({ navigation }:Props) => {

  return <NotFoundScreen navigation={navigation} />
}

export default Help
