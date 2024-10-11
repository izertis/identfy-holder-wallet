import { settingType } from './types'

const IDENTFY_Z_KEY = '1037171'

export enum derivationPathFormats {
	MAIN_IDENTITY = 'mZRSSSSSW',
	NETWORK_DID = 'mMTN',
	INTERACTING_DID = 'mBB',
}

export const derivationPathSeetingsDefault: settingType = {
	Z: IDENTFY_Z_KEY,
	R: 'random',
	SSSSS: 'random',
	W: 'random',
	M: '131071',
	T: '0407',
	N: '100111001',
	B: 'random',
	BB: 'random',
}
