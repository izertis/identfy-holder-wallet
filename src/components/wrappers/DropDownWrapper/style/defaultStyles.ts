import styled from "styled-components/native"
import {
  View,
  Text,
  ImageBackground,
  Image,
  TouchableOpacity,
} from "react-native"
import { ColorKeys, getThemeColor } from "../../../../constants/Colors"

const defaultStyles = {
  Wrapper: styled.View`
    border-bottom-width: 1px;
    border-color: ${getThemeColor(ColorKeys.disabled)}
  `,
  TouchableTitle: styled(TouchableOpacity)`
    z-index: 0;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  `,
  ContentView: styled.View`
    padding-top: 16px;
  `,
}

export default defaultStyles
