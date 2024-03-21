import { TextInput } from "react-native"
import styled from "styled-components/native"

import { ColorKeys, getThemeColor } from "../../../constants/Colors"
import ScreenMarginStyle from "../../../components/wrappers/ScreenMarginStyle"
import {

  Title,
  DescriptionText,
  ErrorText,
} from "../../../components/atomic_components/Text/variants"
import InputStyled, {
  safeStyledInput,
} from "../../../components/atomic_components/InputStyled"
import ButtonStyled from "../../../components/atomic_components/Button"
import { safeStyledText } from "../../../components/atomic_components/Text"
import { UIActivityIndicator } from "react-native-indicators"
import { Button } from "react-native-paper"

const defaultStyles = {
  MainContainer: styled(ScreenMarginStyle)`
  `,

  RecoveryButton: styled(Button).attrs(() => ({
    icon: "arrow-left",
    labelStyle: { "color": getThemeColor(ColorKeys.primary) }
  }))`
    width: 22%;
    margin-top: 5%;
    margin-bottom: 6%;
    margin-left: -1%;
  `,

  Title: safeStyledText(Title)``,

  Subtitle: safeStyledText(DescriptionText)`
    margin-top: 46px;
    margin-bottom: 16px;
    text-align: justify;
  `,
  InputsContainer: styled.ScrollView``,

  InputStyled: safeStyledInput(InputStyled)`
    margin-top: 5px;
  `,

  ErrorText: safeStyledText(ErrorText)`
    margin-top: 10px;
  `,

  ContainerBottom: styled.View`
    flex: 1;
    justify-content: flex-end;
    align-items: center;
    margin: 20px auto 40px auto;
    width: 100%;
  `,

  PhraseInput: styled(TextInput).attrs({
    selectionColor: getThemeColor(ColorKeys.primary),
    placeholderTextColor: 'rgba(60, 60, 67, 0.29)'
  })`
    height: 90px;
    border-radius: 20px;
    border-width: 1px;
    border-color: rgba(60, 60, 67, 0.29);
    text-align: center;
    font-size: 16px;
    margin-bottom: 5%;
  `,

  Button: styled(ButtonStyled)``,

  SplashActivityIndicator: styled(UIActivityIndicator)`
  flex: 1;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 6%;
`,

}
export default defaultStyles
