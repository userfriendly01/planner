import UserFormButtons from "../UserFormButtons";
import {
  Modal,
  Tooltip
} from "@material-ui/core";
import {
  MergeUsersModal,
  StyledButton
} from "components";
import {
  useAdminState,
  useAdminDispatch,
  useFormDispatch,
  useFormState,
  userFormActions
} from "context";
import { formModes } from "globals";
import React from "react";
import {
  addOffice,
  createCalabrioUser,
  createUser,
  fetchUser,
  updateUser
} from "services";
import {
  act,
  fetchedUser,
  initialFormState,
  initialTestState,
  mockStore,
  officeMap,
  profileList,
  render,
  setupMockedComponents,
  validFormOptions,
  validFormState,
  waitFor,
  worker
} from "testUtils";
import {
  checkConflictingUsers,
  getOverflowSkillFromProfile,
  getNonOverflowSkills,
  isDidDifferentValid,
  isFormUpdated,
  isFormValid,
  workerHasOverFlowSkill
} from "utils";

jest.useFakeTimers();

jest.mock("components", () => ({
  StyledButton: jest.fn(),
  MergeUsersModal: jest.fn()
}));

jest.mock("@material-ui/core", () => ({
  Tooltip: jest.fn(),
  Tabs: jest.fn(),
  Modal: jest.fn()
}));

jest.mock("context", () => ({
  useAdminState: jest.fn(),
  useAdminDispatch: jest.fn(),
  useFormState: jest.fn(),
  useFormDispatch: jest.fn(),
  userFormActions: jest.requireActual("context").userFormActions
}));

jest.mock("services", () => ({
  addOffice: jest.fn(),
  createUser: jest.fn(),
  fetchUser: jest.fn(),
  updateUser: jest.fn(),
  createCalabrioUser: jest.fn()
}));

jest.mock("utils", () => ({
  checkConflictingUsers: jest.fn(),
  isFormValid: jest.fn(),
  isFormUpdated: jest.fn(),
  isDidDifferentValid: jest.fn(),
  getOverflowSkillFromProfile: jest.fn(),
  mapWorkerFromDbWorker: jest.requireActual("utils").mapWorkerFromDbWorker,
  wait: jest.requireActual("utils").wait,
  workerHasOverFlowSkill: jest.fn(),
  getNonOverflowSkills: jest.fn()
}));

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
  manager: fetchedUser.manager,
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

