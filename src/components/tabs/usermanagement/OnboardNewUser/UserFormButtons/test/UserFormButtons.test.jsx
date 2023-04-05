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
  discrepancyType,
  formModes
} from "globals";
import React from "react";
import {
  addOffice,
  createCalabrioUser,
  createUser,
  fetchUser,
  getCalabrioUsers,
  updateCalabrioUser,
  updateUser
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
  checkConflictingUsers,
  getOverflowSkillFromProfile,
  getNonOverflowSkills,
  isDidDifferentValid,
  isFormUpdated,
  isFormValid,
  mapWorkerFromDbWorker,
  workerHasOverFlowSkill
} from "utils";

jest.useFakeTimers();

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
  calabrioTimeZones: jest.requireActual("utils").calabrioTimeZones,
  checkConflictingUsers: jest.fn(),
  isFormValid: jest.fn(),
  isFormUpdated: jest.fn(),
  isDidDifferentValid: jest.fn(),
  getOverflowSkillFromProfile: jest.fn(),
  mapWorkerFromDbWorker: jest.fn(),
  wait: jest.requireActual("utils").wait,
  workerHasOverFlowSkill: jest.fn(),
  getNonOverflowSkills: jest.fn(),
  getValidSkillsObject: jest.fn(),
  formatE164PhoneNumber: jest.fn(),
  getZeroOutEnabledFromProfile: jest.fn()
}));

