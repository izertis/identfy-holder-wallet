import { useState } from "react"
import { View } from "react-native"
import RNDropDownPicker from "react-native-dropdown-picker"
interface Props {
  items: { label: string; value: string }[]
  onChange: (value: any, open?: boolean) => void
  onChangeOpen?: (open: boolean) => void
}
const DropDownPicker = (props: Props) => {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState(null)

  return (
    <RNDropDownPicker
      open={open}
      value={value}
      items={props.items}
      onChangeValue={(value) => props.onChange(value, open)}
      onOpen={() => props.onChangeOpen?.(!open)}
      onClose={() => props.onChangeOpen?.(!open)}
      setOpen={setOpen}
      setValue={setValue}
    />
  )
}
export default DropDownPicker
