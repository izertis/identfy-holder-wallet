import DidCardStyled from "./styles"
import { useTranslation } from "react-i18next"
import { SCREEN } from "../../../../constants/screens"
import { capitalizeString } from "../../../../utils/string"

interface Props {
  did: string
  network: string
  entity: string
}

const DidCard = (props: Props) => {
  const { t } = useTranslation(SCREEN.DidList)
  const directionId = props.did
  return (
    <DidCardStyled.Container>
      <DidCardStyled.ViewRow>
        <DidCardStyled.Icon
          source={require("./assets/userIcon.png")}
        />
        <DidCardStyled.TextContainer>
          <DidCardStyled.Title bold>{capitalizeString(props.entity)} ID</DidCardStyled.Title>
          <DidCardStyled.DescriptionText>
            {directionId}
          </DidCardStyled.DescriptionText>
        </DidCardStyled.TextContainer>
      </DidCardStyled.ViewRow>
    </DidCardStyled.Container>
  )
}

export default DidCard
