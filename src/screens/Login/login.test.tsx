import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { render } from '@testing-library/react-native'
import Login from '.'
import { RootStackParamList } from '../../../types'

type ScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>

const mockedNavigation: ScreenNavigationProp | any = {
	navigate: jest.fn(),
	route: jest.fn(),
}

describe('Login screen', () => {
	it('should render login screen', () => {
		const result = render(<Login {...mockedNavigation} />)

		expect(result.toJSON()).toMatchSnapshot()
	})
	it('Should renders items correctly', () => {
		const { getAllByRole, getByTestId } = render(<Login {...mockedNavigation} />)

		const title = getByTestId('title')
		const startBtn = getAllByRole('button')
		const recoverButton = getAllByRole('button')

		expect(title).toBeDefined()
		expect(startBtn).toBeDefined()
		expect(recoverButton).toBeDefined()
	})
})
