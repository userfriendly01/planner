import { Grid } from "@mui/material";
import { GridApiCommunity } from "@mui/x-data-grid/models/api/gridApiCommunity";
import { Permissions } from "authentication/authenticationInterfaces";
import { AlertBarController } from "components/tabs/dynamicCallFlow/common/AlertBar.Controller";
import { Filter } from "components/tabs/dynamicCallFlow/common/DataGrid/Abstract.DataGrid.Filter";
import ModalController from "components/tabs/dynamicCallFlow/common/Modal.Controller";
import { Tokens } from "globals/interfaces";
import React, { useState } from "react";
import {
  render, RenderResult, waitFor
} from "testUtils";
import {
  PhoneNumberModalType, PhoneNumberModalTypeEnum
} from "../../DynamicCallFlow.PhoneNumber.Interfaces";
import { BrandTypeEnum } from "../../GraphQL/Dynamic.PhoneNumber.Interfaces";
import { PhoneNumberDataGridController } from "../PhoneNumber.DataGrid.Controller";
import { PhoneNumberDataGridFilter } from "../PhoneNumber.DataGrid.Filter";
import { PhoneNumberDataGridToolBar } from "../PhoneNumber.DataGrid.ToolBar";
import { PhoneNumberXlsxExporter } from "../../Xlsx/Export/PhoneNumber.Xlsx.Exporter";
import { mockCombinedPhoneNumberRecords } from "./PhoneNumber.MockData";

const mockModalController = new ModalController<PhoneNumberModalType>();
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

/**
 * Renders the phone number data grid too bar component.
 * @param { Boolean } loading The boolean value to determine if most of the component should render.
 * @returns { RenderResult } The rendered result from the render function.
 */
const renderPhoneNumberDataGridToolBar = (loading: boolean): RenderResult => {
  const phoneNumberDataGridController = new PhoneNumberDataGridController(
    { current: jest.fn() as unknown as GridApiCommunity },
    { current: new PhoneNumberDataGridFilter(jest.fn()) },
    { current: new AlertBarController(jest.fn()) }
  );
  phoneNumberDataGridController.dataGridRecords = mockCombinedPhoneNumberRecords;
  return render(<PhoneNumberDataGridToolBar
    isFilterModalOpen={false}
    dataGridFilter={{ current: new PhoneNumberDataGridFilter(jest.fn()) }}
    dataGridController={{
      current: phoneNumberDataGridController
    }}
    handleModalOpen={jest.fn()}
    loading={loading}
  />
  );
};

/**
 * Checks to make sure the phone number data grid filter modal has loaded by looking for a specific element.
 * @param { RenderResult } rendered result from the render function.
 */
const waitForPhoneNumberDataGridToolBarToLoad = async (rendered: RenderResult) => {
  await waitFor(() => {
    expect(rendered.getByText(mockContent)).toBeDefined();
  });
};

