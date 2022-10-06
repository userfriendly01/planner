import BasicFormInfo from "../BasicFormInfo";
import {
  InputAdornment,
  Switch,
  Tooltip
} from "@mui/material";
import { Edit } from "@mui/icons-material";
import {
  ForwardToEntryForm,
  ModalExtension,
  ModalNNumber,
  ModalPhoneNumber,
  Dropdown,
  DidFormInfo,
  ExtensionButtonWrapper,
  UserFormButton
} from "components";
import {
  useFormDispatch,
  useFormState,
  userFormActions
} from "context";
import { formModes } from "globals";
import React from "react";
import {
  act,
  expectMockedComponent,
  expectOnlyPassedProps,
  initialFormState,
  initialTestState,
  managerList,
  mockSkills,
  mockStore,
  mockWorkers,
  profileList,
  render,
  setupMockedComponents
} from "testUtils";
import {
  getOverflowSkillFromProfile,
  removeProfileZeroIfAdminNotInProfileZero,
  isExtensionValid,
  isProfileIdValid,
  isManagerValid
} from "utils";
import { ExtensionSearchStatuses } from "../UserEntryForm.Interfaces";
import { StyledButton } from "components";
import { checkExtension } from "services";

jest.useFakeTimers();

jest.mock("components", () => ({
  __esModule: true,
  DidFormInfo: jest.fn(),
  ModalExtension: jest.fn(),
  ModalNNumber: jest.fn(),
  ModalPhoneNumber: jest.fn(),
  Dropdown: jest.fn(),
  PaperContainer: jest.fn(),
  StyledButton: jest.fn(),
  ForwardToEntryForm: jest.fn(),
  ExtensionButtonWrapper: jest.fn(),
  UserFormButton: jest.fn()
}));


jest.mock("@mui/material", () => ({
  __esModule: true,
  InputAdornment: jest.fn(),
  Tabs: jest.fn(),
  Switch: jest.fn(),
  Tooltip: jest.fn()
}));

jest.mock("@mui/icons-material", () => ({
  __esModule: true,
  Edit: jest.fn()
}));

jest.mock("context", () => ({
  __esModule: true,
  useFormState: jest.fn(),
  useAdminState: jest.fn(),
  useFormDispatch: jest.fn(),
  userFormActions: jest.requireActual("context").userFormActions
}));

jest.mock("utils", () => ({
  __esModule: true,
  isExtensionValid: jest.fn(),
  isManagerValid: jest.fn(),
  isProfileIdValid: jest.fn(),
  sortProfilesByName: jest.requireActual("utils").sortProfilesByName,
  sortManagersByName: jest.fn("utils").sortManagersByName,
  getOverflowSkillFromProfile: jest.fn(),
  removeProfileZeroIfAdminNotInProfileZero: jest.fn()
}));

jest.mock("globals", () => ({
  __esModule: true,
  extensionMatcher: {
    test: jest.fn()
  },
  formModes: jest.requireActual("globals").formModes
}));

const mockSetForm = jest.fn();

const mockSetForwardToToggle = jest.fn();

