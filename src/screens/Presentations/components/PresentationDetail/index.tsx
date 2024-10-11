import { DescriptionText } from '../../../../components/atomic_components/Text/variants'
import { useTranslation } from 'react-i18next'
import { SCREEN } from '../../../../constants/screens'
import PresentationsI18nKeys from '../../i18n/keys'
import { Checkbox, List } from 'react-native-paper'
import { useState } from 'react'
import { getTimeFormat } from '../../../../utils/dates'
import { getThemeColor, ColorKeys } from '../../../../constants/Colors'
import PresentationStyled from '../../styles'
import { filterCredentialType, getTrustedFrameworkFromDid } from '../../../../services/open-id/utils'
import { Credential, PresentationData } from '../../../../services/open-id/types'
import jwt from 'jsonwebtoken'
import CredentialAccordionDetail from '../../../../components/CredentialAccordionDetail'

interface Props {
  itemTimestamp: Date,
  date?: string
  id?: string
  issuer?: string
  key?: string
  deleteMode: boolean
  selectedItems: Date[]
  setSelectedItems: (items: Date[]) => void
  presentation: PresentationData | string | unknown
}

const PresentationDetail = (props: Props) => {
  const { t } = useTranslation(SCREEN.Presentations)
  const [expanded, setExpanded] = useState(false)
  const { itemTimestamp, deleteMode, selectedItems, setSelectedItems, date } = props

  const handlePress = () => setExpanded(!expanded)

  const handleCheckboxToggle = (itemTimestamp: Date) => {
    if (selectedItems?.includes(itemTimestamp)) {
      setSelectedItems(selectedItems.filter((timestamp) => timestamp !== itemTimestamp))
    } else {
      setSelectedItems([...selectedItems, itemTimestamp])
    }
  }
  let presentation
  if (typeof props.presentation === 'string') {
    if (props.presentation.startsWith('ey')) {
      presentation = jwt.decode(props.presentation)
    } else {
      try {
        presentation = JSON.parse(props.presentation)
      } catch (error) {
        console.error('Error parsing credential as JSON:', error)
      }
    }
  } else {
    presentation = props.presentation
  }

  const parsedPresentation: Credential['payload'] = presentation
  const { type, issuer } = parsedPresentation?.vc ?? parsedPresentation.data ?? {}

  let trustedFramework = getTrustedFrameworkFromDid(issuer)
  if (trustedFramework === 'epic') trustedFramework = 'Alastria epic'

  return (

    <PresentationStyled.PresentationDetailContainer>
      {deleteMode ? (
        <PresentationStyled.CheckBoxView >
          <Checkbox.Android
            status={selectedItems.includes(itemTimestamp) ? 'checked' : 'unchecked'}
            onPress={() => handleCheckboxToggle(itemTimestamp)}
            color={getThemeColor(ColorKeys.secondary)}
          />
          <List.Section key={props.key} style={{ width: '91%' }}>
            <PresentationStyled.StyledAccordion
              title={<DescriptionText
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                <PresentationStyled.LabelText>
                  {t(PresentationsI18nKeys.CREDENTIAL)}
                </PresentationStyled.LabelText>
                {filterCredentialType(type!)}
              </DescriptionText>}
              titleStyle={{ fontWeight: '800' }}
              description={
                <DescriptionText>
                  <PresentationStyled.LabelText>
                    {t(PresentationsI18nKeys.PRESENTED)}
                  </PresentationStyled.LabelText> {getTimeFormat(itemTimestamp.toString())}
                </DescriptionText>
              }
              descriptionStyle={{ paddingTop: 3 }}
              expanded={expanded}
              onPress={handlePress}>

              <List.Item
                titleStyle={{ flexDirection: 'row', alignItems: 'center' }}
                title={<DescriptionText>{t(PresentationsI18nKeys.INFORMATION)}:</DescriptionText>}
              />
              <CredentialAccordionDetail
                id={props.id}
                type={filterCredentialType(type!)}
                trustedFramework={trustedFramework}
                status={undefined} />
            </PresentationStyled.StyledAccordion>
          </List.Section>
        </PresentationStyled.CheckBoxView>
      ) : (
        <List.Section key={props.key}>
          <PresentationStyled.StyledAccordion
            title={<DescriptionText
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              <PresentationStyled.LabelText>
                {t(PresentationsI18nKeys.CREDENTIAL)}
              </PresentationStyled.LabelText>
              {filterCredentialType(type!)}
            </DescriptionText>}
            titleStyle={{ fontWeight: '800' }}
            description={
              <DescriptionText>
                <PresentationStyled.LabelText>
                  {t(PresentationsI18nKeys.PRESENTED)}
                </PresentationStyled.LabelText> {getTimeFormat(itemTimestamp.toString())}
              </DescriptionText>
            }
            descriptionStyle={{ paddingTop: 3 }}
            expanded={expanded}
            onPress={handlePress}>

            <List.Item
              titleStyle={{ flexDirection: 'row', alignItems: 'center' }}
              title={<DescriptionText>{t(PresentationsI18nKeys.INFORMATION)}:</DescriptionText>}
            />
            <CredentialAccordionDetail
              id={props.id}
              type={filterCredentialType(type!)}
              trustedFramework={trustedFramework}
              status={undefined} />
          </PresentationStyled.StyledAccordion>
        </List.Section>
      )}
    </PresentationStyled.PresentationDetailContainer>

  )
}

export default PresentationDetail