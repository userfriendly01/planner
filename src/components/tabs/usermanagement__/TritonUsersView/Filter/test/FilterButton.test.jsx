import { FilterButton } from "../FilterButton";
import { FilterModal } from "usermanagement/FilterModal";
import { StyledButton } from "components/StyledButton";
import React from "react";
import {
  act,
  waitFor,
  getMockedComponentProps,
  render,
  setupMockedComponents
} from "testUtils";
import { Modal } from "@mui/material";
import { useAdminDispatch } from "context/appContext";

jest.mock("usermanagement/FilterModal", () => ({
  FilterModal: jest.fn()
}));

jest.mock("components/StyledButton", () => ({
  StyledButton: jest.fn()
}));

jest.mock("@mui/material", () => ({
  Modal: jest.fn()
}));

jest.mock("context/appContext", () => ({
  useAdminDispatch: jest.fn()
}));

const mockAdminDispatch = jest.fn();

const renderComponent = () => render(
  <FilterButton />
);

describe("FilterButton", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAdminDispatch.mockReturnValue(mockAdminDispatch);
    setupMockedComponents({
      FilterModal,
      StyledButton,
      Modal
    });
  });

  test("StyledButton is passed Filter Button text", () => {
    renderComponent();
    const { children } = getMockedComponentProps(StyledButton);
    const rendered = render(children);
    expect(rendered.container).toHaveTextContent("Filters");
  });

  describe("Filter Modal", () => {
    test("when filters button clicked, FilterModal is opened", async () => {
      renderComponent();
      const onClick = StyledButton.mock.calls[0][0].onClick;
      act(() => onClick());
      act(() => render(Modal.mock.calls[0][0].children));
      await waitFor(() => {
        expect(FilterModal.mock.calls.length).toBe(1);
      });
    });
    test("when filter modal handleClose is called, modal is closed", async () => {
      renderComponent();
      expect(FilterModal.mock.calls.length).toBe(0);
      const onClick = StyledButton.mock.calls[0][0].onClick;
      act(() => onClick());
      act(() => render(Modal.mock.calls[0][0].children));
      await waitFor(() => {
        expect(FilterModal.mock.calls.length).toBe(1);
        expect(Modal.mock.calls[1][0].open).toBe(true);
      });
      act(() => FilterModal.mock.calls[0][0].handleClose());
      expect(Modal.mock.calls.length).toBe(3);
      expect(Modal.mock.calls[2][0].open).toBe(false);
    });
    test("when filter modal handleClear is called, dispatch called to reset filters", async () => {
      renderComponent();
      const onClick = StyledButton.mock.calls[0][0].onClick;
      act(() => onClick());
      act(() => render(Modal.mock.calls[0][0].children));
      act(() => FilterModal.mock.calls[0][0].handleClear());
      await waitFor(() => {
        expect(mockAdminDispatch).toHaveBeenCalledTimes(1);
        expect(mockAdminDispatch).toHaveBeenCalledWith({
          type: "resetFilters"
        });
      });
    });
  });
});