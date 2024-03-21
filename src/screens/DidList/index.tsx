import React, { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { RootStackScreenProps } from "../../../types"
import { SCREEN } from "../../constants/screens"
import { getDidList } from "../../utils/keychain"
import DidCard from "./components/DidCard"
import PressToCopy from "../../components/PressToCopy"
import DerivationPathStyled from "../DerivationPath/styles"
import DidListI18nKeys from "./i18n/keys"
import DidListStyled from "./styles"

const DidList = ({ navigation }: RootStackScreenProps<"DidList">) => {
  const { t } = useTranslation(SCREEN.DidList)
  const [didList, setDidList] = useState<{ network: string, entity: string, did: string }[]>([])

  useEffect(() => {
    ; (async () => {
      const didList: any = await getDidList()
      setDidList(didList)
    })()
  }, [])

  const hasDIDs = didList.some(({ did }) => !!did)

  return (
    <DidListStyled.MainContainer>
      {hasDIDs ? (
        <>
          {didList.filter(did => !!did.did).map(({ did, network, entity }, index) => (
            <PressToCopy value={did} key={index}>
              <DidCard key={`didCard-${index}`} did={did} network={network} entity={entity} />
            </PressToCopy>
          ))}
          <DidListStyled.TextContainer>
            <DerivationPathStyled.CopyText>
              {t(DidListI18nKeys.PRESS_TO_COPY)}
            </DerivationPathStyled.CopyText>
          </DidListStyled.TextContainer>
        </>
      ) : (
        <DidListStyled.TextContainer>
          <DerivationPathStyled.CopyText>
            {t(DidListI18nKeys.NO_DID_CREATED)}
          </DerivationPathStyled.CopyText>
        </DidListStyled.TextContainer>
      )}
      {didList.filter((elm) => elm.did !== null).length !== 3 ? (
        <DidListStyled.ContainerBottom>
          <DidListStyled.Button
            onPress={() => {
              navigation.navigate('NetworkAuth')
            }}
          >
            {t(DidListI18nKeys.ADD_NEW_DID)}
          </DidListStyled.Button>

        </DidListStyled.ContainerBottom>
      ) : null}
    </DidListStyled.MainContainer>
  )
}

export default DidList
