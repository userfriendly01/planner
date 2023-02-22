import React from "react";
import { EditFlow } from "../index";
import { FLOW_MASTER_DATA } from "utils";
import {
  fireEvent, render, initialTestState, waitFor, act, within, setupMockedComponents
} from "testUtils";
import {
  deleteFlowRule, updateFlowDB
} from "services";
import { useAdminState } from "context";
import { CustomToast } from "components";

jest.mock("components", () => {
  return{
    __esModule: true,
    CustomToast: jest.fn()
  };
});

jest.mock("context", () => ({
  useAdminState: jest.fn()
}));

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
  whisper: "test"
};

const invalidFlowData={
  id: 1,
  pkey: "12345",
  agentId: "123455",
  callFlowTemplate: "temp",
  createTime: "2022-24-08",
  dialedDescription: "test",
  employeeId: "n1234567",
  userDestination: "dest"
};

const mockMasterData = {
  brand: ["Test Brand"],
  channel: ["Test1 Channel", "Test2 Channel"]
};

const openEditModal = jest.fn();

const renderEditFlow = (isOpen, data) => {
  return render(
    <EditFlow openEditModal={openEditModal} selectedRow={data} isOpen={isOpen} />
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
      const { getByRole } = renderEditFlow(true, validFlowData);
      const closeModalButton = getByRole("img", { name: "Close" });
      act(()=>{
        fireEvent.click(closeModalButton);
      });
      expect(openEditModal).toBeCalledTimes(1);
    });
  });

  describe("Edit Flow Data Request Block", () => {
    test("Simulate the addItem Button", () => {
      const {
        getByRole
      } = renderEditFlow(true, validFlowData);
      const addDataRequestButton = getByRole("button", { name: "addDataRequestButton" });
      act(()=>{
        fireEvent.click(addDataRequestButton);
      });
      const dataRequestInput = getByRole("textbox", {
        name: /Data Request/i ,
        hidden: true
      });
      act(()=>{
        fireEvent.click(dataRequestInput);
        fireEvent.change(dataRequestInput, { target: { value: "test3" }});
        fireEvent.click(addDataRequestButton);
      });
      waitFor(()=>{
        expect(dataRequestInput).toBeNull;
      });

    });

    test("Simulate the View Data Request Button", () => {
      const {
        getByRole, getByText
      } = renderEditFlow(true, validFlowData);
      waitFor(() => {
        const addDataRequestButton = getByRole("button", { name: "addDataRequestButton" });
        fireEvent.click(addDataRequestButton);
      });
      const displayDataRequestButton = getByRole("button", { name: "displayDataRequestButton" });
      fireEvent.click(displayDataRequestButton);
      const dataRequestOption = getByText("View Data Requests");
      expect(dataRequestOption).toBeVisible();
    });

    test("Simulate the Remove Data Request Icon Button", ()=>{
      const {
        getByRole, queryByRole
      } = renderEditFlow(true, validFlowData);
      const dataRequestOption = getByRole("button",{ name: /View Data Requests/i });
      act(()=>{
        fireEvent.mouseDown(dataRequestOption);
      });
      const listBox = within(getByRole("listbox", { name: /View Data Requests/i }));
      const removeButton = listBox.getByRole("button", {
        name: "removeDataRequest-0",
        hidden: true
      });
      act(() => {
        fireEvent.click(removeButton);
        fireEvent.keyPress(dataRequestOption, {
          key: "Tab",
          code: 9,
          charCode: 9
        });
      });
      waitFor(()=>{
        expect(queryByRole("listbox")).toEqual(null);
      });
    });
  });

  describe("Test Footer Component of Edit Flow", () => {
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
    });

    test("Simulate the Close Button", () => {
      const { getByRole } = renderEditFlow(true, validFlowData);
      const cancelButton = getByRole("button", { name: "cancelEditFlowButton" });
      fireEvent.click(cancelButton);
      expect(openEditModal).toBeCalledTimes(1);
    });

    test("Simulate the Delete Button  with Successful API Response", () => {
      deleteFlowRule.mockResolvedValue({ data: { "items": []}});
      const { getByRole } = renderEditFlow(true, validFlowData);
      const deleteButton = getByRole("button", { name: "deleteFlowRuleButton" });
      act(() => {
        fireEvent.click(deleteButton);
      });
      waitFor(() => {
        expect(openEditModal).toBeCalledTimes(1);
      });
    });

    test("Simulate the Delete Button with Failed API Response", () => {
      deleteFlowRule.mockResolvedValue(undefined);
      const { getByRole } = renderEditFlow(true, validFlowData);
      const deleteButton = getByRole("button", { name: "deleteFlowRuleButton" });
      act(() => {
        fireEvent.click(deleteButton);
      });
      waitFor(() => {
        expect(openEditModal).toBeCalledTimes(0);
      });
    });

    test("Simulate to Save with Insufficient Data",()=>{
      const {
        getByRole, queryByRole
      } = renderEditFlow(true, invalidFlowData);
      const chanelDropdown = getByRole("button", { name: /Channel/i });
      fireEvent.mouseDown(chanelDropdown);
      const listBox = within(getByRole("listbox", { name: /Channel/i }));
      act(() => {
        fireEvent.click(listBox.getByRole("option", {
          name: /Test2 Channel/i,
          hidden: true
        }));
      });
      expect(queryByRole("listbox")).toEqual(null);
      expect(chanelDropdown).toHaveFocus();
      expect(chanelDropdown).toHaveTextContent("Test2 Channel");
      act(()=>{
        fireEvent.click(getByRole("button", { name: "saveFlowRuleButton" }));
      });
      waitFor(()=>{
        expect(openEditModal).toBeCalledTimes(0);

      });
    });
  });

  describe("Individual Components", ()=>{
    beforeEach(()=>{
      setupMockedComponents({
        CustomToast
      });
    });

    test("Simulate CustomToast Close Button",()=>{
      renderEditFlow(true, validFlowData);
      const customToastOnClose = CustomToast.mock.calls[0][0].onClose;
      act(()=>{ customToastOnClose(); });
      expect(CustomToast.mock.calls[0][0].open).toBe(false);
    });
  });
});
