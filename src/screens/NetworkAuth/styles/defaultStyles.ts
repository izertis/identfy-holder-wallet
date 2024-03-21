import { UIActivityIndicator } from 'react-native-indicators'
import { Button, CheckboxProps } from 'react-native-paper'
import styled from 'styled-components/native'
import ButtonStyled from '../../../components/atomic_components/Button'
import CheckBoxStyled from '../../../components/atomic_components/CheckBox'
import { safeStyledText } from '../../../components/atomic_components/Text'
import { DescriptionText, Title } from '../../../components/atomic_components/Text/variants'
import ScreenMarginStyle from '../../../components/wrappers/ScreenMarginStyle'
import { ColorKeys, getThemeColor } from '../../../constants/Colors'

const defaultStyles = {
	MainContainer: styled(ScreenMarginStyle)``,

	GoBackButton: styled(Button).attrs(() => ({
		icon: 'arrow-left',
		labelStyle: { color: getThemeColor(ColorKeys.primary) },
	}))`
		width: 22%;
		margin-top: 5%;
		margin-bottom: 6%;
		margin-left: -1%;
	`,

	GoBackButtonContainer: styled.View`
		height: 79px;
	`,

	Title: safeStyledText(Title)``,

	Subtitle: safeStyledText(DescriptionText)`
		margin-top: 30px;
		margin-bottom: 10px;
		text-align: justify;
    `,

	CheckBoxContainer: styled.View`
		padding-top: 5%;
		flex-direction: row;
		align-items: center;
		justify-content: flex-start;
	`,

	CheckBox: styled(CheckBoxStyled).attrs((props: any) => ({
		containerStyle: {
			padding: 4,
			marginHorizontal: 5,
		},
		...props,
	}))<CheckboxProps>``,

	ContainerBottom: styled.View`
		flex: 1;
		justify-content: flex-end;
		align-items: center;
		margin: 20px auto 55px auto;
		width: 100%;
	`,

	Button: styled(ButtonStyled)``,

	SplashActivityIndicator: styled(UIActivityIndicator)`
		flex: 1;
		justify-content: flex-end;
		align-items: center;
		margin-bottom: 6%;
	`,
}

export default defaultStyles
