import { Checkbox } from 'react-native-paper'
import styled from 'styled-components/native'
import { ColorKeys, getThemeColor } from '../../../constants/Colors'
import { FONT_FAMILY } from '../../../constants/fontFamily'

const CheckBoxStyled = styled(Checkbox.Android).attrs((props: any) => ({
	color: getThemeColor(props.disabled ? ColorKeys.disabled : ColorKeys.secondary),
	style: {
		padding: 0,
		margin: 0,
	},
	status: props.checked ? 'checked' : 'unchecked',
}))<{ checked: boolean; disabled?: boolean }>`
	font-size: 14px;
	font-weight: normal;
	font-family: ${FONT_FAMILY.PRINCIPAL};
	border-width: 1px;
`

export default CheckBoxStyled
