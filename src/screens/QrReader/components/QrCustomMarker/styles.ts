import { View, Dimensions } from 'react-native'
import styled from 'styled-components'
import { DescriptionText, Title as StyledTitle } from '../../../../components/atomic_components/Text/variants'
import { Button } from 'react-native-paper'
import { ColorKeys, getThemeColor } from '../../../../constants/Colors'
import { safeStyledText } from '../../../../components/atomic_components/Text'

const MARKER_WIDTH = Dimensions.get('window').width * 0.8
const MARKER_HEIGHT = Dimensions.get('window').height
const overlayColor = 'rgba(0, 0, 0, 0.6)'

export const ViewContainer = styled(View)`
	position: absolute;
	display: flex;
	flex-direction: row;
	flex: 1;
`

export const BackButton = styled(Button).attrs(() => ({
	icon: 'arrow-left',
	labelStyle: { color: getThemeColor(ColorKeys.invertedText) },
}))`
	width: 120px;
	margin-bottom: 6%;
	margin-left: -8%;
`

export const LateralSpace = styled(View)`
	flex-grow: 1;
	height: ${MARKER_HEIGHT}px;
	background-color: ${overlayColor};
`

export const MarkerContainer = styled(View)`
	max-width: ${MARKER_WIDTH}px;
`

export const Marker = styled(View)`
	width: ${MARKER_WIDTH}px;
	height: ${MARKER_WIDTH}px;
`

export const TextContainer = styled(View)`
	padding-top: 35px;
	flex-grow: 1;
	background-color: ${overlayColor};
	justify-content: flex-end;
	padding-bottom: 50px;
`

export const Title = styled(StyledTitle)`
	font-size: 20px;
	color: white;
	margin-bottom: 20px;
`

export const SubTitle = safeStyledText(DescriptionText)`
  font-size: 14px;
  color: white;
`

export const BottomSpace = styled(View)`
	height: 100%;
	background-color: ${overlayColor};
`
