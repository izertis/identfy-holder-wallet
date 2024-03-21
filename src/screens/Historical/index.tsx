import { useCallback, useRef } from 'react'
import { NavigationInjectedProps } from 'react-navigation'
import Placeholder from '../../components/Placeholder'
import { SCREEN } from '../../constants/screens'
import { useTranslation } from 'react-i18next'
import { checkAndLogExpiredCredentials, getActionLogs } from '../../utils/keychain'
import StateWrapper from '../../components/wrappers/StateWrapper'
import { StateWrapperRef } from '../../components/wrappers/StateWrapper/type'
import { useFocusEffect } from '@react-navigation/native'
import HistoricalStyled from './styles'
import HistoricalList from './components/HistoricalList'
import HistoricalI18nKeys from './i18n/keys'
import { StatusBar } from 'react-native'

interface Props extends NavigationInjectedProps { }

const Historical = (props: Props) => {
  const { t } = useTranslation(SCREEN.Historical)
  const childRef = useRef<StateWrapperRef>()

  useFocusEffect(
    useCallback(() => {
      checkAndLogExpiredCredentials()
    }, []),
  )

  const onHandleCredentials = async () => {
    const logs = await getActionLogs()
    return logs
  }

  const placeholderParams = {
    title: t(HistoricalI18nKeys.PLACEHOLDER_TITLE),
    subtitle: t(HistoricalI18nKeys.PLACEHOLDER_TEXT),
  }

  return (
    <HistoricalStyled.ContentView>
      <StateWrapper
        ref={childRef}
        initialFunction={onHandleCredentials}
        emptyStateCondition={(logs) => !logs.length}
        renderEmptyState={
          <Placeholder
            placeholderTitle={placeholderParams?.title}
            placeholderText={placeholderParams?.subtitle}
          />
        }
        renderData={(logs) => (
          <HistoricalList logs={logs} />
        )}
      />
    </HistoricalStyled.ContentView>
  )
}

export default Historical
