import i18next from  '../../../i18n.config';
import { SCREEN } from "../../constants/screens";
import { navigationScreensConfigType } from "../../types/navigation";
import Register from "./";
import es from "./i18n/es";

const ScreenName = SCREEN.Register;

i18next.addResourceBundle("es", ScreenName, es);

const RegisterConfig: navigationScreensConfigType = {
  name: ScreenName,
  component: Register,
  options: { headerShown: false },
};

export default RegisterConfig;
