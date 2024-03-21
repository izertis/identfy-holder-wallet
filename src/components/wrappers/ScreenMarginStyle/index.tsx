import styled from "styled-components/native";

const getJustifyContent = ({ spaceBetween }: any) => {
  if (spaceBetween) {
    return "justify-content: space-between;";
  } else {
    return "";
  }
};

const ScreenMarginStyle = styled.View`
  height: 100%;
  margin-left: 25px;
  margin-right: 25px;
  margin-top: 15px;
  padding-bottom: 35px;
  ${(props:any) => getJustifyContent(props)}
`;

export default ScreenMarginStyle;
