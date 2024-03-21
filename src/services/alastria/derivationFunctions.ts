import { saveDerivationChild } from "../../utils/keychain"
import { generateDerivationPath, getWalletFromDerivation } from "../derivationPath"
import { derivationPathFormats } from "../derivationPath/constants"
import { settingType } from "../derivationPath/types"

export const addNetworkPath = async (
  derivationFormat: derivationPathFormats,
  pathSettings?: settingType
) => {
  const derivedPath = generateDerivationPath(derivationFormat, pathSettings)
  const newWallet = await getWalletFromDerivation(derivedPath)

  return { wallet: newWallet, derivationPath: derivedPath }
}

export const addDerivationChild = async (
  id: string,
  keyChild: string,
  derivationPathChild: derivationPathFormats
) => {
  const derivedPath = generateDerivationPath(derivationPathChild)
  const newWallet = await getWalletFromDerivation(derivedPath)

  await saveDerivationChild(id, keyChild, derivedPath)

  return newWallet
}