import RequestPresentationModalStyled from "../styles"
import { Checkbox } from "react-native-paper"
import { CredentialData } from "../../../services/open-id/types"
import { getThemeColor, ColorKeys } from "../../../constants/Colors"
import { getTimeFormat } from "../../../utils/dates"
import { filterCredentialType } from "../../../services/open-id/utils"
import { useTranslation } from "react-i18next"
import requestPresentationModalI18nKeys from "../i18n/keys"
import { Text } from 'react-native'

interface Props {
  credential: CredentialData
  onPressCheckbox: () => void
  isChecked: boolean
}
const ItemCredential = ({ credential, onPressCheckbox, isChecked }: Props) => {

  const bundleName = "RequestPresentationModal"
  const { t } = useTranslation(bundleName)

  const { validFrom, issuer, expirationDate } = credential
  const { type } = credential?.credential?.payload.vc
  const formattedExpDate = expirationDate ? getTimeFormat(expirationDate) : t(requestPresentationModalI18nKeys.NEVER)

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
          {t(requestPresentationModalI18nKeys.VALID_FROM)}: {getTimeFormat(validFrom)}
        </RequestPresentationModalStyled.ItemTextDate>
        <Text numberOfLines={1} ellipsizeMode="tail">
          <RequestPresentationModalStyled.ItemTextCredentialName>
            {t(requestPresentationModalI18nKeys.ORGANIZATION)}: {issuer}
          </RequestPresentationModalStyled.ItemTextCredentialName>
        </Text>
        <RequestPresentationModalStyled.ItemTextCredentialName>
          {t(requestPresentationModalI18nKeys.TYPE)}: {filterCredentialType(type)}
        </RequestPresentationModalStyled.ItemTextCredentialName>
        <RequestPresentationModalStyled.ItemTextDate>
          {t(requestPresentationModalI18nKeys.EXPIRATION_DATE)}: {formattedExpDate}
        </RequestPresentationModalStyled.ItemTextDate>
      </RequestPresentationModalStyled.Container>
    </RequestPresentationModalStyled.ItemContainer>
  )
}

export default ItemCredential
