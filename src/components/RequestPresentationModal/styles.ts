import styled from 'styled-components/native'
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
		margin-top: 50px;
		margin-bottom: 12px;
	`,
	ModalContent: styled.View`
		margin-top: 30px;
		padding: 20px;
		background-color: ${getThemeColor(ColorKeys.background)};
	`,
	ModalTextContent: styled.View`
		flex-direction: row;
	`,
	ButtonContainer: styled.View`
		flex-direction: row;
		justify-content: center;
		margin-bottom: 40px;
	`,
	DropDownPickerContainer: styled.View`
		margin-top: 30px;
	`,
	Button: styled(ButtonStyled).attrs({
		contentStyle: {
			width: 224,
			borderRadius: 15,
			backgroundColor: getThemeColor(ColorKeys.primary),
		},
	})``,
	ButtonText: safeStyledText(DescriptionText)`
    font-weight: bold;
    z-index: 0;
  `,

	ModalText: safeStyledText(DescriptionText)``,

	ModalBoldText: safeStyledText(DescriptionText)`
    font-weight: bold;
  `,
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
		height: 350px;
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
  `,
	ItemTextIssuer: safeStyledText(DescriptionText)`
    font-size: 15px;
    font-weight: 500;
    letter-spacing: 0.5px;
  `,
	ItemTextCredentialName: safeStyledText(DescriptionText)`
    font-size: 12px;
    letter-spacing: 0.4px;
  `,
}

export default RequestPresentationModalStyled
