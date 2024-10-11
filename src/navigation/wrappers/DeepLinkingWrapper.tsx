import { useEffect } from 'react'
import useDeepLinking from '../../hooks/useDeepLinking'
import { storeCallbackFunction } from '../../utils/storeCallback'
import { useOpenId } from '../../services/open-id'

export const DeepLinkingWrapper =
  (Component: (props: any) => JSX.Element) => (props: any) => {
    const callbackId = 'SameDeviceCredentialCallback'
    const { handleCredentialOffer } = useOpenId()
    const onHandleCallback = async (encodedOpenidUri: string) => {
      await handleCredentialOffer(encodedOpenidUri)
    }
    useEffect(() => {
      storeCallbackFunction(callbackId, onHandleCallback)
    }, [])

    const onHandleUrl = async (encodedOpenidUri: string) => {
      const callback = {
        id: callbackId,
        params: [encodedOpenidUri]
      }
      // if Lockscreen is not active then must indicate here: navigation.replace('Login) so deep link works

      props.navigation.setParams({
        callback,
      })

    }
    useDeepLinking({ onHandleUrl, currentScreen: props.route.name })
    return <Component {...props} />
  }
