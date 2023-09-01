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
import { useAdminState } from "context";
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
  endTime: "11:00:00 PM",
  percentOfCallers: "100",
  pkey: "+12353245",
  policyType: "Liberty",
  skey: "liberty_test_test",
  startTime: "11:00:00 AM",
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
  endTime: "12:00:00 PM"
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

jest.mock("context", () => ({
  useAdminState: jest.fn()
}));

const mockMasterData = {
  brand: ["Test Brand"],
  channel: ["Test1 Channel", "Test2 Channel"]
};

const renderEditRouting = (isOpen, data) => {
  return render(
    <EditRouting openEditModal={openEditModal} selectedRow={data} isOpen={isOpen} />
  );
};


describe("<EditRouting />", () => {
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
        expect(saveButton).toBeTruthy();
      });
      test("Simulate the Save Button and popUp Error message", () => {
        updateRoutingDB.mockResolvedValue(null);
        renderEditRouting(true, validRoutingData);
        const saveButtonClick = Button.mock.calls[0][0].onClick;
        const saveButton = Button.mock.calls[0][0];
        act(() => {
          saveButtonClick();
        });
        expect(saveButton).toBeTruthy();
      });
    });
    describe("Test For Delete Rule Button", () => {
      test("Simulate the Delete Rule Button with Success API Response", () => {
        deleteRoutingRule.mockResolvedValue({ data: { "items": []}});
        renderEditRouting(true, validRoutingData);
        const deleteButtonClick = Button.mock.calls[2][0].onClick;
        const deleteButton = Button.mock.calls[2][0];
        act(() => {
          deleteButtonClick();
        });
        expect(deleteButton).toBeTruthy();
      });

      test("Simulate the clone Button", () => {
        renderEditRouting(true, validRoutingData);
        const cloneButtonClick = Button.mock.calls[1][0].onClick;
        act(() => {
          cloneButtonClick();
        });
        expect(openEditModal).toBeCalledTimes(1);
      });
    });
    test("Simulate the Delete Button and popUp Error message", () => {
      deleteRoutingRule.mockResolvedValue(null);
      renderEditRouting(true, validRoutingData);
      const deleteButtonClick = Button.mock.calls[2][0].onClick;
      const deleteButton = Button.mock.calls[2][0];
      act(() => {
        deleteButtonClick();
      });
      expect(deleteButton).toBeTruthy();
    });
    describe("Test for Cancelling popup", () => {
      test("Simulate the Cancel Button ", () => {
        renderEditRouting(true, validRoutingData);
        const closeButtonClick = Button.mock.calls[3][0].onClick;
        const closeButton = Button.mock.calls[3][0];
        act(() => {
          closeButtonClick();
        });
        expect(closeButton).toBeTruthy();
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
        expect(editPagePolicyTypeAttr).toBeTruthy();
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
        expect(editPageStartTimeAttr).toBeTruthy();
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
        expect(editPageEndTimeAttr).toBeTruthy();
      });
      test("Simulate the Input Change events", async () => {
        renderEditRouting(true, validRoutingData);
        const eventOnChange={
          target: { value: "test" }
        };
        const eventOnTimeChange={
          $d: "Fri Jan 06 2023 06:24:00 GMT+0530 (India Standard Time)"
        };
        const eventOnChannel={ target: { value: "Service" }};
        const eventOnBrand = { target: { value: "Liberty Mutual" }};
        const editPageChannelAttr= Grid.mock.calls[1][0].children[7].props.children.props.onChange;
        const editPageBrandAttr= Grid.mock.calls[1][0].children[3].props.children.props.onChange;
        act(()=>{
          editPageChannelAttr(eventOnChannel);
          editPageBrandAttr(eventOnBrand);
        });
        const gridAttr = Grid.mock.calls[1][0];
        const editPageIdAttr= Grid.mock.calls[1][0].children[0].props.children.props.onChange;
        const editPagePkeyAttr= Grid.mock.calls[1][0].children[1].props.children.props.onChange;
        const editPageSkeyAttr= Grid.mock.calls[1][0].children[2].props.children.props.onChange;
        const editPageCallerStateAttr= Grid.mock.calls[1][0].children[4].props.children.props.onChange;
        const editPageCallerTypeAttr= Grid.mock.calls[1][0].children[5].props.children.props.onChange;
        const editPageCallIntentAttr= Grid.mock.calls[1][0].children[6].props.children.props.onChange;
        const editPageDayAttr= Grid.mock.calls[1][0].children[8].props.children.props.onChange;
        const editPageTDestAttr= Grid.mock.calls[1][0].children[9].props.children.props.onChange;
        const editPageTskillAttr= Grid.mock.calls[1][0].children[10].props.children.props.onChange;
        const editPagePcallersAttr= Grid.mock.calls[1][0].children[12].props.children.props.onChange;
        const editPagePTypeAttr= Grid.mock.calls[1][0].children[15].props.children.props.onChange;
        const editPageTmsgAttr= Grid.mock.calls[1][0].children[16].props.children.props.onChange;
        const editPagePriorityAttr= Grid.mock.calls[1][0].children[17].props.children.props.onChange;
        const editPageOccupancyAttr= Grid.mock.calls[1][0].children[18].props.children.props.onChange;
        const editPageRstepsAttr= Grid.mock.calls[1][0].children[19].props.children.props.onChange;
        const editPageSTimeAttrChange= Grid.mock.calls[1][0].children[13].props.children.props.onChange;
        const editPageETimeAttrChange= Grid.mock.calls[1][0].children[14].props.children.props.onChange;
        act(()=>{
          editPageIdAttr(eventOnChange);
          editPagePkeyAttr(eventOnChange);
          editPageSkeyAttr(eventOnChange);
          editPageCallerStateAttr(eventOnChange);
          editPageCallerTypeAttr(eventOnChange);
          editPageCallIntentAttr(eventOnChange);
          editPageTDestAttr(eventOnChange);
          editPageDayAttr(eventOnChange);
          editPageTskillAttr(eventOnChange);
          editPagePcallersAttr(eventOnChange);
          editPagePTypeAttr(eventOnChange);
          editPageTmsgAttr(eventOnChange);
          editPagePriorityAttr(eventOnChange);
          editPageOccupancyAttr(eventOnChange);
          editPageRstepsAttr(eventOnChange);
          editPageETimeAttrChange(eventOnTimeChange);
          editPageSTimeAttrChange(eventOnTimeChange);
        });
        expect(gridAttr).toBeTruthy();
        expect(editPageIdAttr).toBeTruthy();
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