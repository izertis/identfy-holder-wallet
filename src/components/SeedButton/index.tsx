import React, { useState } from 'react'

import { ButtonText, StyledSeedButton } from './styles'

export default function SeedButton(props: { text: string; onPress: () => void }): JSX.Element {
	const [showButton, setShowButton] = useState<boolean>(true)

	return (
		<StyledSeedButton
			style={!showButton && { display: 'none' }}
			onPress={() => {
				props.onPress()
				setShowButton(false)
			}}
		>
			<ButtonText>{props.text}</ButtonText>
		</StyledSeedButton>
	)
}
