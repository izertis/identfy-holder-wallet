import { useContext, useState } from 'react'
import { FlatList } from 'react-native'
import { PresentationData } from '../../../../services/open-id/types'
import { ColorKeys, getThemeColor } from '../../../../constants/Colors'
import { IconButton } from 'react-native-paper'
import { MessageContext } from '../../../../context/UserMessage.context'
import Loading from '../../../../components/Loading'
import PresentationsI18nKeys from '../../i18n/keys'
import PresentationStyled from '../../styles'
import { useTranslation } from 'react-i18next'
import { SCREEN } from '../../../../constants/screens'
import PresentationDetail from '../PresentationDetail'
import { markItemAsRevoked } from '../../../../utils/keychain'
import { useNavigation } from '@react-navigation/native'

interface Props {
  presentations: PresentationData[]
}

const PresentationList = (props: Props) => {
  const { t } = useTranslation(SCREEN.Presentations)
  const [isLoading, setIsLoading] = useState(false)
  const [pageNumber, setPageNumber] = useState(1)
  const [selectedItems, setSelectedItems] = useState<Date[]>([])
  const [deleteMode, setDeleteMode] = useState(false)
  const navigation = useNavigation()

  const { showMessage } = useContext(MessageContext)

  const itemsPerPage = 8
  const totalItems = props.presentations.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const activePresentations = props.presentations.filter(elem => elem.status === 'Active')
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
    for (const itemTimestamp of selectedItems) {
      await markItemAsRevoked(itemTimestamp, 'presentation')
      itemTimestamp && showMessage({ content: t?.(PresentationsI18nKeys.SUCCESS_MESSAGE), type: 'success' })
    }
    setSelectedItems([])
    setDeleteMode(false)
    navigation.navigate('Root', { screen: 'Presentations' })
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
        renderItem={({ item }) => <PresentationDetail
          date={item.validFrom}
          id={item.id}
          issuer={item.issuer}
          itemTimestamp={item.timestamp}
          deleteMode={deleteMode}
          selectedItems={selectedItems}
          setSelectedItems={setSelectedItems}
          presentation={item.credential} />}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}
        ListFooterComponent={renderFooter}
        extraData={selectedItems}
      />
    </>
  )
}

export default PresentationList