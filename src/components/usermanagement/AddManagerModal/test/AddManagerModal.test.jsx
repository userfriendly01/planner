import AddManagerModal from "../AddManagerModal";
import { CloseRounded } from "@material-ui/icons";
import {
  ModalNNumber,
  ModalOverlay,
  PaperContainer,
  StyledButton
} from "components";
import { initialState } from "context";
import React from "react";
import { act } from "react-dom/test-utils";
import {
  expectMockedComponent,
  expectOnlyPassedProps,
  getLastInstanceCalled,
  getMockedComponentProps,
  render,
  setupMockedComponents,
  waitFor
} from "testUtils";

jest.useFakeTimers();

jest.mock("@material-ui/icons", () => ({
  __esModule: true,
  CloseRounded: jest.fn()
}));

jest.mock("components", () => ({
  __esModule: true,
  ModalNNumber: jest.fn(),
  ModalOverlay: jest.fn(),
  PaperContainer: jest.fn(),
  StyledButton: jest.fn()
}));

describe("<AddManagerModal />", () => {
  const mockHandleClose = jest.fn();
  const renderComponent = () => render(<AddManagerModal handleClose={mockHandleClose} />);
  beforeEach(() => {
    setupMockedComponents({
      CloseRounded,
      ModalNNumber,
      ModalOverlay,
      StyledButton
    });
    PaperContainer.mockClear();
    PaperContainer.mockImplementation(props => <div>{props.children}</div>);
    mockHandleClose.mockClear();
  });

  describe("initial state of the modal", () => {
    test("should render StyledButton, CloseRounded & ModalNNumber once each", () => {
      const rendered = renderComponent();
      expectMockedComponent(rendered, { StyledButton });
      expectMockedComponent(rendered, { CloseRounded });
      expectMockedComponent(rendered, { ModalNNumber });
    });
    test("should not render ModalOverlay", () => {
      const rendered = renderComponent();
      expect(rendered.queryAllByText("ModalOverlay").length).toBe(0);
    });
  });

  const updateFormSoValid = (fetchedManager, nNumber) => {
    act(() => {
      getMockedComponentProps(ModalNNumber, getLastInstanceCalled(ModalNNumber)).onUpdate("n02");
    });
    act(() => {
      getMockedComponentProps(ModalNNumber, getLastInstanceCalled(ModalNNumber)).onClear();
    });
    act(() => {
      getMockedComponentProps(ModalNNumber, getLastInstanceCalled(ModalNNumber)).onComplete(fetchedManager, nNumber);
    });
    // button should be enabled
    expect(getMockedComponentProps(StyledButton, getLastInstanceCalled(StyledButton)).disabled).toBe(false);
  };

  describe("Add Manager button", () => {
    describe("initial state", () => {
      test("should be disabled", () => {
        const rendered = renderComponent();
        expectMockedComponent(rendered, { StyledButton }, 1);
        const { disabled } = getMockedComponentProps(StyledButton);
        expect(disabled).toBe(true);
      });
    });
    describe("Add Manager button is clicked", () => {
      describe("manager is not in list of managers", () => {
        test("ModalOverlay should render with 'Manager added successfully' & modal should close after 2 seconds (handleClose should be called)", async () => {
          const rendered = renderComponent();
          const fetchedManager = {
            firstName: "Bob",
            lastName: "Bobson"
          };
          updateFormSoValid(fetchedManager, "n0000000");
          const { onClick } = getMockedComponentProps(StyledButton, getLastInstanceCalled(StyledButton));
          act(() => onClick());
          act(() => jest.runAllTimers());
          await waitFor(() => {
            expectMockedComponent(rendered, { ModalOverlay });
            expectOnlyPassedProps(ModalOverlay, {
              status: "success",
              message: "Manager added successfully"
            });
            expect(mockHandleClose).toHaveBeenCalledTimes(1);
          });
        });
      });
    });
    describe("manager is already in the list of managers", () => {
      const managerNNumber = "n1234567";
      const fetchedManager = {
        firstName: "Bob",
        lastName: "Bobson"
      };
      const testState = {
        ...initialState,
        managerContext: {
          managers: [{
            manager_first_name: "Ialready",
            manager_last_name: "Exist",
            manager_n_number: managerNNumber
          }]
        }
      };
      test("ModalOverlay should render 'Manager already exists' & modal should remain open (handleClose should not be called)", async () => {
        const rendered = render(<AddManagerModal handleClose={mockHandleClose}/>, testState);
        updateFormSoValid(fetchedManager, managerNNumber);
        const { onClick } = getMockedComponentProps(StyledButton, getLastInstanceCalled(StyledButton));
        act(() => onClick());
        act(() => jest.runAllTimers());
        await waitFor(() => {
          expectOnlyPassedProps(ModalOverlay, {
            status: "fail",
            message: "Manager already exists"
          });
          expect(mockHandleClose).toHaveBeenCalledTimes(0);
          expectMockedComponent(rendered, { ModalOverlay }, 0);
        });
      });
    });
  });

  describe("close button", () => {
    test("should render whenever modal is open", () => {
      const rendered = renderComponent();
      expectMockedComponent(rendered, { CloseRounded }, 1);
    });
    describe("when clicked", () => {
      test("should close the modal", () => {
        renderComponent();
        const { onClick } = getMockedComponentProps(CloseRounded);
        act(() => onClick());
        expect(mockHandleClose).toBeCalled();
      });
    });
  });
});
