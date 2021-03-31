import UserEntryForm from "../UserEntryForm";
import {
  DefaultSkillSelector,
  ModalExtension,
  ModalNNumber,
  ModalOverlay,
  ModalPhoneNumber,
  OutlinedSelect,
  StyledButton
} from "components";
import { initialState } from "context";
import {
  formModes,
  modalOverlayStatuses
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
  fireEvent,
  getLastInstanceCalled,
  getMockedComponentProps,
  mockStore,
  render,
  setupMockedComponents,
  waitFor
} from "testUtils";

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
    profile_id: 1,
    overflow_skill: null
  },
  {
    profile_nme: "test2",
    profile_id: 2,
    overflow_skill: "whateverOverflowSkill"
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

const fetchedUser = {
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
  alternateDid: {
    e164: "+18001234567",
    masked: "(800)123-4567",
    tenDig: "8001234567"
  },
  defaultSkills: {
    levels: {
      "a": 1,
      "b": 3
    },
    skills: ["a", "b", "c"]
  },
  did: "6034567890",
  didE164: "+16034567890",
  directDialNum: {
    e164: "+18002345678",
    masked: "(800)234-5678",
    tenDig: "8002345678"
  },
  extension: "1234",
  manager: managerList[0],
  nNumber: "n1234567",
  profileId: profileList[0].profile_id
};

const errMessageFromService = "error message from twilio-workerp-api";

const workerAttributesAfterFormValid = {
  contact_uri: `client:${validFormOptions.nNumber.toLowerCase()}`,
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
  profile_id: validFormOptions.profileId,
  unique_id: validFormOptions.nNumber.toLowerCase()
};

const mockHandleClose = jest.fn();

describe("<UserEntryForm />", () => {

  beforeEach(() => {
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
  });

  const renderComponent = userEntryFormState => {
    return render(<UserEntryForm handleClose={mockHandleClose} userEntryFormState={userEntryFormState} />, initialTestState);
  };

  const updateFormSoItIsValid = (isDidWorker, profileId) => {
    // manager
    act(() => {
      const updateManager = getMockedComponentProps(OutlinedSelect, getLastInstanceCalled(OutlinedSelect) - 1).updateValue;
      updateManager(JSON.stringify(validFormOptions.manager));
    });
    act(() => {
      getMockedComponentProps(OutlinedSelect, getLastInstanceCalled(OutlinedSelect) - 1).onBlur();
    });
    expectOnlyPassedProps(OutlinedSelect, {
      value: JSON.stringify(validFormOptions.manager)
    }, getLastInstanceCalled(OutlinedSelect) - 1);
    // team / profile id
    act(() => {
      const updateProfile = getMockedComponentProps(OutlinedSelect, getLastInstanceCalled(OutlinedSelect)).updateValue;
      updateProfile(profileId);
    });
    act(() => {
      getMockedComponentProps(OutlinedSelect, getLastInstanceCalled(OutlinedSelect)).onBlur();
    });
    expectOnlyPassedProps(OutlinedSelect, {
      value: profileId
    }, getLastInstanceCalled(OutlinedSelect));
    if (isDidWorker === true) {
      // outgoing number is first of 3 ModalPhoneNumber components
      act(() => {
        const updatePhone = getMockedComponentProps(ModalPhoneNumber, getLastInstanceCalled(ModalPhoneNumber) - 2).updateValue;
        updatePhone("(603)456-7890", validFormOptions.did, true, validFormOptions.didE164);
      });
      act(() => {
        getMockedComponentProps(ModalPhoneNumber, getLastInstanceCalled(ModalPhoneNumber) - 2).onBlur();
      });
      expectOnlyPassedProps(ModalPhoneNumber, {
        number: "(603)456-7890"
      }, getLastInstanceCalled(ModalPhoneNumber) - 2);
      // Twilio DID is 2nd of 3 ModalPhoneNumber components
      act(() => {
        const updatePhone = getMockedComponentProps(ModalPhoneNumber, getLastInstanceCalled(ModalPhoneNumber) - 1).updateValue;
        updatePhone(validFormOptions.directDialNum.masked, validFormOptions.directDialNum.tenDig, true, validFormOptions.directDialNum.e164);
      });
      act(() => {
        getMockedComponentProps(ModalPhoneNumber, getLastInstanceCalled(ModalPhoneNumber) - 1).onBlur();
      });
      expectOnlyPassedProps(ModalPhoneNumber, {
        number: validFormOptions.directDialNum.masked
      }, getLastInstanceCalled(ModalPhoneNumber) - 1);
      // Skype/Teams DID is 3rd of 3 ModalPhoneNumber components
      act(() => {
        const updatePhone = getMockedComponentProps(ModalPhoneNumber, getLastInstanceCalled(ModalPhoneNumber)).updateValue;
        updatePhone(validFormOptions.alternateDid.masked, validFormOptions.alternateDid.tenDig, true, validFormOptions.alternateDid.e164);
      });
      act(() => {
        getMockedComponentProps(ModalPhoneNumber, getLastInstanceCalled(ModalPhoneNumber)).onBlur();
      });
      expectOnlyPassedProps(ModalPhoneNumber, {
        number: validFormOptions.alternateDid.masked
      }, getLastInstanceCalled(ModalPhoneNumber));
    } else {
      // outgoing number is the only ModalPhoneNumber component
      act(() => {
        const updatePhone = getMockedComponentProps(ModalPhoneNumber, getLastInstanceCalled(ModalPhoneNumber)).updateValue;
        updatePhone("(603)456-7890", validFormOptions.did, true, validFormOptions.didE164);
      });
      act(() => {
        getMockedComponentProps(ModalPhoneNumber, getLastInstanceCalled(ModalPhoneNumber)).onBlur();
      });
      expectOnlyPassedProps(ModalPhoneNumber, {
        number: "(603)456-7890"
      }, getLastInstanceCalled(ModalPhoneNumber));
    }
    // n number
    act(() => {
      const updateNNum = getMockedComponentProps(ModalNNumber, getLastInstanceCalled(ModalNNumber)).onUpdate;
      updateNNum(validFormOptions.nNumber);
    });
    act(() => {
      const completeNNum = getMockedComponentProps(ModalNNumber, getLastInstanceCalled(ModalNNumber)).onComplete;
      completeNNum(fetchedUser, validFormOptions.nNumber);
    });
    act(() => {
      getMockedComponentProps(ModalNNumber, getLastInstanceCalled(ModalNNumber)).onBlur();
    });
    expectOnlyPassedProps(ModalNNumber, {
      fetchedUser,
      value: validFormOptions.nNumber
    }, getLastInstanceCalled(ModalNNumber));
    // extension
    act(() => {
      getMockedComponentProps(ModalExtension, getLastInstanceCalled(ModalExtension)).onBlur();
    });
    expectOnlyPassedProps(ModalExtension, {
      disabled: false,
      extension: ""
    }, getLastInstanceCalled(ModalExtension));
    act(() => {
      getMockedComponentProps(ModalExtension, getLastInstanceCalled(ModalExtension)).onUpdate(validFormOptions.extension, true);
    });
    expectOnlyPassedProps(ModalExtension, {
      disabled: true,
      extension: validFormOptions.extension
    }, getLastInstanceCalled(ModalExtension));
    // default skills
    act(() => {
      const updateDefaultSkills = getMockedComponentProps(DefaultSkillSelector, getLastInstanceCalled(DefaultSkillSelector)).setDefaultSkills;
      updateDefaultSkills(validFormOptions.defaultSkills);
    });
    expectOnlyPassedProps(DefaultSkillSelector, {
      defaultSkills: validFormOptions.defaultSkills
    }, getLastInstanceCalled(DefaultSkillSelector));

    // check button enabled
    const buttonProps = getMockedComponentProps(StyledButton, getLastInstanceCalled(StyledButton) - 1);
    expect(buttonProps.disabled).toBe(false);
  };

  describe("ADD /INSERT mode", () => {

    describe("ADD / INSERT mode non-DID user", () => {
      const userEntryFormState = {
        formMode: formModes.INSERT,
        worker: null,
        open: true
      };

      describe("initial values", () => {

        test("we should render the header, the correct components, and read profiles defined in the context API.", () => {
          const rendered = renderComponent(userEntryFormState);

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
            fetchedUser: null,
            label: "N Number *",
            value: "n"
          };
          expectOnlyPassedProps(ModalNNumber, expectedNNumberProps, 0);

          // extension
          const expectedExtensionProps = {
            disabled: false,
            extension: "",
            error: false,
            originalValue: undefined
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
          renderComponent(userEntryFormState);
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
          renderComponent(userEntryFormState);
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
          renderComponent(userEntryFormState);
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

      describe("update n number field", () => {

        test("onClear onBlur onComplete onUpdate should manipulate form properly", () => {
          const getLatestProps = () => getMockedComponentProps(ModalNNumber, getLastInstanceCalled(ModalNNumber));
          renderComponent(userEntryFormState);
          act(() => {
            getLatestProps().onBlur();
          });
          act(() => {
            getLatestProps().onUpdate("n0000000");
          });
          expect(getLatestProps().value).toEqual("n0000000");
          act(() => {
            getLatestProps().onClear();
          });
          expect(getLatestProps().value).toEqual("n");
          act(() => {
            getLatestProps().onComplete({ whatever: "wow" }, "n1111111");
          });
          expect(getLatestProps().value).toEqual("n1111111");
        });
      });

      describe("update extension and check onBlur", () => {

        test("changes made to the extension field - invalid extension", () => {
          renderComponent(userEntryFormState);
          act(() => {
            const updateValue = ModalExtension.mock.calls[0][0].onUpdate;
            updateValue("1234", false);
          });
          expect(ModalExtension.mock.calls.length).toBe(2);
          const newValue = ModalExtension.mock.calls[1][0].extension;
          expect(newValue).toEqual("1234");
        });
        test("clear extension called should reset the field", () => {
          renderComponent(userEntryFormState);
          act(() => {
            const updateValue = ModalExtension.mock.calls[0][0].onUpdate;
            updateValue("1234", true);
          });
          let newValue = ModalExtension.mock.calls[1][0].extension;
          expect(newValue).toEqual("1234");
          act(() => {
            const clearExtension = ModalExtension.mock.calls[1][0].onClear;
            clearExtension();
          });
          newValue = ModalExtension.mock.calls[2][0].extension;
          expect(newValue).toEqual("");
        });
      });

      describe("fill out form so it is valid", () => {
        describe("createUser service call succeeds", () => {
          const rawDbWorker = {
            attributes: workerAttributesAfterFormValid,
            workerSid: "WK1234"
          };
          const formattedWorker = {
            attributes: workerAttributesAfterFormValid,
            sid: rawDbWorker.workerSid,
            skillsDifferent: true
          };

          beforeEach(() => createUser.mockResolvedValue(rawDbWorker));

          test("should enable Add User button and save user when clicked", async () => {
            const rendered = renderComponent(userEntryFormState);
            updateFormSoItIsValid(false, profileList[0].profile_id);
            // click button
            act(() => {
              const buttonProps = getMockedComponentProps(StyledButton, getLastInstanceCalled(StyledButton) - 1);
              buttonProps.onClick();
            });
            await waitFor(() => {
              expect(createUser).toHaveBeenCalledWith({
                activateEp: false, // false for non-DID workers
                attributes: workerAttributesAfterFormValid,
                zeroOutEnabled: false // profileId used in this test has overflow_skill = 'null'
              });
              const actions = mockStore.getActions();
              expect(actions).toEqual([{
                type: "addWorkers",
                payload: [formattedWorker]
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

        describe("createUser service call fails", () => {

          describe("response includes error message from service", () => {
            beforeEach(() => createUser.mockRejectedValue({
              message: "something went wrong",
              response: {
                data: {
                  message: errMessageFromService
                }
              }
            }));
            test("should display message passed from service in failure modal", async () => {
              const rendered = renderComponent(userEntryFormState);
              updateFormSoItIsValid(false, profileList[0].profile_id);
              // click button
              act(() => {
                const buttonProps = getMockedComponentProps(StyledButton, getLastInstanceCalled(StyledButton) - 1);
                buttonProps.onClick();
              });
              await waitFor(() => {
                expect(createUser).toHaveBeenCalledWith({
                  activateEp: false, // false for non-DID workers
                  attributes: workerAttributesAfterFormValid,
                  zeroOutEnabled: false // profileId used in this test has overflow_skill = 'null'
                });
                const actions = mockStore.getActions();
                expect(actions).toHaveLength(0);
                jest.runAllTimers();
                expectOnlyPassedProps(ModalOverlay, {
                  message: "Adding new user...",
                  status: modalOverlayStatuses.SAVING
                }, getLastInstanceCalled(ModalOverlay) - 1);
                expectOnlyPassedProps(ModalOverlay, {
                  message: errMessageFromService,
                  status: modalOverlayStatuses.FAIL
                }, getLastInstanceCalled(ModalOverlay));
                expectMockedComponent(rendered, { ModalOverlay }, 1);
                // close the error modal
                act(() => {
                  const modalProps = getMockedComponentProps(ModalOverlay, getLastInstanceCalled(ModalOverlay));
                  modalProps.handleClose();
                });
              });
            });
          });

          describe("response does not include error message from service", () => {
            beforeEach(() => createUser.mockRejectedValue({
              message: "something went wrong",
              response: {
                data: {
                  whaever: "no message from service"
                }
              }
            }));
            test("should display 'Failed to add new user.' in failure modal", async () => {
              const rendered = renderComponent(userEntryFormState);
              updateFormSoItIsValid(false, profileList[0].profile_id);
              // click button
              act(() => {
                const buttonProps = getMockedComponentProps(StyledButton, getLastInstanceCalled(StyledButton) - 1);
                buttonProps.onClick();
              });
              await waitFor(() => {
                expect(createUser).toHaveBeenCalledWith({
                  activateEp: false, // false for non-DID workers
                  attributes: workerAttributesAfterFormValid,
                  zeroOutEnabled: false // profileId used in this test has overflow_skill = 'null'
                });
                const actions = mockStore.getActions();
                expect(actions).toHaveLength(0);
                jest.runAllTimers();
                expectOnlyPassedProps(ModalOverlay, {
                  message: "Adding new user...",
                  status: modalOverlayStatuses.SAVING
                }, getLastInstanceCalled(ModalOverlay) - 1);
                expectOnlyPassedProps(ModalOverlay, {
                  message: "Failed to add new user.",
                  status: modalOverlayStatuses.FAIL
                }, getLastInstanceCalled(ModalOverlay));
                expectMockedComponent(rendered, { ModalOverlay }, 1);
              });
            });
          });
        });
      });
    });

    describe("ADD / INSERT mode with DID User", () => {
      const userEntryFormState = {
        formMode: formModes.INSERT,
        worker: null,
        open: true
      };

      describe("initial values", () => {

        test("we should render the header, the correct components, and read profiles defined in the context API.", () => {
          const rendered = renderComponent(userEntryFormState);

          expect(rendered.container).toHaveTextContent("Add a User");
          fireEvent.click(rendered.getByLabelText("toggle-did-user"));
          // expect rendered components
          expectMockedComponent(rendered, { OutlinedSelect }, 2);
          expectMockedComponent(rendered, { ModalExtension }, 1);
          expectMockedComponent(rendered, { ModalNNumber }, 1);
          expectMockedComponent(rendered, { ModalPhoneNumber }, 3);
          expectMockedComponent(rendered, { ModalOverlay }, 0);
          expectMockedComponent(rendered, { StyledButton }, 2);
          expectMockedComponent(rendered, { DefaultSkillSelector }, 1);

          // Twilio DID
          const expectedDirectDialNumProps = {
            number: "",
            label: "Twilio DID *"
          };
          expectOnlyPassedProps(ModalPhoneNumber, expectedDirectDialNumProps, 2);
          // Skype/Teams DID
          const expectedalternateDidProps = {
            number: "",
            label: "Skype/Teams DID *"
          };
          expectOnlyPassedProps(ModalPhoneNumber, expectedalternateDidProps, 3);
        });
      });

      describe("update Twilio DID field", () => {
        test("should set Twilio DID to correct value", () => {
          const rendered = renderComponent(userEntryFormState);
          fireEvent.click(rendered.getByLabelText("toggle-did-user"));
          // Next I'll call the update function, which should update the form and cause a re-render.
          act(() => {
            const updateValue = ModalPhoneNumber.mock.calls[2][0].updateValue;
            updateValue("12345678");
          });
          /* First render: 1 ModalPhoneNumber -> Outgoing number
             Second render: 3 ModalPhoneNumbers -> Outgoing number, Twilio DID, Skype/Teams DID
             Third render (after fields are updated): same 3 ModalPhoneNumbers -> Outgoing number, Twilio DID, Skype/Teams DID */
          expect(ModalPhoneNumber.mock.calls.length).toBe(7);
          const newValue = ModalPhoneNumber.mock.calls[5][0].number;
          expect(newValue).toEqual("12345678");
        });
      });

      describe("update Skype/Teams DID field", () => {
        test("should set Skype/Teams DID to correct value", () => {
          const rendered = renderComponent(userEntryFormState);
          fireEvent.click(rendered.getByLabelText("toggle-did-user"));
          // Next I'll call the update function, which should update the form and cause a re-render.
          act(() => {
            const updateValue = ModalPhoneNumber.mock.calls[3][0].updateValue;
            updateValue("12345678");
          });
          expect(ModalPhoneNumber.mock.calls.length).toBe(7);
          const newValue = ModalPhoneNumber.mock.calls[6][0].number;
          expect(newValue).toEqual("12345678");
        });
      });

      describe("fill out form so it is valid", () => {
        describe("profile ID has 'null' for overflow_skill", () => {
          const workerWithoutSidZeroOutFalse = {
            attributes: workerAttributesAfterFormValid,
            alternateDid: validFormOptions.alternateDid.e164,
            directDialNum: validFormOptions.directDialNum.e164,
            zeroOutEnabled: false
          };
          const rawDbWorker = {
            ...workerWithoutSidZeroOutFalse,
            workerSid: "WK1234"
          };
          const formattedWorker = {
            attributes: rawDbWorker.attributes,
            alternateDid: rawDbWorker.alternateDid,
            directDialNum: rawDbWorker.directDialNum,
            zeroOutEnabled: rawDbWorker.zeroOutEnabled,
            sid: rawDbWorker.workerSid,
            skillsDifferent: true
          };
          beforeEach(() => createUser.mockResolvedValue(rawDbWorker));
          test("request body should include zeroOutEnabled = false and should not include overflow_skill", async () => {
            const rendered = renderComponent(userEntryFormState);
            fireEvent.click(rendered.getByLabelText("toggle-did-user"));
            updateFormSoItIsValid(true, profileList[0].profile_id);
            // click save button
            act(() => {
              const buttonProps = getMockedComponentProps(StyledButton, getLastInstanceCalled(StyledButton) - 1);
              buttonProps.onClick();
            });
            await waitFor(() => {
              expect(createUser).toHaveBeenCalledWith({
                ...workerWithoutSidZeroOutFalse,
                attributes: workerAttributesAfterFormValid,
                activateEp: true // true for DID workers
              });
              const actions = mockStore.getActions();
              expect(actions).toEqual([{
                type: "addWorkers",
                payload: [formattedWorker]
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

        describe("profile ID has an overflow_skill value & zeroOutEnabled is true", () => {
          const workerAttributesAfterFormValidWithOverflowSkill = {
            ...workerAttributesAfterFormValid,
            profile_id: profileList[1].profile_id, // overflow_skill exists
            routing: {
              skills: [profileList[1].overflow_skill],
              levels: {}
            }
          };
          const workerWithoutSidZeroOutFalse = {
            attributes: workerAttributesAfterFormValidWithOverflowSkill,
            alternateDid: validFormOptions.alternateDid.e164,
            directDialNum: validFormOptions.directDialNum.e164,
            zeroOutEnabled: true
          };
          const rawDbWorker = {
            ...workerWithoutSidZeroOutFalse,
            workerSid: "WK1235"
          };
          const formattedWorker = {
            attributes: rawDbWorker.attributes,
            alternateDid: rawDbWorker.alternateDid,
            directDialNum: rawDbWorker.directDialNum,
            zeroOutEnabled: rawDbWorker.zeroOutEnabled,
            sid: rawDbWorker.workerSid,
            skillsDifferent: true
          };
          beforeEach(() => createUser.mockResolvedValue(rawDbWorker));
          test("request body should include overflow skill and zeroOutEnabled = true", async () => {
            const rendered = renderComponent(userEntryFormState);
            fireEvent.click(rendered.getByLabelText("toggle-did-user"));
            updateFormSoItIsValid(true, profileList[1].profile_id);
            // click button
            act(() => {
              const buttonProps = getMockedComponentProps(StyledButton, getLastInstanceCalled(StyledButton) - 1);
              buttonProps.onClick();
            });
            await waitFor(() => {
              expect(createUser).toHaveBeenCalledWith({
                ...workerWithoutSidZeroOutFalse,
                attributes: workerAttributesAfterFormValidWithOverflowSkill,
                activateEp: true // true for DID workers
              });
              const actions = mockStore.getActions();
              expect(actions).toEqual([{
                type: "addWorkers",
                payload: [formattedWorker]
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

        describe("profile ID has an overflow_skill value & zeroOutEnabled is set to false", () => {
          const workerAttributesAfterFormValidWithOverflowSkill = {
            ...workerAttributesAfterFormValid,
            profile_id: profileList[1].profile_id // overflow_skill exists
          };
          const workerWithoutSidZeroOutFalse = {
            attributes: workerAttributesAfterFormValidWithOverflowSkill,
            alternateDid: validFormOptions.alternateDid.e164,
            directDialNum: validFormOptions.directDialNum.e164,
            zeroOutEnabled: false
          };
          const rawDbWorker = {
            ...workerWithoutSidZeroOutFalse,
            workerSid: "WK1235"
          };
          const formattedWorker = {
            attributes: rawDbWorker.attributes,
            alternateDid: rawDbWorker.alternateDid,
            directDialNum: rawDbWorker.directDialNum,
            zeroOutEnabled: rawDbWorker.zeroOutEnabled,
            sid: rawDbWorker.workerSid,
            skillsDifferent: true
          };
          beforeEach(() => createUser.mockResolvedValue(rawDbWorker));
          test("request body should include zeroOutEnabled = false and should not include overflow skill", async () => {
            const rendered = renderComponent(userEntryFormState);
            fireEvent.click(rendered.getByLabelText("toggle-did-user"));
            updateFormSoItIsValid(true, profileList[1].profile_id); // select team with overflow_skill
            fireEvent.click(rendered.getByLabelText("toggle-zero-out")); // set zeroOutEnabled to false
            // click button
            act(() => {
              const buttonProps = getMockedComponentProps(StyledButton, getLastInstanceCalled(StyledButton) - 1);
              buttonProps.onClick();
            });
            await waitFor(() => {
              expect(createUser).toHaveBeenCalledWith({
                ...workerWithoutSidZeroOutFalse,
                attributes: workerAttributesAfterFormValidWithOverflowSkill,
                activateEp: true // true for DID workers
              });
              const actions = mockStore.getActions();
              expect(actions).toEqual([{
                type: "addWorkers",
                payload: [formattedWorker]
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
      });
    });
  });

  describe("EDIT / UPDATE mode", () => {
    const initialWorkerManager = managerList[1];
    const nonE164Did = "8008884444";
    const initialWorker = {
      attributes: {
        default_skills: {
          levels: {
            "e": 11,
            "f": 3
          },
          skills: ["e", "f", "g"]
        },
        did: "+18008884444",
        extension: "7777",
        emp_first_name: "Frank",
        emp_last_name: "Rizzo",
        full_name: "Frank Rizzo",
        manager_first_name: initialWorkerManager.manager_first_name,
        manager_last_name: initialWorkerManager.manager_last_name,
        manager_n_number: initialWorkerManager.manager_n_number,
        n_number: validFormOptions.nNumber,
        profile_id: profileList[1].profile_id
      },
      sid: "WK111111"
    };
    const userEntryFormState = {
      formMode: formModes.UPDATE,
      worker: initialWorker,
      open: true
    };

    describe("initial values", () => {

      test("we should render the header, the correct components, and read profiles defined in the context API.", () => {
        const rendered = renderComponent(userEntryFormState);

        expect(rendered.container).toHaveTextContent(initialWorker.attributes.full_name);

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
          value: JSON.stringify(initialWorkerManager)
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
          value: `${initialWorker.attributes.profile_id}`
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
          label: "Outgoing Number *",
          number: nonE164Did
        };
        expectOnlyPassedProps(ModalPhoneNumber, expectedOutgoingProps, 0);

        // n number
        const expectedNNumberProps = {
          disabled: true,
          label: "N Number *",
          value: initialWorker.attributes.n_number
        };
        expectOnlyPassedProps(ModalNNumber, expectedNNumberProps, 0);

        // extension
        const expectedExtensionProps = {
          disabled: true,
          error: false,
          extension: initialWorker.attributes.extension,
          originalValue: initialWorker.attributes.extension
        };
        expectOnlyPassedProps(ModalExtension, expectedExtensionProps, 0);

        // default skills
        const expectedDefaultSkillsProps = {
          defaultSkills: initialWorker.attributes.default_skills
        };
        expectOnlyPassedProps(DefaultSkillSelector, expectedDefaultSkillsProps, 0);

        // buttons
        expectOnlyPassedProps(StyledButton, {
          children: "Save User",
          disabled: true
        }, 0);
        expectOnlyPassedProps(StyledButton, {
          children: "Close"
        }, 1);
      });
    });

    describe("fill out form so it is valid", () => {

      const workerAttributes = {
        default_skills: validFormOptions.defaultSkills,
        did: validFormOptions.didE164,
        extension: validFormOptions.extension,
        manager_first_name: validFormOptions.manager.manager_first_name,
        manager_last_name: validFormOptions.manager.manager_last_name,
        manager_n_number: validFormOptions.manager.manager_n_number,
        profile_id: validFormOptions.profileId
      };

      describe("updateUser service call succeeds", () => {

        const rawTwilioWorker = {
          attributes: JSON.stringify(workerAttributes),
          friendlyName: validFormOptions.nNumber,
          sid: "WK123"
        };
        beforeEach(() => updateUser.mockResolvedValue(rawTwilioWorker));

        test("should enable Save User button and save user when clicked", async () => {
          renderComponent(userEntryFormState);
          updateFormSoItIsValid(false, profileList[0].profile_id);
          // click button
          act(() => {
            const buttonProps = getMockedComponentProps(StyledButton, getLastInstanceCalled(StyledButton) - 1);
            buttonProps.onClick();
          });
          await waitFor(() => {
            expect(updateUser).toHaveBeenCalledWith(initialWorker.sid, workerAttributes);
            const actions = mockStore.getActions();
            const expectedTwilioWorkerUpdated = {
              ...rawTwilioWorker,
              attributes: workerAttributes,
              skillsDifferent: true
            };
            delete expectedTwilioWorkerUpdated.friendlyName;
            expect(actions).toEqual([{
              type: "updateWorker",
              payload: expectedTwilioWorkerUpdated
            }]);
            jest.runAllTimers();
            expectOnlyPassedProps(ModalOverlay, {
              message: "Updating user: " + initialWorker.attributes.full_name,
              status: modalOverlayStatuses.SAVING
            }, getLastInstanceCalled(ModalOverlay) - 1);
            expectOnlyPassedProps(ModalOverlay, {
              message: "Successfully updated user: " + initialWorker.attributes.full_name,
              status: modalOverlayStatuses.SUCCESS
            }, getLastInstanceCalled(ModalOverlay));
            expect(mockHandleClose).toHaveBeenCalledTimes(1);
          });
        });
      });

      describe("updateUser service call fails", () => {

        const serviceError = {};
        beforeEach(() => updateUser.mockRejectedValue(serviceError));

        test("should enable Add User button and save user when clicked", async () => {
          const rendered = renderComponent(userEntryFormState);
          updateFormSoItIsValid(false, profileList[0].profile_id);
          // click button
          act(() => {
            const buttonProps = getMockedComponentProps(StyledButton, getLastInstanceCalled(StyledButton) - 1);
            buttonProps.onClick();
          });
          await waitFor(() => {
            expect(updateUser).toHaveBeenCalledWith(initialWorker.sid, workerAttributes);
            const actions = mockStore.getActions();
            expect(actions).toHaveLength(0);
            jest.runAllTimers();
            expectOnlyPassedProps(ModalOverlay, {
              message: "Updating user: " + initialWorker.attributes.full_name,
              status: modalOverlayStatuses.SAVING
            }, getLastInstanceCalled(ModalOverlay) - 1);
            expectOnlyPassedProps(ModalOverlay, {
              message: "Failed to update user: " + initialWorker.attributes.full_name,
              status: modalOverlayStatuses.FAIL
            }, getLastInstanceCalled(ModalOverlay));
            expectMockedComponent(rendered, { ModalOverlay }, 0);
          });
        });
      });
    });
  });
});