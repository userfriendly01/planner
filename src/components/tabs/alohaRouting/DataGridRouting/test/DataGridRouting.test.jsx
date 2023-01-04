import React from "react";
import { DataGridRouting } from "../DataGridRouting";
import {
  DataGrid, GridRenderCellParams, GridToolbar
} from "@mui/x-data-grid";
import {
  RoutingAdvanceSearch, EditRouting, AddRouting
} from "../../RoutingCustomActions";
import { CustomToast } from "components";
import {
  act,
  initialTestState,
  setupMockedComponents,
  render
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

jest.mock("components", ()=>({
  __esModule: true,
  CustomToast: jest.fn()
}));

jest.mock("../../RoutingCustomActions", ()=>({
  __esModule: true,
  RoutingAdvanceSearch: jest.fn(),
  AddRouting: jest.fn(),
  EditRouting: jest.fn()
}));


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

const renderDataGridRouting = () =>{
  return render(<DataGridRouting/>, initialTestState);
};

describe("<DataGridRouting />", ()=>{
  const initialCookie = window.document.cookie;
  const matchMedia = window.matchMedia;
  beforeEach(()=>{
    jest.clearAllMocks();
    retrieveRoutingData.mockReset();
    setupMockedComponents({
      DataGrid,
      GridToolbar,
      GridRenderCellParams,
      RoutingAdvanceSearch,
      EditRouting,
      AddRouting,
      CustomToast
    }),
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
    test("Simulate Data Table Pagination", async () =>{
      const validRoutingDataList = createSampleTestRoutingDataList(15);
      retrieveRoutingData.mockResolvedValue(validRoutingDataList);
      renderDataGridRouting();
      expect(DataGrid.mock.calls[0][0].page).toBe(1);
      expect(DataGrid.mock.calls[0][0].pageSize).toBe(10);
    });

    test("Simulate Change Rows Per Page", async () => {
      const validRoutingDataList = createSampleTestRoutingDataList(15);
      retrieveRoutingData.mockResolvedValue(validRoutingDataList);
      renderDataGridRouting();
      const onPageSizeChange = DataGrid.mock.calls[0][0].onPageSizeChange;
      act(()=>{ onPageSizeChange(20); });
      expect(DataGrid.mock.calls[1][0].page).toBe(1);
      expect(DataGrid.mock.calls[1][0].pageSize).toBe(20);
    });

    test("Simulate Change Go to Next Page", async () => {
      const validRoutingDataList = createSampleTestRoutingDataList(15);
      retrieveRoutingData.mockResolvedValue(validRoutingDataList);
      renderDataGridRouting();
      const onPageChange = DataGrid.mock.calls[0][0].onPageChange;
      act(()=>{ onPageChange(2); });
      expect(DataGrid.mock.calls[1][0].page).toBe(2);
      expect(DataGrid.mock.calls[1][0].pageSize).toBe(10);
    });

    test("Simulate Change Go to previous Page", async () => {
      const validRoutingDataList = createSampleTestRoutingDataList(15);
      retrieveRoutingData.mockResolvedValue(validRoutingDataList);
      renderDataGridRouting();
      const onPageChange = DataGrid.mock.calls[0][0].onPageChange;
      act(()=>{
        onPageChange(2);
      });
      const onPageChangeSecond = DataGrid.mock.calls[1][0].onPageChange;
      act(()=>{
        onPageChangeSecond(1);
      });
      expect(DataGrid.mock.calls[2][0].page).toBe(1);
    });
  });

  describe("Check the Add Routing from RoutingCustomAction", ()=>{
    test("Simulate the AddRouting Render", ()=>{
      const validRoutingDataList = createSampleTestRoutingDataList(15);
      retrieveRoutingData.mockResolvedValue(validRoutingDataList);
      renderDataGridRouting();
      expect(AddRouting.mock.calls[0][0].newId).toBe(1);
    });
    test("Simulate the AddRouting openModal", ()=>{
      const validRoutingDataList = createSampleTestRoutingDataList(15);
      retrieveRoutingData.mockResolvedValue(validRoutingDataList);
      renderDataGridRouting();
      const openModal = AddRouting.mock.calls[0][0].openModal;
      act(()=>{ openModal(false); });
      expect(AddRouting.mock.calls[1][0].openModal).toBeTruthy;
    });
    test("Simulate the AddRouting openModal isOpen true", ()=>{
      const validRoutingDataList = createSampleTestRoutingDataList(15);
      retrieveRoutingData.mockResolvedValue(validRoutingDataList);
      renderDataGridRouting();
      const openModal = AddRouting.mock.calls[0][0].openModal;
      act(()=>{ openModal(true); });
      expect(AddRouting.mock.calls[1][0].isOpen).toBe(true);
    });
  });
  describe("Check the Edit Routing from RoutingCustomAction", ()=>{
    test("Simulate the EditRouting Render", ()=>{
      const validRoutingDataList = createSampleTestRoutingDataList(15);
      retrieveRoutingData.mockResolvedValue(validRoutingDataList);
      renderDataGridRouting();
      expect(EditRouting.mock.calls[0][0].isOpen).toBe(false);
      expect(EditRouting.mock.calls[0][0].selectedRow).toBeUndefined;
    });
    test("Simulate the EditRouting openEditModal", ()=>{
      const validRoutingDataList = createSampleTestRoutingDataList(15);
      retrieveRoutingData.mockResolvedValue(validRoutingDataList);
      renderDataGridRouting();
      const openEditModal = EditRouting.mock.calls[0][0].openEditModal;
      act(()=>{ openEditModal(false, true); });
      expect(EditRouting.mock.calls[1][0].openEditModal).toBeTruthy;
    });
  });

  describe("Check Existing Filter", ()=>{
    beforeEach(()=>{
      localStorage.setItem(CACHE_FILTER_ROUTING, JSON.stringify(filteredItems));
    });
    afterEach(()=>{
      localStorage.removeItem(CACHE_FILTER_ROUTING);
    });
    test("Simulate Channel in Existing Filtered Item",()=>{
      const validRoutingDataList = createSampleTestRoutingDataList(15);
      retrieveRoutingData.mockResolvedValue(validRoutingDataList);
      renderDataGridRouting();
      expect(DataGrid.mock.calls[0][0].page).toBe(1);
    });
    test("Simulate Empty Filtered Item",()=>{
      const validRoutingDataList = createSampleTestRoutingDataList(15);
      retrieveRoutingData.mockResolvedValue(validRoutingDataList);
      localStorage.clear();
      renderDataGridRouting();
      expect(DataGrid.mock.calls[0][0].page).toBe(1);
    });
    test("Simulate openAdvanceSearchModal", ()=>{
      const validRoutingDataList = createSampleTestRoutingDataList(15);
      retrieveRoutingData.mockResolvedValue(validRoutingDataList);
      renderDataGridRouting();
      const openModal = RoutingAdvanceSearch.mock.calls[0][0].openModal;
      act(()=>{ openModal(true); });
      expect(RoutingAdvanceSearch.mock.calls[1][0].isOpen).toBe(true);
    });
    test("Simulate openAdvanceSearchModal applyFilter props", ()=>{
      const validRoutingDataList = createSampleTestRoutingDataList(15);
      retrieveRoutingData.mockResolvedValue(validRoutingDataList);
      renderDataGridRouting();
      const applyFilter = RoutingAdvanceSearch.mock.calls[0][0].applyFilter;
      act(()=>{ applyFilter(); });
      expect(RoutingAdvanceSearch.mock.calls[1][0].isOpen).toBe(false);
    });
    test("Simulate openAdvanceSearchModal handleChange", ()=>{
      const validRoutingDataList = createSampleTestRoutingDataList(15);
      retrieveRoutingData.mockResolvedValue(validRoutingDataList);
      renderDataGridRouting();
      const handleChange = RoutingAdvanceSearch.mock.calls[0][0].handleChange;
      const brandValue = "TestBrand1";
      const brandKey = "brand";
      const testEvent = {
        target: {
          value: brandValue,
          name: brandKey
        }
      };
      act(()=>{ handleChange(testEvent); });
      const openModal = RoutingAdvanceSearch.mock.calls[1][0].openModal;
      act(()=>{ openModal(true); });
      const localStorageValue = JSON.parse(localStorage.getItem(CACHE_FILTER_ROUTING));
      expect(localStorageValue[brandKey]).toBe(brandValue);
    });
    test("Simulate openAdvanceSearchModal handleChange with blank string", ()=>{
      const validRoutingDataList = createSampleTestRoutingDataList(15);
      retrieveRoutingData.mockResolvedValue(validRoutingDataList);
      renderDataGridRouting();
      const handleChange = RoutingAdvanceSearch.mock.calls[0][0].handleChange;
      const brandValue = "";
      const brandKey = "brand";
      const testEvent = {
        target: {
          value: brandValue,
          name: brandKey
        }
      };
      act(()=>{ handleChange(testEvent); });
      const openModal = RoutingAdvanceSearch.mock.calls[1][0].openModal;
      act(()=>{ openModal(true); });
      const localStorageValue = JSON.parse(localStorage.getItem(CACHE_FILTER_ROUTING));
      expect(localStorageValue[brandKey]).toBeUndefined;
    });
  });
  describe("Different Data Load", ()=>{
    test("Simulate DataGrid with Empty Data",()=>{
      const validRoutingDataList = createSampleTestRoutingDataList(0);
      retrieveRoutingData.mockResolvedValue(validRoutingDataList);
      renderDataGridRouting();
      expect(DataGrid.mock.calls[0][0].page).toBe(1);
    });
    test("Simulate CustomToast",()=>{
      const validRoutingDataList = createSampleTestRoutingDataList(1);
      retrieveRoutingData.mockResolvedValue(validRoutingDataList);
      renderDataGridRouting();
      const handleClose = CustomToast.mock.calls[0][0].onClose;
      act(()=>{ handleClose(true); });
      expect(CustomToast.mock.calls[1][0].open).toBe(true);
    });
  });
});