import { Modal } from "react-native-paper"
import styled from "styled-components/native"
import { DescriptionText } from "../atomic_components/Text/variants"
import ButtonStyled from "../atomic_components/Button"
import { ColorKeys, getThemeColor } from "../../constants/Colors"
import { safeStyledText } from "../atomic_components/Text"

const PopupStyled = {
  ModalContainer: styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;
  `,
  ModalContent: styled.View`
    background-color: white;
    border-radius: 10px;
    padding: 20px;
    width: 80%;
    border-width: 1px;
  `,
  ButtonContainer: styled.View`
    flex-direction: row;
    justify-content: space-between;
    margin-top: 10px;
  `,
  Button: styled(ButtonStyled).attrs({
    contentStyle: {
      width: 100,
      borderRadius: 15,
      backgroundColor: getThemeColor(ColorKeys.primary)
    },
  })`
  `,

  ButtonText: safeStyledText(DescriptionText)`
    color: white;
    font-weight: bold;
  `,

  ModalText: safeStyledText(DescriptionText)`
    margin-bottom: 10px;
  `,

  Modal: styled(Modal)<{ isVisible: boolean }>``,
}

export default PopupStyled
