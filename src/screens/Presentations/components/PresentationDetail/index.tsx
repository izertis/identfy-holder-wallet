import { DescriptionText } from '../../../../components/atomic_components/Text/variants'
import { useTranslation } from 'react-i18next'
import { SCREEN } from '../../../../constants/screens'
import PresentationsI18nKeys from '../../i18n/keys'
import { Checkbox, List } from 'react-native-paper'
import { useState } from 'react'
import { getTimeFormat } from '../../../../utils/dates'
import { getThemeColor, ColorKeys } from '../../../../constants/Colors'
import PresentationStyled from '../../styles'

interface Props {
  itemId: string,
  date?: string
  title?: string
  issuer?: string
  key?: string
  deleteMode: boolean
  selectedItems: any[]
  setSelectedItems: (items: string[]) => void
}

const PresentationDetail = (props: Props) => {
  const { t } = useTranslation(SCREEN.Presentations)
  const [expanded, setExpanded] = useState(false)
  const { title, itemId, deleteMode, selectedItems, setSelectedItems, date } = props

  const handlePress = () => setExpanded(!expanded)

  const handleCheckboxToggle = (itemId: string) => {
    if (selectedItems?.includes(itemId)) {
      setSelectedItems(selectedItems.filter((id: string) => id !== itemId))
    } else {
      setSelectedItems([...selectedItems, itemId])
    }
  }

  return (

    <PresentationStyled.PresentationDetailContainer>
      {deleteMode ? (
        <PresentationStyled.CheckBoxView >
          <Checkbox.Android
            status={selectedItems.includes(itemId) ? 'checked' : 'unchecked'}
            onPress={() => handleCheckboxToggle(itemId)}
            color={getThemeColor(ColorKeys.secondary)}
          />
          <List.Section key={props.key} style={{ width: '91%' }}>
            <List.Accordion
              title={<DescriptionText bold>{props.issuer}</DescriptionText>}
              titleStyle={{ fontWeight: '800' }}
              description={<DescriptionText>{getTimeFormat(props.date!)}</DescriptionText>}
              descriptionStyle={{ paddingTop: 3 }}
              expanded={expanded}
              style={{ paddingVertical: -10, backgroundColor: getThemeColor(ColorKeys.background) }}
              onPress={handlePress}>
              <List.Item
                titleStyle={{ flexDirection: 'row', alignItems: 'center' }}
                title={<DescriptionText>{t(PresentationsI18nKeys.INFORMATION)}:</DescriptionText>}
                description={<DescriptionText>{props.title}</DescriptionText>}
              />
            </List.Accordion>
          </List.Section>
        </PresentationStyled.CheckBoxView>
      ) : (
        <List.Section key={props.key}>
          <List.Accordion
            title={<DescriptionText bold>{props.issuer}</DescriptionText>}
            titleStyle={{ fontWeight: '800' }}
            description={<DescriptionText>{getTimeFormat(props.date!)}</DescriptionText>}
            descriptionStyle={{ paddingTop: 3 }}
            expanded={expanded}
            style={{ paddingVertical: -10, backgroundColor: getThemeColor(ColorKeys.background) }}
            onPress={handlePress}>
            <List.Item
              titleStyle={{ flexDirection: 'row', alignItems: 'center' }}
              title={<DescriptionText>{t(PresentationsI18nKeys.INFORMATION)}:</DescriptionText>}
              description={<DescriptionText>{props.title}</DescriptionText>}
            />
          </List.Accordion>
        </List.Section>
      )}
    </PresentationStyled.PresentationDetailContainer>

  )
}

export default PresentationDetail