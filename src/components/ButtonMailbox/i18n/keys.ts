import es from './es'

const keys = Object.keys(es)
const ButtonMailboxI18nKeys: Record<keyof typeof es, string> = keys.reduce(
	(accum: any, key) => ({ ...accum, [key]: key }),
	{}
)

export default ButtonMailboxI18nKeys
