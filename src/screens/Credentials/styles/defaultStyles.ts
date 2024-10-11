import styled from 'styled-components/native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { ColorKeys, getThemeColor } from '../../../constants/Colors'
import { View } from '../../../components/Themed'
import { DescriptionText } from '../../../components/atomic_components/Text/variants'
import { safeStyledText } from '../../../components/atomic_components/Text'
import DropDownSelect from '../../../components/DropDownSelect'
import { TEST_LABELS } from '../constants/testLabels'
import { TouchableOpacity, Text } from 'react-native'
import { List } from 'react-native-paper'

const defaultStyles = {
	ActionIcon: styled(Icon).attrs({
		name: 'qr-code-scanner',
		size: 32,
		color: getThemeColor(ColorKeys.buttonText),
	})`
		margin-left: 10px;
	`,
	ContentView: styled(View)`
		height: 92%;
	`,
	CredentialDetailContainer: styled.View`
		border-width: 1px;
		border-color: #00000010;
		margin-top: -2px;
		background-color: ${getThemeColor(ColorKeys.background)};
		width: 100%;
	`,

	DropDownSelect: styled(DropDownSelect).attrs((props) => ({
		multiple: true,
		withListArrow: true,
		containerStyle: {
			width: 150,
			marginHorizontal: 33,
			marginTop: 10,
		},
		valueContentStyle: {
			paddingVertical: 5,
		},
		itemContainerStyle: {
			shadowColor: '#000',
			shadowOffset: { width: 0, height: 2 },
			shadowOpacity: 0.5,
			shadowRadius: 2,
			elevation: 2,
			borderWidth: 0,
		},
		activationColor: getThemeColor(ColorKeys.primary),
		testID: TEST_LABELS.DropDownSelect,
	}))``,
	Text: safeStyledText(DescriptionText)``,

	LoadingView: styled(View)`
		padding-vertical: 20px;
	`,

	MailboxButton: styled(TouchableOpacity)``,

	HeaderContainer: styled(View)`
		display: flex;
		flex-direction: row;
	`,

	ButtonContainer: styled(View)`
		justify-content: center;
		margin-top: 10px;
		margin-bottom: 10px;
		margin-left: 15px;
	`,

	LabelText: styled(Text)`
		font-weight: bold;
	`,

	ExpirationText: styled(Text)<{ isExpired: boolean }>`
		color: ${({ isExpired }) => (isExpired ? getThemeColor(ColorKeys.error) : getThemeColor(ColorKeys.placeholder))};
	`,

	StyledAccordion: styled(List.Accordion)`
		padding-vertical: -10px;
		background-color: ${getThemeColor(ColorKeys.background)};
	`,

	LoadingContainer: styled(View)`
		padding: 16px;
	`,
}

export default defaultStyles
