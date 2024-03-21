import { View } from "react-native"
import {
  BackButton,
  BottomSpace,
  LateralSpace,
  Marker,
  MarkerContainer,
  SubTitle,
  TextContainer,
  Title,
  ViewContainer,
} from "./styles"
import { useTranslation } from "react-i18next"
import { SCREEN } from "../../../../constants/screens"
import qrReaderI18nKeys from "../../i18n/keys"
import { NavigationInjectedProps } from "react-navigation"
import { ActivityIndicator } from "react-native-paper"
import { ColorKeys, getThemeColor } from "../../../../constants/Colors"

interface QrCustomMarkerProps {
  subtitle: string
  navigation: NavigationInjectedProps["navigation"]
  isReading: boolean
}

const QrCustomMarker = (props: QrCustomMarkerProps) => {
  const { t } = useTranslation(SCREEN.QrReader)

  return (
    <ViewContainer>
      <LateralSpace />
      <MarkerContainer>
        <TextContainer>
          <BackButton onPress={() => props.navigation.goBack()}>
            {t(qrReaderI18nKeys.BACKWARD)}
          </BackButton>
          <View>
            <Title>{t(qrReaderI18nKeys.TITLE)}</Title>
          </View>
          <View>
            <SubTitle>{props.subtitle}</SubTitle>
          </View>
        </TextContainer>
        <Marker>
          {props.isReading && (
            <ActivityIndicator
              style={{ position: "absolute", alignSelf: "center", top: "39%" }}
              color={getThemeColor(ColorKeys.primary)}
              size={70}
            />
          )}
        </Marker>
        <BottomSpace />
      </MarkerContainer>
      <LateralSpace />
    </ViewContainer>
  )
}

export default QrCustomMarker