export const worker = {
  attributes: {
    full_name: "Faith Cuneo",
    office_location_name: "Uranus",
    profile_id: 15
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
  unique_id: validFormOptions.nNumber.toLowerCase()
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

describe("<UserFormButtons />", () => {
  beforeEach(() => {
    addOffice.mockResolvedValue("Override me later");
    jest.clearAllMocks();
    useFormDispatch.mockReturnValue(mockSetForm);
    getOverflowSkillFromProfile.mockReturnValue("466");
    useAdminDispatch.mockReturnValue(mockDispatch);
    useAdminState.mockReturnValue({
      calabrioContext: {
        users: []
      }
    });
    mapWorkerFromDbWorker.mockReturnValue(formattedWorker);
    checkConflictingUsers.mockResolvedValue({ yay: "woot!" });
    createCalabrioUser.mockResolvedValue({ yay: "woot!" });
    fetchUser.mockResolvedValue({ yay: "woot!" });
    getCalabrioUsers.mockResolvedValue({ data: "yay!" });
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
      />,
      initialTestState
    );
  };

  describe("Tooltip Toggle", () => {
    describe("form.didUser === true", () => {
      const form = {
        ...initialFormState,
        didUser: true
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
        managerValue: validFormState.manager.value,
        outgoing: {
          value: validFormState.outgoing.value,
          e164: validFormState.outgoing.e164
        },
        profileIdValue: validFormState.profileId.value,
        didUser: false
      }
    };

    describe(`form.formMode === ${formModes.INSERT}`, () => {
      beforeEach(() => {
        isDidDifferentValid.mockReturnValue(true);
        isFormValid.mockReturnValue(true);
        createUser.mockResolvedValue(rawDbWorker);
        addOffice.mockResolvedValue("yay!");
        useFormState.mockReturnValue(validFormState);
        checkConflictingUsers.mockResolvedValue("Yay!");
        updateCalabrioUser.mockResolvedValue("yay!");
        getCalabrioUsers.mockResolvedValue({ data: ["agent1", "agent2"]});
      });

      describe("Initial State", () => {
        test("UserFormButton should be called 'Add User'", () => {
          renderComponent(true);
          render(Tooltip.mock.calls[0][0].children);
          expect(StyledButton.mock.calls[2][0].children).toBe("Add User");
        });
        test("When form is valid, Add User Button is enabled", () => {
          isFormValid.mockReturnValue(true);
          renderComponent(true);
          render(Tooltip.mock.calls[0][0].children);
          expect(StyledButton.mock.calls[2][0].disabled).toBe(false);
        });
        test("When form is invalid, Add User Button is disabled", () => {
          isFormValid.mockReturnValue(false);
          renderComponent(true);
          render(Tooltip.mock.calls[0][0].children);
          expect(StyledButton.mock.calls[2][0].disabled).toBe(true);
        });
      });
      describe("createUser service call, add office service call, and createCalabruioUser service call are successful", () => {
        describe("Worker is not a DID user", () => {
          const createWorkerAttributesAfterFormValid = workerAttributesAfterFormValid;
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
            didUser: true
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
                alternateDid: validFormState.alternateDid.e164,
                directDialNum: validFormState.directDialNum.e164,
                zeroOutEnabled: validFormState.zeroOutEnabled,
                selfServiceInd: validFormState.selfServiceInd,
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
            zeroOutEnabled: true,
            selfServiceInd: true
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
                    levels: {},
                    skills: [
                      "466"
                    ]
                  }
                },
                alternateDid: validFormState.alternateDid.e164,
                directDialNum: validFormState.directDialNum.e164,
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
                      levels: {},
                      skills: [
                        "466"
                      ]
                    }
                  },
                  alternateDid: validFormState.alternateDid.e164,
                  directDialNum: validFormState.directDialNum.e164,
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
            directDialNum: {
              ...validFormState.directDialNum,
              value: ""
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
          directDialNum: {
            ...validFormState.directDialNum,
            value: ""
          }
        };
        beforeEach(() => {
          checkConflictingUsers.mockRejectedValue({ aww: "bummer" });
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
              overlayMessage: "Triton User Created. Error Creating Calabrio User",
              saveStatus: "partial fail",
              saveUser: true
            });
          });
        });
      });
      describe("createCalabrioUser fails", () => {
        const nonDidValidFormState = {
          ...validFormState,
          directDialNum: {
            ...validFormState.directDialNum,
            value: ""
          }
        };
        beforeEach(() => {
          useFormState.mockReturnValue(nonDidValidFormState);
          checkConflictingUsers.mockResolvedValue("yay");
          createCalabrioUser.mockRejectedValue({ aww: "bummer" });
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
              overlayMessage: "Triton User Created. Error Creating Calabrio User",
              saveStatus: "partial fail",
              saveUser: true
            });
          });
        });
      });
      describe("getCalabrioUsers fails", () => {
        const nonDidValidFormState = {
          ...validFormState,
          directDialNum: {
            ...validFormState.directDialNum,
            value: ""
          }
        };
        beforeEach(() => {
          useFormState.mockReturnValue(nonDidValidFormState);
          getCalabrioUsers.mockRejectedValue({ aww: "bummer" });
        });
        test("setForm should not be called", async () => {
          renderComponent(true);
          render(Tooltip.mock.calls[0][0].children);
          act(() => {
            const onClick = StyledButton.mock.calls[2][0].onClick;
            onClick();
          });
          await waitFor(() => {
            expect(mockSetForm).toHaveBeenCalledTimes(2);
            expect(mockDispatch).toBeCalledTimes(2);
            expect(mockDispatch.mock.calls[0][0].type).toBe("addWorkers");
            expect(mockDispatch.mock.calls[1][0].type).toBe("addOffice");
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
    describe(`form.formMode === ${formModes.UPDATE}`, () => {
      const updateFormState = {
        ...validFormState,
        formMode: formModes.UPDATE,
        calabrioUser: {
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
      describe("nNumberFetchedUser is null", () => {
        const updateFormState = {
          ...validFormState,
          formMode: formModes.UPDATE,
          nNumberFetchedUser: null
        };
        describe("fetchUser throws an error", () => {
          beforeEach(() => {
            useFormState.mockReturnValue(updateFormState);
            fetchUser.mockRejectedValue({ boo: "aww" });
          });
          test("Error is caught and logged", async () => {
            renderComponent(true);
            expect(fetchUser).toBeCalledTimes(1);
            await waitFor(() => {
              expect(mockSetForm).toHaveBeenCalledTimes(0);
            });
          });
        });
        describe("fetchUser is Successful", () => {
          beforeEach(() => {
            useFormState.mockReturnValue(updateFormState);
          });
          describe("email matches existing user", () => {
            const sameEmailUser = {
              email: "faith.cuneo@libertymutual.com"
            };
            beforeEach(() => {
              fetchUser.mockResolvedValue(sameEmailUser);
            });
            test("fetchUser is run on render and mockSetForm is called once", async () => {
              renderComponent(true, {
                ...worker,
                attributes: {
                  ...worker.attributes,
                  email: "Faith.Cuneo@libertymutual.com"
                }
              });
              expect(fetchUser).toBeCalledTimes(1);
              await waitFor(() => {
                expect(mockSetForm).toBeCalledTimes(1);
                expect(mockSetForm).toBeCalledWith({
                  type: "COMPLETE_N_NUMBER",
                  payload: {
                    fetchedUser: {
                      email: "faith.cuneo@libertymutual.com"
                    },
                    nNumber: "n1234567"
                  }
                });
              });
            });
          });
          describe("email does not match existing user", () => {
            const differentEmailUser = {
              email: "faith.cuneo@safeco.com"
            };
            beforeEach(() => {
              fetchUser.mockResolvedValue(differentEmailUser);
            });
            test("fetchUser is run on render and mockSetForm is called twice", async () => {
              renderComponent(true);
              expect(fetchUser).toBeCalledTimes(1);
              await waitFor(() => {
                expect(mockSetForm).toBeCalledTimes(2);
                expect(mockSetForm).toBeCalledWith({
                  type: "COMPLETE_N_NUMBER",
                  payload: {
                    fetchedUser: {
                      email: "faith.cuneo@safeco.com"
                    },
                    nNumber: "n1234567"
                  }
                });
                expect(mockSetForm).toBeCalledWith({
                  type: "SET_DISCREPANCIES",
                  payload: {
                    type: discrepancyType.CALABRIO,
                    message: "Triton email does not match HR email."
                  }
                });
              });
            });
          });
        });
      });
      describe("Initial State", () => {
        test("UserFormButton should be called 'Save User'", () => {
          renderComponent(true);
          render(Tooltip.mock.calls[0][0].children);
          expect(StyledButton.mock.calls[2][0].children).toBe("Save User");
        });
        test("When form is valid, Add Save Button is enabled", () => {
          isFormValid.mockReturnValue(true);
          renderComponent(true);
          render(Tooltip.mock.calls[0][0].children);
          expect(StyledButton.mock.calls[2][0].disabled).toBe(false);
        });
        test("When form is invalid, Add Save Button is disabled", () => {
          isFormValid.mockReturnValue(false);
          renderComponent(true);
          render(Tooltip.mock.calls[0][0].children);
          expect(StyledButton.mock.calls[2][0].disabled).toBe(true);
        });
      });
      describe("updateUser service call, add office service call, and createCalabrioUser service call are successful", () => {
        describe("Worker is not a DID user", () => {
          const nonDidValidFormState = {
            ...updateFormState,
            calabrioUser: {
              updated: true,
              id: 1
            },
            directDialNum: {
              ...updateFormState.directDialNum,
              value: "",
              updated: false
            },
            zeroOutEnabled: true,
            selfServiceInd: false
          };
          beforeEach(() => {
            updateUser.mockResolvedValue(rawDbWorker);
            fetchUser.mockResolvedValue(fetchedUser);
            useFormState.mockReturnValue(nonDidValidFormState);
          });
          test("should save user with non did worker request body when clicked", async () => {
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
              email: "test@abc.com",
              email_address: "test@abc.com",
              emp_first_name: "Frank",
              emp_last_name: "Rizzo",
              full_name: "Frank Rizzo",
              department_id: validFormState.nNumberFetchedUser.departmentNumber,
              department_name: validFormState.nNumberFetchedUser.departmentName,
              extension: validFormOptions.extension,
              location: validFormState.nNumberFetchedUser.departmentName,
              manager_first_name: validFormOptions.manager.manager_first_name,
              manager_last_name: validFormOptions.manager.manager_last_name,
              manager_n_number: validFormOptions.manager.manager_n_number,
              manager: `${validFormOptions.manager.manager_first_name} ${validFormOptions.manager.manager_last_name}`,
              profile_id: validFormOptions.profileId,
              routing: {
                skills: ["nonSkillL1","466"],
                levels: []
              }
            };
            renderComponent(true, updateWorker);
            render(Tooltip.mock.calls[0][0].children);
            act(() => {
              const onClick = StyledButton.mock.calls[2][0].onClick;
              onClick();
            });
            await waitFor(() => {
              expect(updateUser).toHaveBeenCalledWith(worker.sid, {
                alternateDid: updateFormState.alternateDid.e164,
                attributes: updateWorkerAttributesAfterFormValid,
                operatingUnitSid: validOperatingUnitId,
                zeroOutEnabled: true,
                selfServiceInd: false
              });
              expect(checkConflictingUsers).toBeCalledTimes(1);
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
              skills: ["nonSkillL1"],
              levels: []
            }
          };
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
          beforeEach(() => {
            updateUser.mockResolvedValue(rawDbWorker);
            workerHasOverFlowSkill.mockReturnValue(true);
            useFormState.mockReturnValue(updateFormState);
          });
          test("should save user with did worker request body when clicked", async () => {
            renderComponent(true, updateWorker);
            render(Tooltip.mock.calls[0][0].children);
            act(() => {
              const onClick = StyledButton.mock.calls[2][0].onClick;
              onClick();
            });
            await waitFor(() => {
              expect(updateUser).toHaveBeenCalledWith(worker.sid, {
                activateEp: true, // true for DID workers
                attributes: updateWorkerAttributesAfterFormValid,
                alternateDid: validFormState.alternateDid.e164,
                directDialNum: validFormState.directDialNum.e164,
                zeroOutEnabled: validFormState.zeroOutEnabled,
                selfServiceInd: validFormState.selfServiceInd,
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
                const onClick = StyledButton.mock.calls[2][0].onClick;
                onClick();
              });
              await waitFor(() => {
                expect(updateUser).toHaveBeenCalledWith(worker.sid, {
                  activateEp: true, // true for DID workers
                  attributes: {
                    ...updateWorkerAttributesAfterFormValid,
                    routing: {
                      ...updateWorkerAttributesAfterFormValid.routing,
                      skills: []
                    },
                    email: "test@abc.com",
                    email_address: "test@abc.com",
                    emp_first_name: "Frank",
                    emp_last_name: "Rizzo",
                    full_name: "Frank Rizzo"
                  },
                  alternateDid: validFormState.alternateDid.e164,
                  directDialNum: validFormState.directDialNum.e164,
                  zeroOutEnabled: validFormState.zeroOutEnabled,
                  selfServiceInd: validFormState.selfServiceInd,
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
            zeroOutEnabled: true,
            selfServiceInd: true
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
                routing: {
                  skills: ["466"],
                  levels: []
                }
              }
            };
            renderComponent(true, updateWorker);
            render(Tooltip.mock.calls[0][0].children);
            act(() => {
              const onClick = StyledButton.mock.calls[2][0].onClick;
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
              skills: ["nonSkillL1"],
              levels: []
            }
          };
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
          beforeEach(() => {
            updateUser.mockResolvedValue(rawDbWorker);
            workerHasOverFlowSkill.mockReturnValue(true);
            useFormState.mockReturnValue({
              ...updateFormState,
              nNumberFetchedUser: null
            });
          });
          test("should save user with did worker request body when clicked", async () => {
            renderComponent(true, updateWorker);
            render(Tooltip.mock.calls[0][0].children);
            act(() => {
              const onClick = StyledButton.mock.calls[2][0].onClick;
              onClick();
            });
            await waitFor(() => {
              expect(updateUser).toHaveBeenCalledWith(worker.sid, {
                activateEp: true, // true for DID workers
                attributes: updateWorkerAttributesAfterFormValid,
                alternateDid: validFormState.alternateDid.e164,
                directDialNum: validFormState.directDialNum.e164,
                zeroOutEnabled: validFormState.zeroOutEnabled,
                selfServiceInd: validFormState.selfServiceInd,
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
              skills: ["nonSkillL1"],
              levels: []
            }
          };
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
          beforeEach(() => {
            updateUser.mockResolvedValue(rawDbWorker);
            workerHasOverFlowSkill.mockReturnValue(true);
            useFormState.mockReturnValue({
              ...updateFormState,
              nNumberFetchedUser: {
                ...updateFormState.nNumberFetchedUser,
                departmentNumber: null,
                departmentName: null
              }
            });
          });
          test("should save user with did worker request body when clicked", async () => {
            renderComponent(true, updateWorker);
            render(Tooltip.mock.calls[0][0].children);
            act(() => {
              const onClick = StyledButton.mock.calls[2][0].onClick;
              onClick();
            });
            await waitFor(() => {
              expect(updateUser).toHaveBeenCalledWith(worker.sid, {
                activateEp: true, // true for DID workers
                attributes: updateWorkerAttributesAfterFormValid,
                alternateDid: validFormState.alternateDid.e164,
                directDialNum: validFormState.directDialNum.e164,
                zeroOutEnabled: validFormState.zeroOutEnabled,
                selfServiceInd: validFormState.selfServiceInd,
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
          selfServiceInd: false,
          inactiveForwardTo: {
            value: validFormOptions.inactiveForwardTo,
            updated: true
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
          profile_id: validFormOptions.profileId
        };
        beforeEach(() => {
          workerHasOverFlowSkill.mockReturnValue(false);
          useFormState.mockReturnValue(nonDidValidFormState);
          updateUser.mockRejectedValue({
            message: "bummer",
            response: {
              data: {
                message: "Failed to update worker"
              }
            }
          });
        });
        test("should not update user and should update loading with custom error message", async () => {
          renderComponent(true);
          render(Tooltip.mock.calls[0][0].children);
          act(() => {
            const onClick = StyledButton.mock.calls[2][0].onClick;
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
            expect(mockDispatch).toHaveBeenCalledTimes(0);
            jest.runAllTimers();
            expect(mockUpdateLoading).toHaveBeenCalledTimes(2);
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
          });
        });
        test("should not update user and should update loading with generic failed status", async () => {
          updateUser.mockRejectedValue({
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
            expect(updateUser).toHaveBeenCalledWith(worker.sid, {
              zeroOutEnabled: false,
              selfServiceInd: false,
              inactiveForwardTo: validFormOptions.inactiveForwardTo,
              attributes: updateWorkerAttributesAfterFormValid,
              operatingUnitSid: validOperatingUnitId
            });
            expect(mockSetForm).toHaveBeenCalledTimes(0);
            expect(mockDispatch).toHaveBeenCalledTimes(0);
            jest.runAllTimers();
            expect(mockUpdateLoading).toHaveBeenCalledTimes(2);
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
          });
        });
      });
      describe("checkConflictingUsers fails", () => {
        beforeEach(() => {
          updateUser.mockResolvedValue("ysy!");
          checkConflictingUsers.mockRejectedValue({ aww: "bummer" });
        });
        test("updateCalabrioUser should not be called", async () => {
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
              overlayMessage: "Updating user: Faith Cuneo",
              saveStatus: "saving",
              saveUser: true
            });
            expect(mockUpdateLoading.mock.calls[1][0]).toEqual({
              overlayMessage: "Triton User updated. Error updating Calabrio user",
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
          createCalabrioUser.mockRejectedValue({ aww: "bummer" });
        });
        test("setForm should not be called", async () => {
          renderComponent(true);
          render(Tooltip.mock.calls[0][0].children);
          act(() => {
            const onClick = StyledButton.mock.calls[2][0].onClick;
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
              overlayMessage: "Triton user updated.  **Calabrio User Not Updated**  Missing Calabrio profile was not able to be created. To resolve this issue, go into Calabrio and search for this user in the inactive users. Once found, you can re-activate their old profile and come back here, refresh Triton Admin, and update this worker to be accurate. If that does not work, delete and recreate the user.",
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
          calabrioUser: {
            ...validFormState.calabrioUser,
            updated: true,
            id: 2
          }
        };
        beforeEach(() => {
          useFormState.mockReturnValue(form);
          updateUser.mockResolvedValue("yay!");
          checkConflictingUsers.mockResolvedValue("yay");
          updateCalabrioUser.mockRejectedValue({ aww: "bummer" });
        });
        test("setForm should not be called", async () => {
          renderComponent(true);
          render(Tooltip.mock.calls[0][0].children);
          act(() => {
            const onClick = StyledButton.mock.calls[2][0].onClick;
            onClick();
          });
          await waitFor(() => {
            expect(checkConflictingUsers).toHaveBeenCalledTimes(1);
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
              overlayMessage: "Triton user updated. Error updating Calabrio user",
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
          calabrioUser: {
            ...validFormState.calabrioUser,
            updated: true,
            id: 2
          }
        };
        beforeEach(() => {
          useFormState.mockReturnValue(form);
          updateUser.mockResolvedValue("yay!");
          checkConflictingUsers.mockResolvedValue("yay");
          updateCalabrioUser.mockResolvedValue({ data: ["agent1", "agent2"]});
          getCalabrioUsers.mockRejectedValue({ aww: "bummer" });
        });
        test("setForm should not be called", async () => {
          renderComponent(true);
          render(Tooltip.mock.calls[0][0].children);
          act(() => {
            const onClick = StyledButton.mock.calls[2][0].onClick;
            onClick();
          });
          await waitFor(() => {
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
            const onClick = StyledButton.mock.calls[2][0].onClick;
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
      expect(mockHandleClose).toHaveBeenCalledTimes(1);
      //Faith
    });
  });
});