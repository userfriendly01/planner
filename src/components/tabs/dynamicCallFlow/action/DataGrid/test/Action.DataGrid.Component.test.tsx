import React, { ReactElement } from "react";
import DynamicCallFlowActionContainer from "dynamicCallFlowAction/DynamicCallFlow.Action.Container";
import { MockCallFlowConfigOne } from "dynamicCallFlowAction/GraphQL/test/Action.MockData";
import { AlertBarController } from "dynamicCallFlowCommon/AlertBar.Controller";
import * as DynamicCallFlowCommonDataGrid from "dynamicCallFlowCommon/DataGrid/DynamicCallFlow.Common.DataGrid";
import { listActionRecords } from "dynamicCallFlowAction/GraphQL/List.Action.Records.Query";
import {
  DataGrid, GridPaginationModel
} from "@mui/x-data-grid";
import {
  ActionModalTypeEnum,
  DYNAMIC_CALL_FLOW_ACTION_DATA_GRID_PAGE_NUMBER, DYNAMIC_CALL_FLOW_ACTION_DATA_GRID_RECORDS_PER_PAGE
} from "dynamicCallFlowAction/DataGrid/Action.DataGrid.Component";
import { ActionDataGridToolBar } from "dynamicCallFlowAction/DataGrid/Action.DataGrid.ToolBar";
import { ActionPreviewModal } from "dynamicCallFlowAction/PreviewModal/Action.Preview.Modal.Component";
import {
  mockContextAppContextMock,
  waitForElementToRender
} from "dynamicCallFlowCommon/test/DynamicCallFlow.Testing.Util";

jest.mock("@mui/x-data-grid", () => ({
  DataGrid: jest.fn(),
  GridPaginationModel: jest.fn(),
  GridRenderCellParams: jest.fn(),
  useGridApiRef: jest.fn().mockReturnValue({
    current: {
      getSelectedRows: jest.fn().mockReturnValue({ values: (): [] => []}),
      setRowSelectionModel: jest.fn()
    }
  })
}));
jest.mock("@mui/x-data-grid/internals", () => ({
  GridApiCommunity: jest.fn()
}));
jest.mock("dynamicCallFlowAction/DataGrid/Action.DataGrid.ToolBar", () => ({
  ActionDataGridToolBar: jest.fn()
}));
jest.mock("dynamicCallFlowAction/PreviewModal/Action.Preview.Modal.Component", () => ({
  ActionPreviewModal: jest.fn()
}));
jest.mock("dynamicCallFlowAction/DataGrid/Action.DataGrid.Filter.Modal", () => ({
  ActionDataGridFilterModal: jest.fn()
}));
jest.mock("components/core/CustomToast/CustomToast", () => ({
  CustomToast: jest.fn()
}));
jest.mock("dynamicCallFlowAction/GraphQL/List.Action.Records.Query", () => ({
  listActionRecords: jest.fn().mockImplementation(() => MockCallFlowConfigOne)
}));
jest.mock("dynamicCallFlowCommon/Util/Array.Util", () => ({
  updateElementsInArray: jest.fn()
}));

jest.mock("context/appContext", () => ({
  useAdminState: jest.fn().mockImplementation(() => {
    return mockContextAppContextMock;
  })
}));

const DataGridComponentTestId = "actionDataGridComponent";
const ContainerElement: ReactElement = <div data-testid={DataGridComponentTestId}><DynamicCallFlowActionContainer /></div>;