describe("<UserFormButtons />", () => {

  beforeEach(() => {
    addOffice.mockResolvedValue("Override me later");
    jest.clearAllMocks();
    mockStore.reset();
    getOverflowSkillFromProfile.mockReturnValue("466");
    useFormDispatch.mockReturnValue(mockSetForm);
    useAdminDispatch.mockReturnValue(mockDispatch);
    useAdminState.mockReturnValue({
      calabrioContext: {
        users: []
      }
    });
    checkConflictingUsers.mockResolvedValue({ yay: "woot!" });
    createCalabrioUser.mockResolvedValue({ yay: "woot!" });
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
    // const resetFormAfterAddExpectedAction = {
    //   type: "RESET_FORM_AFTER_ADD",
    //   payload: {
    //     managerValue: validFormState.manager.value,
    //     outgoing: {
    //       value: validFormState.outgoing.value,
    //       e164: validFormState.outgoing.e164
    //     },
    //     profileIdValue: validFormState.profileId.value,
    //     didUser: false
    //   }
    // };

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
              const onClick = StyledButton.mock.calls[1][0].onClick;
              onClick();
            });
            await waitFor(() => {
              expect(createUser).toHaveBeenCalledWith({
                activateEp: false, // false for non-DID workers
                attributes: createWorkerAttributesAfterFormValid
              });
              // expect(mockSetForm).toHaveBeenCalledTimes(2);
              // expect(mockSetForm).toHaveBeenCalledWith(resetFormAfterAddExpectedAction);
              // expect(mockSetForm).toHaveBeenCalledWith( { type: userFormActions.SET_USER_PREVIOUSLY_ADDED_TRUE });
              expect(mockDispatch).toHaveBeenCalledTimes(2);
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
              expect(mockUpdateLoading).toHaveBeenCalledTimes(1);
              expect(mockUpdateLoading.mock.calls[0][0]).toEqual({
                overlayMessage: "Adding new user...",
                saveStatus: "saving",
                saveUser: true
              });
              // expect(mockUpdateLoading.mock.calls[1][0]).toEqual({
              //   overlayMessage: "Successfully added new user",
              //   saveStatus: "success",
              //   saveUser: true
              // });
              // expect(mockUpdateLoading.mock.calls[2][0]).toEqual({
              //   saveUser: false
              // });
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
          const formattedWorker = {
            attributes: {
              ...createWorkerAttributesAfterFormValid,
              office_location_number: "ABC123"
            },
            sid: rawDbWorker.workerSid,
            skillsDifferent: true
          };
          beforeEach(() => {
            useFormState.mockReturnValue({
              ...validFormState,
              didUser: true
            });
            createUser.mockResolvedValue(existingOfficeDbWorker);
          });
          test("should save user with did worker request body when clicked", async () => {
            renderComponent(true);
            render(Tooltip.mock.calls[0][0].children);
            act(() => {
              const onClick = StyledButton.mock.calls[1][0].onClick;
              onClick();
            });
            await waitFor(() => {
              expect(createUser).toHaveBeenCalledWith({
                activateEp: true, // true for DID workers
                attributes: createWorkerAttributesAfterFormValid,
                alternateDid: validFormState.alternateDid.e164,
                directDialNum: validFormState.directDialNum.e164,
                zeroOutEnabled: validFormState.zeroOutEnabled
              });
              // expect(mockSetForm).toHaveBeenCalledTimes(2);
              // expect(mockSetForm).toHaveBeenCalledWith({
              //   ...resetFormAfterAddExpectedAction,
              //   payload: {
              //     ...resetFormAfterAddExpectedAction.payload,
              //     didUser: true
              //   }
              // });
              // expect(mockSetForm).toHaveBeenCalledWith( { type: userFormActions.SET_USER_PREVIOUSLY_ADDED_TRUE });
              expect(mockDispatch).toHaveBeenCalledTimes(1);
              expect(mockDispatch.mock.calls[0][0]).toEqual({
                type: "addWorkers",
                payload: [formattedWorker]
              });
              jest.runAllTimers();
              expect(mockUpdateLoading).toHaveBeenCalledTimes(1);
              expect(mockUpdateLoading.mock.calls[0][0]).toEqual({
                overlayMessage: "Adding new user...",
                saveStatus: "saving",
                saveUser: true
              });
              // expect(mockUpdateLoading.mock.calls[1][0]).toEqual({
              //   overlayMessage: "Successfully added new user",
              //   saveStatus: "success",
              //   saveUser: true
              // });
              // expect(mockUpdateLoading.mock.calls[2][0]).toEqual({
              //   saveUser: false
              // });
            });
          });
        });
        describe("Worker profile has overflowSkill, zeroOutEnabled and directDialNum", () => {
          const createWorkerAttributesAfterFormValid = workerAttributesAfterFormValid;
          beforeEach(() => {
            useFormState.mockReturnValue({
              ...validFormState,
              zeroOutEnabled: true
            });
          });
          test("should include overflow skill and save user with did worker request body when clicked", async () => {
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
                zeroOutEnabled: true
              });
              // expect(mockSetForm).toHaveBeenCalledTimes(2);
              // expect(mockSetForm).toHaveBeenCalledWith(resetFormAfterAddExpectedAction);
              // expect(mockSetForm).toHaveBeenCalledWith( { type: userFormActions.SET_USER_PREVIOUSLY_ADDED_TRUE });
              expect(mockDispatch).toHaveBeenCalledTimes(2);
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
              expect(mockUpdateLoading).toHaveBeenCalledTimes(1);
              expect(mockUpdateLoading.mock.calls[0][0]).toEqual({
                overlayMessage: "Adding new user...",
                saveStatus: "saving",
                saveUser: true
              });
              // expect(mockUpdateLoading.mock.calls[1][0]).toEqual({
              //   overlayMessage: "Successfully added new user",
              //   saveStatus: "success",
              //   saveUser: true
              // });
              // expect(mockUpdateLoading.mock.calls[2][0]).toEqual({
              //   saveUser: false
              // });
            });
          });
          describe("getNonOverflowSkills returns undefined", () => {
            beforeEach(() => {
              getNonOverflowSkills.mockReturnValue(undefined);
            });
            test("Should spread empty array in skills", async () => {
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
                  zeroOutEnabled: true
                });
                // expect(mockSetForm).toHaveBeenCalledTimes(2);
                // expect(mockSetForm).toHaveBeenCalledWith(resetFormAfterAddExpectedAction);
                // expect(mockSetForm).toHaveBeenCalledWith( { type: userFormActions.SET_USER_PREVIOUSLY_ADDED_TRUE });
                expect(mockDispatch).toHaveBeenCalledTimes(2);
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
                expect(mockUpdateLoading).toHaveBeenCalledTimes(1);
                expect(mockUpdateLoading.mock.calls[0][0]).toEqual({
                  overlayMessage: "Adding new user...",
                  saveStatus: "saving",
                  saveUser: true
                });
                // expect(mockUpdateLoading.mock.calls[1][0]).toEqual({
                //   overlayMessage: "Successfully added new user",
                //   saveStatus: "success",
                //   saveUser: true
                // });
                // expect(mockUpdateLoading.mock.calls[2][0]).toEqual({
                //   saveUser: false
                // });
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
            useFormState.mockReturnValue(nonDidValidFormState);
            addOffice.mockRejectedValue({ aww: "bummer" });
          });
          test("should not dispatch AddOffice but should still enable Add User button and save user when clicked", async () => {
            renderComponent(true);
            render(Tooltip.mock.calls[0][0].children);
            act(() => {
              const onClick = StyledButton.mock.calls[1][0].onClick;
              onClick();
            });
            await waitFor(() => {
              expect(createUser).toHaveBeenCalledWith({
                activateEp: false, // false for non-DID workers
                attributes: createWorkerAttributesAfterFormValid
              });
              // expect(mockSetForm).toHaveBeenCalledTimes(2);
              // expect(mockSetForm).toHaveBeenCalledWith(resetFormAfterAddExpectedAction);
              // expect(mockSetForm).toHaveBeenCalledWith( { type: userFormActions.SET_USER_PREVIOUSLY_ADDED_TRUE });
              expect(mockDispatch).toHaveBeenCalledTimes(1);
              expect(mockDispatch.mock.calls[0][0]).toEqual({
                type: "addWorkers",
                payload: [formattedWorker]
              });
              jest.runAllTimers();
              expect(mockUpdateLoading).toHaveBeenCalledTimes(1);
              expect(mockUpdateLoading.mock.calls[0][0]).toEqual({
                overlayMessage: "Adding new user...",
                saveStatus: "saving",
                saveUser: true
              });
              // expect(mockUpdateLoading.mock.calls[1][0]).toEqual({
              //   overlayMessage: "Successfully added new user",
              //   saveStatus: "success",
              //   saveUser: true
              // });
              // expect(mockUpdateLoading.mock.calls[2][0]).toEqual({
              //   saveUser: false
              // });
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
          test("should not add user and should update loading with failed specific error message", async () => {
            renderComponent(true);
            render(Tooltip.mock.calls[0][0].children);
            act(() => {
              const onClick = StyledButton.mock.calls[1][0].onClick;
              onClick();
            });
            await waitFor(() => {
              expect(createUser).toHaveBeenCalledWith({
                activateEp: false, // false for non-DID workers
                attributes: createWorkerAttributesAfterFormValid
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
              const onClick = StyledButton.mock.calls[1][0].onClick;
              onClick();
            });
            await waitFor(() => {
              expect(createUser).toHaveBeenCalledWith({
                activateEp: false, // false for non-DID workers
                attributes: createWorkerAttributesAfterFormValid
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
            fetchUser.mockResolvedValue(fetchedUser);

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
              const onClick = StyledButton.mock.calls[1][0].onClick;
              onClick();
            });
            await waitFor(() => {
              expect(updateUser).toHaveBeenCalledWith(worker.sid, {
                alternateDid: updateFormState.alternateDid.e164,
                attributes: updateWorkerAttributesAfterFormValid,
                zeroOutEnabled: true
              });
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
                overlayMessage: "Successfully updated user: Faith Cuneo",
                saveStatus: "success",
                saveUser: true
              });
              expect(mockHandleClose).toHaveBeenCalledTimes(1);
            });
          });
        });
        describe("Worker is a DID user", () => {
          const updateWorkerAttributesAfterFormValid = {
            default_skills: validFormOptions.defaultSkills,
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
            useFormState.mockReturnValue(updateFormState);
            updateUser.mockResolvedValue(rawDbWorker);
            workerHasOverFlowSkill.mockReturnValue(true);
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
                alternateDid: validFormState.alternateDid.e164,
                directDialNum: validFormState.directDialNum.e164,
                zeroOutEnabled: validFormState.zeroOutEnabled
              });
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
                overlayMessage: "Successfully updated user: Faith Cuneo",
                saveStatus: "success",
                saveUser: true
              });
            });
          });
          describe("getNonOverflowSkills returns undefined", () => {
            beforeEach(() => {
              getNonOverflowSkills.mockReturnValue(undefined);
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
                      ...updateWorkerAttributesAfterFormValid.routing,
                      skills: []
                    }
                  },
                  alternateDid: validFormState.alternateDid.e164,
                  directDialNum: validFormState.directDialNum.e164,
                  zeroOutEnabled: validFormState.zeroOutEnabled
                });
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
                  overlayMessage: "Successfully updated user: Faith Cuneo",
                  saveStatus: "success",
                  saveUser: true
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
            zeroOutEnabled: true
          };
          beforeEach(() => {
            useFormState.mockReturnValue(unchangedForm);
            updateUser.mockResolvedValue(rawDbWorker);
            workerHasOverFlowSkill.mockReturnValue(true);
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
              const onClick = StyledButton.mock.calls[1][0].onClick;
              onClick();
            });
            await waitFor(() => {
              expect(updateUser).toHaveBeenCalledWith(worker.sid, {
                attributes: {
                  department_id: fetchedUser.departmentNumber,
                  department_name: fetchedUser.departmentName,
                  location: fetchedUser.departmentName
                },
                zeroOutEnabled: true
              });
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
                overlayMessage: "Successfully updated user: Faith Cuneo",
                saveStatus: "success",
                saveUser: true
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
          extension: validFormOptions.extension,
          location: validFormOptions.nNumberFetchedUser.departmentName,
          manager_first_name: validFormOptions.manager.manager_first_name,
          manager_last_name: validFormOptions.manager.manager_last_name,
          manager_n_number: validFormOptions.manager.manager_n_number,
          manager: `${validFormOptions.manager.manager_first_name} ${validFormOptions.manager.manager_last_name}`,
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
        test("should not update user and should update loading with custom error message", async () => {
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
            const onClick = StyledButton.mock.calls[1][0].onClick;
            onClick();
          });
          await waitFor(() => {
            expect(updateUser).toHaveBeenCalledWith(worker.sid, {
              zeroOutEnabled: false,
              inactiveForwardTo: validFormOptions.inactiveForwardTo,
              attributes: updateWorkerAttributesAfterFormValid
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
      expect(mockHandleClose).toHaveBeenCalledTimes(1);
      expect(mockSetForm).toHaveBeenCalledTimes(1);
      expect(mockSetForm).toHaveBeenCalledWith({ type: userFormActions.RESET_FORM });
    });
  });
});