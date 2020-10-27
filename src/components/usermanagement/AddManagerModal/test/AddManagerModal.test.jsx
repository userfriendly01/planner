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
  setupMockedComponents
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
  const nNumber = "n1234567";
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

  describe("manager N number field", () => {
    describe("initial state", () => {
      test("should render ModalNNumber with expected props", () => {
        const rendered = renderComponent();
        expectMockedComponent(rendered, { ModalNNumber });
        expectOnlyPassedProps(ModalNNumber, {
          disabled: false,
          nNumber: "n"
        });
      });
    });

    describe("valid N number entered", () => {
      describe("good response", () => {
        test("should render ModalNNumber with correct props", done => {
          renderComponent();
          act(() => {
            const updateNNumber = ModalNNumber.mock.calls[0][0].updateNNumber;
            const setIsValid = ModalNNumber.mock.calls[0][0].setIsValid;
            updateNNumber(nNumber);
            setIsValid(true);
            return Promise.resolve();
          }).then(() => {
            expect(ModalNNumber.mock.calls.length).toBe(2);
            expect(ModalNNumber.mock.calls[0][0].nNumber).toBe("n");
            expect(ModalNNumber.mock.calls[1][0].nNumber).toBe(nNumber);
            expect(ModalNNumber.mock.calls[0][0].disabled).toBe(false);
            expect(ModalNNumber.mock.calls[1][0].disabled).toBe(true);
            done();
          });
        });
        test("should reset nNumber field to 'n'", done => {
          renderComponent();
          act(() => {
            const updateNNumber = ModalNNumber.mock.calls[0][0].updateNNumber;
            updateNNumber(nNumber);
            return Promise.resolve();
          }).then(() => {
            const { resetParentState } = getMockedComponentProps(ModalNNumber, getLastInstanceCalled(ModalNNumber));
            act(() => resetParentState());
            const {
              nNumber
            } = getMockedComponentProps(ModalNNumber, getLastInstanceCalled(ModalNNumber));
            expect(nNumber).toBe("n");
            done();
          });
        });
      });
    });
  });

  describe("Add Manager button", () => {
    describe("initial state", () => {
      test("should be disabled", () => {
        const rendered = renderComponent();
        expectMockedComponent(rendered, { StyledButton }, 1);
        const { disabled } = getMockedComponentProps(StyledButton);
        expect(disabled).toBe(true);
      });
    });
    describe("valid nNumber is entered", () => {
      test("should be enabled", done => {
        renderComponent();
        act(() => {
          const updateNNumber = ModalNNumber.mock.calls[0][0].updateNNumber;
          const setIsValid = ModalNNumber.mock.calls[0][0].setIsValid;
          updateNNumber(nNumber);
          setIsValid(true);
          return Promise.resolve();
        }).then(() => {
          const { disabled } = getMockedComponentProps(StyledButton, getLastInstanceCalled(StyledButton));
          expect(disabled).toBe(false);
          done();
        });
      });
    });
    describe("Add Manager button is clicked", () => {
      describe("manager is not in list of managers", () => {
        test("ModalOverlay should render with 'Manager added successfully' & modal should close after 2 seconds (handleClose should be called)", done => {
          const rendered = renderComponent();
          act(() => {
            const updateNNumber = ModalNNumber.mock.calls[0][0].updateNNumber;
            updateNNumber(nNumber);
            return Promise.resolve();
          }).then(() => {
            const { onClick } = getMockedComponentProps(StyledButton, getLastInstanceCalled(StyledButton));
            act(() => onClick());
            expectMockedComponent(rendered, { ModalOverlay });
            expectOnlyPassedProps(ModalOverlay, {
              status: "success",
              message: "Manager added successfully"
            });
            act(() => jest.runAllTimers());
            expect(mockHandleClose).toBeCalled();
            done();
          });
        });
      });
    });
    describe("manager is already in the list of managers", () => {
      const testState = {
        ...initialState,
        managerContext: {
          managers: [{ manager_n_number: nNumber }]
        }
      };
      test("ModalOverlay should render 'Manager already exists' & modal should remain open (handleClose should not be called)", done => {
        const rendered = render(<AddManagerModal handleClose={mockHandleClose}/>, testState);
        act(() => {
          const updateNNumber = ModalNNumber.mock.calls[0][0].updateNNumber;
          updateNNumber(nNumber);
          return Promise.resolve();
        }).then(() => {
          const { onClick } = getMockedComponentProps(StyledButton, getLastInstanceCalled(StyledButton));
          act(() => onClick());
          expectMockedComponent(rendered, { ModalOverlay });
          expectOnlyPassedProps(ModalOverlay, {
            status: "fail",
            message: "Manager already exists"
          });
          act(() => jest.runAllTimers());
          expect(mockHandleClose).not.toBeCalled();
          done();
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
