import UserFormButtons from "../UserFormButtons";
import {
  Modal,
  Tooltip
} from "@mui/material";
import {
  MergeUsersModal,
  StyledButton
} from "components";
import {
  useAdminState,
  useAdminDispatch,
  useFormState,
  useFormDispatch,
  userFormActions
} from "context";
import {
  formModes,
  env
} from "globals";
import React from "react";
import {
  addOffice,
  createCalabrioUser,
  createUser,
  getCalabrioUsers,
  updateCalabrioUser,
  updateUser,
  createCalabrioWFMPerson,
  wfmActivateExternalLogon
} from "services";
import {
  act,
  fetchedUser,
  initialFormState,
  initialTestState,
  officeMap,
  profileList,
  render,
  setupMockedComponents,
  validFormOptions,
  validFormState,
  waitFor
} from "testUtils";
import {
  addWorkerToOrg,
  checkConflictingUsers,
  getOverflowSkillFromProfile,
  getNonOverflowSkills,
  identifyFormErrors,
  isDidDifferentValid,
  isFormUpdated,
  isTritonUserValid,
  mapWorkerFromDbWorker,
  workerHasOverFlowSkill
} from "utils";

jest.mock("components", () => ({
  StyledButton: jest.fn(),
  MergeUsersModal: jest.fn()
}));

jest.mock("@mui/material", () => ({
  Tooltip: jest.fn(),
  Tabs: jest.fn(),
  Modal: jest.fn(),
  Divider: jest.fn()
}));

jest.mock("context", () => ({
  useAdminState: jest.fn(),
  useAdminDispatch: jest.fn(),
  useFormState: jest.fn(),
  useFormDispatch: jest.fn(),
  userFormActions: jest.requireActual("context").userFormActions
}));

jest.mock("utils", () => ({
  addWorkerToOrg: jest.fn(),
  calabrioTimeZones: jest.requireActual("utils").calabrioTimeZones,
  checkConflictingUsers: jest.fn(),
  identifyFormErrors: jest.fn(),
  isTritonUserValid: jest.fn(),
  isFormUpdated: jest.fn(),
  isDidDifferentValid: jest.fn(),
  getOverflowSkillFromProfile: jest.fn(),
  mapWorkerFromDbWorker: jest.fn(),
  wait: jest.requireActual("utils").wait,
  workerHasOverFlowSkill: jest.fn(),
  getNonOverflowSkills: jest.fn(),
  getValidSkillsObject: jest.fn(),
  formatE164PhoneNumber: jest.fn(),
  getZeroOutEnabledFromProfile: jest.fn(),
  logger: jest.requireActual("utils").logger
}));

export const worker = {
  attributes: {
    full_name: "Faith Cuneo",
    office_location_name: "Uranus",
    profile_id: 15,
    triton: {
      routing: {
        team: "Sample1",
        skills: ["466"],
        levels: { "466": 3 },
        callerStates: ["Test1", "Test2"],
        updated: true
      }
    }
  },
  sid: "WK1",
  skillsDifferent: false
};

const workerAttributesAfterFormValid = {
  contact_uri: `client:${validFormOptions.nNumber.toLowerCase()}`,
  default_skills: validFormOptions.defaultSkills,
  did: validFormOptions.didE164,
  department_id: fetchedUser.departmentNumber,
  department_name: fetchedUser.departmentName,
  email: fetchedUser.email,
  email_address: fetchedUser.email,
  emp_first_name: fetchedUser.firstName,
  emp_last_name: fetchedUser.lastName,
  extension: validFormOptions.extension,
  full_name: `${fetchedUser.firstName} ${fetchedUser.lastName}`,
  location: fetchedUser.officeName,
  manager_first_name: validFormOptions.manager.manager_first_name,
  manager_last_name: validFormOptions.manager.manager_last_name,
  manager_n_number: validFormOptions.manager.manager_n_number,
  manager: `${validFormOptions.manager.manager_first_name} ${validFormOptions.manager.manager_last_name}`,
  n_number: validFormOptions.nNumber.toLowerCase(),
  office_location_name: fetchedUser.officeName,
  office_location_number: fetchedUser.officeNumber,
  primary_dept_name: fetchedUser.departmentName,
  primary_dept_number: fetchedUser.departmentNumber,
  profile_id: validFormOptions.profileId,
  unique_id: validFormOptions.nNumber.toLowerCase(),
  routing: {
    ...validFormOptions.routing,
    updated: true
  }
};

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

export const validOperatingUnitId = "operatingUnitSid1";

const mockHandleClose = jest.fn();
const mockSetForm = jest.fn();
const mockDispatch = jest.fn();
const mockUpdateLoading = jest.fn();
const mockSetMissingFields = jest.fn();

