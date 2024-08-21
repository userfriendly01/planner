import { Filter } from "components/tabs/dynamicCallFlow/common/DataGrid/Abstract.DataGrid.Filter";
import {
  ModalSearchStyled
} from "components/tabs/dynamicCallFlow/common/DynamicCallFlow.Styles";
import ModalController from "components/tabs/dynamicCallFlow/common/Modal.Controller";
import React, { useState } from "react";
import {
  render, RenderResult,
  waitFor
} from "testUtils";
import { PhoneNumberModalType } from "../../DynamicCallFlow.PhoneNumber.Interfaces";
import { PhoneNumberDataGridFilter } from "../PhoneNumber.DataGrid.Filter";
import { PhoneNumberDataGridFilterModal } from "../PhoneNumber.DataGrid.Filter.Modal";

const mockModalController = new ModalController<PhoneNumberModalType>();
jest.mock("react", () => {
  const originalFunctionality = jest.requireActual("react");
  return {
    ...originalFunctionality,
    useState: jest.fn().mockReturnValue([{}, jest.fn()]),
    useContext: jest.fn().mockImplementation(() => {
      mockModalController.setCloseModalRef(jest.fn());
      return {
        modalController: {
          current: mockModalController
        }
      };
    })
  };
});
jest.mock("@mui/material", () => {
  const originalFunctionality = jest.requireActual("@mui/material");

  return {
    ...originalFunctionality,
    Button: jest.fn(),
    TextField: jest.fn()
  };
});
const mockContent = "Mock Content";
jest.mock("components/tabs/dynamicCallFlow/common/DynamicCallFlow.Styles", () => ({
  ModalSearchStyled: jest.fn().mockImplementation(() => <div>{mockContent}</div>)
}));

/**
 * Renders the phone number data grid filter modal.
 * @returns { RenderResult } The rendered result from the render function.
 */
const renderPhoneNumberDataGridFilterModal = () => {
  return render(<PhoneNumberDataGridFilterModal
    isOpen={true}
    dataGridFilter={{ current: new PhoneNumberDataGridFilter(jest.fn()) }}
  />
  );
};

/**
 * Checks to make sure the phone number data grid filter modal has loaded by looking for a specific element.
 * @param { RenderResult } rendered result from the render function.
 */
const waitForPhoneNumberDataGridFilterModalToLoad = async (rendered: RenderResult) => {
  await waitFor(() => {
    expect(rendered.getByText(mockContent)).toBeDefined();
  });
};

describe("PhoneNumber.DataGrd.Component", () => {
  const mockSetFilter = jest.fn();
  let modalControllerCloseModalSpy: jest.SpyInstance;
  const mockFilterName = "mockFilterName";
  const mockFilterValue = "mockFilterValue";
  const mockFilter: Filter = {
    [mockFilterName]: mockFilterValue
  };

  beforeEach(() => {
    (useState as jest.Mock).mockReturnValueOnce([{}, mockSetFilter]);
    modalControllerCloseModalSpy = jest.spyOn(ModalController.prototype, "closeModal");
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("initial load", () => {
    let dataGridFilterGetFilterSpy: jest.SpyInstance;

    beforeEach(() => {
      dataGridFilterGetFilterSpy = jest.spyOn(PhoneNumberDataGridFilter.prototype, "getFilter").mockReturnValue(mockFilter);
    });

    it("should set the filter state to the filter returned from the instance of PhoneNumberDataGridFilter", async () => {
      await waitForPhoneNumberDataGridFilterModalToLoad(renderPhoneNumberDataGridFilterModal());

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
      await waitForPhoneNumberDataGridFilterModalToLoad(renderPhoneNumberDataGridFilterModal());

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
      dataGridFilterAddFilterElementSpy = jest.spyOn(PhoneNumberDataGridFilter.prototype, "addFilterElement").mockReturnValue(mockFilter);
    });

    it("should call setFilter with the returned filter from PhoneNumberDataGridFilter.addFilterElement when a change event occurs", async () => {
      await waitForPhoneNumberDataGridFilterModalToLoad(renderPhoneNumberDataGridFilterModal());

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
      dataGridFilterResetFilterSpy = jest.spyOn(PhoneNumberDataGridFilter.prototype, "resetFilter").mockReturnValue(mockFilter);
    });

    it("should call setFilter with the returned filter from PhoneNumberDataGridFilter.resetFilter and close the modal", async () => {
      await waitForPhoneNumberDataGridFilterModalToLoad(renderPhoneNumberDataGridFilterModal());

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
      await waitForPhoneNumberDataGridFilterModalToLoad(renderPhoneNumberDataGridFilterModal());

      // Access the onClose function passed to the ModalSearchStyled component:
      const modalSearchStyledOnCloseFunction: () => void = (ModalSearchStyled as unknown as jest.Mock).mock.calls[0][0].onClose;
      // Simulate modal closure:
      modalSearchStyledOnCloseFunction();

      expect(modalControllerCloseModalSpy).toHaveBeenCalled();
    });
  });
});
