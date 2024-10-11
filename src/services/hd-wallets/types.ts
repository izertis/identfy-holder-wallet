import { derivationPathFormats } from './constants'

type randomType = 'random'

export type settingType = {
	m?: undefined
	Z?: string
	R?: string | randomType
	SSSSS?: [string, string, string, string, string] | randomType
	W?: string | randomType
	M?: string
	T?: string
	N?: string
	B?: randomType
	BB?: [string, string] | randomType
}
export type validKeysType = keyof settingType

export type derivationPathFormat =
	| derivationPathFormats.MAIN_IDENTITY
	| derivationPathFormats.NETWORK_DID
	| derivationPathFormats.INTERACTING_DID
