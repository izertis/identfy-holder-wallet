import { useEffect } from "react"
import { Dimensions } from "react-native"
import { RootTabParamList } from "../../../types"
import { ColorKeys, getThemeColor } from "../../constants/Colors"
import PresentationsConfig from "../../screens/Presentations/config"
import CredentialsConfig from "../../screens/Credentials/config"
import HistoricalConfig from "../../screens/Historical/config"
import { navigationScreensConfigType } from "../../types/navigation"
import LockAppWrapper from "../wrappers/LockAppWrapper"
import { DeepLinkingWrapper } from "../wrappers/DeepLinkingWrapper"
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { Route, getFocusedRouteNameFromRoute, } from "@react-navigation/native"


function BottomTabNavigator({ navigation, route }: any) {

  const bottonTabNavigationScreensConfig: navigationScreensConfigType[] = [
    CredentialsConfig,
    PresentationsConfig,
    HistoricalConfig,
  ]

  const Tab = createMaterialTopTabNavigator<RootTabParamList>()

  function getHeaderTitle(route: Partial<Route<string>>) {
    const routeName = getFocusedRouteNameFromRoute(route) ?? "Credentials"
    switch (routeName) {
      case CredentialsConfig.name:
        if ('title' in CredentialsConfig.options) {
          return CredentialsConfig.options.title
        }
        break
      case PresentationsConfig.name:
        if ('title' in PresentationsConfig.options) {
          return PresentationsConfig.options.title
        }
        break
      case HistoricalConfig.name:
        if ('title' in HistoricalConfig.options) {
          return HistoricalConfig.options.title
        }
        break
    }

    return routeName
  }

  useEffect(() => {
    navigation.setOptions({ headerTitle: getHeaderTitle(route) })
  }, [navigation, route])


  return (
    <>
      <Tab.Navigator
        initialRouteName="Credentials"
        initialLayout={{
          width: Dimensions.get('window').width,
          height: Dimensions.get('window').height
        }}
        tabBarPosition="bottom"
        screenOptions={{
          tabBarActiveTintColor: getThemeColor(ColorKeys.primary),
          tabBarInactiveTintColor: getThemeColor(ColorKeys.tabIconDefault),
        }}
      >
        {bottonTabNavigationScreensConfig.map((props: any) => (
          <Tab.Screen
            {...props}
            component={DeepLinkingWrapper(LockAppWrapper(props.component))}
            key={props.name}
            options={() => ({
              tabBarShowIcon: true,
              tabBarLabelStyle: { fontSize: 13, textTransform: 'capitalize', marginHorizontal: -20 },
              tabBarIndicatorStyle: {
                backgroundColor: getThemeColor(ColorKeys.primary), top: 0,
                height: 3
              },
              ...props.options
            })}
          />
        ))}
      </Tab.Navigator>
    </>
  )
}

export default BottomTabNavigator

