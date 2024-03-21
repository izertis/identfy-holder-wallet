import styled from 'styled-components/native'
import { DescriptionText, Title } from '../atomic_components/Text/variants'
import { safeStyledText } from '../atomic_components/Text'
import { View } from 'react-native'

export const StyledContainerPlaceholder = styled.View`
	display: flex;
	flex-direction: column;
	height: 100%;
	padding-top: 30px;
	padding-horizontal: 27px;
`

export const StyledTitlePlaceholder = safeStyledText(Title)`
    font-size: 24px;
    font-weight: bold;
    font-style: normal;
    margin-bottom: 30px;
`

export const StyledTextPlaceholder = safeStyledText(DescriptionText).attrs({ fontWeight: '600' })`
    text-align: justify;
    font-size: 16px;
    letter-spacing: 0.3px;
`

export const ButtonContainerPlaceholder = styled(View)`
	display: flex;
	flex-direction: row;
	justify-content: center;
	width: 100%;
	margin-top: 40px;
	margin-left: -8px;
`
