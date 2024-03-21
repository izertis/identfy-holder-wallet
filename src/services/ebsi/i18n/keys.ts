import es from "./es";

const keys = Object.keys(es);
const ebsiI18nKeys: Record<keyof typeof es, any> = keys.reduce(
  (accum: any, key) => ({ ...accum, [key]:key }),
  {}
);

export default ebsiI18nKeys;
