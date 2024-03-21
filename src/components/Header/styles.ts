import styled from 'styled-components/native'
import { Title } from '../atomic_components/Text/variants'
import { ColorKeys, getThemeColor } from '../../constants/Colors'
import { safeStyledText } from '../atomic_components/Text'
import { Platform } from 'react-native'

const HeaderStyled = {
	Header: styled.View`
		background-color: ${getThemeColor(ColorKeys.headerBackground)};
		padding: 18px;
		padding-top: ${Platform.OS === 'ios' ? '60px' : '20px'};
		flex-direction: row;
		justify-content: space-between;
	`,
	Title: safeStyledText(Title)`
    color: white;
  `,
	CancelButton: safeStyledText(Title)`
    color: white;
    margin-right: 10px;
  `,
}
export default HeaderStyled
