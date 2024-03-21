import { useContext, useState } from 'react'
import { FlatList } from 'react-native'
import { PresentationData } from '../../../../types/keychain'
import { ColorKeys, getThemeColor } from '../../../../constants/Colors'
import { Button, IconButton } from 'react-native-paper'
import { MessageContext } from '../../../../context/UserMessage.context'
import Loading from '../../../../components/Loading'
import PresentationsI18nKeys from '../../i18n/keys'
import PresentationStyled from '../../styles'
import { useTranslation } from 'react-i18next'
import { SCREEN } from '../../../../constants/screens'
import PresentationDetail from '../PresentationDetail'
import { revokeItem } from '../../../../utils/keychain'

interface Props {
  presentations: PresentationData[]
}

const PresentationList = (props: Props) => {
  const { t } = useTranslation(SCREEN.Presentations)
  const [isLoading, setIsLoading] = useState(false)
  const [pageNumber, setPageNumber] = useState(1)
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [deleteMode, setDeleteMode] = useState(false)
  const [buttonName, setButtonName] = useState(t(PresentationsI18nKeys.ORGANIZATIONS))

  const { showMessage } = useContext(MessageContext)

  const itemsPerPage = 8
  const totalItems = props.presentations.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const activePresentations = props.presentations.filter(elem => elem.status === 'active')
  const paginatedData = activePresentations.slice(0, pageNumber * itemsPerPage)

  const handleLoadMore = () => {
    if (pageNumber < totalPages) {
      setIsLoading(true)
      setTimeout(() => {
        setPageNumber(pageNumber + 1)
        setIsLoading(false)
      }, 1000)
    }
  }

  const handleDelete = async () => {
    for (const itemId of selectedItems) {
      await revokeItem(itemId, 'presentation')
      itemId && showMessage({ content: t?.(PresentationsI18nKeys.SUCCESS_MESSAGE), type: 'success' })
    }
    setSelectedItems([])
    setDeleteMode(false)
  }

  const renderFooter = () => {
    if (!isLoading || pageNumber === totalPages) return null

    return (
      <PresentationStyled.LoadingView>
        <Loading height='-10%' />
      </PresentationStyled.LoadingView>
    )
  }

  return (
    <>
      <PresentationStyled.HeaderControlView>
        <IconButton icon='priority-low' iconColor={getThemeColor(ColorKeys.primary)} onPress={() => { }} />
        <Button
          style={{ paddingTop: 7, marginLeft: -40 }}
          labelStyle={{ color: getThemeColor(ColorKeys.primary) }}
          onPress={() => {
            buttonName === t(PresentationsI18nKeys.DATE) ? setButtonName(t(PresentationsI18nKeys.ORGANIZATIONS)) : setButtonName(t(PresentationsI18nKeys.DATE))
          }}>
          {buttonName}
        </Button>
        <IconButton icon="magnify" iconColor={getThemeColor(ColorKeys.primary)} onPress={() => { }} />
        <IconButton icon="calendar" iconColor={getThemeColor(ColorKeys.primary)} onPress={() => { }} />
        <IconButton
          icon={deleteMode ? 'check' : 'delete'}
          iconColor={getThemeColor(ColorKeys.primary)}
          onPress={() => {
            if (deleteMode) {
              handleDelete()
            } else {
              setDeleteMode(true)
            }
          }}
        />
      </PresentationStyled.HeaderControlView >
      <FlatList
        data={paginatedData}
        keyExtractor={(item, index) => `Presentation-${index}`}
        renderItem={({ item }) => <PresentationDetail date={item.validFrom} title={item.id} issuer={item.issuer} itemId={item.id} deleteMode={deleteMode} selectedItems={selectedItems} setSelectedItems={setSelectedItems} />}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}
        ListFooterComponent={renderFooter}
        extraData={selectedItems}
      />
    </>
  )
}

export default PresentationList