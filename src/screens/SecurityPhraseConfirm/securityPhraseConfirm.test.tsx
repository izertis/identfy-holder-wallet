import { RouteProp } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { act, render } from '@testing-library/react-native'
import SecurityPhraseConfirm from '.'
import { RootStackParamList } from '../../../types'

type ScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'SecurityPhraseConfirm'>

type SecurityPhraseConfirmRouteProp = RouteProp<RootStackParamList, 'SecurityPhraseConfirm'>

const mockedNavigation: ScreenNavigationProp | any = {
	navigate: jest.fn(),
}

const mockedRoute: SecurityPhraseConfirmRouteProp = {
	key: 'mocked-key',
	name: 'SecurityPhraseConfirm',
	params: {
		mneumonic: 'mocked-mnemonic',
		derivationPath: 'mocked-derivation-path',
	},
}

describe('SecurityPhraseConfirm screen', () => {
	it('should render SecurityPhraseConfirm screen', () => {
		const result = render(<SecurityPhraseConfirm navigation={mockedNavigation} route={mockedRoute} />)

		expect(result.toJSON()).toMatchSnapshot()
	})
	it('Should renders items correctly', () => {
		const { getAllByRole, getByTestId } = render(
			<SecurityPhraseConfirm navigation={mockedNavigation} route={mockedRoute} />
		)

		const title = getByTestId('title')
		const confirmBtn = getAllByRole('button')

		expect(title).toBeDefined()
		expect(confirmBtn).toBeDefined()
	})
})
