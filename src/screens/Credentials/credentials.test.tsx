import React from "react"
import { render } from "@testing-library/react-native"

import Credential from "."
import { TEST_LABELS } from "./constants/testLabels"
import i18next from "../../../i18n.config";
import { SCREEN } from "../../constants/screens";
import localeES from "./i18n/es";


const mockedNavigation: any = {
  navigate: jest.fn(),
  route: jest.fn(),
}
describe("<Credentials />", () => {
  const ScreenName = SCREEN.Credentials;
  
  // Adds a resource bundle for the Spanish language to i18next with the translations for the Register screen
  i18next.addResourceBundle("es", ScreenName, localeES);
  it("should render ", () => {
    const result = render(<Credential {...mockedNavigation} />)

    expect(result.toJSON()).toMatchSnapshot()
  })
  it("Should renders correctly", () => {
    const { getAllByRole, getByTestId } = render(
      <Credential {...mockedNavigation} i18next={i18next}/>
    )

    const ActionButton = getByTestId(TEST_LABELS.ActionButton)

    expect(ActionButton).toBeDefined()
  })
})
