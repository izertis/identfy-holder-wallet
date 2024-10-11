import styled from 'styled-components/native'
import { Text, View } from 'react-native'
import { ColorKeys, getThemeColor } from '../../constants/Colors'

export const Container = styled(View)`
	padding: 10px;
	padding-left: 22px;
	padding-right: 22px;
`

export const Row = styled(View)<{ marginTop?: string }>`
	flex-direction: row;
	align-items: center;
	margin-bottom: 5px;
	margin-top: ${({ marginTop }) => marginTop || '0px'};
`

export const LabelText = styled(Text)<{ fontWeight?: string; color?: string }>`
	font-weight: ${({ fontWeight }) => fontWeight || '400'};
	color: ${({ color }) => color || getThemeColor(ColorKeys.text)};
`

export const ValueText = styled(Text)<{ maxWidth?: string; fontWeight?: string; color?: string }>`
	color: ${({ color }) => color || '#999'};
	max-width: ${({ maxWidth }) => maxWidth || '100%'};
	font-weight: ${({ fontWeight }) => fontWeight || 'normal'};
`
