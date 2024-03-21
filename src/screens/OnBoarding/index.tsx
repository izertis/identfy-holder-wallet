import { NavigationInjectedProps } from 'react-navigation'
import React from 'react'

import OnBoardingStyled from './styles'
import { StatusBar, useWindowDimensions } from 'react-native'
import { useTranslation } from 'react-i18next'
import OnBoardingI18nKeys from './i18n/keys'
import { SCREEN } from '../../constants/screens'
import SwiperPageWrapper from './components/SwiperPageWrapper'
import { IMG } from '../../constants/urlImages'
import OnBoardingHeader from './components/OnBoardingHeader'
import OnBoardingDescription from './components/OnBoardingDescription'

interface Props extends NavigationInjectedProps { }
const OnBoarding = (props: Props) => {
	const { t } = useTranslation(SCREEN.OnBoarding)

	const swiperPagesParams = [
		{
			title: t(OnBoardingI18nKeys.FIRST_SCREEN_TITLE),
			subtitle: t(OnBoardingI18nKeys.FIRST_SCREEN_SUBTITLE),
		},
		{
			title: t(OnBoardingI18nKeys.SECOND_SCREEN_TITLE),
			subtitle: t(OnBoardingI18nKeys.SECOND_SCREEN_SUBTITLE),
		},
		{
			title: t(OnBoardingI18nKeys.THIRD_SCREEN_TITLE),
			subtitle: t(OnBoardingI18nKeys.THIRD_SCREEN_SUBTITLE),
			extraComponent: (
				<OnBoardingStyled.BottomContainer>
					<OnBoardingStyled.WhiteButton onPress={() => props.navigation.navigate(SCREEN.Register)}>
						{t(OnBoardingI18nKeys.BUTTON)}
					</OnBoardingStyled.WhiteButton>
				</OnBoardingStyled.BottomContainer>
			),
		},
	]
	return (
		<OnBoardingStyled.MainView>
			<StatusBar barStyle='light-content' />
			<OnBoardingStyled.ImageScreen source={IMG.ONBOARDING_BACKGROUND}>
				<OnBoardingHeader navigation={props.navigation} />
				<OnBoardingStyled.SwiperStyled
					width={useWindowDimensions().width}
					height={useWindowDimensions().height - 100}
					loop={false}
				>
					{swiperPagesParams.map(({ title, subtitle, extraComponent }, index) => (
						<SwiperPageWrapper
							key={'SwiperPageWrapper-' + index}
							renderDescription={<OnBoardingDescription title={title} subtitle={subtitle} />}
						>
							{extraComponent}
						</SwiperPageWrapper>
					))}
				</OnBoardingStyled.SwiperStyled>
			</OnBoardingStyled.ImageScreen>
		</OnBoardingStyled.MainView>
	)
}

export default OnBoarding