describe("PhoneNumber.DataGrid.ToolBar", () => {
  const mockSetLocalFilter = jest.fn();
  const mockFilterName = "Brand";
  const mockFilterValue = BrandTypeEnum.SAFECO;
  const mockFilter: Filter = {
    [mockFilterName]: mockFilterValue
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("Initial load", () => {
    let dataGridFilterGetFilterSpy: jest.SpyInstance;

    beforeEach(() => {
      (useState as jest.Mock).mockReturnValue([{}, mockSetLocalFilter]);
      dataGridFilterGetFilterSpy = jest.spyOn(PhoneNumberDataGridFilter.prototype, "getFilter").mockReturnValue(mockFilter);
    });

    it("should set filter state to the filter returned from the instance of PhoneNumberDataGridFilter", async () => {
      await waitForPhoneNumberDataGridToolBarToLoad(renderPhoneNumberDataGridToolBar(false));

      expect(dataGridFilterGetFilterSpy).toHaveBeenCalledTimes(1);
      expect(mockSetLocalFilter).toHaveBeenCalledWith(mockFilter);
    });

    it("should render 3 empty <div>s inside a <Grid> when data is still loading", async () => {
      const isLoading = true;
      await waitForPhoneNumberDataGridToolBarToLoad(renderPhoneNumberDataGridToolBar(isLoading));

      // Children of <Grid> should be empty <div>s:
      expect((Grid as jest.Mock).mock.calls[0][0].children[0].type).toEqual("div");
      expect((Grid as jest.Mock).mock.calls[0][0].children[1].type).toEqual("div");
      expect((Grid as jest.Mock).mock.calls[0][0].children[2].type).toEqual("div");
    });

    it("should render the rest of the the tool bar functionality inside a <Grid> when data is not still loading", async () => {
      const isLoading = false;
      await waitForPhoneNumberDataGridToolBarToLoad(renderPhoneNumberDataGridToolBar(isLoading));

      // Children of <Grid> should be more than just empty <div>s:
      expect((Grid as jest.Mock).mock.calls[0][0].children[0].type).not.toEqual("div");
      expect((Grid as jest.Mock).mock.calls[0][0].children[1].type).not.toEqual("div");
      expect((Grid as jest.Mock).mock.calls[0][0].children[2].type).not.toEqual("div");
    });
  });

  describe("Filter attribute removal", () => {
    let dataGridFilterRemoveFilterElementSpy: jest.SpyInstance;
    let dataGridFilterApplyFilterSpy: jest.SpyInstance;

    beforeEach(() => {
      (useState as jest.Mock).mockReturnValue([mockFilter, mockSetLocalFilter]);
      dataGridFilterRemoveFilterElementSpy = jest.spyOn(PhoneNumberDataGridFilter.prototype, "removeFilterElement");
      dataGridFilterApplyFilterSpy = jest.spyOn(PhoneNumberDataGridFilter.prototype, "applyFilter");
    });

    it("should remove the filter element from the filter state and apply the filter", async () => {
      await waitForPhoneNumberDataGridToolBarToLoad(renderPhoneNumberDataGridToolBar(false));

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

    beforeEach(() => {
      modalControllerOpenModalSpy = jest.spyOn(ModalController.prototype, "openModal");
    });

    it("should open the filter modal when the search box is clicked", async () => {
      await waitForPhoneNumberDataGridToolBarToLoad(renderPhoneNumberDataGridToolBar(false));

      // Access the onClick function passed to the TextField component rendered as a grandchild of Grid:
      const searchFieldOnClickFunction: () => void = (Grid as jest.Mock).mock.calls[0][0].children[0].props.children.props.onClick;
      // Simulate search box click:
      searchFieldOnClickFunction();

      expect(modalControllerOpenModalSpy).toHaveBeenCalledWith(PhoneNumberModalTypeEnum.Filter);
    });
  });

  describe("Spreadsheet export functionality", () => {
    let phoneNumberXlsxExporterExportXlsxFilesSpy: jest.SpyInstance;

    beforeEach(() => {
      phoneNumberXlsxExporterExportXlsxFilesSpy = jest.spyOn(PhoneNumberXlsxExporter.prototype, "exportXlsxFiles").mockImplementation(jest.fn());
    });

    it("should call the exportXlsxFiles method on the instance of PhoneNumberXlsxExporter when the export button is clicked", async () => {
      await waitForPhoneNumberDataGridToolBarToLoad(renderPhoneNumberDataGridToolBar(false));

      // Access the exportDataFile function passed to the IconButton component rendered as a child of Grid:
      const exportDataFileFunction: () => void = (Grid as jest.Mock).mock.calls[0][0].children[1].props.children.props.children.props.onClick;
      // Simulate export button click:
      exportDataFileFunction();

      expect(phoneNumberXlsxExporterExportXlsxFilesSpy).toHaveBeenCalledWith(mockCombinedPhoneNumberRecords, "Unfiltered");
    });
  });
});
