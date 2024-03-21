import { StatusBar } from 'expo-status-bar'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { Provider as PaperProvider } from 'react-native-paper'
import useCachedResources from './src/hooks/useCachedResources'
import useColorScheme from './src/hooks/useColorScheme'
import Navigation from './src/navigation'
import { MessageProviderWrapper } from './src/context/UserMessage.context'
import SnackbarMessage from './src/components/Snackbar'
import FeatureToggleProvider from './src/providers/ScreenWrapper'
import { ModalWrapper } from './src/context/Modal.context'
import ModalScreen from './src/components/ModalScreen'

export default function App() {
  const isLoadingComplete = useCachedResources()
  const colorScheme = useColorScheme()

  if (!isLoadingComplete) {
    return null
  } else {
    return (
      <SafeAreaProvider>
        <FeatureToggleProvider>
          <ModalWrapper>
            <MessageProviderWrapper>
              <PaperProvider>
                <Navigation colorScheme={colorScheme} />
                <StatusBar backgroundColor="transparent" style="auto" />
                <SnackbarMessage />
                <ModalScreen />
              </PaperProvider>
            </MessageProviderWrapper>
          </ModalWrapper>
        </FeatureToggleProvider>
      </SafeAreaProvider>
    )
  }
}
