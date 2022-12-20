import React from "react";
import { DataGridRouting } from "../DataGridRouting";
import {
  fireEvent,
  initialTestState,
  render,
  waitFor,
  within,
  mockStore
} from "testUtils";
import { retrieveRoutingData } from "services";
import {
  CACHED_CALL_ROUTING_PER_PAGE, CACHED_CALL_ROUTING_PAGE_NO, CACHE_FILTER_ROUTING
} from "utils";


jest.mock("@mui/x-data-grid",()=>({
  __esModule: true,
  DataGrid: jest.fn(),
  GridToolbar: jest.fn(),
  GridRenderCellParams: jest.fn()
}));

jest.useFakeTimers();

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

const filteredItems = {
  channel: "TestChannel1"
};


describe("<DataGridRouting />", ()=>{
  const initialCookie = window.document.cookie;
  const matchMedia = window.matchMedia;
  beforeEach(()=>{
    jest.clearAllMocks();
    retrieveRoutingData.mockReset();
    mockStore.reset();
    Object.defineProperty(window.document, "cookie", {
      writable: true,
      value: (initialCookie + ";" + "PA.ciciccttritondev1=1234.5678.uytghh")
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
    // Object.defineProperty(window, "localStorage", {
    //   value: {
    //     getItem: jest.fn(() => null),
    //     setItem: jest.fn(() => null),
    //     removeItem: jest.fn(() => null)
    //   },
    //   writable: true
    // });
    sessionStorage.removeItem(CACHED_CALL_ROUTING_PER_PAGE);
    sessionStorage.removeItem(CACHED_CALL_ROUTING_PAGE_NO);
  });

  afterEach(()=>{
    Object.defineProperty(window.document, "cookie", {
      writable: true,
      value: initialCookie
    });
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: matchMedia
    });
  });

  describe("Data Table Footer", ()=>{
    test("Simulate Data Table Pagination", ()=>{
      const validRoutingDataList = createSampleTestRoutingDataList(15);
      retrieveRoutingData.mockResolvedValue(validRoutingDataList);
      const { getByText } = render(<DataGridRouting/>, initialTestState);
      jest.runAllTimers();
      waitFor(()=>{
        expect(getByText(/1-10000 of 15/i)).toBeInTheDocument();
      });
    });

    test("Simulate Change Rows Per Page", ()=> {
      const validRoutingDataList = createSampleTestRoutingDataList(15);
      retrieveRoutingData.mockResolvedValue(validRoutingDataList);
      const {
        getByRole, queryByRole
      } = render(<DataGridRouting/>, initialTestState);
      jest.runAllTimers();
      waitFor(()=>{
        const rowsPerPageDropDown = getByRole("button", { name: /Rows per page: 10/i });
        fireEvent.mouseDown(rowsPerPageDropDown);
        const listBox = within(getByRole("listbox"));
        fireEvent.click(listBox.getByRole("option", {
          name: "20",
          hidden: true
        }));
      });
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
      jest.runAllTimers();
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
        getByRole, getByText
      } =render(<DataGridRouting/>, initialTestState);
      jest.runAllTimers();
      waitFor(()=>{
        const gotoNextPage = getByRole("button", { name: /Go to next page/i });
        fireEvent.click(gotoNextPage);
        expect(getByText(/11-15 of 15/i)).toBeInTheDocument();
        const gotoPreviousPage = getByRole("button", { name: /Go to previous page/i });
        fireEvent.click(gotoPreviousPage);
      });
      waitFor(()=>{
        expect(getByText(/1-10 of 15/i)).toBeInTheDocument();
      });
    });
  });
  // describe("Check Filter",()=>{
  //   test("Simulate Chanel in Existing Filtered Item", ()=>{
  //     const validRoutingDataList = createSampleTestRoutingDataList(15);
  //     retrieveRoutingData.mockResolvedValue(validRoutingDataList);
  //     const {
  //       getByText
  //     } =render(<DataGridRouting/>, initialTestState);
  //     waitFor(()=>{
  //       expect(getByText(/1-1 of 1/i)).toBeInTheDocument();
  //     });
  //   });
  // });

});