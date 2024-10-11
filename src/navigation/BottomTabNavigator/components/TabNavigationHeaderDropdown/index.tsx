import { useState } from "react"
import { SCREEN } from "../../../../constants/screens"
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
import ConfirmationDialog from "../../../../components/ConfirmationDialog"
import { deleteAllKeychainData } from "../../../../utils/keychain"
import LocalStorageService from "../../../../services/LocalStorage.service"

const bundle = "TabNavigatorHeaderDropDown"

const TabNavigatorHeaderDropDown = () => {
  i18next.addResourceBundle("es", bundle, localeES)
  const { t } = useTranslation(bundle)

  const navigation = useNavigation()
  const [visible, setVisible] = useState<boolean>(false)
  const { showModal } = useModal()
  const [isDialogVisible, setDialogVisible] = useState(false)

  const openMenu = () => setVisible(true)
  const closeMenu = () => setVisible(false)

  const menuItems = [
    { title: SCREEN.DidList, i18nKey: BottonTabNavigationHeaderI18nKeys.DID_MANAGEMENT },
    { title: 'TermsAndConditions', i18nKey: BottonTabNavigationHeaderI18nKeys.TERMS_AND_CONDITIONS },
    { title: SCREEN.Login, i18nKey: BottonTabNavigationHeaderI18nKeys.BLOCK_SESION },
    { title: SCREEN.OnBoarding, i18nKey: BottonTabNavigationHeaderI18nKeys.REMOVE_USER_KEYS },
  ]

  const navigateAndCloseMenu = (screenName: string) => {
    if (screenName === SCREEN.Login || screenName === SCREEN.OnBoarding) {
      const resetAction = CommonActions.reset({
        index: 0,
        routes: [{ name: screenName }],
      })
      navigation.dispatch(resetAction)
    } else {
      //@ts-ignore
      navigation.navigate(screenName)
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
                    buttonText: t(es.BUTTON_CLOSE),
                  },
                  modalContainerStyle: { paddingBottom: 40 },
                })
                setVisible(false)

              } else if (item.title === SCREEN.OnBoarding) {
                setVisible(false)
                setDialogVisible(true)
              } else {
                navigateAndCloseMenu(item.title)
              }
            }}
            title={t(item.i18nKey)}
          />
        ))}
      </Menu>
      <ConfirmationDialog
        visible={isDialogVisible}
        titleLabel={t(BottonTabNavigationHeaderI18nKeys.DIALOG_TITLE)!}
        message={t(BottonTabNavigationHeaderI18nKeys.DIALOG_DESCRIPTION)!}
        onPress={async () => {
          setDialogVisible(false)
          await deleteAllKeychainData()
          await LocalStorageService.clearAll()
          navigateAndCloseMenu(SCREEN.OnBoarding)
        }}
        onCancel={() => {
          setDialogVisible(false)
        }}
      />
    </DropdownView>
  )
}

export default TabNavigatorHeaderDropDown
