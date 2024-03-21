import es from "./es"

const keys = Object.keys(es)
const LoginI18nKeys: Record<keyof typeof es, string> = keys.reduce(
  (accum: any, key) => ({ ...accum, [key]: key }),
  {}
)

export default LoginI18nKeys
