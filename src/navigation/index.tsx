/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */

import { DarkTheme, NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { useEffect, useState } from 'react'
import { ColorSchemeName } from 'react-native'
import { RootStackParamList, } from '../../types'
import { ColorKeys, getThemeColor, navTheme } from '../constants/Colors'
import LoginConfig from '../screens/Login/config'
import RecoveryConfig from '../screens/Recovery/config'
import RegisterConfig from '../screens/Register/config'
import SplashScreenConfig from '../screens/SplashScreen/config'
import LocalStorageService, { STORAGE_KEYS } from '../services/LocalStorage.service'
import { navigationScreensConfigType } from '../types/navigation'
import LinkingConfiguration from './LinkingConfiguration'
import OnBoardingConfig from '../screens/OnBoarding/config'
import SecurityPhraseConfirmConfig from '../screens/SecurityPhraseConfirm/config'
import SecurityPhraseConfig from '../screens/SecurityPhrase/config'
import NotFoundScreen from '../screens/NotFoundScreen'
import DerivationPathConfig from '../screens/DerivationPath/config'
import NetworkAuthConfig from '../screens/NetworkAuth/config'
import BottomTabNavigator from './BottomTabNavigator'
import QrReaderConfig from '../screens/QrReader/config'
import { DeepLinkingWrapper } from './wrappers/DeepLinkingWrapper'
import { navigationRef } from './RootNavigation'
import TabNavigatorHeaderDropDown from './BottomTabNavigator/components/TabNavigationHeaderDropdown'
import DidListConfig from '../screens/DidList/config'


export default function Navigation({
  colorScheme,
}: {
  colorScheme: ColorSchemeName
}) {
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === "dark" ? DarkTheme : navTheme}
      ref={navigationRef}
    >
      <RootNavigator />
    </NavigationContainer>
  )
}

const navigationScreensConfig: navigationScreensConfigType[] = [
  SplashScreenConfig,
  OnBoardingConfig,
  RegisterConfig,
  LoginConfig,
  RecoveryConfig,
  SecurityPhraseConfig,
  SecurityPhraseConfirmConfig,
  DerivationPathConfig,
  NetworkAuthConfig,
  QrReaderConfig,
  DidListConfig
]

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<RootStackParamList>()



function RootNavigator(): any {
  const [isWalletCreated, setisWalletCreated] = useState<boolean | null>(null)

  useEffect(() => {
    skipOnboarding()
  }, [])

  const skipOnboarding = async (): Promise<void> => {
    try {
      const data = await LocalStorageService.getBool(
        STORAGE_KEYS.IS_WALLET_CREATED
      )
      if (!data) {
        setisWalletCreated(false)
      } else {
        setisWalletCreated(true)
      }
    } catch (error) {
      throw new Error(`Error retrieving data. ${error}`)
    }
  }


  return (
    isWalletCreated !== null && (
      <Stack.Navigator initialRouteName={isWalletCreated ? 'Login' : 'OnBoarding'}>
        {navigationScreensConfig.map((props: any, index) => (
          <Stack.Screen {...props} component={DeepLinkingWrapper(props.component)} key={props.name || index} />
        ))}
        <Stack.Screen name='NotFound' component={NotFoundScreen} options={{ title: 'Oops!' }} />
        <Stack.Screen
          name='Root'
          component={BottomTabNavigator}
          options={{
            headerRight: () => (
              <TabNavigatorHeaderDropDown />
            ),
            headerBackVisible: false,
            headerBackButtonMenuEnabled: false,
            headerTitleStyle: { color: getThemeColor(ColorKeys.invertedText), fontSize: 22 },
            headerStyle: {
              backgroundColor: getThemeColor(ColorKeys.headerBackground),
            },
          }}
        />
      </Stack.Navigator>
    )
  )
}
