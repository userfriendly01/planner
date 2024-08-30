import { Grid } from "@mui/material";
import { GridApiCommunity } from "@mui/x-data-grid/models/api/gridApiCommunity";
import { AlertBarController } from "components/tabs/dynamicCallFlow/common/AlertBar.Controller";
import { Filter } from "components/tabs/dynamicCallFlow/common/DataGrid/Abstract.DataGrid.Filter";
import ModalController from "components/tabs/dynamicCallFlow/common/Modal.Controller";
import React, {
  ReactElement
} from "react";
import {
  PhoneNumberModalType, PhoneNumberModalTypeEnum
} from "../../DynamicCallFlow.PhoneNumber.Interfaces";
import { BrandTypeEnum } from "../../GraphQL/Dynamic.PhoneNumber.Interfaces";
import { PhoneNumberXlsxExporter } from "../../Xlsx/Export/PhoneNumber.Xlsx.Exporter";
import { PhoneNumberDataGridController } from "../PhoneNumber.DataGrid.Controller";
import { PhoneNumberDataGridFilter } from "../PhoneNumber.DataGrid.Filter";
import { PhoneNumberDataGridToolBar } from "../PhoneNumber.DataGrid.ToolBar";

import {
  mockContextAppContextMock, waitForElementToRender
} from "dynamicCallFlowCommon/test/DynamicCallFlow.Testing.Util";
import { DynamicCallFlowPhoneNumberContext } from "../../DynamicCallFlow.PhoneNumber.Container";

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
function createPhoneNumberDataGridToolBarElement(loading = false): ReactElement {
  const modalController = new ModalController<PhoneNumberModalType>();
  modalController.setOpenModalRef(jest.fn());
  return (
    <div data-testid={DataGridComponentTestId}>
      <DynamicCallFlowPhoneNumberContext.Provider value={ {
        accessTokenGraph: mockContextAppContextMock.userContext.tokens.sharedGraph,
        permissions: mockContextAppContextMock.userContext.permissions,
        currentOpenModal: PhoneNumberModalTypeEnum.Filter,
        modalController: { current: modalController }
      } }>
        <PhoneNumberDataGridToolBar
          isFilterModalOpen={false}
          dataGridFilter={{ current: new PhoneNumberDataGridFilter(jest.fn()) }}
          dataGridController={{
            current: new PhoneNumberDataGridController(
              { current: jest.fn() as unknown as GridApiCommunity },
              { current: new PhoneNumberDataGridFilter(jest.fn()) },
              { current: new AlertBarController(jest.fn()) }
            )
          }}
          handleModalOpen={jest.fn()}
          loading={loading}
        />
      </DynamicCallFlowPhoneNumberContext.Provider>
    </div>);
}

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

  describe("PhoneNumberDataGridToolBar", () => {
    let dataGridFilterGetFilterSpy: jest.SpyInstance;

    beforeEach(() => {
      jest.spyOn(React, "useState").mockReturnValue([{}, mockSetLocalFilter]);
      dataGridFilterGetFilterSpy = jest.spyOn(PhoneNumberDataGridFilter.prototype, "getFilter").mockReturnValue(mockFilter);
    });

    it("should set filter state to the filter returned from the instance of PhoneNumberDataGridFilter", async () => {
      await waitForElementToRender(createPhoneNumberDataGridToolBarElement(), DataGridComponentTestId);
      expect(dataGridFilterGetFilterSpy).toHaveBeenCalledTimes(1);
      expect(mockSetLocalFilter).toHaveBeenCalledWith(mockFilter);
    });

    it("should render 3 empty <div>s inside a <Grid> when data is still loading", async () => {
      await waitForElementToRender(createPhoneNumberDataGridToolBarElement(true));

      // Children of <Grid> should be empty <div>s:
      expect((Grid as jest.Mock).mock.calls[0][0].children[0].type).toEqual("div");
      expect((Grid as jest.Mock).mock.calls[0][0].children[1].type).toEqual("div");
      expect((Grid as jest.Mock).mock.calls[0][0].children[2].type).toEqual("div");
    });

    it("should render the rest of the the tool bar functionality inside a <Grid> when data is not still loading", async () => {
      await waitForElementToRender(createPhoneNumberDataGridToolBarElement(), DataGridComponentTestId);

      // Children of <Grid> should be more than just empty <div>s:
      expect((Grid as jest.Mock).mock.calls[0][0].children[0].type).not.toEqual("div");
      expect((Grid as jest.Mock).mock.calls[0][0].children[1].type).not.toEqual("div");
      expect((Grid as jest.Mock).mock.calls[0][0].children[2].type).not.toEqual("div");
    });
  });

  describe("Filter attribute removal", () => {
    let dataGridFilterRemoveFilterElementSpy: jest.SpyInstance;
    let dataGridFilterApplyFilterSpy: jest.SpyInstance;

    beforeEach(async () => {
      jest.spyOn(React, "useState").mockReturnValue([mockFilter, mockSetLocalFilter]);
      dataGridFilterRemoveFilterElementSpy = jest.spyOn(PhoneNumberDataGridFilter.prototype, "removeFilterElement");
      dataGridFilterApplyFilterSpy = jest.spyOn(PhoneNumberDataGridFilter.prototype, "applyFilter");
      await waitForElementToRender(createPhoneNumberDataGridToolBarElement(), DataGridComponentTestId);
    });

    it("should remove the filter element from the filter state and apply the filter", async () => {
      // Access the removeFilterElement function passed to the TextField component rendered as a grandchild of Grid:
      const onDelete: () => void = (Grid as jest.Mock).mock.calls[0][0].children[0].props.children.props.InputProps.startAdornment[0].props.onDelete;
      // Simulate filter attribute removal:
      onDelete();

      expect(dataGridFilterRemoveFilterElementSpy).toHaveBeenCalledWith(mockFilterName);
      expect(dataGridFilterApplyFilterSpy).toHaveBeenCalled();
      expect(mockSetLocalFilter).toHaveBeenLastCalledWith({});
    });
  });

  describe("Filter modal management", () => {
    let modalControllerOpenModalSpy: jest.SpyInstance;

    beforeEach(async () => {
      modalControllerOpenModalSpy = jest.spyOn(ModalController.prototype, "openModal");
      await waitForElementToRender(createPhoneNumberDataGridToolBarElement(), DataGridComponentTestId);
    });

    it("should open the filter modal when the search box is clicked", async () => {
      // Access the onClick function passed to the TextField component rendered as a grandchild of Grid:
      const onClickFunction: () => void = (Grid as jest.Mock).mock.calls[0][0].children[0].props.children.props.onClick;
      // Simulate search box click:
      onClickFunction();

      expect(modalControllerOpenModalSpy).toHaveBeenCalledWith(PhoneNumberModalTypeEnum.Filter);
    });
  });

  describe("Spreadsheet export functionality", () => {
    let phoneNumberXlsxExporterExportXlsxFilesSpy: jest.SpyInstance;

    beforeEach(async () => {
      phoneNumberXlsxExporterExportXlsxFilesSpy = jest.spyOn(PhoneNumberXlsxExporter.prototype, "exportXlsxFiles").mockImplementation(jest.fn());
      await waitForElementToRender(createPhoneNumberDataGridToolBarElement(), DataGridComponentTestId);
    });

    it("should call the exportXlsxFiles method on the instance of PhoneNumberXlsxExporter when the export button is clicked", async () => {
      // Access the exportDataFile function passed to the IconButton component rendered as a child of Grid:
      const exportDataFileFunction: () => void = (Grid as jest.Mock).mock.calls[0][0].children[1].props.children.props.children.props.onClick;
      // Simulate export button click:
      exportDataFileFunction();

      expect(phoneNumberXlsxExporterExportXlsxFilesSpy).toHaveBeenCalled();
    });
  });
});
