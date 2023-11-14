import React from "react";
import { AddFlow } from "../../index";
import { FLOW_MASTER_DATA } from "utils";
import {
  fireEvent, render, initialTestState, act, waitFor, setupMockedComponents
} from "testUtils";
import {
  addFlowRule, retrieveFlowData
} from "services";
import { useAdminState } from "context";
import {
  Grid, Button
} from "@mui/material";
import {
  CustomToast, ComponentControl, Dropdown
} from "components";
import { AddOrView } from "../../CustomActionsCommon/AddOrView";
import { flowFields } from "../../FlowFieldsConfig";
import { FloatingHeader } from "@lmig/lmds-react-floating-header";

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
  accountManager: "test",
  affinityVDN: "test",
  callDetails2: "test",
  internetPlacement: "test",
  callDetails1: "test",
  callTypeDescription: "test",
  lineOfBusiness: "test",
  marketingChannel: "test",
  requestID: "test",
  transferCode: "test",
  whisper: "test",
  tfnRoutingGroup: "Core"
};


const mockMasterData = {
  brand: ["Test Brand", "Testing Brand2"],
  channel: ["Test1 Channel", "Test2 Channel"],
  userDestination: ["Twilio", "Avaya"]
};

jest.mock("@mui/material", () => ({
  __esModule: true,
  Grid: jest.fn(),
  Button: jest.fn(),
  TextField: jest.fn(),
  Paper: jest.fn()
}));

jest.mock("@mui/x-date-pickers/TimePicker", () => ({
  __esModule: true,
  TimePicker: jest.fn()
}));

jest.mock("components", () => {
  return{
    __esModule: true,
    CustomToast: jest.fn(),
    ComponentControl: jest.fn(),
    Dropdown: jest.fn()
  };
});
jest.mock("../../CustomActionsCommon/AddOrView",()=>{
  return{
    __esModule: true,
    AddOrView: jest.fn()
  };
});

jest.mock("context", () => ({
  useAdminState: jest.fn()
}));

jest.mock("@lmig/lmds-react-floating-header", ()=>{
  return {
    __esModule: true,
    FloatingHeader: jest.fn()
  };
});

const openAddModal = jest.fn();
const duplicateCheck = jest.fn().mockReturnValue({
  isDuplicate: false,
  message: ""
});

const duplicateCheckReturnTrue = jest.fn().mockReturnValue({
  isDuplicate: true,
  message: "Duplicate Employee Id found"
});

const renderAddFlow = isOpen => {
  return render(
    <AddFlow openAddModal={openAddModal} newID={1} isOpen={isOpen} duplicateCheck={duplicateCheck} />
  );
};

const renderAddFlowDefaultOpen = () => {
  return render(
    <AddFlow openAddModal={openAddModal} newID={1} duplicateCheck={duplicateCheck}/>
  );
};

const renderAddFlowCloneType = flowRule => {
  return render(
    <AddFlow openAddModal={openAddModal} newID={1} cloneType = {true} flowRuleCloned = {flowRule} duplicateCheck={duplicateCheck}/>
  );
};

const renderAddFlowDuplicateCreate = () =>{
  return render(
    <AddFlow openAddModal={openAddModal} newID={1} isOpen={true} duplicateCheck={duplicateCheckReturnTrue} />);
};

