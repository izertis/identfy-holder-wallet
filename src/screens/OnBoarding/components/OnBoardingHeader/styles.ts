import { View, Image, Platform } from "react-native";
import styled from "styled-components/native";
import TextStyled, {
  safeStyledText,
} from "../../../../components/atomic_components/Text";
import { getThemeColor, ColorKeys } from "../../../../constants/Colors";
import { FONT_FAMILY } from "../../../../constants/fontFamily";

const HeaderStyled = {
  LinkHeader: styled(View)`
		margin-top: ${Platform.OS === 'ios' ? '15%' : '10%'};
    margin-left: 7.5%;
    margin-bottom: 10%;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  `,
  RowView: styled.View`
    display: flex;
    flex-direction: row;
  `,
  IconHeader: styled(Image)`
    width: 20px;
    height: 20px;
  `,
  TextHeader: safeStyledText(TextStyled)`
    font-family: ${FONT_FAMILY.PRINCIPAL};
    font-weight: 600;
    font-size: 14px;
    color: ${getThemeColor(ColorKeys.invertedText)};
  `,
  SkipButton: safeStyledText(TextStyled)`
    font-size: 13px;
    margin-right: 9%;
    color: ${getThemeColor(ColorKeys.invertedText)};
  `,
};

export default HeaderStyled;
