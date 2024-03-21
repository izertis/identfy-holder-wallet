import styled from "styled-components/native"
import { DescriptionText } from "../../../atomic_components/Text/variants"
import Icon from "react-native-vector-icons/MaterialIcons"
import { ColorKeys, getThemeColor } from "../../../../constants/Colors"

const Arrow = styled.View<{ xPosition: string }>`
  position: absolute;
  background-color: white;
  top: -4px;
  left: ${({ xPosition }) => xPosition};
  height: 20px;
  width: 20px;
  border-width: 1px;
  transform: rotate(45deg);
  border-radius: 4px;
  z-index: 1;
`
const DropDownItemListArrowStyled = {
  Arrow,
  ArrowBorderEraser: styled(Arrow)`
    top: -1px;
    margin-left: 3px;
    height: 4px;
    width: 14px;
    z-index: 11;
    border-width: 0px;
    transform: rotate(0deg);
  `,
}

export default DropDownItemListArrowStyled
