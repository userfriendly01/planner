import React from "react";
import { render as quickRender } from "@testing-library/react";
import {
  AddFlow, AdvanceSearchModal, CustomFlowGridToolBar, EditFlow
} from "../../CustomActions";
import {
  CACHE_FILTER_FLOW,
  CALL_FLOW_PAGE_NO,
  CALL_FLOW_PER_PAGE
} from "utils";
import {
  DataGrid, GridRenderCellParams, GridToolbar
} from "@mui/x-data-grid";
import {
  act,
  fireEvent,
  initialTestState,
  render,
  setupMockedComponents
} from "testUtils";
import { useAdminState } from "context";
import { CustomToast } from "components";
import DataGridFlow from "../DataGridFlow";
import {
  batchDeleteItems,
  batchFlowCreate,
  batchFlowUpdate,
  flowBatchDelete,
  queryFlowData,
  retrieveFlowData
} from "../../Utils/FlowTableServiceUtil";
import { PreviewModal } from "../../PreviewModal";
import { createFlowDataList } from "../../PreviewModal/test/PreviewUtil.test";

jest.mock("../../Utils/FlowTableServiceUtil", () => ({
  batchDeleteItems: jest.fn(),
  batchFlowCreate: jest.fn(),
  batchFlowUpdate: jest.fn(),
  flowBatchDelete: jest.fn(),
  queryFlowData: jest.fn(),
  retrieveFlowData: jest.fn()
}));
jest.mock("@mui/x-data-grid",()=>({
  __esModule: true,
  DataGrid: jest.fn(),
  GridToolbar: jest.fn(),
  GridRenderCellParams: jest.fn(),
  useGridApiRef: jest.fn().mockReturnValue({
    current: {
      setRowSelectionModel: jest.fn().mockReturnValue({
        failure: [],
        success: [],
        flag: false
      })
    }
  })
}));

jest.mock("components", ()=>({
  __esModule: true,
  CustomToast: jest.fn()
}));

jest.mock("../../CustomActions", () => ({
  __esModule: true,
  AddFlow: jest.fn(),
  AdvanceSearchModal: jest.fn(),
  CustomFlowGridToolBar: jest.fn(),
  EditFlow: jest.fn()
}));

jest.mock("context", () => ({
  useAdminState: jest.fn()
}));

jest.mock("../../PreviewModal", ()=>({
  __esModule: true,
  PreviewModal: jest.fn()
}));

const flowFormatList = flowList=>{
  const flowData= {
    data: {
      listCctSharedCallFlowDbs: {
        items: flowList
      }
    }
  };
  return flowData;
};

const filteredItems = {
  brand: "brand1",
  channel: ""
};

const renderComponent = () => render(
  <DataGridFlow accessToken="Token123" matchedGroups="[]"/>,
  initialTestState
);

