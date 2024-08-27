import { Grid } from "@mui/material";
import { GridApiCommunity } from "@mui/x-data-grid/models/api/gridApiCommunity";
import { Permissions } from "authentication/authenticationInterfaces";
import { AlertBarController } from "components/tabs/dynamicCallFlow/common/AlertBar.Controller";
import { Filter } from "components/tabs/dynamicCallFlow/common/DataGrid/Abstract.DataGrid.Filter";
import ModalController from "components/tabs/dynamicCallFlow/common/Modal.Controller";
import { Tokens } from "globals/interfaces";
import React, {
  ReactElement, useState
} from "react";
import { ActionDataGridController } from "dynamicCallFlowAction/DataGrid/Action.DataGrid.Controller";
import { ActionDataGridFilter } from "dynamicCallFlowAction/DataGrid/Action.DataGrid.Filter";
import {
  ActionDataGridToolBar
} from "dynamicCallFlowAction/DataGrid/Action.DataGrid.ToolBar";
import { ActionRecordType } from "dynamicCallFlowAction/GraphQL/Action.Interfaces";
import { CALL_FLOW_NAME } from "dynamicCallFlowAction/Form/ActionFields";
import { ActionModalTypeEnum } from "dynamicCallFlowAction/DataGrid/Action.DataGrid.Component";
import { CallFlowNameTypeEnum } from "dynamicCallFlowPhoneNumber/GraphQL/Dynamic.PhoneNumber.Interfaces";
import { waitForElementToRender } from "dynamicCallFlowCommon/test/DynamicCallFlow.Testing.Util";

const mockModalController = new ModalController<ActionRecordType>();
const mockReadPermission = Permissions.READ;
jest.mock("react", () => {
  const originalFunctionality = jest.requireActual("react");
  return {
    ...originalFunctionality,
    useState: jest.fn().mockReturnValue([{}, jest.fn()]),
    useContext: jest.fn().mockImplementation(() => {
      mockModalController.setOpenModalRef(jest.fn());
      return {
        modalController: {
          current: mockModalController
        },
        permissions: [{
          roles: [{
            name: "name",
            permissionLevel: mockReadPermission
          }],
          startup: {
            name: "name",
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            function: (dispatch: any, skillDispatch?: any, tokens?: Tokens) => Promise.resolve()
          },
          description: "description",
          authenticationProfile: {
            name: "name",
            permissionLevel: mockReadPermission,
            home: "home",
            tabs: ["tabs"]
          }
        }]
      };
    })
  };
});

const mockContent = "Mock Content";
jest.mock("@mui/material", () => {
  const originalFunctionality = jest.requireActual("@mui/material");
  return {
    ...originalFunctionality,
    Grid: jest.fn().mockImplementation(() => <div>{mockContent}</div>),
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


function createActionDataGridToolBarElement(): ReactElement {
  const actionDataGridController = new ActionDataGridController(
    { current: jest.fn() as unknown as GridApiCommunity },
    { current: new ActionDataGridFilter(jest.fn()) },
    { current: new AlertBarController(jest.fn()) }
  );
  return <ActionDataGridToolBar
    isFilterModalOpen={false}
    dataGridFilter={{ current: new ActionDataGridFilter(jest.fn()) }}
    dataGridController={{
      current: actionDataGridController
    }}
    handlePreviewModalOpen={jest.fn()}
  />;
}

// /**
//  * Renders the phone number data grid too bar component.
//  * @param { Boolean } loading The boolean value to determine if most of the component should render.
//  * @returns { RenderResult } The rendered result from the render function.
//  */
// const renderActionDataGridToolBar = (loading: boolean): RenderResult => {
//
//   return render();
// };

// /**
//  * Checks to make sure the phone number data grid filter modal has loaded by looking for a specific element.
//  * @param { RenderResult } rendered result from the render function.
//  */
// const waitForPhoneNumberDataGridToolBarToLoad = async (rendered: RenderResult) => {
//   await waitFor(() => {
//     expect(rendered.getByText(mockContent)).toBeDefined();
//   });
// };

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
      (useState as jest.Mock).mockReturnValue([{}, mockSetLocalFilter]);
      dataGridFilterGetFilterSpy = jest.spyOn(ActionDataGridFilter.prototype, "getFilter").mockReturnValue(mockFilter);
      await waitForElementToRender(createActionDataGridToolBarElement());
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
      (useState as jest.Mock).mockReturnValue([mockFilter, mockSetLocalFilter]);
      dataGridFilterRemoveFilterElementSpy = jest.spyOn(ActionDataGridFilter.prototype, "removeFilterElement");
      dataGridFilterApplyFilterSpy = jest.spyOn(ActionDataGridFilter.prototype, "applyFilter");
      await waitForElementToRender(createActionDataGridToolBarElement());
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
      await waitForElementToRender(createActionDataGridToolBarElement());
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
