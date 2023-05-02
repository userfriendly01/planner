import React from "react";
import { AddRouting } from "../../index";
import {
  fireEvent, render, initialTestState, act, setupMockedComponents, waitFor
} from "testUtils";
import {
  CustomToast, ComponentControl
} from "components";
import {
  ROUTING_CACHE_MASTER_DATA, dayOfWeek
} from "utils";
import {
  retrieveRoutingData, addRoutingRule
} from "services";
import {
  useAdminState
} from "context";
const validRoutingData = {
  id: 1,
  all: "test",
  brand: "Liberty",
  callIntent: "test",
  callerState: "test",
  callerType: "test",
  channel: "test",
  dayOfWeek: "Monday",
  endTime: "2022-02-20",
  percentOfCallers: "100",
  pkey: "+12353245",
  policyType: "Liberty",
  skey: "liberty_test_test",
  startTime: "2022-02-20",
  transferDestination: "Twilo",
  transferMessage: "HOLD ON while we transfer the call",
  twilioSkill: "test",
  crcSkill: "updated"
};

const openModal = jest.fn();

jest.mock("@mui/x-date-pickers/TimePicker", () => ({
  TimePicker: jest.fn()
}));

jest.mock("components", () => {
  return{
    __esModule: true,
    CustomToast: jest.fn(),
    ComponentControl: jest.fn()
  };
});

jest.mock("context", () => ({
  useAdminState: jest.fn()
}));

const mockMasterData = {
  brand: ["Test Brand"],
  channel: ["Test1 Channel", "Test2 Channel"]
};

const renderAddRouting = isOpen => {
  return render(
    <AddRouting openModal={openModal} newId={1} isOpen={isOpen} />
  );
};

