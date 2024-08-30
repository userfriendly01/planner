import { Filter } from "components/tabs/dynamicCallFlow/common/DataGrid/Abstract.DataGrid.Filter";
import {
  ModalSearchStyled
} from "components/tabs/dynamicCallFlow/common/DynamicCallFlow.Styles";
import ModalController from "components/tabs/dynamicCallFlow/common/Modal.Controller";
import React, {
  ReactElement
} from "react";
import {
  PhoneNumberModalType, PhoneNumberModalTypeEnum
} from "../../DynamicCallFlow.PhoneNumber.Interfaces";
import { PhoneNumberDataGridFilter } from "../PhoneNumber.DataGrid.Filter";
import { PhoneNumberDataGridFilterModal } from "../PhoneNumber.DataGrid.Filter.Modal";

import {
  mockContextAppContextMock, waitForElementToRender
} from "dynamicCallFlowCommon/test/DynamicCallFlow.Testing.Util";
import { DynamicCallFlowPhoneNumberContext } from "../../DynamicCallFlow.PhoneNumber.Container";

jest.mock("@mui/material", () => {
  const originalFunctionality = jest.requireActual("@mui/material");

  return {
    ...originalFunctionality,
    Button: jest.fn(),
    TextField: jest.fn()
  };
});
jest.mock("components/tabs/dynamicCallFlow/common/DynamicCallFlow.Styles", () => ({
  ModalSearchStyled: jest.fn()
}));

export const PhoneNumberDataGridFilterModalDataTestId = "phoneNumberDataGridFilterModal";
function createPhoneNumberDataGridFilterModalElement(): ReactElement {
  const modalController = new ModalController<PhoneNumberModalType>();
  modalController.setCloseModalRef(jest.fn());
  return (
    <div data-testid={PhoneNumberDataGridFilterModalDataTestId}>
      <DynamicCallFlowPhoneNumberContext.Provider value={ {
        accessTokenGraph: mockContextAppContextMock.userContext.tokens.sharedGraph,
        permissions: mockContextAppContextMock.userContext.permissions,
        currentOpenModal: PhoneNumberModalTypeEnum.Filter,
        modalController: { current: modalController }
      } }>
        <PhoneNumberDataGridFilterModal
          isOpen={true}
          dataGridFilter={{ current: new PhoneNumberDataGridFilter(jest.fn()) }}
        />
      </DynamicCallFlowPhoneNumberContext.Provider>
    </div>);
}

