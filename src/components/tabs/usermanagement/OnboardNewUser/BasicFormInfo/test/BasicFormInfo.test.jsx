import { BasicFormInfo } from "../BasicFormInfo";
import {
  Switch,
  Tooltip
} from "@mui/material";
import { Edit } from "@mui/icons-material";
import { Dropdown } from "components/Dropdown";
import { ExtensionInput } from "usermanagement/ExtensionInput";
import { ForwardToEntryForm } from "usermanagement/ForwardToEntryForm";
import { NNumberInput } from "components/NNumberInput";
import { PhoneNumberInput } from "components/PhoneNumberInput";
import {
  useFormDispatch, useFormState
} from "context/appContext";
import { userFormActions } from "context/userFormReducer";
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
  mockWorkers,
  profileList,
  render,
  setupMockedComponents
} from "testUtils";
import {
  getOverflowSkillFromProfile,
  isProfileIdValid,
  isManagerValid
} from "utils/usermanagementUtils";
import { StyledButton } from "components/StyledButton";

jest.useFakeTimers();

jest.mock("components/Dropdown", () => ({
  Dropdown: jest.fn()
}));

jest.mock("usermanagement/ExtensionInput", () => ({
  ExtensionInput: jest.fn()
}));

jest.mock("components/NNumberInput", () => ({
  NNumberInput: jest.fn()
}));

jest.mock("components/PhoneNumberInput", () => ({
  PhoneNumberInput: jest.fn()
}));

jest.mock("usermanagement/SkillsFormInfo", () => ({
  SkillsFormInfo: jest.fn()
}));

jest.mock("components/StyledButton", () => ({
  StyledButton: jest.fn()
}));

jest.mock("usermanagement/ForwardToEntryForm", () => ({
  ForwardToEntryForm: jest.fn()
}));

jest.mock("@mui/material", () => ({
  Divider: jest.fn(),
  Tabs: jest.fn(),
  Switch: jest.fn(),
  Tooltip: jest.fn()
}));

jest.mock("@mui/icons-material", () => ({
  Edit: jest.fn()
}));

jest.mock("context/appContext", () => ({
  useFormState: jest.fn(),
  useAdminState: jest.fn(),
  useFormDispatch: jest.fn()
}));

jest.mock("utils/usermanagementUtils", () => ({
  isManagerValid: jest.fn(),
  isProfileIdValid: jest.fn(),
  getOverflowSkillFromProfile: jest.fn()
}));

jest.mock("globals", () => ({
  extensionMatcher: {
    test: jest.fn()
  },
  formModes: jest.requireActual("globals").formModes
}));

jest.mock("usermanagement/RoutingAttributes", ()=>({
  RoutingAttributes: jest.fn()
}));

const mockSetForm = jest.fn();

const mockSetForwardToToggle = jest.fn();

