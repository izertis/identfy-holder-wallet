import { createContext, useState } from 'react'

const MessageContext = createContext({} as any)

function MessageProviderWrapper(props: any) {
  const [messageInfo, setMessageInfo] = useState<{
    content: string
    type: 'error' | 'success' | 'warning'
    isVisible: boolean
  }>({
    content: '',
    type: 'success',
    isVisible: false,
  })

  const showMessage = ({
    content,
    type,
  }: {
    content: string
    type: 'error' | 'success' | 'warning'
  }) => {
    setMessageInfo({
      content,
      type,
      isVisible: true,
    })
  }

  return (
    <MessageContext.Provider
      value={{ messageInfo, showMessage, setMessageInfo }}
    >
      {props.children}
    </MessageContext.Provider>
  )
}

export { MessageContext, MessageProviderWrapper }
