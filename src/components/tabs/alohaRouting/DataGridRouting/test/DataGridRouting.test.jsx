import React from "react";
import { render as quickRender } from "@testing-library/react";
import { DataGridRouting } from "../DataGridRouting";
import { PreviewModal } from "../../PreviewModal";
import {
  DataGrid, GridRenderCellParams, GridToolbar
} from "@mui/x-data-grid";
import {
  RoutingAdvanceSearch, EditRouting, AddRouting, CustomRoutingGridToolBar
} from "../../RoutingCustomActions";
import {
  CustomToast
} from "components";
import { useAdminState } from "context";
import {
  act,
  initialTestState,
  setupMockedComponents,
  render,
  fireEvent
} from "testUtils";
import {
  batchDelete,
  batchRoutingUpdate,
  queryRoutingData,
  retrieveRoutingData,
  routingBatchDelete,
  routingBatchCreate,
  batchRoutingCreate,
  routingBatchUpdate
} from "services";
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

jest.mock("../../PreviewModal", ()=>({
  __esModule: true,
  PreviewModal: jest.fn()
}));

jest.mock("../../RoutingCustomActions", ()=>({
  __esModule: true,
  RoutingAdvanceSearch: jest.fn(),
  AddRouting: jest.fn(),
  EditRouting: jest.fn(),
  CustomRoutingGridToolBar: jest.fn()
}));

jest.mock("context", () => ({
  useAdminState: jest.fn()
}));

export const createRoutingRule = num => {
  return {
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
    crcSkill: null,
    tfnRoutingGroup: `Test routing ${num}`
  };
};

export const createSampleTestRoutingDataList = numberOfData =>{
  const dataList = [];
  for (let num=1; num<=numberOfData; num++) {
    dataList.push(createRoutingRule(num));
  }
  return dataList;
};

const filteredItems = {
  dayOfWeek: "ALL"
};


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
  crcSkill: "updated",
  tfnRoutingGroup: "Test routing"
};
const routingPattern=routingData=>{
  const routingPatternReturn={
    data: {
      listCctSharedCallRoutingGlobalDbs: {
        items: routingData
      }
    }
  };
  return routingPatternReturn;
};

const renderDataGridRouting = () => render(
  <DataGridRouting accessToken="Token123" matchedGroups="[]"/>,
  initialTestState
);