describe("PhoneNumber.DataGrid.Filter.Modal.Component", () => {
  const mockSetFilter = jest.fn();
  let modalControllerCloseModalSpy: jest.SpyInstance;
  const mockFilterName = "mockFilterName";
  const mockFilterValue = "mockFilterValue";
  const mockFilter: Filter = {
    [mockFilterName]: mockFilterValue
  };

  beforeEach(() => {
    modalControllerCloseModalSpy = jest.spyOn(ModalController.prototype, "closeModal");
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("initial load", () => {
    let dataGridFilterGetFilterSpy: jest.SpyInstance;

    beforeEach(() => {
      jest.spyOn(React, "useState").mockReturnValueOnce([{}, mockSetFilter]);
      dataGridFilterGetFilterSpy = jest.spyOn(PhoneNumberDataGridFilter.prototype, "getFilter").mockReturnValue(mockFilter);
    });

    it("should set the filter state to the filter returned from the instance of PhoneNumberDataGridFilter", async () => {
      await waitForElementToRender(createPhoneNumberDataGridFilterModalElement(), PhoneNumberDataGridFilterModalDataTestId);

      expect(dataGridFilterGetFilterSpy).toHaveBeenCalled();
      expect(mockSetFilter).toHaveBeenCalledWith(mockFilter);
    });
  });

  describe("Filter submission", () => {
    let dataGridFilterApplyFilterSpy: jest.SpyInstance;

    beforeEach(() => {
      dataGridFilterApplyFilterSpy = jest.spyOn(PhoneNumberDataGridFilter.prototype, "applyFilter");
    });

    it("should call the applyFilter method on the instance of PhoneNumberDataGridFilter and close the modal", async () => {
      await waitForElementToRender(createPhoneNumberDataGridFilterModalElement(), PhoneNumberDataGridFilterModalDataTestId);

      // Access the applyFilter function passed to the first button component rendered as a child of ModalSearchStyled:
      const applyFilterFunction: () => void = (ModalSearchStyled as unknown as jest.Mock).mock.calls[0][0].children[2].props.children[0].props.onClick;
      // Simulate filter submission:
      applyFilterFunction();

      expect(dataGridFilterApplyFilterSpy).toHaveBeenCalled();
      expect(modalControllerCloseModalSpy).toHaveBeenCalled();
    });
  });

  describe("Filter change", () => {
    let dataGridFilterAddFilterElementSpy: jest.SpyInstance;

    beforeEach(() => {
      jest.spyOn(React, "useState").mockReturnValueOnce([{}, mockSetFilter]);
      dataGridFilterAddFilterElementSpy = jest.spyOn(PhoneNumberDataGridFilter.prototype, "addFilterElement").mockReturnValue(mockFilter);
    });

    it("should call setFilter with the returned filter from PhoneNumberDataGridFilter.addFilterElement when a change event occurs", async () => {
      await waitForElementToRender(createPhoneNumberDataGridFilterModalElement(), PhoneNumberDataGridFilterModalDataTestId);

      // Access the onChange function passed to the SelectContainer component rendered as a child of ModalSearchStyled:
      const handleChangeFunction: (event: any) => void = (ModalSearchStyled as unknown as jest.Mock).mock.calls[0][0].children[1].props.children.props.children[0].props.children.props.onChange;
      // Simulate a filter change event:
      handleChangeFunction({
        target: {
          name: mockFilterName,
          value: mockFilterValue
        }
      });

      expect(dataGridFilterAddFilterElementSpy).toHaveBeenCalledWith(mockFilterName, mockFilterValue);
      expect(mockSetFilter).toHaveBeenCalledWith(mockFilter);
    });
  });

  describe("Filter cancellation", () => {
    let dataGridFilterResetFilterSpy: jest.SpyInstance;

    beforeEach(() => {
      jest.spyOn(React, "useState").mockReturnValueOnce([{}, mockSetFilter]);
      dataGridFilterResetFilterSpy = jest.spyOn(PhoneNumberDataGridFilter.prototype, "resetFilter").mockReturnValue(mockFilter);
    });

    it("should call setFilter with the returned filter from PhoneNumberDataGridFilter.resetFilter and close the modal", async () => {
      await waitForElementToRender(createPhoneNumberDataGridFilterModalElement(), PhoneNumberDataGridFilterModalDataTestId);

      // Access the resetFilterAndClose function passed to the Button component rendered as a child of ModalSearchStyled:
      const resetFilterFunction: () => void = (ModalSearchStyled as unknown as jest.Mock).mock.calls[0][0].children[2].props.children[1].props.onClick;
      // Simulate filter reset:
      resetFilterFunction();

      expect(dataGridFilterResetFilterSpy).toHaveBeenCalled();
      expect(mockSetFilter).toHaveBeenCalledWith(mockFilter);
      expect(modalControllerCloseModalSpy).toHaveBeenCalled();
    });
  });

  describe("Filter search modal closure", () => {
    it("should call setFilter with the returned filter from PhoneNumberDataGridFilter.resetFilter and close the modal", async () => {
      await waitForElementToRender(createPhoneNumberDataGridFilterModalElement(), PhoneNumberDataGridFilterModalDataTestId);

      // Access the onClose function passed to the ModalSearchStyled component:
      const modalSearchStyledOnCloseFunction: () => void = (ModalSearchStyled as unknown as jest.Mock).mock.calls[0][0].onClose;
      // Simulate modal closure:
      modalSearchStyledOnCloseFunction();

      expect(modalControllerCloseModalSpy).toHaveBeenCalled();
    });
  });
});

