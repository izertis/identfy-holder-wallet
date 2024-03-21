import styled from "styled-components/native";
import { View } from "react-native";
import { getThemeColor, ColorKeys } from "../../../../constants/Colors";
import {  Title,  DescriptionText,} from "../../../../components/atomic_components/Text/variants";
import {  safeStyledText,} from "../../../../components/atomic_components/Text";

const OnBoardingDescriptionStyled = {
  DescriptionContent: styled(View)`
    width: 95%;
  `,
  Subtitle: safeStyledText(DescriptionText)`
    width: 80%;
    margin-left: 9%;
    margin-top: 20px;
    font-size: 14px;
    color: ${getThemeColor(ColorKeys.invertedText)};
    text-align: justify;
  `,
  Title: safeStyledText(Title)`
    margin-left: 9%;
    margin-bottom: 7%;
    color: ${getThemeColor(ColorKeys.invertedText)};
  `,
  TitleContainer: styled.View`
    flex-direction: row;
    justify-content: space-between;
  `,
};

export default OnBoardingDescriptionStyled;
