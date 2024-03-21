import i18next from "../../../i18n.config"
import { SCREEN } from "../../constants/screens"
import { navigationScreensConfigType } from "../../types/navigation"
import Credentials from "."
import es from "./i18n/es"
import CredentialsI18nKeys from "./i18n/keys"
import TabBarImage from "../../components/TabBarImage"

const credentialIconSelected = require("./assets/credentialIconSelected.png")
const credentialIcon = require("./assets/credentialIcon.png")

const ScreenName = SCREEN.Credentials

i18next.addResourceBundle("es", ScreenName, es)

const languageMap = { es }
type languageMapType = keyof typeof languageMap
const languageKeys: languageMapType[] = Object.keys(languageMap) as languageMapType[]
const i18nLanguage: any = i18next.language

const auxcurrentLanguage: languageMapType = languageKeys.includes(i18nLanguage)
  ? i18nLanguage
  : "es"

const currentLanguage = languageMap[auxcurrentLanguage]

const CredentialsConfig: navigationScreensConfigType = {
  name: ScreenName,
  component: Credentials,
  options: {
    title: currentLanguage[CredentialsI18nKeys.TITLE],
    tabBarIcon: ({ focused }: any) => (
      <TabBarImage source={focused ? credentialIconSelected : credentialIcon} />
    ),
  },
}

export default CredentialsConfig
