import styled from "styled-components/native";

const getJustifyContent = ({ spaceBetween }: any) => {
  if (spaceBetween) {
    return "justify-content: space-between;";
  } else {
    return "";
  }
};

const ScreenView = styled.View`
  height: 100%;
  ${(props:any) => getJustifyContent(props)}
`;

export default ScreenView;
