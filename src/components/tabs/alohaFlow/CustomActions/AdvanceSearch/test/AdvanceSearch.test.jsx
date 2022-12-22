import {
  act,
  fireEvent,
  render,
  initialTestState
} from "testUtils";
import { AdvanceSearchModal } from "../../index";
import React from "react";
import SelectContainer from "../../../../../core/SharedComponents/SelectContainer";

const mockMasterData = {
  brand: ["brand1"],
  callFlowRoute: ["route1", "route2"],
  callFlowTemplate: ["template1", "template2"],
  callerType: ["callerType1", "callerType2", "callerType3"],
  channel: ["channel1", "channel2"],
  pkey: ["pkey1", "pkey2", "pkey3", "pkey4", "pkey5"]
};
const mockChange = jest.fn();
const mockClose = jest.fn();
const mockApplyFilter = jest.fn();
const mockOpenModal = jest.fn();
const mockSelectionAll = {
  brand: "brand1",
  callFlowRoute: "route1",
  callFlowTemplate: "template1",
  callerType: "callerType1",
  channel: "channel1",
  pkey: "pkey1"
};
const renderComponent = isOpen => render(
  <AdvanceSearchModal
    isOpen={isOpen}
    onClose={mockClose}
    handleChange={mockChange}
    applyFilter={mockApplyFilter}
    masterData={mockMasterData}
    openModal={mockOpenModal}
    selection={mockSelectionAll}/>,
  initialTestState
);
Storage.prototype.setItem = jest.fn();
Storage.prototype.removeItem = jest.fn();

jest.mock("../../../../../core/SharedComponents/SelectContainer", () => {
  const originalModule = jest.requireActual("../../../../../core/SharedComponents/SelectContainer");

  return {
    __esModule: true,
    ...originalModule,
    default: jest.fn()
  };
});

describe("<AdvanceSearch />", () => {
  beforeAll(() => {
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

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders", () => {
  });
  it("<Button>Reset Filter</Button>", () => {
    const {
      getByRole
    } = renderComponent(true);
    const buttonToClick = getByRole("button", {
      name: "Reset Filter"
    });
    act(() => {
      fireEvent.click(buttonToClick);
    });
    expect(mockOpenModal).toBeCalledTimes(1);
    expect(mockApplyFilter).toBeCalledTimes(1);
    expect(localStorage.removeItem).toBeCalledTimes(1);
    expect(SelectContainer).toBeCalledTimes(4);
    expect(SelectContainer.mock.calls[0][0]).toStrictEqual({
      "disabled": false,
      "dropDownOptions": ["brand1"],
      "error": false,
      "isBlankFirstValue": true,
      "label": "Choose Brand",
      "name": "brand",
      "onChange": mockChange,
      "required": false,
      "value": "brand1"
    });
    expect(SelectContainer.mock.calls[1][0]).toStrictEqual({
      "disabled": false,
      "dropDownOptions": ["channel1","channel2"],
      "error": false,
      "isBlankFirstValue": true,
      "label": "Choose Channel",
      "name": "channel",
      "onChange": mockChange,
      "required": false,
      "value": "channel1"
    });
    expect(SelectContainer.mock.calls[2][0]).toStrictEqual({
      "disabled": false,
      "dropDownOptions": ["template1", "template2"],
      "error": false,
      "isBlankFirstValue": true,
      "label": "Choose Call Flow Template",
      "name": "callFlowTemplate",
      "onChange": mockChange,
      "required": false,
      "value": "template1"
    });
    expect(SelectContainer.mock.calls[3][0]).toStrictEqual({
      "disabled": false,
      "dropDownOptions": ["route1", "route2"],
      "error": false,
      "isBlankFirstValue": true,
      "label": "Choose Call Flow Route",
      "name": "callFlowRoute",
      "onChange": mockChange,
      "required": false,
      "value": "route1"
    });

  });
  it("<Button>Save Filter</Button>", () => {
    const {
      getByRole
    } = renderComponent(true);
    const buttonToClick = getByRole("button", {
      name: "Save Filter"
    });
    act(() => {
      fireEvent.click(buttonToClick);
    });
    expect(mockOpenModal).toBeCalledTimes(1);
    expect(mockApplyFilter).toBeCalledTimes(1);
    expect(localStorage.setItem).toBeCalledTimes(1);
  });

  /** If you do mock the SelectContainer, this should get you started...
           *  dropDownOptions: mockMasterData.brand,
              name: "brand",
              label: "Choose Brand",
              value: mockSelectionAll.brand,
              onChange: mockChange,
              disabled: false,
              error: false,
              isBlankFirstValue: true,
              required: false
           */
});