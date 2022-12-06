import React from "react";
import { EditFlow } from "../index";
import { FLOW_MASTER_DATA } from "utils";
import {
  fireEvent, render, initialTestState, waitFor, act
} from "testUtils";
import {
  deleteFlowRule, updateFlowDB
} from "services";

const CctSharedCallFlowDbProps = {
  id: 1,
  pkey: "12345",
  agentId: "123455",
  brand: "LM",
  callFlowTemplate: "temp",
  channel: "test",
  createTime: "2022-24-08",
  dialedDescription: "test",
  employeeId: "n1234567",
  userDestination: "dest",
  content: {
    callerType: "test",
    callFlowRoute: "test",
    dataRequests: ["test"],
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
  brand: ["test"],
  chanel: ["test"]
};

const openEditModal = jest.fn();

const renderEditFlow = (isOpen, data) => {
  return render(
    <EditFlow openEditModal={openEditModal} selectedRow={data} isOpen={isOpen} />, initialTestState
  );
};

describe("<EditFlow />", () => {

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
    localStorage.setItem(FLOW_MASTER_DATA, JSON.stringify(mockMasterData));
  });

  // Cleanup mock
  afterEach(() => {
    localStorage.removeItem(FLOW_MASTER_DATA);
  });

  describe("Edit Flow Data Request Block", () => {
    test("Simulate the addItem Button", () => {
      const {
        getByRole, getByText
      } = renderEditFlow(true, CctSharedCallFlowDbProps);
      const addDataRequestButton = getByRole("button", { name: "addDataRequestButton" });
      fireEvent.click(addDataRequestButton);
      const dataRequestInput = getByText("Data Request");
      expect(dataRequestInput).toBeVisible();
    });

    test("Simulate the View Data Request Button", () => {
      const {
        getByRole, getByText
      } = renderEditFlow(true, CctSharedCallFlowDbProps);
      waitFor(() => {
        const addDataRequestButton = getByRole("button", { name: "addDataRequestButton" });
        fireEvent.click(addDataRequestButton);
      });
      const displayDataRequestButton = getByRole("button", { name: "displayDataRequestButton" });
      fireEvent.click(displayDataRequestButton);
      const dataRequestOption = getByText("View Data Requests");
      expect(dataRequestOption).toBeVisible();
    });

    // test("Simulate the Remove Data Request Icon Button", ()=>{
    //   const { getByRole, getByText } = renderEditFlow(true, CctSharedCallFlowDbProps);
    //   const removeDataRequestIconButton = getByRole("button", { name: "removeDataRequest" });
    //   act(()=>{
    //     fireEvent.click(removeDataRequestIconButton);
    //   });
    //   waitFor(()=>{
    //     const dataRequestOption = getByText("View Data Requests");
    //     fireEvent.change(dataRequestOption);
    //   });
    // });
  });

  describe("Test Footer Component of Edit Flow", () => {
    test("Simulate the SaveRule Button with Success API Response", () => {
      updateFlowDB.mockResolvedValue({ data: { "items": []}});
      const { getByRole } = renderEditFlow(true, CctSharedCallFlowDbProps);
      const saveButton = getByRole("button", { name: "saveFlowRuleButton" });
      act(() => {
        fireEvent.click(saveButton);
      });
      waitFor(() => {
        expect(openEditModal).toBeCalledTimes(1);
      });
    });
    test("Simulate the SaveRule Button with Failed API Response", () => {
      const { getByRole } = renderEditFlow(true, CctSharedCallFlowDbProps);
      const saveButton = getByRole("button", { name: "saveFlowRuleButton" });
      act(() => {
        fireEvent.click(saveButton);
      });
      waitFor(() => {
        expect(openEditModal).toBeCalledTimes(0);
      });
    });

    test("Simulate the Close Button", () => {
      const { getByRole } = renderEditFlow(true, CctSharedCallFlowDbProps);
      const cancelButton = getByRole("button", { name: "cancelEditFlowButton" });
      fireEvent.click(cancelButton);
      expect(openEditModal).toBeCalledTimes(1);
    });

    test("Simulate the Delete Button  with Successful API Response", () => {
      deleteFlowRule.mockResolvedValue({ data: { "items": []}});
      const { getByRole } = renderEditFlow(true, CctSharedCallFlowDbProps);
      const deleteButton = getByRole("button", { name: "deleteFlowRuleButton" });
      act(() => {
        fireEvent.click(deleteButton);
      });
      waitFor(() => {
        expect(openEditModal).toBeCalledTimes(1);
      });
    });

    test("Simulate the Delete Button  with Failed API Response", () => {
      const { getByRole } = renderEditFlow(true, CctSharedCallFlowDbProps);
      const deleteButton = getByRole("button", { name: "deleteFlowRuleButton" });
      act(() => {
        fireEvent.click(deleteButton);
      });
      waitFor(() => {
        expect(openEditModal).toBeCalledTimes(0);
      });
    });
  });
});