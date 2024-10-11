import { useState } from 'react'
import { FlatList } from 'react-native'
import { ActionLog } from '../../../../services/open-id/types'
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

  return (
    <HistoricalStyled.ListContainer>
      <FlatList style={{ zIndex: -10 }}
        data={paginatedData}
        keyExtractor={(item, index) => `Log-${index}`}
        renderItem={({ item }) => <HistoricalDetail date={item.date?.toString()} title={item.actionType} issuer={item.issuer} />}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}
        ListFooterComponent={renderFooter}
      />
    </HistoricalStyled.ListContainer>
  )
}

export default HistoricalList