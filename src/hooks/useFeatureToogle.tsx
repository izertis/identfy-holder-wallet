import { DEFAULT_FEATURE } from '../constants/features'
import axios from 'axios'
import { useEffect, useState } from 'react'

class FeatureUtils {
  private static isUsedInstance: boolean = false
  private static featureList = DEFAULT_FEATURE
  private static ws: WebSocket | null = null
  public constructor() { }
  public useFeature = (): any => {
    const [feature, setFeature] = useState(FeatureUtils.featureList)

    const formatResponseFeatureData = (
      responseFeatureData: { name: string; active: boolean }[]
    ) => {
      const formatedResponseData: any = {}
      responseFeatureData.forEach(({ name, active }) => {
        formatedResponseData[name] = active
      })
      return formatedResponseData
    }

    const updateFeatures = async () => {
      try {
        const response = await axios.get(
          `${process.env.WEB_SOCKET_URL}/features/feature-toggle/get_all_toggles/`
        )
        const formatedfeatureList = formatResponseFeatureData(response.data)
        FeatureUtils.featureList = formatedfeatureList

        FeatureUtils.ws = new WebSocket(
          `${process.env.WEB_SOCKET_URL}/ws/features/updates`
        )
        FeatureUtils.ws.onmessage = function (event) {
          const data = JSON.parse(event.data)
          const formatedUpdatefeatureList = formatResponseFeatureData([
            data.message,
          ])
          const newfeatureList = {
            ...FeatureUtils.featureList,
            ...formatedUpdatefeatureList,
          }
          FeatureUtils.featureList = newfeatureList
          setFeature(newfeatureList)
        }
        return FeatureUtils.featureList
      } catch (error) {
        // handle error here whe implemented 
      }
    }

    useEffect(() => {
      if (!FeatureUtils.isUsedInstance) {
        updateFeatures().then(() => {
          FeatureUtils.isUsedInstance = true
        })
      }
    }, [])
    return feature
  }
}
export default FeatureUtils
