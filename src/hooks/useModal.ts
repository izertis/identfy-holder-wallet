import { useContext } from "react";
import { ModalContext, ModalContextProps, ModalPropsWithoutIsVisible } from "../context/Modal.context";

/**
 * Custom hook for interacting with the modal context.
 * Provides access to modal state and methods for showing/hiding the modal.
 *
 * @returns {ModalContextProps} Object with modal state and methods.
 */
const useModal = () => {
  const modalContext: ModalContextProps = useContext(ModalContext);

  /**
   * Show a modal with the specified properties.
   *
   * @param {ModalPropsWithoutIsVisible} props - The modal properties.
   */
  const showModal = (props: ModalPropsWithoutIsVisible) => {
    modalContext.showModal(props);
  };

  /**
   * Hides the currently visible modal.
   */
  const hideModal = () => {
    modalContext.hideModal();
  };

  return {
    modal: modalContext.modal,
    showModal,
    hideModal,
  };
};

export default useModal;
