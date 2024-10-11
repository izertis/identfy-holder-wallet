import { useTranslation } from 'react-i18next'
import { DescriptionText } from '../atomic_components/Text/variants'
import { ColorKeys, getThemeColor } from '../../constants/Colors'
import { useContext, useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import Loading from '../Loading'
import { getDidList, resolveKeychainDeferredCredentials } from '../../utils/keychain'
import { MessageContext } from '../../context/UserMessage.context'
import { TouchableOpacity } from 'react-native'
import ButtonMailboxI18nKeys from './i18n/keys'
import i18next from 'i18next'
import localeES from './i18n/es'
import { checkMailbox } from '../../services/lacchain/checkMailbox'
import { ButtonContainer, LoadingContainer } from './styles'

interface Props {
  onPress?: () => void
}

const ButtonMailbox = (props: Props) => {
  const bundle = "ButtonMailbox"
  i18next.addResourceBundle("es", bundle, localeES)
  const { t } = useTranslation(bundle)

  const [isLoadingBtn, setIsLoadingBtn] = useState(false)
  const [isLacchainDid, setIsLacchainDid] = useState<boolean | undefined>(undefined)
  const navigation = useNavigation()
  const { showMessage } = useContext(MessageContext)

  useEffect(() => {
    const fetchLacchainDid = async () => {
      const lacchainDid = await checkLacchainDid()
      setIsLacchainDid(lacchainDid)
    }
    fetchLacchainDid()
  }, [])

  const checkLacchainDid = async () => {
    const didList: any[] = await getDidList()
    return didList.some(did => did?.did?.startsWith('did:lac'))
  }

  const handleMailboxPress = async () => {
    setIsLoadingBtn(true)

    try {
      await resolveKeychainDeferredCredentials()
      if (isLacchainDid) await checkMailbox()

    } catch (error) {
      console.error("Error checking mailbox/getting deferred Credential:", error)
    } finally {
      const content = t(ButtonMailboxI18nKeys.BUTTON_MAILBOX_SUCCESS)
      showMessage({ content, type: 'success' })
      navigation.navigate('Root', { screen: 'Credentials' })
      setIsLoadingBtn(false)
    }
  }

  return (
    <ButtonContainer >
      {
        !isLoadingBtn ? (
          <TouchableOpacity onPress={handleMailboxPress}>
            <DescriptionText style={{ color: getThemeColor(ColorKeys.primary) }}>
              {t(ButtonMailboxI18nKeys.BUTTON_MAILBOX)}
            </DescriptionText>
          </TouchableOpacity>

        ) : (
          <LoadingContainer>
            <Loading />
          </LoadingContainer>
        )
      }
    </ButtonContainer>
  )
}

export default ButtonMailbox