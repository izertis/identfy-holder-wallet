import { Pressable } from 'react-native'
import { useContext, useEffect } from 'react'
import { useClipboard } from '@react-native-clipboard/clipboard'
import { MessageContext } from '../../context/UserMessage.context'
import { useTranslation } from 'react-i18next'
import es from './i18n/es'

const PressToCopy = (props: { value: string; onPress?: () => void; children: any }): JSX.Element => {
	const { t } = useTranslation()
	const [data, setString] = useClipboard()
	const onPress = props.onPress || (() => { })

	const { showMessage } = useContext(MessageContext)

	const copyToClipboard = (data: string) => {
		setString(data)
		const content = t(es.COPIED_TEXT)
		showMessage({ content, type: 'success' })
	}

	return (
		<Pressable
			style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1.0 }]}
			onPress={onPress}
			onLongPress={() => copyToClipboard(props.value)}
		>
			{props.children}
		</Pressable>
	)
}

export default PressToCopy
