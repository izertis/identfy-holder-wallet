/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import { MaterialTopTabScreenProps } from '@react-navigation/material-top-tabs'
import { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'

declare global {
	namespace ReactNavigation {
		interface RootParamList extends RootStackParamList { }
	}
}

export type RootStackParamList = {
	SplashScreen: undefined
	OnBoarding: undefined
	Login: undefined
	Register: undefined
	SecurityPhrase: { mneumonic: string; derivationPath: string } | undefined
	SecurityPhraseConfirm: { mneumonic: string; derivationPath: string } | undefined
	DerivationPath: { derivationPath: string } | undefined
	NetworkAuth: undefined
	Root: NavigatorScreenParams<RootTabParamList> | undefined
	Modal: undefined
	QrReader: { issuer?: string }
	DidList: undefined
}

export type RootStackScreenProps<Screen extends keyof RootStackParamList> = NativeStackScreenProps<
	RootStackParamList,
	Screen
>

export type RootTabParamList = {
	Credentials: undefined
	Presentations: undefined
	Historical: undefined
}

export type RootTabScreenProps<Screen extends keyof RootTabParamList> = CompositeScreenProps<
	MaterialTopTabScreenProps<RootTabParamList, Screen>,
	NativeStackScreenProps<RootStackParamList>
>
