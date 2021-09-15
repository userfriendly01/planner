import UserFormButtons from "../UserFormButtons";
import { Tooltip } from "@material-ui/core";
import { StyledButton } from "components";
import { formModes } from "globals";
import React from "react";
import {
  initialState,
  userFormActions,
  useAdminDispatch,
  useFormState,
  useFormDispatch
} from "context";
import {
  addOffice,
  createUser,
  updateUser
} from "services";
import {
  act,
  mockStore,
  render,
  setupMockedComponents,
  waitFor
} from "testUtils";
import {
  isFormValid,
  isFormUpdated,
  isDidDifferentValid,
  getOverflowSkillFromProfile,
  getNonOverflowSkills,
  workerHasOverFlowSkill
} from "utils";

jest.useFakeTimers();

jest.mock("components", () => ({
  __esModule: true,
  StyledButton: jest.fn()
}));

jest.mock("@material-ui/core", () => ({
  __esModule: true,
  Tooltip: jest.fn(),
  Tabs: jest.fn()
}));

jest.mock("context", () => ({
  __esModule: true,
  useAdminDispatch: jest.fn(),
  useFormState: jest.fn(),
  useFormDispatch: jest.fn(),
  userFormActions: jest.requireActual("context").userFormActions
}));

jest.mock("services", () => ({
  addOffice: jest.fn(),
  createUser: jest.fn(),
  updateUser: jest.fn()
}));

