import { useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { SCREEN } from '../../constants/screens'
import { MessageContext } from '../../context/UserMessage.context'
import LocalStorageService, { STORAGE_KEYS } from '../../services/LocalStorage.service'
import { createEncryptedWallet } from '../../services/Wallet.service'
import { testID } from './constants/testID'
import RegisterI18nKeys from './i18n/keys'
import RegisterStyles from './styles'
import { RootStackScreenProps } from '../../../types'
import TermsModal from '../../components/TermsModal'
import useModal from '../../hooks/useModal'
import { StatusBar } from 'expo-status-bar'
import { getThemeColor, ColorKeys } from '../../constants/Colors'


const Register = ({ navigation }: RootStackScreenProps<'Register'>) => {
	const { showMessage } = useContext(MessageContext)
	const { t } = useTranslation(SCREEN.Register)

	const [isPinFilled, setIsPinFilled] = useState<boolean>(true)
	const [firstPin, setFirstPin] = useState('')
	const [secondPin, setSecondPin] = useState('')
	const [isLoading, setIsLoading] = useState<boolean>(false)
	const [isTermsCheckboxChecked, setIsTermsCheckboxChecked] = useState(false)
	const { modal, showModal } = useModal()

	useEffect(() => {
		arePinEquals() ? setIsPinFilled(false) : setIsPinFilled(true)
	}, [firstPin, secondPin])

	const createWallet = async () => {
		try {
			const data = await createEncryptedWallet(firstPin)
			await LocalStorageService.storeBool(STORAGE_KEYS.IS_WALLET_CREATED, true)
			const content = t(RegisterI18nKeys.MESSAGE_SUCCESS_WALLET_CREATION)
			showMessage({ content, type: 'success' })
			setTimeout(() => {
				setIsLoading(false)
				navigation.replace('SecurityPhrase', {
					mneumonic: data.mnemonicPhrase,
					derivationPath: data.derivationPath,
				})
			}, 1000)
		} catch (error) {
			const content = t(RegisterI18nKeys.MESSAGE_ERROR_WALLET_CREATION)
			showMessage({ content, type: 'error' })
			setIsLoading(false)
			console.error('error', error)
		}
	}

	useEffect(() => {
		if (isLoading) {
			if (firstPin.length < 4) {
				const content = t(RegisterI18nKeys.ERROR_PIN_LENGTH)
				showMessage({ content: content, type: 'error' })
				setIsLoading(false)
			} else {
				setTimeout(() => {
					createWallet()
				}, 500)
			}
		}
	}, [isLoading])

	const arePinEquals = () => {
		return firstPin !== '' && secondPin !== '' && firstPin === secondPin
	}

	const renderErrorMessage = () => {
		if (firstPin === '' || secondPin === '' || arePinEquals()) {
			return ''
		}
		return t(RegisterI18nKeys.ERROR)
	}

	return (
		<RegisterStyles.MainContainer>
			<StatusBar backgroundColor='transparent' style='auto' />
			<RegisterStyles.RecoveryButton
				onPress={() => navigation.navigate('Login')}
			>
				{t(RegisterI18nKeys.LOGIN)}
			</RegisterStyles.RecoveryButton>
			<RegisterStyles.Title>{t(RegisterI18nKeys.TITLE)}</RegisterStyles.Title>
			<RegisterStyles.Subtitle>{t(RegisterI18nKeys.SUBTITLE)}</RegisterStyles.Subtitle>

			<RegisterStyles.InputsContainer>
				<RegisterStyles.InputStyled
					testID={testID.FIRST_PIN_INPUT}
					value={firstPin}
					keyboardType='decimal-pad'
					secureTextEntry
					onChangeText={(value: string) => {
						setFirstPin(value.replace(/[^0-9]/g, ''))
					}}
					placeholder={t(RegisterI18nKeys.PIN) || ''}
					returnKeyType={'next'}
				/>
				<RegisterStyles.InputStyled
					testID={testID.SECOND_PIN_INPUT}
					value={secondPin}
					keyboardType='decimal-pad'
					secureTextEntry
					onChangeText={(value: string) => {
						setSecondPin(value.replace(/[^0-9]/g, ''))
					}}
					placeholder={t(RegisterI18nKeys.SECOND_PIN) || ''}
					returnKeyType={'done'}
				/>
				{renderErrorMessage() != '' && (
					<RegisterStyles.ErrorText testID={testID.REGISTER_ERROR_MESSAGE}>
						{renderErrorMessage()}
					</RegisterStyles.ErrorText>
				)}
				<RegisterStyles.CheckBoxContainer>
					<RegisterStyles.TermsCheckBox
						testID={testID.TERMS_CHECKBOX}
						checked={isTermsCheckboxChecked}
						onPress={() => {
							setIsTermsCheckboxChecked(!isTermsCheckboxChecked)
							!isTermsCheckboxChecked &&
								showModal?.({
									Component: TermsModal,
									modalContainerStyle: { paddingBottom: 40 },
								})
						}}

					/>
					<RegisterStyles.TermsText onPress={() => {
						showModal?.({
							Component: TermsModal,
							modalContainerStyle: { paddingBottom: 40 },
						})
						setIsTermsCheckboxChecked(true)
					}
					}>
						{t(RegisterI18nKeys.CONDITIONS)}
					</RegisterStyles.TermsText>
				</RegisterStyles.CheckBoxContainer>
			</RegisterStyles.InputsContainer>


			<RegisterStyles.ContainerBottom>
				{isLoading ? <RegisterStyles.SplashActivityIndicator color={getThemeColor(ColorKeys.text)} size={35} /> : null}
				<RegisterStyles.Button
					testID={testID.REGISTER_BUTTON}
					disabled={isPinFilled || !isTermsCheckboxChecked || isLoading}
					onPress={() => {
						setIsLoading(true)
					}}
				>
					{isLoading ? t('LOADING') : t('BUTTON')}
				</RegisterStyles.Button>
			</RegisterStyles.ContainerBottom>
		</RegisterStyles.MainContainer>
	)
}

export default Register
