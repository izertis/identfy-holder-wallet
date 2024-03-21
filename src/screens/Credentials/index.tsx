import { useCallback, useRef, useState, useEffect } from 'react'
import { StatusBar } from 'react-native'
import CredentialStyled from './styles'
import { NavigationInjectedProps } from 'react-navigation'
import Placeholder from '../../components/Placeholder'
import CredentialsI18nKeys from './i18n/keys'
import { SCREEN } from '../../constants/screens'
import { useTranslation } from 'react-i18next'
import { getCredentialsList } from '../../utils/keychain'
import CredentialList from './components/CredentialList'
import ButtonScanner from './components/ButtonScanner'
import StateWrapper from '../../components/wrappers/StateWrapper'
import { StateWrapperRef } from '../../components/wrappers/StateWrapper/type'
import { useFocusEffect } from '@react-navigation/native'

interface Props extends NavigationInjectedProps { }

const Credentials = (props: Props) => {
  const { t } = useTranslation(SCREEN.Credentials)
  const childRef = useRef<StateWrapperRef>()

  const reloadCredentials = () => {
    childRef.current?.reload?.()
  }

  useFocusEffect(
    useCallback(() => {
      reloadCredentials()
    }, []),
  )

  const onHandleCredentials = async () => {
    const credentials = await getCredentialsList()
    return credentials
  }

  const placeholderParams = {
    title: t(CredentialsI18nKeys.PlACEHOLDER_TITLE),
    subtitle: t(CredentialsI18nKeys.PlACEHOLDER_TEXT),
  }

  return (
    <CredentialStyled.ContentView>
      <StatusBar backgroundColor='transparent' barStyle='light-content' />
      <StateWrapper
        ref={childRef}
        initialFunction={onHandleCredentials}
        emptyStateCondition={(credentials) => !credentials.length}
        renderEmptyState={
          <Placeholder
            placeholderTitle={placeholderParams?.title}
            placeholderText={placeholderParams?.subtitle}
          />
        }
        renderData={(credentials) => (
          <CredentialList
            credentials={credentials}
          />
        )}
      />
      <ButtonScanner
        onPress={() => {
          props.navigation.navigate('QrReader')
        }}
      />
    </CredentialStyled.ContentView>
  )
}

export default Credentials