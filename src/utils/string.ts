export function capitalizeString(s: string) {
  return s[0].toUpperCase() + s.slice(1)
}

export function hexFromUtf8(s: string) {
  return `${Buffer.from(s, "utf-8").toString("hex")}`
}

export function bufferFromUtf8(s: string) {
  return Buffer.from(s, "utf-8")
}

