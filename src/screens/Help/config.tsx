import i18next from  '../../../i18n.config';
import { SCREEN } from "../../constants/screens";
import { navigationScreensConfigType } from "../../types/navigation";
import TermsAndConditions from ".";
import es from "./i18n/es";

const ScreenName = SCREEN.Help;

i18next.addResourceBundle("es", ScreenName, es);

const HelpConfig: navigationScreensConfigType = {
  name: ScreenName,
  component: TermsAndConditions,
  options: { headerShown: false },
};

export default HelpConfig;
