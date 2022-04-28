import MessageSidebar from "../MessageSidebar";
import React from "react";
import {
  fireEvent, render
} from "testUtils";

const mockSetMessageState = jest.fn();

const initialMockedBlSalesState = {
  fetching: false,
  flashMessage: "",
  skill: "blSalesL1",
  readOnly: false,
  workerProfileId: 3
};

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

const initialMockedBSCState = {
  fetching: false,
  flashMessage: "",
  skill: "bscCbs",
  readOnly: false,
  workerProfileId: 10
};

const renderComponent = messageState => {
  return render(<MessageSidebar
    messageState={messageState}
    setMessageState={mockSetMessageState} />);
};

describe("<MessageSidebar />", () => {
  beforeEach(() => mockSetMessageState.mockClear());
  test("the MessageSidebar should render a radio group for AISG.", () => {
    const rendered = renderComponent(initialMockedAisgState);
    expect(rendered.findAllByLabelText("aisgL1")).toBeTruthy();
    expect(rendered.queryByLabelText("csoPortal")).toBeNull();
  });
  test("clicking a AISG radio button should change the skill and fetching to true.", () => {
    const rendered = renderComponent(initialMockedAisgState);
    fireEvent.click(rendered.getByLabelText("aisgConsumer"));
    expect(mockSetMessageState).toHaveBeenCalledTimes(1);
    expect(mockSetMessageState).toHaveBeenCalledWith({
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
    expect(mockSetMessageState).toHaveBeenCalledTimes(1);
    expect(mockSetMessageState).toHaveBeenCalledWith({
      ...initialMockedCsoState,
      skill: "csoPortal",
      fetching: true
    });
  });
  test("the MessageSidebar should render a radio group for BL Sales.", () => {
    const rendered = renderComponent(initialMockedBlSalesState);
    expect(rendered.findAllByLabelText("blSalesL1")).toBeTruthy();
    expect(rendered.queryByLabelText("aisgL1")).toBeNull();
  });
  test("clicking a BL Sales radio button should change the skill and fetching to true.", () => {
    const rendered = renderComponent(initialMockedBlSalesState);
    fireEvent.click(rendered.getByLabelText("blSalesAmazonQuote"));
    expect(mockSetMessageState).toHaveBeenCalledTimes(1);
    expect(mockSetMessageState).toHaveBeenCalledWith({
      ...initialMockedBlSalesState,
      skill: "blSalesAmazonQuote",
      fetching: true
    });
  });
  test("the MessageSidebar should render a radio group for BSC.", () => {
    const rendered = renderComponent(initialMockedBSCState);
    expect(rendered.findAllByLabelText("bscCbs")).toBeTruthy();
    expect(rendered.queryByLabelText("aisgL1")).toBeNull();
  });
  test("clicking a BSC radio button should change the skill and fetching to true.", () => {
    const rendered = renderComponent(initialMockedBSCState);
    fireEvent.click(rendered.getByLabelText("bscCommissions"));
    expect(mockSetMessageState).toHaveBeenCalledTimes(1);
    expect(mockSetMessageState).toHaveBeenCalledWith({
      ...initialMockedBSCState,
      skill: "bscCommissions",
      fetching: true
    });
  });
});