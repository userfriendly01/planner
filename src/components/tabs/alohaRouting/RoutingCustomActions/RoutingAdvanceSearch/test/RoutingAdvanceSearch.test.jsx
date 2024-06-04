import {
  act,
  fireEvent,
  render,
  initialTestState
} from "testUtils";
import RoutingAdvanceSearch from "../RoutingAdvanceSearch";
import React from "react";
import SelectContainer from "components/SelectContainer";
import Autocomplete from "@mui/material/Autocomplete";
import { useAdminState } from "context/appContext";

const mockChange = jest.fn();
const mockApplyFilter = jest.fn();
const mockOpenModal = jest.fn();
const mockMasterData = {
  channel: ["channel1", "channel2"],
  brand: ["brand1"],
  callerType: ["callerType1", "callerType2", "callerType3"],
  callerState: ["callerState1", "callerState2", "callerState3"],
  callIntent: ["callIntent1", "callIntent2", "callIntent3"],
  policyType: ["policyType1", "policyType2", "policyType3"],
  transferDestination: ["transferDestination1", "transferDestination2", "transferDestination3"],
  twilioSkill: ["twilioSkill1", "twilioSkill2", "twilioSkill3"]
};
const mockSelectionAll = {
  channel: "channel1",
  brand: "brand1",
  callerType: "callerType1",
  callerState: "callerState1",
  policyType: "policyType1",
  transferDestination: "transferDestination1",
  twilioSkill: "twilioSkill1"
};

jest.mock("context/appContext", () => ({
  useAdminState: jest.fn()
}));

const renderComponent = (isOpen, callIntent = "callIntent1") => render(
  <RoutingAdvanceSearch
    applyFilter={mockApplyFilter}
    handleChange={mockChange}
    isOpen={isOpen}
    masterData={mockMasterData}
    openModal={mockOpenModal}
    selection={{
      ...mockSelectionAll,
      callIntent
    }}
  />
);

Storage.prototype.setItem = jest.fn();
Storage.prototype.removeItem = jest.fn();

jest.mock("components/SelectContainer", () => {
  const originalModule = jest.requireActual("components/SelectContainer");

  return {
    __esModule: true,
    ...originalModule,
    default: jest.fn()
  };
});

const mockRender = jest.fn();
const mockGetOptionLabel = jest.fn();

jest.mock("@mui/material/Autocomplete", () => {
  const originalModule = jest.requireActual("@mui/material/Autocomplete");

  return {
    __esModule: true,
    ...originalModule,
    default: jest.fn(),
    getOptionLabel: mockGetOptionLabel,
    renderInput: mockRender
  };
});

describe("<RoutingAdvanceSearch />", () => {
  beforeAll(() => {
    useAdminState.mockReturnValue(initialTestState);
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
    renderComponent(true);
    expect(SelectContainer).toBeCalledTimes(6);
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
      "dropDownOptions": ["callerType1", "callerType2", "callerType3"],
      "error": false,
      "isBlankFirstValue": true,
      "label": "Choose Caller Type",
      "name": "callerType",
      "onChange": mockChange,
      "required": false,
      "value": "callerType1"
    });
    expect(SelectContainer.mock.calls[3][0]).toStrictEqual({
      "disabled": false,
      "dropDownOptions": ["callerState1", "callerState2", "callerState3"],
      "error": false,
      "isBlankFirstValue": true,
      "label": "Choose Caller State",
      "name": "callerState",
      "onChange": mockChange,
      "required": false,
      "value": "callerState1"
    });
    expect(SelectContainer.mock.calls[4][0]).toStrictEqual({
      "disabled": false,
      "dropDownOptions": ["transferDestination1", "transferDestination2", "transferDestination3"],
      "error": false,
      "isBlankFirstValue": true,
      "label": "Choose Transfer Destination",
      "name": "transferDestination",
      "onChange": mockChange,
      "required": false,
      "value": "transferDestination1"
    });
    expect(SelectContainer.mock.calls[5][0]).toStrictEqual({
      "disabled": false,
      "dropDownOptions": ["twilioSkill1", "twilioSkill2", "twilioSkill3"],
      "error": false,
      "isBlankFirstValue": true,
      "label": "Choose Twilio Skill",
      "name": "twilioSkill",
      "onChange": mockChange,
      "required": false,
      "value": "twilioSkill1"
    });

    expect(Autocomplete.mock.calls[0][0]).toEqual(expect.objectContaining({
      "id": "callIntent-autocomplete",
      "options": [
        "callIntent1",
        "callIntent2",
        "callIntent3"
      ],
      "value": "callIntent1"
    }));
  });
  it("changes AutoComplete text", () => {
    renderComponent(true);
    const textOnChangeAttr = Autocomplete.mock.calls[0][0].onChange;
    const textOnChangeEvent = { target: { value: "callIntent2" }};

    act(()=>{
      textOnChangeAttr(textOnChangeEvent);
    });

    expect(mockChange).toBeCalledTimes(1);
  });
  it("calls renderInput", () => {
    renderComponent(true);
    const renderAttr = Autocomplete.mock.calls[0][0].renderInput;
    const renderParams = { color: "blue" };

    act(()=>{
      renderAttr(renderParams);
    });
    expect(renderAttr).toBeTruthy();
  });
  it("calls getOptionLabel", () => {
    renderComponent(true, "");
    const attr = Autocomplete.mock.calls[0][0].getOptionLabel;
    const params = "test";

    act(()=>{
      attr(params);
    });

    act(()=>{
      attr(undefined);
    });
    expect(attr).toBeTruthy();
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
    expect(mockApplyFilter).toBeCalledTimes(1);
    expect(localStorage.removeItem).toBeCalledTimes(1);
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
    expect(mockApplyFilter).toBeCalledTimes(1);
    expect(localStorage.setItem).toBeCalledTimes(1);
  });
  it("<Button>Close</Button>", () => {
    const {
      getByRole
    } = renderComponent(true);
    const buttonToClick = getByRole("button", {
      name: "Close"
    });
    act(() => {
      fireEvent.click(buttonToClick);
    });
    expect(mockOpenModal).toBeCalledTimes(1);
  });

});