describe("Action.DataGrid.Component", () => {
  let alertBarControllerInfoSpy: jest.SpyInstance;
  let alertBarControllerSuccessSpy: jest.SpyInstance;
  let alertBarControllerWarningSpy: jest.SpyInstance;
  let alertBarControllerErrorSpy: jest.SpyInstance;
  let sortRecordsSpy: jest.SpyInstance;

  beforeEach(() => {
    alertBarControllerInfoSpy = jest.spyOn(AlertBarController.prototype, "info");
    alertBarControllerSuccessSpy = jest.spyOn(AlertBarController.prototype, "success");
    alertBarControllerWarningSpy = jest.spyOn(AlertBarController.prototype, "warning");
    alertBarControllerErrorSpy = jest.spyOn(AlertBarController.prototype, "error");
    sortRecordsSpy = jest.spyOn(DynamicCallFlowCommonDataGrid, "sortRecords");
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("initial load", () => {
    describe("successful path", () => {
      it("should fetch and sort call flow configurations and then notify the user", async () => {
        await waitForElementToRender(ContainerElement, DataGridComponentTestId);

        expect(listActionRecords).toHaveBeenCalledTimes(1);
        expect(alertBarControllerInfoSpy).toHaveBeenCalledWith("Call Flow Configurations load in progress. Please wait for the complete set of data to be loaded.");
        expect(sortRecordsSpy).toHaveBeenCalledTimes(1);
        expect(alertBarControllerSuccessSpy).toHaveBeenCalledWith("Call Flow Configurations have been successfully loaded.");
        expect(alertBarControllerErrorSpy).toHaveBeenCalledTimes(0);
      });

      it("shouldResetAlertBarPropsToInitialValues", () => {
        const setAlertBarPropsMock = jest.fn();
        const initialAlertBarPropsMock = {
          open: false,
          msg: "",
          severityType: "info",
          duration: 3000
        };
        const handleCloseAlertBar = () => {
          setAlertBarPropsMock(initialAlertBarPropsMock);
        };

        handleCloseAlertBar();
        expect(setAlertBarPropsMock).toHaveBeenCalledWith(initialAlertBarPropsMock);
      });
    });

    describe("Pagination", () => {
      let sessionStorageSpy: jest.SpyInstance;

      beforeEach(() => {
        sessionStorageSpy = jest.spyOn(Storage.prototype, "setItem");
      });

      it("should store pagination data in sessionStorage", async () => {
        await waitForElementToRender(ContainerElement, DataGridComponentTestId);

        // Access the onPaginationModelChange function passed to the DataGrid component:
        const handlePaginationModelChange: (model: GridPaginationModel) => void = (DataGrid as jest.Mock).mock.calls[0][0].onPaginationModelChange;
        // Simulate a change in the pagination model:
        handlePaginationModelChange({
          page: 1,
          pageSize: 25
        });

        expect(sessionStorageSpy).toHaveBeenCalledWith(DYNAMIC_CALL_FLOW_ACTION_DATA_GRID_PAGE_NUMBER, "1");
        expect(sessionStorageSpy).toHaveBeenCalledWith(DYNAMIC_CALL_FLOW_ACTION_DATA_GRID_RECORDS_PER_PAGE, "25");
      });
    });

    describe("test functions", () => {
      it("should display bulk manipulation action modals", async () => {
        await waitForElementToRender(ContainerElement, DataGridComponentTestId);
        // Access the handleModalOpen function passed to the PhoneNumberDataGridToolBar component:
        const handlePreviewModalOpenFunction: (event: any) => void = (ActionDataGridToolBar as jest.Mock).mock.calls[0][0].handlePreviewModalOpen;
        // Simulate the opening of the bulk add phone number modal:
        handlePreviewModalOpenFunction({ target: { value: ActionModalTypeEnum.BatchCreate }});

        expect(ActionPreviewModal as jest.Mock).toHaveBeenCalledWith(expect.objectContaining({
          isOpen: true,
          modalType: ActionModalTypeEnum.BatchCreate
        }), {});
      });

      // it("shouldNotThrowErrorWhenModalControllerIsNull", async () => {
      //   const result = await waitForElementToRender(ContainerElement, DataGridComponentTestId);
      //
      // const { result } = renderHook(() => useContext(DynamicCallFlowActionContext), {
      //   wrapper: ({ children }) => (
      //     <DynamicCallFlowActionContext.Provider value={{ modalController: null }}>
      //       {children}
      //     </DynamicCallFlowActionContext.Provider>
      //   )
      // });

      // expect(() => {
      //   act(() => {
      //     result.current.handlePreviewModalOpen();
      //   });
      // }).not.toThrow();
    // });
    });

    describe("failure path", () => {
      beforeEach(() => {
        (listActionRecords as jest.Mock).mockRejectedValue(new Error("My goodness, something went wrong!  What a disaster!"));
      });

      it("should notify the user when an error occurs", async () => {
        await waitForElementToRender(ContainerElement, DataGridComponentTestId);

        expect(alertBarControllerErrorSpy).toHaveBeenCalledWith("Errors loading data.  Please check the console logs.");
      });
    });
  });
});