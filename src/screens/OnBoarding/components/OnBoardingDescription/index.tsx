import React from "react";
import OnBoardingDescriptionStyled from "./styles";

interface Props {
    title:string,
    subtitle:string,
  }
const OnBoardingDescription = (props:Props) => {
  return (
    <OnBoardingDescriptionStyled.DescriptionContent>
      <OnBoardingDescriptionStyled.TitleContainer>
        <OnBoardingDescriptionStyled.Title>{props.title}</OnBoardingDescriptionStyled.Title>
      </OnBoardingDescriptionStyled.TitleContainer>
      <OnBoardingDescriptionStyled.Subtitle>{props.subtitle}</OnBoardingDescriptionStyled.Subtitle>
    </OnBoardingDescriptionStyled.DescriptionContent>
  );
};

export default OnBoardingDescription;
