import {
  DataGrid,
  GridPaginationModel,
  GridRenderCellParams
} from "@mui/x-data-grid";
import { AlertBarController } from "components/tabs/dynamicCallFlow/common/AlertBar.Controller";
import * as DynamicCallFlowCommonDataGrid from "components/tabs/dynamicCallFlow/common/DataGrid/DynamicCallFlow.Common.DataGrid";
import ModalController from "components/tabs/dynamicCallFlow/common/Modal.Controller";
import { updateElementsInArray } from "components/tabs/dynamicCallFlow/common/Util/Array.Util";
import React, { ReactElement } from "react";
import {
  fireEvent,
  render
} from "testUtils";
import DynamicCallFlowPhoneNumberContainer from "../../DynamicCallFlow.PhoneNumber.Container";
import {
  PhoneNumberModalTypeEnum
} from "../../DynamicCallFlow.PhoneNumber.Interfaces";
import { PhoneNumberFormModal } from "../../Form/PhoneNumber.Form.Modal";
import { PhoneNumberRecordType } from "../../GraphQL/Dynamic.PhoneNumber.Interfaces";
import { listPhoneNumberRecords } from "../../GraphQL/List.PhoneNumber.Records.Util";
import { PhoneNumberRecordUtil } from "../../GraphQL/PhoneNumber.Record.Util";
import { PhoneNumberPreviewModal } from "../../PreviewModal/PhoneNumber.Preview.Modal.Component";
import { phoneNumberMatchFilter } from "../PhoneNumber.DataGrid.Controller";
import { PhoneNumberDataGridToolBar } from "../PhoneNumber.DataGrid.ToolBar";
import {
  mockCombinedPhoneNumberRecords,
  mockDynamicPhoneNumber,
  mockLegacyPhoneNumber
} from "./PhoneNumber.MockData";
import {
  DYNAMIC_CALL_FLOW_PHONE_NUMBER_DATA_GRID_PAGE_NUMBER, DYNAMIC_CALL_FLOW_PHONE_NUMBER_DATA_GRID_RECORDS_PER_PAGE
} from "dynamicCallFlowPhoneNumber/DataGrid/PhoneNumber.DataGrid.Component";
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
jest.mock("../PhoneNumber.DataGrid.ProgressBar", () => ({
  PhoneNumberDataGridProgressBar: jest.fn()
}));
jest.mock("../PhoneNumber.DataGrid.ToolBar", () => ({
  PhoneNumberDataGridToolBar: jest.fn()
}));
jest.mock("../../PreviewModal/PhoneNumber.Preview.Modal.Component", () => ({
  PhoneNumberPreviewModal: jest.fn()
}));
jest.mock("../../Form/PhoneNumber.Form.Modal", () => ({
  PhoneNumberFormModal: jest.fn()
}));
jest.mock("../PhoneNumber.DataGrid.Filter.Modal", () => ({
  PhoneNumberDataGridFilterModal: jest.fn()
}));
jest.mock("components/core/CustomToast/CustomToast", () => ({
  CustomToast: jest.fn()
}));
jest.mock("../../GraphQL/List.PhoneNumber.Records.Util", () => ({
  listPhoneNumberRecords: jest.fn().mockImplementation(() => mockCombinedPhoneNumberRecords)
}));
jest.mock("components/tabs/dynamicCallFlow/common/Util/Array.Util", () => ({
  updateElementsInArray: jest.fn()
}));

jest.mock("context/appContext", () => ({
  useAdminState: jest.fn().mockImplementation(() => {
    return mockContextAppContextMock;
  })
}));

const DataGridComponentTestId = "phoneNumberDataGridComponent";
const ContainerElement: ReactElement = <div data-testid={DataGridComponentTestId}><DynamicCallFlowPhoneNumberContainer data-testid={DataGridComponentTestId}/></div>;