describe("<BasicFormInfo />", () => {

  beforeEach(() => {
    jest.clearAllMocks();
    mockStore.reset();
    useFormDispatch.mockReturnValue(mockSetForm);
    getOverflowSkillFromProfile.mockReturnValue("466");
    useFormState.mockReturnValue(initialFormState);
    setupMockedComponents({
      DidFormInfo,
      ModalExtension,
      ModalNNumber,
      ModalPhoneNumber,
      Dropdown,
      ForwardToEntryForm,
      InputAdornment,
      Edit,
      Switch,
      Tooltip,
      ExtensionButtonWrapper,
      UserFormButton,
      StyledButton
    });
  });

  const renderComponent = forwardToToggle => {
    return render(
      <BasicFormInfo
        skills={mockSkills}
        worker={mockWorkers[2]}
        workers={mockWorkers}
        profiles={profileList}
        managers={managerList}
        forwardToToggle={forwardToToggle}
        setForwardToToggle={mockSetForwardToToggle}
      />,
      initialTestState
    );
  };

  const renderChildComponents = () => {
    const didToolTip = Tooltip.mock.calls[0][0];
    render(didToolTip.children);
    const overFlowToolTip = Tooltip.mock.calls[1][0];
    render(overFlowToolTip.children);
  };

  describe("Manager dropdown", () => {
    test("Should render the correct initial state", () => {
      const rendered = renderComponent(false);
      expectMockedComponent(rendered, { Dropdown }, 2);
      const expectedManagerProps = {
        label: "Manager *",
        options: managerList.map(manager => ({
          label: `${manager.manager_first_name} ${manager.manager_last_name} - ${manager.manager_n_number}`,
          value: manager.manager_n_number,
          ...manager
        })),
        value: "",
        error: false
      };
      expectOnlyPassedProps(Dropdown, expectedManagerProps, 0);
    });
    describe("options is not an object", () => {
      test("should return empty string", () => {
        const rendered = render(
          <BasicFormInfo
            skills={mockSkills}
            worker={mockWorkers[2]}
            workers={mockWorkers}
            profiles={profileList}
            managers={["option"]}
            forwardToToggle={false}
            setForwardToToggle={mockSetForwardToToggle}
          />,
          initialTestState
        );
        expectMockedComponent(rendered, { Dropdown }, 2);
        const expectedManagerProps = {
          label: "Manager *",
          options: [""],
          value: "",
          error: false
        };
        expectOnlyPassedProps(Dropdown, expectedManagerProps, 0);
      });
    });
    describe("manager field is invalid", () => {
      test("error field should be true", () => {
        useFormState.mockReturnValue({
          ...initialFormState,
          manager: {
            ...initialFormState.manager,
            blurred: true
          }
        });
        isManagerValid.mockReturnValue(false);
        renderComponent(false);
        expect(Dropdown.mock.calls[0][0].error).toBe(true);
      });
    });
    test("onBlur - invalid manager should set blur on field", () => {
      renderComponent(false);
      act(() => {
        const onBlur = Dropdown.mock.calls[0][0].onBlur;
        onBlur();
      });
      expect(mockSetForm).toBeCalledWith({
        type: userFormActions.SET_BLUR_ON_FIELD,
        payload: "manager"
      });
    });
    test("onBlur - valid manager should not set blur on field", () => {
      useFormState.mockReturnValue({
        ...initialFormState,
        manager: {
          ...initialFormState.manager,
          valid: true
        }
      });
      renderComponent(false);
      act(() => {
        const onBlur = Dropdown.mock.calls[0][0].onBlur;
        onBlur();
      });
      expect(mockSetForm).toBeCalledTimes(0);
    });
    test("updateValue - should set manager and team to correct value", () => {
      renderComponent(false);
      act(() => {
        const updateValue = Dropdown.mock.calls[0][0].updateValue;
        updateValue(null, managerList[0]);
      });
      expect(mockSetForm).toBeCalledWith({
        type: userFormActions.UPDATE_MANAGER,
        payload: managerList[0]
      });
      expect(mockSetForm).toBeCalledWith({
        type: userFormActions.UPDATE_TEAM,
        payload: {
          profileId: managerList[0].profile_id,
          profiles: profileList
        }
      });
    });
    test("updateValue - should set manager to correct value and reset team", () => {
      renderComponent(false);
      act(() => {
        const updateValue = Dropdown.mock.calls[0][0].updateValue;
        updateValue(null, managerList[1]);
      });
      expect(mockSetForm).toBeCalledWith({
        type: userFormActions.UPDATE_MANAGER,
        payload: managerList[1]
      });
      expect(mockSetForm).toBeCalledWith({
        type: userFormActions.UPDATE_TEAM,
        payload: {
          profileId: "",
          profiles: profileList
        }
      });
    });
  });
  describe("Team dropdown", () => {
    test("Should render the correct initial state", () => {
      removeProfileZeroIfAdminNotInProfileZero.mockReturnValue(profileList);
      const rendered = renderComponent(false);
      expectMockedComponent(rendered, { Dropdown }, 2);
      const expectedTeamProps = {
        label: "Team *",
        options: profileList.map(profile => ({
          label: profile.profile_nme,
          value: profile.profile_id,
          ...profile
        })),
        value: "",
        error: false
      };
      expectOnlyPassedProps(Dropdown, expectedTeamProps, 1);
    });
    test("error field should be true", () => {
      useFormState.mockReturnValue({
        ...initialFormState,
        profileId: {
          ...initialFormState.profileId,
          blurred: true
        }
      });
      removeProfileZeroIfAdminNotInProfileZero.mockReturnValue(profileList);
      isProfileIdValid.mockReturnValue(false);
      renderComponent(false);
      expect(Dropdown.mock.calls[1][0].error).toBe(true);
    });
    test("onBlur - invalid profileId should set blur on field", () => {
      renderComponent(false);
      act(() => {
        const onBlur = Dropdown.mock.calls[1][0].onBlur;
        onBlur();
      });
      expect(mockSetForm).toBeCalledWith({
        type: userFormActions.SET_BLUR_ON_FIELD,
        payload: "profileId"
      });
    });
    test("onBlur - valid profileId should not set blur on field", () => {
      useFormState.mockReturnValue({
        ...initialFormState,
        profileId: {
          ...initialFormState.profileId,
          valid: true
        }
      });
      renderComponent(false);
      act(() => {
        const onBlur = Dropdown.mock.calls[1][0].onBlur;
        onBlur();
      });
      expect(mockSetForm).toBeCalledTimes(0);
    });
    test("updateValue - should set profile_id to correct value", () => {
      renderComponent(false);
      act(() => {
        const updateValue = Dropdown.mock.calls[1][0].updateValue;
        updateValue(null, { value: profileList[0].profile_id });
      });
      expect(mockSetForm).toBeCalledWith({
        type: userFormActions.UPDATE_TEAM,
        payload: {
          profileId: profileList[0].profile_id,
          profiles: profileList
        }
      });
    });
  });
  describe("Outgoing Number", () => {
    test("Should render the correct initial state", () => {
      const rendered = renderComponent(false);
      expectMockedComponent(rendered, { ModalPhoneNumber }, 1);
      const expectedOutgoingProps = {
        disabled: false,
        id: "outgoing-number",
        allowSevenDigitVdn: false,
        showError: initialFormState.outgoing.blurred,
        number: "",
        label: "Outgoing Number *"
      };
      expectOnlyPassedProps(ModalPhoneNumber, expectedOutgoingProps, 0);
    });
    test("disabled property should be true", () => {
      useFormState.mockReturnValue({
        ...initialFormState,
        formMode: formModes.UPDATE,
        editDisabled: true
      });
      renderComponent(false);
      expect(ModalPhoneNumber.mock.calls[0][0].disabled).toBe(true);
    });
    test("onBlur - invalid number should set blur on field", () => {
      renderComponent(false);
      act(() => {
        const onBlur = ModalPhoneNumber.mock.calls[0][0].onBlur;
        onBlur();
      });
      expect(mockSetForm).toBeCalledWith({
        type: userFormActions.SET_BLUR_ON_FIELD,
        payload: "outgoing"
      });
    });
    test("onBlur - valid number should not set blur on field", () => {
      useFormState.mockReturnValue({
        ...initialFormState,
        outgoing: {
          ...initialFormState.outgoing,
          valid: true
        }
      });
      renderComponent(false);
      act(() => {
        const onBlur = ModalPhoneNumber.mock.calls[0][0].onBlur;
        onBlur();
      });
      expect(mockSetForm).toBeCalledTimes(0);
    });
    test("updateValue - should set outgoing to correct value", () => {
      renderComponent(false);
      act(() => {
        const updateValue = ModalPhoneNumber.mock.calls[0][0].updateValue;
        updateValue("(603) 851-8200", null, true, "+16038518200");
      });
      expect(mockSetForm).toBeCalledWith({
        type: userFormActions.UPDATE_PHONE_NUMBER,
        payload: {
          field: "outgoing",
          maskedValue: "(603) 851-8200",
          isValid: true,
          e164Number: "+16038518200"
        }
      });
    });
  });
  describe("nNumber field", () => {
    const fetchedUser = {
      n_number: "n0263786",
      first_name: "Faith",
      last_name: "Cuneo"
    };
    test("Should render the correct initial state", () => {
      const rendered = renderComponent(false);
      expectMockedComponent(rendered, { ModalNNumber }, 1);
      const expectedNNumberProps = {
        disabled: false,
        fetchedUser: null,
        label: "N Number *",
        value: "n"
      };
      expectOnlyPassedProps(ModalNNumber, expectedNNumberProps, 0);
    });
    test("disabled property should be true on update form", () => {
      useFormState.mockReturnValue({
        ...initialFormState,
        formMode: formModes.UPDATE
      });
      renderComponent(false);
      expect(ModalNNumber.mock.calls[0][0].disabled).toBe(true);
    });
    test("disabled property should be true on successful fetched user", () => {
      useFormState.mockReturnValue({
        ...initialFormState,
        nNumberFetchedUser: fetchedUser
      });
      renderComponent(false);
      expect(ModalNNumber.mock.calls[0][0].disabled).toBe(true);
    });
    test("onBlur - invalid number should set blur on field", () => {
      renderComponent(false);
      act(() => {
        const onBlur = ModalNNumber.mock.calls[0][0].onBlur;
        onBlur();
      });
      expect(mockSetForm).toBeCalledWith({
        type: userFormActions.SET_BLUR_ON_FIELD,
        payload: "nNumber"
      });
    });
    test("onBlur - valid number should not set blur on field", () => {
      useFormState.mockReturnValue({
        ...initialFormState,
        nNumber: {
          ...initialFormState.nNumber,
          valid: true
        }
      });
      renderComponent(false);
      act(() => {
        const onBlur = ModalNNumber.mock.calls[0][0].onBlur;
        onBlur();
      });
      expect(mockSetForm).toBeCalledTimes(0);
    });
    test("onClear - should clear nNumber", () => {
      renderComponent(false);
      act(() => {
        const onClear = ModalNNumber.mock.calls[0][0].onClear;
        onClear();
      });
      expect(mockSetForm).toBeCalledWith({
        type: userFormActions.CLEAR_N_NUMBER
      });
    });
    test("onComplete - should complete nNumber", () => {
      renderComponent(false);
      act(() => {
        const onComplete = ModalNNumber.mock.calls[0][0].onComplete;
        onComplete(fetchedUser, "n0263786");
      });
      expect(mockSetForm).toBeCalledWith({
        type: userFormActions.COMPLETE_N_NUMBER,
        payload: {
          nNumber: "n0263786",
          fetchedUser: fetchedUser
        }
      });
    });
    test("onUpdate - should set nNumber to correct value", () => {
      renderComponent(false);
      act(() => {
        const updateValue = ModalNNumber.mock.calls[0][0].onUpdate;
        updateValue("n0263786");
      });
      expect(mockSetForm).toBeCalledWith({
        type: userFormActions.UPDATE_N_NUMBER,
        payload: "n0263786"
      });
    });
  });
  describe("Did Fields", () => {
    describe("form.didUser === false", () => {
      beforeEach(() => {
        useFormState.mockReturnValue(initialFormState);
      });
      describe("Initial State", () => {
        test("Should render the correct initial state", () => {
          renderComponent();
          const didToolTip = Tooltip.mock.calls[0][0];
          expect(didToolTip.title).toBe("");
          expect(didToolTip.placement).toBe("bottom-start");
          const rendered = render(didToolTip.children);
          expect(rendered.container).toHaveTextContent("DID User");

          const didSwitch = Switch.mock.calls[0][0];
          expect(didSwitch.checked).toEqual(false);
          expect(didSwitch.disabled).toEqual(false);
          expect(didSwitch.inputProps).toEqual({ "aria-label": "toggle-did-user" });

          expect(ModalPhoneNumber.mock.calls.length).toBe(1);
        });
        test(`DID Tooltip Title should be message when formMode === ${formModes.UPDATE}`, () => {
          useFormState.mockReturnValue({
            ...initialFormState,
            formMode: formModes.UPDATE
          });
          renderComponent();
          expect(Tooltip.mock.calls[0][0].title).toBe("Twilio DID can not be removed");
        });
      });
      describe("DID User Switch", () => {
        describe("form is in edit mode or form is in add mode opened fresh (no users have been added yet)", () => {
          test("When onChange is called, setForm is called", () => {
            renderComponent();
            render(Tooltip.mock.calls[0][0].children);
            act(() => {
              const onChange = Switch.mock.calls[0][0].onChange;
              onChange();
            });
            expect(mockSetForm).toHaveBeenCalledTimes(1);
            expect(mockSetForm).toHaveBeenCalledWith({ type: userFormActions.INITIATE_DID_FIELDS });
          });
        });
        describe("still on add form after at least one user has been added", () => {
          beforeEach(() => useFormState.mockReturnValue({
            ...initialFormState,
            userPreviouslyAdded: true
          }));
          test("When onChange is called, setForm is called", () => {
            renderComponent();
            render(Tooltip.mock.calls[0][0].children);
            act(() => {
              const onChange = Switch.mock.calls[0][0].onChange;
              onChange();
            });
            expect(mockSetForm).toHaveBeenCalledTimes(2);
            expect(mockSetForm).toHaveBeenCalledWith({ type: userFormActions.INITIATE_DID_FIELDS });
            expect(mockSetForm).toHaveBeenCalledWith({ type: userFormActions.CLEAR_OUTGOING_NUMBER });
          });
        });
      });
    });

    describe("form.didUser === true", () => {
      describe("Extension field", () => {
        beforeEach(() => {
          useFormState.mockReturnValue({
            ...initialFormState,
            formMode: formModes.INSERT,
            didUser: true
          });
        });
        test("Expected extension props", () => {
          const rendered = renderComponent(false);
          expectMockedComponent(rendered, { ModalExtension }, 1);
          const expectedExtensionProps = {
            extension: "",
            message: "",
            isError: false
          };
          expectOnlyPassedProps(ModalExtension, expectedExtensionProps, 0);
        });
        test("original value should be undefined", () => {
          render(
            <BasicFormInfo
              skills={mockSkills}
              worker={null}
              workers={mockWorkers}
              profiles={profileList}
              managers={managerList}
              forwardToToggle={false}
              mockSetForwardToToggle={mockSetForwardToToggle}
            />,
            initialTestState
          );
          expect(ModalExtension.mock.calls[0][0].originalValue).toBe(undefined);
        });
        test("error field should be true", () => {
          useFormState.mockReturnValue({
            ...initialFormState,
            didUser: true,
            extension: {
              ...initialFormState.extension,
              blurred: true
            }
          });
          isExtensionValid.mockReturnValue(false);
          renderComponent(false);
          expect(ModalExtension.mock.calls[0][0].isError).toBe(false);
        });
        test("onClear - should reset the field", () => {
          renderComponent(false);
          act(() => {
            const onClear = ModalExtension.mock.calls[0][0].onClear;
            onClear();
          });
          expect(mockSetForm).toBeCalledWith({ type: userFormActions.CLEAR_EXTENSION });
        });
        test("button label should be 'Verify' when a valid extension is entered", async () => {
          useFormState.mockReturnValue({
            ...initialFormState,
            didUser: true,
            extension: {
              value: "12345",
              blurred: false,
              updated: false,
              valid: false
            }
          });
          renderComponent(false);
          const buttonLabel = StyledButton.mock.calls[0][0].children.toString();
          expect(buttonLabel).toBe("Verify");
        });
        test("button label should be 'Auto-Assign' when extension is blank", async () => {
          useFormState.mockReturnValue({
            ...initialFormState,
            didUser: true,
            extension: {
              value: "",
              blurred: false,
              updated: false,
              valid: false
            }
          });
          renderComponent(false);
          const buttonLabel = StyledButton.mock.calls[0][0].children;
          expect(buttonLabel).toBe("Auto-Assign");
        });
        test("click the 'Validate' button", () => {
          useFormState.mockReturnValue({
            ...initialFormState,
            didUser: true,
            extension: {
              value: "12345",
              blurred: false,
              updated: false,
              valid: false
            },
            extensionStatus: {
              ...initialFormState.extensionStatus,
              searchStatus: ExtensionSearchStatuses.Idle,
              retriesRemaining: 5,
              message: "",
              isError: false,
              originalExtension: ""
            }
          });

          act(() => {
            renderComponent(false);
          });

          // Find the "Verify" function and call it
          const verifyFunction = StyledButton.mock.calls[0][0].onClick;
          checkExtension.mockReturnValue(Promise.resolve(true));

          act(() => {
            verifyFunction();
          });

          const expectedParams = {
            type: userFormActions.SET_EXTENSION_MESSAGE,
            payload: {
              message: "Checking Extension Number with Twilio",
              isError: false
            }
          };

          expect(mockSetForm).toHaveBeenCalledTimes(1);
          expect(mockSetForm).toHaveBeenCalledWith(expectedParams);
        });
        test("error message is displayed for a reserved extension number", async () => {
          useFormState.mockReturnValue({
            ...initialFormState,
            didUser: true,
            extension: {
              value: "13378",
              blurred: false,
              updated: false,
              valid: false
            }
          });

          renderComponent(false);
          const validateFunction = StyledButton.mock.calls[0][0].onClick;
          checkExtension.mockReturnValue(Promise.resolve(true));

          act(() => {
            validateFunction();
          });

          const expectedParams = {
            type: userFormActions.SET_EXTENSION_MESSAGE,
            payload: {
              message: "Extension is reserved",
              isError: true
            }
          };

          expect(mockSetForm).toHaveBeenCalledTimes(1);
          expect(mockSetForm).toHaveBeenCalledWith(expectedParams);
        });
        test("click the Auto-Assign button", async () => {
          useFormState.mockReturnValue({
            ...initialFormState,
            didUser: true,
            extension: {
              value: "",
              blurred: false,
              updated: false,
              valid: false
            }
          });

          renderComponent(false);
          const autoAssignFunction = StyledButton.mock.calls[0][0].onClick;
          checkExtension.mockReturnValue(Promise.resolve(true));

          act(() => {
            autoAssignFunction();
          });

          const expectedParams = {
            type: userFormActions.ASSIGN_EXTENSION
          };

          expect(mockSetForm).toHaveBeenCalledTimes(1);
          expect(mockSetForm).toHaveBeenCalledWith(expectedParams);
        });
        test("Auto-Assign retries exhausted", async () => {
          useFormState.mockReturnValue({
            ...initialFormState,
            didUser: true,
            extension: {
              value: "",
              blurred: false,
              updated: false,
              valid: false
            },
            extensionStatus: {
              ...initialFormState.extensionStatus,
              searchStatus: ExtensionSearchStatuses.PickANumber,
              retriesRemaining: 0
            }
          });

          renderComponent(false);

          const expectedParams = {
            type: userFormActions.SET_EXTENSION_MESSAGE,
            payload: {
              message: "Extension retries exhausted.  Please try again.",
              isError: true
            }
          };

          expect(mockSetForm).toHaveBeenCalledTimes(1);
          expect(mockSetForm).toHaveBeenCalledWith(expectedParams);
        });
        test("Auto-Assign retries not exhausted", async () => {
          useFormState.mockReturnValue({
            ...initialFormState,
            didUser: true,
            extension: {
              value: "",
              blurred: false,
              updated: false,
              valid: false
            },
            extensionStatus: {
              ...initialFormState.extensionStatus,
              searchStatus: ExtensionSearchStatuses.PickANumber,
              retriesRemaining: 5
            }
          });

          checkExtension.mockReturnValue(Promise.resolve(true));

          renderComponent(false);

          const expectedParams = {
            type: userFormActions.SET_EXTENSION_MESSAGE,
            payload: {
              message: "Checking Extension Number with Twilio",
              isError: false
            }
          };

          expect(mockSetForm).toHaveBeenCalledTimes(1);
          expect(mockSetForm).toHaveBeenCalledWith(expectedParams);
        });
        test("extension not available", async () => {
          useFormState.mockReturnValue({
            ...initialFormState,
            didUser: true,
            extension: {
              value: "",
              blurred: false,
              updated: false,
              valid: false
            },
            extensionStatus: {
              ...initialFormState.extensionStatus,
              searchStatus: ExtensionSearchStatuses.PickANumber,
              retriesRemaining: 5
            }
          });

          checkExtension.mockReturnValue(Promise.resolve(false));

          renderComponent(false);

          const expectedParams = {
            type: userFormActions.SET_EXTENSION_MESSAGE,
            payload: {
              message: "Checking Extension Number with Twilio",
              isError: false
            }
          };

          expect(mockSetForm).toHaveBeenCalledTimes(1);
          expect(mockSetForm).toHaveBeenCalledWith(expectedParams);
        });
        test("extension not available", async () => {
          useFormState.mockReturnValue({
            ...initialFormState,
            didUser: true,
            extension: {
              ...initialFormState.extension,
              value: "1234"
            }
          });

          act(() => {
            renderComponent(false);
          });

          const verifyFunction = StyledButton.mock.calls[0][0].onClick;
          checkExtension.mockReturnValue(Promise.resolve(false));

          act(() => {
            verifyFunction();
          });

          const expectedParams = {
            type: userFormActions.SET_EXTENSION_MESSAGE,
            payload: {
              message: "Checking Extension Number with Twilio",
              isError: false
            }
          };

          expect(mockSetForm).toHaveBeenCalledTimes(1);
          expect(mockSetForm).toHaveBeenCalledWith(expectedParams);
        });
        test("error while checking extension", async () => {
          useFormState.mockReturnValue({
            ...initialFormState,
            didUser: true,
            extension: {
              ...initialFormState.extension,
              value: "1234"
            }
          });

          act(() => {
            renderComponent(false);
          });

          const verifyFunction = StyledButton.mock.calls[0][0].onClick;
          checkExtension.mockReturnValue(Promise.reject(false));

          act(() => {
            verifyFunction();
          });
        });
        test("update the extension", () => {
          useFormState.mockReturnValue({
            ...initialFormState,
            didUser: true
          });

          act(() => {
            renderComponent(false);
          });

          // Find the onUpdate function and call it
          const onUpdateFunction = ModalExtension.mock.calls[0][0].onUpdate;
          const someExtension = "23456";

          act(() => {
            onUpdateFunction(someExtension);
          });

          const expectedParams = {
            type: userFormActions.UPDATE_EXTENSION,
            payload: {
              extension: someExtension,
              isValid: false
            }
          };

          expect(mockSetForm).toHaveBeenCalledTimes(1);
          expect(mockSetForm).toHaveBeenCalledWith(expectedParams);
        });
        test("when onChange is called, setForm is called to clear extension", () => {
          useFormState.mockReturnValue({
            ...initialFormState,
            didUser: true,
            extension: {
              value: "12345",
              blurred: false,
              updated: false,
              valid: false
            }
          });
          renderComponent();
          render(Tooltip.mock.calls[0][0].children);
          act(() => {
            const onChange = Switch.mock.calls[0][0].onChange;
            onChange();
          });
          expect(mockSetForm).toHaveBeenCalledWith({ type: userFormActions.CLEAR_EXTENSION });
        });
      });
      describe(`formMode === ${formModes.INSERT}`, () => {
        beforeEach(() => {
          useFormState.mockReturnValue({
            ...initialFormState,
            formMode: formModes.INSERT,
            didUser: true
          });
        });
        test("Should render the correct initial state", () => {
          renderComponent(false);
          const didToolTip = Tooltip.mock.calls[0][0];
          expect(didToolTip.title).toBe("");
          expect(didToolTip.placement).toBe("bottom-start");
          const renderedDidToolTip = render(didToolTip.children);
          expect(renderedDidToolTip.container).toHaveTextContent("DID User");

          const didSwitch = Switch.mock.calls[0][0];
          expect(didSwitch.checked).toEqual(true);
          expect(didSwitch.disabled).toEqual(false);
          expect(didSwitch.inputProps).toEqual({ "aria-label": "toggle-did-user" });

          const overFlowToolTip = Tooltip.mock.calls[1][0];
          expect(overFlowToolTip.title).toBe("");
          expect(overFlowToolTip.placement).toBe("bottom-start");
          const renderedOverflowTT = render(overFlowToolTip.children);
          expect(renderedOverflowTT.container).toHaveTextContent("Overflow Skill");

          const expectedDidFormInfoProps = {
            skills: mockSkills,
            worker: mockWorkers[2],
            workers: mockWorkers,
            forwardToToggle: false,
            setForwardToToggle: mockSetForwardToToggle
          };
          expectOnlyPassedProps(DidFormInfo, expectedDidFormInfoProps, 0);
        });
        test("Overflow Tooltip Title should be message when overflowSkill is not undefined", () => {
          getOverflowSkillFromProfile.mockReturnValue(undefined);
          renderComponent();
          expect(Tooltip.mock.calls[1][0].title).toBe("No overflow skill exists for this team");
        });
      });
      describe(`formMode === ${formModes.UPDATE}`, () => {
        beforeEach(() => {
          useFormState.mockReturnValue({
            ...initialFormState,
            formMode: formModes.UPDATE,
            didUser: true
          });
        });
        test("Should render the correct initial state", () => {
          renderComponent(false);
          const didToolTip = Tooltip.mock.calls[0][0];
          expect(didToolTip.title).toBe("Twilio DID can not be removed");
          expect(didToolTip.placement).toBe("bottom-start");
          const renderedDidToolTip = render(didToolTip.children);
          expect(renderedDidToolTip.container).toHaveTextContent("DID User");

          const didSwitch = Switch.mock.calls[0][0];
          expect(didSwitch.checked).toEqual(true);
          expect(didSwitch.disabled).toEqual(true);
          expect(didSwitch.inputProps).toEqual({ "aria-label": "toggle-did-user" });

          const overFlowToolTip = Tooltip.mock.calls[1][0];
          expect(overFlowToolTip.title).toBe("");
          expect(overFlowToolTip.placement).toBe("bottom-start");
          const renderedOverflowTT = render(overFlowToolTip.children);
          expect(renderedOverflowTT.container).toHaveTextContent("Overflow Skill");

          const expectedDidFormInfoProps = {
            skills: mockSkills,
            worker: mockWorkers[2],
            workers: mockWorkers,
            forwardToToggle: false,
            setForwardToToggle: mockSetForwardToToggle
          };
          expectOnlyPassedProps(DidFormInfo, expectedDidFormInfoProps, 0);
        });
      });
      describe("Overflow Skill Switch", () => {
        beforeEach(() => {
          getOverflowSkillFromProfile.mockReturnValue(undefined);
          useFormState.mockReturnValue({
            ...initialFormState,
            formMode: formModes.INSERT,
            didUser: true
          });
        });
        test("Should be disabled with overFlowSkills are undefined", () => {
          renderComponent(false);
          renderChildComponents();

          act(() => {
            const onChange = Switch.mock.calls[1][0].onChange;
            onChange();
          });

          expect(mockSetForm).toBeCalledTimes(1);
          expect(mockSetForm).toBeCalledWith({
            type: userFormActions.INITIATE_ZERO_OUT_FIELDS
          });
        });
        test("When onChange is called, setForm is called", () => {
          renderComponent(false);
          renderChildComponents();

          act(() => {
            const onChange = Switch.mock.calls[1][0].onChange;
            onChange();
          });

          expect(mockSetForm).toBeCalledTimes(1);
          expect(mockSetForm).toBeCalledWith({
            type: userFormActions.INITIATE_ZERO_OUT_FIELDS
          });
        });
      });
    });
  });
});