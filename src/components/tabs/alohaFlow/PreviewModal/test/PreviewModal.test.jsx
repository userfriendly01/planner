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
import { FLOW_MASTER_DATA } from "utils";
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

const createFlowDataList = numberOfData =>{
  const dataList = [];
  for (let num=1; num<=numberOfData; num++) {
    const flowData = {
      id: num,
      pkey: `+18005551212x${num}`,
      brand: `brand${num}`,
      callFlowTemplate: `cft${num}`,
      channel: `channel${num}`,
      content: {
        callerType: "Customer",
        callFlowRoute: `route A${num}`,
        dataRequests: ["Classify"],
        greetingMessages: "Hello and welcome!",
        transferDestination: `+12223334444x${num}`
      },
      createTime: "2020-01-01T15:14:13.${num}Z",
      dialedDescription: `Test case ${num}`,
      employeeId: `n${num}`,
      userDestination: "Avaya"

    };
    dataList.push(flowData);
  }
  return dataList;
};
const flowDropDownData = {
  brand: ["Liberty Mutual", "Safeco"],
  channel: ["Sales", "Service"],
  languageOffer: ["ENGLISH", "SPANISH"],
  userDestination: ["TEST_DEST_1","TEST_DEST_2"],
  callFlowRoute: ["CFR1","CFR2","CFR3"],
  callerType: ["CT1","CT2","CT3"],
  dataRequests: ["DR1","DR2","DR3"],
  type: ["DID", "DRC", "CRC"]
};

localStorage.setItem(FLOW_MASTER_DATA, JSON.stringify(flowDropDownData));
const renderComponent = (action, deleteMock) => {
  return render (<PreviewModal
    action={action}
    isOpen={true}
    onClose={onCloseMock}
    onCreate={onCreateMock}
    onDelete={deleteMock}
    onUpdate={onUpdateMock}
    rows={createFlowDataList(12)}
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
    expect(calls[4][0].children).toBe("Update");
    expect(calls[5][0].children).toBe("Cancel");
    act(() => calls[4][0].onClick());
    expect(onUpdateMock).toBeCalledTimes(1);
  });
  test("render Add preview", () => {
    const rendered = renderComponent("add", onDeleteMock);
    const calls = StyledButton.mock.calls;
    expect(calls[2][0].children).toBe("Save");
    expect(calls[3][0].children).toBe("Cancel");
    act(() => calls[6][0].onClick());
    expect(onCreateMock).toBeCalledTimes(1);
    fireEvent.click(rendered.getByText("Close"));
    expect(onCloseMock).toBeCalledTimes(1);
  });
  test("Add new +", () => {
    renderComponent("add", onDeleteMock);
    const calls = StyledButton.mock.calls;
    act(() => calls[4][0].onClick());
    const calls2 = StyledButton.mock.calls;
    expect(calls2.length).toBe(12);
  });
  // test("Upload CSV File", () => {
  //   renderComponent("add", onDeleteMock);
  //   const onChange = StyledButton.mock.calls[5][0].children[0].props.onChange;
  //   act(() => onChange());
  //   const calls2 = StyledButton.mock.calls;
  //   expect(calls2.length).toBe(12);
  // });
});
