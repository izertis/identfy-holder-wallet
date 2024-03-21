import { useState, useEffect, useContext } from 'react'
import { StatusBar } from 'react-native'
import QrCustomMarker from './components/QrCustomMarker'
import { useTranslation } from 'react-i18next'
import { SCREEN } from '../../constants/screens'
import qrReaderI18nKeys from './i18n/keys'
import { NavigationInjectedProps } from 'react-navigation'
import QrReaderStyled from './styles'
import { BarCodeScanner } from 'expo-barcode-scanner'
import { useEbsi } from '../../services/Ebsi'
import { ActivityIndicator } from 'react-native-paper'
import { ColorKeys, getThemeColor } from '../../constants/Colors'
import { useMatchingID } from '../../services/Lacchain/didMatch'
import { MessageContext } from '../../context/UserMessage.context'
import { useNavigation } from '@react-navigation/native'

interface Props extends NavigationInjectedProps {
  issuer?: string
}

const QrReader = (props: Props) => {
  const { handleEbsiQR } = useEbsi()
  const { handleMatchingID } = useMatchingID()
  const { t } = useTranslation(SCREEN.QrReader)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [isReading, setIsReading] = useState<boolean>(false)
  const [scanned, setScanned] = useState<boolean>(false)
  const { showMessage } = useContext(MessageContext)
  const navigation = useNavigation()

  useEffect(() => {
    initializeQrReader()
  }, [])

  const initializeQrReader = async () => {
    await checkCameraPermission()
    setIsLoading(false)
  }

  const checkCameraPermission = async () => {
    const { status } = await BarCodeScanner.getPermissionsAsync()
    setHasPermission(status === 'granted')
    if (status === 'undetermined') await requestCameraPermission()
  }

  const requestCameraPermission = async () => {
    const { status } = await BarCodeScanner.requestPermissionsAsync()
    setHasPermission(status === 'granted')
  }

  const handleBarCodeScanned = async ({ data }: any) => {
    // Verify here if QR code corresponds to ebsi, lacchain or alastria
    if (!scanned) {
      setScanned(true)
      setIsReading(true)
      setIsLoading(true)
      try {

        if (data.startsWith("openid-credential-offer")) {

          await handleEbsiQR(data)

        } else if (data.startsWith("matching-id")) {

          await handleMatchingID(data)
          showMessage({ content: t?.(qrReaderI18nKeys.SUCCESS_ASOCIATE_IDENTIFIER), type: "success" })

        } else {
          showMessage({ content: t?.(qrReaderI18nKeys.ERROR), type: "error" })
        }
      } catch (error) {
        // @ts-ignore
        showMessage({ content: error.message, type: "error" })

      } finally {
        setIsReading(false)
        setIsLoading(false)
        setTimeout(() => {
          if (navigation.canGoBack()) navigation.goBack()
        }, 800)
      }
    }
  }

  if (isLoading) {
    return (
      <QrReaderStyled.Container>
        <ActivityIndicator
          style={{ position: "absolute", alignSelf: "center", top: "45%", zIndex: 100000 }}
          color={getThemeColor(ColorKeys.primary)}
          size={70}
        />
      </QrReaderStyled.Container>
    )
  } else if (hasPermission) {
    return (
      <QrReaderStyled.Container>
        <StatusBar barStyle="light-content" />
        <QrReaderStyled.QrScanner
          onBarCodeScanned={!isReading ? handleBarCodeScanned : () => { }}
        />
        <QrCustomMarker
          isReading={isReading}
          subtitle={t(qrReaderI18nKeys.SCAN_QR, {
            issuer: props.issuer || t(qrReaderI18nKeys.ISSUER),
          })}
          navigation={props.navigation}
        />
      </QrReaderStyled.Container>
    )
  } else {
    return (
      <QrReaderStyled.Container style={{ justifyContent: 'center' }}>
        <StatusBar backgroundColor={'black'} barStyle="light-content" />
        <QrReaderStyled.RequestingText>
          {t(qrReaderI18nKeys.PERMISSIONS_MESSAGE)}
        </QrReaderStyled.RequestingText>
      </QrReaderStyled.Container>
    )
  }
}

export default QrReader
