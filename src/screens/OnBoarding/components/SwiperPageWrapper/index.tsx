import React from "react";
import { Text } from "react-native-paper";
import { SCREEN } from "../../../../constants/screens";
import OnBoardingStyled from "../../styles";
import { useTranslation } from "react-i18next";
import { IMG } from "../../../../constants/urlImages";
import OnBoardingI18nKeys from "../../i18n/keys";
import { View } from "react-native";
import SwiperPageStyled from "./styles";

interface Props {
  renderDescription: JSX.Element | JSX.Element[];
  children?: JSX.Element | JSX.Element[];
}
const SwiperPageWrapper = (props: Props) => {
  const { t } = useTranslation(SCREEN.OnBoarding);
  return (
    <SwiperPageStyled.SwiperPageContent>
      <View>
        <SwiperPageStyled.DescriptionContent>
          {props.renderDescription}
        </SwiperPageStyled.DescriptionContent>
      </View>
      <View>{props.children}</View>
    </SwiperPageStyled.SwiperPageContent>
  );
};

export default SwiperPageWrapper;
