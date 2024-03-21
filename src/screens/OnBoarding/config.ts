import i18next from  '../../../i18n.config';
import { SCREEN } from "../../constants/screens";
import { navigationScreensConfigType } from "../../types/navigation";
import OnBoarding from "./";
import es from "./i18n/es";

const ScreenName = SCREEN.OnBoarding;

i18next.addResourceBundle("es", ScreenName, es);

const OnBoardingConfig: navigationScreensConfigType = {
  name: ScreenName,
  component: OnBoarding,
  options: { headerShown: false },
};

export default OnBoardingConfig;
