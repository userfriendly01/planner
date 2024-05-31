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
import {
  StyledButton
} from "components";
import { createFlowDataItem } from "./PreviewUtil.test";

const onCloseMock = jest.fn();
const onCreateMock = jest.fn();
const onDeleteMock = jest.fn().mockResolvedValue(undefined);
const onDeleteMockBad = jest.fn().mockImplementation(() => {
  throw new Error("failed");
});
const onCreateMockBad = jest.fn().mockImplementation(() => {
  throw new Error("failed");
});

jest.mock("components", ()=>({
  __esModule: true,
  StyledButton: jest.fn()
}));

const createFlowDataList = numberOfData =>{
  const dataList = [];
  for (let num=1; num<=numberOfData; num++) {

    dataList.push(createFlowDataItem(num));
  }
  return dataList;
};
const renderComponent = (action, deleteMock) => {
  return render (<PreviewModal
    action={action}
    isOpen={true}
    onClose={onCloseMock}
    onCreate={onCreateMock}
    onDelete={deleteMock}
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
  test("render Add preview - create failure", () => {
    renderComponent("add", onCreateMockBad);
    act(async () => StyledButton.mock.calls[2][0].onClick());
    expect(onCreateMockBad).toBeCalledTimes(1);
    expect(onCloseMock).toBeCalledTimes(0);
  });
  test("render Add preview", () => {
    const rendered = renderComponent("add", onCreateMock);
    const calls = StyledButton.mock.calls;
    expect(calls[2][0].children).toBe("Save");
    expect(calls[3][0].children).toBe("Cancel");
    act(() => calls[6][0].onClick());
    expect(onCreateMock).toBeCalledTimes(1);
    fireEvent.click(rendered.getByText("Close"));
    expect(onCloseMock).toBeCalledTimes(1);
  });
  test("Add new +", () => {
    renderComponent("add", onCreateMock);
    const calls = StyledButton.mock.calls;
    act(() => calls[4][0].onClick());
    const calls2 = StyledButton.mock.calls;
    expect(calls2.length).toBe(12);
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

});