describe("<BasicFormInfo />", () => {

  beforeEach(() => {
    jest.clearAllMocks();
    useFormDispatch.mockReturnValue(mockSetForm);
    getOverflowSkillFromProfile.mockReturnValue("466");
    useFormState.mockReturnValue(initialFormState);
    setupMockedComponents({
      ExtensionInput,
      NNumberInput,
      PhoneNumberInput,
      Dropdown,
      Edit,
      ForwardToEntryForm,
      Switch,
      Tooltip,
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
    const selfServiceIndToolTip = Tooltip.mock.calls[2][0];
    render(selfServiceIndToolTip.children);
    const backupWorkerToolTip = Tooltip.mock.calls[3][0];
    render(backupWorkerToolTip.children);
  };

  describe("Manager dropdown", () => {
    test("Should render the correct initial state", () => {
      const rendered = renderComponent(false);
      expectMockedComponent(rendered, { Dropdown }, 2);
      const expectedManagerProps = {
        label: "Manager *",
        options: managerList.map(manager => ({
          label: `${manager.manager_first_name} ${manager.manager_last_name} - ${manager.manager_n_num}`,
          value: manager.manager_n_num,
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
          triton: {
            ...initialFormState.triton,
            manager: {
              ...initialFormState.manager,
              blurred: true
            }
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
        payload: {
          field: "manager",
          system: "triton"
        }
      });
    });
    test("onBlur - valid manager should not set blur on field", () => {
      useFormState.mockReturnValue({
        ...initialFormState,
        triton: {
          ...initialFormState.triton,
          manager: {
            ...initialFormState.manager,
            valid: true
          }
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
      const rendered = renderComponent(false);
      expectMockedComponent(rendered, { Dropdown }, 2);
      const expectedTeamProps = {
        label: "Team *",
        options: profileList.map(profile => ({
          label: `${profile.profile_name} - ${profile.profile_id}`,
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
        triton: {
          ...initialFormState.triton,
          profileId: {
            ...initialFormState.profileId,
            blurred: true
          }
        }
      });
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
        payload: {
          field: "profileId",
          system: "triton"
        }
      });
    });
    test("onBlur - valid profileId should not set blur on field", () => {
      useFormState.mockReturnValue({
        ...initialFormState,
        triton: {
          ...initialFormState.triton,
          profileId: {
            ...initialFormState.profileId,
            valid: true
          }
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
    test("updateValue - should set selfServiceInd to false if its true and new profileId is less than 39", () => {
      useFormState.mockReturnValue({
        ...initialFormState,
        triton: {
          ...initialFormState.triton,
          selfServiceInd: {
            ...initialFormState.triton.selfServiceInd,
            value: true
          }
        }
      });
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
      expect(mockSetForm).toBeCalledWith({
        type: userFormActions.UPDATE_SELF_SERVICE_INDICATOR
      });
    });
  });
  describe("Outgoing Number", () => {
    test("Should render the correct initial state", () => {
      const rendered = renderComponent(false);
      expectMockedComponent(rendered, { PhoneNumberInput }, 1);
      const expectedOutgoingProps = {
        disabled: false,
        id: "outgoing-number",
        allowSevenDigitVdn: false,
        showError: initialFormState.triton.outgoing.blurred,
        number: "",
        label: "Outbound Caller ID *"
      };
      expectOnlyPassedProps(PhoneNumberInput, expectedOutgoingProps, 0);
    });
    test("onBlur - invalid number should set blur on field", () => {
      renderComponent(false);
      act(() => {
        const onBlur = PhoneNumberInput.mock.calls[0][0].onBlur;
        onBlur();
      });
      expect(mockSetForm).toBeCalledWith({
        type: userFormActions.SET_BLUR_ON_FIELD,
        payload: {
          field: "outgoing",
          system: "triton"
        }
      });
    });
    test("onBlur - valid number should not set blur on field", () => {
      useFormState.mockReturnValue({
        ...initialFormState,
        triton: {
          ...initialFormState.triton,
          outgoing: {
            ...initialFormState.triton.outgoing,
            valid: true
          }
        }
      });
      renderComponent(false);
      act(() => {
        const onBlur = PhoneNumberInput.mock.calls[0][0].onBlur;
        onBlur();
      });
      expect(mockSetForm).toBeCalledTimes(0);
    });
    test("updateValue - should set outgoing to correct value", () => {
      renderComponent(false);
      act(() => {
        const updateValue = PhoneNumberInput.mock.calls[0][0].updateValue;
        updateValue("(603) 851-8200", null, true, "+16038518200");
      });
      expect(mockSetForm).toBeCalledWith({
        type: userFormActions.UPDATE_PHONE_NUMBER,
        payload: {
          field: "outgoing",
          maskedValue: "(603) 851-8200",
          isValid: true,
          e164Number: "+16038518200",
          initialValue: "+16034567890"
        }
      });
    });

    describe("disabled property should be true", () => {
      test("formMode is DELETE", () => {
        useFormState.mockReturnValue({
          ...initialFormState,
          formMode: formModes.DELETE
        });
        renderComponent(false);
        expect(PhoneNumberInput.mock.calls[0][0].disabled).toBe(true);
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
      expectMockedComponent(rendered, { NNumberInput }, 1);
      const expectedNNumberProps = {
        disabled: false,
        fetchedUser: null,
        label: "N Number *",
        value: "n"
      };
      expectOnlyPassedProps(NNumberInput, expectedNNumberProps, 0);
    });
    test("disabled property should be true on update form", () => {
      useFormState.mockReturnValue({
        ...initialFormState,
        formMode: formModes.UPDATE
      });
      renderComponent(false);
      expect(NNumberInput.mock.calls[0][0].disabled).toBe(true);
    });
    test("disabled property should be true on successful fetched user", () => {
      useFormState.mockReturnValue({
        ...initialFormState,
        nNumber: {
          ...initialFormState,
          nNumberFetchedUser: fetchedUser
        }
      });
      renderComponent(false);
      expect(NNumberInput.mock.calls[0][0].disabled).toBe(true);
    });
    test("onBlur - invalid number should set blur on field", () => {
      renderComponent(false);
      act(() => {
        const onBlur = NNumberInput.mock.calls[0][0].onBlur;
        onBlur();
      });
      expect(mockSetForm).toBeCalledWith({
        type: userFormActions.SET_BLUR_ON_FIELD,
        payload: {
          field: "nNumber",
          system: null
        }
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
        const onBlur = NNumberInput.mock.calls[0][0].onBlur;
        onBlur();
      });
      expect(mockSetForm).toBeCalledTimes(0);
    });
    test("onClear - should clear nNumber", () => {
      renderComponent(false);
      act(() => {
        const onClear = NNumberInput.mock.calls[0][0].onClear;
        onClear();
      });
      expect(mockSetForm).toBeCalledWith({
        type: userFormActions.CLEAR_N_NUMBER
      });
    });
    test("onComplete - should complete nNumber", () => {
      renderComponent(false);
      act(() => {
        const onComplete = NNumberInput.mock.calls[0][0].onComplete;
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
        const updateValue = NNumberInput.mock.calls[0][0].onUpdate;
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

          expect(PhoneNumberInput.mock.calls.length).toBe(1);
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
            triton: {
              ...initialFormState.triton,
              userPreviouslyAdded: true
            }
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
      describe(`formMode === ${formModes.INSERT}`, () => {
        beforeEach(() => {
          useFormState.mockReturnValue({
            ...initialFormState,
            formMode: formModes.INSERT,
            triton: {
              ...initialFormState.triton,
              didUser: true
            }
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

          const selfServiceIndToolTip = Tooltip.mock.calls[2][0];
          expect(selfServiceIndToolTip.title).toBe("enable to add self service indicator attribute to worker - needs to be DID user and profile 39 or above");
          expect(selfServiceIndToolTip.placement).toBe("bottom-start");
          const renderedSelfServiceIndTT = render(selfServiceIndToolTip.children);
          expect(renderedSelfServiceIndTT.container).toHaveTextContent("Self Service Indicator");

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
            triton: {
              ...initialFormState.triton,
              didUser: true
            }
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

          const selfServiceIndToolTip = Tooltip.mock.calls[2][0];
          expect(selfServiceIndToolTip.title).toBe("enable to add self service indicator attribute to worker - needs to be DID user and profile 39 or above");
          expect(selfServiceIndToolTip.placement).toBe("bottom-start");
          const renderedSelfServiceIndTT = render(selfServiceIndToolTip.children);
          expect(renderedSelfServiceIndTT.container).toHaveTextContent("Self Service Indicator");
        });
      });

      describe("Direct Dial Number", () => {
        beforeEach(() => {
          getOverflowSkillFromProfile.mockReturnValue(undefined);
          useFormState.mockReturnValue({
            ...initialFormState,
            formMode: formModes.INSERT,
            triton: {
              ...initialFormState.triton,
              didUser: true
            }
          });
        });

        test("onBlur - should set blur on field", () => {
          renderComponent();
          act(() => {
            const onBlur = PhoneNumberInput.mock.calls[0][0].onBlur;
            onBlur();
          });
          expect(mockSetForm).toBeCalledTimes(1);
          expect(mockSetForm).toBeCalledWith({
            type: userFormActions.SET_BLUR_ON_FIELD,
            payload: {
              field: "did",
              system: "triton"
            }
          });
        });
        test("onBlur - when number is valid, blur should not be set", () => {
          useFormState.mockReturnValue({
            ...initialFormState,
            triton: {
              ...initialFormState.triton,
              didUser: true,
              did: {
                valid: true
              }
            }
          });
          renderComponent();
          act(() => {
            const onBlur = PhoneNumberInput.mock.calls[0][0].onBlur;
            onBlur();
          });
          expect(mockSetForm).toBeCalledTimes(0);
        });

        describe("updateValue", () => {
          test("should set did number, and outgoing to correct value when outgoing is unset", () => {
            renderComponent();
            act(() => {
              const updateValue = PhoneNumberInput.mock.calls[0][0].updateValue;
              updateValue("(603) 851-8200", null, true, "+16038518200");
            });
            expect(mockSetForm).toBeCalledTimes(2);
            expect(mockSetForm.mock.calls[0][0]).toEqual({
              type: userFormActions.UPDATE_PHONE_NUMBER,
              payload: {
                field: "did",
                maskedValue: "(603) 851-8200",
                isValid: true,
                e164Number: "+16038518200",
                initialValue: "+18002345678"
              }
            });
            expect(mockSetForm.mock.calls[1][0]).toEqual({
              type: userFormActions.UPDATE_PHONE_NUMBER,
              payload: {
                field: "outgoing",
                maskedValue: "(603) 851-8200",
                isValid: true,
                e164Number: "+16038518200",
                initialValue: "+16034567890"
              }
            });
          });

          test("should set did number and not outgoing to correct value when outgoing is set", () => {
            useFormState.mockReturnValue({
              ...initialFormState,
              triton: {
                ...initialFormState.triton,
                outgoing: {
                  blurred: true,
                  e164: "+16038518201",
                  updated: true,
                  valid: true,
                  value: "(603) 851-8201"
                },
                didUser: true
              }
            });

            renderComponent();
            act(() => {
              const updateValue = PhoneNumberInput.mock.calls[0][0].updateValue;
              updateValue("(603) 851-8200", null, true, "+16038518200");
            });
            expect(mockSetForm).toBeCalledTimes(1);
            expect(mockSetForm.mock.calls[0][0]).toEqual({
              type: userFormActions.UPDATE_PHONE_NUMBER,
              payload: {
                field: "did",
                maskedValue: "(603) 851-8200",
                isValid: true,
                e164Number: "+16038518200",
                initialValue: "+18002345678"
              }
            });
          });

          test("should not set outgoing number if input is invalid", () => {
            renderComponent();
            act(() => {
              const updateValue = PhoneNumberInput.mock.calls[0][0].updateValue;
              updateValue("(603) 851-82", null, false, "+160385182");
            });
            expect(mockSetForm).toBeCalledTimes(1);
            expect(mockSetForm.mock.calls[0][0]).toEqual({
              type: userFormActions.UPDATE_PHONE_NUMBER,
              payload: {
                field: "did",
                maskedValue: "(603) 851-82",
                isValid: false,
                e164Number: "+160385182",
                initialValue: "+18002345678"
              }
            });
          });

          test("should hide ForwardToEntryForm when user enters the number on the worker", async () => {
            useFormState.mockReturnValue({
              ...initialFormState,
              formMode: formModes.UPDATE,
              triton: {
                ...initialFormState.triton,
                didUser: true,
                did: {
                  ...initialFormState.triton.did,
                  e164: mockWorkers[2].did,
                  updated: true
                }
              }
            });

            const rendered = renderComponent();

            expectMockedComponent(rendered, { ForwardToEntryForm }, 0);
          });
        });

        describe(`did updated && form.formMode === ${formModes.UPDATE}`, () => {
          describe("ForwardToEntryForm", () => {
            beforeEach(() => {
              useFormState.mockReturnValue({
                ...initialFormState,
                formMode: formModes.UPDATE,
                triton: {
                  ...initialFormState.triton,
                  didUser: true,
                  did: {
                    ...initialFormState.triton.did,
                    updated: true
                  }
                }
              });
            });
            test("ForwardToEntryForm is rendered with the correct props", () => {
              const rendered = renderComponent(true);
              expectMockedComponent(rendered, { ForwardToEntryForm }, 1);
              const expectedForwardToEntryProps = {
                label: "Please choose a forward to option for the existing direct dial number"
              };
              expectOnlyPassedProps(ForwardToEntryForm, expectedForwardToEntryProps, 0);
            });

            test("updateForwardTo - should update inactiveForwardTo", () => {
              renderComponent(true);
              act(() => {
                const updateForwardTo = ForwardToEntryForm.mock.calls[0][0].updateForwardTo;
                updateForwardTo("WK123456");
              });
              expect(mockSetForm).toBeCalledWith({
                type: userFormActions.UPDATE_INACTIVE_FORWARD_TO,
                payload: "WK123456"
              });
            });
          });


          test("should update outgoing when did matches outgoing number", () => {
            useFormState.mockReturnValue({
              ...initialFormState,
              formMode: formModes.UPDATE,
              triton: {
                ...initialFormState.triton,
                didUser: true,
                outgoing: initialFormState.triton.did
              }
            });

            renderComponent();

            act(() => {
              const updateValue = PhoneNumberInput.mock.calls[0][0].updateValue;
              updateValue("(603) 851-8200", null, true, "+16038518200");
            });

            expect(mockSetForm).toBeCalledTimes(2);
            expect(mockSetForm.mock.calls[0][0]).toEqual({
              type: userFormActions.UPDATE_PHONE_NUMBER,
              payload: {
                field: "did",
                maskedValue: "(603) 851-8200",
                isValid: true,
                e164Number: "+16038518200",
                initialValue: "+18002345678"
              }
            });
            expect(mockSetForm.mock.calls[1][0]).toEqual({
              type: userFormActions.UPDATE_PHONE_NUMBER,
              payload: {
                field: "outgoing",
                maskedValue: "(603) 851-8200",
                isValid: true,
                e164Number: "+16038518200",
                initialValue: "+16034567890"
              }
            });
          });
        });
      });

      describe("Overflow Skill Switch", () => {
        beforeEach(() => {
          getOverflowSkillFromProfile.mockReturnValue(undefined);
          useFormState.mockReturnValue({
            ...initialFormState,
            formMode: formModes.INSERT,
            triton: {
              ...initialFormState.triton,
              didUser: true
            }
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

      describe("Self Service Indicator Switch", () => {
        beforeEach(() => {
          getOverflowSkillFromProfile.mockReturnValue(undefined);
          useFormState.mockReturnValue({
            ...initialFormState,
            formMode: formModes.INSERT,
            triton: {
              ...initialFormState.triton,
              didUser: true
            }
          });
        });
        test("When onChange is called, setForm is called", () => {
          renderComponent(false);
          renderChildComponents();

          act(() => {
            const onChange = Switch.mock.calls[2][0].onChange;
            onChange();
          });

          expect(mockSetForm).toBeCalledTimes(1);
          expect(mockSetForm).toBeCalledWith({
            type: userFormActions.UPDATE_SELF_SERVICE_INDICATOR
          });
        });
      });
    });
  });

  describe("Backup Workers Fields", () => {
    beforeEach(() => {
      useFormState.mockReturnValue(initialFormState);
    });
    describe("Initial State", () => {
      test("Should render the correct initial state", () => {
        renderComponent();
        const backupWorkerToolTip = Tooltip.mock.calls[1][0];
        expect(backupWorkerToolTip.title).toBe("Backup Workers Enable/Disable");
        expect(backupWorkerToolTip.placement).toBe("bottom-start");
        const rendered = render(backupWorkerToolTip.children);
        expect(rendered.container).toHaveTextContent("Backup Workers");
      });
    });
    describe("Backup Worker Enable/Disable Switch", () => {
      test("When onChange is called, setForm is called", () => {
        renderComponent();
        render(Tooltip.mock.calls[1][0].children);
        act(() => {
          const onChange = Switch.mock.calls[0][0].onChange;
          onChange();
        });
        expect(mockSetForm).toHaveBeenCalledTimes(1);
        expect(mockSetForm).toHaveBeenCalledWith({ type: userFormActions.UPDATE_BACK_UP_WORKER_FLAG });
      });
     
    });
  });
});