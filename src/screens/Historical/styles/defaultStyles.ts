import styled from 'styled-components/native'
import { View } from '../../../components/Themed'
import DropDownSelect from '../../../components/DropDownSelect'
import { safeStyledText } from '../../../components/atomic_components/Text'
import { DescriptionText } from '../../../components/atomic_components/Text/variants'
import { getThemeColor, ColorKeys } from '../../../constants/Colors'

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

	ContentView: styled(View)`
		height: 90%;
	`,

	HistoricalDetailContainer: styled(View)`
		padding-vertical: 15px;
		border-width: 1px;
		border-color: #00000010;
		margin-top: -2px;
		background-color: #00000001;
		flex-direction: row;
	`,

	ElementContainer: styled(View)<any>`
		${({ direction }) => (direction === 'row' ? 'flex-direction: row;' : 'flex-direction: column;')}
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
	}))``,
	Text: safeStyledText(DescriptionText)``,
}

export default defaultStyles
