import TextStyled, { safeStyledText } from '..'
import { FONT_FAMILY } from '../../../../constants/fontFamily'

const Title = safeStyledText(TextStyled).attrs({ bold: true, fontFamily: FONT_FAMILY.SECONDARY })`
  font-size: 24px;
`

export default Title
