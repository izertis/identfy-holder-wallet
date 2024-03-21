import i18next from "../../../i18n.config"
import { SCREEN } from "../../constants/screens"
import { navigationScreensConfigType } from "../../types/navigation"
import QrReader from "./"
import es from "./i18n/es"

const ScreenName = SCREEN.QrReader

i18next.addResourceBundle("es", ScreenName, es)

const QrReaderConfig: navigationScreensConfigType = {
  name: ScreenName,
  component: QrReader,
  options: {
    headerShown: false,
  },
}

export default QrReaderConfig
