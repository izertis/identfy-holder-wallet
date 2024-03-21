import i18next from '../../../i18n.config'
import { SCREEN } from '../../constants/screens'
import { navigationScreensConfigType } from '../../types/navigation'
import Historical from '.'
import es from './i18n/es'
import historicalI18nKeys from './i18n/keys'
import TabBarImage from '../../components/TabBarImage'

const historicalIconSelected = require('./assets/historicalIconSelected.png')
const historicalIcon = require('./assets/historicalIcon.png')

const ScreenName = SCREEN.Historical

i18next.addResourceBundle('es', ScreenName, es)

const languageMap = { es }
type languageMapType = keyof typeof languageMap
const languageKeys: languageMapType[] = Object.keys(
  languageMap
) as languageMapType[]
const i18nLanguage: any = i18next.language

const auxcurrentLanguage: languageMapType = languageKeys.includes(i18nLanguage)
  ? i18nLanguage
  : 'es'

const currentLanguage = languageMap[auxcurrentLanguage]

const HistoricalConfig: navigationScreensConfigType = {
  name: ScreenName,
  component: Historical,
  options: {
    title: currentLanguage[historicalI18nKeys.TITLE],
    //@ts-ignore
    tabBarIcon: ({ focused }: any) => (
      <TabBarImage source={focused ? historicalIconSelected : historicalIcon} />
    ),
  },
}

export default HistoricalConfig
