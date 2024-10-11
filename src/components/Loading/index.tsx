import { DimensionValue, View } from 'react-native'
import { ActivityIndicator } from 'react-native-paper'
import { getThemeColor, ColorKeys } from '../../constants/Colors'

type LoadingProps = {
  size?: number | "small" | "large" | undefined,
  color?: string,
  height?: DimensionValue
}

const Loading = ({ size, color, height }: LoadingProps) => {
  return (
    <View style={{ height: height, justifyContent: 'center' }}>
      <ActivityIndicator
        animating
        color={color ?? getThemeColor(ColorKeys.primary)}
        size={size ?? 25}
      />
    </View>
  )
}

export default Loading