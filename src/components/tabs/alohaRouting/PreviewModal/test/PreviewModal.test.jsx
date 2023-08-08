import {
  act,
  fireEvent,
  initialTestState,
  render,
  setupMockedComponents
} from "testUtils";
import {
  PreviewModal
} from "..";
import React from "react";
import { ROUTING_CACHE_MASTER_DATA } from "utils";
import {
  StyledButton
} from "components";

const onCloseMock = jest.fn();
const onCreateMock = jest.fn();
const onDeleteMock = jest.fn().mockResolvedValue(undefined);
const onUpdateMock = jest.fn();
const onDeleteMockBad = jest.fn().mockImplementation(() => {
  throw new Error("failed");
});

jest.mock("components", ()=>({
  __esModule: true,
  StyledButton: jest.fn()
}));

const testRows = [{
  id: 1234,
  all: "All",
  brand: "Liberty Mutual",
  callIntent: "Service",
  callerState: "MA",
  callerType: "Customer",
  channel: "Service",
  dayOfWeek: "M",
  endTime: "11:21 PM",
  percentOfCallers: "100",
  pkey: "service",
  policyType: "x",
  skey: "libertymutual__service_1234",
  startTime: "12:00 AM",
  transferDestination: "1234567",
  transferMessage: "Please hold",
  twilioSkill: "crcXxYy",
  crcSkill: "XyXy",
  priority: "1"
},{
  id: 1235,
  all: "All",
  brand: "Liberty Mutual",
  callIntent: "Service",
  callerState: "ALL",
  callerType: "Customer",
  channel: "Service",
  dayOfWeek: "M",
  endTime: "11:59 PM",
  percentOfCallers: "100",
  pkey: "service",
  policyType: "x",
  skey: "libertymutual__service_1235",
  startTime: "12:00 AM",
  transferDestination: "hangup",
  transferMessage: "Sorry, we're closed right now.",
  twilioSkill: "crcXxYy",
  crcSkill: "XyXy",
  priority: "1"
}];
const routingDropDownData = {
  brand: ["Liberty Mutual", "Safeco"],
  channel: ["Sales", "Service"],
  dayOfWeek: ["MONDAY","TUESDAY","WEDNESDAY"],
  language: ["ENGLISH", "SPANISH"],
  policyType: ["PTYPE1", "PTYPE2"],
  priority: ["1","2","3"]
};

localStorage.setItem(ROUTING_CACHE_MASTER_DATA, JSON.stringify(routingDropDownData));
const renderComponent = (action, deleteMock) => {
  return render (<PreviewModal
    action={action}
    isOpen={true}
    onClose={onCloseMock}
    onCreate={onCreateMock}
    onDelete={deleteMock}
    onUpdate={onUpdateMock}
    rows={testRows}
  />, initialTestState);
};

describe("<PreviewModal />", () => {
  const matchMedia = window.matchMedia;
  beforeEach(()=>{
    jest.clearAllMocks();
    setupMockedComponents({
      StyledButton
    });
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // Deprecated
        removeListener: jest.fn(), // Deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn()
      }))
    });
  });
  afterEach(()=>{
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: matchMedia
    });
  });
  test("render Delete preview - cancel", () => {
    renderComponent("delete", onDeleteMock);
    const calls = StyledButton.mock.calls;
    expect(calls[0][0].children).toBe("Delete");
    expect(calls[1][0].children).toBe("Cancel");
    act(() => calls[1][0].onClick());
    expect(onDeleteMock).toBeCalledTimes(0);
    expect(onCloseMock).toBeCalledTimes(1);
  });
  test("render Delete preview - delete success", () => {
    renderComponent("delete", onDeleteMock);
    const calls = StyledButton.mock.calls;
    act(async () => calls[0][0].onClick());
    expect(onDeleteMock).toBeCalledTimes(1);
  });
  test("render Delete preview - delete failure", () => {
    renderComponent("delete", onDeleteMockBad);
    const calls = StyledButton.mock.calls;
    act(async () => calls[0][0].onClick());
    expect(onDeleteMockBad).toBeCalledTimes(1);
    expect(onCloseMock).toBeCalledTimes(0);
  });
  test("render Update preview", () => {
    renderComponent("edit", onDeleteMock);
    const calls = StyledButton.mock.calls;
    expect(calls[0][0].children).toBe("Update");
    expect(calls[1][0].children).toBe("Cancel");
    act(() => calls[0][0].onClick());
    expect(onUpdateMock).toBeCalledTimes(1);
  });
  test("render Add preview", () => {
    const rendered = renderComponent("add", onDeleteMock);
    const calls = StyledButton.mock.calls;
    expect(calls[0][0].children).toBe("Save");
    expect(calls[1][0].children).toBe("Cancel");
    act(() => calls[0][0].onClick());
    expect(onCreateMock).toBeCalledTimes(1);
    fireEvent.click(rendered.getByText("Close"));
    expect(onCloseMock).toBeCalledTimes(1);
  });
  // describe("TableGridColumnDev", () => {

  // });
});
