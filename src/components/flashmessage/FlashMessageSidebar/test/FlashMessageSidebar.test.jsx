import FlashMessageSidebar from "../FlashMessageSidebar";
import React from "react";
import { render } from "testUtils";

const mockSetFMState = jest.fn();

const initialMockedFMState = {
  fetching: false,
  flashMessage: "",
  skill: "aisgL1",
  readOnly: false
};

const renderComponent = flashMessageState => {
  return render(<FlashMessageSidebar
    flashMessageState={flashMessageState}
    setFlashMessageState={mockSetFMState} />);
};

describe("<FlashMessageSidebar />", () => {
  beforeEach(() => mockSetFMState.mockClear());
  test("the FlashMessageSidebar should render a radio group.", () => {
    const rendered = renderComponent(initialMockedFMState);
    expect(rendered.findAllByLabelText("aisgL1")).toBeTruthy();
  });
});