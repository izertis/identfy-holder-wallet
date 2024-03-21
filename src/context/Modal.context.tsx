import { createContext, useState } from 'react'
import { ModalPropsAndroid } from 'react-native'

const ModalContext = createContext({} as any)

export type ModalPropsWithoutIsVisible = {
  onAccept?: (props?: any) => void
  onCancel?: () => void
  Component?: (props: any) => JSX.Element
  modalProps?: any
  modalContainerProps?: ModalPropsAndroid
  modalContainerStyle?: any
}
export type ModalProps = {
  isVisible: boolean
} & ModalPropsWithoutIsVisible

export type ModalContextProps = {
  modal: ModalProps
  showModal: (props?: ModalPropsWithoutIsVisible) => void
  hideModal: () => void
}

function ModalWrapper(props: any) {
  const [modal, setModal] = useState<ModalProps>({
    isVisible: false,
    onAccept: () => { },
  })

  const showModal = (props: ModalPropsWithoutIsVisible) => {
    setModal({
      isVisible: true,
      ...props,
    })
  }
  const hideModal = () => {
    setModal({
      isVisible: false,
    })
  }
  return (
    <ModalContext.Provider value={{ modal, showModal, hideModal }}>
      {props.children}
    </ModalContext.Provider>
  )
}

export { ModalContext, ModalWrapper }
