import AddUserModal from "../AddUserModal";
import MockAdapter from "axios-mock-adapter";
import {
  ModalExtension,
  ModalHelperText,
  ModalNNumber,
  ModalOverlay,
  ModalPhoneNumber,
  OutlinedSelect,
  PaperContainer,
  StyledButton
} from "components";
import { initialState } from "context";
import {
  apiPaths,
  modalOverlayStatuses,
  modalOverlayTimeout
} from "globals";
import React from "react";
import {
  act,
  expectMockedComponent,
  expectOnlyPassedProps,
  getLastInstanceCalled,
  getMockedComponentProps,
  mockStore,
  render,
  setupMockedComponents,
  waitFor
} from "testUtils";
import {
  mapWorkerFromTwilioWorker,
  myAxios
} from "utils";

const axiosMock = new MockAdapter(myAxios);
jest.useFakeTimers();

jest.mock("components", () => ({
  __esModule: true,
  ModalExtension: jest.fn(),
  ModalHelperText: jest.fn(),
  ModalNNumber: jest.fn(),
  ModalOverlay: jest.fn(),
  ModalPhoneNumber: jest.fn(),
  OutlinedSelect: jest.fn(),
  PaperContainer: jest.fn(),
  StyledButton: jest.fn()
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

const employeeLookupResponse = [
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

const formOptions = {
  did: "6034567890",
  extension: "1234",
  manager: managerList[0],
  nNumber: "n1234567",
  profileId: profileList[0].profile_id
};

const mockHandleClose = jest.fn();

const renderComponent = () => {
  return render(<AddUserModal handleClose={mockHandleClose} managerList={managerList} />, initialTestState);
};

describe("<AddUserModal />", () => {

  beforeEach(() => {
    axiosMock.reset();
    jest.clearAllMocks();
    setupMockedComponents({
      ModalExtension,
      ModalHelperText,
      ModalNNumber,
      ModalOverlay,
      ModalPhoneNumber,
      OutlinedSelect,
      StyledButton
    });
    PaperContainer.mockImplementation(props => <div>{props.children}</div>);
  });

  describe("the intial state of the add user modal", () => {

    test("we should render the header, the correct components, and read profiles defined in the context API.", () => {
      const rendered = render(<AddUserModal handleClose={mockHandleClose} managerList={[]} />, initialTestState);
      expectMockedComponent(rendered, { OutlinedSelect }, 2);
      expectMockedComponent(rendered, { ModalExtension }, 1);
      expectMockedComponent(rendered, { ModalNNumber }, 1);
      expectMockedComponent(rendered, { ModalPhoneNumber }, 1);
      expectMockedComponent(rendered, { ModalOverlay }, 0);
      expectMockedComponent(rendered, { ModalHelperText }, 0);
      expect(rendered.container).toHaveTextContent("Add a User");
      expectMockedComponent(rendered, { StyledButton }, 2);
      expectOnlyPassedProps(StyledButton, {
        children: "Add User",
        disabled: true
      }, 0);
      expectOnlyPassedProps(StyledButton, {
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
        labelWidth: 67,
        optionsList: managerList,
        value: ""
      };
      expectOnlyPassedProps(OutlinedSelect, expectedManagerProps, 0);
      const optionsDisplayFunc = OutlinedSelect.mock.calls[0][0].optionsDisplayFunc;
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
        const updateValue = OutlinedSelect.mock.calls[0][0].updateValue;
        updateValue(JSON.stringify(managerList[0]));
      });
      expect(OutlinedSelect.mock.calls.length).toBe(4);
      const newValue = OutlinedSelect.mock.calls[2][0].value;
      expect(newValue).toEqual(JSON.stringify(managerList[0]));
    });

  });

  describe("the Team dropdown", () => {

    test("the initial state driven from the Context API as well as the functionality of the display function", () => {
      renderComponent();
      const expectedTeamProps = {
        label: "Team",
        labelWidth: 44,
        optionsList: profileList,
        value: ""
      };
      expectOnlyPassedProps(OutlinedSelect, expectedTeamProps, 1);
      const optionsDisplayFunc = OutlinedSelect.mock.calls[1][0].optionsDisplayFunc;
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
        const updateValue = OutlinedSelect.mock.calls[1][0].updateValue;
        updateValue(profileList[0].profile_id);
      });
      expect(OutlinedSelect.mock.calls.length).toBe(4);
      const newValue = OutlinedSelect.mock.calls[3][0].value;
      expect(newValue).toEqual(profileList[0].profile_id);
    });

  });

  describe("the Phone Number field", () => {

    test("the initial state", () => {
      renderComponent();
      const expectedOutgoingProps = {
        number: "",
        label: "Outgoing Number"
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
      const newValue = ModalPhoneNumber.mock.calls[1][0].number;
      expect(newValue).toEqual("12345678");
    });
  });

  describe("ModalNNumber", () => {
    test("the initial state", () => {
      renderComponent();
      const expectedNNumProps = {
        disabled: false,
        form: {
          extension: "",
          extensionValid: false,
          lookupInfo: {},
          manager: "",
          nNumber: "n",
          outgoing: "",
          outgoingValid: false,
          team: ""
        },
        nNumber: "n"
      };
      expectOnlyPassedProps(ModalNNumber, expectedNNumProps, 0);
    });
    test("changes made to the n number field - invalid n number", () => {
      renderComponent();
      act(() => {
        const updateValue = ModalNNumber.mock.calls[0][0].updateValue;
        updateValue("12345678");
      });
      expect(ModalNNumber.mock.calls.length).toBe(2);
      const newValue = ModalNNumber.mock.calls[1][0].nNumber;
      expect(newValue).toEqual("12345678");
    });
    test("clear user called should reset the field", () => {
      renderComponent();
      act(() => {
        const updateValue = ModalNNumber.mock.calls[0][0].updateValue;
        updateValue("12345678");
      });
      let newValue = ModalNNumber.mock.calls[1][0].nNumber;
      expect(newValue).toEqual("12345678");
      act(() => {
        const clearUser = ModalNNumber.mock.calls[1][0].clearUser;
        clearUser("12345678");
      });
      newValue = ModalNNumber.mock.calls[2][0].nNumber;
      expect(newValue).toEqual("n");
    });
    test("when we update the form in modalNNumber we should see those changes in a rerender", () => {
      renderComponent();
      const newForm = {
        lookupInfo: {
          disabled: "not anymore"
        },
        manager: "",
        outgoing: "",
        team: "",
        extensionValid: true
      };
      expect(ModalNNumber.mock.calls[0][0].disabled).toEqual(false);
      act(() => {
        const setForm = ModalNNumber.mock.calls[0][0].setForm;
        setForm(newForm);
      });
      const form = ModalNNumber.mock.calls[1][0].form;
      expect(form).toEqual(newForm);
      expect(ModalNNumber.mock.calls[1][0].disabled).toEqual(true);
    });
  });

  describe("ModalExtension", () => {
    test("the initial state", () => {
      renderComponent();
      const expectedExtensionProps = {
        disabled: false,
        extension: "",
        form: {
          extension: "",
          extensionValid: false,
          lookupInfo: {},
          manager: "",
          nNumber: "n",
          outgoing: "",
          outgoingValid: false,
          team: ""
        }
      };
      expectOnlyPassedProps(ModalExtension, expectedExtensionProps, 0);
    });
    test("changes made to the extension field - invalid extension", () => {
      renderComponent();
      act(() => {
        const updateValue = ModalExtension.mock.calls[0][0].updateValue;
        updateValue("1234");
      });
      expect(ModalExtension.mock.calls.length).toBe(2);
      const newValue = ModalExtension.mock.calls[1][0].extension;
      expect(newValue).toEqual("1234");
    });
    test("clear extension called should reset the field", () => {
      renderComponent();
      act(() => {
        const updateValue = ModalExtension.mock.calls[0][0].updateValue;
        updateValue("1234");
      });
      let newValue = ModalExtension.mock.calls[1][0].extension;
      expect(newValue).toEqual("1234");
      act(() => {
        const clearExtension = ModalExtension.mock.calls[1][0].clearExtension;
        clearExtension("1234");
      });
      newValue = ModalExtension.mock.calls[2][0].extension;
      expect(newValue).toEqual("");
    });
    test("when we update the form in ModalExtension we should see those changes in a rerender", () => {
      renderComponent();
      const newForm = {
        lookupInfo: {
          disabled: "not anymore"
        },
        manager: "",
        outgoing: "",
        team: "",
        extensionValid: true
      };
      expect(ModalExtension.mock.calls[0][0].disabled).toEqual(false);
      act(() => {
        const setForm = ModalExtension.mock.calls[0][0].setForm;
        setForm(newForm);
      });
      const form = ModalExtension.mock.calls[1][0].form;
      expect(form).toEqual(newForm);
      expect(ModalExtension.mock.calls[1][0].disabled).toEqual(false);
    });
  });

  describe("Add User and Close buttons", () => {

    const updateformSoItIsValid = () => {
      act(() => {
        const updateManager = getMockedComponentProps(OutlinedSelect, getLastInstanceCalled(OutlinedSelect) - 1).updateValue;
        updateManager(JSON.stringify(formOptions.manager));
      });
      act(() => {
        const updateProfile = getMockedComponentProps(OutlinedSelect, getLastInstanceCalled(OutlinedSelect)).updateValue;
        updateProfile(formOptions.profileId);
      });
      act(() => {
        const updatePhone = getMockedComponentProps(ModalPhoneNumber, getLastInstanceCalled(ModalPhoneNumber)).updateValue;
        updatePhone("(603)456-7890", formOptions.did, true);
      });
      act(() => {
        const updateExtension = getMockedComponentProps(ModalExtension, getLastInstanceCalled(ModalExtension)).updateValue;
        updateExtension(formOptions.extension);
      });
      act(() => {
        const {
          form,
          setForm
        } = getMockedComponentProps(ModalExtension, getLastInstanceCalled(ModalExtension));
        setForm({
          ...form,
          extensionValid: true
        });
      });
      act(() => {
        const updateNNum = getMockedComponentProps(ModalNNumber, getLastInstanceCalled(ModalNNumber)).updateValue;
        updateNNum(formOptions.nNumber);
      });
      act(() => {
        // nNumber has internal functionality to add `lookupInfo` to form that we need to mimic
        const props = getMockedComponentProps(ModalExtension, getLastInstanceCalled(ModalNNumber));
        const setForm = props.setForm;
        const form = props.form;
        setForm({
          ...form,
          lookupInfo: {
            email: "test@abc.com",
            firstName: "Frank",
            lastName: "Rizzo",
            officeName: "Springfield 012B",
            officeNumber: "ABC123",
            departmentName: "Computers",
            departmentNumber: "4848"
          }
        });
      });
      const addUserButtonProps = getMockedComponentProps(StyledButton, getLastInstanceCalled(StyledButton) - 1);
      expect(addUserButtonProps.disabled).toBe(false);
    };

    test("the initial state add should be disabled, and close should be enabled", () => {
      const rendered = renderComponent();
      expectMockedComponent(rendered, { StyledButton }, 2);
      expectOnlyPassedProps(StyledButton, {
        children: "Add User",
        disabled: true
      }, 0);
      expectOnlyPassedProps(StyledButton, {
        children: "Close"
      }, 1);
    });

    test("if we click the close button, it should fire props.handleClose", () => {
      const rendered = renderComponent();
      expectMockedComponent(rendered, { StyledButton }, 2);
      const closeFn = getMockedComponentProps(StyledButton, 1).onClick;
      closeFn();
      expect(mockHandleClose).toHaveBeenCalledTimes(1);
    });

    describe("if the form becomes valid", () => {

      describe("service call to add worker succeeds", () => {

        const twilioWorkerResponse = {
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

        beforeEach(() => {
          axiosMock.onPost(apiPaths.CREATE_WORKER).reply(200, twilioWorkerResponse);
        });

        test.only("when save button is clicked we should clear the user, which should disable 'Add User', and dispatch addWorker", async () => {
          const rendered = renderComponent();
          updateformSoItIsValid();
          // instanceCalled - 1 because the Close button is the last instance called
          await act(() => {
            const addUserButtonOnClick = getMockedComponentProps(StyledButton, getLastInstanceCalled(StyledButton) - 1).onClick;
            addUserButtonOnClick();
          });
          const expectedTwilioWorkerAttributesPosted = {
            did: `+1${formOptions.did}`,
            email: employeeLookupResponse[0].person.data.Email,
            email_address: employeeLookupResponse[0].person.data.Email,
            emp_first_name: employeeLookupResponse[0].person.data.FirstName,
            emp_last_name: employeeLookupResponse[0].person.data.LastName,
            extension: formOptions.extension,
            full_name: `${employeeLookupResponse[0].person.data.FirstName} ${employeeLookupResponse[0].person.data.LastName}`,
            manager_first_name: formOptions.manager.manager_first_name,
            manager_last_name: formOptions.manager.manager_last_name,
            manager_n_number: formOptions.manager.manager_n_number,
            n_number: formOptions.nNumber,
            office_location_name: employeeLookupResponse[0].person.data.OfficeName,
            office_location_number: employeeLookupResponse[0].person.data.OfficeNumber,
            primary_dept_name: employeeLookupResponse[0].person.data.DepartmentName,
            primary_dept_number: employeeLookupResponse[0].person.data.DepartmentNumber,
            profile_id: formOptions.profileId
          };
          // await waitFor(() => {
          //   expect(axiosMock.history.post[0].data).toEqual(JSON.stringify({ attributes: expectedTwilioWorkerAttributesPosted }));
          //   expectMockedComponent(rendered, { ModalOverlay });
          //   const saveStatus = getMockedComponentProps(ModalOverlay, getLastInstanceCalled(ModalOverlay)).status;
          //   const nNumber = getMockedComponentProps(ModalNNumber, getLastInstanceCalled(ModalNNumber)).nNumber;
          //   const addUserButtonProps2 = getMockedComponentProps(StyledButton, getLastInstanceCalled(StyledButton) - 1);
          //   expect(addUserButtonProps2.disabled).toBe(true);
          //   expect(saveStatus).toBe(modalOverlayStatuses.SUCCESS);
          //   expect(nNumber).toBe("n");
          //   act(() => jest.runAllTimers());
          //   expectMockedComponent(rendered, { ModalOverlay }, 0);
          //   const actions = mockStore.getActions();
          //   expect(actions).toHaveLength(1);
          //   expect(actions[0]).toEqual({
          //     type: "addWorker",
          //     payload: mapWorkerFromTwilioWorker(twilioWorkerResponse)
          //   });
          // });
        });
      });

      describe("service call to add worker fails", () => {
        beforeEach(() => axiosMock.onPost(apiPaths.CREATE_WORKER).networkError());

        test("when save button is clicked we should not clear the user, or disable 'Add User' and not dispatch an action", done => {
          const rendered = renderComponent();
          updateformSoItIsValid();
          const addUserButtonProps = getMockedComponentProps(StyledButton, getLastInstanceCalled(StyledButton) - 1);
          expect(addUserButtonProps.disabled).toBe(false);
          act(() => {
            const addUserButtonOnClick = getMockedComponentProps(StyledButton, getLastInstanceCalled(StyledButton) - 1).onClick;
            addUserButtonOnClick();
            return Promise.resolve();
          }).then(() => {
            const saveStatus = getMockedComponentProps(ModalOverlay, getLastInstanceCalled(ModalOverlay)).status;
            const nNumber = getMockedComponentProps(ModalNNumber, getLastInstanceCalled(ModalNNumber)).nNumber;
            const addUserButtonProps2 = getMockedComponentProps(StyledButton, getLastInstanceCalled(StyledButton) - 1);
            const expectedTwilioWorkerAttributesPosted = {
              did: `+1${formOptions.did}`,
              email: employeeLookupResponse[0].person.data.Email,
              email_address: employeeLookupResponse[0].person.data.Email,
              emp_first_name: employeeLookupResponse[0].person.data.FirstName,
              emp_last_name: employeeLookupResponse[0].person.data.LastName,
              extension: formOptions.extension,
              full_name: `${employeeLookupResponse[0].person.data.FirstName} ${employeeLookupResponse[0].person.data.LastName}`,
              manager_first_name: formOptions.manager.manager_first_name,
              manager_last_name: formOptions.manager.manager_last_name,
              manager_n_number: formOptions.manager.manager_n_number,
              n_number: formOptions.nNumber,
              office_location_name: employeeLookupResponse[0].person.data.OfficeName,
              office_location_number: employeeLookupResponse[0].person.data.OfficeNumber,
              primary_dept_name: employeeLookupResponse[0].person.data.DepartmentName,
              primary_dept_number: employeeLookupResponse[0].person.data.DepartmentNumber,
              profile_id: formOptions.profileId
            };
            expect(axiosMock.history.post[0].data).toEqual(JSON.stringify({ attributes: expectedTwilioWorkerAttributesPosted }));
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
