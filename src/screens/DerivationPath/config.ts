import i18next from '../../../i18n.config'
import { SCREEN } from "../../constants/screens"
import { navigationScreensConfigType } from "../../types/navigation"
import es from "./i18n/es"
import DerivationPath from '.'

const ScreenName = SCREEN.DerivationPath

i18next.addResourceBundle("es", ScreenName, es)

const DerivationPathConfig: navigationScreensConfigType = {
  name: ScreenName,
  component: DerivationPath,
  options: { headerShown: false },
}

export default DerivationPathConfig
