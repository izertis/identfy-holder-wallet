import { Platform, TouchableOpacity, View } from 'react-native'
import { Button, Card, Paragraph } from 'react-native-paper'
import styled from 'styled-components'
import ButtonStyled from '../../../components/atomic_components/Button'
import { safeStyledText } from '../../../components/atomic_components/Text'
import DescriptionText from '../../../components/atomic_components/Text/variants/DescriptionText'
import Title from '../../../components/atomic_components/Text/variants/Title'
import ScreenMarginStyle from '../../../components/wrappers/ScreenMarginStyle'
import { ColorKeys, getThemeColor } from '../../../constants/Colors'
const Subtitle = safeStyledText(DescriptionText)`
  margin-bottom: 16px;
  text-align: justify;
`
const defaultStyles = {
  MainContainer: styled(ScreenMarginStyle)`
    padding-top: 4%;
  `,
  BackButton: styled(Button).attrs(() => ({
    icon: 'arrow-left',
    labelStyle: { color: getThemeColor(ColorKeys.primary) },
  }))`
    width: 100px;
    margin-left: -15px;
    margin-bottom: 10px;
  `,
  Title: safeStyledText(Title)`
    margin-bottom: 46px;
  `,

  Subtitle: safeStyledText(DescriptionText)`
    margin-bottom: 16px;
    text-align: justify;
  `,
  CopyText: safeStyledText(Subtitle)`
    color: ${getThemeColor(ColorKeys.primary)};
    margin-top: 10px;
  `,
  Button: styled(ButtonStyled)``,

  ContainerBottom: styled(View)`
    flex: 1;
    justify-content: flex-end;
    align-items: center;
		margin: 20px auto 90px auto;
    width: 100%;
  `,

  Container: styled(View)`
    height: 100%;
  `,

  PhraseContainer: styled(TouchableOpacity)`
    align-items: center;
  `,

  MainCard: styled(Card)<{ justifyContent?: string; alignItems?: string }>`
    shadow-color: #e1f9fc;
    shadow-offset: 5px 9px;
    shadow-opacity: 0.5;
    box-shadow: 5px 5px 5px #e1f9fd;
    shadow-radius: 10px;
    border-radius: 20px;
    elevation: 5;
    width: 350px;
		height: ${Platform.OS === 'ios' ? null : 'auto'};
    ${(props) =>
      props.justifyContent && `justify-content: ${props.justifyContent}`}
    ${(props) => props.alignItems && `align-items: ${props.alignItems}`}
  `,

  Content: styled(Paragraph)`
    font-size: 18px;
    padding-left: 20px;
    padding-right: 20px;
    margin-top: 10px;
    height: auto;
    line-height: 25px;
  `,
  HiddenTitle: safeStyledText(Title)`
    text-align: center;
    width: 200px;
  `,
}

export default defaultStyles
