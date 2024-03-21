import { FeatureToggleProvider as ToggleProvider } from "react-feature-toggles"
import FeatureUtils from "../hooks/useFeatureToogle"
interface Props {
  children: JSX.Element | JSX.Element[]
}
const FeatureToggleProvider = ({ children }: Props) => {
  const FeatureUtilsInstance = new FeatureUtils()
  const toggleList = FeatureUtilsInstance.useFeature()
  return (
    <ToggleProvider featureToggleList={toggleList}>{children}</ToggleProvider>
  )
}
export default FeatureToggleProvider
