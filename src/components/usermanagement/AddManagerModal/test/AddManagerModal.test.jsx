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
  const mockHandleCloseFunction = mockHandleCloseFunction;
  describe("initial state", () => {
    const testComponentRenders = component => {
      test(`should render ${component}`, () => {
        const rendered = render(<AddManagerModal handleClose={mockHandleCloseFunction} />);
        expect(rendered.getAllByText(component).length).toBe(1);
      });
    };
    testComponentRenders("CustomButton");
    testComponentRenders("ModalHelperText");
    testComponentRenders("ModalHeader");
    testComponentRenders("ModalNNumber");
    test("should not render ModalOverlay", () => {
      const rendered = render(<AddManagerModal handleClose={mockHandleCloseFunction} />);
      expect(rendered.queryAllByText("ModalOverlay").length).toBe(0);
    });
  });

  describe("manager N number field", () => {
    // TODO: test that ModalOverlay renders
    const nNumber = "n1234567";
    describe("initial state", () => {
      test("should render ModalNNumber with expected props", () => {
        render(<AddManagerModal handleClose={mockHandleCloseFunction} />);
        expectOnlyPassedProps(ModalNNumber, {
          disabled: false,
          loading: false,
          nNumber: "N"
        });
      });
    });

    describe("valid N number entered", () => {
      beforeEach(() => axiosMock.reset());
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

      describe("good response", () => {
        beforeEach(() => {
          axiosMock.onGet(apiPaths.EMPLOYEE_LOOKUP(nNumber)).reply(200, mockSuccessfulResponse);
        });
        test("should call ModalNNumber with correct props", done => {
          render(<AddManagerModal handleClose={mockHandleCloseFunction} />);
          act(() => {
            const updateValue = ModalNNumber.mock.calls[0][0].updateValue;
            updateValue(nNumber);
            console.log(">>>>>>>>>> ModalNNumber.mock.calls:", ModalNNumber.mock.calls);
            return Promise.resolve();
          }).then(() => {
            expect(ModalNNumber.mock.calls.length).toBe(5);
            expect(ModalNNumber.mock.calls[1][0].nNumber).toBe(nNumber);
            expect(ModalNNumber.mock.calls[2][0].loading).toBe(true);
            // expect(ModalNNumber.mock.calls[3][0].disabled).toBe(true);
            // expect(ModalNNumber.mock.calls[4][0].loading).toBe(false);
            // expect(ModalHelperText.mock.calls[3][0].lookupInfo).toEqual(mockSuccessfulResponse[0].person.data);
            // expect(ModalHelperText.mock.calls[3][0].error).toBe(null);
            done();
          });
        });
      });

      describe("user not found", () => {
        test("", () => {
          // BLAH
        });
      });

      describe("service error", () => {
        test("", () => {
          // BLAH
        });
      });

    });

    describe("invalid N number entered", () => {
      test("TODO", () => {
        // BLAH
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
