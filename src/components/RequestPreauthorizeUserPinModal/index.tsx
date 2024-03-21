import { useState } from 'react'
import RequestPreauthorizeUserPinModalStyled from './styles'
import { ModalProps } from '../../context/Modal.context'
import Header from '../Header'
import i18next from 'i18next'
import localeES from './i18n/es'
import { useTranslation } from 'react-i18next'
import RequestPreauthorizeUserPinModalI18nKeys from './i18n/keys'
import { View } from '../Themed'
import InputStyled from '../atomic_components/InputStyled'

const RequestPreauthorizeUserPinModal = (props: ModalProps) => {
  const [data, setData] = useState('')
  const bundleName = 'RequestPreauthorizeUserPinModal'
  i18next.addResourceBundle('es', bundleName, localeES)
  const { t } = useTranslation(bundleName)
  const handleAccept = (propsModal: any) => {
    props.onAccept?.(propsModal)
  }

  const dropdownItems: any[] = []

  return (
    <RequestPreauthorizeUserPinModalStyled.ModalContainer>
      <View>
        <Header
          title={t(RequestPreauthorizeUserPinModalI18nKeys.TITLE)}
          onCancel={() => props.onCancel?.()}
        />
        <RequestPreauthorizeUserPinModalStyled.ModalContent>
          <RequestPreauthorizeUserPinModalStyled.ModalText>
            {t(RequestPreauthorizeUserPinModalI18nKeys.DESCRIPTION)}
          </RequestPreauthorizeUserPinModalStyled.ModalText>
          <RequestPreauthorizeUserPinModalStyled.DropDownPickerContainer>
            <InputStyled
              label="PIN"
              value={data}
              keyboardType="decimal-pad"
              secureTextEntry
              onChangeText={(value: string) =>
                setData(value.replace(/[^0-9]/g, ''))
              }
              returnKeyType={'done'}
            />
          </RequestPreauthorizeUserPinModalStyled.DropDownPickerContainer>
        </RequestPreauthorizeUserPinModalStyled.ModalContent>
      </View>
      <RequestPreauthorizeUserPinModalStyled.ButtonContainer>
        <RequestPreauthorizeUserPinModalStyled.Button
          onPress={() => handleAccept(data)}
        >
          <RequestPreauthorizeUserPinModalStyled.ButtonText>
            {t(RequestPreauthorizeUserPinModalI18nKeys.REQUEST)}
          </RequestPreauthorizeUserPinModalStyled.ButtonText>
        </RequestPreauthorizeUserPinModalStyled.Button>
      </RequestPreauthorizeUserPinModalStyled.ButtonContainer>
    </RequestPreauthorizeUserPinModalStyled.ModalContainer>
  )
}

export default RequestPreauthorizeUserPinModal
