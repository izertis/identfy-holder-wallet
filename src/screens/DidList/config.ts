import i18next from '../../../i18n.config'
import { SCREEN } from '../../constants/screens'
import { navigationScreensConfigType } from '../../types/navigation'
import es from './i18n/es'
import DidList from '.'
import Colors from '../../constants/Colors'

const ScreenName = SCREEN.DidList
i18next.addResourceBundle('es', ScreenName, es)
const DidListConfig: navigationScreensConfigType = {
	name: ScreenName,
	component: DidList,
	options: {
		headerBackVisible: true,
		headerBackTitleVisible: false,
		headerBackButtonMenuEnabled: true,
		headerTitle: es.TITLE,
		headerTintColor: '#ffffff',
		headerTitleStyle: { color: '#ffffff' },
		headerStyle: {
			backgroundColor: Colors.light.headerBackground,
		},
	},
}

export default DidListConfig
