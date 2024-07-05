import { ProfileFormFields } from "../ProfileFormFields";
import React from "react";
import {
  render,
  setupMockedComponents,
  initialProfileEntryFormState,
  initialSkillState,
  initialTestState,
  expectOnlyPassedProps,
  validProfileEntryFormState
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

  describe("Valid Form Initial State", () => {
    beforeEach(() => {
      profileEntryFormState.mockReturnValue(validProfileEntryFormState);
    });
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
    describe("Profile Id field", () => {
      test("initial values are as expected", () => {
        renderComponent();
        expect(CustomInput.mock.calls[0][0].label).toBe("Profile Id *");
        expectOnlyPassedProps(CustomInput, {
          disabled: false,
          label: "Profile Id *",
          maxLength: "80",
          name: undefined,
          value: undefined
        }, 0);
      });
      describe("updateValue is called", () => {
        describe("value is a number", () => {
          test("should call set form with SET_FORM_FIELD", () => {
            renderComponent();
            const updateValue = CustomInput.mock.calls[0][0].updateValue;
            updateValue("15");
            expect(mockSetForm).toHaveBeenCalledTimes(2);
            expect(mockSetForm).toHaveBeenCalledWith({
              type: profileEntryFormActions.SET_FORM_FIELD,
              payload: {
                key: "profileId",
                value: 15
              }
            });
            expect(mockSetForm).toHaveBeenCalledWith({
              type: profileEntryFormActions.SET_FORM_FIELD,
              payload: {
                key: "updated",
                value: true
              }
            });
          });
        });
        describe("value is not a number", () => {
          test("should not call set form with SET_FORM_FIELD", () => {
            renderComponent();

          });
        });
      });
    });
    describe("Profile Id field", () => {
      test("initial values are as expected", () => {
        renderComponent();

      });
      describe("updateValue is called", () => {
        test("should call set form with SET_FORM_FIELD", () => {
          renderComponent();

        });
      });
    });
  });
  describe("Operating Unit Dropdown", () => {
    test("initial values are as expected", () => {
      renderComponent();

    });
    describe("updateValue is called", () => {
      test("should call set form with SET_FORM_FIELD", () => {
        renderComponent();

      });
    });
  });
  describe("Overflow Skill Dropdown", () => {
    test("initial values are as expected", () => {
      renderComponent();

    });
    describe("updateValue is called", () => {
      test("should call set form with SET_FORM_FIELD", () => {
        renderComponent();

      });
    });
  });
  describe("Activity Dropdown", () => {
    test("initial values are as expected", () => {
      renderComponent();

    });
    describe("updateValue is called", () => {
      test("should call set form with SET_FORM_FIELD", () => {
        renderComponent();

      });
    });
  });
  describe("Transfer Queues Dropdown", () => {
    test("initial values are as expected", () => {
      renderComponent();

    });
    describe("updateValue is called", () => {
      test("should call set form with SET_FORM_FIELD", () => {
        renderComponent();

      });
    });
  });
  describe("Screenpops Dropdown", () => {
    test("initial values are as expected", () => {
      renderComponent();

    });
    describe("updateValue is called", () => {
      test("should call set form with SET_FORM_FIELD", () => {
        renderComponent();

      });
    });
  });
  describe("Access Group Dropdown", () => {
    test("initial values are as expected", () => {
      renderComponent();

    });
    describe("updateValue is called", () => {
      describe("value === create-new", () => {
        test("should render new access group fields", () => {
          renderComponent();

        });
        describe("New Access Group Name field", () => {
          test("initial values are as expected", () => {
            renderComponent();

          });
          describe("updateValue is called", () => {
            test("should call set form with SET_FORM_FIELD", () => {
              renderComponent();

            });
          });
        });
        describe("Twilio Dashboard Url field", () => {
          test("initial values are as expected", () => {
            renderComponent();

          });
          describe("updateValue is called", () => {
            test("should call set form with SET_FORM_FIELD", () => {
              renderComponent();

            });
          });
        });
      });
      describe("value !== create-new", () => {
        test("should call set form with SET_FORM_FIELD", () => {
          renderComponent();

        });
      });
    });
  });
  describe("Forward To Field", () => {
    test("initial values are as expected", () => {
      renderComponent();

    });
    describe("updateValue is called", () => {
      test("should call set form with SET_FORM_FIELD", () => {
        renderComponent();

      });
    });
  });
  describe("Toggle fields", () => {
    test("initial values are as expected", () => {
    //include self service seperately
      renderComponent();

    });
    describe("updateValue is called", () => {
      test("should call set form with SET_FORM_FIELD", () => {
        renderComponent();

      });
    });
    describe("acwDataEntry is toggled to true", () => {
      test("CallTagFields is rendered", () => {
        renderComponent();

      });
    });
  });
});