describe("<DataGridRouting />", ()=>{
  const matchMedia = window.matchMedia;
  beforeEach(()=>{
    jest.clearAllMocks();
    batchDelete.mockReset();
    queryRoutingData.mockReset();
    retrieveRoutingData.mockReset();
    batchRoutingUpdate.mockReset();
    batchRoutingCreate.mockReset();
    useAdminState.mockReturnValue(initialTestState);
    setupMockedComponents({
      AddRouting,
      CustomRoutingGridToolBar: CustomRoutingGridToolBar,
      CustomToast,
      DataGrid,
      EditRouting,
      GridRenderCellParams,
      GridToolbar,
      PreviewModal,
      RoutingAdvanceSearch
    }),
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
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: matchMedia
    });
  });

  describe("Data Table Footer", ()=>{
    test("Simulate Data Table Pagination", async () =>{
      const validRoutingDataList = createSampleTestRoutingDataList(15);
      queryRoutingData.mockResolvedValue(validRoutingDataList);
      retrieveRoutingData.mockResolvedValue(validRoutingDataList);
      renderDataGridRouting();
      expect(DataGrid.mock.calls[0][0].paginationModel.page).toBe(1);
      expect(DataGrid.mock.calls[0][0].paginationModel.pageSize).toBe(10);
    });

    test("Simulate Change Rows Per Page", async () => {
      const validRoutingDataList = createSampleTestRoutingDataList(15);
      queryRoutingData.mockResolvedValue(validRoutingDataList);
      retrieveRoutingData.mockResolvedValue(validRoutingDataList);
      renderDataGridRouting();
      const onPageSizeChange = DataGrid.mock.calls[0][0].onPaginationModelChange;
      act(()=>{ onPageSizeChange({
        page: 1,
        pageSize: 20
      }); });
      expect(DataGrid.mock.calls[1][0].paginationModel.page).toBe(1);
      expect(DataGrid.mock.calls[1][0].paginationModel.pageSize).toBe(20);
    });

    test("Simulate Change Go to Next Page", async () => {
      const validRoutingDataList = createSampleTestRoutingDataList(15);
      queryRoutingData.mockResolvedValue(validRoutingDataList);
      retrieveRoutingData.mockResolvedValue(validRoutingDataList);
      renderDataGridRouting();
      const onPageChange = DataGrid.mock.calls[0][0].onPaginationModelChange;
      act(()=>{ onPageChange({
        page: 2,
        pageSize: 10
      }); });
      expect(DataGrid.mock.calls[1][0].paginationModel.page).toBe(2);
      expect(DataGrid.mock.calls[1][0].paginationModel.pageSize).toBe(10);
    });

    test("Simulate Change Go to previous Page", async () => {
      const validRoutingDataList = createSampleTestRoutingDataList(15);
      queryRoutingData.mockResolvedValue(validRoutingDataList);
      retrieveRoutingData.mockResolvedValue(validRoutingDataList);
      renderDataGridRouting();
      const onPageChange = DataGrid.mock.calls[0][0].onPaginationModelChange;
      act(()=>{
        onPageChange({
          page: 2,
          pageSize: 10
        });
      });
      const onPageChangeSecond = DataGrid.mock.calls[1][0].onPaginationModelChange;
      act(()=>{
        onPageChangeSecond({
          page: 1,
          pageSize: 10
        });
      });
      expect(DataGrid.mock.calls[2][0].paginationModel.page).toBe(1);
    });
  });

  describe("Check the Add Routing from RoutingCustomAction", ()=>{
    test("Simulate the AddRouting Render", ()=>{
      const validRoutingDataList = createSampleTestRoutingDataList(15);
      queryRoutingData.mockResolvedValue(validRoutingDataList);
      retrieveRoutingData.mockResolvedValue(validRoutingDataList);
      renderDataGridRouting();
      expect(AddRouting.mock.calls[0][0].newId).toBe(1);
    });
    test("Simulate the AddRouting openModal", ()=>{
      const validRoutingDataList = createSampleTestRoutingDataList(15);
      queryRoutingData.mockResolvedValue(validRoutingDataList);
      retrieveRoutingData.mockResolvedValue(validRoutingDataList);
      renderDataGridRouting();
      const openModal = AddRouting.mock.calls[0][0].openModal;
      act(()=>{ openModal(false, validRoutingData); });

      const openModal2 = AddRouting.mock.calls[1][0].openModal;
      expect(openModal2).toBeTruthy;
      act(()=>{ openModal(false, false, createRoutingRule(999)); });

    });
    test("Simulate the AddRouting openModal isOpen true", ()=>{
      const validRoutingDataList = createSampleTestRoutingDataList(15);
      queryRoutingData.mockResolvedValue(validRoutingDataList);
      retrieveRoutingData.mockResolvedValue(validRoutingDataList);
      renderDataGridRouting();
      const openModal = AddRouting.mock.calls[0][0].openModal;
      act(()=>{ openModal(true,false,validRoutingData); });
      expect(AddRouting.mock.calls[1][0].isOpen).toBe(true);
    });
  });
  describe("Check the Edit Routing from RoutingCustomAction", ()=>{
    test("Simulate the EditRouting Render", ()=>{
      const validRoutingDataList = createSampleTestRoutingDataList(15);
      queryRoutingData.mockResolvedValue(validRoutingDataList);
      retrieveRoutingData.mockResolvedValue(validRoutingDataList);
      renderDataGridRouting();
      expect(EditRouting.mock.calls[0][0].isOpen).toBe(false);
      expect(EditRouting.mock.calls[0][0].selectedRow).toBeUndefined;
    });
    test("Simulate the EditRouting openEditModal onSubmitted true", ()=>{
      const validRoutingDataList = createSampleTestRoutingDataList(15);
      queryRoutingData.mockResolvedValue(validRoutingDataList);
      retrieveRoutingData.mockResolvedValue(validRoutingDataList);
      renderDataGridRouting();
      const openEditModal = EditRouting.mock.calls[0][0].openEditModal;
      act(()=>{ openEditModal(false, true, [validRoutingData]); });
      expect(EditRouting.mock.calls[1][0].openEditModal).toBeTruthy;
    });
    test("Simulate the EditRouting openEditModal Type true", ()=>{
      const validRoutingDataList = createSampleTestRoutingDataList(15);
      queryRoutingData.mockResolvedValue(validRoutingDataList);
      retrieveRoutingData.mockResolvedValue(validRoutingDataList);
      renderDataGridRouting();
      const openEditModal = EditRouting.mock.calls[0][0].openEditModal;
      act(()=>{ openEditModal(false,false,[{}],"",false,true); });
      expect(EditRouting.mock.calls[1][0].openEditModal).toBeTruthy;
    });
    test("Simulate the EditRouting openEditModal", ()=>{
      const validRoutingDataList = createSampleTestRoutingDataList(15);
      queryRoutingData.mockResolvedValue(validRoutingDataList);
      retrieveRoutingData.mockResolvedValue(validRoutingDataList);
      renderDataGridRouting();
      const openEditModal = EditRouting.mock.calls[0][0].openEditModal;
      act(()=>{ openEditModal(true, false,[validRoutingData]); });
      expect(EditRouting.mock.calls[1][0].openEditModal).toBeTruthy;
    });
    test("Simulate the EditRouting openEditModal with deleteRow", ()=>{
      const validRoutingDataList = createSampleTestRoutingDataList(15);
      queryRoutingData.mockResolvedValue(validRoutingDataList);
      retrieveRoutingData.mockResolvedValue(validRoutingDataList);
      renderDataGridRouting();
      const openEditModal = EditRouting.mock.calls[0][0].openEditModal;
      act(()=>{ openEditModal(false,true,[validRoutingData],"",true,false); });
      expect(EditRouting.mock.calls[1][0].openEditModal).toBeTruthy;
    });
    test("Simulate the EditRouting openEditModal with deleteRow false", ()=>{
      const validRoutingDataList = createSampleTestRoutingDataList(15);
      queryRoutingData.mockResolvedValue(validRoutingDataList);
      retrieveRoutingData.mockResolvedValue(validRoutingDataList);
      renderDataGridRouting();
      const openEditModal = EditRouting.mock.calls[0][0].openEditModal;
      act(()=>{ openEditModal(false,true,[validRoutingData],"",false,false); });
      expect(EditRouting.mock.calls[1][0].openEditModal).toBeTruthy;
    });
    test("Simulate the CustomRoutingGridToolBar Custom Routing Toolbar", async()=>{
      const validRoutingDataList = createSampleTestRoutingDataList(15);
      queryRoutingData.mockResolvedValue(validRoutingDataList);
      retrieveRoutingData.mockResolvedValue(validRoutingDataList);
      renderDataGridRouting();
      const exportDataFile = CustomRoutingGridToolBar.mock.calls[0][0].exportDataFile;
      act(()=>{ exportDataFile(); });
      expect(CustomRoutingGridToolBar.mock.calls.length).toBe(1);

      act(() => { CustomRoutingGridToolBar.mock.calls[0][0].openPreviewModal(); });

      act(() => { CustomRoutingGridToolBar.mock.calls[0][0].openEditModal(false); });

    });
  });

  describe("Check Existing Filter", ()=>{
    beforeEach(()=>{
      localStorage.setItem(CACHE_FILTER_ROUTING, JSON.stringify(filteredItems));
    });
    test("Simulate Channel in Existing Filtered Item", async()=>{
      const validRoutingDataList = createSampleTestRoutingDataList(15);
      const patternList = routingPattern(validRoutingDataList);
      queryRoutingData.mockResolvedValue(patternList);
      retrieveRoutingData.mockResolvedValue(validRoutingDataList);
      renderDataGridRouting();
      expect(DataGrid.mock.calls[0][0].paginationModel.page).toBe(1);
    });
    test("Simulate Empty Filtered Item",()=>{
      const validRoutingDataList = createSampleTestRoutingDataList(15);
      const patternList = routingPattern(validRoutingDataList);
      queryRoutingData.mockResolvedValue(patternList);
      retrieveRoutingData.mockResolvedValue(validRoutingDataList);
      localStorage.clear();
      renderDataGridRouting();
      expect(DataGrid.mock.calls[0][0].paginationModel.page).toBe(1);
    });
    test("Simulate openAdvanceSearchModal", ()=>{
      const validRoutingDataList = createSampleTestRoutingDataList(15);
      const patternList = routingPattern(validRoutingDataList);
      queryRoutingData.mockResolvedValue(patternList);
      retrieveRoutingData.mockResolvedValue(validRoutingDataList);
      renderDataGridRouting();
      const openModal = RoutingAdvanceSearch.mock.calls[0][0].openModal;
      act(()=>{ openModal(true); });
      expect(RoutingAdvanceSearch.mock.calls[1][0].isOpen).toBe(true);
    });
    test("Simulate close openAdvanceSearchModal from AdvanceSearch", ()=>{
      const validRoutingDataList = createSampleTestRoutingDataList(15);
      const patternList = routingPattern(validRoutingDataList);
      queryRoutingData.mockResolvedValue(patternList);
      retrieveRoutingData.mockResolvedValue(validRoutingDataList);
      renderDataGridRouting();
      const openModal = RoutingAdvanceSearch.mock.calls[0][0].openModal;
      act(()=>{ openModal(false); });
      expect(RoutingAdvanceSearch.mock.calls[1][0].isOpen).toBe(false);
    });
    test("Simulate openAdvanceSearchModal applyFilter props", ()=>{
      const validRoutingDataList = createSampleTestRoutingDataList(15);
      const patternList = routingPattern(validRoutingDataList);
      queryRoutingData.mockResolvedValue(patternList);
      retrieveRoutingData.mockResolvedValue(validRoutingDataList);
      renderDataGridRouting();
      const applyFilter = RoutingAdvanceSearch.mock.calls[0][0].applyFilter;
      act(()=>{ applyFilter(); });
      expect(RoutingAdvanceSearch.mock.calls[1][0].isOpen).toBe(false);
    });
    test("Simulate openAdvanceSearchModal handleChange", ()=>{
      const validRoutingDataList = createSampleTestRoutingDataList(15);
      const patternList = routingPattern(validRoutingDataList);
      queryRoutingData.mockResolvedValue(patternList);
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
      const patternList = routingPattern(validRoutingDataList);
      queryRoutingData.mockResolvedValue(patternList);
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
    test("Simulate advanceFilter", () => {
      const validRoutingDataList = createSampleTestRoutingDataList(15);
      validRoutingDataList.push (createRoutingRule(1234));
      queryRoutingData.mockResolvedValue(routingPattern(validRoutingDataList));
      retrieveRoutingData.mockResolvedValue(validRoutingDataList);
      localStorage.setItem(CACHE_FILTER_ROUTING, JSON.stringify({
        ...filteredItems,
        dayOfWeek: "ALL",
        id: "1,234"
      }));
      renderDataGridRouting();
      expect(DataGrid.mock.calls[0][0].paginationModel.page).toBe(1);
      const applyFilter = RoutingAdvanceSearch.mock.calls[0][0].applyFilter;
      act(()=>{ applyFilter(); });
      expect(RoutingAdvanceSearch.mock.calls[1][0].isOpen).toBe(false);
    });
    test("Simulate advanceFilter error", () => {
      const validRoutingDataList = createSampleTestRoutingDataList(15);
      queryRoutingData.mockResolvedValue(routingPattern(validRoutingDataList));
      retrieveRoutingData.mockResolvedValue(validRoutingDataList);
      localStorage.setItem(CACHE_FILTER_ROUTING, "");
      renderDataGridRouting();
      expect(DataGrid.mock.calls[0][0].paginationModel.page).toBe(1);
    });
    test("Simulate advanceFilter empty result", () => {
      const validRoutingDataList = createSampleTestRoutingDataList(15);
      queryRoutingData.mockResolvedValue(routingPattern(validRoutingDataList));
      retrieveRoutingData.mockResolvedValue(validRoutingDataList);
      localStorage.setItem(CACHE_FILTER_ROUTING, JSON.stringify({
        ...filteredItems,
        dayOfWeek: "XXX-doesnt-exist"
      }));
      renderDataGridRouting();
      expect(DataGrid.mock.calls[0][0].paginationModel.page).toBe(1);
    });
    test("Simulate openAdvanceSearchModal handleChange with id", ()=>{
      const validRoutingDataList = createSampleTestRoutingDataList(15);
      const patternList = routingPattern(validRoutingDataList);
      queryRoutingData.mockResolvedValue(patternList);
      retrieveRoutingData.mockResolvedValue(validRoutingDataList);
      renderDataGridRouting();
      const handleChange = RoutingAdvanceSearch.mock.calls[0][0].handleChange;
      const idValue = "13";
      const idKey = "id";
      const testEvent = {
        target: {
          value: idValue,
          name: idKey
        }
      };
      act(()=>{ handleChange(testEvent); });
      const openModal = RoutingAdvanceSearch.mock.calls[1][0].openModal;
      act(()=>{ openModal(true); });
      const localStorageValue = JSON.parse(localStorage.getItem(CACHE_FILTER_ROUTING));
      expect(localStorageValue[idKey]).toBe(13);
    });
  });
  describe("Different Data Load", ()=>{
    test("Simulate DataGrid with Empty Data",()=>{
      const validRoutingDataList = createSampleTestRoutingDataList(0);
      queryRoutingData.mockResolvedValue(validRoutingDataList);
      retrieveRoutingData.mockResolvedValue(validRoutingDataList);
      renderDataGridRouting();
      expect(DataGrid.mock.calls[0][0].paginationModel.page).toBe(1);
    });
    test("Simulate CustomToast",()=>{
      const validRoutingDataList = createSampleTestRoutingDataList(1);
      retrieveRoutingData.mockResolvedValue(validRoutingDataList);
      queryRoutingData.mockResolvedValue(validRoutingDataList);
      renderDataGridRouting();
      const handleClose = CustomToast.mock.calls[0][0].onClose;
      act(()=>{ handleClose(true); });
      const ctCalls = CustomToast.mock.calls;
      expect(ctCalls[1][0].open).toBe(true);
    });
    test("Simulate openAdvanceSearchModal applyFilter with no filter", ()=>{
      const validRoutingDataList = createSampleTestRoutingDataList(15);
      queryRoutingData.mockResolvedValue(validRoutingDataList);
      retrieveRoutingData.mockResolvedValue(validRoutingDataList);
      renderDataGridRouting();
      const applyFilter = RoutingAdvanceSearch.mock.calls[0][0].applyFilter;
      act(()=>{ applyFilter(); });
      expect(RoutingAdvanceSearch.mock.calls[1][0].isOpen).toBe(false);
    });
    test("Simulate click on hyperlink",()=>{
      const validRoutingDataList = createSampleTestRoutingDataList(15);
      queryRoutingData.mockResolvedValue(validRoutingDataList);
      retrieveRoutingData.mockResolvedValue(validRoutingDataList);
      renderDataGridRouting();
      const datagridMockCalls = DataGrid.mock.calls;
      const hyperLinkFunction = datagridMockCalls[0][0].columns[0].renderCell;
      const hyperLinkParams = {
        row: validRoutingDataList[0],
        value: validRoutingDataList[0].id
      };
      const hyperlink = hyperLinkFunction(hyperLinkParams);
      const renderedHyperLink = quickRender(hyperlink);
      fireEvent.click(renderedHyperLink.getByRole("link"));
      expect(EditRouting.mock.calls[0][0].isOpen).toBe(false);

      act(() => { datagridMockCalls[0][0].onRowSelectionModelChange([1,2,3]); });
    });
  });
  describe("Test with junk filter data", ()=>{
    beforeEach(()=>{
      localStorage.setItem(CACHE_FILTER_ROUTING, "{a:}");
    });
    afterEach(()=>{
      localStorage.removeItem(CACHE_FILTER_ROUTING);
    });
    test("Simulate junk filter item in the local storage", ()=>{
      const validRoutingDataList = createSampleTestRoutingDataList(15);
      queryRoutingData.mockResolvedValue(validRoutingDataList);
      retrieveRoutingData.mockResolvedValue(validRoutingDataList);
      renderDataGridRouting();
      expect(DataGrid.mock.calls.length).toBe(1);
    });
  });
  describe("<PreviewModal />", () => {
    test("Handle bulkCreate", () => {
      const validRoutingDataList = createSampleTestRoutingDataList(15);
      queryRoutingData.mockResolvedValue(validRoutingDataList);
      retrieveRoutingData.mockResolvedValue(validRoutingDataList);
      batchRoutingCreate.mockResolvedValue({ data: { items: validRoutingDataList }});
      routingBatchCreate.mockResolvedValue(
        {
          flag: false,
          failure: [],
          success: validRoutingDataList
        }
      );
      renderDataGridRouting();

      const onCreate = PreviewModal.mock.calls[0][0].onCreate;
      act(() => {
        onCreate([validRoutingDataList[0]]);
      });
    });
    test("Handle bulkCreate on failure", () => {
      const validRoutingDataList = createSampleTestRoutingDataList(15);
      queryRoutingData.mockResolvedValue(validRoutingDataList);
      retrieveRoutingData.mockResolvedValue(validRoutingDataList);
      batchRoutingCreate.mockResolvedValue({ errors: [{ "message": "Unknown Error" }]});
      routingBatchCreate.mockResolvedValue(
        {
          flag: true,
          failure: validRoutingDataList[1],
          success: validRoutingDataList
        }
      );
      renderDataGridRouting();
      const onCreate = PreviewModal.mock.calls[0][0].onCreate;
      expect(onCreate).toBeTruthy();
    });
    test("Handle bulkUpdate", () => {
      const validRoutingDataList = createSampleTestRoutingDataList(15);
      queryRoutingData.mockResolvedValue(validRoutingDataList);
      retrieveRoutingData.mockResolvedValue(validRoutingDataList);
      batchRoutingUpdate.mockResolvedValue({ data: { items: validRoutingDataList }});
      routingBatchUpdate.mockResolvedValue(
        {
          flag: false,
          failure: [],
          success: validRoutingDataList
        }
      );
      renderDataGridRouting();

      const onUpdate = PreviewModal.mock.calls[0][0].onUpdate;
      act(() => {
        onUpdate(validRoutingDataList.slice(0,3));
      });
    });
    test("Handle bulkUpdate on failure", () => {
      const validRoutingDataList = createSampleTestRoutingDataList(15);
      queryRoutingData.mockResolvedValue(validRoutingDataList);
      retrieveRoutingData.mockResolvedValue(validRoutingDataList);
      batchRoutingUpdate.mockResolvedValue({ errors: [{ message: "unknown error" }]});
      routingBatchCreate.mockResolvedValue(
        {
          flag: true,
          failure: validRoutingDataList[1],
          success: validRoutingDataList
        }
      );
      renderDataGridRouting();

      const onUpdate = PreviewModal.mock.calls[0][0].onUpdate;
      expect(onUpdate).toBeTruthy();
    });
    test("Handle bulkDelete", () => {
      const validRoutingDataList = createSampleTestRoutingDataList(15);
      queryRoutingData.mockResolvedValue(validRoutingDataList);
      retrieveRoutingData.mockResolvedValue(validRoutingDataList);
      batchDelete.mockResolvedValue("OK");
      routingBatchDelete.mockResolvedValue(
        {
          flag: false,
          success: [{ "id": 1 },{ "id": 2 }]
        }
      );
      renderDataGridRouting();
      const onDelete = PreviewModal.mock.calls[0][0].onDelete;
      act(() => {
        onDelete([validRoutingDataList[0]]);
      });
    });
    test("Handle bulkDelete failure scenario", () => {
      const validRoutingDataList = createSampleTestRoutingDataList(15);
      queryRoutingData.mockResolvedValue(validRoutingDataList);
      retrieveRoutingData.mockResolvedValue(validRoutingDataList);
      batchDelete.mockResolvedValue("OK");
      routingBatchDelete.mockResolvedValue(
        {
          flag: true,
          success: [{ "id": 1 },{ "id": 2 }],
          failure: [{ "id": 3 }]
        }
      );
      renderDataGridRouting();
      const onDelete = PreviewModal.mock.calls[0][0].onDelete;
      expect(onDelete).toBeTruthy();
    });
    test("Handle onClose", () => {
      const validRoutingDataList = createSampleTestRoutingDataList(15);
      queryRoutingData.mockResolvedValue(validRoutingDataList);
      retrieveRoutingData.mockResolvedValue(validRoutingDataList);
      batchDelete.mockResolvedValue("OK");
      renderDataGridRouting();

      const onClose = PreviewModal.mock.calls[0][0].onClose;
      act(() => {
        onClose();
      });
    });
    it("getRowId", ()=>{
      const validRoutingDataList = createSampleTestRoutingDataList(15);
      queryRoutingData.mockResolvedValue(validRoutingDataList);
      retrieveRoutingData.mockResolvedValue(validRoutingDataList);
      renderDataGridRouting();
      const getRowId = DataGrid.mock.calls[0][0].getRowId;
      const selectedRows = validRoutingDataList[1];
      const rowId = getRowId(selectedRows);
      expect(rowId).toBe(validRoutingDataList[1].id);
    });
  });
});
