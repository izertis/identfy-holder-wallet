import React, { useState } from 'react'
import { TextInput, TextInputProps } from 'react-native-paper'
import { View } from '../../../Themed'

const SecuredInput = (props: TextInputProps & { secureTextEntry?: boolean }) => {
  const [showPassword, setShowPassword] = useState(true)
  const isPasswordShow = props.secureTextEntry && showPassword
  const password= props.value!.replace(/[^ ]/g, '*')
  return (
    <View style={{ backgroundColor: 'transparent' }}>
      <TextInput
        {...props}
        value={(isPasswordShow && props.multiline )?password:props.value}
        secureTextEntry={isPasswordShow}
        right={
          props.secureTextEntry ? (
            <TextInput.Icon
              icon={showPassword ? 'eye-off' : 'eye'}
              onPress={() => setShowPassword(!showPassword)}
            />
          ) : null
        }
      />
    </View>
  )
}

export default SecuredInput
