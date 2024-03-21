import styled from 'styled-components/native'
import { Dimensions } from 'react-native'
import { BarCodeScanner } from 'expo-barcode-scanner'
import { DescriptionText } from '../../../components/atomic_components/Text/variants'
import { safeStyledText } from '../../../components/atomic_components/Text'

const defaultStyles = {
	QrScanner: styled(BarCodeScanner)`
		height: ${Dimensions.get('window').height + 100}px;
		width: ${Dimensions.get('window').width}px;
	`,
	Container: styled.SafeAreaView`
		background-color: black;
		flex: 1;
	`,
	RequestingText: safeStyledText(DescriptionText)`
    color: white;
    margin-top: 50px;
    align-self: center;
  `,
}

export default defaultStyles
