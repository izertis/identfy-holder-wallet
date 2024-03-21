import es from "./es"

const keys = Object.keys(es)
const SecurityPhraseI18nKeys: Record<keyof typeof es, string> = keys.reduce(
  (accum: any, key) => ({ ...accum, [key]: key }),
  {}
)

export default SecurityPhraseI18nKeys
