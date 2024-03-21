import React from "react"
import PopupStyled from "./styles"
import { ModalProps } from "../../context/Modal.context"

const MyModal = (props: ModalProps) => {
  const handleAccept = () => {
    props.onAccept?.()
  }

  return (
    <PopupStyled.Modal isVisible={props.isVisible}>
      <PopupStyled.ModalContainer>
        <PopupStyled.ModalContent>
          {props.modalProps?.title && (
            <PopupStyled.ModalText>{props.modalProps?.title}</PopupStyled.ModalText>
          )}
          {props.modalProps?.description && (
            <PopupStyled.ModalText>{props.modalProps?.description}</PopupStyled.ModalText>
          )}
          <PopupStyled.ButtonContainer>
            <PopupStyled.Button onPress={props.onCancel}>
              <PopupStyled.ButtonText>Cancelar</PopupStyled.ButtonText>
            </PopupStyled.Button>
            <PopupStyled.Button onPress={handleAccept}>
              <PopupStyled.ButtonText>Aceptar</PopupStyled.ButtonText>
            </PopupStyled.Button>
          </PopupStyled.ButtonContainer>
        </PopupStyled.ModalContent>
      </PopupStyled.ModalContainer>
    </PopupStyled.Modal>
  )
}

export default MyModal
