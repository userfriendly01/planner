import React from "react";
import { AddFlow } from "../../index";
import { FLOW_MASTER_DATA } from "utils";
import {
  fireEvent, render, initialTestState, act, waitFor, setupMockedComponents
} from "testUtils";
import {
  addFlowRule, retrieveFlowData
} from "services";
import {
  Grid, Button
} from "@mui/material";
import {
  CustomToast, ComponentControl
} from "components";

const validFlowData = {
  id: 1,
  pkey: "12345",
  agentId: "123455",
  brand: "LM",
  callFlowTemplate: "temp",
  channel: "Test1 Channel",
  createTime: "2022-24-08",
  dialedDescription: "test",
  employeeId: "n1234567",
  userDestination: "dest",
  content: {
    callerType: "test",
    callFlowRoute: "test",
    dataRequests: ["test1", "test2"],
    greetingMessages: "Hello Test Message",
    languageOffer: "English",
    transferNumber: "123456789"
  },
  DRC: {
    accountManager: "test",
    affinityVDN: "test",
    campaignType: "test",
    internetPlacement: "test",
    internetType: "test",
    keycode: "test",
    lineOfBusiness: "test",
    marketingChannel: "test",
    requestID: "test",
    transferCode: "test",
    whisper: "test"
  }
};


const mockMasterData = {
  brand: ["Test Brand", "Testing Brand2"],
  channel: ["Test1 Channel", "Test2 Channel"],
  userDestination: ["Twilio", "Avaya"]
};

jest.mock("@mui/material", () => ({
  __esModule: true,
  Grid: jest.fn(),
  Button: jest.fn()
}));

jest.mock("@mui/x-date-pickers/TimePicker", () => ({
  __esModule: true,
  TimePicker: jest.fn()
}));

jest.mock("components", () => {
  return{
    __esModule: true,
    CustomToast: jest.fn(),
    ComponentControl: jest.fn()
  };
});

const openAddModal = jest.fn();

const renderAddFlow = isOpen => {
  return render(
    <AddFlow openAddModal={openAddModal} newID={1} isOpen={isOpen} />, initialTestState
  );
};

const renderAddFlowDefaultOpen = () => {
  return render(
    <AddFlow openAddModal={openAddModal} newID={1} />, initialTestState
  );
};

describe("<AddFlow />", () => {

  beforeEach(() => {
    jest.clearAllMocks();
    Object.defineProperty(window.document, "cookie", {
      writable: true,
      value: "PA.ciciccttritondev1=1234.5678.uytghh"
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
    setupMockedComponents({
      Grid,
      Button,
      ComponentControl,
      CustomToast
    });
    localStorage.setItem(FLOW_MASTER_DATA, JSON.stringify(mockMasterData));
  });
  // Cleanup mock
  afterEach(() => {
    localStorage.removeItem(FLOW_MASTER_DATA);
  });
  describe("AddFlow ModalBlock",()=>{
    test("Simulate Close Modal By Clicking Close Icon",()=>{
      const { getByRole } = renderAddFlow(true, validFlowData);
      const closeModalButton = getByRole("img", { name: "Close" });
      act(()=>{
        fireEvent.click(closeModalButton);
      });
      expect(openAddModal).toBeCalledTimes(1);
    });
    test("pass open modal as false ",()=>{
      renderAddFlowDefaultOpen(false, validFlowData);
      expect(openAddModal).toBeCalledTimes(0);
    });
    test("Simulate Close Modal By removing masterData",()=>{
      localStorage.removeItem(FLOW_MASTER_DATA);
      retrieveFlowData.mockResolvedValue({ data: { "items": validFlowData }});
      const { getByRole } = renderAddFlow(true, validFlowData);
      const closeModalButton = getByRole("img", { name: "Close" });
      act(()=>{
        fireEvent.click(closeModalButton);
      });
      expect(openAddModal).toBeCalledTimes(1);
    });
    test("Simulate the Input Change ", () => {
      renderAddFlow(true, validFlowData);
      const eventOnChange={
        target: {
          name: "pkey",
          value: "8789755678"
        }
      };
      const addFlowPagePolicyTypeAttr= ComponentControl.mock.calls[0][0];
      const addFlowPageAttrChange= ComponentControl.mock.calls[0][0].onChange;
      act(()=>{
        addFlowPageAttrChange(eventOnChange);
      });
      expect(addFlowPagePolicyTypeAttr).toBeCalled;
    });
  });
  describe("Add flow Bottom down",()=>{
    test("Validate Flow Rule with null",()=>{
      const {
        getByRole, getByLabelText
      } = renderAddFlow(true, validFlowData);
      addFlowRule.mockResolvedValue({ data: { "items": []}});
      const saveButton = getByRole("button", { name: "createRuleButton" });
      act(() => {
        fireEvent.click(saveButton);
      });
      waitFor(() => {
        expect(openAddModal).toBeCalledTimes(1);
      });
      const closeToastIcon = getByLabelText(/Close/i,{ hidden: true });
      fireEvent.click(closeToastIcon);
    });
    test("Validate fields and create flow",()=>{
      const {
        getByRole
      } = renderAddFlow(true, validFlowData);
      const ComponentControlMock = ComponentControl.mock;
      const dialedPhoneNumberAttr = ComponentControl.mock.calls[0][0].onChange;
      const descriptionAttr = ComponentControl.mock.calls[1][0].onChange;
      const channelAttr = ComponentControl.mock.calls[3][0].onChange;
      const brandAttr = ComponentControl.mock.calls[4][0].onChange;
      const userDestAttr = ComponentControl.mock.calls[24][0].onChange;
      const eventPhoneNumValue = {
        target: {
          name: "pkey",
          value: "+18334625917"
        }
      };
      const eventDescriptionValue = {
        target: {
          name: "dialedDescription",
          value: /AAFD property/i
        }
      };
      const eventBrandValue = {
        target: {
          name: "brand",
          value: /Test Brand/i
        }
      };
      const eventChannelValue = {
        target: {
          name: "channel",
          value: /Test2 Channel/i
        }
      };
      const eventDestValue = {
        target: {
          name: "userDestination",
          value: /Twilio/i
        }
      };
      act(()=>{
        dialedPhoneNumberAttr(eventPhoneNumValue);
        descriptionAttr(eventDescriptionValue);
        channelAttr(eventChannelValue);
        brandAttr(eventBrandValue);
        userDestAttr(eventDestValue);
      });
      addFlowRule.mockResolvedValue({ data: { "items": []}});
      const saveButton = getByRole("button", { name: "createRuleButton" });
      act(() => {
        fireEvent.click(saveButton);
      });
      addFlowRule.mockResolvedValue({ errors: "Error" });
      const saveButtonError = getByRole("button", { name: "createRuleButton" });
      act(() => {
        fireEvent.click(saveButtonError);
      });
      waitFor(() => {
        expect(ComponentControlMock).toBeCalled;
      });
    });
    test("Validate Reset Flow Rule ",()=>{
      const { getByRole } = renderAddFlow(true, validFlowData);
      const resetButton = getByRole("button", { name: "resetRuleButton" });
      act(() => {
        fireEvent.click(resetButton);
      });
      waitFor(() => {
        expect(openAddModal).toBeCalledTimes(0);
      });
    });
  });
  describe("Test for CustomToast Change",()=>{
    test("Simulate the customToast Button ", () => {
      renderAddFlow(true, validFlowData);
      const customToastButton = CustomToast.mock.calls[0][0].onClose;
      act(()=>{
        customToastButton();
      });
      expect(openAddModal).toBeCalledTimes(0);
    });
  });
});

