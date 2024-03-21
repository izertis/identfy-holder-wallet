import { FontAwesome } from '@expo/vector-icons';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { FONT_FAMILY } from '../constants/fontFamily';

export default function useCachedResources() {
  const [isLoadingComplete, setLoadingComplete] = useState(false);

  // Load any resources or data that we need prior to rendering the app
  useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        SplashScreen.preventAutoHideAsync();
        // Load fonts
        await Font.loadAsync({
          ...FontAwesome.font,
          [FONT_FAMILY.PRINCIPAL]: require('../../src/assets/fonts/Muli.ttf'),
          [FONT_FAMILY.PRINCIPAL_600]: require('../../src/assets/fonts/Muli-600.ttf'),
          [FONT_FAMILY.SECONDARY]: require('../../src/assets/fonts/Montserrat-Bold.ttf'),
        });
      } catch (e) {
        // We might want to provide this error information to an error reporting service
        console.error(e);
      } finally {
        setLoadingComplete(true);
        SplashScreen.hideAsync();
      }
    }

    loadResourcesAndDataAsync();
  }, []);

  return isLoadingComplete;
}
