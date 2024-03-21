import i18next from '../../../i18n.config'
import { SCREEN } from "../../constants/screens"
import { navigationScreensConfigType } from "../../types/navigation"
import es from "./i18n/es"
import Recovery from '.'
import { ColorKeys, getThemeColor } from '../../constants/Colors'

const ScreenName = SCREEN.Recovery

i18next.addResourceBundle("es", ScreenName, es)

const RecoveryConfig: navigationScreensConfigType = {
  name: ScreenName,
  component: Recovery,
  options: { headerShown: false },
}

export default RecoveryConfig
