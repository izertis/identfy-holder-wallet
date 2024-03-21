import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { fireEvent, render } from '@testing-library/react-native'
import Recovery from '.'
import { RootStackParamList } from '../../../types'
import { testID } from './constants/testID'

type ScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Recovery'>

const mockedNavigation: ScreenNavigationProp | any = {
	navigate: jest.fn(),
	route: jest.fn(),
	translate: jest.fn(),
}

describe('Recovery screen', () => {
	it('should render recovery screen', () => {
		const result = render(<Recovery {...mockedNavigation} />)

		expect(result.toJSON()).toMatchSnapshot()
	})
	it('Should renders items correctly', () => {
		const { getAllByRole, getByTestId } = render(<Recovery {...mockedNavigation} />)

		const title = getByTestId('title')
		const confirmBtn = getAllByRole('button')
		const goBack = getAllByRole('button')

		expect(title).toBeDefined()
		expect(confirmBtn).toBeDefined()
		expect(goBack).toBeDefined()
	})

	it('renders an error message if the pins are not equal', () => {
		const { getByTestId, queryAllByTestId } = render(<Recovery {...mockedNavigation} />)

		const firstPinInput = getByTestId(testID.FIRST_PIN_INPUT)
		const secondPinInput = getByTestId(testID.SECOND_PIN_INPUT)

		fireEvent.changeText(firstPinInput, '1234')
		fireEvent.changeText(secondPinInput, '5678')

		let messageErrorText = queryAllByTestId(testID.REGISTER_ERROR_MESSAGE)
		expect(messageErrorText).toHaveLength(1)

		fireEvent.changeText(secondPinInput, '1234')
		messageErrorText = queryAllByTestId(testID.REGISTER_ERROR_MESSAGE)
		expect(messageErrorText).toHaveLength(0)
	})
})
