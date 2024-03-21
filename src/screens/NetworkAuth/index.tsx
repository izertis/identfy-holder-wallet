import { useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { KeyboardAvoidingView, View } from 'react-native'
import { Text } from 'react-native-paper'
import { RootStackScreenProps } from '../../../types'
import { SCREEN } from '../../constants/screens'
import { MessageContext } from '../../context/UserMessage.context'
import NetworkAuthI18nKeys from './i18n/keys'
import NetworkAuthStyled from './styles'
import { createDidLacchain } from '../../services/Lacchain/createDid'
import { createDidEbsi } from '../../services/Ebsi/createDid'
import { getKeychainDataObject } from '../../utils/keychain'
import { createDidAlastria } from '../../services/alastria/did'
import { StatusBar } from 'expo-status-bar'
import { ColorKeys, getThemeColor } from '../../constants/Colors'

interface Checkbox {
	entity: string,
	label: string
	subLabel: string
	checked: boolean
	action: () => Promise<void>
}

const NetworkAuth = ({ navigation }: RootStackScreenProps<'NetworkAuth'>): JSX.Element => {
	const { t } = useTranslation(SCREEN.NetworkAuth)

	const { showMessage } = useContext(MessageContext)
	const [dids, setDids] = useState<any>({})
	const [isLoading, setIsLoading] = useState<boolean>(false)

	useEffect(() => {
		getKeychainDataObject().then((keychain) => {
			setDids(keychain?.did || {})
		})
	}, [])

	const checkboxes: Checkbox[] = [
		{
			entity: 'alastria',
			label: t(NetworkAuthI18nKeys.CHECKBOX_ALASTRIA),
			subLabel: t(NetworkAuthI18nKeys.CHECKBOX_ALASTRIA_SUB),
			checked: dids.alastria?.AlastriaT || false,
			action: async () => {
				return await createDidAlastria()
			},
		},
		{
			entity: 'lacchain',
			label: t(NetworkAuthI18nKeys.CHECKBOX_LACCHAIN),
			subLabel: t(NetworkAuthI18nKeys.CHECKBOX_LACCHAIN_SUB),
			checked: dids.lacchain || false,
			action: async () => {
				return await createDidLacchain()
			},
		},
		{
			entity: 'ebsi',
			label: t(NetworkAuthI18nKeys.CHECKBOX_EBSI),
			subLabel: t(NetworkAuthI18nKeys.CHECKBOX_EBSI_SUB),
			checked: dids.ebsi || false,
			action: async () => {
				return await createDidEbsi()
			},
		},
	]

	const [checkboxStates, setCheckboxStates] = useState<{ [key: string]: boolean }>(
		checkboxes.reduce((acc: any, curr) => {
			acc[curr.label] = curr.checked
			return acc
		}, {})
	)

	const handleCreateDID = async (): Promise<void> => {
		setIsLoading(true)
		let isSelected = false
		try {
			if (checkboxStates[t(NetworkAuthI18nKeys.CHECKBOX_ALASTRIA)]) {
				await checkboxes[0].action()
			}
			if (checkboxStates[t(NetworkAuthI18nKeys.CHECKBOX_LACCHAIN)]) {
				await checkboxes[1].action()
			}
			if (checkboxStates[t(NetworkAuthI18nKeys.CHECKBOX_EBSI)]) {
				await checkboxes[2].action()
			}

			for (const key in checkboxStates) {
				if (checkboxStates[key] === true) {
					isSelected = true
					break
				}
			}
			isSelected && showMessage({ content: t?.(NetworkAuthI18nKeys.SUCCESS), type: "success" })

		} catch (error) {
			showMessage({ content: t?.(NetworkAuthI18nKeys.ERROR), type: "error" })
		} finally {
			setIsLoading(false)
			navigation.reset({
				index: 0,
				routes: [{ name: 'Root' }],
			})
		}
	}

	const handleCheckboxChange = (label: string): void => {
		setCheckboxStates({
			...checkboxStates,
			[label]: !checkboxStates[label],
		})
	}
	const isCreateDidNeeded = Object.values(checkboxStates).some((checked) => !!checked)

	return (
		<KeyboardAvoidingView>
			<StatusBar backgroundColor='transparent' style='auto' />
			<NetworkAuthStyled.MainContainer>
				<NetworkAuthStyled.GoBackButtonContainer>
					{navigation.canGoBack() &&
						<NetworkAuthStyled.GoBackButton onPress={() => navigation.pop()}>
							{t(NetworkAuthI18nKeys.GO_BACK)}
						</NetworkAuthStyled.GoBackButton>
					}

				</NetworkAuthStyled.GoBackButtonContainer>

				<NetworkAuthStyled.Title testID='title'>{t(NetworkAuthI18nKeys.TITLE)}</NetworkAuthStyled.Title>

				<NetworkAuthStyled.Subtitle>{t(NetworkAuthI18nKeys.SUBTITLE)}</NetworkAuthStyled.Subtitle>

				{checkboxes.map((checkbox: Checkbox, index: number) => (
					<NetworkAuthStyled.CheckBoxContainer key={index}>
						<NetworkAuthStyled.CheckBox
							checked={checkboxStates[checkbox.label] || dids[checkbox.entity]}
							disabled={!!dids[checkbox.entity] || isLoading}
							onPress={() => handleCheckboxChange(checkbox.label)}
						/>
						<View>
							<Text style={{ fontWeight: 'bold' }}>{checkbox.label}</Text>
							<Text>{checkbox.subLabel}</Text>
						</View>
					</NetworkAuthStyled.CheckBoxContainer>
				))}

				<NetworkAuthStyled.Subtitle>{t(NetworkAuthI18nKeys.FOOTER_TEXT)}</NetworkAuthStyled.Subtitle>

				<NetworkAuthStyled.ContainerBottom>
					{isLoading ? <NetworkAuthStyled.SplashActivityIndicator color={getThemeColor(ColorKeys.text)} size={35} /> : null}
					<NetworkAuthStyled.Button
						testID='create-did-button'
						disabled={isLoading}
						onPress={() => handleCreateDID()}
					>
						{isLoading
							? t(NetworkAuthI18nKeys.LOADING)
							: isCreateDidNeeded
								? t(NetworkAuthI18nKeys.BUTTON)
								: t(NetworkAuthI18nKeys.CONTINUE)
						}
					</NetworkAuthStyled.Button>
				</NetworkAuthStyled.ContainerBottom>
			</NetworkAuthStyled.MainContainer>
		</KeyboardAvoidingView>
	)
}

export default NetworkAuth
