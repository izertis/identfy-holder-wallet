import { View } from 'react-native'
import { Button } from 'react-native-paper'
import styled from 'styled-components'
import InputStyled, { safeStyledInput } from '../../../components/atomic_components/InputStyled'
import { safeStyledText } from '../../../components/atomic_components/Text'
import { Title } from '../../../components/atomic_components/Text/variants'
import ScreenMarginStyle from '../../../components/wrappers/ScreenMarginStyle'
import { ColorKeys, getThemeColor } from '../../../constants/Colors'
import { FONT_FAMILY } from '../../../constants/fontFamily'
import { UIActivityIndicator } from 'react-native-indicators'
import ButtonStyled from '../../../components/atomic_components/Button'

const defaultStyles = {
	MainContainer: styled(ScreenMarginStyle)`
		padding-top: 19px;
	`,
	Button: styled(ButtonStyled)``,
	RegisterButton: styled(Button).attrs(() => ({
		icon: 'arrow-right',
		labelStyle: {
			color: getThemeColor(ColorKeys.primary),
			fontFamily: FONT_FAMILY.PRINCIPAL_600,
		},
		contentStyle: {
			width: 120,
		},
		width: 120,
	}))`
		margin-bottom: 19px;
		margin-left: -5%;
	`,

	Title: safeStyledText(Title)``,

	InputsContainer: styled(View)`
		margin-left: 6%;
		margin-right: 8%;
		margin-top: 12%;
	`,

	InputStyled: safeStyledInput(InputStyled)`
    margin-top: 5px;
    margin-left: -15px;
`,

	ContainerBottom: styled(View)`
		flex: 1;
		justify-content: flex-end;
		align-items: center;
		margin: 20px auto 40px auto;
		width: 100%;
	`,

	SplashActivityIndicator: styled(UIActivityIndicator)`
		flex: 1;
		justify-content: flex-end;
		align-items: center;
		margin-bottom: 6%;
	`,
}

export default defaultStyles
