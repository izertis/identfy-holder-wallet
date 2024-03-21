import styled from 'styled-components'
import TextStyled from '..'
import { ColorKeys, getThemeColor } from '../../../../constants/Colors'

const ErrorText = styled(TextStyled)`
	font-size: 16px;
	line-height: 20px;
	color: ${getThemeColor(ColorKeys.error)};
`

export default ErrorText
