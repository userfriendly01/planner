import { ProfileFormFields } from "../ProfileFormFields";
import React from "react";
import {
  render,
  setupMockedComponents,
  initialProfileEntryFormState,
  initialSkillState,
  initialTestState,
  expectOnlyPassedProps,
  validProfileEntryFormState,
  mockOperatingUnits,
  mockSkills,
  mockActivities,
  mockTaskQueues,
  mockScreenpops,
  mockAccessGroups
} from "testUtils";
import { profileEntryFormActions } from "context/profileEntryFormReducer";
import { toggleControls } from "utils/profileUtils";
import { PhoneNumberInput } from "components/PhoneNumberInput";
import { CallTagFields } from "orgmanagement/CallTagFields";
import { Dropdown } from "components/Dropdown";
import { CustomInput } from "components/CustomInput";
import {
  profileEntryFormDispatch,
  profileEntryFormState,
  useAdminState,
  useSkillState
} from "context/appContext";
import {
  FormControlLabel,
  Switch,
  Tooltip
} from "@mui/material";
import { formModes } from "globals/index";

jest.mock("@mui/material", () => ({
  FormControlLabel: jest.fn(),
  Switch: jest.fn(),
  Tooltip: jest.fn(),
  Button: jest.fn()
}));

jest.mock("components/CustomInput", () => ({
  CustomInput: jest.fn()
}));

jest.mock("components/Dropdown", () => ({
  Dropdown: jest.fn()
}));

jest.mock("orgmanagement/CallTagFields", () => ({
  CallTagFields: jest.fn()
}));

jest.mock("components/PhoneNumberInput", () => ({
  PhoneNumberInput: jest.fn()
}));

jest.mock("context/appContext", () => ({
  useAdminState: jest.fn(),
  useSkillState: jest.fn(),
  profileEntryFormState: jest.fn(),
  profileEntryFormDispatch: jest.fn()
}));

jest.mock("utils/_formatUtils", () => ({
  formatDropdownOptions: jest.fn().mockImplementation(options => options)
}));

const mockSetForm = jest.fn();

const renderComponent = () => {
  render(<ProfileFormFields/>);
  expect(Tooltip).toHaveBeenCalledTimes(1);
  render(Tooltip.mock.calls[0][0].children);
  expect(FormControlLabel).toHaveBeenCalledTimes(toggleControls.length + 1);
  FormControlLabel.mock.calls.forEach(call => {
    render(call[0].children);
  });
};

