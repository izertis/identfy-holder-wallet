import i18next from '../../../i18n.config'
import { SCREEN } from "../../constants/screens"
import { navigationScreensConfigType } from "../../types/navigation"
import es from "./i18n/es"
import Login from '.'

const ScreenName = SCREEN.Login

i18next.addResourceBundle("es", ScreenName, es)

const LoginConfig: navigationScreensConfigType = {
  name: ScreenName,
  component: Login,
  options: { headerShown: false },
}

export default LoginConfig
