import styled from "styled-components/native"
import { DescriptionText } from "../../../atomic_components/Text/variants"
import Icon from "react-native-vector-icons/MaterialIcons"
import { ColorKeys, getThemeColor } from "../../../../constants/Colors"

const DropDownItemStyled = {
    TouchableOpacity: styled.TouchableOpacity<{ withListArrow?: boolean }>`
    flex-direction: row;
    padding: 5px;
    align-items: center;
  `,
}

export default DropDownItemStyled
