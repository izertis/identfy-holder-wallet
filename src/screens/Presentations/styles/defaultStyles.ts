import styled from 'styled-components/native'
import { View } from '../../../components/Themed'

const defaultStyles = {
	LoadingView: styled(View)`
		padding-vertical: 20px;
	`,

	HeaderControlView: styled(View)`
		display: flex;
		flex-direction: row;
		justify-content: space-between;
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
		background-color: #00000001;
	`,
}

export default defaultStyles
