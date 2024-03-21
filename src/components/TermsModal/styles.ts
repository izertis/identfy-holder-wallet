import styled from 'styled-components/native'
import { safeStyledText } from '../atomic_components/Text'
import { Subtitle } from '../atomic_components/Text/variants'
import { ColorKeys, getThemeColor } from '../../constants/Colors'
import { Platform } from 'react-native'

export const Container = styled.SafeAreaView`
	flex: 1;
	justify-content: center;
	align-items: center;
	margin-top: ${Platform.OS === 'android' ? '-50px' : '50px'};
	margin-bottom: 10px;
`

export const ModalView = styled.View`
	margin: 1px;
	margin-top: 40px;
	margin-bottom: 90px;
	background-color: ${getThemeColor(ColorKeys.background)}
	border-radius: 20px;
	padding: 35px;
	align-items: center;
	shadow-color: #000000;
	shadow-offset: 0px 2px;
	shadow-opacity: 0.25;
	shadow-radius: 4px;
	elevation: 5;
`

export const ModalText = styled.Text`
	text-align: justify;
	color: ${getThemeColor(ColorKeys.text)};
`

export const ModalTitle = safeStyledText(Subtitle)`
text-align: center;
padding-bottom: 20px;
`

export const TextContainer = styled.ScrollView`
	width: 100%;
`
