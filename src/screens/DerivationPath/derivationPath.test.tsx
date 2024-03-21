import { RouteProp } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { render } from '@testing-library/react-native'
import DerivationPath from '.'
import { RootStackParamList } from '../../../types'

// react-native-clipboard jest-mock
jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter')

type ScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'DerivationPath'>

type DerivationPathRouteProp = RouteProp<RootStackParamList, 'DerivationPath'>

const mockedNavigation: ScreenNavigationProp | any = {
	navigate: jest.fn(),
}

const mockedRoute: DerivationPathRouteProp = {
	key: 'mocked-key',
	name: 'DerivationPath',
	params: {
		derivationPath: 'mocked-derivation-path',
	},
}

describe('DerivationPath screen', () => {
	it('should render DerivationPath screen', () => {
		const result = render(<DerivationPath navigation={mockedNavigation} route={mockedRoute} />)

		expect(result.toJSON()).toMatchSnapshot()
	})
	it('Should renders items correctly', () => {
		const { getAllByRole, getByTestId } = render(
			<DerivationPath navigation={mockedNavigation} route={mockedRoute} />
		)

		const title = getByTestId('title')
		const continueBtn = getAllByRole('button')

		expect(title).toBeDefined()
		expect(continueBtn).toBeDefined()
	})
})
