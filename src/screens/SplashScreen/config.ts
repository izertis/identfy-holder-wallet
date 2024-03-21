import { SCREEN } from "../../constants/screens";
import { navigationScreensConfigType } from "../../types/navigation";
import SplashScreen from "./";

const ScreenName = SCREEN.SplashScreen;


const SplashScreenConfig: navigationScreensConfigType = {
  name: ScreenName,
  component: SplashScreen,
  options: { headerShown: false },
};

export default SplashScreenConfig;
