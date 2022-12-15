import React from "react";
import { DataGridRouting } from "../DataGridRouting";
import {
  fireEvent,
  initialTestState,
  render,
  waitFor,
  within
} from "testUtils";
import { retrieveRoutingData } from "services";
import {
  CACHED_CALL_ROUTING_PER_PAGE, CACHED_CALL_ROUTING_PAGE_NO
} from "utils";

const createSampleTestRoutingDataList = numberOfData =>{
  const dataList = [];
  for (let num=1; num<=numberOfData; num++) {
    const routingData = {
      id: num,
      all: "ALL",
      brand: `TestBrand${num}`,
      callIntent: `TestCallIntent${num}`,
      callerState: `TestCallState${num}`,
      callerType: `TestCallType${num}`,
      channel: `TestChannel${num}`,
      dayOfWeek: "ALL",
      endTime: "12:00:00 PM",
      percentOfCallers: "10",
      pkey: "testcallintent",
      policyType: `TestPolicyType${num}`,
      skey: `TestBrand${num}_TestChannel${num}_${num}`,
      startTime: "05:00:00 PM",
      transferDestination: `1234567${num}`,
      transferMessage: `Test Transfer Message ${num}`,
      twilioSkill: `Test Twilio Skill${num}`,
      crcSkill: null
    };
    dataList.push(routingData);
  }
  return dataList;
};



describe("<DataGridRouting />", ()=>{
  beforeEach(()=>{
    jest.clearAllMocks();
    retrieveRoutingData.mockResolvedValue([]);
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
    sessionStorage.removeItem(CACHED_CALL_ROUTING_PER_PAGE);
    sessionStorage.removeItem(CACHED_CALL_ROUTING_PAGE_NO);
  });

  describe("Data Table Footer", ()=>{
    test("Simulate Data Table Pagination", ()=>{
      const validRoutingDataList = createSampleTestRoutingDataList(15);
      retrieveRoutingData.mockResolvedValue(validRoutingDataList);
      const { getByText } = render(<DataGridRouting/>, initialTestState);
      waitFor(()=>{
        expect(getByText(/1-10 of 15/i)).toBeInTheDocument();
      });
    });

    test("Simulate Change Rows Per Page", ()=> {
      const validRoutingDataList = createSampleTestRoutingDataList(15);
      retrieveRoutingData.mockResolvedValue(validRoutingDataList);
      const {
        getByRole, queryByRole
      } = render(<DataGridRouting/>, initialTestState);

      const rowsPerPageDropDown = getByRole("button", { name: /Rows per page: 10/i });
      fireEvent.mouseDown(rowsPerPageDropDown);
      const listBox = within(getByRole("listbox"));
      fireEvent.click(listBox.getByRole("option", {
        name: "20",
        hidden: true
      }));
      waitFor(()=>{
        expect(queryByRole("listbox")).toEqual(null);
        expect(getByRole("button",{ name: /Rows per page: 20/i })).toBeInTheDocument();
      });
    });

    test("Simulate Change Go to Next Page", ()=>{
      const validRoutingDataList = createSampleTestRoutingDataList(15);
      retrieveRoutingData.mockResolvedValue(validRoutingDataList);
      const {
        getByText, getByRole
      } = render(<DataGridRouting/>, initialTestState);
      waitFor(()=>{
        const gotoNextPage = getByRole("button", { name: /Go to next page/i });
        fireEvent.click(gotoNextPage);
        expect(getByText(/11-15 of 15/i)).toBeInTheDocument();
      });

    });

    test("Simulate Change Go to previous Page",  ()=>{
      const validRoutingDataList = createSampleTestRoutingDataList(15);
      retrieveRoutingData.mockResolvedValue(validRoutingDataList);
      const {
        getByText, getByRole
      } =render(<DataGridRouting/>, initialTestState);
      waitFor(()=>{
        const gotoNextPage = getByRole("button", { name: /Go to next page/i });
        fireEvent.click(gotoNextPage);
        expect(getByText(/11-15 of 15/i)).toBeInTheDocument();
      });
      const gotoPreviousPage = getByRole("button", { name: /Go to previous page/i });
      fireEvent.click(gotoPreviousPage);
      waitFor(()=>{
        expect(getByText(/1-10 of 15/i)).toBeInTheDocument();
      });
    });
  });

});