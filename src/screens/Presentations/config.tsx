import i18next from "../../../i18n.config"
import { SCREEN } from "../../constants/screens"
import { navigationScreensConfigType } from "../../types/navigation"
import Presentations from "."
import es from "./i18n/es"
import PresentationsI18nKeys from "./i18n/keys"
import TabBarImage from "../../components/TabBarImage"
const presentationIcon = require("./assets/presentationIcon.png")
const presentationIconSelected = require("./assets/presentationIconSelected.png")

const ScreenName = SCREEN.Presentations

i18next.addResourceBundle("es", ScreenName, es)

const languageMap = { es }
type languageMapType = keyof typeof languageMap
const languageKeys: languageMapType[] = Object.keys(languageMap) as languageMapType[]
const i18nLanguage: any = i18next.language

const auxcurrentLanguage: languageMapType = languageKeys.includes(i18nLanguage)
  ? i18nLanguage
  : "es"

const currentLanguage = languageMap[auxcurrentLanguage]

const PresentationsConfig: navigationScreensConfigType = {
  name: ScreenName,
  component: Presentations,
  options: {
    title: currentLanguage[PresentationsI18nKeys.TITLE],
    tabBarIcon: ({ focused }: any) => (
      <TabBarImage source={focused ? presentationIconSelected : presentationIcon} />
    ),
  },
}

export default PresentationsConfig
