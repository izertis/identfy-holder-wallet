import axios from 'axios'
import pako from 'pako'

export const sleep = (milliseconds: number): Promise<void> => {
	return new Promise((resolve) => {
		setTimeout(resolve, milliseconds)
	})
}

export const validateObject = (a: any, b: any) => {
	const isBEqualA = Object.entries(b).every(([key, value]) => a[key] === value)
	return isBEqualA
}

// Create axios instance to send big chunks of data to identfy backend
const axiosInstance = axios.create({
	timeout: 10000,
	maxContentLength: 50 * 1024 * 1024,
	maxBodyLength: 50 * 1024 * 1024,
})

export const logToServer = async (logMessage: string) => {
	try {
		//Replace with ngrok url - using ngrok because axios fails sending http reuests to localhost
		await axiosInstance.post('https://3b71-2a0c-5a81-4113-5401-00-c334.ngrok-free.app/log', {
			log: JSON.stringify(logMessage),
		})
		console.log('Log sent to server')
	} catch (error) {
		console.error('Error sending log:', error)
	}
}

export function getBitFromBitString(data: Buffer, index: number) {
	const byte = Math.floor(index / 8)
	const bit = index % 8
	const bitString = data[byte].toString(2).padStart(8, '0')
	return parseInt(bitString[bit])
}

export function descompressGZIP(data: Buffer): Promise<Buffer> {
	return new Promise((resolve, reject) => {
		try {
			const result = pako.inflate(data)
			resolve(Buffer.from(result))
		} catch (err) {
			reject(err)
		}
	})
}
