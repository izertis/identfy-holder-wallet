import { useState } from "react"
import { SCREEN } from "../../../../constants/screens"
import { navigate } from "../../../RootNavigation"
import i18next from "../../../../../i18n.config"
import localeES from "./i18n/es"
import BottonTabNavigationHeaderI18nKeys from "./i18n/keys"
import { useTranslation } from "react-i18next"
import { Menu } from "react-native-paper"
import { CommonActions, useNavigation } from "@react-navigation/native"
import { DropDownButton, DropdownView } from "./style"
import { ColorKeys, getThemeColor } from "../../../../constants/Colors"
import TermsModal from "../../../../components/TermsModal"
import es from "./i18n/es"
import useModal from "../../../../hooks/useModal"

const bundle = "TabNavigatorHeaderDropDown"

const TabNavigatorHeaderDropDown = () => {
  i18next.addResourceBundle("es", bundle, localeES)
  const { t } = useTranslation(bundle)

  const navigation = useNavigation()
  const [visible, setVisible] = useState<boolean>(false)
  const { showModal } = useModal()

  const openMenu = () => setVisible(true)
  const closeMenu = () => setVisible(false)

  const menuItems = [
    { title: SCREEN.DidList, i18nKey: BottonTabNavigationHeaderI18nKeys.DidManagement },
    { title: SCREEN.Help, i18nKey: BottonTabNavigationHeaderI18nKeys.Help },
    { title: 'TermsAndConditions', i18nKey: BottonTabNavigationHeaderI18nKeys.TermsAndConditions },
    { title: SCREEN.Login, i18nKey: BottonTabNavigationHeaderI18nKeys.Login },
  ]

  const navigateAndCloseMenu = (screenName: string) => {
    if (screenName === SCREEN.Login) {
      const resetAction = CommonActions.reset({
        index: 0,
        routes: [{ name: screenName }],
      })
      navigation.dispatch(resetAction)
    } else {
      navigate(screenName)
    }
    setVisible(false)
  }

  return (
    <DropdownView>
      <Menu
        visible={visible}
        contentStyle={{
          backgroundColor: getThemeColor(ColorKeys.titleMenu),
          height: '82%',
          marginTop: 45
        }}
        onDismiss={closeMenu}
        anchor={
          <DropDownButton
            labelStyle={{
              color: getThemeColor(ColorKeys.invertedText),
              fontSize: 30
            }}
            icon={'dots-vertical'}
            onPress={openMenu}>{''}
          </DropDownButton>}>

        {menuItems.map((item) => (
          <Menu.Item
            key={item.title}
            onPress={() => {
              if (item.title === 'TermsAndConditions') {
                showModal?.({
                  Component: TermsModal,
                  modalProps: {
                    buttonText: t(es.ModalButton),
                  },
                  modalContainerStyle: { paddingBottom: 40 },
                })
                setVisible(false)
              } else {
                navigateAndCloseMenu(item.title)
              }
            }}
            title={t(item.i18nKey)}
          />
        ))}
      </Menu>
    </DropdownView>
  )
}

export default TabNavigatorHeaderDropDown
