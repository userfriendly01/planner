import React from "react";
import { EditRouting } from "../index";
import {
  ROUTING_CACHE_MASTER_DATA
} from "utils";
import {
  fireEvent, render, initialTestState, act, setupMockedComponents
} from "testUtils";
import {
  updateRoutingDB, deleteRoutingRule
} from "services";
import {
  Grid, Button
} from "@mui/material";
import {
  CustomToast, ComponentControl
} from "components";
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

const validStartTime =  {
  id: 2,
  pkey: "test2345",
  skey: "test12345_test",
  startTime: "12:00:00 AM",
  endTime: "12:00:00 AM"
};

const openEditModal = jest.fn();

jest.mock("@mui/material", () => ({
  __esModule: true,
  Grid: jest.fn(),
  Button: jest.fn()
}));

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
    Object.defineProperty(window.Element.prototype, "innerText", {
      set(value) {
        this.textContent = value;
      },
      configurable: true
    });
    setupMockedComponents({
      Grid,
      CustomToast,
      ComponentControl,
      Button
    });
    localStorage.setItem(ROUTING_CACHE_MASTER_DATA, JSON.stringify(mockMasterData));
  });

  // Cleanup mock
  afterEach(() => {
    localStorage.removeItem(ROUTING_CACHE_MASTER_DATA);
  });

  describe("Edit Routing Modal Block", () => {
    test("Simulate Close Modal By Clicking Close Icon", () => {
      const { getByRole } = renderEditRouting(true, validRoutingData);
      const closeModalButton = getByRole("img", { name: "Close" });
      act(() => {
        fireEvent.click(closeModalButton);
      });
      expect(openEditModal).toBeCalledTimes(1);
    });
  });
  describe("Test Footer Component of Edit Routing", () => {
    describe("Test For save Rule", () => {
      test("Simulate the SaveRule Button with Success API Response", async () => {
        updateRoutingDB.mockResolvedValue({ data: { "items": []}});
        renderEditRouting(true, validRoutingData);
        const saveButtonClick = Button.mock.calls[0][0].onClick;
        const saveButton = Button.mock.calls[0][0];
        act(() => {
          saveButtonClick();
        });
        expect(saveButton).toBeCalled;
      });
      test("Simulate the Save Button and popUp Error message", () => {
        updateRoutingDB.mockResolvedValue(null);
        renderEditRouting(true, validRoutingData);
        const saveButtonClick = Button.mock.calls[0][0].onClick;
        const saveButton = Button.mock.calls[0][0];
        act(() => {
          saveButtonClick();
        });
        expect(saveButton).toBeCalled;
      });
    });
    describe("Test For Delete Rule Button", () => {
      test("Simulate the Delete Rule Button with Success API Response", () => {
        deleteRoutingRule.mockResolvedValue({ data: { "items": []}});
        renderEditRouting(true, validRoutingData);
        const deleteButtonClick = Button.mock.calls[1][0].onClick;
        const deleteButton = Button.mock.calls[1][0];
        act(() => {
          deleteButtonClick();
        });
        expect(deleteButton).toBeCalled;
      });
      test("Simulate the Delete Button and popUp Error message", () => {
        deleteRoutingRule.mockResolvedValue(null);
        renderEditRouting(true, validRoutingData);
        const deleteButtonClick = Button.mock.calls[1][0].onClick;
        const deleteButton = Button.mock.calls[1][0];
        act(() => {
          deleteButtonClick();
        });
        expect(deleteButton).toBeCalled;
      });
    });
    describe("Test for Cancelling popup", () => {
      test("Simulate the Cancel Button ", () => {
        renderEditRouting(true, validRoutingData);
        const closeButtonClick = Button.mock.calls[2][0].onClick;
        const closeButton = Button.mock.calls[2][0];
        act(() => {
          closeButtonClick();
        });
        expect(closeButton).toBeCalled;
      });
    });
    describe("Test for TimeFrame Change",()=>{
      test("Simulate the StartTime and EndTime Button ", () => {
        renderEditRouting(true, validStartTime);
        expect(openEditModal).toBeCalledTimes(0);
      });
      test("Test for Empty Start Time ", () => {
        renderEditRouting(true, {});
        expect(openEditModal).toBeCalledTimes(0);
      });
    });
    describe("Test for Input Change", () => {
      test("Simulate the Start Time Input Change ", async () => {
        renderEditRouting(true, validRoutingData);
        const eventOnChange={
          target: { value: "100" }
        };
        const editPagePolicyTypeAttr= Grid.mock.calls[1][0].children[12];
        const editPageAttrChange= Grid.mock.calls[1][0].children[12].props.children.props.onChange;
        act(()=>{
          editPageAttrChange(eventOnChange);
        });
        expect(editPagePolicyTypeAttr).toBeCalled;
      });
      test("Simulate the Start Time Input Change ", async () => {
        renderEditRouting(true, validRoutingData);
        const eventOnChange={
          $d: "Fri Jan 06 2023 06:24:00 GMT+0530 (India Standard Time)"
        };
        const editPageStartTimeAttr= Grid.mock.calls[1][0].children[14];
        const editPageAttrChange= Grid.mock.calls[1][0].children[14].props.children.props.onChange;
        act(()=>{
          editPageAttrChange(eventOnChange);
        });
        expect(editPageStartTimeAttr).toBeCalled;
      });
      test("Simulate the End Time Input Change ", async () => {
        renderEditRouting(true, validRoutingData);
        const eventOnChange={
          $d: "Fri Jan 06 2023 06:24:00 GMT+0530 (India Standard Time)"
        };
        const editPageEndTimeAttr= Grid.mock.calls[1][0].children[13];
        const editPageAttrChange= Grid.mock.calls[1][0].children[13].props.children.props.onChange;
        act(()=>{
          editPageAttrChange(eventOnChange);
        });
        expect(editPageEndTimeAttr).toBeCalled;
      });
    });
  });
  describe("Test for CustomToast Change",()=>{
    test("Simulate the customToast Button ", () => {
      renderEditRouting(true, validStartTime);
      const customToastButton = CustomToast.mock.calls[0][0].onClose;
      act(()=>{
        customToastButton();
      });
      expect(openEditModal).toBeCalledTimes(0);
    });
  });
});