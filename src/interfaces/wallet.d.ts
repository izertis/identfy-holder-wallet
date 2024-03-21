import { derivationPathFormat } from "../services/derivationPath/types"

export interface WalletSecurityInformation {
  mnemonicPhrase: string
  derivationPath: string
}

export interface derivationPathItems {
  id: string
  derivationPath: string
  children?: any
}