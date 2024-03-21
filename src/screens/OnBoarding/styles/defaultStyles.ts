import styled from "styled-components/native";
import { View, ImageBackground } from "react-native";
import Swiper from "react-native-swiper";
import { ColorKeys, getThemeColor } from "../../../constants/Colors";
import ButtonStyled from "../../../components/atomic_components/Button";
import ScreenView from "../../../components/ScreenView";
import { TEST_LABELS } from "../constants/testLabels";

const defaultStyles = {
  MainView: styled(ScreenView)`
    flex: 1;
    flex-direction: column;
  `,
  SwiperStyled: styled(Swiper).attrs({
    activeDotColor: getThemeColor(ColorKeys.invertedText),
    dotColor: getThemeColor(ColorKeys.inactiveDot),
    paginationStyle: { bottom: "10%" },
    bounces: true
  })``,
  ImageScreen: styled(ImageBackground).attrs({
    accessibilityLabel: TEST_LABELS.BACKGROUND_IMAGE,
    imageStyle: { resizeMode: "cover", opacity: 0.5 },
  })`
    width: 100%;
    height: 100%;
    background-color: ${getThemeColor(ColorKeys.headerBackground)};
    justify-content: space-between;
  `,
  WhiteButton: styled(ButtonStyled).attrs((props) => ({
    labelStyle: {
      letterSpacing: 0.57,
      color: getThemeColor(ColorKeys.primary),
    },
    contentStyle: {
      height: 39,
      width: 224,
      borderRadius: 15,
      backgroundColor: props.disabled
        ? getThemeColor(ColorKeys.disabled)
        : getThemeColor(ColorKeys.invertedText),
      borderColor: getThemeColor(ColorKeys.primary),
    },
  }))``,
  BottomContainer: styled(View)`
    position: relative;
    margin-bottom: 25%;
    align-self: center;
  `,
};

export default defaultStyles;
