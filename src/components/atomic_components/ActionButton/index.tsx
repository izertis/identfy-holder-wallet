import { ButtonProps } from 'react-native-paper'
import styled from 'styled-components/native'
import { ColorKeys, getThemeColor } from '../../../constants/Colors'
import CredentialStyled from '../../../screens/Credentials/styles'
import ButtonStyled from '../Button'
interface Props {
  size?: number
  disabled?: boolean
  buttonColor?: string
}

const ActionButton = styled(ButtonStyled).attrs((props: Props) => ({
  mode: 'contained',
  contentStyle: {
    paddingVertical: 16,
    backgroundColor: props.disabled
      ? getThemeColor(ColorKeys.disabled)
      : props.buttonColor,
  },
  icon:() => <CredentialStyled.ActionIcon />
}))<ButtonProps & Props>`
  border-radius: 16px;
  align-items: center;
  justify-content: center;
`

export const ButtonContainer = styled.View`
  position: absolute;
  bottom: -20px;
  right: 15px;
  border-radius:16px;
  padding: 4px;
  elevation: 6;
`

export default ActionButton
