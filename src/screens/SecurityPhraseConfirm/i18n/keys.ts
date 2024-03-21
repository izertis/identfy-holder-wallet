import es from "./es"

const keys = Object.keys(es)
const SecurityPhraseConfirmI18nKeys: Record<keyof typeof es, string> = keys.reduce(
  (accum: any, key) => ({ ...accum, [key]: key }),
  {}
)

export default SecurityPhraseConfirmI18nKeys
