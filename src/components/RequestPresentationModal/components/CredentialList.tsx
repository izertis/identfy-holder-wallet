import { useEffect, useState } from 'react'
import { View } from '../../Themed'
import RequestPresentationModalStyled from '../styles'
import ItemCredential from './ItemCredential'
import HeaderCredential from './HeaderCredential'
import { CredentialData } from '../../../services/open-id/types'

interface Props {
  credentials: CredentialData[]
  onChangeSelectedCredentials: (s: string[]) => void
}
const CredentialList = (props: Props) => {
  const [credentialsSelected, setCredentialsSelected] = useState<string[]>([])

  useEffect(() => {
    props.onChangeSelectedCredentials(credentialsSelected)
  }, [credentialsSelected])


  const onHandlePressHeaderCheckBox = () => {
    setCredentialsSelected(
      isAllSelected ? [] : props.credentials.map(({ id }) => id)
    )
  }
  const onHandlePressItemCheckBox = (
    credential: CredentialData,
    isCredentialSelected: boolean
  ) => {
    setCredentialsSelected(
      isCredentialSelected
        ? credentialsSelected.filter((id) => id !== credential.id)
        : [...credentialsSelected, credential.id]
    )
  }

  const isAllSelected: boolean = credentialsSelected?.length === props.credentials?.length

  return (
    <View>
      <HeaderCredential
        isCheck={isAllSelected}
        onPressCheckBox={onHandlePressHeaderCheckBox}
      />
      <RequestPresentationModalStyled.ScrollContainer>
        {props.credentials
          .map((credential: CredentialData, index) => {
            const isCredentialSelected = !!credentialsSelected.find(id => id === credential.id)

            return (
              <ItemCredential
                key={`ScrollContainer-${index}`}
                credential={credential}
                onPressCheckbox={() => {
                  onHandlePressItemCheckBox(credential, isCredentialSelected)
                }}
                isChecked={isCredentialSelected}
              />
            )
          })}
      </RequestPresentationModalStyled.ScrollContainer>
    </View>
  )
}

export default CredentialList
