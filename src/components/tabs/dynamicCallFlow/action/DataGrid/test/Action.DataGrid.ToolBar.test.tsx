import { Grid } from "@mui/material";
import { GridApiCommunity } from "@mui/x-data-grid/models/api/gridApiCommunity";
import { AlertBarController } from "components/tabs/dynamicCallFlow/common/AlertBar.Controller";
import { Filter } from "components/tabs/dynamicCallFlow/common/DataGrid/Abstract.DataGrid.Filter";
import ModalController from "components/tabs/dynamicCallFlow/common/Modal.Controller";
import {
  ActionModalType, ActionModalTypeEnum
} from "dynamicCallFlowAction/DataGrid/Action.DataGrid.Component";
import { ActionDataGridController } from "dynamicCallFlowAction/DataGrid/Action.DataGrid.Controller";
import { ActionDataGridFilter } from "dynamicCallFlowAction/DataGrid/Action.DataGrid.Filter";
import {
  ActionDataGridToolBar
} from "dynamicCallFlowAction/DataGrid/Action.DataGrid.ToolBar";
import { CALL_FLOW_NAME } from "dynamicCallFlowAction/Form/ActionFields";
import {
  mockContextAppContextMock, waitForElementToRender
} from "dynamicCallFlowCommon/test/DynamicCallFlow.Testing.Util";
import { CallFlowNameTypeEnum } from "dynamicCallFlowPhoneNumber/GraphQL/Dynamic.PhoneNumber.Interfaces";
import React, {
  ReactElement
} from "react";
import { DynamicCallFlowActionContext } from "../../DynamicCallFlow.Action.Container";

jest.mock("@mui/material", () => {
  const originalFunctionality = jest.requireActual("@mui/material");
  return {
    ...originalFunctionality,
    Grid: jest.fn(),
    Chip: jest.fn(),
    FormControl: jest.fn(),
    IconButton: jest.fn(),
    InputLabel: jest.fn(),
    MenuItem: jest.fn(),
    Select: jest.fn(),
    TextField: jest.fn(),
    Tooltip: jest.fn()
  };
});
jest.mock("components/tabs/dynamicCallFlow/common/DynamicCallFlow.Authentication", () => {
  const originalFunctionality = jest.requireActual("components/tabs/dynamicCallFlow/common/DynamicCallFlow.Authentication");
  return {
    ...originalFunctionality,
    userDoesNotHaveReadWriteAccess: jest.fn().mockReturnValue(false)
  };
});

const DataGridComponentTestId = "phoneNumberDataGridComponent";
function createActionDataGridToolBarElement(): ReactElement {
  const modalController = new ModalController<ActionModalType>();
  modalController.setOpenModalRef(jest.fn());
  return (
    <div data-testid={DataGridComponentTestId}>
      <DynamicCallFlowActionContext.Provider value={ {
        accessTokenGraph: mockContextAppContextMock.userContext.tokens.sharedGraph,
        permissions: mockContextAppContextMock.userContext.permissions,
        currentOpenModal: ActionModalTypeEnum.Filter,
        modalController: { current: modalController }
      } }>
        <ActionDataGridToolBar
          isFilterModalOpen={false}
          dataGridFilter={{ current: new ActionDataGridFilter(jest.fn()) }}
          dataGridController={{
            current: new ActionDataGridController(
              { current: jest.fn() as unknown as GridApiCommunity },
              { current: new ActionDataGridFilter(jest.fn()) },
              { current: new AlertBarController(jest.fn()) }
            )
          }}
          handlePreviewModalOpen={jest.fn()}
        />
      </DynamicCallFlowActionContext.Provider>
    </div>);
}

