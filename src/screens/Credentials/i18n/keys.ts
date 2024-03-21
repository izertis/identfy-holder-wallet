import es from './es'

const keys = Object.keys(es)
const CredentialsI18nKeys: Record<keyof typeof es, keyof typeof es> = keys.reduce(
	(accum: any, key) => ({ ...accum, [key]: key }),
	{}
)

export default CredentialsI18nKeys