describe("PhoneNumber.DataGrid.Component", () => {
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
      it("should fetch and sort phone numbers and then notify the user", async () => {
        await waitForElementToRender(ContainerElement, DataGridComponentTestId);

        expect(listPhoneNumberRecords).toHaveBeenCalledTimes(1);
        expect(alertBarControllerInfoSpy).toHaveBeenCalledWith("Data loading in progress. Please wait for the complete set of data to be loaded.");
        expect(sortRecordsSpy).toHaveBeenCalledTimes(1);
        expect(alertBarControllerSuccessSpy).toHaveBeenCalledWith("Dynamic Call Flow Phone Numbers have been successfully loaded.");
        expect(alertBarControllerErrorSpy).toHaveBeenCalledTimes(0);
      });
    });

    describe("failure path", () => {
      beforeEach(() => {
        (listPhoneNumberRecords as jest.Mock).mockRejectedValue(new Error("My goodness, something went wrong!  What a disaster!"));
      });

      it("should notify the user when an error occurs", async () => {
        await waitForElementToRender(ContainerElement, DataGridComponentTestId);

        expect(alertBarControllerErrorSpy).toHaveBeenCalledWith("Errors loading data.  Please check the console logs.");
      });
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

      expect(sessionStorageSpy).toHaveBeenCalledWith(DYNAMIC_CALL_FLOW_PHONE_NUMBER_DATA_GRID_PAGE_NUMBER, "1");
      expect(sessionStorageSpy).toHaveBeenCalledWith(DYNAMIC_CALL_FLOW_PHONE_NUMBER_DATA_GRID_RECORDS_PER_PAGE, "25");
    });
  });

  describe("Modal management", () => {
    let modalControllerCloseModalSpy: jest.SpyInstance;
    let modalControllerOpenModalSpy: jest.SpyInstance;

    beforeEach(() => {
      modalControllerCloseModalSpy = jest.spyOn(ModalController.prototype, "closeModal");
      modalControllerOpenModalSpy = jest.spyOn(ModalController.prototype, "openModal");
    });

    describe("dynamic phone number", () => {
      beforeEach(async () => {
        jest.spyOn(PhoneNumberRecordUtil, "isDynamicPhoneNumberRecord").mockReturnValue(true);
        await waitForElementToRender(ContainerElement);
      });

      it("should display dynamic phone number modals", () => {
        // Access the handleModalOpen function passed to the PhoneNumberDataGridToolBar component:
        const onOpenModalFunction: (event: any) => void = (PhoneNumberDataGridToolBar as jest.Mock).mock.calls[0][0].handleModalOpen;
        // Simulate the opening of the add legacy phone number modal:
        onOpenModalFunction({ target: { value: PhoneNumberModalTypeEnum.AddDynamicPhoneNumber }});

        expect(PhoneNumberFormModal as jest.Mock).toHaveBeenCalledWith(expect.objectContaining({
          isOpen: true,
          fieldConfigsReactStateAction: expect.objectContaining({
            state: expect.objectContaining({
              // phoneNumber is a field specific to dynamic phone numbers:
              phoneNumber: expect.anything()
            })
          })
        }), {});
      });

      it("should open a new dynamic phone number modal when a dynamic phonw number is cloned", () => {
        // Access the handleModalOpen and onClone functions passed to the PhoneNumberDataGridToolBar and PhoneNumberFormModal components:
        const onOpenModalFunction: (event: any) => void = (PhoneNumberDataGridToolBar as jest.Mock).mock.calls[(PhoneNumberDataGridToolBar as jest.Mock).mock.calls.length - 1][0].handleModalOpen;
        const onCloneModalFunction: () => void = (PhoneNumberFormModal as jest.Mock).mock.calls[0][0].onClone;
        // Simulate the opening of the add dynamic phone number modal:
        onOpenModalFunction({ target: { value: PhoneNumberModalTypeEnum.AddDynamicPhoneNumber }});
        // Simulate the cloning of the dynamic phone number:
        onCloneModalFunction();

        expect(modalControllerOpenModalSpy).toHaveBeenLastCalledWith(PhoneNumberModalTypeEnum.AddDynamicPhoneNumber);
        expect(PhoneNumberFormModal as jest.Mock).toHaveBeenCalledWith(expect.objectContaining({
          isOpen: true,
          formRecordReactStateAction: expect.objectContaining({
            state: expect.objectContaining({
              // phoneNumber is a field specific to dynamic phone numbers:
              phoneNumber: expect.anything()
            })
          })
        }), {});
      });

      it("should open a new dynamic phone number edit modal when a dynamic phone number record is selected", () => {
        // Access the columns array passed to the DataGrid component:
        const phoneNumberDataGridColumnDefArray = (DataGrid as jest.Mock).mock.calls[0][0].columns;
        // The MUI DataGrid component should not be tested since it is from an external library and is therefore mocked (above).
        // Simulate the selection of a dynamic phone number record without the DataGrid component by rendering the contents a phone number cell and clicking it:
        const { getByText } = render(phoneNumberDataGridColumnDefArray[0]?.renderCell({
          id: 1,
          row: mockDynamicPhoneNumber,
          value: mockDynamicPhoneNumber.phoneNumber
        } as GridRenderCellParams) as JSX.Element);
        fireEvent.click(getByText(mockDynamicPhoneNumber.phoneNumber));

        expect(modalControllerOpenModalSpy).toHaveBeenLastCalledWith(PhoneNumberModalTypeEnum.EditDynamicPhoneNumber);
        expect(PhoneNumberFormModal as jest.Mock).toHaveBeenCalledWith(expect.objectContaining({
          isOpen: true,
          formRecordReactStateAction: expect.objectContaining({
            state: expect.objectContaining({
              // phoneNumber is a field specific to dynamic phone numbers:
              phoneNumber: expect.anything()
            })
          })
        }), {});
      });
    });

    describe("legacy phone number", () => {
      beforeEach(() => {
        jest.spyOn(PhoneNumberRecordUtil, "isDynamicPhoneNumberRecord").mockReturnValue(false);
      });

      it("should display legacy phone number modals", async () => {
        await waitForElementToRender(ContainerElement, DataGridComponentTestId);

        // Access the handleModalOpen function passed to the PhoneNumberDataGridToolBar component:
        const onOpenModalFunction: (event: any) => void = (PhoneNumberDataGridToolBar as jest.Mock).mock.calls[0][0].handleModalOpen;
        // Simulate the opening of the add legacy phone number modal:
        onOpenModalFunction({ target: { value: PhoneNumberModalTypeEnum.AddLegacyPhoneNumber }});

        expect(PhoneNumberFormModal as jest.Mock).toHaveBeenCalledWith(expect.objectContaining({
          isOpen: true,
          fieldConfigsReactStateAction: expect.objectContaining({
            state: expect.objectContaining({
              // pkey is a field specific to legacy phone numbers:
              pkey: expect.anything()
            })
          })
        }), {});
      });

      it("should open a new legacy phone number modal when a legacy phonw number is cloned", async () => {
        await waitForElementToRender(ContainerElement, DataGridComponentTestId);

        // Access the handleModalOpen and onClone functions passed to the PhoneNumberDataGridToolBar and PhoneNumberFormModal components
        const onOpenModalFunction: (event: any) => void = (PhoneNumberDataGridToolBar as jest.Mock).mock.calls[0][0].handleModalOpen;
        const onCloneModalFunction: () => void = (PhoneNumberFormModal as jest.Mock).mock.calls[0][0].onClone;
        // Simulate the opening of the add legacy phone number modal:
        onOpenModalFunction({ target: { value: PhoneNumberModalTypeEnum.AddLegacyPhoneNumber }});
        // Simulate the cloning of the legacy phone number:
        onCloneModalFunction();

        expect(modalControllerOpenModalSpy).toHaveBeenLastCalledWith(PhoneNumberModalTypeEnum.AddLegacyPhoneNumber);
        expect(PhoneNumberFormModal as jest.Mock).toHaveBeenCalledWith(expect.objectContaining({
          isOpen: true,
          formRecordReactStateAction: expect.objectContaining({
            state: expect.objectContaining({
              // phoneNumber is a field specific to legacy phone numbers:
              pkey: expect.anything()
            })
          })
        }), {});
      });

      it("should open a new legacy phone number edit modal when a legacy phone number record is selected", async () => {
        await waitForElementToRender(ContainerElement, DataGridComponentTestId);

        // Access the columns array passed to the DataGrid component:
        const phoneNumberDataGridColumnDefArray = (DataGrid as jest.Mock).mock.calls[0][0].columns;
        // The MUI DataGrid component should not be tested since it is from an external library and is therefore mocked (above).
        // Simulate the selection of a legacy phone number record without the DataGrid component by rendering the contents a phone number cell and clicking it:
        const { getByText } = render(phoneNumberDataGridColumnDefArray[0]?.renderCell({
          id: 1,
          row: mockLegacyPhoneNumber,
          value: mockLegacyPhoneNumber.pkey
        } as GridRenderCellParams) as JSX.Element);
        fireEvent.click(getByText(mockLegacyPhoneNumber.pkey));

        expect(modalControllerOpenModalSpy).toHaveBeenLastCalledWith(PhoneNumberModalTypeEnum.EditLegacyPhoneNumber);
        expect(PhoneNumberFormModal as jest.Mock).toHaveBeenCalledWith(expect.objectContaining({
          isOpen: true,
          formRecordReactStateAction: expect.objectContaining({
            state: expect.objectContaining({
              // pkey is a field specific to legacy phone numbers:
              pkey: expect.anything()
            })
          })
        }), {});
      });
    });

    it("should display bulk manipulation phone number modals", async () => {
      await waitForElementToRender(ContainerElement, DataGridComponentTestId);

      // Access the handleModalOpen function passed to the PhoneNumberDataGridToolBar component:
      const onOpenModalFunction: (event: any) => void = (PhoneNumberDataGridToolBar as jest.Mock).mock.calls[0][0].handleModalOpen;
      // Simulate the opening of the bulk add phone number modal:
      onOpenModalFunction({ target: { value: PhoneNumberModalTypeEnum.BulkAdd }});

      expect(PhoneNumberPreviewModal as jest.Mock).toHaveBeenCalledWith(expect.objectContaining({
        isOpen: true,
        modalType: PhoneNumberModalTypeEnum.BulkAdd
      }), {});
    });

    it("should alert for unrecognized modals", async () => {
      await waitForElementToRender(ContainerElement, DataGridComponentTestId);

      // Access the handleModalOpen function passed to the PhoneNumberDataGridToolBar component:
      const onOpenModalFunction: (event: any) => void = (PhoneNumberDataGridToolBar as jest.Mock).mock.calls[0][0].handleModalOpen;
      // Simulate the opening of a non-existent modal:
      onOpenModalFunction({ target: { value: "Not a real modal" }});

      expect(alertBarControllerWarningSpy).toHaveBeenCalledWith("Modal type Not a real modal is not setup to open.");
    });

    it("should close modals", async () => {
      await waitForElementToRender(ContainerElement, DataGridComponentTestId);

      // Access the handleModalOpen and onClose functions passed to the PhoneNumberDataGridToolBar and PhoneNumberFormModal components:
      const onOpenModalFunction: (event: any) => void = (PhoneNumberDataGridToolBar as jest.Mock).mock.calls[0][0].handleModalOpen;
      const onCloseModalFunction: () => void = (PhoneNumberFormModal as jest.Mock).mock.calls[0][0].onClose;
      // Simulate the opening of the add dynamic phone number modal:
      onOpenModalFunction({ target: { value: PhoneNumberModalTypeEnum.AddDynamicPhoneNumber }});
      // Simulate the closing of the modal:
      onCloseModalFunction();

      expect(PhoneNumberFormModal as jest.Mock).toHaveBeenLastCalledWith(expect.objectContaining({
        isOpen: false
      }), {});
      expect(modalControllerCloseModalSpy).toHaveBeenCalled();
    });

    it("should close modals when form is submitted", async () => {
      await waitForElementToRender(ContainerElement, DataGridComponentTestId);

      // Access the handleModalOpen and postFormHandler functions passed to the PhoneNumberDataGridToolBar and PhoneNumberFormModal components:
      const onOpenModalFunction: (event: any) => void = (PhoneNumberDataGridToolBar as jest.Mock).mock.calls[0][0].handleModalOpen;
      const postFormHandlerFunction: () => void = (PhoneNumberFormModal as jest.Mock).mock.calls[0][0].postFormHandler;
      // Simulate the opening of the add dynamic phone number modal:
      onOpenModalFunction({ target: { value: PhoneNumberModalTypeEnum.AddLegacyPhoneNumber }});
      // Simulate the submission of the form:
      postFormHandlerFunction();

      expect(PhoneNumberFormModal as jest.Mock).toHaveBeenLastCalledWith(expect.objectContaining({
        isOpen: false
      }), {});
      expect(modalControllerCloseModalSpy).toHaveBeenCalled();
    });
  });

  describe("Updating from preview", () => {
    beforeEach(() => {
      (updateElementsInArray as jest.Mock).mockReturnValue([mockDynamicPhoneNumber]);
    });

    it("should update update source records", async () => {
      await waitForElementToRender(ContainerElement, DataGridComponentTestId);

      // Access the updateSourceRecords function passed to the PhoneNumberPreviewModal component:
      const updateSourceRecordsFunction: (updatedSourceRecords: Array<PhoneNumberRecordType>) => void = (PhoneNumberPreviewModal as jest.Mock).mock.calls[0][0].updateSourceRecords;
      // Simulate update from preview:
      updateSourceRecordsFunction([mockDynamicPhoneNumber]);

      expect(updateElementsInArray as jest.Mock).toHaveBeenCalledWith(phoneNumberMatchFilter, [mockDynamicPhoneNumber], []);
    });
  });
});