describe("<DataGridFlow />", () => {
  const matchMedia = window.matchMedia;
  beforeEach(()=>{
    jest.clearAllMocks();
    batchDeleteItems.mockReset();
    batchFlowCreate.mockReset();
    batchFlowUpdate.mockReset();
    flowBatchDelete.mockReset();
    queryFlowData.mockReset();
    retrieveFlowData.mockReset();
    useAdminState.mockReturnValue(initialTestState);
    setupMockedComponents({
      DataGrid,
      GridToolbar,
      GridRenderCellParams,
      AdvanceSearchModal,
      EditFlow,
      AddFlow,
      CustomToast,
      CustomFlowGridToolBar,
      PreviewModal
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
    sessionStorage.removeItem(CALL_FLOW_PER_PAGE);
    sessionStorage.removeItem(CALL_FLOW_PAGE_NO);
  });

  afterEach(()=>{
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: matchMedia
    });
  });
  describe("Data Table Footer", ()=>{
    test("Simulate Data Table Pagination", async () =>{
      const validFlowDataList = createFlowDataList(15);
      queryFlowData.mockResolvedValue(flowFormatList(validFlowDataList));
      retrieveFlowData.mockResolvedValue(validFlowDataList);
      renderComponent();
      expect(DataGrid.mock.calls[0][0].paginationModel.page).toBe(1);
      expect(DataGrid.mock.calls[0][0].paginationModel.pageSize).toBe(10);
    });

    test("Simulate Change Rows Per Page", async () => {
      const validFlowDataList = createFlowDataList(15);
      queryFlowData.mockResolvedValue(flowFormatList(validFlowDataList));
      retrieveFlowData.mockResolvedValue(validFlowDataList);
      renderComponent();
      const onPageSizeChange = DataGrid.mock.calls[0][0].onPaginationModelChange;
      act(()=>{ onPageSizeChange({
        page: 1,
        pageSize: 20
      }); });
      expect(DataGrid.mock.calls[DataGrid.mock.calls.length-1][0].paginationModel.page).toBe(1);
      expect(DataGrid.mock.calls[DataGrid.mock.calls.length-1][0].paginationModel.pageSize).toBe(20);
    });

    test("Simulate Change Go to Next Page", async () => {
      const validFlowDataList = createFlowDataList(15);
      queryFlowData.mockResolvedValue(flowFormatList(validFlowDataList));
      retrieveFlowData.mockResolvedValue(validFlowDataList);
      renderComponent();
      const onPageChange = DataGrid.mock.calls[0][0].onPaginationModelChange;
      act(()=>{ onPageChange({
        page: 2,
        pageSize: 10
      }); });
      expect(DataGrid.mock.calls[2][0].paginationModel.page).toBe(2);
      expect(DataGrid.mock.calls[2][0].paginationModel.pageSize).toBe(10);
    });

    test("Simulate Change Go to previous Page", async () => {
      const validFlowDataList = createFlowDataList(15);
      queryFlowData.mockResolvedValue(flowFormatList(validFlowDataList));
      retrieveFlowData.mockResolvedValue(validFlowDataList);
      renderComponent();
      const onPageChange = DataGrid.mock.calls[1][0].onPaginationModelChange;
      act(()=>{
        onPageChange({
          page: 2,
          pageSize: 10
        });
      });
      const onPageChangeSecond = DataGrid.mock.calls[2][0].onPaginationModelChange;
      act(()=>{
        onPageChangeSecond({
          page: 1,
          pageSize: 10
        });
      });
      expect(DataGrid.mock.calls[3][0].paginationModel.page).toBe(1);
    });
  });

  describe("Check the Add Flow from FlowCustomAction", ()=>{
    test("Simulate the AddFlow Render", ()=>{
      const validFlowDataList = createFlowDataList(15);
      queryFlowData.mockResolvedValue(flowFormatList(validFlowDataList));
      retrieveFlowData.mockResolvedValue(validFlowDataList);
      renderComponent();
      expect(AddFlow.mock.calls[0][0].newId).toBe(1);
    });
    test("Simulate the AddFlow openModal", ()=>{
      const validFlowDataList = createFlowDataList(15);
      queryFlowData.mockResolvedValue(flowFormatList(validFlowDataList));
      retrieveFlowData.mockResolvedValue(validFlowDataList);
      renderComponent();
      const openModal = AddFlow.mock.calls[0][0].openAddModal;
      act(()=>{ openModal(false,true,{},true); });
      expect(AddFlow.mock.calls[1][0].openAddModal).toBeTruthy;
    });
    test("Simulate the AddFlow openModal isOpen true", ()=>{
      const validFlowDataList = createFlowDataList(15);
      queryFlowData.mockResolvedValue(flowFormatList(validFlowDataList));
      retrieveFlowData.mockResolvedValue(validFlowDataList);
      renderComponent();
      const openModal = AddFlow.mock.calls[0][0].openAddModal;
      act(()=>{ openModal(true); });
      expect(AddFlow.mock.calls[2][0].isOpen).toBe(true);
    });
    test("Simulate the AddFlow openModal isOpen false, true", ()=>{
      retrieveFlowData.mockResolvedValue(false);
      renderComponent();
      const openModal = AddFlow.mock.calls[1][0].openAddModal;
      act(()=>{ openModal(false, true); });
      expect(CustomToast.mock.calls[2][0].open).toBe(true);
    });
    test("Simulate the AddFlow duplicate Check", ()=>{
      const validFlowDataList = createFlowDataList(15);
      queryFlowData.mockResolvedValue(flowFormatList(validFlowDataList));
      retrieveFlowData.mockResolvedValue(validFlowDataList);
      renderComponent();
      const duplicateCheck = AddFlow.mock.calls[0][0].duplicateCheck;
      const params = {
        ...validFlowDataList[2],
        employeeId: {
          value: "n3"
        },
        pkey: {
          value: validFlowDataList[2].pkey
        }
      };
      const duplicateCheckObj = duplicateCheck(params);
      expect(duplicateCheckObj.isDuplicate).toBe(false);
    });
    test("Simulate the Edit Flow duplicate Check", ()=>{
      const validFlowDataList = createFlowDataList(15);
      queryFlowData.mockResolvedValue(flowFormatList(validFlowDataList));
      retrieveFlowData.mockResolvedValue(validFlowDataList);
      renderComponent();
      const duplicateCheck = EditFlow.mock.calls[0][0].duplicateCheck;
      const params = {
        ...validFlowDataList[2],
        employeeId: {
          value: "n3"
        },
        pkey: {
          value: validFlowDataList[2].pkey
        }
      };
      const duplicateCheckObj = duplicateCheck(params);
      expect(duplicateCheckObj.isDuplicate).toBe(false);
    });
  });

  describe("Check the Edit Flow from FlowCustomAction", ()=>{
    test("Simulate the EditFlow Render", ()=>{
      const validFlowDataList = createFlowDataList(15);
      queryFlowData.mockResolvedValue(flowFormatList(validFlowDataList));
      retrieveFlowData.mockResolvedValue(validFlowDataList);
      renderComponent();
      expect(EditFlow.mock.calls[0][0].isOpen).toBe(false);
      expect(EditFlow.mock.calls[0][0].selectedRow).toBeUndefined;
    });
    test("Simulate the EditFlow openEditModal onSubmitted true", ()=>{
      const validFlowDataList = createFlowDataList(15);
      queryFlowData.mockResolvedValue(flowFormatList(validFlowDataList));
      retrieveFlowData.mockResolvedValue(validFlowDataList);
      renderComponent();
      const openEditModal = EditFlow.mock.calls[0][0].openEditModal;
      act(()=>{ openEditModal(false, true); });
      expect(EditFlow.mock.calls[1][0].openEditModal).toBeTruthy;
    });
    test("Simulate the EditFlow openEditModal onDeleteRow true", ()=>{
      const validFlowDataList = createFlowDataList(15);
      queryFlowData.mockResolvedValue(flowFormatList(validFlowDataList));
      retrieveFlowData.mockResolvedValue(validFlowDataList);
      renderComponent();
      const openEditModal = EditFlow.mock.calls[0][0].openEditModal;
      act(()=>{ openEditModal(false, true,{},"",true,false); });
      act(()=>{ openEditModal(false, true,{},"",false,false); });
      expect(EditFlow.mock.calls[1][0].openEditModal).toBeTruthy();
    });
    test("Simulate the EditFlow openEditModal", ()=>{
      const validFlowDataList = createFlowDataList(15);
      queryFlowData.mockResolvedValue(flowFormatList(validFlowDataList));
      retrieveFlowData.mockResolvedValue(validFlowDataList);
      renderComponent();
      const openEditModal = EditFlow.mock.calls[0][0].openEditModal;
      act(()=>{ openEditModal(true, false); });
      expect(EditFlow.mock.calls[1][0].openEditModal).toBeTruthy;
    });
    test("Simulate the EditFlow openEditModal wih clonedFlowRule", ()=>{
      const flowData = {
        id: 1,
        pkey: "+18005551212",
        brand: "brand",
        callFlowTemplate: "cft",
        channel: "channel"
      };
      const validFlowDataList = createFlowDataList(15);
      queryFlowData.mockResolvedValue(flowFormatList(validFlowDataList));
      retrieveFlowData.mockResolvedValue(validFlowDataList);
      renderComponent();
      const openEditModal = EditFlow.mock.calls[0][0].openEditModal;
      act(()=>{ openEditModal(true, false,flowData,"",false,true); });
      expect(EditFlow.mock.calls[1][0].openEditModal).toBeTruthy;
    });
    test("Simulate the CustomFlowGridToolBar Custom Routing Toolbar", async()=>{
      const validFlowDataList = createFlowDataList(15);
      queryFlowData.mockResolvedValue(flowFormatList(validFlowDataList));
      retrieveFlowData.mockResolvedValue(validFlowDataList);
      renderComponent();
      const exportDataFile = CustomFlowGridToolBar.mock.calls[0][0].exportDataFile;
      act(()=>{ exportDataFile(); });
      expect(CustomFlowGridToolBar.mock.calls.length).toBe(2);
    });
    test("Simulate the CustomFlowGridToolBar Preview Modal Open", ()=>{
      const validFlowDataList = createFlowDataList(15);
      queryFlowData.mockResolvedValue(flowFormatList(validFlowDataList));
      retrieveFlowData.mockResolvedValue(validFlowDataList);
      renderComponent();
      const openPreviewModal = CustomFlowGridToolBar.mock.calls[0][0].openPreviewModal;
      act(()=>{ openPreviewModal(true, "delete"); });
    });
  });

  describe("Check Existing Filter", ()=>{
    beforeEach(()=>{
      localStorage.setItem(CACHE_FILTER_FLOW, JSON.stringify(filteredItems));
    });
    afterEach(()=>{
      localStorage.removeItem(CACHE_FILTER_FLOW);
    });
    test("Simulate Channel in Existing Filtered Item", ()=>{
      const validFlowDataList = createFlowDataList(15);
      queryFlowData.mockResolvedValue(flowFormatList(validFlowDataList));
      retrieveFlowData.mockResolvedValue(validFlowDataList);
      renderComponent();
      expect(DataGrid.mock.calls[0][0].paginationModel.page).toBe(1);
    });
    test("Simulate Empty Filtered Item",()=>{
      const validFlowDataList = createFlowDataList(15);
      queryFlowData.mockResolvedValue(flowFormatList(validFlowDataList));
      retrieveFlowData.mockResolvedValue(validFlowDataList);
      localStorage.clear();
      renderComponent();
      expect(DataGrid.mock.calls[0][0].paginationModel.page).toBe(1);
    });
    test("Simulate openAdvanceSearchModal", ()=>{
      const validFlowDataList = createFlowDataList(15);
      queryFlowData.mockResolvedValue(flowFormatList(validFlowDataList));
      retrieveFlowData.mockResolvedValue(validFlowDataList);
      renderComponent();
      const openModal = AdvanceSearchModal.mock.calls[0][0].openModal;
      act(()=>{ openModal(true, { channel: "channel1" }); });
      expect(AdvanceSearchModal.mock.calls[2][0].isOpen).toBe(true);
      const handleClose = AdvanceSearchModal.mock.calls[1][0].onClose;
      act(()=>{ handleClose(true); });
      expect(AdvanceSearchModal.mock.calls[3][0].isOpen).toBe(false);
    });
    test("Simulate openAdvanceSearchModal applyFilter props", ()=>{
      const validFlowDataList = createFlowDataList(15);
      queryFlowData.mockResolvedValue(flowFormatList(validFlowDataList));
      retrieveFlowData.mockResolvedValue(validFlowDataList);
      renderComponent();
      const applyFilter = AdvanceSearchModal.mock.calls[0][0].applyFilter;
      act(()=>{ applyFilter(); });
      expect(AdvanceSearchModal.mock.calls[1][0].isOpen).toBe(false);
    });
    test("Simulate openAdvanceSearchModal handleChange", ()=>{
      //TODO I'm not sure this test is working as expected.  I had to set filteredItems = {brand: brand1}
      const validFlowDataList = createFlowDataList(15);
      queryFlowData.mockResolvedValue(flowFormatList(validFlowDataList));
      retrieveFlowData.mockResolvedValue(validFlowDataList);
      renderComponent();
      const handleChange = AdvanceSearchModal.mock.calls[0][0].handleChange;
      const brandValue = "brand1";
      const brandKey = "brand";
      const testEvent = {
        target: {
          value: brandValue,
          name: brandKey
        }
      };
      act(()=>{ handleChange(testEvent); });
      const openModal = AdvanceSearchModal.mock.calls[1][0].openModal;
      act(()=>{ openModal(true); });
      const localStorageValue = JSON.parse(localStorage.getItem(CACHE_FILTER_FLOW));
      expect(localStorageValue[brandKey]).toBe(brandValue);
    });
    test("Simulate openAdvanceSearchModal handleChange with blank string", ()=>{
      const validFlowDataList = createFlowDataList(15);
      queryFlowData.mockResolvedValue(validFlowDataList);
      retrieveFlowData.mockResolvedValue(validFlowDataList);
      renderComponent();
      const handleChange = AdvanceSearchModal.mock.calls[0][0].handleChange;
      const brandValue = "";
      const brandKey = "brand";
      const testEvent = {
        target: {
          value: brandValue,
          name: brandKey
        }
      };
      act(()=>{ handleChange(testEvent); });
      const openModal = AdvanceSearchModal.mock.calls[1][0].openModal;
      act(()=>{ openModal(true); });
      const localStorageValue = JSON.parse(localStorage.getItem(CACHE_FILTER_FLOW));
      expect(localStorageValue[brandKey]).toBeUndefined;
    });
    test("Simulate advanceFilter", () => {
      //TODO, this is adding to code coverage - can we validate anything about the filteredItems min max range?
      const validFlowDataList = createFlowDataList(15);
      queryFlowData.mockResolvedValue(flowFormatList(validFlowDataList));
      retrieveFlowData.mockResolvedValue(validFlowDataList);
      localStorage.setItem(CACHE_FILTER_FLOW, JSON.stringify({
        ...filteredItems,
        callFlowRoute: "route A1",
        pkey: "+18005551212x1"
      }));
      renderComponent();
      expect(DataGrid.mock.calls[0][0].paginationModel.page).toBe(1);
      const applyFilter = AdvanceSearchModal.mock.calls[0][0].applyFilter;
      act(()=>{ applyFilter(); });
      expect(AdvanceSearchModal.mock.calls[1][0].isOpen).toBe(false);
    });
    test("Simulate advanceFilter error", () => {
      const validFlowDataList = createFlowDataList(15);
      queryFlowData.mockResolvedValue(flowFormatList(validFlowDataList));
      retrieveFlowData.mockResolvedValue(validFlowDataList);
      localStorage.setItem(CACHE_FILTER_FLOW, "");
      renderComponent();
      expect(DataGrid.mock.calls[0][0].paginationModel.page).toBe(1);
    });
    test("Simulate advanceFilter empty result", () => {
      const validFlowDataList = createFlowDataList(15);
      queryFlowData.mockResolvedValue(flowFormatList(validFlowDataList));
      retrieveFlowData.mockResolvedValue(validFlowDataList);
      localStorage.setItem(CACHE_FILTER_FLOW, JSON.stringify({
        ...filteredItems,
        brand: "brandXYZ not in list"
      }));
      renderComponent();
      expect(DataGrid.mock.calls[0][0].paginationModel.page).toBe(1);
    });
  });

  describe("Different Data Load", ()=>{
    test("Simulate DataGrid with Empty Data",()=>{
      const validFlowDataList = createFlowDataList(0);
      queryFlowData.mockResolvedValue(flowFormatList(validFlowDataList));
      retrieveFlowData.mockResolvedValue(validFlowDataList);
      renderComponent();
      expect(DataGrid.mock.calls[0][0].paginationModel.page).toBe(1);
    });
    test("Simulate AdvanceSearchModal applyFilter with no filter", ()=>{
      const validRoutingDataList = createFlowDataList(15);
      queryFlowData.mockResolvedValue(validRoutingDataList);
      retrieveFlowData.mockResolvedValue(validRoutingDataList);
      renderComponent();
      const applyFilter = AdvanceSearchModal.mock.calls[0][0].applyFilter;
      act(()=>{ applyFilter(); });
      expect(AdvanceSearchModal.mock.calls[1][0].isOpen).toBe(false);
    });
    test("Simulate CustomToast",()=>{
      const validFlowDataList = createFlowDataList(1);
      queryFlowData.mockResolvedValue(flowFormatList(validFlowDataList));
      retrieveFlowData.mockResolvedValue(validFlowDataList);
      renderComponent();
      const handleClose = CustomToast.mock.calls[0][0].onClose;
      act(()=>{ handleClose(true); });
      expect(CustomToast.mock.calls[1][0].open).toBe(true);
    });
    test("Simulate click on hyperlink",()=>{
      const validRoutingDataList = createFlowDataList(15);
      queryFlowData.mockResolvedValue(validRoutingDataList);
      retrieveFlowData.mockResolvedValue(validRoutingDataList);
      renderComponent();
      const hyperLinkFunction = DataGrid.mock.calls[0][0].columns[0].renderCell;
      const hyperLinkParams = {
        row: validRoutingDataList[0],
        value: validRoutingDataList[0].id
      };
      const hyperlink = hyperLinkFunction(hyperLinkParams);
      const renderedHyperLink = quickRender(hyperlink);
      fireEvent.click(renderedHyperLink.getByRole("link"));
      expect(EditFlow.mock.calls[0][0].isOpen).toBe(false);
    });
  });
  describe("PreviewModal", ()=>{
    it("Preview Modal onClose", ()=>{
      const validFlowDataList = createFlowDataList(15);
      queryFlowData.mockResolvedValue(flowFormatList(validFlowDataList));
      retrieveFlowData.mockResolvedValue(validFlowDataList);
      renderComponent();
      const previewModalOnClose = PreviewModal.mock.calls[0][0].onClose;
      act(()=>{
        previewModalOnClose();
      });
      expect(PreviewModal.mock.calls.length).toBe(3);
    });
    it("Preview Modal onUpdate success", ()=>{
      const validFlowDataList = createFlowDataList(15);
      queryFlowData.mockResolvedValue(flowFormatList(validFlowDataList));
      retrieveFlowData.mockResolvedValue(validFlowDataList);
      batchFlowUpdate.mockResolvedValue({ flag: false });
      renderComponent();
      const previewModalOnUpdate = PreviewModal.mock.calls[0][0].onUpdate;
      act(()=>{
        previewModalOnUpdate([{ ...validFlowDataList[1] }]);
      });
      expect(DataGrid.mock.calls.length).toBe(2);
    });
    it("Preview Modal onUpdate error", ()=>{
      const validFlowDataList = createFlowDataList(15);
      queryFlowData.mockResolvedValue(flowFormatList(validFlowDataList));
      retrieveFlowData.mockResolvedValue(validFlowDataList);
      batchFlowUpdate.mockResolvedValue({ flag: true });
      renderComponent();
      const previewModalOnUpdate = PreviewModal.mock.calls[0][0].onUpdate;
      expect(previewModalOnUpdate).toBeTruthy();
      expect(DataGrid.mock.calls.length).toBe(2);
    });
    it("Preview Modal onCreate Success", ()=>{
      const validFlowDataList = createFlowDataList(15);
      queryFlowData.mockResolvedValue(flowFormatList(validFlowDataList));
      retrieveFlowData.mockResolvedValue(validFlowDataList);
      batchFlowCreate.mockResolvedValue({
        flag: false,
        success: validFlowDataList,
        failure: []
      });
      renderComponent();
      const previewModalOnCreate = PreviewModal.mock.calls[0][0].onCreate;
      act(()=>{
        previewModalOnCreate([{ ...validFlowDataList[1] }]);
      });
      expect(DataGrid.mock.calls.length).toBe(2);
    });
    it("Preview Modal onCreate Failure", ()=>{
      const validFlowDataList = createFlowDataList(15);
      queryFlowData.mockResolvedValue(flowFormatList(validFlowDataList));
      retrieveFlowData.mockResolvedValue(validFlowDataList);
      batchFlowCreate.mockResolvedValue({
        flag: true,
        failure: validFlowDataList,
        success: []
      });
      renderComponent();
      const previewModalOnCreate = PreviewModal.mock.calls[0][0].onCreate;
      act(()=>{
        previewModalOnCreate([{ ...validFlowDataList[1] }]);
      });
      expect(DataGrid.mock.calls.length).toBe(2);
    });
    it("Preview Modal onDelete", ()=>{
      const validFlowDataList = createFlowDataList(15);
      queryFlowData.mockResolvedValue(flowFormatList(validFlowDataList));
      retrieveFlowData.mockResolvedValue(validFlowDataList);
      renderComponent();
      const previewModalOnDelete = PreviewModal.mock.calls[0][0].onDelete;
      const selectedRow = createFlowDataList(2);
      batchDeleteItems.mockResolvedValue({
        failure: [],
        success: [],
        flag: false
      });
      act(()=>{
        previewModalOnDelete(selectedRow);
      });
      expect(DataGrid.mock.calls.length).toBe(2);
    });
    it("Preview Modal onDelete", ()=>{
      const validFlowDataList = createFlowDataList(15);
      queryFlowData.mockResolvedValue(flowFormatList(validFlowDataList));
      retrieveFlowData.mockResolvedValue(validFlowDataList);
      renderComponent();
      const previewModalOnDelete = PreviewModal.mock.calls[0][0].onDelete;
      const selectedRow = createFlowDataList(2);
      batchDeleteItems.mockResolvedValue({
        response: {
          flag: true
        }
      });
      expect(previewModalOnDelete(selectedRow)).toBeTruthy();
    });
  });

  describe("Selection", ()=>{
    it("Select row checkbox", ()=>{
      const validFlowDataList = createFlowDataList(15);
      queryFlowData.mockResolvedValue(flowFormatList(validFlowDataList));
      retrieveFlowData.mockResolvedValue(validFlowDataList);
      renderComponent();
      const onRowSelectionModelChange = DataGrid.mock.calls[0][0].onRowSelectionModelChange;
      const selectedRows = [validFlowDataList[1].pkey];
      act(()=>{
        onRowSelectionModelChange(selectedRows);
      });
      expect(DataGrid.mock.calls.length).toBe(3);
    });
    it("getRowId", ()=>{
      const validFlowDataList = createFlowDataList(15);
      queryFlowData.mockResolvedValue(flowFormatList(validFlowDataList));
      retrieveFlowData.mockResolvedValue(validFlowDataList);
      renderComponent();
      const getRowId = DataGrid.mock.calls[0][0].getRowId;
      const selectedRows = validFlowDataList[1];
      const rowId = getRowId(selectedRows);
      expect(rowId).toBe(validFlowDataList[1].pkey);
    });
  });
});

