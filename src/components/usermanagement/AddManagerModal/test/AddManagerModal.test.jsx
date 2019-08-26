import AddManagerModal from "../AddManagerModal";
import MockAdapter from "axios-mock-adapter";
import {
  CustomButton,
  ModalHelperText,
  ModalHeader,
  ModalNNumber,
  ModalOverlay,
  PaperContainer
} from "components";
// import { initialState } from "context";
import { apiPaths } from "globals";
import React from "react";
import { act } from "react-dom/test-utils";
import {
  expectOnlyPassedProps,
  // fireEvent,
  render,
  setupMockedComponents
} from "testUtils";
import { myAxios } from "utils";

const axiosMock = new MockAdapter(myAxios);

jest.mock("components", () => ({
  __esModule: true,
  CustomButton: jest.fn(),
  ModalHelperText: jest.fn(),
  ModalHeader: jest.fn(),
  ModalNNumber: jest.fn(),
  ModalOverlay: jest.fn(),
  PaperContainer: jest.fn()
}));

describe("<AddManagerModal />", () => {
  const mockHandleClose = jest.fn();
  const renderComponent = () => render(<AddManagerModal handleClose={mockHandleClose} />);
  beforeEach(() => {
    setupMockedComponents({
      CustomButton,
      ModalHelperText,
      ModalHeader,
      ModalNNumber,
      ModalOverlay
    });
    PaperContainer.mockClear();
    PaperContainer.mockImplementation(props => <div>{props.children}</div>);
  });
  describe("initial state of the modal", () => {
    test("should render CustomButton, ModalHelperText, ModalHeader & ModalNNumber once each", () => {
      const rendered = renderComponent();
      expect(rendered.getAllByText("CustomButton").length).toBe(1);
      expect(rendered.getAllByText("ModalHelperText").length).toBe(1);
      expect(rendered.getAllByText("ModalHeader").length).toBe(1);
      expect(rendered.getAllByText("ModalNNumber").length).toBe(1);
    });
    test("should not render ModalOverlay", () => {
      const rendered = renderComponent();
      expect(rendered.queryAllByText("ModalOverlay").length).toBe(0);
    });
  });

  describe("manager N number field", () => {
    // TODO: test that ModalOverlay renders
    const nNumber = "n1234567";
    const nNumberWithoutN = "1234567";
    describe("initial state", () => {
      test("should render ModalNNumber with expected props", () => {
        renderComponent();
        expectOnlyPassedProps(ModalNNumber, {
          disabled: false,
          loading: false,
          nNumber: "N"
        });
      });
    });

    describe("valid N number entered", () => {
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
      beforeEach(() => axiosMock.reset());

      describe("good response", () => {
        test("should call ModalNNumber & ModalHelperText with correct props and should return lookupInfo in camelCase", done => {
          axiosMock.onGet(apiPaths.EMPLOYEE_LOOKUP(nNumberWithoutN)).reply(200, mockSuccessfulResponse);
          renderComponent();
          act(() => {
            const updateValue = ModalNNumber.mock.calls[0][0].updateValue;
            updateValue(nNumber);
            return Promise.resolve();
          }).then(() => {
            expect(ModalNNumber.mock.calls.length).toBe(5);
            expect(ModalNNumber.mock.calls[1][0].nNumber).toBe(nNumber);
            expect(ModalNNumber.mock.calls[2][0].loading).toBe(true);
            expect(ModalNNumber.mock.calls[3][0].disabled).toBe(true);
            expect(ModalHelperText.mock.calls[3][0].lookupInfo).toEqual({
              email: "test@abc.com",
              firstName: "Frank",
              lastName: "Rizzo",
              officeName: "Springfield 012B",
              officeNumber: "ABC123",
              departmentName: "Computers",
              departmentNumber: "4848"
            });
            expect(ModalHelperText.mock.calls[3][0].error).toBe(null);
            expect(ModalNNumber.mock.calls[4][0].loading).toBe(false);
            done();
          });
        });
      });

      describe("user not found", () => {
        test("should return 'User not found' & lookupInfo should be empty", done => {
          axiosMock.onGet(apiPaths.EMPLOYEE_LOOKUP(nNumberWithoutN)).reply(200, []);
          renderComponent();
          act(() => {
            const updateValue = ModalNNumber.mock.calls[0][0].updateValue;
            updateValue(nNumber);
            return Promise.resolve();
          }).then(() => {
            expect(ModalNNumber.mock.calls.length).toBe(5);
            expect(ModalNNumber.mock.calls[1][0].nNumber).toBe(nNumber);
            expect(ModalNNumber.mock.calls[2][0].loading).toBe(true);
            expect(ModalNNumber.mock.calls[3][0].disabled).toBe(false);
            expect(ModalHelperText.mock.calls[3][0].lookupInfo).toStrictEqual({});
            expect(ModalHelperText.mock.calls[3][0].error).toBe("User not found");
            expect(ModalNNumber.mock.calls[4][0].loading).toBe(false);
            done();
          });
        });
      });

      describe("service error", () => {
        test("should return network error & lookupInfo should be empty", done => {
          axiosMock.onGet(apiPaths.EMPLOYEE_LOOKUP(nNumberWithoutN)).networkError();
          renderComponent();
          act(() => {
            const updateValue = ModalNNumber.mock.calls[0][0].updateValue;
            updateValue(nNumber);
            return Promise.resolve();
          }).then(() => {
            expect(ModalNNumber.mock.calls.length).toBe(5);
            expect(ModalNNumber.mock.calls[1][0].nNumber).toBe(nNumber);
            expect(ModalNNumber.mock.calls[2][0].loading).toBe(true);
            expect(ModalNNumber.mock.calls[3][0].disabled).toBe(false);
            expect(ModalHelperText.mock.calls[3][0].lookupInfo).toStrictEqual({});
            expect(ModalHelperText.mock.calls[3][0].error).toBe("Error calling lookup service: Network Error");
            expect(ModalNNumber.mock.calls[4][0].loading).toBe(false);
            done();
          });
        });
      });

    });

    describe("invalid N number entered", () => {
      test("should update new value; disabled should remain false after nNumber is upated", () => {
        renderComponent();
        act(() => {
          const updateValue = ModalNNumber.mock.calls[0][0].updateValue;
          updateValue("12345678");
        });
        expect(ModalNNumber.mock.calls.length).toBe(2);
        const newValue = ModalNNumber.mock.calls[1][0].nNumber;
        expect(newValue).toEqual("12345678");
        expect(ModalNNumber.mock.calls[0][0].disabled).toEqual(false);
        expect(ModalNNumber.mock.calls[1][0].disabled).toEqual(false);
      });
    });
  });

  describe("Add Manager button", () => {
    // const successMessage = "Manager added successfully";
    // test(`should display ${successMessage}`, done => {

    test("", () => {
      // BLAH
    });
  });

  describe("close button", () => {
    test("", () => {
      // BLAH
    });
  });

});
