import { useEffect } from 'react'
import useDeepLinking from '../../hooks/useDeepLinking'
import { useEbsi } from '../../services/Ebsi'
import { storeCallbackFunction } from '../../utils/storeCallback'

export const DeepLinkingWrapper =
  (Component: (props: any) => JSX.Element) => (props: any) => {
    const callbackId = 'SameDeviceCredentialCallback'
    const { handleEbsiQR } = useEbsi()
    const onHandleCallback = async (encodedOpenidUri: string) => {
      await handleEbsiQR(encodedOpenidUri)
    }
    useEffect(() => {
      storeCallbackFunction(callbackId, onHandleCallback)
    }, [])

    const onHandleUrl = async (encodedOpenidUri: string) => {
      const callback = {
        id: callbackId,
        params: [encodedOpenidUri]
      }
      // if Lockscreen is not active then must indicate set here: navigation.replace('Login) so deep link works

      props.navigation.setParams({
        callback,
      })

    }
    useDeepLinking({ onHandleUrl, currentScreen: props.route.name })
    return <Component {...props} />
  }
