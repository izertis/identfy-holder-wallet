import i18next from '../../../i18n.config'
import { SCREEN } from "../../constants/screens"
import { navigationScreensConfigType } from "../../types/navigation"
import es from "./i18n/es"
import SecurityPhrase from '.'

const ScreenName = SCREEN.SecurityPhrase

i18next.addResourceBundle("es", ScreenName, es)

const SecurityPhraseConfig: navigationScreensConfigType = {
  name: ScreenName,
  component: SecurityPhrase,
  options: { headerShown: false },
}

export default SecurityPhraseConfig
