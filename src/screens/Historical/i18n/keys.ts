import es from './es'

const keys = Object.keys(es)
const HistoricalI18nKeys: Record<keyof typeof es, keyof typeof es> = keys.reduce(
	(accum: any, key) => ({ ...accum, [key]: key }),
	{}
)

export default HistoricalI18nKeys
