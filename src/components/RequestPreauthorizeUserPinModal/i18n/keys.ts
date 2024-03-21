import es from "./es";

const keys = Object.keys(es);
const requestPreauthorizeUserPinModalI18nKeys: Record<keyof typeof es, any> = keys.reduce(
  (accum: any, key) => ({ ...accum, [key]:key }),
  {}
);

export default requestPreauthorizeUserPinModalI18nKeys;
