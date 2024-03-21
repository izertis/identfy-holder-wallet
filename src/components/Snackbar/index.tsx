import { useContext } from 'react'
import Colors, { ColorKeys, getThemeColor } from '../../constants/Colors'
import { THREE_SECONDS_SNACK_DURATION } from '../../constants/Quantities'
import { MessageContext } from '../../context/UserMessage.context'
import { StyledSnackbar } from './styles'

export default function SnackbarMessage(): JSX.Element {
  const { setMessageInfo, messageInfo } = useContext(MessageContext)

  const getBackgroundColor = (messageType: string) => {
    if (messageType === 'error') {
      return getThemeColor(ColorKeys.error)
    } else if (messageType === 'success') {
      return getThemeColor(ColorKeys.success)
    } else if (messageType === 'warning') {
      return Colors.warning
    } else {
      return 'transparent'
    }
  }
  const snackbarStyle = {
    backgroundColor: getBackgroundColor(messageInfo.type),
  }

  return (
    <StyledSnackbar
      wrapperStyle={{ bottom: 100, zIndex: 10000 }}
      visible={messageInfo.isVisible && messageInfo.content}
      duration={THREE_SECONDS_SNACK_DURATION}
      onDismiss={() => {
        setMessageInfo({ content: '', type: '', isVisible: false })
      }}
      style={snackbarStyle}
    >
      {messageInfo.content}
    </StyledSnackbar>
  )
}
