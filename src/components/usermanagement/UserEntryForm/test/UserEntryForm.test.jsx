import UserEntryForm from "../UserEntryForm";
import MockAdapter from "axios-mock-adapter";
import {
  DefaultSkillSelector,
  ModalExtension,
  ModalNNumber,
  ModalOverlay,
  ModalPhoneNumber,
  OutlinedSelect,
  // PaperContainer,
  StyledButton
} from "components";
import { initialState } from "context";
import {
  apiPaths,
  formModes,
  modalOverlayStatuses,
  timeouts
} from "globals";
import React from "react";
import {
  createUser,
  updateUser
} from "services";
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
  DefaultSkillSelector: jest.fn(),
  ModalExtension: jest.fn(),
  ModalNNumber: jest.fn(),
  ModalOverlay: jest.fn(),
  ModalPhoneNumber: jest.fn(),
  OutlinedSelect: jest.fn(),
  PaperContainer: jest.fn(),
  StyledButton: jest.fn()
}));

jest.mock("services", () => ({
  createUser: jest.fn(),
  updateUser: jest.fn()
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

const fetchedUser ={
  email: "test@abc.com",
  firstName: "Frank",
  lastName: "Rizzo",
  officeName: "Springfield 012B",
  officeNumber: "ABC123",
  departmentName: "Computers",
  departmentNumber: "4848"
};

const initialForm = {
  defaultSkills: {
    levels: {},
    skills: []
  },
  defaultSkillsUpdated: false,
  extension: "",
  extensionUpdated: false,
  extensionValid: false,
  manager: "",
  managerUpdated: false,
  nNumber: "n",
  nNumberLookupInfo: null,
  nNumberUpdated: false,
  outgoing: "",
  outgoingE164: undefined,
  outgoingUpdated: false,
  outgoingValid: false,
  profileId: "",
  profileIdUpdated: false
};

const validFormOptions = {
  defaultSkills: {
    levels: {
      "a": 1,
      "b": 3
    },
    skills: ["a", "b", "c"]
  },
  did: "6034567890",
  didE164: "+16034567890",
  extension: "1234",
  manager: managerList[0],
  nNumber: "n1234567",
  profileId: profileList[0].profile_id
};

const mockHandleClose = jest.fn();

describe("<UserEntryForm />", () => {

  beforeEach(() => {
    axiosMock.reset();
    jest.clearAllMocks();
    mockStore.reset();
    setupMockedComponents({
      DefaultSkillSelector,
      ModalExtension,
      ModalNNumber,
      ModalOverlay,
      ModalPhoneNumber,
      OutlinedSelect,
      StyledButton
    });
    // PaperContainer.mockImplementation(props => <div>{props.children}</div>);
  });

  const updateFormSoItIsValid = () => {
    // manager
    act(() => {
      const updateManager = getMockedComponentProps(OutlinedSelect, getLastInstanceCalled(OutlinedSelect) - 1).updateValue;
      updateManager(JSON.stringify(validFormOptions.manager));
    });
    // team / profile id
    act(() => {
      const updateProfile = getMockedComponentProps(OutlinedSelect, getLastInstanceCalled(OutlinedSelect)).updateValue;
      updateProfile(validFormOptions.profileId);
    });
    // outgoing number
    act(() => {
      const updatePhone = getMockedComponentProps(ModalPhoneNumber, getLastInstanceCalled(ModalPhoneNumber)).updateValue;
      updatePhone("(603)456-7890", validFormOptions.did, true, validFormOptions.didE164);
    });
    // n number
    act(() => {
      const updateNNum = getMockedComponentProps(ModalNNumber, getLastInstanceCalled(ModalNNumber)).onUpdate;
      updateNNum(validFormOptions.nNumber);
    });
    act(() => {
      const completeNNum = getMockedComponentProps(ModalNNumber, getLastInstanceCalled(ModalNNumber)).onComplete;
      completeNNum(fetchedUser, validFormOptions.nNumber);
    });
    // extension
    act(() => {
      const updateExtension = getMockedComponentProps(ModalExtension, getLastInstanceCalled(ModalExtension)).updateValue;
      updateExtension(validFormOptions.extension);
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
    // default skills
    act(() => {
      const updateDefaultSkills = getMockedComponentProps(DefaultSkillSelector, getLastInstanceCalled(DefaultSkillSelector)).setDefaultSkills;
      updateDefaultSkills(validFormOptions.defaultSkills);
    });

    // check button enabled
    const buttonProps = getMockedComponentProps(StyledButton, getLastInstanceCalled(StyledButton) - 1);
    expect(buttonProps.disabled).toBe(false);
  };

  describe("ADD / INSERT mode", () => {
    const userEntryFormState = {
      formMode: formModes.INSERT,
      worker: null,
      open: true
    };

    const renderComponent = () => {
      return render(<UserEntryForm handleClose={mockHandleClose} userEntryFormState={userEntryFormState} />, initialTestState);
    };

    describe("initial values", () => {

      test("we should render the header, the correct components, and read profiles defined in the context API.", () => {
        const rendered = renderComponent();

        expect(rendered.container).toHaveTextContent("Add a User");

        // expect rendered components
        expectMockedComponent(rendered, { OutlinedSelect }, 2);
        expectMockedComponent(rendered, { ModalExtension }, 1);
        expectMockedComponent(rendered, { ModalNNumber }, 1);
        expectMockedComponent(rendered, { ModalPhoneNumber }, 1);
        expectMockedComponent(rendered, { ModalOverlay }, 0);
        expectMockedComponent(rendered, { StyledButton }, 2);
        expectMockedComponent(rendered, { DefaultSkillSelector }, 1);

        // manager select
        const expectedManagerProps = {
          label: "Manager *",
          labelWidth: 67,
          optionsList: managerList,
          value: ""
        };
        expectOnlyPassedProps(OutlinedSelect, expectedManagerProps, 0);
        const managerOptionsDisplayFunc = OutlinedSelect.mock.calls[0][0].optionsDisplayFunc;
        const managerOption = managerOptionsDisplayFunc(managerList[0]);
        expect(managerOption).toEqual({
          display: `${managerList[0].manager_first_name} ${managerList[0].manager_last_name}`,
          key: managerList[0].manager_n_number,
          value: JSON.stringify(managerList[0])
        });

        // team / profile id select
        const expectedTeamProps = {
          label: "Team *",
          labelWidth: 44,
          optionsList: profileList,
          value: ""
        };
        expectOnlyPassedProps(OutlinedSelect, expectedTeamProps, 1);
        const teamOptionsDisplayFunc = OutlinedSelect.mock.calls[1][0].optionsDisplayFunc;
        const teamOption = teamOptionsDisplayFunc(profileList[0]);
        expect(teamOption).toEqual({
          display: profileList[0].profile_nme,
          key: profileList[0].profile_id,
          value: profileList[0].profile_id
        });

        // outgoing number
        const expectedOutgoingProps = {
          number: "",
          label: "Outgoing Number *"
        };
        expectOnlyPassedProps(ModalPhoneNumber, expectedOutgoingProps, 0);

        // n number
        const expectedNNumberProps = {
          disabled: false,
          label: "N Number *",
          value: "n"
        };
        expectOnlyPassedProps(ModalNNumber, expectedNNumberProps, 0);

        // extension
        const expectedExtensionProps = {
          disabled: false,
          extension: "",
          form: initialForm
        };
        expectOnlyPassedProps(ModalExtension, expectedExtensionProps, 0);

        // default skills
        const expectedDefaultSkillsProps = {
          defaultSkills: initialForm.defaultSkills
        };
        expectOnlyPassedProps(DefaultSkillSelector, expectedDefaultSkillsProps, 0);

        // buttons
        expectOnlyPassedProps(StyledButton, {
          children: "Add User",
          disabled: true
        }, 0);
        expectOnlyPassedProps(StyledButton, {
          children: "Close"
        }, 1);
      });
    });

    describe("update manager dropdown", () => {

      test("should set manager to JSON string", () => {
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

    describe("update team dropdown", () => {

      test("should set profile_id to correct value", () => {
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

    describe("update outgoing number field", () => {

      test("should set outgoing to correct value", () => {
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

    describe("update extension", () => {

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

    describe("fill out form so it is valid", () => {

      describe("createUser service call succeeds", () => {

        const workerAttributes = {
          default_skills: validFormOptions.defaultSkills,
          did: validFormOptions.didE164,
          email: fetchedUser.email,
          email_address: fetchedUser.email,
          emp_first_name: fetchedUser.firstName,
          emp_last_name: fetchedUser.lastName,
          extension: validFormOptions.extension,
          full_name: `${fetchedUser.firstName} ${fetchedUser.lastName}`,
          manager_first_name: validFormOptions.manager.manager_first_name,
          manager_last_name: validFormOptions.manager.manager_last_name,
          manager_n_number: validFormOptions.manager.manager_n_number,
          n_number: validFormOptions.nNumber,
          office_location_name: fetchedUser.officeName,
          office_location_number: fetchedUser.officeNumber,
          primary_dept_name: fetchedUser.departmentName,
          primary_dept_number: fetchedUser.departmentNumber,
          profile_id: validFormOptions.profileId
        };
        const rawTwilioWorker = {
          attributes: JSON.stringify(workerAttributes),
          friendlyName: validFormOptions.nNumber,
          sid: "WK123"
        };
        beforeEach(() => createUser.mockResolvedValue(rawTwilioWorker));

        test("should enable Add User button and save user when clicked", async () => {
          const rendered = renderComponent();
          updateFormSoItIsValid();
          // click button
          act(() => {
            const buttonProps = getMockedComponentProps(StyledButton, getLastInstanceCalled(StyledButton) - 1);
            buttonProps.onClick();
          });
          await waitFor(() => {
            expect(createUser).toHaveBeenCalledWith(workerAttributes);
            const actions = mockStore.getActions();
            const expectedTwilioWorkerAdded = {
              ...rawTwilioWorker,
              attributes: workerAttributes,
              id: validFormOptions.nNumber,
              skillsDifferent: true
            };
            delete expectedTwilioWorkerAdded.friendlyName;
            expect(actions).toEqual([{
              type: "addWorkers",
              payload: [expectedTwilioWorkerAdded]
            }]);
            jest.runAllTimers();
            expectOnlyPassedProps(ModalOverlay, {
              message: "Adding new user...",
              status: modalOverlayStatuses.SAVING
            }, getLastInstanceCalled(ModalOverlay) - 1);
            expectOnlyPassedProps(ModalOverlay, {
              message: "Successfully added new user",
              status: modalOverlayStatuses.SUCCESS
            }, getLastInstanceCalled(ModalOverlay));
            expectMockedComponent(rendered, { ModalOverlay }, 0);
          });
        });
      });

      describe("createUser service call cails", () => {

        const serviceError = {};
        beforeEach(() => createUser.mockRejectedValue(serviceError));
        // TODO
      });
    });
  });

  // describe("Add User and Close buttons", () => {


  //   test("the initial state add should be disabled, and close should be enabled", () => {
  //     const rendered = renderComponent();
  //     expectMockedComponent(rendered, { StyledButton }, 2);
  //     expectOnlyPassedProps(StyledButton, {
  //       children: "Add User",
  //       disabled: true
  //     }, 0);
  //     expectOnlyPassedProps(StyledButton, {
  //       children: "Close"
  //     }, 1);
  //   });

  //   test("if we click the close button, it should fire props.handleClose", () => {
  //     const rendered = renderComponent();
  //     expectMockedComponent(rendered, { StyledButton }, 2);
  //     const closeFn = getMockedComponentProps(StyledButton, 1).onClick;
  //     closeFn();
  //     expect(mockHandleClose).toHaveBeenCalledTimes(1);
  //   });

  //   describe("if the form becomes valid", () => {

  //     describe("service call to add worker succeeds", () => {

  //       const twilioWorkerResponse = {
  //         "accountSid": "AC240dd0bc4d65ef2ab1c390f0fb9146da",
  //         "activityName": "Offline",
  //         "activitySid": "WA98fb57313627153d707a17f549566046",
  //         "attributes": "{\"did\":\"+16039998888\",\"email\":\"Chris.Plankey@libertymutual.com\",\"full_name\":\"Chris Plankey\",\"manager_first_name\":\"Joanna\",\"manager_last_name\":\"Makowiecka\",\"manager_n_number\":\"n0360870\",\"n_number\":\"n0287898\",\"office_location_name\":\"Dover, NH-150 Liberty Way\",\"office_location_number\":\"016C\",\"primary_dept_name\":\"016C-12160 GRM US PL - Agent & Partners\",\"primary_dept_number\":\"12160\",\"profile_id\":\"0\"}",
  //         "available": false,
  //         "dateCreated": "2019-09-25T20:58:26.000Z",
  //         "dateStatusChanged": "2019-09-25T20:58:26.000Z",
  //         "dateUpdated": "2019-09-26T16:33:44.000Z",
  //         "friendlyName": "n0287898",
  //         "sid": "WK2a1bf01df1bb7a50aac8429e5467e0ee",
  //         "workspaceSid": "WSde21cfcdde7bcb69cd82f1c060e5dba0",
  //         "url": "https://taskrouter.twilio.com/v1/Workspaces/WSde21cfcdde7bcb69cd82f1c060e5dba0/Workers/WK2a1bf01df1bb7a50aac8429e5467e0ee"
  //       };

  //       beforeEach(() => {
  //         axiosMock.onPost(apiPaths.CREATE_WORKER).reply(200, twilioWorkerResponse);
  //       });

  //       test("when save button is clicked we should clear the user, which should disable 'Add User', and dispatch addWorkers", async () => {
  //         const rendered = renderComponent();
  //         updateformSoItIsValid();
  //         // instanceCalled - 1 because the Close button is the last instance called
  //         await act(() => {
  //           const addUserButtonOnClick = getMockedComponentProps(StyledButton, getLastInstanceCalled(StyledButton) - 1).onClick;
  //           addUserButtonOnClick();
  //         });
  //         const expectedTwilioWorkerAttributesPosted = {
  //           did: `+1${formOptions.did}`,
  //           email: employeeLookupResponse[0].person.data.Email,
  //           email_address: employeeLookupResponse[0].person.data.Email,
  //           emp_first_name: employeeLookupResponse[0].person.data.FirstName,
  //           emp_last_name: employeeLookupResponse[0].person.data.LastName,
  //           extension: formOptions.extension,
  //           full_name: `${employeeLookupResponse[0].person.data.FirstName} ${employeeLookupResponse[0].person.data.LastName}`,
  //           manager_first_name: formOptions.manager.manager_first_name,
  //           manager_last_name: formOptions.manager.manager_last_name,
  //           manager_n_number: formOptions.manager.manager_n_number,
  //           n_number: formOptions.nNumber,
  //           office_location_name: employeeLookupResponse[0].person.data.OfficeName,
  //           office_location_number: employeeLookupResponse[0].person.data.OfficeNumber,
  //           primary_dept_name: employeeLookupResponse[0].person.data.DepartmentName,
  //           primary_dept_number: employeeLookupResponse[0].person.data.DepartmentNumber,
  //           profile_id: formOptions.profileId
  //         };
  //         // await waitFor(() => {
  //         //   expect(axiosMock.history.post[0].data).toEqual(JSON.stringify({ attributes: expectedTwilioWorkerAttributesPosted }));
  //         //   expectMockedComponent(rendered, { ModalOverlay });
  //         //   const saveStatus = getMockedComponentProps(ModalOverlay, getLastInstanceCalled(ModalOverlay)).status;
  //         //   const nNumber = getMockedComponentProps(ModalNNumber, getLastInstanceCalled(ModalNNumber)).nNumber;
  //         //   const addUserButtonProps2 = getMockedComponentProps(StyledButton, getLastInstanceCalled(StyledButton) - 1);
  //         //   expect(addUserButtonProps2.disabled).toBe(true);
  //         //   expect(saveStatus).toBe(modalOverlayStatuses.SUCCESS);
  //         //   expect(nNumber).toBe("n");
  //         //   act(() => jest.runAllTimers());
  //         //   expectMockedComponent(rendered, { ModalOverlay }, 0);
  //         //   const actions = mockStore.getActions();
  //         //   expect(actions).toHaveLength(1);
  //         //   expect(actions[0]).toEqual({
  //         //     type: "addWorkers",
  //         //     payload: [mapWorkerFromTwilioWorker(twilioWorkerResponse)]
  //         //   });
  //         // });
  //       });
  //     });

  //     describe("service call to add worker fails", () => {
  //       beforeEach(() => axiosMock.onPost(apiPaths.CREATE_WORKER).networkError());

  //       test("when save button is clicked we should not clear the user, or disable 'Add User' and not dispatch an action", done => {
  //         const rendered = renderComponent();
  //         updateformSoItIsValid();
  //         const addUserButtonProps = getMockedComponentProps(StyledButton, getLastInstanceCalled(StyledButton) - 1);
  //         expect(addUserButtonProps.disabled).toBe(false);
  //         act(() => {
  //           const addUserButtonOnClick = getMockedComponentProps(StyledButton, getLastInstanceCalled(StyledButton) - 1).onClick;
  //           addUserButtonOnClick();
  //           return Promise.resolve();
  //         }).then(() => {
  //           const saveStatus = getMockedComponentProps(ModalOverlay, getLastInstanceCalled(ModalOverlay)).status;
  //           const nNumber = getMockedComponentProps(ModalNNumber, getLastInstanceCalled(ModalNNumber)).nNumber;
  //           const addUserButtonProps2 = getMockedComponentProps(StyledButton, getLastInstanceCalled(StyledButton) - 1);
  //           const expectedTwilioWorkerAttributesPosted = {
  //             did: `+1${formOptions.did}`,
  //             email: employeeLookupResponse[0].person.data.Email,
  //             email_address: employeeLookupResponse[0].person.data.Email,
  //             emp_first_name: employeeLookupResponse[0].person.data.FirstName,
  //             emp_last_name: employeeLookupResponse[0].person.data.LastName,
  //             extension: formOptions.extension,
  //             full_name: `${employeeLookupResponse[0].person.data.FirstName} ${employeeLookupResponse[0].person.data.LastName}`,
  //             manager_first_name: formOptions.manager.manager_first_name,
  //             manager_last_name: formOptions.manager.manager_last_name,
  //             manager_n_number: formOptions.manager.manager_n_number,
  //             n_number: formOptions.nNumber,
  //             office_location_name: employeeLookupResponse[0].person.data.OfficeName,
  //             office_location_number: employeeLookupResponse[0].person.data.OfficeNumber,
  //             primary_dept_name: employeeLookupResponse[0].person.data.DepartmentName,
  //             primary_dept_number: employeeLookupResponse[0].person.data.DepartmentNumber,
  //             profile_id: formOptions.profileId
  //           };
  //           expect(axiosMock.history.post[0].data).toEqual(JSON.stringify({ attributes: expectedTwilioWorkerAttributesPosted }));
  //           expect(addUserButtonProps2.disabled).toBe(false);
  //           expect(saveStatus).toBe("fail");
  //           expect(nNumber).toBe("n1234567");
  //           act(() => jest.runAllTimers());
  //           expectMockedComponent(rendered, { ModalOverlay }, 0);
  //           const actions = mockStore.getActions();
  //           expect(actions).toHaveLength(0);
  //           done();
  //         });
  //       });
  //     });
  //   });
  // });
});