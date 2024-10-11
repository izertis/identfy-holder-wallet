import styled, { css } from 'styled-components/native'
import { ColorKeys, getThemeColor } from '../../constants/Colors'
import ButtonStyled from '../atomic_components/Button'
import { DescriptionText } from '../atomic_components/Text/variants'
import { safeStyledText } from '../atomic_components/Text'

const RequestPresentationModalStyled = {
	ModalContainer: styled.View`
		justify-content: space-between;
		height: 100%;
		background-color: ${getThemeColor(ColorKeys.background)};
	`,
	CredentialContainer: styled.View`
		margin-top: 0px;
		margin-bottom: 12px;
	`,
	ModalContent: styled.View`
		padding: 20px;
		background-color: ${getThemeColor(ColorKeys.background)};
		height: 550px;
	`,
	ButtonContainer: styled.View`
		flex-direction: row;
		justify-content: center;
		margin-bottom: 40px;
	`,
	Button: styled(ButtonStyled).attrs({
		contentStyle: {
			width: 224,
			borderRadius: 15,
			backgroundColor: getThemeColor(ColorKeys.primary),
		},
	})``,
	ModalText: safeStyledText(DescriptionText)`margin-bottom: 20px; margin-top: 0px;`,

	Container: styled.View`
		background-color: transparent;
	`,
	HeaderContainer: styled.View`
		width: 100%;
		background-color: ${getThemeColor(ColorKeys.scrollBackground)};
		flex-direction: row;
		align-items: center;
		border-bottom-width: 1px;
	`,
	ScrollContainer: styled.ScrollView`
		height: 340px;
	`,
	ItemContainer: styled.View`
		width: 100%;
		flex-direction: row;
		align-items: center;
		border-bottom-width: 1px;
		padding-vertical: 4px;
		background-color: ${getThemeColor(ColorKeys.background)};
	`,
	ItemTextDate: safeStyledText(DescriptionText)`
    font-size: 12px;
		${(props: any) => `color: ${props.color};`}
  `,
	ItemTextIssuer: safeStyledText(DescriptionText)`
    font-size: 15px;
    font-weight: 500;
    letter-spacing: 0.5px;
  `,
	ItemTextCredentialName: safeStyledText(DescriptionText)`
    font-size: 12px;
    letter-spacing: 0.4px;
		width: 290px
  `,
}

export default RequestPresentationModalStyled
