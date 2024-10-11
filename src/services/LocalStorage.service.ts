import AsyncStorage from '@react-native-async-storage/async-storage'

export const STORAGE_KEYS = {
	PIN: 'pin',
	PRIVATE_KEY: 'privateKey',
	IS_WALLET_CREATED: 'isWalletCreated',
	IS_DID_CREATED: 'isDIDCreated',
	APP_WAS_INSTALLED: 'wasAppInstalled',
}

export default class LocalStorageService {
	public static StringToBool(value: string): boolean {
		return value.toLowerCase() === 'true'
	}

	public static async storeData(key: string, value: string) {
		try {
			await AsyncStorage.setItem(key, value)
		} catch (err) {
			throw new Error('Error storing data in LocalStorage')
		}
	}

	public static async storeBool(key: string, value: boolean) {
		try {
			await AsyncStorage.setItem(key, value.toString())
		} catch (err) {
			throw new Error('Error storing data in LocalStorage')
		}
	}

	public static async getData(key: string): Promise<string> {
		try {
			const value = await AsyncStorage.getItem(key)
			return value || ''
		} catch (err) {
			throw new Error('Error getting data in LocalStorage')
		}
	}

	public static async getBool(key: string): Promise<boolean> {
		try {
			const keyString = await AsyncStorage.getItem(key)
			return keyString ? this.StringToBool(keyString) : false
		} catch (err) {
			throw new Error('Error getting data in LocalStorage')
		}
	}

	public static async removeItem(key: string): Promise<void> {
		try {
			await AsyncStorage.removeItem(key)
		} catch (err) {
			throw new Error('Error clearing data in LocalStorage')
		}
	}

	public static async clearAll() {
		try {
			await AsyncStorage.clear()
		} catch (err) {
			throw new Error('Error clearing all data in LocalStorage')
		}
	}
}
