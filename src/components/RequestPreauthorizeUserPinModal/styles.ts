import styled from 'styled-components/native'
import { ColorKeys, getThemeColor } from '../../constants/Colors'
import ButtonStyled from '../atomic_components/Button'
import { DescriptionText } from '../atomic_components/Text/variants'
import { safeStyledText } from '../atomic_components/Text'

const RequestPreauthorizeUserPinModalStyled = {
	ModalContainer: styled.View`
		justify-content: space-between;
		height: 100%;
		background-color: ${getThemeColor(ColorKeys.background)};
	`,
	CredentialContainer: styled.View`
		margin-top: 12px;
		margin-bottom: 12px;
	`,
	ModalContent: styled.View`
		background-color: white;
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
		margin-top: 50px;
	`,
	Button: styled(ButtonStyled).attrs({
		contentStyle: {
			width: 224,
			borderRadius: 15,
			backgroundColor: getThemeColor(ColorKeys.primary),
		},
	})``,
	ModalText: safeStyledText(DescriptionText)``,

	ModalBoldText: safeStyledText(DescriptionText)`
    font-weight: bold;
  `,
}

export default RequestPreauthorizeUserPinModalStyled
