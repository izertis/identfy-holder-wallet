import { MaterialTopTabScreenProps } from '@react-navigation/material-top-tabs'
import { NativeStackNavigationOptions } from '@react-navigation/native-stack'

export type navigationScreensConfigType = {
	name: string
	component: (props: any) => JSX.Element
	options:
		| NativeStackNavigationOptions
		| MaterialTopTabScreenProps<{}>
		| ((x: any) => NativeStackNavigationOptions | MaterialTopTabScreenProps<{}>)
}
