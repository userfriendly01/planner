import AddUserModal from "../AddUserModal";
import MockAdapter from "axios-mock-adapter";
import {
  CustomSelect,
  ModalHelperText,
  ModalNNumber,
  ModalOverlay,
  ModalPhoneNumber
} from "components";
import { initialState } from "context";
import { apiPaths } from "globals";
import React from "react";
import { act } from "react-dom/test-utils";
import {
  expectOnlyPassedProps,
  fireEvent,
  render,
  setupMockedComponents
} from "testUtils";
import { myAxios } from "utils";

const axiosMock = new MockAdapter(myAxios);

jest.mock("components", () => ({
  __esModule: true,
  CustomSelect: jest.fn(),
  ModalHelperText: jest.fn(),
  ModalNNumber: jest.fn(),
  ModalOverlay: jest.fn(),
  ModalPhoneNumber: jest.fn()
}));

const managerList = [
  {
    manager_first_name: "John",
    manager_last_name: "Wick",
    manager_n_number: "n1234567"
  },
  {
    manager_first_name: "Test",
    manager_last_name: "Manager",
    manager_n_number: "n7454853"
  }
];

const profileList = [
  {
    profile_nme: "test",
    profile_id: 1
  },
  {
    profile_nme: "test2",
    profile_id: 2
  }
];

const initialTestState = {
  ...initialState,
  profileContext: {
    profiles: profileList
  }
};

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

const mockHandleClose = jest.fn();

const renderComponent = () => {
  return render(<AddUserModal handleClose={mockHandleClose} managerList={managerList} />, initialTestState);
};

