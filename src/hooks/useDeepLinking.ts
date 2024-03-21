import { useEffect, useState } from "react"
import { Linking } from "react-native"

interface Props {
  onHandleUrl: (url: string) => void,
  currentScreen: string
}

const useDeepLinking = (props: Props) => {
  const [data,setData]=useState<any>()
  const useMount = (func: () => void) => useEffect(() => func(), [])
  useMount(() => {
    const getUrlAsync = async () => {
      const initialUrl = await Linking.getInitialURL();
      initialUrl && handleUrl(initialUrl);
    }
    props.currentScreen=== "Login" &&getUrlAsync()
  })

  useEffect(() => {
		const handler = (e: { url: string }) => handleUrl(e.url)
		Linking.addEventListener('url', handler)

		return () => {
			Linking.removeAllListeners('url')
		}
	}, [])

  const handleUrl = (url: string) => {
    const data =props.onHandleUrl?.(url)
    setData(data)
  }
  return data
}

export default useDeepLinking