jest.mock("utils", () => ({
  isFormValid: jest.fn(),
  isFormUpdated: jest.fn(),
  isDidDifferentValid: jest.fn(),
  getOverflowSkillFromProfile: jest.fn(),
  mapWorkerFromDbWorker: jest.requireActual("utils").mapWorkerFromDbWorker,
  wait: jest.requireActual("utils").wait,
  workerHasOverFlowSkill: jest.fn(),
  getNonOverflowSkills: jest.fn()
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

const officeMap = new Map([
  [
    "ABC123",
    {

      office_nme: "Office 1",
      office_num: "ABC123"
    }
  ],
  [
    "0002",
    {

      office_nme: "Office 2",
      office_num: "0002"
    }
  ]
]);

const profileList = [
  {
    profile_nme: "test1",
    profile_id: 1,
    overflow_skill: null
  },
  {
    profile_nme: "test2",
    profile_id: 2,
    overflow_skill: "whateverOverflowSkill"
  },
  {
    profile_nme: "test3",
    profile_id: 3,
    overflow_skill: "anotherOverflowSkill"
  }
];

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

const worker = {
  attributes: {
    full_name: "Faith Cuneo",
    office_location_name: "Uranus",
    profile_id: 15
  },
  sid: "WK1",
  skillsDifferent: false
};

const initialTestState = {
  ...initialState,
  officeContext: {
    offices: officeMap
  },
  profileContext: {
    profiles: profileList
  },
  managerContext: {
    managers: managerList
  }
};

const initialFormState = {
  formMode: formModes.INSERT,
  defaultSkills: [],
  defaultSkillsUpdated: false,
  didUser: false,
  extension: {
    value: "",
    blurred: false,
    updated: false,
    valid: false
  },
  inactiveForwardTo: {
    value: null,
    updated: false
  },
  manager: {
    value: "",
    blurred: false,
    updated: false
  },
  nNumber: {
    value: "n",
    blurred: false,
    updated: false
  },
  nNumberFetchedUser: null,
  outgoing: {
    value: "",
    blurred: false,
    e164: undefined,
    updated: false,
    valid: false
  },
  profileId: {
    value: "",
    blurred: false,
    updated: false
  },
  alternateDid: {
    value: "",
    blurred: false,
    e164: undefined,
    updated: false,
    valid: false
  },
  directDialNum: {
    value: "",
    blurred: false,
    e164: undefined,
    updated: false,
    valid: false
  },
  zeroOutEnabled: false,
  zeroOutEnabledUpdated: false,
  editDisabled: false
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

const validFormState = {
  formMode: formModes.INSERT,
  defaultSkills: {
    "levels": {
      "a": 1,
      "b": 3
    },
    "skills": [
      "a",
      "b",
      "c"
    ]
  },
  defaultSkillsUpdated: true,
  didUser: false,
  extension: {
    value: validFormOptions.extension,
    blurred: false,
    updated: true,
    valid: true
  },
  inactiveForwardTo: {
    value: null,
    updated: false
  },
  manager: {
    value: "{\"manager_first_name\": \"John\",\"manager_last_name\": \"Wick\",\"manager_n_number\": \"n1234567\"}",
    blurred: false,
    updated: true
  },
  nNumber: {
    value: validFormOptions.nNumber,
    blurred: false,
    updated: true
  },
  nNumberFetchedUser: fetchedUser,
  outgoing: {
    value: "6038518200",
    blurred: false,
    e164: validFormOptions.didE164,
    updated: true,
    valid: true
  },
  profileId: {
    value: validFormOptions.profileId,
    blurred: false,
    updated: true
  },
  alternateDid: {
    value: "6032453160",
    blurred: false,
    e164: "+16032453160",
    updated: true,
    valid: true
  },
  directDialNum: {
    value: "6032453160",
    blurred: false,
    e164: "+16032453160",
    updated: true,
    valid: true
  },
  zeroOutEnabled: false,
  zeroOutEnabledUpdated: false,
  editDisabled: false
};

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
  n_number: validFormOptions.nNumber.toLowerCase(),
  office_location_name: fetchedUser.officeName,
  office_location_number: fetchedUser.officeNumber,
  primary_dept_name: fetchedUser.departmentName,
  primary_dept_number: fetchedUser.departmentNumber,
  profile_id: validFormOptions.profileId,
  unique_id: validFormOptions.nNumber.toLowerCase()
};

const mockHandleClose = jest.fn();
const mockSetForm = jest.fn();
const mockDispatch = jest.fn();
const mockUpdateLoading = jest.fn();

describe("<UserEntryForm />", () => {

  beforeEach(() => {
    addOffice.mockResolvedValue("Override me later");
    jest.clearAllMocks();
    mockStore.reset();
    getOverflowSkillFromProfile.mockReturnValue("466");
    useFormDispatch.mockReturnValue(mockSetForm);
    useAdminDispatch.mockReturnValue(mockDispatch);
    setupMockedComponents({
      StyledButton,
      Tooltip
    });
  });

  const renderComponent = (forwardToToggle, customWorker) => {
    return render(
      <UserFormButtons
        handleClose={mockHandleClose}
        loading={""}
        updateLoading={mockUpdateLoading}
        profiles={profileList}
        offices={officeMap}
        worker={customWorker ? customWorker : worker}
        forwardToToggle={forwardToToggle}
      />,
      initialTestState
    );
  };
  beforeEach(() => {
  });

  describe("Tooltip Toggle", () => {
    describe("form.didUser === true", () => {
      beforeEach(() => {
        useFormState.mockReturnValue({
          ...initialFormState,
          didUser: true
        });
        isDidDifferentValid.mockReturnValue(true);
      });
      describe("forwardToToggle === false", () => {
        test("Tooltip title should be blank", () => {
          renderComponent(false);
          expect(Tooltip.mock.calls[0][0].title).toBe("");
        });
      });
      describe("forwardToToggle === true", () => {
        const toolTipTitle = "You must edit Outgoing Number and Internal Routing before saving";
        describe("isDidDifferentValue === false", () => {
          test(`Tooltip title should equal ${toolTipTitle}`, () => {
            isDidDifferentValid.mockReturnValue(false);
            renderComponent(true);
            expect(Tooltip.mock.calls[0][0].title).toBe(toolTipTitle);
          });
        });
        describe("isDidDifferentValue === true", () => {
          test("Tooltip title should be blank", () => {
            isDidDifferentValid.mockReturnValue(true);
            renderComponent(true);
            expect(Tooltip.mock.calls[0][0].title).toBe("");
          });
        });
      });
    });
    describe("form.didUser === false", () => {
      beforeEach(() => {
        useFormState.mockReturnValue(initialFormState);
        isDidDifferentValid.mockReturnValue(true);
      });
      test("Tooltip title should be blank", () => {
        renderComponent(true);
        expect(Tooltip.mock.calls[0][0].title).toBe("");
      });
    });
  });
  describe("Add/Save User Button", () => {
    const rawDbWorker = {
      attributes: {
        ...workerAttributesAfterFormValid,
        office_location_number: "newOffice"
      },
      workerSid: "WK1234"
    };
    const formattedWorker = {
      attributes: {
        ...workerAttributesAfterFormValid,
        office_location_number: "newOffice"
      },
      sid: rawDbWorker.workerSid,
      skillsDifferent: true
    };
    describe(`form.formMode === ${formModes.INSERT}`, () => {
      beforeEach(() => {
        isDidDifferentValid.mockReturnValue(true);
        isFormValid.mockReturnValue(true);
        createUser.mockResolvedValue(rawDbWorker);
        addOffice.mockResolvedValue("yay!");
        useFormState.mockReturnValue(validFormState);
      });

      describe("Initial State", () => {
        test("UserFormButton should be called 'Add User'", () => {
          renderComponent(true);
          render(Tooltip.mock.calls[0][0].children);
          expect(StyledButton.mock.calls[1][0].children).toBe("Add User");
        });
        test("When form is valid, Add User Button is enabled", () => {
          isFormValid.mockReturnValue(true);
          renderComponent(true);
          render(Tooltip.mock.calls[0][0].children);
          expect(StyledButton.mock.calls[1][0].disabled).toBe(false);
        });
        test("When form is invalid, Add User Button is disabled", () => {
          isFormValid.mockReturnValue(false);
          renderComponent(true);
          render(Tooltip.mock.calls[0][0].children);
          expect(StyledButton.mock.calls[1][0].disabled).toBe(true);
        });
      });
      describe("createUser service call and add office service call are successful", () => {
        describe("Worker is not a DID user", () => {
          const nonDidValidFormState = {
            ...validFormState,
            directDialNum: {
              ...validFormState.directDialNum,
              value: ""
            }
          };
          beforeEach(() => {
            useFormState.mockReturnValue(nonDidValidFormState);
          });
          test("should save user with non did worker request body when clicked", async done => {
            renderComponent(true);
            render(Tooltip.mock.calls[0][0].children);
            act(() => {
              const onClick = StyledButton.mock.calls[1][0].onClick;
              onClick();
            });
            await waitFor(() => {
              expect(createUser).toHaveBeenCalledWith({
                activateEp: false, // false for non-DID workers
                attributes: workerAttributesAfterFormValid
              });
              expect(mockSetForm).toBeCalledTimes(1);
              expect(mockSetForm).toBeCalledWith({
                type: "RESET_FORM_ON_CREATE"
              });
              expect(mockDispatch).toBeCalledTimes(2);
              expect(mockDispatch.mock.calls[0][0]).toEqual({
                type: "addWorkers",
                payload: [formattedWorker]
              });
              expect(mockDispatch.mock.calls[1][0]).toEqual({
                type: "addOffice",
                payload: {
                  office_nme: "Springfield 012B",
                  office_num: "newOffice"
                }
              });
              jest.runAllTimers();
              expect(mockUpdateLoading).toBeCalledTimes(3);
              expect(mockUpdateLoading.mock.calls[0][0]).toEqual({
                overlayMessage: "Adding new user...",
                saveStatus: "saving",
                saveUser: true
              });
              expect(mockUpdateLoading.mock.calls[1][0]).toEqual({
                overlayMessage: "Successfully added new user",
                saveStatus: "success",
                saveUser: true
              });
              expect(mockUpdateLoading.mock.calls[2][0]).toEqual({
                saveUser: false
              });
              done();
            });
          });
        });
        describe("Worker is a DID user", () => {
          const existingOfficeDbWorker = {
            ...rawDbWorker,
            attributes: {
              ...rawDbWorker.attributes,
              office_location_number: "ABC123"
            }
          };
          const formattedWorker = {
            attributes: {
              ...workerAttributesAfterFormValid,
              office_location_number: "ABC123"
            },
            sid: rawDbWorker.workerSid,
            skillsDifferent: true
          };
          beforeEach(() => {
            useFormState.mockReturnValue(validFormState);
            createUser.mockResolvedValue(existingOfficeDbWorker);
          });
          test("should save user with did worker request body when clicked", async done => {
            renderComponent(true);
            render(Tooltip.mock.calls[0][0].children);
            act(() => {
              const onClick = StyledButton.mock.calls[1][0].onClick;
              onClick();
            });
            await waitFor(() => {
              expect(createUser).toHaveBeenCalledWith({
                activateEp: true, // true for DID workers
                attributes: workerAttributesAfterFormValid,
                alternateDid: validFormState.alternateDid.e164,
                directDialNum: validFormState.directDialNum.e164,
                zeroOutEnabled: validFormState.zeroOutEnabled
              });
              expect(mockSetForm).toBeCalledTimes(1);
              expect(mockSetForm).toBeCalledWith({
                type: "RESET_FORM_ON_CREATE"
              });
              expect(mockDispatch).toBeCalledTimes(1);
              expect(mockDispatch.mock.calls[0][0]).toEqual({
                type: "addWorkers",
                payload: [formattedWorker]
              });
              jest.runAllTimers();
              expect(mockUpdateLoading).toBeCalledTimes(3);
              expect(mockUpdateLoading.mock.calls[0][0]).toEqual({
                overlayMessage: "Adding new user...",
                saveStatus: "saving",
                saveUser: true
              });
              expect(mockUpdateLoading.mock.calls[1][0]).toEqual({
                overlayMessage: "Successfully added new user",
                saveStatus: "success",
                saveUser: true
              });
              expect(mockUpdateLoading.mock.calls[2][0]).toEqual({
                saveUser: false
              });
              done();
            });
          });
        });
        describe("Worker profile has overflowSkill, zeroOutEnabled and directDialNum", () => {
          beforeEach(() => {
            useFormState.mockReturnValue({
              ...validFormState,
              zeroOutEnabled: true
            });
          });
          test("should include overflow skill and save user with did worker request body when clicked", async done => {
            renderComponent(true);
            render(Tooltip.mock.calls[0][0].children);
            act(() => {
              const onClick = StyledButton.mock.calls[1][0].onClick;
              onClick();
            });
            await waitFor(() => {
              expect(createUser).toHaveBeenCalledWith({
                activateEp: true, // true for DID workers
                attributes: {
                  ...workerAttributesAfterFormValid,
                  routing: {
                    levels: {},
                    skills: [
                      "466"
                    ]
                  }
                },
                alternateDid: validFormState.alternateDid.e164,
                directDialNum: validFormState.directDialNum.e164,
                zeroOutEnabled: true
              });
              expect(mockSetForm).toBeCalledTimes(1);
              expect(mockSetForm).toBeCalledWith({
                type: "RESET_FORM_ON_CREATE"
              });
              expect(mockDispatch).toBeCalledTimes(2);
              expect(mockDispatch.mock.calls[0][0]).toEqual({
                type: "addWorkers",
                payload: [formattedWorker]
              });
              expect(mockDispatch.mock.calls[1][0]).toEqual({
                type: "addOffice",
                payload: {
                  office_nme: "Springfield 012B",
                  office_num: "newOffice"
                }
              });
              jest.runAllTimers();
              expect(mockUpdateLoading).toBeCalledTimes(3);
              expect(mockUpdateLoading.mock.calls[0][0]).toEqual({
                overlayMessage: "Adding new user...",
                saveStatus: "saving",
                saveUser: true
              });
              expect(mockUpdateLoading.mock.calls[1][0]).toEqual({
                overlayMessage: "Successfully added new user",
                saveStatus: "success",
                saveUser: true
              });
              expect(mockUpdateLoading.mock.calls[2][0]).toEqual({
                saveUser: false
              });
              done();
            });
          });
        });
      });
      describe("doCreateUser fails", () => {
        describe("addOffice fails", () => {
          const nonDidValidFormState = {
            ...validFormState,
            directDialNum: {
              ...validFormState.directDialNum,
              value: ""
            }
          };
          beforeEach(() => {
            useFormState.mockReturnValue(nonDidValidFormState);
            addOffice.mockRejectedValue({ aww: "bummer" });
          });
          test("should not dispatch AddOffice but should still enable Add User button and save user when clicked", async done => {
            renderComponent(true);
            render(Tooltip.mock.calls[0][0].children);
            act(() => {
              const onClick = StyledButton.mock.calls[1][0].onClick;
              onClick();
            });
            await waitFor(() => {
              expect(createUser).toHaveBeenCalledWith({
                activateEp: false, // false for non-DID workers
                attributes: workerAttributesAfterFormValid
              });
              expect(mockSetForm).toBeCalledTimes(1);
              expect(mockSetForm).toBeCalledWith({
                type: "RESET_FORM_ON_CREATE"
              });
              expect(mockDispatch).toBeCalledTimes(1);
              expect(mockDispatch.mock.calls[0][0]).toEqual({
                type: "addWorkers",
                payload: [formattedWorker]
              });
              jest.runAllTimers();
              expect(mockUpdateLoading).toBeCalledTimes(3);
              expect(mockUpdateLoading.mock.calls[0][0]).toEqual({
                overlayMessage: "Adding new user...",
                saveStatus: "saving",
                saveUser: true
              });
              expect(mockUpdateLoading.mock.calls[1][0]).toEqual({
                overlayMessage: "Successfully added new user",
                saveStatus: "success",
                saveUser: true
              });
              expect(mockUpdateLoading.mock.calls[2][0]).toEqual({
                saveUser: false
              });
              done();
            });
          });
        }
        );
        describe("createUser fails", () => {
          const nonDidValidFormState = {
            ...validFormState,
            directDialNum: {
              ...validFormState.directDialNum,
              value: ""
            }
          };
          beforeEach(() => {
            useFormState.mockReturnValue(nonDidValidFormState);
            createUser.mockRejectedValue({
              message: "bummer",
              response: {
                data: {
                  message: "Failed to add worker"
                }
              }
            });
          });
          test("should not add user and should update loading with failed specific error message", async done => {
            renderComponent(true);
            render(Tooltip.mock.calls[0][0].children);
            act(() => {
              const onClick = StyledButton.mock.calls[1][0].onClick;
              onClick();
            });
            await waitFor(() => {
              expect(createUser).toHaveBeenCalledWith({
                activateEp: false, // false for non-DID workers
                attributes: workerAttributesAfterFormValid
              });
              expect(mockSetForm).toBeCalledTimes(0);
              expect(mockDispatch).toBeCalledTimes(0);
              jest.runAllTimers();
              expect(mockUpdateLoading).toBeCalledTimes(2);
              expect(mockUpdateLoading.mock.calls[0][0]).toEqual({
                overlayMessage: "Adding new user...",
                saveStatus: "saving",
                saveUser: true
              });
              expect(mockUpdateLoading.mock.calls[1][0]).toEqual({
                overlayMessage: "Failed to add worker",
                saveStatus: "fail",
                saveUser: true
              });
              done();
            });
          });
          test("should not add user and should update loading with failed generic error message", async done => {
            createUser.mockRejectedValue({
              message: "bummer",
              response: {
                data: {}
              }
            });
            renderComponent(true);
            render(Tooltip.mock.calls[0][0].children);
            act(() => {
              const onClick = StyledButton.mock.calls[1][0].onClick;
              onClick();
            });
            await waitFor(() => {
              expect(createUser).toHaveBeenCalledWith({
                activateEp: false, // false for non-DID workers
                attributes: workerAttributesAfterFormValid
              });
              expect(mockSetForm).toBeCalledTimes(0);
              expect(mockDispatch).toBeCalledTimes(0);
              jest.runAllTimers();
              expect(mockUpdateLoading).toBeCalledTimes(2);
              expect(mockUpdateLoading.mock.calls[0][0]).toEqual({
                overlayMessage: "Adding new user...",
                saveStatus: "saving",
                saveUser: true
              });
              expect(mockUpdateLoading.mock.calls[1][0]).toEqual({
                overlayMessage: "Failed to add new user.",
                saveStatus: "fail",
                saveUser: true
              });
              done();
            });
          });
        }
        );
      });
    });
    describe(`form.formMode === ${formModes.UPDATE}`, () => {
      const updateFormState = {
        ...validFormState,
        formMode: formModes.UPDATE
      };
      beforeEach(() => {
        useFormState.mockReturnValue(updateFormState);
        isFormUpdated.mockReturnValue(true);
        getNonOverflowSkills.mockReturnValue(["nonSkillL1"]);
      });
      describe("Initial State", () => {
        test("UserFormButton should be called 'Save User'", () => {
          renderComponent(true);
          render(Tooltip.mock.calls[0][0].children);
          expect(StyledButton.mock.calls[1][0].children).toBe("Save User");
        });
        test("When form is valid, Add Save Button is enabled", () => {
          isFormValid.mockReturnValue(true);
          renderComponent(true);
          render(Tooltip.mock.calls[0][0].children);
          expect(StyledButton.mock.calls[1][0].disabled).toBe(false);
        });
        test("When form is invalid, Add Save Button is disabled", () => {
          isFormValid.mockReturnValue(false);
          renderComponent(true);
          render(Tooltip.mock.calls[0][0].children);
          expect(StyledButton.mock.calls[1][0].disabled).toBe(true);
        });
      });
      describe("updateUser service call and add office service call are successful", () => {
        describe("Worker is not a DID user", () => {
          const nonDidValidFormState = {
            ...updateFormState,
            directDialNum: {
              ...updateFormState.directDialNum,
              value: "",
              updated: false
            },
            zeroOutEnabled: true
          };
          beforeEach(() => {
            useFormState.mockReturnValue(nonDidValidFormState);
            updateUser.mockResolvedValue(rawDbWorker);
          });
          test("should save user with non did worker request body when clicked", async done => {
            const updateWorker = {
              ...worker,
              attributes: {
                ...worker.attributes,
                routing: {
                  skills: ["466"],
                  levels: []
                }
              }
            };
            const updateWorkerAttributesAfterFormValid = {
              default_skills: validFormOptions.defaultSkills,
              did: validFormOptions.didE164,
              extension: validFormOptions.extension,
              manager_first_name: validFormOptions.manager.manager_first_name,
              manager_last_name: validFormOptions.manager.manager_last_name,
              manager_n_number: validFormOptions.manager.manager_n_number,
              profile_id: validFormOptions.profileId,
              routing: {
                skills: ["nonSkillL1","466"],
                levels: []
              }
            };
            renderComponent(true, updateWorker);
            render(Tooltip.mock.calls[0][0].children);
            act(() => {
              const onClick = StyledButton.mock.calls[1][0].onClick;
              onClick();
            });
            await waitFor(() => {
              expect(updateUser).toHaveBeenCalledWith(worker.sid, {
                alternateDid: updateFormState.alternateDid.e164,
                attributes: updateWorkerAttributesAfterFormValid,
                zeroOutEnabled: true
              });
              expect(mockDispatch).toBeCalledTimes(1);
              expect(mockDispatch.mock.calls[0][0]).toEqual({
                type: "updateWorker",
                payload: formattedWorker
              });
              jest.runAllTimers();
              expect(mockUpdateLoading).toBeCalledTimes(2);
              expect(mockUpdateLoading.mock.calls[0][0]).toEqual({
                overlayMessage: "Updating user: Faith Cuneo",
                saveStatus: "saving",
                saveUser: true
              });
              expect(mockUpdateLoading.mock.calls[1][0]).toEqual({
                overlayMessage: "Successfully updated user: Faith Cuneo",
                saveStatus: "success",
                saveUser: true
              });
              expect(mockHandleClose).toBeCalledTimes(1);
              done();
            });
          });
        });
        describe("Worker is a DID user", () => {
          beforeEach(() => {
            useFormState.mockReturnValue(updateFormState);
            updateUser.mockResolvedValue(rawDbWorker);
            workerHasOverFlowSkill.mockReturnValue(true);
          });
          test("should save user with did worker request body when clicked", async done => {
            const updateWorker = {
              ...worker,
              attributes: {
                ...worker.attributes,
                routing: {
                  skills: ["466"],
                  levels: []
                }
              }
            };
            const updateWorkerAttributesAfterFormValid = {
              default_skills: validFormOptions.defaultSkills,
              did: validFormOptions.didE164,
              extension: validFormOptions.extension,
              manager_first_name: validFormOptions.manager.manager_first_name,
              manager_last_name: validFormOptions.manager.manager_last_name,
              manager_n_number: validFormOptions.manager.manager_n_number,
              profile_id: validFormOptions.profileId,
              routing: {
                skills: ["nonSkillL1"],
                levels: []
              }
            };
            renderComponent(true, updateWorker);
            render(Tooltip.mock.calls[0][0].children);
            act(() => {
              const onClick = StyledButton.mock.calls[1][0].onClick;
              onClick();
            });
            await waitFor(() => {
              expect(updateUser).toHaveBeenCalledWith(worker.sid, {
                activateEp: true, // true for DID workers
                attributes: updateWorkerAttributesAfterFormValid,
                alternateDid: validFormState.alternateDid.e164,
                directDialNum: validFormState.directDialNum.e164,
                zeroOutEnabled: validFormState.zeroOutEnabled
              });
              expect(mockDispatch).toBeCalledTimes(1);
              expect(mockDispatch.mock.calls[0][0]).toEqual({
                type: "updateWorker",
                payload: formattedWorker
              });
              jest.runAllTimers();
              expect(mockUpdateLoading).toBeCalledTimes(2);
              expect(mockUpdateLoading.mock.calls[0][0]).toEqual({
                overlayMessage: "Updating user: Faith Cuneo",
                saveStatus: "saving",
                saveUser: true
              });
              expect(mockUpdateLoading.mock.calls[1][0]).toEqual({
                overlayMessage: "Successfully updated user: Faith Cuneo",
                saveStatus: "success",
                saveUser: true
              });
              done();
            });
          });
        });
        describe("Fields are unchanged", () => {
          const unchangedForm = {
            ...updateFormState,
            manager: {
              ...updateFormState.manager,
              updated: false
            },
            profileId: {
              ...updateFormState.profileId,
              updated: false
            },
            outgoing: {
              ...updateFormState.outgoing,
              updated: false
            },
            extension: {
              ...updateFormState.extension,
              updated: false
            },
            alternateDid: {
              ...updateFormState.alternateDid,
              updated: false
            },
            directDialNum: {
              ...updateFormState.directDialNum,
              updated: false
            },
            inactiveForwardTo: {
              ...updateFormState.inactiveForwardTo,
              updated: false
            },
            defaultSkillsUpdated: false,
            zeroOutEnabledUpdated: false,
            zeroOutEnabled: true
          };
          beforeEach(() => {
            useFormState.mockReturnValue(unchangedForm);
            updateUser.mockResolvedValue(rawDbWorker);
            workerHasOverFlowSkill.mockReturnValue(true);
          });
          test("should save user with did worker request body when clicked", async done => {
            const updateWorker = {
              ...worker,
              attributes: {
                ...worker.attributes,
                routing: {
                  skills: ["466"],
                  levels: []
                }
              }
            };
            renderComponent(true, updateWorker);
            render(Tooltip.mock.calls[0][0].children);
            act(() => {
              const onClick = StyledButton.mock.calls[1][0].onClick;
              onClick();
            });
            await waitFor(() => {
              expect(updateUser).toHaveBeenCalledWith(worker.sid, {
                attributes: {},
                zeroOutEnabled: true
              });
              expect(mockDispatch).toBeCalledTimes(1);
              expect(mockDispatch.mock.calls[0][0]).toEqual({
                type: "updateWorker",
                payload: formattedWorker
              });
              jest.runAllTimers();
              expect(mockUpdateLoading).toBeCalledTimes(2);
              expect(mockUpdateLoading.mock.calls[0][0]).toEqual({
                overlayMessage: "Updating user: Faith Cuneo",
                saveStatus: "saving",
                saveUser: true
              });
              expect(mockUpdateLoading.mock.calls[1][0]).toEqual({
                overlayMessage: "Successfully updated user: Faith Cuneo",
                saveStatus: "success",
                saveUser: true
              });
              done();
            });
          });
        });
      });
      describe("doUpdateUser fails", () => {
        const nonDidValidFormState = {
          ...updateFormState,
          directDialNum: {
            ...updateFormState.directDialNum,
            value: "",
            updated: false
          },
          alternateDid: {
            ...updateFormState.alternateDid,
            value: "",
            updated: false
          },
          zeroOutEnabled: false,
          inactiveForwardTo: {
            value: validFormOptions.inactiveForwardTo,
            updated: true
          }
        };
        const updateWorkerAttributesAfterFormValid = {
          default_skills: validFormOptions.defaultSkills,
          did: validFormOptions.didE164,
          extension: validFormOptions.extension,
          manager_first_name: validFormOptions.manager.manager_first_name,
          manager_last_name: validFormOptions.manager.manager_last_name,
          manager_n_number: validFormOptions.manager.manager_n_number,
          profile_id: validFormOptions.profileId
        };
        beforeEach(() => {
          useFormState.mockReturnValue(nonDidValidFormState);
          workerHasOverFlowSkill.mockReturnValue(false);
          updateUser.mockRejectedValue({
            message: "bummer",
            response: {
              data: {
                message: "Failed to update worker"
              }
            }
          });
        });
        test("should not update user and should update loading with custom error message", async done => {
          renderComponent(true);
          render(Tooltip.mock.calls[0][0].children);
          act(() => {
            const onClick = StyledButton.mock.calls[1][0].onClick;
            onClick();
          });
          await waitFor(() => {
            expect(updateUser).toHaveBeenCalledWith(worker.sid, {
              zeroOutEnabled: false,
              inactiveForwardTo: validFormOptions.inactiveForwardTo,
              attributes: updateWorkerAttributesAfterFormValid
            });
            expect(mockSetForm).toBeCalledTimes(0);
            expect(mockDispatch).toBeCalledTimes(0);
            jest.runAllTimers();
            expect(mockUpdateLoading).toBeCalledTimes(2);
            expect(mockUpdateLoading.mock.calls[0][0]).toEqual({
              overlayMessage: "Updating user: Faith Cuneo",
              saveStatus: "saving",
              saveUser: true
            });
            expect(mockUpdateLoading.mock.calls[1][0]).toEqual({
              overlayMessage: "Failed to update worker",
              saveStatus: "fail",
              saveUser: true
            });
            done();
          });
        });
        test("should not update user and should update loading with generic failed status", async done => {
          updateUser.mockRejectedValue({
            message: "bummer",
            response: {
              data: {}
            }
          });
          renderComponent(true);
          render(Tooltip.mock.calls[0][0].children);
          act(() => {
            const onClick = StyledButton.mock.calls[1][0].onClick;
            onClick();
          });
          await waitFor(() => {
            expect(updateUser).toHaveBeenCalledWith(worker.sid, {
              zeroOutEnabled: false,
              inactiveForwardTo: validFormOptions.inactiveForwardTo,
              attributes: updateWorkerAttributesAfterFormValid
            });
            expect(mockSetForm).toBeCalledTimes(0);
            expect(mockDispatch).toBeCalledTimes(0);
            jest.runAllTimers();
            expect(mockUpdateLoading).toBeCalledTimes(2);
            expect(mockUpdateLoading.mock.calls[0][0]).toEqual({
              overlayMessage: "Updating user: Faith Cuneo",
              saveStatus: "saving",
              saveUser: true
            });
            expect(mockUpdateLoading.mock.calls[1][0]).toEqual({
              overlayMessage: "Failed to update user: Faith Cuneo",
              saveStatus: "fail",
              saveUser: true
            });
            done();
          });
        });
      }
      );
    });
  });
  describe("Close Button", () => {
    beforeEach(() => {
      isDidDifferentValid.mockReturnValue(true);
      isFormValid.mockReturnValue(true);
      useFormState.mockReturnValue(validFormState);
    });
    test("When the Close Button is clicked, handleClose and setForm should be called", () => {
      renderComponent(true);
      act(() => {
        const onClick = StyledButton.mock.calls[0][0].onClick;
        onClick();
      });
      expect(mockHandleClose).toBeCalledTimes(1);
      expect(mockSetForm).toBeCalledTimes(1);
      expect(mockSetForm).toBeCalledWith({ type: userFormActions.RESET_FORM_ON_CREATE });
    });
  });
});