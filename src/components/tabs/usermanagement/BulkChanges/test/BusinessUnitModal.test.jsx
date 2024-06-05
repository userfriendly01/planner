import { BusinessUnitModal } from "../BusinessUnitModal";
import React from "react";
import { Dropdown } from "components/Dropdown";
import { ModalFetchingRing } from "components/ModalFetchingRing";
import { StyledButton } from "components/StyledButton";
import { useAdminState } from "context/appContext";
import {
  act,
  render,
  setupMockedComponents,
  initialTestState,
  waitFor
} from "testUtils";
import { getCalabrioWfmOrg } from "utils/calabrioUtils";

jest.mock("context/appContext", () => ({
  useAdminDispatch: jest.fn(),
  useAdminState: jest.fn()
}));

jest.mock("utils/calabrioUtils", () => ({
  getCalabrioWfmOrg: jest.fn()
}));

jest.mock("components/Dropdown", () => ({
  Dropdown: jest.fn()
}));

jest.mock("components/ModalFetchingRing", () => ({
  ModalFetchingRing: jest.fn()
}));

jest.mock("components/StyledButton", () => ({
  StyledButton: jest.fn()
}));

const mockHandleClose = jest.fn();
const mockHandleConfirm = jest.fn();
const businessUnit = "BU213215";

const renderComponent = () => {
  return render(<BusinessUnitModal
    handleClose={mockHandleClose}
    handleConfirm={mockHandleConfirm}
  />);
};

describe("<BusinessUnitModal />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAdminState.mockReturnValue(initialTestState);
    getCalabrioWfmOrg.mockResolvedValue("Yay!");
    setupMockedComponents({
      Dropdown,
      StyledButton,
      ModalFetchingRing
    });
  });
  describe("initial render", () => {
    describe("wfm options length is > 0", () => {
      test("should render expected components", async () => {
        renderComponent();
        expect(Dropdown.mock.calls.length).toBe(1);
        expect(Dropdown.mock.calls[0][0].label).toBe("Select a WFM Business Unit");
        expect(StyledButton.mock.calls.length).toBe(0);
      });
    });
    describe("wfm options length === 0", () => {
      test("should render expected components", async () => {
        useAdminState.mockReturnValue({
          ...initialTestState,
          calabrioContext: {
            ...initialTestState.calabrioContext,
            wfmOptions: []
          }
        });
        const rendered = renderComponent();
        expect(Dropdown.mock.calls.length).toBe(0);
        expect(rendered.container).toHaveTextContent("WFM Options failed to load, please refresh Triton Admin and try again");
      });
    });
  });
  describe("business unit is selected", () => {
    describe("getCalabrioWfmOrg fails", () => {
      test("loading fetching ring and fail message is rendered", async () => {
        getCalabrioWfmOrg.mockRejectedValue("Yay!");
        const rendered = renderComponent();
        expect(Dropdown.mock.calls.length).toBe(1);
        const updateValue = Dropdown.mock.calls[0][0].updateValue;
        act(() => updateValue(null, { value: businessUnit }));
        await waitFor(() => {
          expect(ModalFetchingRing).toHaveBeenCalled();
          expect(getCalabrioWfmOrg).toHaveBeenCalledTimes(1);
          expect(rendered.container).toHaveTextContent("Business Unit Failed to Load, please try again.");
        });
      });
    });
    describe("getCalabrioWfmOrg succeeds", () => {
      test("loading fetching ring is rendered & buttons are rendered", async () => {
        renderComponent();
        expect(Dropdown.mock.calls.length).toBe(1);
        const updateValue = Dropdown.mock.calls[0][0].updateValue;
        act(() => updateValue(null, { value: businessUnit }));
        await waitFor(() => {
          expect(ModalFetchingRing).toHaveBeenCalled();
          expect(getCalabrioWfmOrg).toHaveBeenCalledTimes(1);
          expect(StyledButton).toHaveBeenCalledTimes(2);
          expect(StyledButton.mock.calls[0][0].children).toBe("Cancel");
          expect(StyledButton.mock.calls[1][0].children).toBe("Confirm");
        });
      });
    });
  });
  describe("onConfirm is called", () => {
    test("loading fetching ring is rendered & buttons are rendered", async () => {
      renderComponent();
      expect(Dropdown.mock.calls.length).toBe(1);
      const updateValue = Dropdown.mock.calls[0][0].updateValue;
      act(() => updateValue(null, { value: businessUnit }));
      await waitFor(() => {
        expect(StyledButton).toHaveBeenCalledTimes(2);
        expect(StyledButton.mock.calls[0][0].children).toBe("Cancel");
        expect(StyledButton.mock.calls[1][0].children).toBe("Confirm");
      });
      const onCancel = StyledButton.mock.calls[0][0].onClick;
      act(() => onCancel());
      expect(mockHandleClose).toHaveBeenCalledTimes(1);
    });
  });
  describe("onClose is called", () => {
    test("loading fetching ring is rendered & buttons are rendered", async () => {
      renderComponent();
      expect(Dropdown.mock.calls.length).toBe(1);
      const updateValue = Dropdown.mock.calls[0][0].updateValue;
      act(() => updateValue(null, { value: businessUnit }));
      await waitFor(() => {
        expect(StyledButton).toHaveBeenCalledTimes(2);
        expect(StyledButton.mock.calls[0][0].children).toBe("Cancel");
        expect(StyledButton.mock.calls[1][0].children).toBe("Confirm");
      });
      const onConfirm = StyledButton.mock.calls[1][0].onClick;
      act(() => onConfirm());
      expect(mockHandleClose).toHaveBeenCalledTimes(1);
      expect(mockHandleConfirm).toHaveBeenCalledTimes(1);
      expect(mockHandleConfirm).toHaveBeenCalledWith(businessUnit);
    });
  });
});