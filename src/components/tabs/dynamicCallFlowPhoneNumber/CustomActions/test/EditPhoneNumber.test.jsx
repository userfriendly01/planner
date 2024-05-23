import React from "react";
import { EditPhoneNumber } from "../EditPhoneNumber";
import { FLOW_MASTER_DATA } from "utils";
import {
  fireEvent, render, initialTestState, waitFor, act, within, setupMockedComponents, adGroupPermissionMapping
} from "testUtils";
import {
  deleteFlowRule,
  updateFlowDB
} from "../../Utils/FlowTableServiceUtil";
import { useAdminState } from "context";
import { CustomToast } from "components";
import { AddOrViewPhoneNumber } from "../AddOrViewPhoneNumber";

jest.mock("../../../Utils/FlowTableServiceUtil", () => {
  return{
    deleteFlowRule: jest.fn(),
    deleteOppositeRows: jest.fn().mockReturnValue(false),
    updateFlowDB: jest.fn()
  };
});
jest.mock("components", () => {
  return{
    __esModule: true,
    CustomToast: jest.fn()
  };
});

jest.mock("../../CustomActionsCommon/AddOrView", () => {
  return{
    __esModule: true,
    AddOrView: jest.fn()
  };
});


jest.mock("context", () => ({
  useAdminState: jest.fn()
}));

const validFlowData = {
  id: 1,
  pkey: "12345",
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
    transferDestination: "123456789"
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
  whisper: "test"
};

const invalidFlowData={
  id: 1,
  pkey: "12345",
  callFlowTemplate: "temp",
  createTime: "2022-24-08",
  dialedDescription: "test",
  employeeId: "n1234567",
  userDestination: "dest"
};

const mockMasterData = {
  brand: ["Test Brand"],
  channel: ["Test1 Channel", "Test2 Channel"],
  callFlowRoute: ["TestCallFlowRoute"],
  callerType: ["TestCallerType"]
};


const openEditModal = jest.fn();
const duplicateCheck = jest.fn().mockReturnValue({
  isDuplicate: false,
  message: ""
});
const duplicateCheckTrue = jest.fn().mockReturnValue({
  isDuplicate: true,
  message: "Duplicate Employee Id"
});

const renderEditFlow = (isOpen, data) => {
  return render(
    <EditPhoneNumber openEditModal={openEditModal} selectedRow={data} isOpen={isOpen} duplicateCheck={duplicateCheck} matchedGroups={adGroupPermissionMapping} />
  );
};

const renderEditFlowWithDuplicateChecks = (isOpen, data) => {
  return render(
    <EditPhoneNumber openEditModal={openEditModal} selectedRow={data} isOpen={isOpen} duplicateCheck={duplicateCheckTrue} matchedGroups={adGroupPermissionMapping} />
  );
};

