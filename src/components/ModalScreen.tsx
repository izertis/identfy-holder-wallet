import { Modal } from 'react-native'
import useModal from '../hooks/useModal'

const modalStyleDefault = {
  backgroundColor: 'white',
  borderRadius: 10,
  justifyContent: 'flex-start',
}

export default function ModalWrapper() {
  const { modal, hideModal } = useModal()
  const {
    onCancel,
    Component,
    isVisible,
    modalContainerStyle,
    modalContainerProps,
  } = modal
  const { Component: AuxComponent, ...modalProps } = modal
  const handleOnCancel = () => {
    onCancel?.()
    hideModal()
  }

  const handleOnAccept = (propsResponse?: any) => {
    modal.onAccept?.(propsResponse)
    hideModal()
  }


  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={handleOnCancel}
      style={{ ...modalStyleDefault, ...modalContainerStyle }}
      {...modalContainerProps}
    >
      {!!Component ? (
        <Component
          {...modalProps}
          onCancel={handleOnCancel}
          onAccept={handleOnAccept}
        />
      ) : <></>}
    </Modal>

  )
}
