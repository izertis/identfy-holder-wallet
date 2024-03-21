import { useMemo, useState } from 'react'
import CredentialStyled from '../../styles'
import { FlatList } from 'react-native'
import CredentialDetail from '../CredentialDetail'
import { CredentialData } from '../../../../types/keychain'
import Loading from '../../../../components/Loading'
import { ColorKeys, getThemeColor } from '../../../../constants/Colors'
import ButtonMailbox from '../../../../components/ButtonMailbox'

interface Props {
  credentials: CredentialData[]
}

const CredentialList = (props: Props) => {
  const mockFilter = {
    a: 'Todo',
    b: 'General',
    c: 'Salud',
    Educacion: 'Educación',
  }

  const [isLoading, setIsLoading] = useState(false)
  const [pageNumber, setPageNumber] = useState(1)
  const itemsPerPage = 8
  const totalItems = props.credentials.length
  const totalPages = useMemo(() => Math.ceil(totalItems / itemsPerPage), [totalItems, itemsPerPage])
  const paginatedData = useMemo(() => props.credentials.slice(0, pageNumber * itemsPerPage), [props.credentials, pageNumber, itemsPerPage])

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
      <CredentialStyled.LoadingView>
        <Loading height='-10%' />
      </CredentialStyled.LoadingView>
    )
  }

  return (
    <>
      <CredentialStyled.HeaderContainer>
        <CredentialStyled.DropDownSelect onChange={() => { }} data={mockFilter} titleStyle={{ color: getThemeColor(ColorKeys.primary) }} title="Filtro" />
        <CredentialStyled.ButtonContainer>
          <ButtonMailbox />
        </CredentialStyled.ButtonContainer>
      </CredentialStyled.HeaderContainer>

      <FlatList
        data={paginatedData}
        keyExtractor={(item, index) => `Credential-${index}`}
        renderItem={({ item }) => <CredentialDetail date={item.validFrom} title={'Credencial'} issuer={item.issuer} credential={item.credential} />}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}
        ListFooterComponent={renderFooter}
      />
    </>
  )
}

export default CredentialList