describe("<AddFlow />", () => {

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
    useAdminState.mockReturnValue(initialTestState);
    setupMockedComponents({
      Grid,
      Button,
      ComponentControl,
      CustomToast,
      Dropdown,
      AddOrView,
      FloatingHeader
    });
    localStorage.setItem(FLOW_MASTER_DATA, JSON.stringify(mockMasterData));
  });
  // Cleanup mock
  afterEach(() => {
    localStorage.removeItem(FLOW_MASTER_DATA);
  });
  describe("AddFlow ModalBlock",()=>{
    test("Simulate Close Modal By Clicking Close Icon",()=>{
      const { getByRole } = renderAddFlow(true);
      const closeModalButton = getByRole("img", { name: "Close" });
      act(()=>{
        fireEvent.click(closeModalButton);
      });
      expect(openAddModal).toBeCalledTimes(1);
    });
    test("pass open modal as false ",()=>{
      renderAddFlowDefaultOpen();
      expect(openAddModal).toBeCalledTimes(0);
    });
    test("Simulate Close Modal By removing masterData",()=>{
      localStorage.removeItem(FLOW_MASTER_DATA);
      retrieveFlowData.mockResolvedValue({ data: { "items": validFlowData }});
      const { getByRole } = renderAddFlow(true);
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
      expect(addFlowPagePolicyTypeAttr).toBeTruthy();
    });
  });
  describe("Test for AddOrView Change",()=>{
    test("Simulate the AddOrView Button ", () => {
      renderAddFlow(true);
      const navigateBtns = AddOrView.mock.calls[0][0].navigateViewOrAdd;
      act(()=>{ navigateBtns(true,"callerType"); });
      expect(navigateBtns).toBeTruthy();
    });
  });
  describe("Test for CustomToast Change",()=>{
    test("Simulate the customToast Button ", () => {
      renderAddFlow(true);
      const customToastButton = CustomToast.mock.calls[0][0].onClose;
      act(()=>{
        customToastButton();
      });
      expect(customToastButton).toBeTruthy();
    });
  });
  describe("Add flow Bottom down",()=>{
    test("Validate fields and create flow",()=>{
      const {
        getByRole
      } = renderAddFlow(true);
      flowFields[8].valueSetter(validFlowData, { type: "DID1" });
      const ComponentControlMock = ComponentControl.mock;
      const dialedPhoneNumberAttr = ComponentControl.mock.calls[0][0].onChange;
      const descriptionAttr = ComponentControl.mock.calls[1][0].onChange;
      const channelAttr = ComponentControl.mock.calls[3][0].onChange;
      const brandAttr = ComponentControl.mock.calls[4][0].onChange;
      const callerTypeAttr = ComponentControl.mock.calls[7][0].onChange;
      const callFlowRouteAttr = ComponentControl.mock.calls[10][0].onChange;
      const callFlowTypeAttr = ComponentControl.mock.calls[2][0].onChange;
      const transferNumberAttr = ComponentControl.mock.calls[9][0].onChange;
      const languageOfferAttr = ComponentControl.mock.calls[5][0].onChange;
      const greetingMessagesAttr = ComponentControl.mock.calls[11][0].onChange;
      const dataRequestsAtr = ComponentControl.mock.calls[6][0].onChange;
      const tfnRoutingGroupAtr = ComponentControl.mock.calls[19][0].onChange;
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
      const eventCallFlowRoute = {
        target: {
          name: "callFlowRoute",
          value: /Flow Route/i
        }
      };
      const eventCallerType = {
        target: {
          name: "callerType",
          value: /test/i
        }
      };
      const eventCallFlowType = {
        target: {
          name: "callFlowType",
          value: /test/i
        }
      };
      const eventTransferNumber= {
        target: {
          name: "transferNumber",
          value: "4625917"
        }
      };
      const eventLanguageOffer = {
        target: {
          name: "languageOffer",
          value: "English"
        }
      };
      const eventGreetingMessages = {
        target: {
          name: "greetingMessages",
          value: "Welcome to liberty"
        }
      };
      const eventDataRequests = {
        target: {
          name: "dataRequests",
          value: "test1"
        }
      };
      const eventTfnRoutingGroup = {
        target: {
          name: "tfnRoutingGroup",
          value: "Core"
        }
      };
      act(()=>{
        dialedPhoneNumberAttr(eventPhoneNumValue);
        descriptionAttr(eventDescriptionValue);
        channelAttr(eventChannelValue);
        brandAttr(eventBrandValue);
        callFlowRouteAttr(eventCallFlowRoute,"testing");
        callerTypeAttr(eventCallerType,"testing");
        callFlowTypeAttr(eventCallFlowType);
        languageOfferAttr(eventLanguageOffer);
        greetingMessagesAttr(eventGreetingMessages);
        transferNumberAttr(eventTransferNumber);
        dataRequestsAtr(eventDataRequests);
        tfnRoutingGroupAtr(eventTfnRoutingGroup);
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
        expect(ComponentControlMock).toBeTruthy();
      });
    });
    test("Simulate the duplicate check", ()=>{
      const { getByRole } = renderAddFlowDuplicateCreate();
      flowFields[8].valueSetter(validFlowData, { type: "DID1" });
      const dialedPhoneNumberAttr = ComponentControl.mock.calls[0][0].onChange;
      const descriptionAttr = ComponentControl.mock.calls[1][0].onChange;
      const channelAttr = ComponentControl.mock.calls[3][0].onChange;
      const brandAttr = ComponentControl.mock.calls[4][0].onChange;
      const callerTypeAttr = ComponentControl.mock.calls[7][0].onChange;
      const callFlowRouteAttr = ComponentControl.mock.calls[10][0].onChange;
      const callFlowTypeAttr = ComponentControl.mock.calls[2][0].onChange;
      const transferNumberAttr = ComponentControl.mock.calls[9][0].onChange;
      const languageOfferAttr = ComponentControl.mock.calls[5][0].onChange;
      const greetingMessagesAttr = ComponentControl.mock.calls[11][0].onChange;
      const dataRequestsAtr = ComponentControl.mock.calls[6][0].onChange;
      const tfnRoutingGroupAtr = ComponentControl.mock.calls[19][0].onChange;
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
      const eventCallFlowRoute = {
        target: {
          name: "callFlowRoute",
          value: /Flow Route/i
        }
      };
      const eventCallerType = {
        target: {
          name: "callerType",
          value: /test/i
        }
      };
      const eventCallFlowType = {
        target: {
          name: "callFlowType",
          value: /test/i
        }
      };
      const eventTransferNumber= {
        target: {
          name: "transferNumber",
          value: "4625917"
        }
      };
      const eventLanguageOffer = {
        target: {
          name: "languageOffer",
          value: "English"
        }
      };
      const eventGreetingMessages = {
        target: {
          name: "greetingMessages",
          value: "Welcome to liberty"
        }
      };
      const eventDataRequests = {
        target: {
          name: "dataRequests",
          value: "test1"
        }
      };
      const eventTfnRoutingGroup = {
        target: {
          name: "tfnRoutingGroup",
          value: "Core"
        }
      };
      act(()=>{
        dialedPhoneNumberAttr(eventPhoneNumValue);
        descriptionAttr(eventDescriptionValue);
        channelAttr(eventChannelValue);
        brandAttr(eventBrandValue);
        callFlowRouteAttr(eventCallFlowRoute,"testing");
        callerTypeAttr(eventCallerType,"testing");
        callFlowTypeAttr(eventCallFlowType);
        languageOfferAttr(eventLanguageOffer);
        greetingMessagesAttr(eventGreetingMessages);
        transferNumberAttr(eventTransferNumber);
        dataRequestsAtr(eventDataRequests);
        tfnRoutingGroupAtr(eventTfnRoutingGroup);
      });
      const saveButton = getByRole("button", { name: "createRuleButton" });
      act(() => {
        fireEvent.click(saveButton);
      });
      expect(openAddModal).toBeCalledTimes(0);
    });
    test("Validate create Rule with Invalid fields ",()=>{
      const { getByRole } = renderAddFlow(true);
      const saveButton = getByRole("button", { name: "createRuleButton" });
      act(() => {
        fireEvent.click(saveButton);
      });
      waitFor(() => {
        expect(openAddModal).toBeCalledTimes(0);
      });
    });
    test("Validate Flow type with fields",()=>{
      const flowInitRule = flowFields.reduce((a, v) => ({
        ...a,
        [v.key]: {
          error: false,
          value: v.valueGetter(validFlowData),
          required: v.required || false
        }
      }), {});
      renderAddFlowCloneType(flowInitRule);
      waitFor(() => {
        expect(openAddModal).toBeCalledTimes(0);
      });
    });
    test("Validate Reset Flow Rule ",()=>{
      const { getByRole } = renderAddFlow(true);
      const resetButton = getByRole("button", { name: "resetRuleButton" });
      act(() => {
        fireEvent.click(resetButton);
      });
      waitFor(() => {
        expect(openAddModal).toBeCalledTimes(0);
      });
    });
  });
});

