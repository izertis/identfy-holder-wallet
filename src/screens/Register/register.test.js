import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import "@testing-library/jest-native/extend-expect";
import App from ".";
import { testID } from "./constants/testID";
import i18next from "../../../i18n.config";
import { SCREEN } from "../../constants/screens";
import es from "./i18n/es";

// describe block that groups together related tests for the <App /> component
describe("<Register />", () => {

  const mockShowModal = jest.fn();
  const ScreenName = SCREEN.Register;

  // Adds a resource bundle for the Spanish language to i18next with the translations for the Register screen
  i18next.addResourceBundle("es", ScreenName, es);

  // A mock navigation object used to simulate navigation actions
  const navigation = { navigate: jest.fn() };

  // Test to check if the component renders correctly
  it("renders correctly", () => {
    const { toJSON } = render(
      <App navigation={navigation} translation={i18next} />
    );
    expect(toJSON()).toMatchSnapshot();
  });

  // Test to check if the registration button is disabled when the pins are not equal or the terms checkbox is not checked
  it("disables the button if the pins are not equal or the terms checkbox is not checked", () => {
    const { getByTestId } = render(
      <App navigation={navigation} translation={i18next} />
    );
    const button = getByTestId(testID.REGISTER_BUTTON);
    const firstPinInput = getByTestId(testID.FIRST_PIN_INPUT);
    const secondPinInput = getByTestId(testID.SECOND_PIN_INPUT);
    const checkbox = getByTestId(testID.TERMS_CHECKBOX);

    // Simulates user input by changing the text of the pin inputs and clicking the terms checkbox
    fireEvent.changeText(firstPinInput, "1234");
    fireEvent.changeText(secondPinInput, "5678");
    fireEvent.press(checkbox);

    expect(button).toBeDisabled();

    // Simulates user input by changing the text of the second pin input to be equal to the first pin input
    fireEvent.changeText(secondPinInput, "1234");

    // Checks if the registration button is enabled when the pins are equal and the checkbox is checked
    expect(button).toBeEnabled();

    fireEvent.press(checkbox);
    expect(button).toBeDisabled();
  });

  // Test to check if an error message is displayed when the pins are not equal
  it("renders an error message if the pins are not equal", () => {
    const { getByTestId, queryAllByTestId } = render(
      <App navigation={navigation} translation={i18next} />
    );
    const firstPinInput = getByTestId(testID.FIRST_PIN_INPUT);
    const secondPinInput = getByTestId(testID.SECOND_PIN_INPUT);

    // Simulates user input by changing the text of the pin inputs to be different
    fireEvent.changeText(firstPinInput, "1234");
    fireEvent.changeText(secondPinInput, "5678");

    // Checks if an error message is displayed
    let messageErrorText = queryAllByTestId(testID.REGISTER_ERROR_MESSAGE);
    expect(messageErrorText).toHaveLength(1);

    // Set equal pins and ensure the error message is not displayed
    fireEvent.changeText(secondPinInput, "1234");
    messageErrorText = queryAllByTestId(testID.REGISTER_ERROR_MESSAGE);
    expect(messageErrorText).toHaveLength(0);
  });
});
