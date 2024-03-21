import { Appearance, ColorSchemeName } from 'react-native'
import { DefaultTheme } from '@react-navigation/native'

const tintColorLight = '#363d58'
const tintColorDark = '#fff'
const tintColorDarkOpaque = '#fff8'

export const navTheme = {
	...DefaultTheme,
	colors: {
		...DefaultTheme.colors,
		background: '#ffffff',
	},
}

const Color = {
	light: {
		primary: '#eb5b5b',
		secondary: '#363d58',
		error: '#eb5b5b',
		success: '#4a934a',
		text: '#000',
		invertedText: '#fff',
		background: '#fff',
		headerBackground: '#363d58',
		scrollBackground: '#e7e7e5',
		titleMenu: '#fff',
		tint: tintColorLight,
		tabIconDefault: '#555',
		tabIconSelected: tintColorLight,
		loading: tintColorDarkOpaque,
		disabled: '#ccc',
		placeholder: '#aaa',
		inactiveDot: '#555',
	},
	dark: {
		primary: '#eb5b5b',
		secondary: '#eb5b5b',
		error: '#eb5b5b',
		success: '#4a934a',
		text: '#fff',
		invertedText: '#fff',
		background: '#000',
		headerBackground: '#363d58',
		scrollBackground: '#555',
		titleMenu: '#363d58',
		tint: tintColorDark,
		tabIconDefault: '#555',
		tabIconSelected: tintColorDark,
		loading: tintColorDarkOpaque,
		disabled: '#ccc',
		placeholder: '#aaa',
		inactiveDot: '#555',
	},
	warning: '#778727',
}

const keys = Object.keys(Color.light)
export const ColorKeys: Record<keyof typeof Color.light, keyof typeof Color.light> = keys.reduce(
	(accum: any, key) => ({ ...accum, [key]: key }),
	{}
)

export const getThemeColor = (name: keyof typeof Color.light, specificTheme?: 'light' | 'dark'): string => {
	const theme: ColorSchemeName =
		specificTheme === 'dark' || specificTheme === 'light' ? specificTheme : Appearance.getColorScheme()
	const themeColors = Color[theme || 'light'] as typeof Color.light
	return themeColors[name]
}

export const getColorByBackground = (name: keyof typeof Color.light, background: string): string => {
	const theme: 'light' | 'dark' = getBackgroundTheme(background)
	const themeColors = Color[theme || 'light'] as typeof Color.light
	return themeColors[name]
}

export const isDark = (color: string) => {
	return getBackgroundTheme(color) === 'dark'
}

export function getBackgroundTheme(bgColor: string | undefined): 'light' | 'dark' {
	if (bgColor == undefined) return 'light'
	try {
		const isSimpleBackground = bgColor.length === 4
		const numberLettersPerColor = isSimpleBackground ? 1 : 2
		const rStart = 1
		const gStart = rStart + numberLettersPerColor
		const bStart = gStart + numberLettersPerColor
		// Extract the red, green, and blue values from the background color
		const r = parseInt(bgColor.substring(rStart, rStart + numberLettersPerColor), 16)
		const g = parseInt(bgColor.substring(gStart, gStart + numberLettersPerColor), 16)
		const b = parseInt(bgColor.substring(bStart, bStart + numberLettersPerColor), 16)

		// Calculate the brightness of the color
		const brightness = (r * 299 + g * 587 + b * 114) / 1000

		// If the brightness is greater than 128, it's a light theme. Otherwise, it's dark.
		return brightness > 128 ? 'light' : 'dark'
	} catch (error) {
		return 'light'
	}
}

export default Color
