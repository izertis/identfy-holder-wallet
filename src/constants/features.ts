export enum AUTH_CHAINS {
  ALASTRIA_AUTH = 'alastria_auth',
  LACCHAIN_AUTH = 'LacChain_auth',
  EBSI_AUTH = 'Ebsi_auth'
}

export const TOGGLE_NAMES = {

    ORGANIZATIONS_MANAGER: 'organizations manager',
    ORGANIZATIONS_ISSUER_MANAGER: 'organizations issuer manager',
    ORGANIZATIONS_INTERMEDIARY_MANAGER: 'organizations intermediary manager',
    ...AUTH_CHAINS,
}

export const DEFAULT_FEATURE = {  
  [TOGGLE_NAMES.ORGANIZATIONS_MANAGER]: true,
  [TOGGLE_NAMES.ORGANIZATIONS_ISSUER_MANAGER]: true,
  [TOGGLE_NAMES.ORGANIZATIONS_INTERMEDIARY_MANAGER]: true,
  [TOGGLE_NAMES.ALASTRIA_AUTH]: true,
  [TOGGLE_NAMES.LACCHAIN_AUTH]: false,
  [TOGGLE_NAMES.EBSI_AUTH]: false
}
