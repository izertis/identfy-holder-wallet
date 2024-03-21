import React from "react";
import { render } from "@testing-library/react-native";

import OnBoarding from ".";
import { TEST_LABELS } from "./constants/testLabels";

describe("<OnBoarding />", () => {
  it("renders correctly", () => {
    const navigation = { navigate: jest.fn() };
    const { getByLabelText } = render(<OnBoarding navigation={navigation} />);
    const backgroundImageComponent = getByLabelText(
      TEST_LABELS.BACKGROUND_IMAGE
    );
    expect(backgroundImageComponent).toBeDefined();
  });
});
