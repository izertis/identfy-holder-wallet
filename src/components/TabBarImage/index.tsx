import { Image, ImageSourcePropType } from "react-native"


export default function TabBarImage({ source }: { source: ImageSourcePropType }): JSX.Element {

  return (
    <Image style={{ marginVertical: -1, width: 25, height: 25 }} source={source} />
  )

}