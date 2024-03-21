import es from "./es";

const keys = Object.keys(es);
const qrReaderI18nKeys: Record<keyof typeof es, any> = keys.reduce(
  (accum: any, key) => ({ ...accum, [key]:key }),
  {}
);

export default qrReaderI18nKeys;
