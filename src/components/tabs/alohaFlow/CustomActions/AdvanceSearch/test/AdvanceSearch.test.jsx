import {
  act,
  fireEvent,
  render,
  initialTestState
} from "testUtils";
import { AdvanceSearchModal } from "../AdvanceSearch";
import React from "react";


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
const mockSelectionAll = {
  brand: "brand1",
  callFlowRoute: "route1",
  callFlowTemplate: "template1",
  callerType: "callerType1",
  channel: "channel1",
  pkey: "pkey1"
};

const renderComponent = () => render(
  <AdvanceSearchModal isOpen = {true} onClose = {mockClose} handleChange = {mockChange} applyFilter = {mockApplyFilter} masterData = {mockMasterData} selection = {  mockSelectionAll}/>, initialTestState
);

jest.mock("@mui/material/Button", () => ({
  Button: jest.fn()
}));

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

  test("should render as expected", () => {
    const {
      getByRole
    } = renderComponent();
    const addDataRequestButton = getByRole("button", {
      name: "Cancel"
    });
    act(() => {
      fireEvent.click(addDataRequestButton);
    });
    expect(mockClose).toBeCalledTimes(1);

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