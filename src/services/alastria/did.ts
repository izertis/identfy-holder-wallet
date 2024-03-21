import {
  checkDerivationPathExist,
  saveDID,
  saveDerivationPathItem,
} from "../../utils/keychain"

import { derivationPathFormats } from "../derivationPath/constants"
import { settingType } from "../derivationPath/types"
import { addNetworkPath } from "./derivationFunctions"

export const ALASTRIA_NETWORK = {
  T: {
    id: "T" as "T",
    derivation_path_settings: { N: '100111001' },
    network_name: "redT",
  },
}
const NETWORK_NAME = "Alastria"
const IDENTFY_M_KEY = '131071'
const IDENTFY_T_KEY = "0407"

export const createDidAlastria = async (
  network: keyof typeof ALASTRIA_NETWORK = ALASTRIA_NETWORK.T.id
) => {
  const alastriaNetwork = ALASTRIA_NETWORK[network]
  const pathSettings: settingType = {
    M: IDENTFY_M_KEY,
    T: IDENTFY_T_KEY,
    ...alastriaNetwork.derivation_path_settings,
  }
  const alastriaNetworkName = `${NETWORK_NAME}${alastriaNetwork.id}`
  const derivationPathExists = await checkDerivationPathExist(
    alastriaNetworkName
  )

  if (!derivationPathExists) {
    const { wallet, derivationPath } = await addNetworkPath(
      derivationPathFormats.NETWORK_DID,
      pathSettings
    )
    const did = `did:ala:quor:${alastriaNetwork.network_name}:${wallet
      ?.getAddress()
      .toString("hex")}`

    await saveDerivationPathItem(alastriaNetworkName, derivationPath)

    saveDID(did, "alastria", alastriaNetworkName)
  }
}