describe("<ProfileFormFields />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    profileEntryFormState.mockReturnValue(initialProfileEntryFormState);
    useSkillState.mockReturnValue(initialSkillState);
    useAdminState.mockReturnValue(initialTestState);
    profileEntryFormDispatch.mockReturnValue(mockSetForm);
    setupMockedComponents({
      PhoneNumberInput,
      CallTagFields,
      Dropdown,
      CustomInput,
      Switch,
      Tooltip
    });
  });
  describe("initial state", () => {
    test("Should render the correct initial state", () => {
      renderComponent();

      expect(CustomInput).toHaveBeenCalledTimes(2);
      expect(CustomInput.mock.calls[0][0].label).toBe("Profile Id *");
      expect(CustomInput.mock.calls[1][0].label).toBe("Profile Name *");

      expect(Dropdown).toHaveBeenCalledTimes(6);
      expect(Dropdown.mock.calls[0][0].label).toBe("Operating Unit *");
      expect(Dropdown.mock.calls[1][0].label).toBe("Activities *");
      expect(Dropdown.mock.calls[2][0].label).toBe("Overflow Skill");
      expect(Dropdown.mock.calls[3][0].label).toBe("Transfer Queues");
      expect(Dropdown.mock.calls[4][0].label).toBe("Screenpops");
      expect(Dropdown.mock.calls[5][0].label).toBe("Access Group");

      toggleControls.forEach((toggle, index) => {
        expect(FormControlLabel.mock.calls[index][0].label).toBe(toggle.label);
      });

      expect(PhoneNumberInput).toHaveBeenCalledTimes(1);
      expect(PhoneNumberInput.mock.calls[0][0].label).toBe("Forward To Number");

      expect(CallTagFields).not.toHaveBeenCalled();
    });
  });
  describe("valid update Form", () => {
    beforeEach(() => {
      profileEntryFormState.mockReturnValue({
        ...validProfileEntryFormState,
        formMode: formModes.UPDATE
      });
    });
    describe("Profile Id field", () => {
      test("initial values are as expected", () => {
        renderComponent();
        expect(CustomInput.mock.calls[0][0].label).toBe("Profile Id *");
        expectOnlyPassedProps(CustomInput, {
          disabled: true,
          label: "Profile Id *",
          maxLength: "3",
          name: "40",
          value: "40"
        }, 0);
      });
      describe("updateValue is called", () => {
        describe("value is a number", () => {
          test("should call set form with SET_FORM_FIELD", () => {
            renderComponent();
            const updateValue = CustomInput.mock.calls[0][0].updateValue;
            updateValue("15");
            expect(mockSetForm).toHaveBeenCalledTimes(1);
            expect(mockSetForm).toHaveBeenCalledWith({
              type: profileEntryFormActions.SET_FORM_FIELD,
              payload: {
                key: "profileId",
                value: 15
              }
            });
          });
        });
        describe("value is not a number", () => {
          test("should not call set form with SET_FORM_FIELD", () => {
            renderComponent();
            const updateValue = CustomInput.mock.calls[0][0].updateValue;
            updateValue("butts");
            expect(mockSetForm).toHaveBeenCalledTimes(0);
          });
        });
      });
    });
    describe("Profile Name field", () => {
      test("initial values are as expected", () => {
        renderComponent();
        expect(CustomInput.mock.calls[1][0].label).toBe("Profile Name *");
        expectOnlyPassedProps(CustomInput, {
          label: "Profile Name *",
          maxLength: "80",
          name: "GRS Claims",
          value: "GRS Claims"
        }, 1);
      });
      describe("updateValue is called", () => {
        test("should call set form with SET_FORM_FIELD", () => {
          const value = "Catz Rule";
          renderComponent();
          const updateValue = CustomInput.mock.calls[1][0].updateValue;
          updateValue(value);
          expect(mockSetForm).toHaveBeenCalledTimes(1);
          expect(mockSetForm).toHaveBeenCalledWith({
            type: profileEntryFormActions.SET_FORM_FIELD,
            payload: {
              key: "profileName",
              value
            }
          });
        });
      });
    });
    describe("Operating Unit Dropdown", () => {
      test("initial values are as expected", () => {
        renderComponent();
        expect(Dropdown.mock.calls[0][0].label).toBe("Operating Unit *");
        expectOnlyPassedProps(Dropdown, {
          label: "Operating Unit *",
          disabled: true,
          options: mockOperatingUnits,
          value: mockOperatingUnits[0]
        }, 0);
      });
      describe("updateValue is called", () => {
        test("should call set form with SET_FORM_FIELD", () => {
          const value = mockOperatingUnits[1];
          renderComponent();
          const updateValue = Dropdown.mock.calls[0][0].updateValue;
          updateValue(null, value);
          expect(mockSetForm).toHaveBeenCalledTimes(1);
          expect(mockSetForm).toHaveBeenCalledWith({
            type: profileEntryFormActions.SET_FORM_FIELD,
            payload: {
              key: "operatingUnit",
              value
            }
          });
        });
      });
    });
    describe("Activity Dropdown", () => {
      test("initial values are as expected", () => {
        renderComponent();
        expect(Dropdown.mock.calls[1][0].label).toBe("Activities *");
        expectOnlyPassedProps(Dropdown, {
          label: "Activities *",
          multiple: true,
          options: mockActivities,
          value: mockActivities
        }, 1);
      });
      describe("updateValue is called", () => {
        test("should call set form with SET_FORM_FIELD", () => {
          const values = [mockActivities[1]];
          renderComponent();
          const updateValue = Dropdown.mock.calls[1][0].updateValue;
          updateValue(null, values);
          expect(mockSetForm).toHaveBeenCalledTimes(1);
          expect(mockSetForm).toHaveBeenCalledWith({
            type: profileEntryFormActions.SET_FORM_FIELD,
            payload: {
              key: "activitiesList",
              value: values
            }
          });
        });
      });
    });
    describe("Overflow Skill Dropdown", () => {
      test("initial values are as expected", () => {
        renderComponent();
        expect(Dropdown.mock.calls[2][0].label).toBe("Overflow Skill");
        expectOnlyPassedProps(Dropdown, {
          label: "Overflow Skill",
          options: mockSkills,
          value: mockSkills[0]
        }, 2);
      });
      describe("updateValue is called", () => {
        test("should call set form with SET_FORM_FIELD", () => {
          const value = mockSkills[1];
          renderComponent();
          const updateValue = Dropdown.mock.calls[2][0].updateValue;
          updateValue(null, value);
          expect(mockSetForm).toHaveBeenCalledTimes(1);
          expect(mockSetForm).toHaveBeenCalledWith({
            type: profileEntryFormActions.SET_FORM_FIELD,
            payload: {
              key: "overflowSkill",
              value
            }
          });
        });
      });
    });
    describe("Transfer Queues Dropdown", () => {
      test("initial values are as expected", () => {
        renderComponent();
        expect(Dropdown.mock.calls[3][0].label).toBe("Transfer Queues");
        expectOnlyPassedProps(Dropdown, {
          label: "Transfer Queues",
          multiple: true,
          options: mockTaskQueues,
          value: [mockTaskQueues[0], mockTaskQueues[1]]
        }, 3);
      });
      describe("updateValue is called", () => {
        test("should call set form with SET_FORM_FIELD", () => {
          const values = mockTaskQueues;
          renderComponent();
          const updateValue = Dropdown.mock.calls[3][0].updateValue;
          updateValue(null, values);
          expect(mockSetForm).toHaveBeenCalledTimes(1);
          expect(mockSetForm).toHaveBeenCalledWith({
            type: profileEntryFormActions.SET_FORM_FIELD,
            payload: {
              key: "transferQueues",
              value: values
            }
          });
        });
      });
    });
    describe("Screenpops Dropdown", () => {
      test("initial values are as expected", () => {
        renderComponent();
        expect(Dropdown.mock.calls[4][0].label).toBe("Screenpops");
        expectOnlyPassedProps(Dropdown, {
          label: "Screenpops",
          multiple: true,
          options: mockScreenpops,
          value: mockScreenpops
        }, 4);
      });
      describe("updateValue is called", () => {
        test("should call set form with SET_FORM_FIELD", () => {
          const values = [mockScreenpops[0]];
          renderComponent();
          const updateValue = Dropdown.mock.calls[4][0].updateValue;
          updateValue(null, values);
          expect(mockSetForm).toHaveBeenCalledTimes(1);
          expect(mockSetForm).toHaveBeenCalledWith({
            type: profileEntryFormActions.SET_FORM_FIELD,
            payload: {
              key: "screenpops",
              value: values
            }
          });
        });
      });
    });
    describe("Access Group Dropdown", () => {
      test("initial values are as expected", () => {
        renderComponent();
        expect(Dropdown.mock.calls[5][0].label).toBe("Access Group");
        expectOnlyPassedProps(Dropdown, {
          label: "Access Group",
          options: [
            {
              label: "Create New Access Group",
              value: "create-new"
            },
            {
              label: "divider",
              value: "divider"
            },
            ...mockAccessGroups
          ],
          value: mockAccessGroups[0]
        }, 5);
      });
      describe("updateValue is called", () => {
        describe("value === create-new", () => {
          test("should render new access group fields", () => {
            const value = { value: "create-new" };
            renderComponent();
            const updateValue = Dropdown.mock.calls[5][0].updateValue;
            updateValue(null, value);
            expect(mockSetForm).toHaveBeenCalledTimes(1);
            expect(mockSetForm).toHaveBeenCalledWith({
              type: profileEntryFormActions.SET_FORM_FIELD,
              payload: {
                key: "accessGroup",
                value: {
                  isNew: true,
                  access_group_name: "",
                  id: "create-new"
                }
              }
            });
          });
          describe("accessGroup isNew === true", () => {
            beforeEach(() => {
              profileEntryFormState.mockReturnValue({
                ...validProfileEntryFormState,
                formMode: formModes.UPDATE,
                accessGroup: {
                  ...validProfileEntryFormState.accessGroup,
                  isNew: true
                }
              });
            });
            describe("New Access Group Name field", () => {
              test("initial values are as expected", () => {
                renderComponent();
                expect(CustomInput).toHaveBeenCalledTimes(4);
                expectOnlyPassedProps(CustomInput, {
                  label: "New Access Group Name *",
                  name: "New Access Group Name *",
                  maxLength: "80",
                  value: "Canon"
                }, 2);
              });
              describe("updateValue is called", () => {
                test("should call set form with SET_FORM_FIELD", () => {
                  const value = "Cats!";
                  renderComponent();
                  const updateValue = CustomInput.mock.calls[2][0].updateValue;
                  updateValue(value);
                  expect(mockSetForm).toHaveBeenCalledTimes(1);
                  expect(mockSetForm).toHaveBeenCalledWith({
                    type: profileEntryFormActions.SET_FORM_FIELD,
                    payload: {
                      key: "accessGroup",
                      value: {
                        ...validProfileEntryFormState.accessGroup,
                        isNew: true,
                        access_group_name: value
                      }
                    }
                  });
                });
              });
            });
            describe("Twilio Dashboard Url field", () => {
              test("initial values are as expected", () => {
                renderComponent();
                expect(CustomInput).toHaveBeenCalledTimes(4);
                expectOnlyPassedProps(CustomInput, {
                  label: "Twilio Dashboard Url *",
                  name: "Twilio Dashboard Url *",
                  value: "https://analytics.ytica.com/dashboard.html#workspace=/gdc/workspaces/pdgson3f19xo7p6109q1v7ecfjyc5snb&dashboard=/gdc/md/pdgson3f19xo7p6109q1v7ecfjyc5snb/obj/10546934"
                }, 3);
              });
              describe("updateValue is called", () => {
                test("should call set form with SET_FORM_FIELD", () => {
                  const value = "www.cats.com";
                  renderComponent();
                  const updateValue = CustomInput.mock.calls[3][0].updateValue;
                  updateValue(value);
                  expect(mockSetForm).toHaveBeenCalledTimes(1);
                  expect(mockSetForm).toHaveBeenCalledWith({
                    type: profileEntryFormActions.SET_FORM_FIELD,
                    payload: {
                      key: "accessGroup",
                      value: {
                        ...validProfileEntryFormState.accessGroup,
                        isNew: true,
                        twilio_dashboard_url: value
                      }
                    }
                  });
                });
              });
            });
          });
        });
        describe("value !== create-new", () => {
          test("should call set form with SET_FORM_FIELD", () => {
            const value = mockAccessGroups[1];
            renderComponent();
            const updateValue = Dropdown.mock.calls[5][0].updateValue;
            updateValue(null, value);
            expect(mockSetForm).toHaveBeenCalledTimes(1);
            expect(mockSetForm).toHaveBeenCalledWith({
              type: profileEntryFormActions.SET_FORM_FIELD,
              payload: {
                key: "accessGroup",
                value
              }
            });
          });
        });
      });
    });
    describe("Forward To Field", () => {
      test("initial values are as expected", () => {
        renderComponent();
        expect(PhoneNumberInput.mock.calls[0][0].label).toBe("Forward To Number");
        expectOnlyPassedProps(PhoneNumberInput, {
          label: "Forward To Number",
          allowSevenDigitVdn: false,
          number: "(603) 851-8200"
        }, 0);
      });
      describe("updateValue is called", () => {
        test("should call set form with SET_FORM_FIELD", () => {
          const maskedValue = "(603) 867-2200";
          const unmaskedValue = "6038672200";
          const isValid = true;
          const e164Number = "+16038672200";
          renderComponent();
          const updateValue = PhoneNumberInput.mock.calls[0][0].updateValue;
          updateValue(maskedValue, unmaskedValue, isValid, e164Number);
          expect(mockSetForm).toHaveBeenCalledTimes(1);
          expect(mockSetForm).toHaveBeenCalledWith({
            type: profileEntryFormActions.SET_FORM_FIELD,
            payload: {
              key: "forwardToNum",
              value: {
                value: maskedValue,
                unmaskedValue,
                valid: isValid,
                e164Number
              }
            }
          });
        });
      });
    });
    describe("Toggle fields", () => {
      test("initial values are as expected", () => {
        profileEntryFormState.mockReturnValue({
          ...validProfileEntryFormState,
          acwDataEntry: false
        });
        renderComponent();
        FormControlLabel.mock.calls.forEach(call => {
          render(call[0].control);
        });
        expect(Switch).toHaveBeenCalledTimes(17);
        expect(FormControlLabel.mock.calls[0][0].label).toBe("Inbound Recorded");
        expect(Switch.mock.calls[0][0].checked).toBe(true);
        expect(FormControlLabel.mock.calls[1][0].label).toBe("Outbound Recorded");
        expect(Switch.mock.calls[1][0].checked).toBe(true);
        expect(FormControlLabel.mock.calls[2][0].label).toBe("Manual Inbound Recorded");
        expect(Switch.mock.calls[2][0].checked).toBe(false);
        expect(FormControlLabel.mock.calls[3][0].label).toBe("Manual Outbound Recorded");
        expect(Switch.mock.calls[3][0].checked).toBe(true);
        expect(FormControlLabel.mock.calls[4][0].label).toBe("Auto Answered");
        expect(Switch.mock.calls[4][0].checked).toBe(true);
        expect(FormControlLabel.mock.calls[5][0].label).toBe("Payment Processing");
        expect(Switch.mock.calls[5][0].checked).toBe(false);
        expect(FormControlLabel.mock.calls[6][0].label).toBe("ACW Option");
        expect(Switch.mock.calls[6][0].checked).toBe(false);
        expect(FormControlLabel.mock.calls[7][0].label).toBe("ACW Data Entry");
        expect(Switch.mock.calls[7][0].checked).toBe(false);
        expect(FormControlLabel.mock.calls[8][0].label).toBe("Agent Assisted Pay");
        expect(Switch.mock.calls[8][0].checked).toBe(false);
        expect(FormControlLabel.mock.calls[9][0].label).toBe("Voice Mail Transcription");
        expect(Switch.mock.calls[9][0].checked).toBe(false);
        expect(FormControlLabel.mock.calls[10][0].label).toBe("Call Reason");
        expect(Switch.mock.calls[10][0].checked).toBe(false);
        expect(FormControlLabel.mock.calls[11][0].label).toBe("Claim Number Edit");
        expect(Switch.mock.calls[11][0].checked).toBe(false);
        expect(FormControlLabel.mock.calls[12][0].label).toBe("Policy Number Edit");
        expect(Switch.mock.calls[12][0].checked).toBe(false);
        expect(FormControlLabel.mock.calls[13][0].label).toBe("Click To Dial");
        expect(Switch.mock.calls[13][0].checked).toBe(false);
        expect(FormControlLabel.mock.calls[14][0].label).toBe("EFT Authorization");
        expect(Switch.mock.calls[14][0].checked).toBe(false);
        expect(FormControlLabel.mock.calls[15][0].label).toBe("FTO Backup");
        expect(FormControlLabel.mock.calls[16][0].label).toBe("Self Service Indicator");
        expect(CallTagFields).not.toHaveBeenCalled();
      });
      describe("self service indicator - profile >= 39", () => {
        test("checked === true", () => {
          renderComponent();
          FormControlLabel.mock.calls.forEach(call => {
            render(call[0].control);
          });
          expect(FormControlLabel.mock.calls[16][0].label).toBe("Self Service Indicator");
          expect(Switch.mock.calls[16][0].disabled).toBe(true);
          expect(Switch.mock.calls[16][0].checked).toBe(true);
        });
      });
      describe("self service indicator - profile < 39", () => {
        test("checked === false", () => {
          profileEntryFormState.mockReturnValue({
            ...validProfileEntryFormState,
            formMode: formModes.UPDATE,
            profileId: 38
          });
          renderComponent();
          FormControlLabel.mock.calls.forEach(call => {
            render(call[0].control);
          });
          expect(FormControlLabel.mock.calls[16][0].label).toBe("Self Service Indicator");
          expect(Switch.mock.calls[16][0].disabled).toBe(true);
          expect(Switch.mock.calls[16][0].checked).toBe(false);
        });
      });
      describe("updateValue is called", () => {
        test("should call set form with SET_FORM_FIELD", () => {
          renderComponent();
          FormControlLabel.mock.calls.forEach(call => {
            render(call[0].control);
          });
          expect(FormControlLabel.mock.calls[11][0].label).toBe("Claim Number Edit");
          expect(Switch.mock.calls[11][0].checked).toBe(false);
          const onChange = Switch.mock.calls[11][0].onChange;
          onChange();
          expect(mockSetForm).toHaveBeenCalledTimes(1);
          expect(mockSetForm).toHaveBeenCalledWith({
            type: profileEntryFormActions.SET_FORM_FIELD,
            payload: {
              key: "claimNumberEdit",
              value: true
            }
          });
        });
      });
      describe("acwDataEntry is toggled to true", () => {
        test("CallTagFields is rendered", () => {
          renderComponent();
          FormControlLabel.mock.calls.forEach(call => {
            render(call[0].control);
          });
          expect(CallTagFields).toHaveBeenCalledTimes(1);
        });
      });
    });
  });
  describe("blank create form", () => {
    describe("Profile Id field", () => {
      test("initial values are as expected", () => {
        renderComponent();
        expect(CustomInput.mock.calls[0][0].label).toBe("Profile Id *");
        expectOnlyPassedProps(CustomInput, {
          disabled: false,
          label: "Profile Id *",
          maxLength: "3",
          name: undefined,
          value: undefined
        }, 0);
      });
    });
    describe("Profile Name field", () => {
      test("initial values are as expected", () => {
        renderComponent();
        expect(CustomInput.mock.calls[1][0].label).toBe("Profile Name *");
        expectOnlyPassedProps(CustomInput, {
          label: "Profile Name *",
          maxLength: "80",
          name: "",
          value: ""
        }, 1);
      });
    });
    describe("Operating Unit Dropdown", () => {
      test("initial values are as expected", () => {
        renderComponent();
        expect(Dropdown.mock.calls[0][0].label).toBe("Operating Unit *");
        expectOnlyPassedProps(Dropdown, {
          label: "Operating Unit *",
          disabled: false,
          options: mockOperatingUnits,
          value: undefined
        }, 0);
      });
    });
    describe("Activity Dropdown", () => {
      test("initial values are as expected", () => {
        renderComponent();
        expect(Dropdown.mock.calls[1][0].label).toBe("Activities *");
        expectOnlyPassedProps(Dropdown, {
          label: "Activities *",
          multiple: true,
          options: mockActivities,
          value: []
        }, 1);
      });
    });
    describe("Overflow Skill Dropdown", () => {
      test("initial values are as expected", () => {
        renderComponent();
        expect(Dropdown.mock.calls[2][0].label).toBe("Overflow Skill");
        expectOnlyPassedProps(Dropdown, {
          label: "Overflow Skill",
          options: mockSkills,
          value: ""
        }, 2);
      });
    });
    describe("Transfer Queues Dropdown", () => {
      test("initial values are as expected", () => {
        renderComponent();
        expect(Dropdown.mock.calls[3][0].label).toBe("Transfer Queues");
        expectOnlyPassedProps(Dropdown, {
          label: "Transfer Queues",
          multiple: true,
          options: mockTaskQueues,
          value: []
        }, 3);
      });
    });
    describe("Screenpops Dropdown", () => {
      test("initial values are as expected", () => {
        renderComponent();
        expect(Dropdown.mock.calls[4][0].label).toBe("Screenpops");
        expectOnlyPassedProps(Dropdown, {
          label: "Screenpops",
          multiple: true,
          options: mockScreenpops,
          value: []
        }, 4);
      });
    });
    describe("Access Group Dropdown", () => {
      test("initial values are as expected", () => {
        renderComponent();
        expect(Dropdown.mock.calls[5][0].label).toBe("Access Group");
        expectOnlyPassedProps(Dropdown, {
          label: "Access Group",
          options: [
            {
              label: "Create New Access Group",
              value: "create-new"
            },
            {
              label: "divider",
              value: "divider"
            },
            ...mockAccessGroups
          ],
          value: ""
        }, 5);
      });
    });
    describe("Forward To Field", () => {
      test("initial values are as expected", () => {
        renderComponent();
        expect(PhoneNumberInput.mock.calls[0][0].label).toBe("Forward To Number");
        expectOnlyPassedProps(PhoneNumberInput, {
          label: "Forward To Number",
          allowSevenDigitVdn: false,
          number: ""
        }, 0);
      });
    });
  });
});