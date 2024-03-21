import styled from "styled-components/native";
import { UIActivityIndicator } from "react-native-indicators";

import { ColorKeys, getThemeColor } from "../../../constants/Colors";
import ScreenMarginStyle from "../../../components/wrappers/ScreenMarginStyle";
import {
  Title,
  DescriptionText,
  ErrorText,
} from "../../../components/atomic_components/Text/variants";
import InputStyled, {
  safeStyledInput,
} from "../../../components/atomic_components/InputStyled";
import ButtonStyled from "../../../components/atomic_components/Button";
import CheckBoxStyled from "../../../components/atomic_components/CheckBox";
import { safeStyledText } from "../../../components/atomic_components/Text";
import { FONT_FAMILY } from "../../../constants/fontFamily"

const defaultStyles = {
  MainContainer: styled(ScreenMarginStyle)`
    padding-top: 19px;
  `,
  RecoveryButton: styled(ButtonStyled).attrs((props) => ({
    icon: 'arrow-right',
    labelStyle: {  color: getThemeColor(ColorKeys.primary),fontFamily: FONT_FAMILY.PRINCIPAL_600 },
    contentStyle: {
      width: 150
    },
		width: 150,
  }))`
    margin-bottom: 19px;
    margin-left: -5%;
  `,
  Title: safeStyledText(Title)``,
  Subtitle: safeStyledText(DescriptionText)`
    margin-top: 31px;
    margin-bottom: 16px;
  `,
  InputsContainer: styled.ScrollView``,
  InputStyled: safeStyledInput(InputStyled)`
    margin-top: 5px;
  `,
  CheckBoxContainer: styled.View`
    padding-top: 24px;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
  `,
  Button: styled(ButtonStyled)``,
  TermsCheckBox: styled(CheckBoxStyled).attrs({
    containerStyle: {
      padding: 4,
      marginHorizontal: 5,
    },
  })<any>``,
  TermsText: safeStyledText(DescriptionText)`
    font-size: 14px;
    font-weight: normal;
    margin-bottom: 1%;
  `,

  ErrorText: safeStyledText(ErrorText)`
    margin-top: 10px;
  `,
  SplashActivityIndicator: styled(UIActivityIndicator)`
    flex: 1;
    justify-content: flex-end;
    align-items: center;
    margin-bottom: 6%;
  `,
  ContainerBottom: styled.View`
    flex: 1;
    justify-content: flex-end;
    align-items: center;
    margin: 20px auto 40px auto;
    width: 100%;
  `,
};
export default defaultStyles;
