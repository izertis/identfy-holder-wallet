import React from "react";
import { render } from "@testing-library/react-native";

import QrReader from ".";
import { useNavigation } from "@react-navigation/native";

describe("<QrReader />", () => {
  it("renders correctly", () => {
    const navigation = { navigate: jest.fn() };
    const result = render(<QrReader navigation={navigation} />);
		expect(result.toJSON()).toMatchSnapshot()
  });
});
