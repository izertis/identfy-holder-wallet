import { useCallback, useRef } from 'react'
import { NavigationInjectedProps } from 'react-navigation'
import Placeholder from '../../components/Placeholder'
import { SCREEN } from '../../constants/screens'
import { useTranslation } from 'react-i18next'
import { getPresentationList } from '../../utils/keychain'
import StateWrapper from '../../components/wrappers/StateWrapper'
import { StateWrapperRef } from '../../components/wrappers/StateWrapper/type'
import PresentationList from './components/PresentationList'
import { useFocusEffect } from '@react-navigation/native'
import PresentationStyled from './styles'
import PresentationsI18nKeys from './i18n/keys'

interface Props extends NavigationInjectedProps { }

const Presentations = (props: Props) => {
  const { t } = useTranslation(SCREEN.Presentations)
  const childRef = useRef<StateWrapperRef>()

  const reloadPresentations = () => {
    childRef.current?.reload?.()
  }

  useFocusEffect(
    useCallback(() => {
      reloadPresentations()
    }, []),
  )

  const onHandlePresentations = async () => {
    const presentations = await getPresentationList()
    return presentations
  }

  const placeholderParams = {
    title: t(PresentationsI18nKeys.PLACEHOLDER_TITLE),
    subtitle: t(PresentationsI18nKeys.PLACEHOLDER_TEXT),
  }

  return (
    <PresentationStyled.ContentView>
      <StateWrapper
        ref={childRef}
        initialFunction={onHandlePresentations}
        emptyStateCondition={(presentations) => !presentations.length}
        renderEmptyState={
          <Placeholder
            placeholderTitle={placeholderParams?.title}
            placeholderText={placeholderParams?.subtitle}
          />
        }
        renderData={(presentations) => (
          <PresentationList presentations={presentations} />
        )}
      />
    </PresentationStyled.ContentView>
  )
}

export default Presentations
