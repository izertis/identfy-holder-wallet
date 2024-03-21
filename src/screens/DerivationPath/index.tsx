import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card } from 'react-native-paper'
import { RootStackScreenProps } from '../../../types'
import Button from '../../components/atomic_components/Button'
import PressToCopy from '../../components/PressToCopy'
import { SCREEN } from '../../constants/screens'
import DerivationPathI18nKeys from './i18n/keys'
import DerivationPathStyled from './styles'

const DerivationPath = ({ route, navigation }: RootStackScreenProps<'DerivationPath'>) => {
	const { t } = useTranslation(SCREEN.DerivationPath)

	const { derivationPath }: any = route.params

	const [isSeedBlur, setIsSeedBlur] = useState<boolean>(true)

	return (
		<DerivationPathStyled.MainContainer>
			<DerivationPathStyled.BackButton onPress={() => navigation.pop()}>
				{t(DerivationPathI18nKeys.GO_BACK)}
			</DerivationPathStyled.BackButton>
			<DerivationPathStyled.Container>
				<DerivationPathStyled.Title testID='title'>
					{t(DerivationPathI18nKeys.TITLE)}
				</DerivationPathStyled.Title>
				<DerivationPathStyled.Subtitle>{t(DerivationPathI18nKeys.SUBTITLE)}</DerivationPathStyled.Subtitle>

				{isSeedBlur ? (
					<DerivationPathStyled.PhraseContainer onPress={() => setIsSeedBlur(!isSeedBlur)}>
						<DerivationPathStyled.MainCard justifyContent='flex-end' alignItems='center'>
							<Card.Content>
								<DerivationPathStyled.HiddenTitle>
									{t(DerivationPathI18nKeys.HIDDEN_TITLE)}
								</DerivationPathStyled.HiddenTitle>
							</Card.Content>
						</DerivationPathStyled.MainCard>
					</DerivationPathStyled.PhraseContainer>
				) : (
					<DerivationPathStyled.PhraseContainer>
						<PressToCopy onPress={() => setIsSeedBlur(!isSeedBlur)} value={derivationPath}>
							<DerivationPathStyled.MainCard>
								<Card.Content>
									<DerivationPathStyled.Content>{derivationPath}</DerivationPathStyled.Content>
								</Card.Content>
							</DerivationPathStyled.MainCard>
						</PressToCopy>
					</DerivationPathStyled.PhraseContainer>
				)}
				{!isSeedBlur && (
					<DerivationPathStyled.CopyText>
						{t(DerivationPathI18nKeys.LONG_PRESS)}
					</DerivationPathStyled.CopyText>
				)}

				<DerivationPathStyled.ContainerBottom>
					<Button
						onPress={() => {
							navigation.navigate('NetworkAuth')
						}}
					>
						{t(DerivationPathI18nKeys.BUTTON)}
					</Button>
				</DerivationPathStyled.ContainerBottom>
			</DerivationPathStyled.Container>
		</DerivationPathStyled.MainContainer>
	)
}

export default DerivationPath
