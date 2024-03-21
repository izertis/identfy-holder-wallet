import React, { useEffect } from "react";
import { View } from "react-native";
import SplashScreenStyled from "./style";
import { NavigationInjectedProps } from "react-navigation";
import { SCREEN } from "../../constants/screens";

interface Props extends NavigationInjectedProps {}
const SplashScreen = (props: Props) => {
  useEffect(() => {
    setTimeout(()=>{
      props.navigation?.navigate(SCREEN.OnBoarding)
    },2000)
  }, []);
  return (
    <View>
      <SplashScreenStyled.SplashImageBackground>
        <SplashScreenStyled.SplashLogo />
      </SplashScreenStyled.SplashImageBackground>
      <SplashScreenStyled.SplashActivityIndicator />
    </View>
  );
};

export default SplashScreen;
