let callbackFunctions: any = {}

export function storeCallbackFunction(id: string, callback: any) {
  callbackFunctions[id] = callback
}

export function getCallbackFunction(id: string) {
  return callbackFunctions[id]
}

export function deleteCallbackFunction(id: string) {
  delete callbackFunctions[id]
}

export function executeCallbackFunction(id: string, params: any[] = []) {
  const callback = callbackFunctions[id]
  return callback(...params)
}
