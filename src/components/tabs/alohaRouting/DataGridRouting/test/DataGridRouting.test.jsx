import React from "react";
import { DataGridRouting } from "../DataGridRouting";
import {
  fireEvent,
  initialTestState,
  render,
  waitFor
} from "testUtils";
import { retrieveRoutingData } from "services";

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

const validRoutingDataList = createSampleTestRoutingDataList(15);

describe("<DataGridRouting />", ()=>{
  beforeAll(()=>{
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
  });
  beforeEach(()=>{
    jest.clearAllMocks();
    retrieveRoutingData.mockResolvedValue([]);
  });
  describe("Data Table Footer", ()=>{
    test("Simulate Change Rows Per Page", () => {
      retrieveRoutingData.mockResolvedValue(validRoutingDataList);
      const {
        getByText, getByRole
      } = render(<DataGridRouting/>, initialTestState);
      waitFor(()=>{
        expect(getByText("1-10 of 15")).toBeInTheDocument();
        const rowsPerPageDropDown = getByRole("button", { name: "Rows per page: 10" });
        fireEvent.click(rowsPerPageDropDown);
        fireEvent.change(rowsPerPageDropDown, { target: { value: 5 }});
        expect(getByRole("button",{ name: "Rows per page: 5" })).toBeInTheDocument();
      });
    });
    test("Simulate Data Table Pagination",()=>{
      retrieveRoutingData.mockResolvedValue(validRoutingDataList);
      const { getByText } = render(<DataGridRouting/>, initialTestState);
      waitFor(()=>{
        expect(getByText("1-10 of 15")).toBeInTheDocument();
      });
    });

    test("Simulate Change Go to Next Page", ()=>{
      retrieveRoutingData.mockResolvedValue(validRoutingDataList);
      const {
        getByText, getByRole
      } = render(<DataGridRouting/>, initialTestState);
      waitFor(()=>{
        expect(getByText("1-10 of 15")).toBeInTheDocument();
        const gotoNextPage = getByRole("button", { name: "Go to next page" });
        fireEvent.click(gotoNextPage);
        expect(getByText("11-15 of 15")).toBeInTheDocument();
      });

    });

    test("Simulate Change Go to previous Page", ()=>{
      retrieveRoutingData.mockResolvedValue(validRoutingDataList);
      const {
        getByText, getByRole
      } = render(<DataGridRouting/>, initialTestState);
      waitFor(()=>{
        expect(getByText("1-10 of 15")).toBeInTheDocument();
        const gotoNextPage = getByRole("button", { name: "Go to next page" });
        fireEvent.click(gotoNextPage);
        expect(getByText("11-15 of 15")).toBeInTheDocument();
        const gotoPreviousPage = getByRole("button", { name: "Go to previous page" });
        fireEvent.click(gotoPreviousPage);
        expect(getByText("1-10 of 15")).toBeInTheDocument();
      });
    });
  });

});