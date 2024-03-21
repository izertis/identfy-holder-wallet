import i18next from '../../../i18n.config'
import { SCREEN } from "../../constants/screens"
import { navigationScreensConfigType } from "../../types/navigation"
import es from "./i18n/es"
import NetworkAuth from '.'

const ScreenName = SCREEN.NetworkAuth

i18next.addResourceBundle("es", ScreenName, es)

const NetworkAuthConfig: navigationScreensConfigType = {
  name: ScreenName,
  component: NetworkAuth,
  options: { headerShown: false },
}

export default NetworkAuthConfig
