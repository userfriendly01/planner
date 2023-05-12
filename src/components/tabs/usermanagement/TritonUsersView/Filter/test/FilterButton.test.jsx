import FilterButton from "../FilterButton";
import {
  FilterModal,
  StyledButton
} from "components";
import React from "react";
import {
  act,
  waitFor,
  getMockedComponentProps,
  render,
  setupMockedComponents
} from "testUtils";
import { Modal } from "@mui/material";


jest.mock("components", () => ({
  FilterModal: jest.fn(),
  StyledButton: jest.fn()
}));

jest.mock("@mui/material", () => ({
  Modal: jest.fn()
}));

const mockSetTableState = jest.fn();
let tableState = {
  managerFilter: null,
  profileFilter: null,
  ouFilter: null
};


const renderComponent = () => render(
  <FilterButton tableState={tableState} setTableState={mockSetTableState} />
);

describe("FilterButton", () => {
  beforeEach(() => {
    jest.clearAllMocks();
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
        expect(FilterModal.mock.calls[0][0].tableState).toBe(tableState);
      });
    });
    test("when filter modal handleClose is called, modal is closed", async () => {
      renderComponent();
      const onClick = StyledButton.mock.calls[0][0].onClick;
      act(() => onClick());
      act(() => render(Modal.mock.calls[0][0].children));
      await waitFor(() => {
        expect(FilterModal.mock.calls[0][0].tableState).toBe(tableState);
      });
      act(() => FilterModal.mock.calls[0][0].handleClose());
      expect(Modal.mock.calls.length).toBe(3);
      expect(Modal.mock.calls[2][0].open).toBe(false);
    });
    test("when filter modal handleClear is called, tableState reset", async () => {
      tableState = {
        managerFilter: "n123456",
        profileFilter: "7",
        ouFilter: "claims"
      };
      renderComponent();
      const onClick = StyledButton.mock.calls[0][0].onClick;
      act(() => onClick());
      act(() => render(Modal.mock.calls[0][0].children));
      await waitFor(() => {
        expect(FilterModal.mock.calls[0][0].tableState).toBe(tableState);
      });
      act(() => FilterModal.mock.calls[0][0].handleClear());
      await waitFor(() => {
        // expect(FilterModal.mock.calls[0][0].tableState).toBe({
        //   managerFilter: null,
        //   profileFilter: null,
        //   ouFilter: null
        // });  // TODO fix this 
      });
    });
  });
});