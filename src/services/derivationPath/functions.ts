// Import an external constant from the "Quantities" module.
import QUANTITIES from "../../constants/Quantities"

// Function to concatenate consecutive letters in a string.
export const concatenateConsecutiveLetters = (format: string) => {
  // Use the "match()" method to find all consecutive letters in the string.
  // The regular expression matches any consecutive letters, regardless of case.
  // If no matches are found, return an empty array.
  return format.match(/([a-zA-Z])\1*/g) || []
}

// Function to generate a random integer between 0 and a maximum value.
export const getRandomIntDerivation = () => {
  // Multiply a random floating-point number between 0 and 1 by the maximum integer value.
  // Use "Math.floor()" to round down to the nearest integer.
  return Math.floor(Math.random() * QUANTITIES.INT_MAX_VALUE)
}

// Function to convert a string to a path value.
export const generateRandomPathValue = (key: string) => {
  // Use "map()" to apply the "getRandomIntDerivation()" function to each character,
  // and return an array of random integers.
  // Use "join()" to concatenate the integers into a new string separated by forward slashes.
  return key.split("").map(getRandomIntDerivation).join("/")
}

// Function to convert a number or array of numbers to a path value.
export const numberToPathValue = (key: string | string[]) => {
  // Use the "toArray()" function to ensure that the input is always an array.
  // Use "map()" to convert each number to a string using "toString()".
  // Use "join()" to concatenate the strings into a new string separated by forward slashes.
  return toArray(key).map((num: string) => num.toString()).join("/")
}

// Function to convert a value or array to an array (if it isn't already).
const toArray = (key: any | any[]): any[] => {
  // Use "flat()" to ensure that the returned value is always a one-dimensional array.
  return [key].flat(1)
}
