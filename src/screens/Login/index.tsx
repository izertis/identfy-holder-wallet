import { useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { RootStackScreenProps } from '../../../types'
import { SCREEN } from '../../constants/screens'
import { MessageContext } from '../../context/UserMessage.context'
import LocalStorageService, {
  STORAGE_KEYS,
} from '../../services/LocalStorage.service'
import { checkPin } from '../../utils/keychain'
import RegisterI18nKeys from './i18n/keys'
import LoginStyled from './styles'
import { View } from '../../components/Themed'
import { executeCallbackFunction } from '../../utils/storeCallback'
import { StatusBar } from 'expo-status-bar'
import { ColorKeys, getThemeColor } from '../../constants/Colors'
import { Platform } from 'react-native'

const Login = ({ route, navigation }: RootStackScreenProps<'Login'>) => {
  const { t } = useTranslation(SCREEN.Login)
  const { callback }: any = route?.params ?? {}
  const { showMessage } = useContext(MessageContext)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [pin, setPin] = useState<string>('')

  const login = async () => {
    setPin('')
    setIsLoading(true)
    const IS_DID_CREATED = await LocalStorageService.getBool(
      STORAGE_KEYS.IS_DID_CREATED
    )
    if (IS_DID_CREATED) {
      try {
        callback
          ? await executeCallbackFunction(callback.id, callback.params)
          : navigation.replace('Root')
      } catch (error) { }
    } else {
      navigation.replace('NetworkAuth')
    }
    setIsLoading(false)
  }

  const showError = (): void => {
    setPin('')
    const content = t(RegisterI18nKeys.ERROR)
    showMessage({ content, type: 'error' })
  }

  return (
    <LoginStyled.MainContainer>
      <StatusBar backgroundColor='transparent' style='auto' />
      <View>
        <LoginStyled.RegisterButton
          onPress={() => navigation.navigate('Register')}
        >
          {t(RegisterI18nKeys.REGISTER_LINK)}
        </LoginStyled.RegisterButton>

        <LoginStyled.Title testID="title">
          {t(RegisterI18nKeys.TITLE)}
        </LoginStyled.Title>
        <LoginStyled.InputsContainer>
          <LoginStyled.InputStyled
            value={pin}
            keyboardType="decimal-pad"
            secureTextEntry
            onChangeText={(value: string) =>
              setPin(value.replace(/[^0-9]/g, ''))
            }
            placeholder={t(RegisterI18nKeys.PIN_LABEL) || ''}
            onSubmitEditing={async () => ((await checkPin(pin)) ? login() : showError())}
            returnKeyType={Platform.OS === 'android' ? 'send' : 'done'}
          />
        </LoginStyled.InputsContainer>
        <LoginStyled.RecoveryButton
          onPress={() => navigation.navigate('Recovery')}
        >
          {t(RegisterI18nKeys.RECOVERY)}
        </LoginStyled.RecoveryButton>
      </View>
      <LoginStyled.ContainerBottom>
        {isLoading ? <LoginStyled.SplashActivityIndicator color={getThemeColor(ColorKeys.text)} size={35} /> : null}
        <LoginStyled.Button
          testID="startButton"
          disabled={pin === '' || isLoading}
          style={{ flexDirection: 'row' }}
          onPress={async () => ((await checkPin(pin)) ? login() : showError())}
        >
          {t(RegisterI18nKeys.BUTTON)}
        </LoginStyled.Button>
      </LoginStyled.ContainerBottom>
    </LoginStyled.MainContainer>
  )
}

export default Login
