import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react'
import DefaultEmptyState from './components/DefaultEmptyState'
import i18next from 'i18next'
import localeES from './i18n/es'
import { bundleName } from './constants'
import DefaultError from './components/DefaultError'
import { View } from '../../Themed'
import { ViewStyle } from 'react-native'
import Loading from '../../Loading'

interface Props {
  initialFunction: () => any
  renderData: (data: any) => JSX.Element
  emptyStateCondition?: (data: any) => boolean
  renderEmptyState?: JSX.Element
  renderError?: (error: any) => JSX.Element
  errorMessage?: () => JSX.Element
  containerStyle?: ViewStyle
}
const StateWrapper = (props: Props, ref: any) => {
  i18next.addResourceBundle('es', bundleName, localeES)
  type Status = 'loading' | 'empty-state' | 'completed' | 'error'
  const [state, setState] = useState<{ status: Status; data?: any }>({
    status: 'loading',
    data: '',
  })

  useImperativeHandle(ref, () => ({
    reload() {
      setState({ status: 'loading' })
    },
  }))

  useEffect(() => {
    ; (async () => {
      if (state.status === 'loading') {
        try {
          const data = await props.initialFunction()
          if (props.emptyStateCondition?.(data)) {
            setState({
              status: 'empty-state',
            })
          } else {
            setState({
              status: 'completed',
              data,
            })
          }
        } catch (error) {
          const errorMessage = (error as any).message
          setState({
            status: 'error',
            data: errorMessage,
          })
        }
      }
    })()
  }, [state.status])
  return (
    <View>
      {state.status === 'loading' && <Loading height='100%' />}
      {state.status === 'completed' && props.renderData(state.data)}
      {state.status === 'error' &&
        (props.renderError ? props.renderError(state.data) : <DefaultError />)}
      {state.status === 'empty-state' &&
        (props.renderEmptyState ?? <DefaultEmptyState />)}
    </View>
  )
}

export default forwardRef(StateWrapper)
