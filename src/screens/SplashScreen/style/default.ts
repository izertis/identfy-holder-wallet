import styled from "styled-components/native";
import { UIActivityIndicator } from "react-native-indicators";
import { ImageBackground, Image } from "react-native";
import { IMG } from "../../../constants/urlImages";
import Colors from "../../../constants/Colors";
import { TEST_LABELS } from "../constants/testLabels";

const DefaultStyles = {
  SplashImageBackground: styled(ImageBackground).attrs({
    accessibilityLabel: TEST_LABELS.BACKGROUND_IMAGE,
    source: IMG.SPLASH_BACKGROUND,
  })`
    width: 100%;
    height: 100%;
    align-items: center;
    justify-content: center;
  `,
  SplashLogo: styled.Image.attrs({
    source: IMG.SPLASH_LOGO,
  })`
    width: 70%;
    resize-mode: contain;
  `,
  SplashActivityIndicator: styled(UIActivityIndicator).attrs({
    size: 35,
    color: Colors.light.loading,
  })`
    position: absolute;
    right: 0;
    left: 0;
    bottom: 9%;
  `,
};

export default DefaultStyles;