describe("<AddUserModal />", () => {

  beforeEach(() => {
    setupMockedComponents({
      CustomSelect,
      ModalHelperText,
      ModalNNumber,
      ModalOverlay,
      ModalPhoneNumber
    });
    mockHandleClose.mockClear();
  });

  describe("the intial state of the add user modal", () => {

    test("we should render the header, the correct components, and read profiles defined in the context API.", () => {
      const rendered = render(<AddUserModal handleClose={mockHandleClose} managerList={[]} />, initialTestState);
      expect(rendered.getAllByText("CustomSelect").length).toBe(2);
      expect(rendered.getAllByText("ModalNNumber").length).toBe(1);
      expect(rendered.getAllByText("ModalPhoneNumber").length).toBe(1);
      expect(rendered.queryAllByText("ModalOverlay").length).toBe(0);
      expect(rendered.queryAllByText("ModalHelperText").length).toBe(1);
      expect(rendered.getByText("Add a User")).toBeInTheDocument();
      expect(rendered.getByText("Add User", { selector: "button" })).toBeInTheDocument();
      expect(rendered.getByText("Close", { selector: "button" })).toBeInTheDocument();
    });

  });

  describe("the Manager dropdown", () => {

    test("the initial state as well as the functionality of the display function", () => {
      render(
        <AddUserModal
          handleClose={mockHandleClose}
          managerList={managerList}
        />,
        initialTestState
      );
      const expectedManagerProps = {
        label: "Manager",
        labelWidth: 65,
        optionsList: managerList,
        value: ""
      };
      expectOnlyPassedProps(CustomSelect, expectedManagerProps, 0);
      const optionsDisplayFunc = CustomSelect.mock.calls[0][0].optionsDisplayFunc;
      const option = optionsDisplayFunc(managerList[0]);
      expect(option).toEqual({
        display: `${managerList[0].manager_first_name} ${managerList[0].manager_last_name}`,
        key: managerList[0].manager_n_number,
        value: JSON.stringify(managerList[0])
      });
    });

    test("changes made to the manager dropdown", () => {
      renderComponent();
      // Next I'll call the update function, which should update the form and cause a re-render.
      act(() => {
        const updateValue = CustomSelect.mock.calls[0][0].updateValue;
        updateValue(JSON.stringify(managerList[0]));
      });
      expect(CustomSelect.mock.calls.length).toBe(4);
      const newValue = CustomSelect.mock.calls[2][0].value;
      expect(newValue).toEqual(JSON.stringify(managerList[0]));
    });

  });

  describe("the Team dropdown", () => {

    test("the initial state driven from the Context API as well as the functionality of the display function", () => {
      renderComponent();
      const expectedTeamProps = {
        label: "Team",
        labelWidth: 41,
        optionsList: profileList,
        value: ""
      };
      expectOnlyPassedProps(CustomSelect, expectedTeamProps, 1);
      const optionsDisplayFunc = CustomSelect.mock.calls[1][0].optionsDisplayFunc;
      const option = optionsDisplayFunc(profileList[0]);
      expect(option).toEqual({
        display: profileList[0].profile_nme,
        key: profileList[0].profile_id,
        value: profileList[0].profile_id
      });
    });

    test("changes made to the team dropdown", () => {
      renderComponent();
      // Next I'll call the update function, which should update the form and cause a re-render.
      act(() => {
        const updateValue = CustomSelect.mock.calls[1][0].updateValue;
        updateValue(profileList[0].profile_id);
      });
      expect(CustomSelect.mock.calls.length).toBe(4);
      const newValue = CustomSelect.mock.calls[3][0].value;
      expect(newValue).toEqual(profileList[0].profile_id);
    });

  });

  describe("the Phone Number field", () => {

    test("the initial state", () => {
      renderComponent();
      const expectedOutgoingProps = {
        outgoingNumber: ""
      };
      expectOnlyPassedProps(ModalPhoneNumber, expectedOutgoingProps, 0);
    });

    test("changes made to the phone number dropdown", () => {
      renderComponent();
      // Next I'll call the update function, which should update the form and cause a re-render.
      act(() => {
        const updateValue = ModalPhoneNumber.mock.calls[0][0].updateValue;
        updateValue("12345678");
      });
      expect(ModalPhoneNumber.mock.calls.length).toBe(2);
      const newValue = ModalPhoneNumber.mock.calls[1][0].outgoingNumber;
      expect(newValue).toEqual("12345678");
    });

  });

  describe("the N Number field", () => {

    test("the initial state", () => {
      renderComponent();
      const expectedNNumProps = {
        disabled: false,
        loading: false,
        nNumber: "N"
      };
      expectOnlyPassedProps(ModalNNumber, expectedNNumProps, 0);
    });

    test("changes made to the n number field - invalid n number", () => {
      renderComponent();
      // Next I'll call the update function, which should update the form and cause a re-render.
      act(() => {
        const updateValue = ModalNNumber.mock.calls[0][0].updateValue;
        updateValue("12345678");
      });
      expect(ModalNNumber.mock.calls.length).toBe(2);
      const newValue = ModalNNumber.mock.calls[1][0].nNumber;
      expect(newValue).toEqual("12345678");
    });

    test("changes made to the n number field - valid n number - good response", done => {
      axiosMock.onGet(apiPaths.EMPLOYEE_LOOKUP("1234567")).reply(200, mockSuccessfulResponse);
      renderComponent();
      // Next I'll call the update function, which should update the form and cause a re-render.
      act(() => {
        const updateValue = ModalNNumber.mock.calls[0][0].updateValue;
        updateValue("n1234567");
        return Promise.resolve();
      }).then(() => {
        expect(ModalNNumber.mock.calls.length).toBe(5);
        expect(ModalNNumber.mock.calls[1][0].nNumber).toEqual("n1234567");
        expect(ModalNNumber.mock.calls[2][0].loading).toEqual(true);
        expect(ModalNNumber.mock.calls[3][0].disabled).toEqual(true);
        expect(ModalHelperText.mock.calls[3][0].lookupInfo).toEqual({
          departmentName: "Computers",
          departmentNumber: "4848",
          email: "test@abc.com",
          firstName: "Frank",
          lastName: "Rizzo",
          officeName: "Springfield 012B",
          officeNumber: "ABC123"
        });
        expect(ModalHelperText.mock.calls[3][0].error).toEqual(null);
        expect(ModalNNumber.mock.calls[4][0].loading).toEqual(false);
        done();
      });
    });

    test("changes made to the n number field - valid n number - user not found", done => {
      axiosMock.onGet(apiPaths.EMPLOYEE_LOOKUP("1234567")).reply(200, []);
      renderComponent();
      // Next I'll call the update function, which should update the form and cause a re-render.
      act(() => {
        const updateValue = ModalNNumber.mock.calls[0][0].updateValue;
        updateValue("n1234567");
        return Promise.resolve();
      }).then(() => {
        expect(ModalNNumber.mock.calls.length).toBe(5);
        expect(ModalNNumber.mock.calls[1][0].nNumber).toEqual("n1234567");
        expect(ModalNNumber.mock.calls[2][0].loading).toEqual(true);
        expect(ModalNNumber.mock.calls[3][0].disabled).toEqual(false);
        expect(ModalHelperText.mock.calls[3][0].lookupInfo).toEqual({});
        expect(ModalHelperText.mock.calls[3][0].error).toEqual("User Not Found");
        expect(ModalNNumber.mock.calls[4][0].loading).toEqual(false);
        done();
      });
    });

    test("changes made to the n number field - valid n number - service error", done => {
      axiosMock.onGet(apiPaths.EMPLOYEE_LOOKUP("1234567")).networkError();
      renderComponent();
      // Next I'll call the update function, which should update the form and cause a re-render.
      act(() => {
        const updateValue = ModalNNumber.mock.calls[0][0].updateValue;
        updateValue("n1234567");
        return Promise.resolve();
      }).then(() => {
        expect(ModalNNumber.mock.calls.length).toBe(5);
        expect(ModalNNumber.mock.calls[1][0].nNumber).toEqual("n1234567");
        expect(ModalNNumber.mock.calls[2][0].loading).toEqual(true);
        expect(ModalNNumber.mock.calls[3][0].disabled).toEqual(false);
        expect(ModalHelperText.mock.calls[3][0].lookupInfo).toEqual({});
        expect(ModalHelperText.mock.calls[3][0].error).toEqual("Error calling lookup service: Network Error");
        expect(ModalNNumber.mock.calls[4][0].loading).toEqual(false);
        done();
      });
    });

  });

  describe("Add User and Close buttons", () => {

    test("the initial state add should be disabled, and close should be enabled", () => {
      const rendered = renderComponent();
      expect(rendered.getByText("Close", { selector: "button" })).not.toHaveClass("Mui-disabled");
      expect(rendered.getByText("Add User", { selector: "button" })).toHaveClass("Mui-disabled");
      expect(mockHandleClose.mock.calls.length).toBe(0);
    });

    test("if we click the close button, it should fire the sent in method", () => {
      const rendered = renderComponent();
      fireEvent.click(rendered.getByText("Close", { selector: "button" }));
      expect(mockHandleClose.mock.calls.length).toBe(1);
    });

    describe("if the form becomes valid", () => {

      beforeEach(() => {
        axiosMock.onGet(apiPaths.EMPLOYEE_LOOKUP("1234567")).reply(200, mockSuccessfulResponse);
      });

      test("if we click the save button, and the save call passes", () => {
        axiosMock.onPost(apiPaths.CREATE_WORKER).reply(200, { worker: "success" });
        const rendered = renderComponent();
        act(() => {
          const updateManager = CustomSelect.mock.calls[0][0].updateValue;
          updateManager(JSON.stringify(managerList[0]));
        });
        act(() => {
          const updateProfile = CustomSelect.mock.calls[1][0].updateValue;
          updateProfile(profileList[0].profile_id);
        });
        act(() => {
          const updatePhone = ModalPhoneNumber.mock.calls[0][0].updateValue;
          updatePhone("6034567890");
        });
        act(() => {
          const updateNNum = ModalNNumber.mock.calls[0][0].updateValue;
          updateNNum("N1234567");
        });
        expect(rendered.getByText("Close", { selector: "button" })).not.toHaveClass("Mui-disabled");
        expect(rendered.getByText("Add User", { selector: "button" })).not.toHaveClass("Mui-disabled");
      });
    });

  });
});