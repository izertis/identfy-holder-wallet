import { useRoute } from '@react-navigation/native'
import {
  StyledContainerPlaceholder,
  StyledTitlePlaceholder,
  StyledTextPlaceholder,
  ButtonContainerPlaceholder,
} from './styles'
import ButtonMailbox from '../ButtonMailbox'

interface Props {
  placeholderTitle?: string
  placeholderText?: string
}

const Placeholder = (props: Props) => {
  const { placeholderTitle, placeholderText } = props

  const route = useRoute()
  const isButtonActive = route.name == 'Credentials' || route.name == 'Verifications'

  return (
    <StyledContainerPlaceholder>
      <StyledTitlePlaceholder>{placeholderTitle}</StyledTitlePlaceholder>
      <StyledTextPlaceholder>{placeholderText}</StyledTextPlaceholder>
      <ButtonContainerPlaceholder>
        {isButtonActive && <ButtonMailbox />}
      </ButtonContainerPlaceholder>
    </StyledContainerPlaceholder>
  )
}

export default Placeholder
