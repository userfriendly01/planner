import AddUserModal from "../AddUserModal";
import MockAdapter from "axios-mock-adapter";
import {
  CustomButton,
  CustomSelect,
  ModalHeader,
  ModalHelperText,
  ModalNNumber,
  ModalOverlay,
  ModalPhoneNumber,
  PaperContainer
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
  mockStore,
  render,
  setupMockedComponents
} from "testUtils";
import {
  mapWorkerFromTwilioWorker,
  myAxios
} from "utils";

const axiosMock = new MockAdapter(myAxios);
jest.useFakeTimers();

jest.mock("components", () => ({
  __esModule: true,
  CustomButton: jest.fn(),
  CustomSelect: jest.fn(),
  ModalHeader: jest.fn(),
  ModalHelperText: jest.fn(),
  ModalNNumber: jest.fn(),
  ModalOverlay: jest.fn(),
  ModalPhoneNumber: jest.fn(),
  PaperContainer: jest.fn()
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
  },
  managerContext: {
    managers: managerList
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
      CustomButton,
      CustomSelect,
      ModalHeader,
      ModalHelperText,
      ModalNNumber,
      ModalOverlay,
      ModalPhoneNumber
    });
    mockHandleClose.mockClear();
    PaperContainer.mockClear();
    PaperContainer.mockImplementation(props => <div>{props.children}</div>);
  });

  describe("the intial state of the add user modal", () => {

    test("we should render the header, the correct components, and read profiles defined in the context API.", () => {
      const rendered = render(<AddUserModal handleClose={mockHandleClose} managerList={[]} />, initialTestState);
      expectMockedComponent(rendered, { CustomSelect }, 2);
      expectMockedComponent(rendered, { ModalNNumber }, 1);
      expectMockedComponent(rendered, { ModalPhoneNumber }, 1);
      expectMockedComponent(rendered, { ModalOverlay }, 0);
      expectMockedComponent(rendered, { ModalHelperText }, 0);
      expect(getMockedComponentProps(ModalHeader, getLastInstanceCalled(ModalHeader)).children).toBe("Add a User");
      expectMockedComponent(rendered, { CustomButton }, 2);
      expectOnlyPassedProps(CustomButton, {
        children: "Add User",
        disabled: true
      }, 0);
      expectOnlyPassedProps(CustomButton, {
        children: "Close"
      }, 1);
    });
  });

  describe("the Manager dropdown", () => {

    test("the initial state as well as the functionality of the display function", () => {
      render(
        <AddUserModal
          handleClose={mockHandleClose}
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
        nNumber: "n"
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

    test("changes made to the n number field - valid n number - good response and when click ModalHelperText close button", done => {
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
        const modalHelperTextProps = getMockedComponentProps(ModalHelperText, getLastInstanceCalled(ModalHelperText));
        expect(modalHelperTextProps.error).toBe(false);
        expect(modalHelperTextProps.message).toBe("Frank Rizzo");
        expect(ModalNNumber.mock.calls[getLastInstanceCalled(ModalNNumber)][0].loading).toEqual(false);
        act(() => modalHelperTextProps.clearUser());
        const modalNNumberProps = getMockedComponentProps(ModalNNumber, getLastInstanceCalled(ModalNNumber));
        expect(modalNNumberProps.nNumber).toBe("n");
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
        expect(ModalNNumber.mock.calls[4][0].loading).toEqual(false);
        const modalHelperTextProps = getMockedComponentProps(ModalHelperText, getLastInstanceCalled(ModalHelperText));
        expect(modalHelperTextProps.error).toBe(true);
        expect(modalHelperTextProps.message).toBe("User not found");
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
        expect(ModalNNumber.mock.calls[4][0].loading).toEqual(false);
        const modalHelperTextProps = getMockedComponentProps(ModalHelperText, getLastInstanceCalled(ModalHelperText));
        expect(modalHelperTextProps.error).toBe(true);
        expect(modalHelperTextProps.message).toBe("Error calling lookup service: Network Error");
        done();
      });
    });
  });

  describe("Add User and Close buttons", () => {

    test("the initial state add should be disabled, and close should be enabled", () => {
      const rendered = renderComponent();
      expectMockedComponent(rendered, { CustomButton }, 2);
      expectOnlyPassedProps(CustomButton, {
        children: "Add User",
        disabled: true
      }, 0);
      expectOnlyPassedProps(CustomButton, {
        children: "Close"
      }, 1);
    });

    test("if we click the close button, it should fire props.handleClose", () => {
      const rendered = renderComponent();
      expectMockedComponent(rendered, { CustomButton }, 2);
      const closeFn = getMockedComponentProps(CustomButton, 1).onClick;
      closeFn();
      expect(mockHandleClose).toHaveBeenCalledTimes(1);
    });

    describe("if the form becomes valid", () => {

      describe("service call to add worker succeeds", () => {
        beforeEach(() => axiosMock.onGet(apiPaths.EMPLOYEE_LOOKUP("1234567")).reply(200, mockSuccessfulResponse));

        test("when save button is clicked we should clear the user, which should disable 'Add User', and dispatch addWorker", done => {
          const twilioWorker = {
            "accountSid": "AC240dd0bc4d65ef2ab1c390f0fb9146da",
            "activityName": "Offline",
            "activitySid": "WA98fb57313627153d707a17f549566046",
            "attributes": "{\"did\":\"+16039998888\",\"email\":\"Chris.Plankey@libertymutual.com\",\"full_name\":\"Chris Plankey\",\"manager_first_name\":\"Joanna\",\"manager_last_name\":\"Makowiecka\",\"manager_n_number\":\"n0360870\",\"n_number\":\"n0287898\",\"office_location_name\":\"Dover, NH-150 Liberty Way\",\"office_location_number\":\"016C\",\"primary_dept_name\":\"016C-12160 GRM US PL - Agent & Partners\",\"primary_dept_number\":\"12160\",\"profile_id\":\"0\"}",
            "available": false,
            "dateCreated": "2019-09-25T20:58:26.000Z",
            "dateStatusChanged": "2019-09-25T20:58:26.000Z",
            "dateUpdated": "2019-09-26T16:33:44.000Z",
            "friendlyName": "n0287898",
            "sid": "WK2a1bf01df1bb7a50aac8429e5467e0ee",
            "workspaceSid": "WSde21cfcdde7bcb69cd82f1c060e5dba0",
            "url": "https://taskrouter.twilio.com/v1/Workspaces/WSde21cfcdde7bcb69cd82f1c060e5dba0/Workers/WK2a1bf01df1bb7a50aac8429e5467e0ee"
          };
          axiosMock.onPost(apiPaths.CREATE_WORKER).reply(200, twilioWorker);
          const rendered = renderComponent();
          act(() => {
            const updateManager = getMockedComponentProps(CustomSelect, getLastInstanceCalled(CustomSelect) - 1).updateValue;
            updateManager(JSON.stringify(managerList[0]));
          });
          act(() => {
            const updateProfile = getMockedComponentProps(CustomSelect, getLastInstanceCalled(CustomSelect)).updateValue;
            updateProfile(profileList[0].profile_id);
          });
          act(() => {
            const updatePhone = getMockedComponentProps(ModalPhoneNumber, getLastInstanceCalled(ModalPhoneNumber)).updateValue;
            updatePhone("6034567890");
          });
          act(() => {
            const updateNNum = getMockedComponentProps(ModalNNumber, getLastInstanceCalled(ModalNNumber)).updateValue;
            updateNNum("n1234567");
            return Promise.resolve();
          }).then(() => {
            const addUserButtonProps = getMockedComponentProps(CustomButton, getLastInstanceCalled(CustomButton) - 1);
            expect(addUserButtonProps.disabled).toBe(false);
            act(() => {
              const addUserButtonOnClick = getMockedComponentProps(CustomButton, getLastInstanceCalled(CustomButton) - 1).onClick;
              addUserButtonOnClick();
              return Promise.resolve();
            }).then(() => {
              expectMockedComponent(rendered, { ModalOverlay });
              const saveStatus = getMockedComponentProps(ModalOverlay, getLastInstanceCalled(ModalOverlay)).status;
              const nNumber = getMockedComponentProps(ModalNNumber, getLastInstanceCalled(ModalNNumber)).nNumber;
              const addUserButtonProps2 = getMockedComponentProps(CustomButton, getLastInstanceCalled(CustomButton) - 1);
              expect(addUserButtonProps2.disabled).toBe(true);
              expect(saveStatus).toBe("success");
              expect(nNumber).toBe("n");
              act(() => jest.runAllTimers());
              expectMockedComponent(rendered, { ModalOverlay }, 0);
              const actions = mockStore.getActions();
              expect(actions).toHaveLength(1);
              expect(actions[0]).toEqual({
                type: "addWorker",
                payload: mapWorkerFromTwilioWorker(twilioWorker)
              });
              done();
            });
          });
        });
      });

      describe("service call to add worker fails", () => {
        beforeEach(() => axiosMock.onPost(apiPaths.CREATE_WORKER).networkError());

        test("when save button is clicked we should not clear the user, or disable 'Add User' and not dispatch an action", done => {
          const rendered = renderComponent();
          act(() => {
            const updateManager = getMockedComponentProps(CustomSelect, getLastInstanceCalled(CustomSelect) - 1).updateValue;
            updateManager(JSON.stringify(managerList[0]));
          });
          act(() => {
            const updateProfile = getMockedComponentProps(CustomSelect, getLastInstanceCalled(CustomSelect)).updateValue;
            updateProfile(profileList[0].profile_id);
          });
          act(() => {
            const updatePhone = getMockedComponentProps(ModalPhoneNumber, getLastInstanceCalled(ModalPhoneNumber)).updateValue;
            updatePhone("6034567890");
          });
          act(() => {
            const updateNNum = getMockedComponentProps(ModalNNumber, getLastInstanceCalled(ModalNNumber)).updateValue;
            updateNNum("n1234567");
            return Promise.resolve();
          }).then(() => {
            const addUserButtonProps = getMockedComponentProps(CustomButton, getLastInstanceCalled(CustomButton) - 1);
            expect(addUserButtonProps.disabled).toBe(false);
            act(() => {
              const addUserButtonOnClick = getMockedComponentProps(CustomButton, getLastInstanceCalled(CustomButton) - 1).onClick;
              addUserButtonOnClick();
              return Promise.resolve();
            }).then(() => {
              const saveStatus = getMockedComponentProps(ModalOverlay, getLastInstanceCalled(ModalOverlay)).status;
              const nNumber = getMockedComponentProps(ModalNNumber, getLastInstanceCalled(ModalNNumber)).nNumber;
              const addUserButtonProps2 = getMockedComponentProps(CustomButton, getLastInstanceCalled(CustomButton) - 1);
              expect(addUserButtonProps2.disabled).toBe(false);
              expect(saveStatus).toBe("fail");
              expect(nNumber).toBe("n1234567");
              act(() => jest.runAllTimers());
              expectMockedComponent(rendered, { ModalOverlay }, 0);
              const actions = mockStore.getActions();
              expect(actions).toHaveLength(0);
              done();
            });
          });
        });
      });
    });
  });
});