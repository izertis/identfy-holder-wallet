import { useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { RootStackScreenProps } from '../../../types'
import Button from '../../components/atomic_components/Button'
import InputStyled from '../../components/atomic_components/InputStyled'
import SeedButton from '../../components/SeedButton'
import { SCREEN } from '../../constants/screens'
import { MessageContext } from '../../context/UserMessage.context'
import SecurityPhraseConfirmI18nKeys from './i18n/keys'
import SecurityPhraseConfirmStyled from './styles'
import { shuffleArray } from '../../utils/shuffleArray'

const SecurityPhraseConfirm = ({ route, navigation }: RootStackScreenProps<'SecurityPhraseConfirm'>) => {
	const { t } = useTranslation(SCREEN.SecurityPhraseConfirm)

	const { mneumonic, derivationPath }: any = route.params

	const {  showMessage } = useContext(MessageContext)
	const [seedPhrase, setSeedPhrase] = useState<string[]>((mneumonic.split(' ')))
	const [showedPhrase, setShowedPhrase] = useState<string[]>([])
	const [originalSeed, setOriginalSeed] = useState<string[]>(mneumonic.split(' '))

	useEffect(() => {
		resetSeeds()
	}, [])

	const handlePress = (word: string) => {
    setShowedPhrase([...showedPhrase, word])
    setSeedPhrase(
      seedPhrase.filter(
        (i, index, arr) =>
          i !== word || index !== arr.findIndex((w) => w === word)
      )
    )
  }

	const handleCheck = async () => {
		if (JSON.stringify(originalSeed) === JSON.stringify(showedPhrase)) {
			navigation.navigate('DerivationPath', { derivationPath: derivationPath })
			resetSeeds()
		} else {
			const content = t(SecurityPhraseConfirmI18nKeys.ERROR)
			showMessage({ content, type: 'error' })
		}
	}
	const resetSeeds = () => {
		setSeedPhrase(shuffleArray(mneumonic.split(' ')))
		setOriginalSeed(mneumonic.split(' '))
		setShowedPhrase([])
	}

	return (
		<SecurityPhraseConfirmStyled.MainContainer>
			<SecurityPhraseConfirmStyled.Container>
				<SecurityPhraseConfirmStyled.RecoveryButton onPress={() => navigation.pop()}>
					{t(SecurityPhraseConfirmI18nKeys.GO_BACK)}
				</SecurityPhraseConfirmStyled.RecoveryButton>
				<SecurityPhraseConfirmStyled.Title testID={'title'}>
					{t(SecurityPhraseConfirmI18nKeys.CONFIRM_TITLE)}
				</SecurityPhraseConfirmStyled.Title>
				<InputStyled
					style={{ height: 120 }}
					editable={false}
					multiline
					label={t(SecurityPhraseConfirmI18nKeys.INPUT_LABEL)}
					value={showedPhrase.join(' ')}
					placeholder={t(SecurityPhraseConfirmI18nKeys.INPUT_PLACEHOLDER)}
				></InputStyled>

				<SecurityPhraseConfirmStyled.ButtonContainer>
					{seedPhrase.map((word, index) => {
						return (
							<SeedButton
								text={word}
								key={`SeedButton-${word}-${index}`}
								onPress={() => {
									handlePress(word)
								}}
							/>
						)
					})}
				</SecurityPhraseConfirmStyled.ButtonContainer>
				<SecurityPhraseConfirmStyled.ResetButton
					disabled={showedPhrase.length < 1}
					onPress={() => {
						resetSeeds()
					}}
				>
					{t(SecurityPhraseConfirmI18nKeys.RESET_BUTTON)}
				</SecurityPhraseConfirmStyled.ResetButton>

				<SecurityPhraseConfirmStyled.ContainerBottom>
					<Button
						disabled={showedPhrase.length < 12}
						onPress={() => {
							handleCheck()
						}}
					>
						{t(SecurityPhraseConfirmI18nKeys.CONFIRM_BUTTON)}
					</Button>
				</SecurityPhraseConfirmStyled.ContainerBottom>
			</SecurityPhraseConfirmStyled.Container>
		</SecurityPhraseConfirmStyled.MainContainer>
	)
}

export default SecurityPhraseConfirm
