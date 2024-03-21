import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { render, waitFor } from '@testing-library/react-native'
import DidList from '.'
import { RootStackParamList } from '../../../types'

type ScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'DidList'
>

const mockedNavigation: ScreenNavigationProp | any = {
  navigate: jest.fn(),
  route: jest.fn(),
}

describe('DidList screen', () => {
  it('should render DidList screen', async () => {
    const result = render(<DidList {...mockedNavigation} />)
    await waitFor(() => {
      expect(result.toJSON()).toMatchSnapshot()
    })
  })
})
