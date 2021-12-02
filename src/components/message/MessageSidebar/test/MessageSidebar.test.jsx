import MessageSidebar from "../MessageSidebar";
import React from "react";
import {
  fireEvent, render
} from "testUtils";

const mockSetFMState = jest.fn();

const initialMockedAisgState = {
  fetching: false,
  flashMessage: "",
  skill: "aisgL1",
  readOnly: false,
  workerProfileId: 4
};

const initialMockedCsoState = {
  fetching: false,
  flashMessage: "",
  skill: "csoBilling",
  readOnly: false,
  workerProfileId: 7
};

const renderComponent = flashMessageState => {
  return render(<MessageSidebar
    flashMessageState={flashMessageState}
    setFlashMessageState={mockSetFMState} />);
};

describe("<MessageSidebar />", () => {
  beforeEach(() => mockSetFMState.mockClear());
  test("the MessageSidebar should render a radio group for AISG.", () => {
    const rendered = renderComponent(initialMockedAisgState);
    expect(rendered.findAllByLabelText("aisgL1")).toBeTruthy();
    expect(rendered.queryByLabelText("csoPortal")).toBeNull();
  });
  test("clicking a AISG radio button should change the skill and fetching to true.", () => {
    const rendered = renderComponent(initialMockedAisgState);
    fireEvent.click(rendered.getByLabelText("aisgConsumer"));
    expect(mockSetFMState).toHaveBeenCalledTimes(1);
    expect(mockSetFMState).toHaveBeenCalledWith({
      ...initialMockedAisgState,
      skill: "aisgConsumer",
      fetching: true
    });
  });
  test("the MessageSidebar should render a radio group for CSO.", () => {
    const rendered = renderComponent(initialMockedCsoState);
    expect(rendered.findAllByLabelText("csoBilling")).toBeTruthy();
    expect(rendered.queryByLabelText("aisgL1")).toBeNull();
  });
  test("clicking a CSO radio button should change the skill and fetching to true.", () => {
    const rendered = renderComponent(initialMockedCsoState);
    fireEvent.click(rendered.getByLabelText("csoPortal"));
    expect(mockSetFMState).toHaveBeenCalledTimes(1);
    expect(mockSetFMState).toHaveBeenCalledWith({
      ...initialMockedCsoState,
      skill: "csoPortal",
      fetching: true
    });
  });
});