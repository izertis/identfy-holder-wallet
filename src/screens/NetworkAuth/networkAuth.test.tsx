import React from 'react'
import { render, fireEvent, waitFor } from '@testing-library/react-native'
import NetworkAuth from '.'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../../types'
import { RouteProp } from '@react-navigation/native'

describe('NetworkAuth', () => {
  type ScreenNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    'NetworkAuth'
  >
  type NetworkAuthRouteProp = RouteProp<RootStackParamList, 'NetworkAuth'>

  const mockedNavigation: ScreenNavigationProp | any = {
    navigate: jest.fn(),
    route: jest.fn(),
  }

  const mockedRoute: NetworkAuthRouteProp = {
    key: 'mocked-key',
    name: 'NetworkAuth',
  }

  it('should render NetworkAuth screen', async () => {
    const result = render(
      <NetworkAuth navigation={mockedNavigation} route={mockedRoute} />
    )

    await waitFor(() => {
      expect(result.toJSON()).toMatchSnapshot()
    })
  })

  it('renders title correctly', async () => {
    const { getByTestId } = render(
      <NetworkAuth navigation={mockedNavigation} route={mockedRoute} />
    )

    await waitFor(() => {
      expect(getByTestId('title')).toBeTruthy()
    })
  })

  it('renders checkboxes and button', async() => {
    const { getAllByRole, getByTestId } = render(
      <NetworkAuth navigation={mockedNavigation} route={mockedRoute} />
    )
    const checkboxes = getAllByRole('checkbox')
    const button = getByTestId('create-did-button')

    await waitFor(() => {
      expect(checkboxes.length).toBe(3)
      expect(button).toBeDefined()
    })
  })
})
