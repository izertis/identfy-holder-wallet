type ConfigParamsURL = {
	startParamToken?: string
	splitParamToken?: string
}

const getParamsUrl = (url: string, config?: ConfigParamsURL) => {
	const queryString = url
		.split(config?.startParamToken ?? '?')
		.filter((_, index) => index !== 0)
		.join(config?.startParamToken ?? '?')

	const queryParams: any = {}
	queryString.split(config?.splitParamToken ?? '&').forEach((query) => {
		const [key, value] = query.split('=')
		queryParams[key] = value
	})
	return queryParams
}

const convertParamsToObject = (params: any) => {
	const result = {}
	Object.entries(params).forEach(([key, value]) => {
		const parts = key.split('[').map((obj) => obj.replace(']', ''))
		parts.reduce((obj: any, part, index) => {
			const nextPart = parts[index + 1]
			const isNextPartInt = !isNaN(parseInt(nextPart))

			obj[part] = obj[part] ?? (isNextPartInt ? [] : {})

			if (!isNaN(parseInt(part))) {
				const indexPart = parseInt(part)
				if (parts.length - 1 === index) obj[indexPart] = value
				return obj[indexPart]
			} else {
				if (parts.length - 1 === index) obj[part] = value
				return obj[part]
			}
		}, result)
	})
	return result
}

export const convertUriToObject = (uri: string, startParamToken?: ConfigParamsURL | undefined) => {
	const decodedUri = decodeURIComponent(uri)
	const queryParams = getParamsUrl(decodedUri, startParamToken)
	const object = convertParamsToObject(queryParams)
	return object
}

export const extractCredentialOfferUri = (data: string) => {
	const uri = decodeURIComponent(data)
	const credentialOfferUri = uri.match(/https:\/\/[^\s]+/)![0]
	return credentialOfferUri
}

export const processAuthorizationResponse = (url: string): { code: string; state: string } => {
	const params = {
		code: '',
		state: '',
	}

	const queryString = url.split(/[?&]/).slice(1)
	queryString.forEach((param) => {
		const [key, value] = param.split('=')
		if (key === 'code') {
			params.code = value || ''
		} else if (key === 'state') {
			params.state = value || ''
		}
	})

	return params
}