const renderAddRoutingDefOpen =() => {
  return render(
    <AddRouting openModal={openModal} newId={1} />
  );
};
describe("<AddRouting/>",()=>{

  beforeEach(() => {
    jest.clearAllMocks();
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
    Object.defineProperty(window.Element.prototype, "innerText", {
      set(value) {
        this.textContent = value;
      },
      configurable: true
    });
    useAdminState.mockReturnValue(initialTestState);
    setupMockedComponents({
      CustomToast,
      ComponentControl
    });
    localStorage.setItem(ROUTING_CACHE_MASTER_DATA, JSON.stringify(mockMasterData));
  });
  afterEach(() => {
    localStorage.removeItem(ROUTING_CACHE_MASTER_DATA);
  });
  describe("AddRouting ModalBlock",()=>{
    test("Simulate Close Modal By Clicking Close Icon",()=>{
      const { getByRole } = renderAddRouting(true);
      const closeModalButton = getByRole("img", { name: "Close" });
      act(()=>{
        fireEvent.click(closeModalButton);
      });
      expect(openModal).toBeCalledTimes(1);
    });
    test("pass open modal as false ",()=>{
      renderAddRoutingDefOpen( validRoutingData);
      expect(openModal).toBeCalledTimes(0);
    });
    test("Simulate Close Modal By removing masterData",()=>{
      localStorage.removeItem(ROUTING_CACHE_MASTER_DATA);
      retrieveRoutingData.mockResolvedValue({ data: { "items": validRoutingData }});
      const { getByRole } = renderAddRouting(true);
      const closeModalButton = getByRole("img", { name: "Close" });
      act(()=>{
        fireEvent.click(closeModalButton);
      });
      expect(openModal).toBeCalledTimes(1);
    });
  });
  describe("OnChange of Fields",()=>{
    test("handle create rule button",()=>{
      const {
        getByRole, getByLabelText
      } = renderAddRouting(true);
      addRoutingRule.mockResolvedValue({ data: { "items": []}});
      const saveButton = getByRole("button", { name: "createRuleButton" });
      act(() => {
        fireEvent.click(saveButton);
      });
      waitFor(() => {
        expect(openModal).toBeCalledTimes(1);
      });
      const closeToastIcon = getByLabelText(/Close/i,{ hidden: true });
      fireEvent.click(closeToastIcon);
    });
    test("Validate Fields",()=>{
      const {
        getByRole
      } = renderAddRouting(true);
      const ComponentControlMock= ComponentControl.mock;
      const idAttr = ComponentControl.mock.calls[0][0].onChange;
      const channelAttr = ComponentControl.mock.calls[7][0].onChange;
      const brandAttr = ComponentControl.mock.calls[3][0].onChange;
      const callerTypeAttr = ComponentControl.mock.calls[5][0].onChange;
      const callerIntentAttr =  ComponentControl.mock.calls[6][0].onChange;
      const callerStateAttr = ComponentControl.mock.calls[4][0].onChange;
      const dayOfWeekAttr = ComponentControl.mock.calls[8][0].onChange;
      const startTimeAttr = ComponentControl.mock.calls[12][0].onChange;
      const endTimeAttr = ComponentControl.mock.calls[13][0].onChange;
      const policyTypeAttr = ComponentControl.mock.calls[15][0].onChange;
      const percentAttr = ComponentControl.mock.calls[11][0].onChange;
      const channelOnChange = { target: { value: "Test1 Channel" }};
      const brandOnChange = { target: { value: "Test Brand" }};
      const commonOnChange = { target: { value: "Test" }};
      const dayOfWeekOnChange = { target: { value: dayOfWeek }};
      const timeOnChange= {
        $d: "Fri Jan 06 2023 06:24:00 GMT+0530 (India Standard Time)"
      };
      const idOnChange = { target: { value: 1234 }};
      act(()=>{
        channelAttr(channelOnChange, "channel", false);
        brandAttr(brandOnChange, "brand", false);
        callerTypeAttr(commonOnChange, "callerType", false);
        callerIntentAttr(commonOnChange, "callerIntent", false);
        dayOfWeekAttr(dayOfWeekOnChange, "dayOfWeek", false);
        startTimeAttr(timeOnChange, "startTime", false);
        percentAttr(commonOnChange, "percentOfCallers",false);
        callerStateAttr(commonOnChange,"callerState",false);
        endTimeAttr(timeOnChange, "endTime",false);
        policyTypeAttr(commonOnChange,"policyType",false);
        idAttr(idOnChange,"id",false);
      });
      addRoutingRule.mockResolvedValue({ data: { "items": []}});
      const saveButton = getByRole("button", { name: "createRuleButton" });
      act(() => {
        fireEvent.click(saveButton);
      });
      addRoutingRule.mockResolvedValue({ errors: "Error" });
      const saveButtonError = getByRole("button", { name: "createRuleButton" });
      act(() => {
        fireEvent.click(saveButtonError);
      });
      waitFor(() => {
        expect(ComponentControlMock).toBeTruthy();
      });
    });
    test("Validate create Rule without mandatory fields ",()=>{
      const { getByRole } = renderAddRouting(true);
      const saveButton = getByRole("button", { name: "createRuleButton" });
      act(() => {
        fireEvent.click(saveButton);
      });
      waitFor(() => {
        expect(openModal).toBeCalledTimes(0);
      });
    });
    test("Validate Reset Flow Rule ",()=>{
      const { getByRole } = renderAddRouting(true);
      const resetButton = getByRole("button", { name: "resetRuleButton" });
      act(() => {
        fireEvent.click(resetButton);
      });
      waitFor(() => {
        expect(openModal).toBeCalledTimes(0);
      });
    });
    test("Simulate the disable edit option", () => {
      renderAddRouting(true, validRoutingData);
      const pkeyAttr = ComponentControl.mock.calls[1][0].onChange;
      const commonOnChange = { target: { value: "Test" }};
      act(()=>{
        pkeyAttr(commonOnChange);
      });
      expect(openModal).toBeCalledTimes(0);
    });
  });
  describe("Test for CustomToast Change",()=>{
    test("Simulate the customToast Button ", () => {
      renderAddRouting(true);
      const customToastButton = CustomToast.mock.calls[0][0].onClose;
      act(()=>{
        customToastButton();
      });
      expect(openModal).toBeCalledTimes(0);
    });
  });
});