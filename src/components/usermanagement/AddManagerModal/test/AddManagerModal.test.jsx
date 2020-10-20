import AddManagerModal from "../AddManagerModal";
import { CloseRounded } from "@material-ui/icons";
import MockAdapter from "axios-mock-adapter";
import {
  ModalHelperText,
  CustomInput,
  ModalOverlay,
  PaperContainer,
  StyledButton
} from "components";
import { initialState } from "context";
import { apiPaths } from "globals";
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
import { myAxios } from "utils";

const axiosMock = new MockAdapter(myAxios);
jest.useFakeTimers();

jest.mock("@material-ui/icons", () => ({
  __esModule: true,
  CloseRounded: jest.fn()
}));

jest.mock("components", () => ({
  __esModule: true,
  ModalHelperText: jest.fn(),
  CustomInput: jest.fn(),
  ModalOverlay: jest.fn(),
  PaperContainer: jest.fn(),
  StyledButton: jest.fn()
}));

describe("<AddManagerModal />", () => {
  const mockHandleClose = jest.fn();
  const nNumber = "n1234567";
  const nNumberWithoutN = "1234567";
  const mockSuccessfulResponse = [
    {
      person: {
        data: {
          Email: "test@abc.com",
          FirstName: "Frank",
          LastName: "Rizzo",
          OfficeName: "Springfield 012B",
          OfficeNumber: "ABC123",
          DepartmentName: "Computers",
          DepartmentNumber: "4848"
        }
      }
    }
  ];
  const renderComponent = () => render(<AddManagerModal handleClose={mockHandleClose} />);
  beforeEach(() => {
    setupMockedComponents({
      CloseRounded,
      ModalHelperText,
      CustomInput,
      ModalOverlay,
      StyledButton
    });
    axiosMock.reset();
    PaperContainer.mockClear();
    PaperContainer.mockImplementation(props => <div>{props.children}</div>);
    mockHandleClose.mockClear();
  });

  describe("initial state of the modal", () => {
    test("should render StyledButton, CloseRounded & CustomInput once each", () => {
      const rendered = renderComponent();
      expectMockedComponent(rendered, { StyledButton });
      expectMockedComponent(rendered, { CloseRounded });
      expectMockedComponent(rendered, { CustomInput });
    });
    test("should not render ModalHelperText or ModalOverlay", () => {
      const rendered = renderComponent();
      expect(rendered.queryAllByText("ModalHelperText").length).toBe(0);
      expect(rendered.queryAllByText("ModalOverlay").length).toBe(0);
    });
  });

  describe("manager N number field", () => {
    describe("initial state", () => {
      test("should render CustomInput with expected props; should not render ModalHelperText", () => {
        const rendered = renderComponent();
        expectMockedComponent(rendered, { CustomInput });
        expectOnlyPassedProps(CustomInput, {
          disabled: false,
          loading: false,
          nNumber: "n"
        });
        expect(rendered.queryAllByText("ModalHelperText").length).toBe(0);
      });
    });

    describe("valid N number entered", () => {
      describe("good response", () => {
        test("should render CustomInput & ModalHelperText with correct props", done => {
          axiosMock.onGet(apiPaths.EMPLOYEE_LOOKUP(nNumberWithoutN)).reply(200, mockSuccessfulResponse);
          const rendered = renderComponent();
          act(() => {
            const updateValue = CustomInput.mock.calls[0][0].updateValue;
            updateValue(nNumber);
            return Promise.resolve();
          }).then(() => {
            expect(CustomInput.mock.calls.length).toBe(4);
            expect(CustomInput.mock.calls[1][0].nNumber).toBe(nNumber);
            expect(CustomInput.mock.calls[2][0].loading).toBe(true);
            expect(CustomInput.mock.calls[3][0].disabled).toBe(true);
            expect(ModalHelperText.mock.calls.length).toBe(2);
            expectMockedComponent(rendered, { ModalHelperText });
            expectOnlyPassedProps(ModalHelperText, {
              message: "Frank Rizzo",
              error: false
            }, getLastInstanceCalled(ModalHelperText));
            const { clearFunction } = getMockedComponentProps(ModalHelperText, getLastInstanceCalled(ModalHelperText));
            act(() => clearFunction());
            expect(ModalHelperText.mock.calls[1][0].clearFunction).toBe(clearFunction);
            done();
          });
        });
        test("should reset nNumber field to 'n'", done => {
          axiosMock.onGet(apiPaths.EMPLOYEE_LOOKUP(nNumberWithoutN)).reply(200, mockSuccessfulResponse);
          renderComponent();
          act(() => {
            const updateValue = CustomInput.mock.calls[0][0].updateValue;
            updateValue(nNumber);
            return Promise.resolve();
          }).then(() => {
            const { clearFunction } = getMockedComponentProps(ModalHelperText, getLastInstanceCalled(ModalHelperText));
            act(() => clearFunction());
            const {
              nNumber
            } = getMockedComponentProps(CustomInput, getLastInstanceCalled(CustomInput));
            expect(nNumber).toBe("n");
            done();
          });
        });
      });
      describe("user not found", () => {
        test("ModalHelperText should display 'User not found'", done => {
          axiosMock.onGet(apiPaths.EMPLOYEE_LOOKUP(nNumberWithoutN)).reply(200, []);
          renderComponent();
          act(() => {
            const updateValue = CustomInput.mock.calls[0][0].updateValue;
            updateValue(nNumber);
            return Promise.resolve();
          }).then(() => {
            expect(CustomInput.mock.calls.length).toBe(4);
            expect(CustomInput.mock.calls[1][0].nNumber).toBe(nNumber);
            expect(CustomInput.mock.calls[2][0].loading).toBe(true);
            expect(CustomInput.mock.calls[3][0].disabled).toBe(false);
            expect(ModalHelperText.mock.calls.length).toBe(2);
            expect(ModalHelperText.mock.calls[0][0].message).toBe("User not found");
            expect(ModalHelperText.mock.calls[1][0].error).toBe(true);
            done();
          });
        });
      });
      describe("service error", () => {
        test("should set ModalHelperText error to true", done => {
          axiosMock.onGet(apiPaths.EMPLOYEE_LOOKUP(nNumberWithoutN)).networkError();
          renderComponent();
          act(() => {
            const updateValue = CustomInput.mock.calls[0][0].updateValue;
            updateValue(nNumber);
            return Promise.resolve();
          }).then(() => {
            expect(CustomInput.mock.calls.length).toBe(4);
            expect(CustomInput.mock.calls[1][0].nNumber).toBe(nNumber);
            expect(CustomInput.mock.calls[2][0].loading).toBe(true);
            expect(CustomInput.mock.calls[3][0].disabled).toBe(false);
            expect(ModalHelperText.mock.calls[1][0].error).toBe(true);
            done();
          });
        });
      });
    });

    describe("invalid N number entered", () => {
      test("CustomInput should remain enabled and ModalHelperText should not render", () => {
        renderComponent();
        act(() => {
          const updateValue = CustomInput.mock.calls[0][0].updateValue;
          updateValue("12345678");
        });
        expect(CustomInput.mock.calls.length).toBe(2);
        const newValue = CustomInput.mock.calls[1][0].nNumber;
        expect(newValue).toEqual("12345678");
        expect(CustomInput.mock.calls[0][0].disabled).toEqual(false);
        expect(CustomInput.mock.calls[1][0].disabled).toEqual(false);
        expect(ModalHelperText.mock.calls.length).toBe(0);
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
      beforeEach(() => {
        axiosMock.onGet(apiPaths.EMPLOYEE_LOOKUP(nNumberWithoutN)).reply(200, mockSuccessfulResponse);
      });
      test("should be enabled", done => {
        renderComponent();
        act(() => {
          const updateNNumber = CustomInput.mock.calls[0][0].updateValue;
          updateNNumber(nNumber);
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
            const updateNNumber = CustomInput.mock.calls[0][0].updateValue;
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
          const updateNNumber = CustomInput.mock.calls[0][0].updateValue;
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