describe("<UserFormButtons />", () => {
  beforeEach(() => {
    addOffice.mockResolvedValue("Override me later");
    jest.clearAllMocks();
    jest.useFakeTimers();
    useFormDispatch.mockReturnValue(mockSetForm);
    getOverflowSkillFromProfile.mockReturnValue("466");
    useAdminDispatch.mockReturnValue(mockDispatch);
    useAdminState.mockReturnValue({
      userContext: {
        nNumber: "n1234567"
      },
      calabrioContext: {
        users: [],
        wfmOrg: []
      }
    });
    mapWorkerFromDbWorker.mockReturnValue(formattedWorker);
    checkConflictingUsers.mockResolvedValue({ yay: "woot!" });
    createCalabrioUser.mockResolvedValue({ yay: "woot!" });
    getCalabrioUsers.mockResolvedValue({ data: "yay!" });
    addWorkerToOrg.mockReturnValue(["newstateyay!"]);
    identifyFormErrors.mockReturnValue([]);
    setupMockedComponents({
      StyledButton,
      Tooltip,
      MergeUsersModal,
      Modal
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
        setMissingFields={mockSetMissingFields}
      />,
      initialTestState
    );
  };

  describe("Tooltip Toggle", () => {
    describe("form.didUser === true", () => {
      const form = {
        ...initialFormState,
        triton: {
          ...initialFormState.triton,
          didUser: true
        }
      };
      beforeEach(() => {
        useFormState.mockReturnValue(form);
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
        isDidDifferentValid.mockReturnValue(true);
        useFormState.mockReturnValue(initialFormState);
      });
      test("Tooltip title should be blank", () => {
        renderComponent(true);
        expect(Tooltip.mock.calls[0][0].title).toBe("");
      });
    });
  });
  describe("Add/Save User Button", () => {
    const resetFormAfterAddExpectedAction = {
      type: "RESET_FORM_AFTER_ADD",
      payload: {
        managerValue: validFormState.triton.manager.value,
        outgoing: {
          value: validFormState.triton.outgoing.value,
          e164: validFormState.triton.outgoing.e164
        },
        profileIdValue: validFormState.triton.profileId.value,
        didUser: false
      }
    };
    describe(`form.formMode === ${formModes.INSERT}`, () => {
      beforeEach(() => {
        isDidDifferentValid.mockReturnValue(true);
        isTritonUserValid.mockReturnValue(true);
        createUser.mockResolvedValue(rawDbWorker);
        addOffice.mockResolvedValue("yay!");
        useFormState.mockReturnValue(validFormState);
        checkConflictingUsers.mockResolvedValue("Yay!");
        updateCalabrioUser.mockResolvedValue("yay!");
        getCalabrioUsers.mockResolvedValue({ data: ["agent1", "agent2"]});
        createCalabrioWFMPerson.mockResolvedValue({ data: "9dase-Owaaskm" });
        wfmActivateExternalLogon.mockResolvedValue();
      });
      describe("Initial State", () => {
        test("UserFormButton should be called 'Add User'", () => {
          renderComponent(true);
          render(Tooltip.mock.calls[0][0].children);
          expect(StyledButton.mock.calls[2][0].children).toBe("Add User");
        });
        test("When form is valid, Add User Button is enabled", () => {
          isTritonUserValid.mockReturnValue(true);
          renderComponent(true);
          render(Tooltip.mock.calls[0][0].children);
          expect(StyledButton.mock.calls[2][0].disabled).toBe(false);
        });
        describe("disabled", () => {
          test("form === insert, Add User Button is disabled", () => {
            isTritonUserValid.mockReturnValue(false);
            renderComponent(true);
            render(Tooltip.mock.calls[0][0].children);
            expect(StyledButton.mock.calls[2][0].disabled).toBe(true);
          });
          test("form === update, Add User Button is disabled", () => {
            isTritonUserValid.mockReturnValue(false);
            isFormUpdated.mockReturnValue(true);
            useFormState.mockReturnValue({
              ...validFormState,
              formMode: formModes.UPDATE
            });
            renderComponent(true);
            render(Tooltip.mock.calls[0][0].children);
            expect(StyledButton.mock.calls[1][0].disabled).toBe(true);
          });
          test("form === update, discrepancies.length > 0 - Add User Button is disabled", () => {
            isTritonUserValid.mockReturnValue(false);
            isFormUpdated.mockReturnValue(false);
            useFormState.mockReturnValue({
              ...validFormState,
              formMode: formModes.UPDATE,
              discrepancies: ["Oh no!"]
            });
            renderComponent(true);
            render(Tooltip.mock.calls[0][0].children);
            expect(StyledButton.mock.calls[1][0].disabled).toBe(true);
          });
        });

      });
      describe("createUser service call, add office service call, and createCalabruioUser service call are successful", () => {
        describe("Worker is not a DID user", () => {
          const createWorkerAttributesAfterFormValid = workerAttributesAfterFormValid;
          const nonDidValidFormState = {
            ...validFormState,
            triton: {
              ...validFormState.triton,
              directDialNum: {
                ...validFormState.triton.directDialNum,
                value: ""
              }
            }
          };
          beforeEach(() => {
            useFormState.mockReturnValue(nonDidValidFormState);
          });
          test("should save user with non did worker request body when clicked", async () => {
            renderComponent(true);
            render(Tooltip.mock.calls[0][0].children);
            act(() => {
              const onClick = StyledButton.mock.calls[2][0].onClick;
              onClick();
            });
            await waitFor(() => {
              expect(createUser).toHaveBeenCalledWith({
                activateEp: false, // false for non-DID workers
                attributes: createWorkerAttributesAfterFormValid,
                operatingUnitSid: validOperatingUnitId
              });
              expect(mockSetForm).toHaveBeenCalledTimes(2);
              expect(mockSetForm).toHaveBeenCalledWith(resetFormAfterAddExpectedAction);
              expect(mockSetForm).toHaveBeenCalledWith( { type: userFormActions.SET_USER_PREVIOUSLY_ADDED_TRUE });
              expect(checkConflictingUsers).toHaveBeenCalledTimes(1);
              expect(createCalabrioUser).toHaveBeenCalledTimes(1);
              expect(getCalabrioUsers).toHaveBeenCalledTimes(1);
              expect(mockDispatch).toHaveBeenCalledTimes(3);
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
              expect(mockDispatch.mock.calls[2][0]).toEqual({
                type: "loadCalabrioUsers",
                payload: ["agent1", "agent2"]
              });
              jest.runAllTimers();
              expect(mockUpdateLoading).toHaveBeenCalledTimes(3);
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
            });
          });
        });
        describe("Worker is a DID user", () => {
          const createWorkerAttributesAfterFormValid = workerAttributesAfterFormValid;
          const existingOfficeDbWorker = {
            ...rawDbWorker,
            attributes: {
              ...rawDbWorker.attributes,
              office_location_number: "ABC123"
            }
          };
          const form = {
            ...validFormState,
            triton: {
              ...validFormState.triton,
              didUser: true
            }
          };
          beforeEach(() => {
            createUser.mockResolvedValue(existingOfficeDbWorker);
            useFormState.mockReturnValue(form);
          });
          test("should save user with did worker request body when clicked", async () => {
            renderComponent(true);
            render(Tooltip.mock.calls[0][0].children);
            act(() => {
              const onClick = StyledButton.mock.calls[2][0].onClick;
              onClick();
            });
            await waitFor(() => {
              expect(createUser).toHaveBeenCalledWith({
                activateEp: true, // true for DID workers
                attributes: createWorkerAttributesAfterFormValid,
                alternateDid: validFormState.triton.alternateDid.e164,
                directDialNum: validFormState.triton.directDialNum.e164,
                zeroOutEnabled: validFormState.triton.zeroOutEnabled.value,
                selfServiceInd: validFormState.triton.selfServiceInd.value,
                operatingUnitSid: validOperatingUnitId
              });
              expect(mockSetForm).toHaveBeenCalledTimes(2);
              expect(mockSetForm).toHaveBeenCalledWith({
                ...resetFormAfterAddExpectedAction,
                payload: {
                  ...resetFormAfterAddExpectedAction.payload,
                  didUser: true
                }
              });
              expect(mockSetForm).toHaveBeenCalledWith( { type: userFormActions.SET_USER_PREVIOUSLY_ADDED_TRUE });
              expect(mockDispatch).toHaveBeenCalledTimes(2);
              expect(mockDispatch.mock.calls[0][0]).toEqual({
                type: "addWorkers",
                payload: [formattedWorker]
              });
              expect(mockDispatch.mock.calls[1][0]).toEqual({
                type: "loadCalabrioUsers",
                payload: ["agent1", "agent2"]
              });
              jest.runAllTimers();
              expect(mockUpdateLoading).toHaveBeenCalledTimes(3);
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
            });
          });
        });
        describe("Worker profile has overflowSkill, zeroOutEnabled, selfServiceInd and directDialNum", () => {
          const createWorkerAttributesAfterFormValid = workerAttributesAfterFormValid;
          const form = {
            ...validFormState,
            triton: {
              ...validFormState.triton,
              zeroOutEnabled: {
                value: true
              },
              selfServiceInd: {
                value: true
              }
            }
          };
          beforeEach(() => {
            useFormState.mockReturnValue(form);
          });
          test("should include overflow skill, self service indicator and save user with did worker request body when clicked", async () => {
            renderComponent(true);
            render(Tooltip.mock.calls[0][0].children);
            act(() => {
              const onClick = StyledButton.mock.calls[2][0].onClick;
              onClick();
            });
            await waitFor(() => {
              expect(createUser).toHaveBeenCalledWith({
                activateEp: true, // true for DID workers
                attributes: {
                  ...createWorkerAttributesAfterFormValid,
                  routing: {
                    ...validFormState.triton.routing,
                    skills: [
                      "466"
                    ]
                  }
                },
                alternateDid: validFormState.triton.alternateDid.e164,
                directDialNum: validFormState.triton.directDialNum.e164,
                zeroOutEnabled: true,
                selfServiceInd: true,
                operatingUnitSid: validOperatingUnitId
              });
              expect(mockSetForm).toHaveBeenCalledTimes(2);
              expect(mockSetForm).toHaveBeenCalledWith(resetFormAfterAddExpectedAction);
              expect(mockSetForm).toHaveBeenCalledWith( { type: userFormActions.SET_USER_PREVIOUSLY_ADDED_TRUE });
              expect(mockDispatch).toHaveBeenCalledTimes(3);
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
              expect(mockDispatch.mock.calls[2][0]).toEqual({
                type: "loadCalabrioUsers",
                payload: ["agent1", "agent2"]
              });
              jest.runAllTimers();
              expect(mockUpdateLoading).toHaveBeenCalledTimes(3);
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
            });
          });
          describe("getNonOverflowSkills returns undefined", () => {
            beforeEach(() => {
              getNonOverflowSkills.mockReturnValue(undefined);
              useFormState.mockReturnValue(form);
            });
            test("Should spread empty array in skills", async () => {
              renderComponent(true);
              render(Tooltip.mock.calls[0][0].children);
              act(() => {
                const onClick = StyledButton.mock.calls[2][0].onClick;
                onClick();
              });
              await waitFor(() => {
                expect(createUser).toHaveBeenCalledWith({
                  activateEp: true, // true for DID workers
                  attributes: {
                    ...createWorkerAttributesAfterFormValid,
                    routing: {
                      ...validFormState.triton.routing,
                      skills: [
                        "466"
                      ]
                    }
                  },
                  alternateDid: validFormState.triton.alternateDid.e164,
                  directDialNum: validFormState.triton.directDialNum.e164,
                  zeroOutEnabled: true,
                  selfServiceInd: true,
                  operatingUnitSid: validOperatingUnitId
                });
                expect(mockSetForm).toHaveBeenCalledTimes(2);
                expect(mockSetForm).toHaveBeenCalledWith(resetFormAfterAddExpectedAction);
                expect(mockSetForm).toHaveBeenCalledWith( { type: userFormActions.SET_USER_PREVIOUSLY_ADDED_TRUE });
                expect(mockDispatch).toHaveBeenCalledTimes(3);
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
                expect(mockDispatch.mock.calls[2][0]).toEqual({
                  type: "loadCalabrioUsers",
                  payload: ["agent1", "agent2"]
                });
                jest.runAllTimers();
                expect(mockUpdateLoading).toHaveBeenCalledTimes(3);
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
              });
            });
          });
        });
      });
      describe("doCreateUser fails", () => {
        const createWorkerAttributesAfterFormValid = workerAttributesAfterFormValid;
        describe("addOffice fails", () => {
          const nonDidValidFormState = {
            ...validFormState,
            triton: {
              ...validFormState.triton,
              directDialNum: {
                ...validFormState.directDialNum,
                value: ""
              }
            }
          };
          beforeEach(() => {
            addOffice.mockRejectedValue({ aww: "bummer" });
            useFormState.mockReturnValue(nonDidValidFormState);
          });
          test("should not dispatch AddOffice but should still enable Add User button and save user when clicked", async () => {
            renderComponent(true);
            render(Tooltip.mock.calls[0][0].children);
            act(() => {
              const onClick = StyledButton.mock.calls[2][0].onClick;
              onClick();
            });
            await waitFor(() => {
              expect(createUser).toHaveBeenCalledWith({
                activateEp: false, // false for non-DID workers
                attributes: createWorkerAttributesAfterFormValid,
                operatingUnitSid: validOperatingUnitId
              });
              expect(mockSetForm).toHaveBeenCalledTimes(2);
              expect(mockSetForm).toHaveBeenCalledWith(resetFormAfterAddExpectedAction);
              expect(mockSetForm).toHaveBeenCalledWith( { type: userFormActions.SET_USER_PREVIOUSLY_ADDED_TRUE });
              expect(mockDispatch).toHaveBeenCalledTimes(2);
              expect(mockDispatch.mock.calls[0][0]).toEqual({
                type: "addWorkers",
                payload: [formattedWorker]
              });
              expect(mockDispatch.mock.calls[1][0]).toEqual({
                type: "loadCalabrioUsers",
                payload: ["agent1", "agent2"]
              });
              jest.runAllTimers();
              expect(mockUpdateLoading).toHaveBeenCalledTimes(3);
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
            });
          });
        });
        describe("createUser fails", () => {
          const nonDidValidFormState = {
            ...validFormState,
            triton: {
              ...validFormState.triton,
              directDialNum: {
                ...validFormState.triton.directDialNum,
                value: ""
              }
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
          test("should not add user and should update loading with failed specific error message", async () => {
            renderComponent(true);
            render(Tooltip.mock.calls[0][0].children);
            act(() => {
              const onClick = StyledButton.mock.calls[2][0].onClick;
              onClick();
            });
            await waitFor(() => {
              expect(createUser).toHaveBeenCalledWith({
                activateEp: false, // false for non-DID workers
                attributes: createWorkerAttributesAfterFormValid,
                operatingUnitSid: validOperatingUnitId
              });
              expect(mockSetForm).toHaveBeenCalledTimes(0);
              expect(mockDispatch).toHaveBeenCalledTimes(0);
              jest.runAllTimers();
              expect(mockUpdateLoading).toHaveBeenCalledTimes(2);
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
            });
          });
          test("should not add user and should update loading with failed generic error message", async () => {
            createUser.mockRejectedValue({
              message: "bummer",
              response: {
                data: {}
              }
            });
            renderComponent(true);
            render(Tooltip.mock.calls[0][0].children);
            act(() => {
              const onClick = StyledButton.mock.calls[2][0].onClick;
              onClick();
            });
            await waitFor(() => {
              expect(createUser).toHaveBeenCalledWith({
                activateEp: false, // false for non-DID workers
                attributes: createWorkerAttributesAfterFormValid,
                operatingUnitSid: validOperatingUnitId
              });
              expect(mockSetForm).toHaveBeenCalledTimes(0);
              expect(mockDispatch).toHaveBeenCalledTimes(0);
              jest.runAllTimers();
              expect(mockUpdateLoading).toHaveBeenCalledTimes(2);
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
            });
          });
        });
      });
      describe("checkConflictingUsers fails", () => {
        const nonDidValidFormState = {
          ...validFormState,
          triton: {
            ...validFormState.triton,
            directDialNum: {
              ...validFormState.triton.directDialNum,
              value: ""
            }
          }
        };
        beforeEach(() => {
          checkConflictingUsers.mockRejectedValue({ message: "bummer" });
          useFormState.mockReturnValue(nonDidValidFormState);
        });
        test("createCalabrioUser should not be called", async () => {
          renderComponent(true);
          render(Tooltip.mock.calls[0][0].children);
          act(() => {
            const onClick = StyledButton.mock.calls[2][0].onClick;
            onClick();
          });
          await waitFor(() => {
            expect(createCalabrioUser).toHaveBeenCalledTimes(0);
            jest.runAllTimers();
            expect(mockUpdateLoading).toHaveBeenCalledTimes(2);
            expect(mockUpdateLoading.mock.calls[0][0]).toEqual({
              overlayMessage: "Adding new user...",
              saveStatus: "saving",
              saveUser: true
            });
            expect(mockUpdateLoading.mock.calls[1][0]).toEqual({
              overlayMessage: "The following errors occurred: Failed to create Calabrio QM User. bummer",
              saveStatus: "partial fail",
              saveUser: true
            });
          });
        });
      });
      describe("createCalabrioUser fails", () => {
        const nonDidValidFormState = {
          ...validFormState,
          triton: {
            ...validFormState.triton,
            directDialNum: {
              ...validFormState.triton.directDialNum,
              value: ""
            }
          }
        };
        beforeEach(() => {
          useFormState.mockReturnValue(nonDidValidFormState);
          checkConflictingUsers.mockResolvedValue("yay");
          createCalabrioUser.mockRejectedValue({ message: "bummer" });
        });
        test("setForm should not be called", async () => {
          renderComponent(true);
          render(Tooltip.mock.calls[0][0].children);
          act(() => {
            const onClick = StyledButton.mock.calls[2][0].onClick;
            onClick();
          });
          await waitFor(() => {
            expect(mockSetForm).toHaveBeenCalledTimes(0);
            jest.runAllTimers();
            expect(mockUpdateLoading).toHaveBeenCalledTimes(2);
            expect(mockUpdateLoading.mock.calls[0][0]).toEqual({
              overlayMessage: "Adding new user...",
              saveStatus: "saving",
              saveUser: true
            });
            expect(mockUpdateLoading.mock.calls[1][0]).toEqual({
              overlayMessage: "The following errors occurred: Failed to create Calabrio QM User. bummer",
              saveStatus: "partial fail",
              saveUser: true
            });
          });
        });
      });
      describe("getCalabrioUsers fails", () => {
        const nonDidValidFormState = {
          ...validFormState,
          triton: {
            ...validFormState.triton,
            directDialNum: {
              ...validFormState.triton.directDialNum,
              value: ""
            }
          }
        };
        beforeEach(() => {
          useFormState.mockReturnValue(nonDidValidFormState);
          getCalabrioUsers.mockRejectedValue({ message: "bummer" });
        });
        test("setForm should not be called", async () => {
          renderComponent(true);
          render(Tooltip.mock.calls[0][0].children);
          act(() => {
            const onClick = StyledButton.mock.calls[2][0].onClick;
            onClick();
          });
          await waitFor(() => {
            expect(mockDispatch).toBeCalledTimes(2);
            expect(mockDispatch.mock.calls[0][0].type).toBe("addWorkers");
            expect(mockDispatch.mock.calls[1][0].type).toBe("addOffice");
            jest.runAllTimers();
            expect(mockSetForm).toHaveBeenCalledTimes(0);
            expect(mockUpdateLoading).toHaveBeenCalledTimes(2);
            expect(mockUpdateLoading.mock.calls[0][0]).toEqual({
              overlayMessage: "Adding new user...",
              saveStatus: "saving",
              saveUser: true
            });
            expect(mockUpdateLoading.mock.calls[1][0]).toEqual({
              overlayMessage: "The following errors occurred: Failed to refresh Calabrio state, please refresh Triton Admin",
              saveStatus: "partial fail",
              saveUser: true
            });
          });
        });
      });
      describe("calabrio wfm user is added", () => {
        const form = {
          ...validFormState,
          calabrio_qm: {
            ...validFormState.calabrio_qm,
            updated: false
          },
          calabrio_wfm: {
            userFound: true,
            BusinessUnitId: "111",
            EmploymentStartDate: "05/02/1991",
            Roles: [{ Id: "Role1" }],
            EmploymentNumber: "n0263786",
            Email: "faith.cuneo@libertymutual.com",
            PersonSkills: [{
              Id: "2134-5432",
              Name: "CSC Skill"
            }]
          }
        };
        beforeEach(() => {
          createCalabrioWFMPerson.mockResolvedValue({ data: "9dase-Owaaskm" });
          useFormState.mockReturnValueOnce(form);
        });
        const wfmBody = {
          ...form.calabrio_wfm,
          PersonStartDate: "05/02/1991",
          RoleIds: ["Role1"],
          NNumber: "n0263786",
          ApplicationLogon: "faith.cuneo@libertymutual.com",
          PersonSkills: [{
            Id: "2134-5432",
            Name: "CSC Skill"
          }],
          Skills: ["2134-5432"],
          TimeZoneId: 173
        };
        describe("environment === production", () => {
          beforeEach(() => {
            env.APP_ENV = "production";
            useAdminState.mockReturnValue({
              calabrioContext: {
                users: [],
                wfmOrg: []
              }
            });
          });
          describe("all wfm calls are successful", () => {
            test("form is updated as successful", async () => {
              renderComponent(true);
              render(Tooltip.mock.calls[0][0].children);
              act(() => {
                const onClick = StyledButton.mock.calls[2][0].onClick;
                onClick();
              });
              await waitFor(() => {
                expect(createUser).toHaveBeenCalledTimes(1);
                expect(createCalabrioWFMPerson).toHaveBeenCalledWith(wfmBody);
                expect(wfmActivateExternalLogon).toHaveBeenCalled();
                expect(mockDispatch).toHaveBeenCalledTimes(4);
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
                expect(mockDispatch.mock.calls[2][0]).toEqual({
                  type: "loadCalabrioUsers",
                  payload: ["agent1", "agent2"]
                });
                expect(mockDispatch.mock.calls[3][0]).toEqual({
                  type: "updateWfmOrg",
                  payload: {
                    org: ["newstateyay!"],
                    errors: []
                  }
                });
                jest.runAllTimers();
                expect(mockUpdateLoading).toHaveBeenCalledTimes(3);
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
              });
            });
          });
          describe("createCalabrioWFMPerson fails", () => {
            beforeEach(() => {
              createCalabrioWFMPerson.mockRejectedValue({ message: "bummer" });
              useFormState.mockReturnValue(form);
            });
            test("error is shown on final results", async () => {
              renderComponent(true);
              render(Tooltip.mock.calls[0][0].children);
              act(() => {
                const onClick = StyledButton.mock.calls[2][0].onClick;
                onClick();
              });
              await waitFor(() => {
                expect(createUser).toHaveBeenCalledTimes(1);
                expect(createCalabrioWFMPerson).toHaveBeenCalledWith(wfmBody);
                expect(wfmActivateExternalLogon).not.toHaveBeenCalled();
                expect(mockDispatch).toHaveBeenCalledTimes(3);
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
                expect(mockDispatch.mock.calls[2][0]).toEqual({
                  type: "loadCalabrioUsers",
                  payload: ["agent1", "agent2"]
                });
                jest.runAllTimers();
                expect(mockUpdateLoading).toHaveBeenCalledTimes(2);
                expect(mockUpdateLoading.mock.calls[0][0]).toEqual({
                  overlayMessage: "Adding new user...",
                  saveStatus: "saving",
                  saveUser: true
                });
                expect(mockUpdateLoading.mock.calls[1][0]).toEqual({
                  overlayMessage: "The following errors occurred: Failed to create WFM User. bummer",
                  saveStatus: "partial fail",
                  saveUser: true
                });
              });
            });
          });
          describe("wfmActivateExternalLogon fails", () => {
            const form = {
              ...JSON.parse(JSON.stringify(validFormState)),
              calabrio_qm: {
                ...JSON.parse(JSON.stringify(validFormState)).calabrio_qm,
                updated: false
              },
              calabrio_wfm: {
                userFound: true,
                BusinessUnitId: "111",
                EmploymentStartDate: "05/02/1991",
                Roles: ["Role1"],
                EmploymentNumber: "n0263786",
                Email: "faith.cuneo@libertymutual.com"
              }
            };
            beforeEach(() => {
              createCalabrioWFMPerson.mockResolvedValue({ data: "9dase-Owaaskm" });
              wfmActivateExternalLogon.mockRejectedValue({ message: "bummer" });
              useFormState.mockReturnValue(form);
            });
            test("error is shown on final results", async () => {
              renderComponent(true);
              render(Tooltip.mock.calls[0][0].children);
              act(() => {
                const onClick = StyledButton.mock.calls[2][0].onClick;
                onClick();
              });
              await waitFor(() => {
                expect(createUser).toHaveBeenCalledTimes(1);
                expect(createCalabrioWFMPerson).toHaveBeenCalledWith(wfmBody);
                expect(wfmActivateExternalLogon).toHaveBeenCalled();
                expect(mockDispatch).toHaveBeenCalledTimes(4);
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
                expect(mockDispatch.mock.calls[2][0]).toEqual({
                  type: "loadCalabrioUsers",
                  payload: ["agent1", "agent2"]
                });
                expect(mockDispatch.mock.calls[3][0]).toEqual({
                  type: "updateWfmOrg",
                  payload: {
                    org: ["newstateyay!"],
                    errors: []
                  }
                });
                jest.runAllTimers();
                expect(mockUpdateLoading).toHaveBeenCalledTimes(2);
                expect(mockUpdateLoading.mock.calls[0][0]).toEqual({
                  overlayMessage: "Adding new user...",
                  saveStatus: "saving",
                  saveUser: true
                });
                expect(mockUpdateLoading.mock.calls[1][0]).toEqual({
                  overlayMessage: "The following errors occurred: Failed to activate WFM External Logon. bummer",
                  saveStatus: "partial fail",
                  saveUser: true
                });
              });
            });
          });
        });
        describe("environment !== production", () => {
          test("wfm calls are not made", async () => {
            renderComponent(true);
            render(Tooltip.mock.calls[0][0].children);
            act(() => {
              const onClick = StyledButton.mock.calls[2][0].onClick;
              onClick();
            });
            await waitFor(() => {
              expect(createUser).toHaveBeenCalledTimes(1);
              expect(createCalabrioWFMPerson).not.toHaveBeenCalled();
              expect(wfmActivateExternalLogon).not.toHaveBeenCalled();
              expect(mockDispatch).toHaveBeenCalledTimes(3);
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
              expect(mockDispatch.mock.calls[2][0]).toEqual({
                type: "loadCalabrioUsers",
                payload: ["agent1", "agent2"]
              });
              expect(mockUpdateLoading.mock.calls[1][0]).toEqual({
                overlayMessage: "The following errors occurred: WFM does not have a non prod environment. WFM form entries were disregarded.",
                saveStatus: "partial fail",
                saveUser: true
              });
            });
          });
        });
      });
    });
    describe(`form.formMode === ${formModes.UPDATE}`, () => {
      const updateFormState = {
        ...JSON.parse(JSON.stringify(validFormState)),
        formMode: formModes.UPDATE,
        calabrio_qm: {
          ...validFormState.calabrio_qm,
          updated: true
        }
      };
      beforeEach(() => {
        useFormState.mockReturnValue(updateFormState);
        isFormUpdated.mockReturnValue(true);
        getNonOverflowSkills.mockReturnValue(["nonSkillL1"]);
        checkConflictingUsers.mockResolvedValue("Yay!");
        createCalabrioUser.mockResolvedValue("yay!");
        getCalabrioUsers.mockResolvedValue({ data: ["agent1", "agent2"]});
      });
      describe("Initial State", () => {
        test("UserFormButton should be called 'Save User'", () => {
          renderComponent(true);
          render(Tooltip.mock.calls[0][0].children);
          expect(StyledButton.mock.calls[1][0].children).toBe("Save User");
        });
        test("When form is valid, Add Save Button is enabled", () => {
          isTritonUserValid.mockReturnValue(true);
          renderComponent(true);
          render(Tooltip.mock.calls[0][0].children);
          expect(StyledButton.mock.calls[1][0].disabled).toBe(false);
        });
        test("When form is invalid, Add Save Button is disabled", () => {
          isTritonUserValid.mockReturnValue(false);
          renderComponent(true);
          render(Tooltip.mock.calls[0][0].children);
          expect(StyledButton.mock.calls[1][0].disabled).toBe(true);
        });
      });
      describe("updateUser service call, add office service call, and createCalabrioUser service call are successful", () => {
        describe("Worker is not a DID user", () => {
          const nonDidValidFormState = {
            ...updateFormState,
            calabrio_qm: {
              ...updateFormState.calabrio_qm,
              updated: true,
              id: 1
            },
            triton: {
              ...updateFormState.triton,
              directDialNum: {
                ...updateFormState.triton.directDialNum,
                value: "",
                updated: false
              },
              zeroOutEnabled: {
                value: true
              },
              selfServiceInd: {
                value: false
              }
            }
          };
          beforeEach(() => {
            updateUser.mockResolvedValue(rawDbWorker);
            useFormState.mockReturnValue(nonDidValidFormState);
            updateCalabrioUser.mockResolvedValue({ data: ["agent1", "agent2"]});
          });
          test("should save user with non did worker request body when clicked", async () => {
            const updateWorker = {
              ...worker,
              attributes: {
                ...worker.attributes,
                routing: {
                  skills: [],
                  levels: { "466": 3 },
                  team: "Sample1",
                  callerStates: ["Test1", "Test2"],
                  updated: "true"
                }
              }
            };
            const updateWorkerAttributesAfterFormValid = {
              default_skills: validFormOptions.defaultSkills,
              did: validFormOptions.didE164,
              email: "test@abc.com",
              email_address: "test@abc.com",
              emp_first_name: "Frank",
              emp_last_name: "Rizzo",
              full_name: "Frank Rizzo",
              department_id: validFormState.nNumber.nNumberFetchedUser.departmentNumber,
              department_name: validFormState.nNumber.nNumberFetchedUser.departmentName,
              extension: validFormOptions.extension,
              location: validFormState.nNumber.nNumberFetchedUser.departmentName,
              manager_first_name: validFormOptions.manager.manager_first_name,
              manager_last_name: validFormOptions.manager.manager_last_name,
              manager_n_number: validFormOptions.manager.manager_n_number,
              manager: `${validFormOptions.manager.manager_first_name} ${validFormOptions.manager.manager_last_name}`,
              profile_id: validFormOptions.profileId,
              routing: {
                skills: ["nonSkillL1","466"],
                levels: { "466": 3 },
                team: "Sample1",
                callerStates: ["Test1", "Test2"],
                updated: true
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
                alternateDid: updateFormState.triton.alternateDid.e164,
                attributes: updateWorkerAttributesAfterFormValid,
                operatingUnitSid: validOperatingUnitId,
                zeroOutEnabled: true,
                selfServiceInd: false
              });
              expect(checkConflictingUsers).toBeCalledTimes(0);
              expect(updateCalabrioUser).toBeCalledTimes(1);
              expect(getCalabrioUsers).toBeCalledTimes(1);
              expect(mockDispatch).toHaveBeenCalledTimes(2);
              expect(mockDispatch.mock.calls[0][0]).toEqual({
                type: "updateWorker",
                payload: formattedWorker
              });
              expect(mockDispatch.mock.calls[1][0]).toEqual({
                type: "loadCalabrioUsers",
                payload: ["agent1", "agent2"]
              });
              jest.runAllTimers();
              expect(mockUpdateLoading).toHaveBeenCalledTimes(3);
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
              expect(mockUpdateLoading.mock.calls[2][0]).toEqual({
                saveUser: false
              });
              expect(mockHandleClose).toHaveBeenCalledTimes(1);
            });
          });
        });

        describe("Worker is a DID user", () => {
          const updateWorkerAttributesAfterFormValid = {
            default_skills: validFormOptions.defaultSkills,
            email: "test@abc.com",
            email_address: "test@abc.com",
            emp_first_name: "Frank",
            emp_last_name: "Rizzo",
            full_name: "Frank Rizzo",
            did: validFormOptions.didE164,
            department_id: validFormOptions.nNumberFetchedUser.departmentNumber,
            department_name: validFormOptions.nNumberFetchedUser.departmentName,
            extension: validFormOptions.extension,
            location: validFormOptions.nNumberFetchedUser.departmentName,
            manager_first_name: validFormOptions.manager.manager_first_name,
            manager_last_name: validFormOptions.manager.manager_last_name,
            manager_n_number: validFormOptions.manager.manager_n_number,
            manager: `${validFormOptions.manager.manager_first_name} ${validFormOptions.manager.manager_last_name}`,
            profile_id: validFormOptions.profileId,
            routing: {
              ...validFormState.triton.routing,
              skills: ["nonSkillL1"]
            }
          };
          const updateWorker = {
            ...worker,
            attributes: {
              ...worker.attributes,
              routing: {
                skills: [],
                levels: {},
                team: "Sample1"
              }
            }
          };
          beforeEach(() => {
            updateUser.mockResolvedValue(rawDbWorker);
            workerHasOverFlowSkill.mockReturnValue(true);
            useFormState.mockReturnValue(updateFormState);
          });
          test("should save user with did worker request body when clicked", async () => {
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
                alternateDid: validFormState.triton.alternateDid.e164,
                directDialNum: validFormState.triton.directDialNum.e164,
                zeroOutEnabled: validFormState.triton.zeroOutEnabled.value,
                selfServiceInd: validFormState.triton.selfServiceInd.value,
                operatingUnitSid: validOperatingUnitId
              });
              expect(mockDispatch).toHaveBeenCalledTimes(2);
              expect(mockDispatch.mock.calls[0][0]).toEqual({
                type: "updateWorker",
                payload: formattedWorker
              });
              expect(mockDispatch.mock.calls[1][0]).toEqual({
                type: "loadCalabrioUsers",
                payload: ["agent1", "agent2"]
              });
              jest.runAllTimers();
              expect(mockUpdateLoading).toHaveBeenCalledTimes(3);
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
              expect(mockUpdateLoading.mock.calls[2][0]).toEqual({
                saveUser: false
              });
            });
          });
          describe("getNonOverflowSkills returns undefined", () => {
            beforeEach(() => {
              getNonOverflowSkills.mockReturnValue(undefined);
              useFormState.mockReturnValue(updateFormState);
            });
            test("Should spread empty array in skills", async () => {
              renderComponent(true, updateWorker);
              render(Tooltip.mock.calls[0][0].children);
              act(() => {
                const onClick = StyledButton.mock.calls[1][0].onClick;
                onClick();
              });
              await waitFor(() => {
                expect(updateUser).toHaveBeenCalledWith(worker.sid, {
                  activateEp: true, // true for DID workers
                  attributes: {
                    ...updateWorkerAttributesAfterFormValid,
                    routing: {
                      team: updateWorkerAttributesAfterFormValid.routing.team,
                      skills: [],
                      levels: updateWorkerAttributesAfterFormValid.routing.levels,
                      callerStates: updateWorkerAttributesAfterFormValid.routing.callerStates,
                      updated: true
                    },
                    email: "test@abc.com",
                    email_address: "test@abc.com",
                    emp_first_name: "Frank",
                    emp_last_name: "Rizzo",
                    full_name: "Frank Rizzo"
                  },
                  alternateDid: validFormState.triton.alternateDid.e164,
                  directDialNum: validFormState.triton.directDialNum.e164,
                  zeroOutEnabled: validFormState.triton.zeroOutEnabled.value,
                  selfServiceInd: validFormState.triton.selfServiceInd.value,
                  operatingUnitSid: validOperatingUnitId
                });
                expect(mockDispatch).toHaveBeenCalledTimes(2);
                expect(mockDispatch.mock.calls[0][0]).toEqual({
                  type: "updateWorker",
                  payload: formattedWorker
                });
                expect(mockDispatch.mock.calls[1][0]).toEqual({
                  type: "loadCalabrioUsers",
                  payload: ["agent1", "agent2"]
                });
                jest.runAllTimers();
                expect(mockUpdateLoading).toHaveBeenCalledTimes(3);
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
                expect(mockUpdateLoading.mock.calls[2][0]).toEqual({
                  saveUser: false
                });
              });
            });
          });
        });
        describe("Fields are unchanged", () => {
          const unchangedForm = {
            ...updateFormState,
            triton: {
              ...updateFormState.triton,
              manager: {
                ...updateFormState.triton.manager,
                updated: false
              },
              profileId: {
                ...updateFormState.triton.profileId,
                updated: false
              },
              outgoing: {
                ...updateFormState.triton.outgoing,
                updated: false
              },
              extension: {
                ...updateFormState.triton.extension,
                updated: false
              },
              alternateDid: {
                ...updateFormState.triton.alternateDid,
                updated: false
              },
              directDialNum: {
                ...updateFormState.triton.directDialNum,
                updated: false
              },
              inactiveForwardTo: {
                ...updateFormState.triton.inactiveForwardTo,
                updated: false
              },
              defaultSkills: {
                ...updateFormState.triton.defaultSkills,
                updated: false
              },
              zeroOutEnabled: {
                value: true,
                updated: false
              },
              selfServiceInd: {
                value: true,
                updated: false
              },
              routing: {
                team: "Sample1",
                skills: ["466"],
                levels: { "466": 3 },
                updated: false
              }
            }
          };
          beforeEach(() => {
            updateUser.mockResolvedValue(rawDbWorker);
            workerHasOverFlowSkill.mockReturnValue(true);
            useFormState.mockReturnValue(unchangedForm);
          });
          test("should save user with did worker request body when clicked", async () => {
            const updateWorker = {
              ...worker,
              attributes: {
                ...worker.attributes,
                triton:
              {
                ...worker.attributes.triton,
                routing: {
                  skills: ["466"],
                  levels: { "466": 3 },
                  team: "Sample1",
                  callerStates: ["Test1", "Test2"]
                }
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
                attributes: {
                  department_id: fetchedUser.departmentNumber,
                  department_name: fetchedUser.departmentName,
                  location: fetchedUser.departmentName,
                  email: "test@abc.com",
                  email_address: "test@abc.com",
                  emp_first_name: "Frank",
                  emp_last_name: "Rizzo",
                  full_name: "Frank Rizzo"
                },
                zeroOutEnabled: true,
                selfServiceInd: true
              });
              expect(mockDispatch).toHaveBeenCalledTimes(2);
              expect(mockDispatch.mock.calls[0][0]).toEqual({
                type: "updateWorker",
                payload: formattedWorker
              });
              expect(mockDispatch.mock.calls[1][0]).toEqual({
                type: "loadCalabrioUsers",
                payload: ["agent1", "agent2"]
              });
              jest.runAllTimers();
              expect(mockUpdateLoading).toHaveBeenCalledTimes(3);
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
              expect(mockUpdateLoading.mock.calls[2][0]).toEqual({
                saveUser: false
              });
            });
          });
        });
        describe("nNumberFetchedUser is null", () => {
          const updateWorkerAttributesAfterFormValid = {
            default_skills: validFormOptions.defaultSkills,
            email: undefined,
            email_address: undefined,
            emp_first_name: undefined,
            emp_last_name: undefined,
            full_name: undefined + " " + undefined,
            did: validFormOptions.didE164,
            extension: validFormOptions.extension,
            manager_first_name: validFormOptions.manager.manager_first_name,
            manager_last_name: validFormOptions.manager.manager_last_name,
            manager_n_number: validFormOptions.manager.manager_n_number,
            manager: `${validFormOptions.manager.manager_first_name} ${validFormOptions.manager.manager_last_name}`,
            profile_id: validFormOptions.profileId,
            routing: {
              ...validFormState.triton.routing,
              skills: ["nonSkillL1"]
            }
          };
          const updateWorker = {
            ...worker,
            attributes: {
              ...worker.attributes,
              triton: {
                ...worker.attributes.triton,
                routing: {
                  skills: ["466"],
                  levels: { "466": 3 },
                  team: "Sample1",
                  callerStates: ["Test1", "Test2"]
                }
              }
            }
          };
          beforeEach(() => {
            updateUser.mockResolvedValue(rawDbWorker);
            workerHasOverFlowSkill.mockReturnValue(true);
            useFormState.mockReturnValue({
              ...updateFormState,
              nNumber: {
                ...updateFormState.nNumber,
                nNumberFetchedUser: null
              }
            });
          });
          test("should save user with did worker request body when clicked", async () => {
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
                alternateDid: validFormState.triton.alternateDid.e164,
                directDialNum: validFormState.triton.directDialNum.e164,
                zeroOutEnabled: validFormState.triton.zeroOutEnabled.value,
                selfServiceInd: validFormState.triton.selfServiceInd.value,
                operatingUnitSid: validOperatingUnitId
              });
              expect(mockDispatch).toHaveBeenCalledTimes(2);
              expect(mockDispatch.mock.calls[0][0]).toEqual({
                type: "updateWorker",
                payload: formattedWorker
              });
              expect(mockDispatch.mock.calls[1][0]).toEqual({
                type: "loadCalabrioUsers",
                payload: ["agent1", "agent2"]
              });
              jest.runAllTimers();
              expect(mockUpdateLoading).toHaveBeenCalledTimes(3);
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
              expect(mockUpdateLoading.mock.calls[2][0]).toEqual({
                saveUser: false
              });
            });
          });
        });
        describe("nNumberFetchedUser is missing information", () => {
          const updateWorkerAttributesAfterFormValid = {
            default_skills: validFormOptions.defaultSkills,
            email: "test@abc.com",
            email_address: "test@abc.com",
            emp_first_name: "Frank",
            emp_last_name: "Rizzo",
            full_name: "Frank Rizzo",
            did: validFormOptions.didE164,
            extension: validFormOptions.extension,
            manager_first_name: validFormOptions.manager.manager_first_name,
            manager_last_name: validFormOptions.manager.manager_last_name,
            manager_n_number: validFormOptions.manager.manager_n_number,
            manager: `${validFormOptions.manager.manager_first_name} ${validFormOptions.manager.manager_last_name}`,
            profile_id: validFormOptions.profileId,
            routing: {
              ...validFormState.triton.routing,
              skills: ["nonSkillL1"]
            }
          };
          const updateWorker = {
            ...worker,
            attributes: {
              ...worker.attributes
            }
          };
          beforeEach(() => {
            updateUser.mockResolvedValue(rawDbWorker);
            workerHasOverFlowSkill.mockReturnValue(true);
            useFormState.mockReturnValue({
              ...updateFormState,
              nNumber: {
                ...updateFormState.nNumber,
                nNumberFetchedUser: {
                  ...updateFormState.nNumber.nNumberFetchedUser,
                  departmentNumber: null,
                  departmentName: null
                }
              }
            });
          });
          test("should save user with did worker request body when clicked", async () => {
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
                alternateDid: validFormState.triton.alternateDid.e164,
                directDialNum: validFormState.triton.directDialNum.e164,
                zeroOutEnabled: validFormState.triton.zeroOutEnabled.value,
                selfServiceInd: validFormState.triton.selfServiceInd.value,
                operatingUnitSid: validOperatingUnitId
              });
              expect(mockDispatch).toHaveBeenCalledTimes(2);
              expect(mockDispatch.mock.calls[0][0]).toEqual({
                type: "updateWorker",
                payload: formattedWorker
              });
              expect(mockDispatch.mock.calls[1][0]).toEqual({
                type: "loadCalabrioUsers",
                payload: ["agent1", "agent2"]
              });
              jest.runAllTimers();
              expect(mockUpdateLoading).toHaveBeenCalledTimes(3);
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
              expect(mockUpdateLoading.mock.calls[2][0]).toEqual({
                saveUser: false
              });
            });
          });
        });
      });
      describe("Routing Team with empty null value",()=>{
        const updateWorker = {
          ...worker,
          attributes: {
            ...worker.attributes,
            routing: {
              skills: [],
              levels: {},
              team: "",
              updated: "true"
            }
          }
        };
        const updateWorkerAttributesAfterFormValid = {
          default_skills: validFormOptions.defaultSkills,
          did: validFormOptions.didE164,
          email: "test@abc.com",
          email_address: "test@abc.com",
          emp_first_name: "Frank",
          emp_last_name: "Rizzo",
          full_name: "Frank Rizzo",
          department_id: validFormState.nNumber.nNumberFetchedUser.departmentNumber,
          department_name: validFormState.nNumber.nNumberFetchedUser.departmentName,
          extension: validFormOptions.extension,
          location: validFormState.nNumber.nNumberFetchedUser.departmentName,
          manager_first_name: validFormOptions.manager.manager_first_name,
          manager_last_name: validFormOptions.manager.manager_last_name,
          manager_n_number: validFormOptions.manager.manager_n_number,
          manager: `${validFormOptions.manager.manager_first_name} ${validFormOptions.manager.manager_last_name}`,
          profile_id: validFormOptions.profileId
        };
        const rawDbWorker = {
          attributes: {
            ...updateWorkerAttributesAfterFormValid,
            office_location_number: "newOffice"
          },
          workerSid: "WK1234"
        };
        const nonDidValidFormState = {
          ...updateFormState,
          calabrio_qm: {
            ...updateFormState.calabrio_qm,
            updated: true,
            id: 1
          },
          triton: {
            ...updateFormState.triton,
            routing: {
              skills: [],
              levels: {},
              team: "",
              callerStates: [],
              updated: "true"
            },
            directDialNum: {
              ...updateFormState.triton.directDialNum,
              value: "",
              updated: false
            },
            zeroOutEnabled: {
              value: true,
              updated: true
            },
            selfServiceInd: {
              value: false
            }
          }
        };
        beforeEach(() => {
          updateUser.mockResolvedValue(rawDbWorker);
          workerHasOverFlowSkill.mockReturnValue(true);
          updateCalabrioUser.mockResolvedValue({ data: ["agent1", "agent2"]});
        });
        test("update overflow skill", async () => {
          useFormState.mockReturnValue(nonDidValidFormState);
          renderComponent(true, updateWorker);
          render(Tooltip.mock.calls[0][0].children);
          act(() => {
            const onClick = StyledButton.mock.calls[1][0].onClick;
            onClick();
          });
          await waitFor(() => {
            expect(updateUser).toHaveBeenCalledWith(worker.sid, {
              alternateDid: updateFormState.triton.alternateDid.e164,
              attributes: {
                ...updateWorkerAttributesAfterFormValid,
                routing: {
                  skills: ["nonSkillL1","466"],
                  levels: {},
                  team: "",
                  callerStates: [],
                  updated: "true"
                }
              },
              operatingUnitSid: validOperatingUnitId,
              zeroOutEnabled: true,
              selfServiceInd: false
            });
          });
          jest.clearAllMocks();
        });
        test("remove overflow skill", async () => {
          const nonDidValidFormStateEdited = {
            ...nonDidValidFormState,
            triton: {
              ...nonDidValidFormState.triton,
              zeroOutEnabled: {
                value: false,
                updated: true
              }
            }

          };
          useFormState.mockReturnValue(nonDidValidFormStateEdited);
          renderComponent(true, updateWorker);
          render(Tooltip.mock.calls[0][0].children);
          act(() => {
            const onClick = StyledButton.mock.calls[1][0].onClick;
            onClick();
          });
          await waitFor(() => {
            expect(updateUser).toHaveBeenCalledWith(worker.sid, {
              alternateDid: updateFormState.triton.alternateDid.e164,
              attributes: {
                ...updateWorkerAttributesAfterFormValid,
                routing: {
                  skills: ["nonSkillL1"],
                  levels: {},
                  team: "",
                  callerStates: [],
                  updated: "true"
                }
              },
              operatingUnitSid: validOperatingUnitId,
              zeroOutEnabled: false,
              selfServiceInd: false
            });
          });
        });
      });
      describe("doUpdateUser fails", () => {
        const nonDidValidFormState = {
          ...updateFormState,
          triton: {
            ...updateFormState.triton,
            directDialNum: {
              ...updateFormState.triton.directDialNum,
              value: "",
              updated: false
            },
            alternateDid: {
              ...updateFormState.triton.alternateDid,
              value: "",
              updated: false
            },
            zeroOutEnabled: {
              value: false
            },
            selfServiceInd: {
              value: false
            },
            inactiveForwardTo: {
              value: validFormOptions.inactiveForwardTo,
              updated: true
            }
          }
        };
        const updateWorkerAttributesAfterFormValid = {
          default_skills: validFormOptions.defaultSkills,
          department_id: validFormOptions.nNumberFetchedUser.departmentNumber,
          department_name: validFormOptions.nNumberFetchedUser.departmentName,
          did: validFormOptions.didE164,
          email: "test@abc.com",
          email_address: "test@abc.com",
          emp_first_name: "Frank",
          emp_last_name: "Rizzo",
          full_name: "Frank Rizzo",
          extension: validFormOptions.extension,
          location: validFormOptions.nNumberFetchedUser.departmentName,
          manager_first_name: validFormOptions.manager.manager_first_name,
          manager_last_name: validFormOptions.manager.manager_last_name,
          manager_n_number: validFormOptions.manager.manager_n_number,
          manager: `${validFormOptions.manager.manager_first_name} ${validFormOptions.manager.manager_last_name}`,
          profile_id: validFormOptions.profileId,
          routing: {
            skills: ["nonSkillL1"],
            levels: {},
            team: "Sample1",
            updated: true,
            callerStates: validFormOptions.routing.callerStates
          }
        };
        beforeEach(() => {
          workerHasOverFlowSkill.mockReturnValue(false);
          useFormState.mockReturnValue(nonDidValidFormState);
          updateUser.mockRejectedValue({
            response: {
              data: {
                message: "booo"
              }
            }
          });
        });
        test("should still update calabrio user and should update loading with custom error message", async () => {
          renderComponent(true);
          render(Tooltip.mock.calls[0][0].children);
          act(() => {
            const onClick = StyledButton.mock.calls[1][0].onClick;
            onClick();
          });
          await waitFor(() => {
            expect(updateUser).toHaveBeenCalledWith(worker.sid, {
              zeroOutEnabled: false,
              selfServiceInd: false,
              inactiveForwardTo: validFormOptions.inactiveForwardTo,
              attributes: updateWorkerAttributesAfterFormValid,
              operatingUnitSid: validOperatingUnitId
            });
            expect(mockSetForm).toHaveBeenCalledTimes(0);
            expect(mockDispatch).toHaveBeenCalledTimes(1);
            expect(mockDispatch).toBeCalledWith({
              type: "loadCalabrioUsers",
              payload: [
                "agent1",
                "agent2"
              ]
            });
            jest.runAllTimers();
            expect(mockUpdateLoading).toHaveBeenCalledTimes(4);
            expect(mockUpdateLoading.mock.calls[0][0]).toEqual({
              overlayMessage: "Updating user: Faith Cuneo",
              saveStatus: "saving",
              saveUser: true
            });
            expect(mockUpdateLoading.mock.calls[1][0]).toEqual({
              overlayMessage: "The following errors occurred: Failed to update Triton Worker. booo",
              saveStatus: "partial fail",
              saveUser: true
            });
          });
        });
        test("should still update calabrio user and should update loading with generic failed status", async () => {
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
              selfServiceInd: false,
              inactiveForwardTo: validFormOptions.inactiveForwardTo,
              attributes: updateWorkerAttributesAfterFormValid,
              operatingUnitSid: validOperatingUnitId
            });
            expect(mockSetForm).toHaveBeenCalledTimes(0);
            expect(mockDispatch).toHaveBeenCalledTimes(1);
            expect(mockDispatch).toBeCalledWith({
              type: "loadCalabrioUsers",
              payload: [
                "agent1",
                "agent2"
              ]
            });
            jest.runAllTimers();
            expect(mockUpdateLoading).toHaveBeenCalledTimes(2);
            expect(mockUpdateLoading.mock.calls[0][0]).toEqual({
              overlayMessage: "Updating user: Faith Cuneo",
              saveStatus: "saving",
              saveUser: true
            });
            expect(mockUpdateLoading.mock.calls[1][0]).toEqual({
              overlayMessage: "The following errors occurred: Failed to update Triton Worker. bummer",
              saveStatus: "partial fail",
              saveUser: true
            });
          });
        });
      });
      describe("checkConflictingUsers fails", () => {
        beforeEach(() => {
          updateUser.mockResolvedValue("ysy!");
          checkConflictingUsers.mockRejectedValue({ message: "bummer" });
        });
        test("updateCalabrioUser should not be called", async () => {
          renderComponent(true);
          render(Tooltip.mock.calls[0][0].children);
          act(() => {
            const onClick = StyledButton.mock.calls[1][0].onClick;
            onClick();
          });
          await waitFor(() => {
            expect(createCalabrioUser).toHaveBeenCalledTimes(0);
            jest.runAllTimers();
            expect(mockUpdateLoading).toHaveBeenCalledTimes(2);
            expect(mockUpdateLoading.mock.calls[0][0]).toEqual({
              overlayMessage: "Updating user: Faith Cuneo",
              saveStatus: "saving",
              saveUser: true
            });
            expect(mockUpdateLoading.mock.calls[1][0]).toEqual({
              overlayMessage: "The following errors occurred: Failed to update Calabrio QM user, bummer",
              saveStatus: "partial fail",
              saveUser: true
            });
          });
        });
      });
      describe("createCalabrioUser fails", () => {
        beforeEach(() => {
          updateUser.mockResolvedValue("yay!");
          checkConflictingUsers.mockResolvedValue("yay");
          createCalabrioUser.mockRejectedValue({ message: "bummer" });
        });
        test("setForm should not be called", async () => {
          renderComponent(true);
          render(Tooltip.mock.calls[0][0].children);
          act(() => {
            const onClick = StyledButton.mock.calls[1][0].onClick;
            onClick();
          });
          await waitFor(() => {
            expect(createCalabrioUser).toHaveBeenCalledTimes(1);
            expect(mockSetForm).toHaveBeenCalledTimes(0);
            jest.runAllTimers();
            expect(mockUpdateLoading).toHaveBeenCalledTimes(2);
            expect(mockUpdateLoading.mock.calls[0][0]).toEqual({
              overlayMessage: "Updating user: Faith Cuneo",
              saveStatus: "saving",
              saveUser: true
            });
            expect(mockUpdateLoading.mock.calls[1][0]).toEqual({
              overlayMessage: "The following errors occurred: Failed to update Calabrio QM user, bummer",
              saveStatus: "partial fail",
              saveUser: true
            });
          });
        });
      });
      describe("updateCalabrioUser fails", () => {
        const form = {
          ...validFormState,
          formMode: formModes.UPDATE,
          calabrio_qm: {
            ...validFormState.calabrio_qm,
            updated: true,
            id: 2
          }
        };
        beforeEach(() => {
          useFormState.mockReturnValue(form);
          updateUser.mockResolvedValue("yay!");
          checkConflictingUsers.mockResolvedValue("yay");
          updateCalabrioUser.mockRejectedValue({ message: "bummer" });
        });
        test("setForm should not be called", async () => {
          renderComponent(true);
          render(Tooltip.mock.calls[0][0].children);
          act(() => {
            const onClick = StyledButton.mock.calls[1][0].onClick;
            onClick();
          });
          await waitFor(() => {
            expect(checkConflictingUsers).toHaveBeenCalledTimes(0);
            expect(updateCalabrioUser).toHaveBeenCalledTimes(1);
            expect(mockSetForm).toHaveBeenCalledTimes(0);
            jest.runAllTimers();
            expect(mockUpdateLoading).toHaveBeenCalledTimes(2);
            expect(mockUpdateLoading.mock.calls[0][0]).toEqual({
              overlayMessage: "Updating user: Faith Cuneo",
              saveStatus: "saving",
              saveUser: true
            });
            expect(mockUpdateLoading.mock.calls[1][0]).toEqual({
              overlayMessage: "The following errors occurred: Failed to update Calabrio QM user, bummer",
              saveStatus: "partial fail",
              saveUser: true
            });
          });
        });
      });
      describe("getCalabrioUsers fails", () => {
        const form = {
          ...validFormState,
          formMode: formModes.UPDATE,
          calabrio_qm: {
            ...validFormState.calabrio_qm,
            updated: true,
            id: 2
          }
        };
        beforeEach(() => {
          useFormState.mockReturnValue(form);
          updateUser.mockResolvedValue("yay!");
          checkConflictingUsers.mockResolvedValue("yay");
          updateCalabrioUser.mockResolvedValue({ data: ["agent1", "agent2"]});
          getCalabrioUsers.mockRejectedValue({ message: "bummer" });
        });
        test("setForm should not be called", async () => {
          renderComponent(true);
          render(Tooltip.mock.calls[0][0].children);
          act(() => {
            const onClick = StyledButton.mock.calls[1][0].onClick;
            onClick();
          });
          await waitFor(() => {
            expect(mockSetForm).toHaveBeenCalledTimes(0);
            expect(mockDispatch).toHaveBeenCalledTimes(1);
            expect(mockDispatch.mock.calls[0][0].type).toBe("updateWorker");
            jest.runAllTimers();
            expect(mockUpdateLoading).toHaveBeenCalledTimes(2);
            expect(mockUpdateLoading.mock.calls[0][0]).toEqual({
              overlayMessage: "Updating user: Faith Cuneo",
              saveStatus: "saving",
              saveUser: true
            });
            expect(mockUpdateLoading.mock.calls[1][0]).toEqual({
              overlayMessage: "The following errors occurred: Failed to refresh Calabrio state, please refresh Triton Admin",
              saveStatus: "partial fail",
              saveUser: true
            });
          });
        });
      });
      describe("calabrioUser is not updated", () => {
        const form = {
          ...validFormState,
          formMode: formModes.UPDATE
        };
        beforeEach(() => {
          useFormState.mockReturnValue(form);
          updateUser.mockResolvedValue("yay!");
        });
        test("setForm should not be called", async () => {
          renderComponent(true);
          render(Tooltip.mock.calls[0][0].children);
          act(() => {
            const onClick = StyledButton.mock.calls[1][0].onClick;
            onClick();
          });
          await waitFor(() => {
            expect(checkConflictingUsers).toHaveBeenCalledTimes(0);
            expect(updateCalabrioUser).toHaveBeenCalledTimes(0);
            expect(createCalabrioUser).toHaveBeenCalledTimes(0);
            expect(getCalabrioUsers).toHaveBeenCalledTimes(0);
            expect(mockSetForm).toHaveBeenCalledTimes(1);
            expect(mockDispatch).toHaveBeenCalledTimes(1);
            expect(mockDispatch.mock.calls[0][0].type).toBe("updateWorker");
            jest.runAllTimers();
            expect(mockUpdateLoading).toHaveBeenCalledTimes(3);
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
            expect(mockUpdateLoading.mock.calls[2][0]).toEqual({
              saveUser: false
            });
          });
        });
      });
      describe("calabrio wfm user is added", () => {
        const form = {
          ...updateFormState,
          calabrio_qm: {
            ...updateFormState.calabrio_qm,
            updated: false
          },
          calabrio_wfm: {
            userFound: true,
            BusinessUnitId: "111",
            EmploymentStartDate: "05/02/1991",
            Roles: [{ Id: "Role1" }],
            EmploymentNumber: "n0263786",
            Email: "faith.cuneo@libertymutual.com",
            PersonSkills: [{
              Id: "2134-5432",
              Name: "CSC Skill"
            }]
          }
        };
        const wfmBody = {
          ...form.calabrio_wfm,
          PersonStartDate: "05/02/1991",
          RoleIds: ["Role1"],
          NNumber: "n0263786",
          ApplicationLogon: "faith.cuneo@libertymutual.com",
          Skills: ["2134-5432"],
          TimeZoneId: 173
        };
        beforeEach(() => {
          createCalabrioWFMPerson.mockResolvedValue({ data: "9dase-Owaaskm" });
          wfmActivateExternalLogon.mockResolvedValue();
          useFormState.mockReturnValue(form);
        });
        describe("environment === production", () => {
          beforeEach(() => {
            env.APP_ENV = "production";
            useAdminState.mockReturnValue({
              calabrioContext: {
                users: [],
                wfmOrg: []
              }
            });
          });
          describe("all wfm calls are successful", () => {
            test("form is updated as successful", async () => {
              renderComponent(true);
              render(Tooltip.mock.calls[0][0].children);
              act(() => {
                const onClick = StyledButton.mock.calls[1][0].onClick;
                onClick();
              });
              await waitFor(() => {
                expect(updateUser).toHaveBeenCalledTimes(1);
                expect(createCalabrioWFMPerson).toHaveBeenCalledWith(wfmBody);
                expect(wfmActivateExternalLogon).toHaveBeenCalled();
                expect(mockDispatch).toHaveBeenCalledTimes(2);
                expect(mockDispatch.mock.calls[0][0]).toEqual({
                  type: "updateWorker",
                  payload: formattedWorker
                });

                expect(mockDispatch.mock.calls[1][0]).toEqual({
                  type: "updateWfmOrg",
                  payload: {
                    org: ["newstateyay!"],
                    errors: []
                  }
                });
                jest.runAllTimers();
                expect(mockUpdateLoading).toHaveBeenCalledTimes(3);
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
                expect(mockUpdateLoading.mock.calls[2][0]).toEqual({
                  saveUser: false
                });
              });
            });
          });
          describe("createCalabrioWFMPerson fails", () => {
            beforeEach(() => {
              createCalabrioWFMPerson.mockRejectedValue({ message: "bummer" });
              useFormState.mockReturnValue(form);
            });
            describe("error is shown on final results", () => {
              test("form is updated as successful", async () => {
                renderComponent(true);
                render(Tooltip.mock.calls[0][0].children);
                act(() => {
                  const onClick = StyledButton.mock.calls[1][0].onClick;
                  onClick();
                });
                await waitFor(() => {
                  expect(updateUser).toHaveBeenCalledTimes(1);
                  expect(createCalabrioWFMPerson).toHaveBeenCalledWith(wfmBody);
                  expect(wfmActivateExternalLogon).not.toHaveBeenCalled();
                  expect(mockDispatch).toHaveBeenCalledTimes(1);
                  expect(mockDispatch.mock.calls[0][0]).toEqual({
                    type: "updateWorker",
                    payload: formattedWorker
                  });
                  jest.runAllTimers();
                  expect(mockUpdateLoading).toHaveBeenCalledTimes(2);
                  expect(mockUpdateLoading.mock.calls[0][0]).toEqual({
                    overlayMessage: "Updating user: Faith Cuneo",
                    saveStatus: "saving",
                    saveUser: true
                  });
                  expect(mockUpdateLoading.mock.calls[1][0]).toEqual({
                    overlayMessage: "The following errors occurred: Failed to create WFM User. bummer",
                    saveStatus: "partial fail",
                    saveUser: true
                  });
                });
              });
            });
          });
          describe("wfmActivateExternalLogon fails", () => {
            beforeEach(() => {
              createCalabrioWFMPerson.mockResolvedValue({ data: "9dase-Owaaskm" });
              wfmActivateExternalLogon.mockRejectedValue({ message: "bummer" });
              useFormState.mockReturnValue(form);
            });
            describe("error is shown on final results", () => {
              test("form is updated as successful", async () => {
                renderComponent(true);
                render(Tooltip.mock.calls[0][0].children);
                act(() => {
                  const onClick = StyledButton.mock.calls[1][0].onClick;
                  onClick();
                });
                await waitFor(() => {
                  expect(updateUser).toHaveBeenCalledTimes(1);
                  expect(createCalabrioWFMPerson).toHaveBeenCalledWith(wfmBody);
                  expect(wfmActivateExternalLogon).toHaveBeenCalled();
                  expect(mockDispatch).toHaveBeenCalledTimes(2);
                  expect(mockDispatch.mock.calls[0][0]).toEqual({
                    type: "updateWorker",
                    payload: formattedWorker
                  });
                  expect(mockDispatch.mock.calls[1][0]).toEqual({
                    type: "updateWfmOrg",
                    payload: {
                      org: ["newstateyay!"],
                      errors: []
                    }
                  });
                  jest.runAllTimers();
                  expect(mockUpdateLoading).toHaveBeenCalledTimes(2);
                  expect(mockUpdateLoading.mock.calls[0][0]).toEqual({
                    overlayMessage: "Updating user: Faith Cuneo",
                    saveStatus: "saving",
                    saveUser: true
                  });
                  expect(mockUpdateLoading.mock.calls[1][0]).toEqual({
                    overlayMessage: "The following errors occurred: Failed to activate WFM External Logon. bummer",
                    saveStatus: "partial fail",
                    saveUser: true
                  });
                });
              });
            });
          });
        });
        describe("environment !== production", () => {
          test("wfm calls are not made", async () => {
            renderComponent(true);
            render(Tooltip.mock.calls[0][0].children);
            act(() => {
              const onClick = StyledButton.mock.calls[1][0].onClick;
              onClick();
            });
            await waitFor(() => {
              expect(updateUser).toHaveBeenCalledTimes(1);
              expect(createCalabrioWFMPerson).not.toHaveBeenCalled();
              expect(wfmActivateExternalLogon).not.toHaveBeenCalled();
              expect(mockDispatch).toHaveBeenCalledTimes(1);
              expect(mockDispatch.mock.calls[0][0]).toEqual({
                type: "updateWorker",
                payload: formattedWorker
              });
              jest.runAllTimers();
              expect(mockUpdateLoading).toHaveBeenCalledTimes(2);
              expect(mockUpdateLoading.mock.calls[0][0]).toEqual({
                overlayMessage: "Updating user: Faith Cuneo",
                saveStatus: "saving",
                saveUser: true
              });
              expect(mockUpdateLoading.mock.calls[1][0]).toEqual({
                overlayMessage: "The following errors occurred: WFM does not have a non prod environment. WFM form entries were disregarded.",
                saveStatus: "partial fail",
                saveUser: true
              });
            });
          });
        });
      });
    });
  });
  describe("Missing fields were detected", () => {
    const form = {
      ...validFormState,
      triton: {
        ...validFormState.triton,
        directDialNum: {
          ...validFormState.triton.directDialNum,
          value: ""
        }
      }
    };
    beforeEach(() => {
      useFormState.mockReturnValue(form);
      identifyFormErrors.mockReturnValue(["QM Team"]);
    });
    test("should call setMissingFields", async () => {
      render(
        <UserFormButtons
          handleClose={mockHandleClose}
          loading={""}
          updateLoading={mockUpdateLoading}
          profiles={profileList}
          offices={officeMap}
          worker={worker}
          forwardToToggle={true}
          setMissingFields={mockSetMissingFields}
        />,
        initialTestState
      );
      render(Tooltip.mock.calls[0][0].children);
      act(() => {
        const onClick = StyledButton.mock.calls[2][0].onClick;
        onClick();
      });
      await waitFor(() => {
        expect(createUser).toHaveBeenCalledTimes(0);
        expect(checkConflictingUsers).toHaveBeenCalledTimes(0);
        expect(createCalabrioUser).toHaveBeenCalledTimes(0);
        expect(getCalabrioUsers).toHaveBeenCalledTimes(0);
        expect(wfmActivateExternalLogon).toHaveBeenCalledTimes(0);
        expect(createCalabrioWFMPerson).toHaveBeenCalledTimes(0);
        expect(mockDispatch).toHaveBeenCalledTimes(0);
        expect(mockSetForm).toHaveBeenCalledTimes(0);
        expect(mockSetMissingFields).toHaveBeenCalledTimes(1);
        expect(mockSetMissingFields).toHaveBeenCalledWith(["QM Team"]);
      });
    });
  });
  describe("Clear Button", () => {
    beforeEach(() => {
      useFormState.mockReturnValue(validFormState);
    });
    test("When the Close Button is clicked, handleClose and setForm should be called", () => {
      renderComponent(true);
      act(() => {
        const onClick = StyledButton.mock.calls[1][0].onClick;
        onClick();
      });
      expect(mockSetForm).toHaveBeenCalledTimes(3);
      expect(mockSetForm).toHaveBeenCalledWith({
        type: "RESET_FORM"
      });
      expect(mockSetForm).toHaveBeenCalledWith({
        type: "UPDATE_USER_FOUND",
        payload: {
          system: "triton",
          isFound: true
        }
      });
      expect(mockSetForm).toHaveBeenCalledWith({
        type: "UPDATE_USER_FOUND",
        payload: {
          system: "calabrio_qm",
          isFound: true
        }
      });
    });
  });
  describe("Close Button", () => {
    beforeEach(() => {
      isDidDifferentValid.mockReturnValue(true);
      isTritonUserValid.mockReturnValue(true);
      useFormState.mockReturnValue(validFormState);
    });
    test("When the Close Button is clicked, handleClose and setForm should be called", () => {
      renderComponent(true);
      act(() => {
        const onClick = StyledButton.mock.calls[0][0].onClick;
        onClick();
      });
      expect(mockHandleClose).toHaveBeenCalledTimes(1);
    });
  });
});