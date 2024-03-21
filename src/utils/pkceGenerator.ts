import { hashSha256 } from './crypto'
import { base64url } from "jose"

// Generate a random string with the specified length
function generateRandomString(length: number): string {
  let result = ''
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~'
  const charactersLength = characters.length
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

// Calculate the base64 URL-safe encoded SHA-256 hash of the input string
async function sha256Base64UrlEncode(input: string): Promise<string> {
  const digest = await hashSha256(input)
  const base64 = base64url.encode(Buffer.from(digest, "hex"))
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '')
}

// Generate the code verifier and challenge for PKCE
export const generateCodeVerifierAndChallenge = async (): Promise<{
  verifier: string
  challenge: string
}> => {
  const codeVerifier = generateRandomString(128)
  const codeChallenge = await sha256Base64UrlEncode(codeVerifier)
  return { verifier: codeVerifier, challenge: codeChallenge }
}


export const verifyPKCEChallenge = async (
  codeChallenge: string,
  codeVerifier: string):
  Promise<boolean> => {
  const hashedVerifier = await sha256Base64UrlEncode(codeVerifier)
  return hashedVerifier === codeChallenge
}
