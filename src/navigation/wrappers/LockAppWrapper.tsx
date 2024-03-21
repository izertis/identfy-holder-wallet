import { useEffect, useState } from "react"
import { AppState, AppStateStatus } from "react-native"
import LocalStorageService, { STORAGE_KEYS } from "../../services/LocalStorage.service"

const ComponentWrapper =
  (Component: (props: any) => JSX.Element) => (props: any) => {
    const [appState, setAppState] = useState<AppStateStatus>(AppState.currentState)

    const handleAppStateChange = async (nextAppState: AppStateStatus): Promise<void> => {
      if (appState === 'active' && nextAppState?.match(/background/)) {
        const isWalletCreated = await LocalStorageService.getBool(
          STORAGE_KEYS.IS_WALLET_CREATED
        )
        const screenName = !!isWalletCreated ? "Login" : "OnBoarding"
        props.navigation.navigate(screenName)
      }
      setAppState(nextAppState)
    }
    useEffect(() => {
      const unsubscribeAppState = AppState.addEventListener('change', handleAppStateChange)
      return () => {
        unsubscribeAppState.remove()
      }
    }, [])

    return (
      <>
        <Component {...props} />
      </>
    )
  }

export default ComponentWrapper
