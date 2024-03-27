import {
  CustomFlowGridToolBar
} from "../../CustomActions";
import {
  DataGrid,
  GridRenderCellParams,
  GridToolbar
} from "@mui/x-data-grid";
import {
  act,
  initialTestState,
  render,
  setupMockedComponents
} from "testUtils";
import DataGridFlow from "../DataGridFlow";
import { PreviewModal } from "../../PreviewModal";
import React from "react";
import { useAdminState } from "context";
import { createFlowDataList } from "../../../dynamicFlow/PreviewModal/test/PreviewUtil.test";
import {
  batchDynamicFlowCreate, queryDynamicFlowData
} from "services";

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
        flag: false,
        alert: ""
      })
    }
  })
}));


jest.mock("../../CustomActions", () => ({
  __esModule: true,
  CustomFlowGridToolBar: jest.fn()
}));

jest.mock("context", () => ({
  useAdminState: jest.fn()
}));

jest.mock("../../PreviewModal", ()=>({
  __esModule: true,
  PreviewModal: jest.fn()
}));

const renderComponent = () => render(
  <DataGridFlow accessToken={"Token123"} matchedGroups={[]}/>,
  initialTestState
);

describe("<DataGridFlow />", () => {
  const matchMedia = window.matchMedia;
  beforeEach(()=>{
    jest.clearAllMocks();
    queryDynamicFlowData.mockReset();
    batchDynamicFlowCreate.mockReset();
    useAdminState.mockReturnValue(initialTestState);
    setupMockedComponents({
      CustomFlowGridToolBar,
      DataGrid,
      GridRenderCellParams,
      GridToolbar,
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
  });

  afterEach(()=>{
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: matchMedia
    });
  });

  describe("PreviewModal", ()=>{
    it.skip("Preview Modal onClose", ()=>{
      renderComponent();
      const previewModalOnClose = PreviewModal.mock.calls[0][0].onClose;
      act(()=>{
        previewModalOnClose();
      });
      expect(PreviewModal.mock.calls.length).toBe(2);
    });
    it.skip("Preview Modal onCreate Success", ()=>{
      const validFlowDataList = createFlowDataList(15);
      queryDynamicFlowData.mockResolvedValue(validFlowDataList);
      batchDynamicFlowCreate.mockResolvedValue({
        flag: false,
        success: validFlowDataList,
        failure: [],
        alertMessage: ""
      });
      renderComponent();
      const openPreviewModal = CustomFlowGridToolBar.mock.calls[0][0].openPreviewModal;
      act(()=>{ openPreviewModal(true, "delete"); });
      expect(PreviewModal.mock).toBe(1);
      const previewModalOnCreate =  PreviewModal.mock.calls[0][0].onCreate;
      act(()=>{
        previewModalOnCreate([{ ...validFlowDataList[1] }]);
      });
      expect(DataGrid.mock.calls.length).toBe(1);
    });
    it.skip("Preview Modal onCreate Failure", ()=>{
      const validFlowDataList = createFlowDataList(15);
      batchDynamicFlowCreate.mockResolvedValue({
        flag: true,
        failure: validFlowDataList,
        success: [],
        alertMessage: ""
      });
      renderComponent();
      const previewModalOnCreate = PreviewModal.mock.calls[0][0].onCreate;
      act(()=>{
        previewModalOnCreate([{ ...validFlowDataList[1] }]);
      });
      expect(DataGrid.mock.calls.length).toBe(1);
    });

  });

});

