import { View, Text } from 'react-native'
import styled from 'styled-components/native'
import { ColorKeys, getThemeColor } from '../../../constants/Colors'
import { List } from 'react-native-paper'

const defaultStyles = {
	LoadingView: styled(View)`
		padding-vertical: 20px;
	`,

	HeaderControlView: styled(View)`
		display: flex;
		flex-direction: row;
		justify-content: flex-end;
		padding-horizontal: 10px;
	`,

	CheckBoxView: styled(View)`
		flex-direction: row;
		align-items: center;
	`,

	ContentView: styled(View)`
		height: 90%;
	`,

	PresentationDetailContainer: styled(View)`
		border-width: 1px;
		border-color: #00000010;
		margin-top: -2px;
		background-color: ${getThemeColor(ColorKeys.background)};
	`,

	LabelText: styled(Text)`
		font-weight: bold;
	`,

	StyledAccordion: styled(List.Accordion)`
		padding-vertical: -10px;
		background-color: ${getThemeColor(ColorKeys.background)};
	`,
}

export default defaultStyles
