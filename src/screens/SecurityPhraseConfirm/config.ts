import i18next from '../../../i18n.config'
import { SCREEN } from "../../constants/screens"
import { navigationScreensConfigType } from "../../types/navigation"
import es from "./i18n/es"
import SecurityPhraseConfirm from '.'

const ScreenName = SCREEN.SecurityPhraseConfirm

i18next.addResourceBundle("es", ScreenName, es)

const SecurityPhraseConfirmConfig: navigationScreensConfigType = {
  name: ScreenName,
  component: SecurityPhraseConfirm,
  options: { headerShown: false },
}

export default SecurityPhraseConfirmConfig
