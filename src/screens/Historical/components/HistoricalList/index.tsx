import { useState } from 'react'
import { FlatList, View } from 'react-native'
import { ActionLog } from '../../../../types/keychain'
import { ColorKeys, getThemeColor } from '../../../../constants/Colors'
import { IconButton } from 'react-native-paper'
import Loading from '../../../../components/Loading'
import HistoricalStyled from '../../styles'
import HistoricalDetail from '../HistoricalDetail'

interface Props {
  logs: ActionLog[]
}

const HistoricalList = (props: Props) => {
  const [isLoading, setIsLoading] = useState(false)
  const [pageNumber, setPageNumber] = useState(1)

  const itemsPerPage = 8
  const totalItems = props.logs?.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)

  const paginatedData = props.logs?.slice(0, pageNumber * itemsPerPage)

  const handleLoadMore = () => {
    if (pageNumber < totalPages) {
      setIsLoading(true)
      setTimeout(() => {
        setPageNumber(pageNumber + 1)
        setIsLoading(false)
      }, 1000)
    }
  }

  const renderFooter = () => {
    if (!isLoading || pageNumber === totalPages) return null

    return (
      <HistoricalStyled.LoadingView>
        <Loading height='-10%' />
      </HistoricalStyled.LoadingView>
    )
  }

  const mockFilter = {
    a: 'Todo',
    b: 'General',
    c: 'Salud',
    Educacion: 'Educación',
  }

  return (
    <>
      <HistoricalStyled.HeaderControlView>
        <HistoricalStyled.DropDownSelect onChange={() => { }} data={mockFilter} titleStyle={{ color: getThemeColor(ColorKeys.primary) }} title="Filtro" />
        <IconButton icon="magnify" iconColor={getThemeColor(ColorKeys.primary)} style={{ marginRight: -70 }} onPress={() => { }} />
        <IconButton icon="calendar" iconColor={getThemeColor(ColorKeys.primary)} onPress={() => { }} />
      </HistoricalStyled.HeaderControlView>
      <FlatList style={{ zIndex: -10 }}
        data={paginatedData}
        keyExtractor={(item, index) => `Log-${index}`}
        renderItem={({ item }) => <HistoricalDetail date={item.date?.toString()} title={item.actionType} issuer={item.issuer} />}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}
        ListFooterComponent={renderFooter}
      />
    </>
  )
}

export default HistoricalList