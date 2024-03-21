import { useFocusEffect } from '@react-navigation/native'
import { useCallback, useState } from 'react'

export const useFocusCallback = (callback: () => any) => {
  const [data, setData] = useState()
  const onHandleFocus = async () => {
    try {
      const data = await callback()
      setData(data)
    } catch (error) {}
  }
  useFocusEffect(
    useCallback(() => {
      onHandleFocus()
    }, [])
  )
  return data
}
