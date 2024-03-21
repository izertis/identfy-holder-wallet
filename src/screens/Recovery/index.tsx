import React, { useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { KeyboardAvoidingView } from 'react-native'
import { RootStackScreenProps } from '../../../types'
import { SCREEN } from '../../constants/screens'
import { MessageContext } from '../../context/UserMessage.context'
import { changePin, checkSecurityPhrase } from '../../utils/keychain'
import { testID } from './constants/testID'
import RecoveryI18nKeys from './i18n/keys'
import RecoveryStyled from './styles'

const Recovery = ({ navigation }: RootStackScreenProps<'Recovery'>) => {
	const { t } = useTranslation(SCREEN.Recovery)

	const { showMessage } = useContext(MessageContext)
	const [securityPhrase, setSecurityPhrase] = useState('')
	const [firstPin, setFirstPin] = useState('')
	const [isPinFilled, setIsPinFilled] = useState(false)
	const [secondPin, setSecondPin] = useState('')
	const [isLoading, setIsLoading] = useState(false)

	useEffect(() => {
		setIsPinFilled(arePinEquals())
	}, [firstPin, secondPin])

	const setNewPin = async (securityPhrase: string, pin: string) => {
		setIsLoading(true)
		const isCorrectPhrase = await checkSecurityPhrase(securityPhrase.trim())
		if (isCorrectPhrase && isPinLengthValid(secondPin)) {
			changePinAndClearForm(pin)
		} else if (!isCorrectPhrase) {
			showPhraseError()
		} else {
			showPinError()
		}
	}

	const changePinAndClearForm = async (pin: string) => {
		const isChanged = await changePin(pin)
		if (isChanged) {
			clearForm()
			const content = t(RecoveryI18nKeys.SUCCESS)
			showMessage({ content, type: 'success' })
			setIsLoading(false)
			navigation.navigate('Login')
		}
	}

	const clearForm = (): void => {
		setSecurityPhrase('')
		setFirstPin('')
		setSecondPin('')
		setIsLoading(false)
	}

	const arePinEquals = () => {
		return firstPin !== '' && secondPin !== '' && firstPin === secondPin
	}

	const showPhraseError = (): void => {
		const content = t(RecoveryI18nKeys.ERROR_PHRASE)
		showMessage({ content, type: 'error' })
		setIsLoading(false)
	}

	const showPinError = (): void => {
		const content = t(RecoveryI18nKeys.ERROR_PIN_LENGTH)
		showMessage({ content, type: 'error' })
		setIsLoading(false)
	}

	const isPinLengthValid = (pin: string) => {
		return pin.length > 3
	}

	const renderErrorMessage = () => {
		if (
			firstPin === '' ||
			secondPin === '' ||
			arePinEquals()
		) {
			return ''
		}
		return t(RecoveryI18nKeys.ERROR_PIN_EQUALS)
	}

	return (
		<KeyboardAvoidingView>
			<RecoveryStyled.MainContainer>
				<RecoveryStyled.RecoveryButton onPress={() => navigation.pop()}>
					{t(RecoveryI18nKeys.GO_BACK)}
				</RecoveryStyled.RecoveryButton>
				<RecoveryStyled.Title testID='title'>{t(RecoveryI18nKeys.TITLE)}</RecoveryStyled.Title>
				<RecoveryStyled.Subtitle>{t(RecoveryI18nKeys.SUBTITLE)}</RecoveryStyled.Subtitle>

				<RecoveryStyled.InputsContainer>
					<RecoveryStyled.InputStyled
						value={securityPhrase}
						multiline
						onChangeText={(value: string) => setSecurityPhrase(value)}
						placeholder={t(RecoveryI18nKeys.SECURITY_KEY).toString()}
						returnKeyType='next'
					/>
					<RecoveryStyled.InputStyled
						testID={testID.FIRST_PIN_INPUT}
						value={firstPin}
						keyboardType='numeric'
						secureTextEntry
						onChangeText={(value: string) => setFirstPin(value.replace(/[^0-9]/g, ''))}
						placeholder={t(RecoveryI18nKeys.PIN) || ''}
						returnKeyType='next'
					/>
					<RecoveryStyled.InputStyled
						testID={testID.SECOND_PIN_INPUT}
						value={secondPin}
						keyboardType='numeric'
						secureTextEntry
						onChangeText={(value: string) => setSecondPin(value.replace(/[^0-9]/g, ''))}
						placeholder={t(RecoveryI18nKeys.REPIN) || ''}
						returnKeyType={'done'}
					/>
					{renderErrorMessage() != '' && (
						<RecoveryStyled.ErrorText testID={testID.REGISTER_ERROR_MESSAGE}>
							{renderErrorMessage()}
						</RecoveryStyled.ErrorText>
					)}
				</RecoveryStyled.InputsContainer>

				<RecoveryStyled.ContainerBottom>
					{isLoading ? <RecoveryStyled.SplashActivityIndicator size={35} /> : null}
					<RecoveryStyled.Button
						disabled={!securityPhrase || !isPinFilled || isLoading}
						onPress={() => {
							setNewPin(securityPhrase, secondPin)
						}}
					>
						{isLoading ? t('LOADING') : t('BUTTON')}
					</RecoveryStyled.Button>
				</RecoveryStyled.ContainerBottom>
			</RecoveryStyled.MainContainer>
		</KeyboardAvoidingView>
	)
}

export default Recovery