describe("<EditFlow />", () => {

  beforeEach(() => {
    jest.clearAllMocks();
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
    localStorage.setItem(FLOW_MASTER_DATA, JSON.stringify(mockMasterData));
  });

  // Cleanup mock
  afterEach(() => {
    localStorage.removeItem(FLOW_MASTER_DATA);
  });

  describe("Edit FLow Modal Block", ()=>{
    test("Simulate Close Modal By Clicking Close Icon",()=>{
      const { getByRole } = renderEditFlow(true, validFlowData,false);
      const closeModalButton = getByRole("img", { name: "Close" });
      act(()=>{
        fireEvent.click(closeModalButton);
      });
      expect(openEditModal).toBeCalledTimes(1);
    });
  });

  describe("Test Footer Component of Edit Flow", () => {
    test("Simulate the SaveRule Button with true Duplicate Checks", () => {
      updateFlowDB.mockResolvedValue({ data: { "items": []}});
      const { getByRole } = renderEditFlowWithDuplicateChecks(true, validFlowData);
      const saveButton = getByRole("button", { name: "saveFlowRuleButton" });
      act(() => {
        fireEvent.click(saveButton);
      });
      waitFor(() => {
        expect(openEditModal).toBeCalledTimes(0);
      });
    });
    test("Simulate the SaveRule Button with Success API Response", () => {
      updateFlowDB.mockResolvedValue({ data: { "items": []}});
      const { getByRole } = renderEditFlow(true, validFlowData);
      const saveButton = getByRole("button", { name: "saveFlowRuleButton" });
      act(() => {
        fireEvent.click(saveButton);
      });
      waitFor(() => {
        expect(openEditModal).toBeCalledTimes(1);
      });
    });
    test("Simulate the SaveRule Button with Failed API Response", () => {
      updateFlowDB.mockResolvedValue({ errors: [{ message: "dynamo DB Exception" }]});
      const { getByRole } = renderEditFlow(true, validFlowData);
      const saveButton = getByRole("button", { name: "saveFlowRuleButton" });
      act(() => {
        fireEvent.click(saveButton);
      });
      waitFor(() => {
        expect(openEditModal).toBeCalledTimes(0);
      });
      const toastCloseButton = getByRole("button", {
        name: /Close/i ,
        hidden: true
      });
      act(()=>{
        fireEvent.click(toastCloseButton);
      });
      expect(toastCloseButton).toBeTruthy();
    });

    test("Simulate the Close Button", () => {
      updateFlowDB.mockResolvedValue({ data: { "items": []}});
      const { getByRole } = renderEditFlow(true, validFlowData);
      const cancelButton = getByRole("button", { name: "cancelEditFlowButton" });
      fireEvent.click(cancelButton);
      expect(openEditModal).toBeCalledTimes(1);
    });
    test("Simulate the Delete Button with Successful API Response", async () => {
      deleteFlowRule.mockResolvedValue({ data: { "items": []}});
      const { getByRole } = renderEditFlow(true, validFlowData);
      const deleteButton = getByRole("button", { name: "deleteFlowRuleButton" });
      act(() => {
        fireEvent.click(deleteButton);
      });
      await waitFor(() => {
        expect(openEditModal).toBeCalledTimes(0);
      });
    });
    test("Simulate the Delete Button with null Response", () => {
      deleteFlowRule.mockResolvedValue(null);
      const { getByRole } = renderEditFlow(true, validFlowData);
      const deleteButton = getByRole("button", { name: "deleteFlowRuleButton" });
      act(() => {
        fireEvent.click(deleteButton);
      });
      expect(openEditModal).toBeCalledTimes(0);
    });
    test("Simulate the clone Flow Rule", () => {
      const { getByRole } = renderEditFlow(true, validFlowData);
      const cloneButton = getByRole("button", { name: "cloneFlowRuleButton" });
      act(() => {
        fireEvent.click(cloneButton);
      });
      expect(cloneButton).toBeTruthy();
    });
    test("Simulate the Delete Button with Failed API Response", () => {
      deleteFlowRule.mockResolvedValue(undefined);
      const { getByRole } = renderEditFlow(true, validFlowData);
      const deleteButton = getByRole("button", { name: "deleteFlowRuleButton" });
      act(() => {
        fireEvent.click(deleteButton);
      });
      expect(deleteButton).toBeTruthy();
    });
    test("Simulate to Save with Insufficient Data",()=>{
      const {
        getByRole, queryByRole
      } = renderEditFlow(true, invalidFlowData);
      const channelDropdown = getByRole("combobox", { name: /Channel/i });
      fireEvent.mouseDown(channelDropdown);
      const listBox = within(getByRole("listbox", { name: /Channel/i }));
      act(() => {
        fireEvent.click(listBox.getByRole("option", {
          name: /Test2 Channel/i,
          hidden: true
        }));
      });
      expect(queryByRole("listbox")).toEqual(null);
      expect(channelDropdown).toHaveFocus();
      expect(channelDropdown).toHaveTextContent("Test2 Channel");
      act(()=>{
        fireEvent.click(getByRole("button", { name: "saveFlowRuleButton" }));
      });
      waitFor(() => {
        expect(openEditModal).toBeCalledTimes(0);
      });
    });
    test("Simulate to callerType field",()=>{
      const {
        getByRole
      } = renderEditFlow(true, validFlowData);
      const callerDropdown = getByRole("combobox", { name: /Caller Type/i });
      fireEvent.mouseDown(callerDropdown);
      const listBox = within(getByRole("listbox", { name: /Caller Type/i }));
      act(() => {
        fireEvent.click(listBox.getByRole("option", {
          name: /TestCallerType/i,
          hidden: true
        }));
      });
      expect(callerDropdown).toBeDefined();
    });
    test("Simulate to callFlowRoute field",()=>{
      const {
        getByRole
      } = renderEditFlow(true, validFlowData);
      const callerDropdown = getByRole("combobox", { name: /Call Flow Route/i });
      fireEvent.mouseDown(callerDropdown);
      const listBox = within(getByRole("listbox", { name: /Call Flow Route/i }));
      act(() => {
        fireEvent.click(listBox.getByRole("option", {
          name: /TestCallFlowRoute/i,
          hidden: true
        }));
      });
      expect(callerDropdown).toBeDefined();
    });

    describe("Individual Components", ()=>{
      beforeEach(()=>{
        setupMockedComponents({
          CustomToast,
          AddOrView: AddOrViewPhoneNumber
        });
      });

      test("Simulate CustomToast Close Button",()=>{
        renderEditFlow(true, validFlowData);
        const customToastOnClose = CustomToast.mock.calls[0][0].onClose;
        act(()=>{ customToastOnClose(); });
        expect(CustomToast.mock.calls[0][0].open).toBe(false);
      });
      test("Simulate AddOrView ",()=>{
        renderEditFlow(true, validFlowData);
        const navigateBtns = AddOrViewPhoneNumber.mock.calls[0][0].navigateViewOrAdd;
        act(()=>{ navigateBtns(true,"callerType"); });
        expect(navigateBtns).toBeTruthy();
      });
    });
  });
});
