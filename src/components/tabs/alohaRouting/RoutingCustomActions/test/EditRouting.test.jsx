import React from "react";
import { EditRouting } from "../index";
import {
  ROUTING_CACHE_MASTER_DATA
} from "utils";
import {
  fireEvent, render, initialTestState, waitFor, act, within
} from "testUtils";
import {
  updateRoutingDB, deleteRoutingRule
} from "services";
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
  percentOfCallers: 100,
  pkey: "+12353245",
  policyType: "Liberty",
  skey: "liberty_test_test",
  startTime: "2022-02-20",
  transferDestination: "Twilo",
  transferMessage: "HOLD ON while we transfer the call",
  twilioSkill: "test",
  crcSkill: "updated"
};
const validStartTime =  {
  id: 2,
  pkey: "test2345",
  skey: "test12345_test",
  startTime: "12:00:00 AM",
  endTime: "12:00:00 AM"
};

const openEditModal = jest.fn();

const handleInputChange = jest.fn();

const mockMasterData = {
  brand: ["Test Brand"],
  channel: ["Test1 Channel", "Test2 Channel"]
};

const renderEditRouting = (isOpen, data) => {
  return render(
    <EditRouting openEditModal={openEditModal} selectedRow={data} isOpen={isOpen} />, initialTestState
  );
};


describe("<EditRouting />", () => {
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
    localStorage.setItem(ROUTING_CACHE_MASTER_DATA, JSON.stringify(mockMasterData));
  });

  // Cleanup mock
  afterEach(() => {
    localStorage.removeItem(ROUTING_CACHE_MASTER_DATA);
  });

  describe("Edit Routing Modal Block", ()=>{
    test("Simulate EditRouting model ",()=>{
      const { getByRole } = renderEditRouting(true, validRoutingData);
      const channelOptions =  getByRole("button", { name: /Channel/i });
      act(()=>{
        //fireEvent.change(channelOptions.children[0], { target: { value: "Test2 Channel" }}).querySelector("input");
        fireEvent.change(channelOptions);
      });
      expect(handleInputChange).toBeCalledTimes(0);
    });
  });
  test("Simulate Close Modal By Clicking Close Icon",()=>{
    const { getByRole } = renderEditRouting(true, validRoutingData);
    const closeModalButton = getByRole("img", { name: "Close" });
    act(()=>{
      fireEvent.click(closeModalButton);
    });
    expect(openEditModal).toBeCalledTimes(1);
  });
  describe("Test Footer Component of Edit Routing", () => {
    describe("Test For save Rule",()=>{
      test("Simulate the SaveRule Button with Success API Response", () => {
        updateRoutingDB.mockResolvedValue({ data: { "items": []}});
        const { getByRole } = renderEditRouting(true, validRoutingData);
        const saveButton = getByRole("button", { name: "saveRoutingRuleButton" });
        act(() => {
          fireEvent.click(saveButton);
        });
        waitFor(() => {
          expect(openEditModal).toBeCalledTimes(1);
        });
      });
      test("Simulate the Save Button and popUp Error message", () => {
        updateRoutingDB.mockResolvedValue(null);
        const { getByRole } = renderEditRouting(true, validRoutingData);
        const saveButton = getByRole("button", { name: "saveRoutingRuleButton" });
        act(() => {
          fireEvent.click(saveButton);
        });
        waitFor(() => {
          expect(openEditModal).toBeCalledTimes(0);
        });
      });
    });
    describe("Test For Delete Rule Button",()=>{
      test("Simulate the Delete Rule Button with Success API Response", () => {
        deleteRoutingRule.mockResolvedValue({ data: { "items": []}});
        const { getByRole } = renderEditRouting(true, validRoutingData);
        const deleteButton = getByRole("button", { name: "deleteRoutingRuleButton" });
        act(() => {
          fireEvent.click(deleteButton);
        });
        waitFor(() => {
          expect(openEditModal).toBeCalledTimes(1);
        });
      });
      test("Simulate the Save Button and popUp Error message", () => {
        deleteRoutingRule.mockResolvedValue(null);
        const { getByRole } = renderEditRouting(true, validRoutingData);
        const deleteButton = getByRole("button", { name: "deleteRoutingRuleButton" });
        act(() => {
          fireEvent.click(deleteButton);
        });
        waitFor(() => {
          expect(openEditModal).toBeCalledTimes(0);
        });
      });
    });
    describe("Test for Cancelling popup",()=>{
      test("Simulate the Cancel Button ", () => {
        const { getByRole } = renderEditRouting(true, validRoutingData);
        const cancelButton = getByRole("button", { name: "cancelRoutingRuleButton" });
        act(() => {
          fireEvent.click(cancelButton);
        });
        waitFor(() => {
          expect(openEditModal).toBeCalledTimes(1);
        });
      });
    });
    describe("Test for TimeFrame Change",()=>{
      test("Simulate the StartTime and EndTime Button ", () => {
        renderEditRouting(true, validStartTime);
        expect(openEditModal).toBeCalledTimes(0);
      });
    });
    describe("Test for Input Change",()=>{
      test("Simulate the Input Change ", () => {
        const { getByRole } = renderEditRouting(true, validRoutingData);
        const ChannelInput = getByRole("button", {
          name: /Channel/i
        });
        act(()=>{
          fireEvent.click(ChannelInput);
        });
        expect(openEditModal).toBeCalledTimes(0);
      });
      test("Simulate the Input Change ", () => {
        const { getByLabelText } = renderEditRouting(true, validRoutingData);
        const CallersInput = getByLabelText(/Percent Of Callers/i );
        act(()=>{
          fireEvent.click(CallersInput);
          fireEvent.change(CallersInput, { target: { value: "2345" }});
        });
        expect(openEditModal).toBeCalledTimes(0);
      });
      test("Simulate the Start Time Input Change ", async() => {
        const {
          queryAllByLabelText, queryAllByRole
        } = renderEditRouting(true, validRoutingData);
        const timeInput = queryAllByLabelText(/Choose time, selected time is 12:00 AM/i ,{ hidden: true });
        act(()=>{
          fireEvent.click(timeInput[0]);
        });
        //const sideButtonNav = getByLabelText(/open next view/i ,{ hidden: true });
        const timeInputHours = queryAllByRole("listbox", {
          name: /Select Hours./i ,
          hidden: true
        });

        const { getAllByRole } = within(timeInputHours[0]);

        const listBoxHoursOptions = getAllByRole("option", {
          name: /11 hours/i,
          hidden: true
        });

        act(()=>{
          fireEvent.click(listBoxHoursOptions[0]);
        });
        expect(timeInput).toBeCalled;
        expect(listBoxHoursOptions[0]).toHaveTextContent("11");
        { /*const timeInputMinutes = queryAllByRole("listbox", {
          name: /Select minutes./i ,
          hidden: true
        });
        const { queryByRole } = within(timeInputMinutes[0]);
        const listBoxMinutesOptions = queryByRole("option", {
          name: /10 minutes/i,
          hidden: true
        });
        await waitFor(()=>{
          fireEvent.click(listBoxMinutesOptions[0]);
        });
      expect(listBoxMinutesOptions[0]).toHaveTextContent("05");*/ }
      });
    });
  });
});