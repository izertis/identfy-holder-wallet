import { View } from 'react-native'
import { Button } from 'react-native-paper'
import styled from 'styled-components'
import ButtonStyled from '../../../components/atomic_components/Button'
import { safeStyledText } from '../../../components/atomic_components/Text'
import DescriptionText from '../../../components/atomic_components/Text/variants/DescriptionText'
import Title from '../../../components/atomic_components/Text/variants/Title'
import ScreenMarginStyle from '../../../components/wrappers/ScreenMarginStyle'
import { ColorKeys, getThemeColor } from '../../../constants/Colors'

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

  Title: safeStyledText(Title)`
  margin-bottom: 46px;
  `,

  Subtitle: safeStyledText(DescriptionText)`
  margin-bottom: 16px;
  text-align: justify;
  `,

  Button: styled(ButtonStyled)``,

  ContainerBottom: styled(View)`
  flex: 1;
  justify-content: flex-end;
  align-items: center;
  margin: 20px auto 40px auto;
  width: 100%;
  `,

  Container: styled(View)`
  height: 100% ;
  `,

  ButtonContainer: styled(View)`
    flex-direction: row; 
    flex-wrap: wrap; 
    justify-content: center;
    margin-top: 10%;
  `,

  ResetButton: styled(Button).attrs(props => ({
    color: getThemeColor(ColorKeys.primary),
    buttonColor: getThemeColor(ColorKeys.background),
    textColor: getThemeColor(ColorKeys.primary),
    borderWidth: 0,
  }))`
      margin-top: 30px;
      height:39px;
      width:90px;
      border-radius:45px;
      align-self: flex-end;
    `
}

export default defaultStyles
