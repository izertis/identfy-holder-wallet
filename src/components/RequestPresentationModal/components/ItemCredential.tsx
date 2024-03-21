import RequestPresentationModalStyled from "../styles"
import { Checkbox } from "react-native-paper"
import { CredentialData } from "../../../types/keychain"
import { getThemeColor, ColorKeys } from "../../../constants/Colors"

interface Props {
  credential: CredentialData
  onPressCheckbox: () => void
  isChecked: boolean
}
const ItemCredential = ({ credential, onPressCheckbox, isChecked }: Props) => {
  return (
    <RequestPresentationModalStyled.ItemContainer>
      <Checkbox.Android
        color={getThemeColor(ColorKeys.primary)}
        key={credential.id}
        status={isChecked ? "checked" : "unchecked"}
        onPress={onPressCheckbox}
      />
      <RequestPresentationModalStyled.Container>
        <RequestPresentationModalStyled.ItemTextDate>
          {credential.validFrom}
        </RequestPresentationModalStyled.ItemTextDate>
        {credential.credential?.name && (
          <RequestPresentationModalStyled.ItemTextIssuer>
            {credential.credential?.name}
          </RequestPresentationModalStyled.ItemTextIssuer>
        )}
        <RequestPresentationModalStyled.ItemTextCredentialName>
          Organización: {credential.issuer}
        </RequestPresentationModalStyled.ItemTextCredentialName>
      </RequestPresentationModalStyled.Container>
    </RequestPresentationModalStyled.ItemContainer>
  )
}

export default ItemCredential
