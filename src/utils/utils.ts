export const sleep = (milliseconds: number): Promise<void> => {
	return new Promise((resolve) => {
		setTimeout(resolve, milliseconds)
	})
}

export const validateObject = (a: any, b: any) => {
	const isBEqualA = Object.entries(b).every(([key, value]) => a[key] === value)
	return isBEqualA
}