describe("Action.DataGrid.ToolBar", () => {
  const mockSetLocalFilter = jest.fn();
  const mockFilterName = CALL_FLOW_NAME;
  const mockFilterValue = CallFlowNameTypeEnum.LSC;
  const mockFilter: Filter = {
    [mockFilterName]: mockFilterValue
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("Initial load", () => {
    let dataGridFilterGetFilterSpy: jest.SpyInstance;

    beforeEach(async () => {
      jest.spyOn(React, "useState").mockReturnValue([{}, mockSetLocalFilter]);
      dataGridFilterGetFilterSpy = jest.spyOn(ActionDataGridFilter.prototype, "getFilter").mockReturnValue(mockFilter);
      await waitForElementToRender(createActionDataGridToolBarElement(), DataGridComponentTestId);
    });

    it("should set filter state to the filter returned from the instance of ActionDataGridFilter", () => {
      expect(dataGridFilterGetFilterSpy).toHaveBeenCalledTimes(1);
      expect(mockSetLocalFilter).toHaveBeenCalledWith(mockFilter);
    });

  });

  describe("Filter attribute removal", () => {
    let dataGridFilterRemoveFilterElementSpy: jest.SpyInstance;
    let dataGridFilterApplyFilterSpy: jest.SpyInstance;

    beforeEach(async () => {
      jest.spyOn(React, "useState").mockReturnValue([mockFilter, mockSetLocalFilter]);
      dataGridFilterRemoveFilterElementSpy = jest.spyOn(ActionDataGridFilter.prototype, "removeFilterElement");
      dataGridFilterApplyFilterSpy = jest.spyOn(ActionDataGridFilter.prototype, "applyFilter");
      await waitForElementToRender(createActionDataGridToolBarElement(), DataGridComponentTestId);
    });

    it("should remove the filter element from the filter state and apply the filter", () => {
      // Access the removeFilterElement function passed to the TextField component rendered as a grandchild of Grid:
      const removeFilterElementFunction: () => void = (Grid as jest.Mock).mock.calls[0][0].children[0].props.children.props.InputProps.startAdornment[0].props.onDelete;
      // Simulate filter attribute removal:
      removeFilterElementFunction();

      expect(dataGridFilterRemoveFilterElementSpy).toHaveBeenCalledWith(mockFilterName);
      expect(dataGridFilterApplyFilterSpy).toHaveBeenCalled();
      expect(mockSetLocalFilter).toHaveBeenLastCalledWith({});
    });
  });

  describe("Filter modal management", () => {
    let modalControllerOpenModalSpy: jest.SpyInstance;

    beforeEach(async () => {
      modalControllerOpenModalSpy = jest.spyOn(ModalController.prototype, "openModal");
      await waitForElementToRender(createActionDataGridToolBarElement(), DataGridComponentTestId);
    });

    it("should open the filter modal when the search box is clicked", () => {
      // Access the onClick function passed to the TextField component rendered as a grandchild of Grid:
      const searchFieldOnClickFunction: () => void = (Grid as jest.Mock).mock.calls[0][0].children[0].props.children.props.onClick;
      // Simulate search box click:
      searchFieldOnClickFunction();

      expect(modalControllerOpenModalSpy).toHaveBeenCalledWith(ActionModalTypeEnum.Filter);
    });
  });

  // describe("Spreadsheet export functionality", () => {
  //   let actionXlsxExporterExportXlsxFilesSpy: jest.SpyInstance;
  //
  //   beforeEach(async () => {
  //     actionXlsxExporterExportXlsxFilesSpy = jest.spyOn(ActionXlsxExporter.prototype, "exportXlsxFiles").mockImplementation(jest.fn());
  //     await waitForElementToRender(createActionDataGridToolBarElement());
  //   });
  //
  //   it("should call the exportXlsxFiles method on the instance of ActionXlsxExporter when the export button is clicked", async () => {
  //     // Access the exportDataFile function passed to the IconButton component rendered as a child of Grid:
  //     const exportDataFileFunction: () => void = (Grid as jest.Mock).mock.calls[0][0].children[1].props.children.props.children.props.onClick;
  //     expect(exportDataFileFunction).toBeDefined();
  //     // Simulate export button click:
  //     exportDataFileFunction();
  //
  //     expect(actionXlsxExporterExportXlsxFilesSpy).toHaveBeenCalled();
  //   });
  // });
});
