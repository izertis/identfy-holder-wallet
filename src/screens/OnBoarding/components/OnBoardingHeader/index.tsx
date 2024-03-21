import React from 'react'
import { useTranslation } from 'react-i18next'
import { NavigationInjectedProps } from 'react-navigation'
import { SCREEN } from '../../../../constants/screens'
import { IMG } from '../../../../constants/urlImages'
import OnBoardingI18nKeys from '../../i18n/keys'
import HeaderStyled from './styles'
interface Props extends NavigationInjectedProps {}

const Header = (props: Props) => {
  const { t } = useTranslation(SCREEN.OnBoarding)
  return (
    <HeaderStyled.LinkHeader>
      <HeaderStyled.RowView>
        <HeaderStyled.IconHeader source={IMG.ONBOARDING_ICON} />
        <HeaderStyled.TextHeader>{` ${t(
          OnBoardingI18nKeys.LINK_HEADER
        )}`}</HeaderStyled.TextHeader>
      </HeaderStyled.RowView>
      <HeaderStyled.SkipButton
        onPress={() => props.navigation.navigate(SCREEN.Register)}
      >
        {t(OnBoardingI18nKeys.SKIP)}
      </HeaderStyled.SkipButton>
    </HeaderStyled.LinkHeader>
  )
}

export default Header
