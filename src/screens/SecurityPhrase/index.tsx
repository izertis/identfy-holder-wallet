import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card } from 'react-native-paper'
import { RootStackScreenProps } from '../../../types'
import Button from '../../components/atomic_components/Button'
import PressToCopy from '../../components/PressToCopy'
import { SCREEN } from '../../constants/screens'
import SecurityPhraseI18nKeys from './i18n/keys'
import SecurityPhraseStyled from './styles'
import LocalStorageService, { STORAGE_KEYS } from '../../services/LocalStorage.service'
import { StatusBar } from 'expo-status-bar'

const SecurityPhrase = ({
  route,
  navigation,
}: RootStackScreenProps<'SecurityPhrase'>) => {
  const { t } = useTranslation(SCREEN.SecurityPhrase)

  let { mneumonic, derivationPath }: any = route.params || {}

  const [seedPhrase, setSeedPhrase] = useState<string>('')
  const [isSeedBlur, setIsSeedBlur] = useState<boolean>(true)

  const showPin = async () => {
    setSeedPhrase(mneumonic)
  }

  useEffect(() => {
    showPin()
  }, [])

  const goBack = async () => {
    const isWalletCreated = await LocalStorageService.getBool(
      STORAGE_KEYS.IS_WALLET_CREATED
    )
    const screenName = !!isWalletCreated ? "Login" : "Register"
    navigation.navigate(screenName)
  }

  return (
    <SecurityPhraseStyled.MainContainer>
      <StatusBar backgroundColor='transparent' style='auto' />
      <SecurityPhraseStyled.Container>
        <SecurityPhraseStyled.BackButton
          onPress={goBack}
        >
          {t(SecurityPhraseI18nKeys.GO_BACK)}
        </SecurityPhraseStyled.BackButton>
        <SecurityPhraseStyled.Title testID={'title'}>
          {t(SecurityPhraseI18nKeys.TITLE)}
        </SecurityPhraseStyled.Title>
        <SecurityPhraseStyled.Subtitle>
          {t(SecurityPhraseI18nKeys.SUBTITLE)}
        </SecurityPhraseStyled.Subtitle>



        {isSeedBlur ? (
          <SecurityPhraseStyled.PhraseContainer onPress={() => setIsSeedBlur(!isSeedBlur)}>
            <SecurityPhraseStyled.MainCard justifyContent='flex-end' alignItems='center'>
              <Card.Content>
                <SecurityPhraseStyled.HiddenTitle>
                  {t(SecurityPhraseI18nKeys.HIDDEN_TITLE)}
                </SecurityPhraseStyled.HiddenTitle>
              </Card.Content>
            </SecurityPhraseStyled.MainCard>
          </SecurityPhraseStyled.PhraseContainer>
        ) : (
          <SecurityPhraseStyled.PhraseContainer>
            <PressToCopy onPress={() => setIsSeedBlur(!isSeedBlur)} value={seedPhrase}>
              <SecurityPhraseStyled.MainCard>
                <Card.Content>
                  <SecurityPhraseStyled.Content>{seedPhrase}</SecurityPhraseStyled.Content>
                </Card.Content>
              </SecurityPhraseStyled.MainCard>
            </PressToCopy>
          </SecurityPhraseStyled.PhraseContainer>
        )}
        {!isSeedBlur && (
          <SecurityPhraseStyled.CopyText>
            {t(SecurityPhraseI18nKeys.LONG_PRESS)}
          </SecurityPhraseStyled.CopyText>
        )}

        <SecurityPhraseStyled.ContainerBottom>
          <Button
            onPress={() => {
              navigation.navigate('SecurityPhraseConfirm', {
                mneumonic,
                derivationPath: derivationPath,
              })
            }}
          >
            {t(SecurityPhraseI18nKeys.BUTTON)}
          </Button>
        </SecurityPhraseStyled.ContainerBottom>
      </SecurityPhraseStyled.Container>
    </SecurityPhraseStyled.MainContainer>
  )
}

export default SecurityPhrase
