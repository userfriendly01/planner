import BusinessUnitModal from "../BusinessUnitModal";
import React from "react";
import { Dropdown } from "components";
import {
  useAdminState
} from "context";
import {
  act,
  render,
  setupMockedComponents,
  initialTestState
} from "testUtils";
import {
  ButtonWrapper,
  Button,
  ModalWrapper
} from "../BulkChanges.Styles";


jest.mock("context", () => ({
  useAdminState: jest.fn()
}));

jest.mock("components", () => ({
  Dropdown: jest.fn()
}));

jest.mock("../BulkChanges.Styles", () => ({
  ButtonWrapper: jest.fn(),
  Button: jest.fn(),
  ModalWrapper: jest.fn()
}));

const mockHandleClose = jest.fn();
const mockHandleUpdate = jest.fn();
const mockHandleExport = jest.fn();

const renderComponent = wfmBusinessUnit => {
  return render(<BusinessUnitModal
    handleClose={mockHandleClose}
    handleExport={mockHandleExport}
    handleUpdate={mockHandleUpdate}
    wfmBusinessUnit={wfmBusinessUnit}
  />);
};

describe("<BusinessUnitModal />", () => {
  beforeEach(() => {
    useAdminState.mockReturnValue(initialTestState);
    jest.clearAllMocks();
    setupMockedComponents({
      Dropdown,
      Button,
      ModalWrapper
    });
  });
  describe("initial render", () => {
    test("should render expected components", async () => {
      renderComponent(null);
      render(ModalWrapper.mock.calls[0][0].children);
      render(ButtonWrapper.mock.calls[0][0].children);
      expect(ModalWrapper.mock.calls.length).toBe(1);
      expect(Dropdown.mock.calls.length).toBe(1);
      expect(Button.mock.calls.length).toBe(2);
      expect(Button.mock.calls[1][0].disabled).toBe(true);
      expect(ModalWrapper.mock.calls[0][0].children[0]).toBe("Select a WFM Business unit to generate the template options.");
    });
    test("cancel is clicked, handleClose is called", async () => {
      renderComponent(null);
      render(ModalWrapper.mock.calls[0][0].children);
      render(ButtonWrapper.mock.calls[0][0].children);
      expect(ModalWrapper.mock.calls.length).toBe(1);
      expect(Dropdown.mock.calls.length).toBe(1);
      expect(Button.mock.calls.length).toBe(2);
      expect(Button.mock.calls[1][0].disabled).toBe(true);
      const cancelClick = Button.mock.calls[0][0].onClick;
      act(() => cancelClick());
      expect(mockHandleClose).toBeCalledTimes(1);
      expect(mockHandleExport).toBeCalledTimes(0);
      expect(mockHandleUpdate).toBeCalledTimes(0);
    });
    test("business unit is selected", async () =>{
      renderComponent(null);
      render(ModalWrapper.mock.calls[0][0].children);
      render(ButtonWrapper.mock.calls[0][0].children);
      expect(ModalWrapper.mock.calls.length).toBe(1);
      expect(Dropdown.mock.calls.length).toBe(1);
      expect(Button.mock.calls.length).toBe(2);
      expect(Button.mock.calls[1][0].disabled).toBe(true);
      const updateValue = Dropdown.mock.calls[0][0].updateValue;
      act(() => updateValue(null, {
        label: "bu",
        value: "bu"
      }));
      expect(mockHandleUpdate).toBeCalledTimes(1);
    });
    test("handleConfirm cannot be called if no wfmBusinessUnit", async () => {
      renderComponent(null);
      render(ModalWrapper.mock.calls[0][0].children);
      render(ButtonWrapper.mock.calls[0][0].children);
      expect(ModalWrapper.mock.calls.length).toBe(1);
      expect(Dropdown.mock.calls.length).toBe(1);
      expect(Button.mock.calls.length).toBe(2);
      const confirmClick = Button.mock.calls[1][0].onClick;
      act(() => confirmClick());
      expect(mockHandleExport).toBeCalledTimes(0);
      expect(mockHandleClose).toBeCalledTimes(0);
    });
    test("confirm is clicked", async () => {
      renderComponent({
        label: "BU",
        value: "BU"
      });
      render(ModalWrapper.mock.calls[0][0].children);
      render(ButtonWrapper.mock.calls[0][0].children);
      expect(ModalWrapper.mock.calls.length).toBe(1);
      expect(Dropdown.mock.calls.length).toBe(1);
      expect(Button.mock.calls.length).toBe(2);
      expect(Button.mock.calls[1][0].disabled).toBe(false);
      const confirmClick = Button.mock.calls[1][0].onClick;
      act(() => confirmClick());
      expect(mockHandleExport).toBeCalledTimes(1);
      expect(mockHandleClose).toBeCalledTimes(1);
    });
  });
});