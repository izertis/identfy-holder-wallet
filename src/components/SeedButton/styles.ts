import { Text, TouchableOpacity } from 'react-native'
import styled from 'styled-components'
import { ColorKeys, getThemeColor } from '../../constants/Colors'

export const StyledSeedButton = styled(TouchableOpacity)`
    width: auto;
    padding: 2px 12px;
    height: 30px;
    border-radius: 5px;
    border: 1px;
    border-color: ${getThemeColor(ColorKeys.secondary)}
    margin: 5px;
    `

export const ButtonText = styled(Text)`
    margin: 0 auto
    padding-top: 2px;
    color: ${getThemeColor(ColorKeys.text)};
    `
