import styled from "styled-components/native"
import { DescriptionText } from "../../../../components/atomic_components/Text/variants"
import { safeStyledText } from "../../../../components/atomic_components/Text"

const DidCardStyled = {
  Container: styled.View`
    margin: 0px 0px -2px
    padding: 20px 12px 20px 19px;
    elevation: 1;
    box-shadow: 0px 0px 0px rgba(0, 0, 0, 0.8);
    backgroundColor : #FFFFFF01
  `,
  ViewRow: styled.View`
    display: flex;
    flex-direction: row;
    align-items: center;
  `,
  Icon: styled.Image`
    width: 16px;
    height: 16px;
  `,
  TextContainer: styled.View`
    padding-left: 12px;
    padding-right: 12px;
  `,
  DescriptionText: safeStyledText(DescriptionText)`
    letter-spacing: 0.25px;
    font-size: 13px;
  `,
  Title: safeStyledText(DescriptionText)`
    letter-spacing: 0.25px;
    font-size: 15px;
  `,
}

export default DidCardStyled
