import { settingType } from "./types"

const IDENTFY_Z_KEY = '1037171'

export enum derivationPathFormats {
  MAIN_IDENTITY = "mZRSSSSSW",
  NETWORK_DID = "mMTN",
  INTERACTING_DID = "mMTNB"
}

export const derivationPathSeetingsDefault: settingType = {
  Z: IDENTFY_Z_KEY,
  R: "random",
  SSSSS: "random",
  W: "random",
  B: "random"
}

export const KEYCHILDREN = {
  // When adding a derivation path for keychildren, we need to have a input from the other party so we can get the identifier for that party (e.g. CashBank, MadridUniversity, etc), and automate it so every time we interact with the other party we get the identifier for that party.
}



