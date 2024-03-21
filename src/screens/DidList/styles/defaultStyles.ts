import { View } from 'react-native'
import styled from 'styled-components'
import ButtonStyled from '../../../components/atomic_components/Button'
import { safeStyledText } from '../../../components/atomic_components/Text'
import { Subtitle } from '../../../components/atomic_components/Text/variants'
import { getThemeColor, ColorKeys } from '../../../constants/Colors'

const defaultStyles = {
	ContainerBottom: styled(View)`
		flex: 1;
		justify-content: flex-end;
		align-items: center;
		margin: 20px auto 40px auto;
		width: 100%;
	`,

	Button: styled(ButtonStyled)``,

	CopyText: safeStyledText(Subtitle)`
  color: ${getThemeColor(ColorKeys.primary)};
  margin-top: 10px;
`,

	MainContainer: styled(View)`
		height: 100%;
	`,
	TextContainer: styled(View)`
		padding: 20px;
		margin-top: 5px;
	`,
}

export default defaultStyles
