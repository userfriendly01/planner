import WfmForm from "../WfmForm";
import React from "react";
import {
  useAdminState,
  userFormActions,
  useFormState,
  useFormDispatch
} from "context";
import {
  Dropdown,
  NNumberInput
} from "components";
import {
  FormGroup,
  FormControlLabel,
  InputAdornment,
  TextareaAutosize,
  TextField,
  IconButton,
  Tooltip
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import WFMLoadRetryModal from "../../../BulkChanges/WFMLoadRetryModal";
import {
  initialFormState,
  initialTestState,
  setupMockedComponents,
  act,
  render
} from "testUtils";
import {
  getWfmTeams,
  daysOfTheWeekOptions
} from "utils";

jest.mock("context", () => ({
  useAdminState: jest.fn(),
  userFormActions: jest.requireActual("context").userFormActions,
  useFormState: jest.fn(),
  useFormDispatch: jest.fn()
}));

jest.mock("components", () => ({
  Dropdown: jest.fn(),
  NNumberInput: jest.fn(),
  StyledButton: jest.fn()
}));

jest.mock("@mui/material", () => ({
  FormGroup: jest.fn(),
  FormControlLabel: jest.fn(),
  InputAdornment: jest.requireActual("@mui/material").InputAdornment,
  TextareaAutosize: jest.fn(),
  TextField: jest.fn(),
  IconButton: jest.fn(),
  Tooltip: jest.fn(),
  Paper: jest.fn()
}));

jest.mock("@mui/x-date-pickers/DatePicker", () => ({
  DatePicker: jest.fn()
}));

jest.mock("../../../BulkChanges/WFMLoadRetryModal", () => ({
  __esModule: true,
  default: jest.fn()
}));

const mockSetForm = jest.fn();

test("boo", () => {
  expect(true).toBe(true);
});

const renderComponent = () => {
  return render(
    <WfmForm />
  );
};

const BusinessUnitId = "123-321";

describe("<WfmForm />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useFormDispatch.mockReturnValue(mockSetForm);
    useFormState.mockReturnValue({
      ...initialFormState,
      triton: {
        ...initialFormState.triton,
        userFound: false
      }
    });
    useAdminState.mockReturnValue(initialTestState);
    setupMockedComponents({
      Dropdown,
      DatePicker,
      TextField,
      TextareaAutosize
    });
  });
  describe("initial render", () => {
    describe("wfmoptions and wfmOrg are not loaded", () => {
      test("should render with the WFM Load Retry Modal", () => {
        const stateWithoutWfm = {
          ...initialTestState,
          calabrioContext: {
            ...initialTestState.calabrioContext,
            wfmOptions: [],
            wfmOrg: []
          }
        };
        useAdminState.mockReturnValue(stateWithoutWfm);
        renderComponent();
        expect(WFMLoadRetryModal).toHaveBeenCalled();
        expect(Dropdown).not.toHaveBeenCalled();
        expect(DatePicker).not.toHaveBeenCalled();
        expect(TextField).not.toHaveBeenCalled();
      });
    });
    describe("wfmoptions and wfmOrg are loaded", () => {
      test("should render as expected", () => {
        renderComponent();
        expect(Dropdown.mock.calls.length).toBe(32); //renders twice
        expect(Dropdown.mock.calls[0][0].label).toBe("Business Unit *");
        expect(Dropdown.mock.calls[1][0].label).toBe("Team");
        expect(Dropdown.mock.calls[2][0].label).toBe("First Day of the Week *");
        expect(Dropdown.mock.calls[3][0].label).toBe("Roles");
        expect(Dropdown.mock.calls[4][0].label).toBe("Skills");
        expect(Dropdown.mock.calls[5][0].label).toBe("Workflow Control Set");
        expect(Dropdown.mock.calls[6][0].label).toBe("Optional Columns");
        expect(Dropdown.mock.calls[7][0].label).toBe("Absence");
        expect(Dropdown.mock.calls[8][0].label).toBe("Budget Group");
        expect(Dropdown.mock.calls[9][0].label).toBe("Part Time Percentage");
        expect(Dropdown.mock.calls[10][0].label).toBe("Contract Schedule");
        expect(Dropdown.mock.calls[11][0].label).toBe("Contract");
        expect(Dropdown.mock.calls[12][0].label).toBe("Shift Bag");
        expect(Dropdown.mock.calls[13][0].label).toBe("Rotation");
        expect(Dropdown.mock.calls[14][0].label).toBe("Rotation Start Week");
        expect(Dropdown.mock.calls[15][0].label).toBe("Availability");
        expect(TextField.mock.calls.length).toBe(2); //renders twice
        expect(TextField.mock.calls[0][0].label).toBe("Identity");
        expect(DatePicker.mock.calls.length).toBe(10); //renders twice
        expect(DatePicker.mock.calls[0][0].label).toBe("Team Start Date");
        expect(DatePicker.mock.calls[1][0].label).toBe("Person Start Date");
        expect(DatePicker.mock.calls[2][0].label).toBe("Skills Start Date");
        expect(DatePicker.mock.calls[3][0].label).toBe("Rotation Start Date");
        expect(DatePicker.mock.calls[4][0].label).toBe("Availability Start Date");
        expect(TextareaAutosize.mock.calls.length).toBe(2); //renders twice
        expect(TextareaAutosize.mock.calls[0][0].placeholder).toBe("Notes");
      });
    });
  });
  describe("Business Unit Dropdown", () => {
    describe("disable", () => {
      test("is not disabled when formmode is insert", () => {
        renderComponent();
        const buDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Business Unit *");
        const buDropdown = buDropdowns[buDropdowns.length-1][0];
        expect(buDropdown.disabled).toBe(false);
      });
      test("is disabled when formmode is not insert", () => {
        const formState = {
          ...initialFormState,
          formMode: "update"
        };
        useFormState.mockReturnValue(formState);
        renderComponent();
        const buDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Business Unit *");
        const buDropdown = buDropdowns[buDropdowns.length-1][0];
        expect(buDropdown.disabled).toBe(true);
      });
    });
    test("options", () => {
      renderComponent();
      const buDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Business Unit *");
      const buDropdown = buDropdowns[buDropdowns.length-1][0];
      expect(buDropdown.options).toEqual([{
        value: "123-321",
        label: "Cool WFM Business Unit",
        Id: "123-321",
        Name: "Cool WFM Business Unit"
      },
      {
        value: "999-999",
        label: "Other WFM Business Unit",
        Id: "999-999",
        Name: "Other WFM Business Unit"
      },
      {
        value: "People_Without_Team",
        label: "People_Without_Team",
        Id: "People_Without_Team",
        Name: "People_Without_Team"
      }]);
    });
    test("updateValue calls setForm", () => {
      renderComponent();
      const buDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Business Unit *");
      const buDropdown = buDropdowns[buDropdowns.length-1][0];
      const updateValue = buDropdown.updateValue;
      act(() => updateValue({}, { value: "123-321" }));
      expect(mockSetForm).toHaveBeenLastCalledWith({
        type: userFormActions.SET_WFM_BUSINESS_UNIT,
        payload: "123-321"
      });
    });
  });
  describe("Team Fields", () => {
    describe("Team", () => {
      describe("disable", () => {
        test("is not disabled when formmode is insert", () => {
          renderComponent();
          const teamDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Team");
          const teamDropdown = teamDropdowns[teamDropdowns.length-1][0];
          expect(teamDropdown.disabled).toBe(false);
        });
        test("is disabled when formmode is not insert", () => {
          const formState = {
            ...initialFormState,
            formMode: "update"
          };
          useFormState.mockReturnValue(formState);
          renderComponent();
          const teamDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Team");
          const teamDropdown = teamDropdowns[teamDropdowns.length-1][0];
          expect(teamDropdown.disabled).toBe(true);
        });
      });
      test("options", () => {
        renderComponent();
        const teamDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Team");
        const teamDropdown = teamDropdowns[teamDropdowns.length-1][0];
        const expectedRawOptions = getWfmTeams(initialTestState);
        const expectedDropdownOptions = expectedRawOptions.map(o => {
          return {
            ...o,
            label: o.Name,
            value: o.Id
          }
        });
        expect(teamDropdown.options).toStrictEqual(expectedDropdownOptions);
      });
      test("updateValue updates team fields", () => {
        renderComponent();
        let teamDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Team");
        let teamDropdown = teamDropdowns[teamDropdowns.length-1][0];
        const updateValue = teamDropdown.updateValue;
        act(() => updateValue({}, { value: "111" }));
        teamDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Team");
        teamDropdown = teamDropdowns[teamDropdowns.length-1][0];
        expect(teamDropdown.value.Id).toBe("111");
      });
    });
    describe("Team Start Date", () => {
      describe("disable", () => {
        test("is not disabled when formmode is insert", () => {
          renderComponent();
          const teamDatePickers = DatePicker.mock.calls.filter((m) => m[0].label === "Team Start Date");
          const teamDatePicker = teamDatePickers[teamDatePickers.length-1][0];
          expect(teamDatePicker.disabled).toBe(false);
        });
        test("is disabled when formmode is not insert", () => {
          const formState = {
            ...initialFormState,
            formMode: "update"
          };
          useFormState.mockReturnValue(formState);
          renderComponent();
          const teamDatePickers = DatePicker.mock.calls.filter((m) => m[0].label === "Team Start Date");
          const teamDatePicker = teamDatePickers[teamDatePickers.length-1][0];
          expect(teamDatePicker.disabled).toBe(true);
        });
      });
      test("onChange updates team fields", () => {
        renderComponent();
        let teamDatePickers = DatePicker.mock.calls.filter((m) => m[0].label === "Team Start Date");
        let teamDatePicker = teamDatePickers[teamDatePickers.length-1][0];
        const onChange = teamDatePicker.onChange;
        act(() => onChange("12/23/2023"));
        teamDatePickers = DatePicker.mock.calls.filter((m) => m[0].label === "Team Start Date");
        teamDatePicker = teamDatePickers[teamDatePickers.length-1][0];
        expect(teamDatePicker.value).toBe("12/23/2023");
      });
    });
    describe("Error fields", () => {
      describe("team field is populated but team start date is not", () => {
        test("team start date error should === true", () => {
          renderComponent();
          let teamDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Team");
          let teamDropdown = teamDropdowns[teamDropdowns.length-1][0];
          const updateValue = teamDropdown.updateValue;
          act(() => updateValue({}, { value: "111" }));
          const teamDatePickers = DatePicker.mock.calls.filter((m) => m[0].label === "Team Start Date");
          const teamDatePicker = teamDatePickers[teamDatePickers.length-1][0];
          render(teamDatePicker.renderInput());
          const textFieldLength = TextField.mock.calls.length;
          const textField = TextField.mock.calls[textFieldLength-1][0];
          expect(textField.error).toBe(true);
        })
      });
      describe("team start date field is populated but team is not", () => {
        test("team error should === true", () => {
          renderComponent();
          let teamDatePickers = DatePicker.mock.calls.filter((m) => m[0].label === "Team Start Date");
          let teamDatePicker = teamDatePickers[teamDatePickers.length-1][0];
          const onChange = teamDatePicker.onChange;
          act(() => onChange("12/23/2023"));
          const teamDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Team");
          const teamDropdown = teamDropdowns[teamDropdowns.length-1][0];
          expect(teamDropdown.error).toBe(true);
        })
      });
    });
    describe("Both Fields are populated", () => {
      test("should call setForm", () => {
        renderComponent();
        let teamDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Team");
        let teamDropdown = teamDropdowns[teamDropdowns.length-1][0];
        const updateValue = teamDropdown.updateValue;
        act(() => updateValue({}, { value: "111" }));
        let teamDatePickers = DatePicker.mock.calls.filter((m) => m[0].label === "Team Start Date");
        let teamDatePicker = teamDatePickers[teamDatePickers.length-1][0];
        const onChange = teamDatePicker.onChange;
        act(() => onChange("12/23/2023"));
        teamDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Team");
        teamDropdown = teamDropdowns[teamDropdowns.length-1][0];
        expect(teamDropdown.error).toBe(false);
        teamDatePickers = DatePicker.mock.calls.filter((m) => m[0].label === "Team Start Date");
        teamDatePicker = teamDatePickers[teamDatePickers.length-1][0];
        render(teamDatePicker.renderInput());
        const textFieldLength = TextField.mock.calls.length;
        const textField = TextField.mock.calls[textFieldLength-1][0];
        expect(textField.error).toBe(false);
        expect(mockSetForm).toHaveBeenLastCalledWith({
          type: userFormActions.SET_WFM_TEAM,
          payload: {
            id: "111",
            startDate: "12/23/2023"
          }
        });
      });
    });
  });
  describe("Identity Field", () => {
    describe("disable", () => {
      test("is not disabled when formmode is insert", () => {
        renderComponent();
        const identityFields = TextField.mock.calls.filter((m) => m[0].label === "Identity");
        const identityField = identityFields[identityFields.length-1][0];
        expect(identityField.disabled).toBe(false);
      });
      test("is disabled when formmode is not insert", () => {
        const formState = {
          ...initialFormState,
          formMode: "update"
        };
        useFormState.mockReturnValue(formState);
        renderComponent();
        const identityFields = TextField.mock.calls.filter((m) => m[0].label === "Identity");
        const identityField = identityFields[identityFields.length-1][0];
        expect(identityField.disabled).toBe(true);
      });
    });
    describe("InputProps", () => {
      describe("initial render", () => {
        test("should render as expected", () => {
          renderComponent();
          const identityFields = TextField.mock.calls.filter((m) => m[0].label === "Identity");
          const identityField = identityFields[identityFields.length-1][0];
          render(identityField.InputProps.endAdornment);
          expect(Tooltip.mock.calls.length).toBe(1);
          expect(Tooltip.mock.calls[0][0].title).toBe("Use HR Email");
          render(Tooltip.mock.calls[0][0].children);
          expect(IconButton.mock.calls.length).toBe(1);
        })
      });
      describe("Icon Button is clicked", () => {
        test("should call setForm", () => {
          const formState = {
            ...initialFormState,
            nNumber: {
              ...initialFormState.nNumber,
              nNumberFetchedUser: {
                email: "Billybob@mibertymutual.com"
              }
            }
          };
          useFormState.mockReturnValue(formState);

          renderComponent();
          const identityFields = TextField.mock.calls.filter((m) => m[0].label === "Identity");
          const identityField = identityFields[identityFields.length-1][0];
          render(identityField.InputProps.endAdornment);
          render(Tooltip.mock.calls[0][0].children);
          const onClick = IconButton.mock.calls[0][0].onClick;
          act(() => onClick());

          expect(mockSetForm).toHaveBeenLastCalledWith({
            type: userFormActions.SET_WFM_IDENTITY,
            payload: "Billybob@mibertymutual.com"
          });
        });
      });
    });
    test("onChange calls setForm", () => {
      renderComponent();
      const identityFields = TextField.mock.calls.filter((m) => m[0].label === "Identity");
      const identityField = identityFields[identityFields.length-1][0];
      const onChange = identityField.onChange;
      act(() => onChange({ 
        target: {
          value: "faith.cuneo@libertymutual.com"
        }
       }));
      expect(mockSetForm).toHaveBeenLastCalledWith({
        type: userFormActions.SET_WFM_IDENTITY,
        payload: "faith.cuneo@libertymutual.com"
      });
    });
  });
  describe("First Day of the Week Dropdown", () => {
    describe("disable", () => {
      test("is not disabled when formmode is insert", () => {
        renderComponent();
        const firstDayDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "First Day of the Week *");
        const firstDayDropdown = firstDayDropdowns[firstDayDropdowns.length-1][0];
        expect(firstDayDropdown.disabled).toBe(false);
      });
      test("is disabled when formmode is not insert", () => {
        const formState = {
          ...initialFormState,
          formMode: "update"
        };
        useFormState.mockReturnValue(formState);
        renderComponent();
        const firstDayDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "First Day of the Week *");
        const firstDayDropdown = firstDayDropdowns[firstDayDropdowns.length-1][0];
        expect(firstDayDropdown.disabled).toBe(true);
      });
    });
    test("options", () => {
      renderComponent();
      const firstDayDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "First Day of the Week *");
      const firstDayDropdown = firstDayDropdowns[firstDayDropdowns.length-1][0];
      expect(firstDayDropdown.options).toEqual(daysOfTheWeekOptions);
    });
    test("updateValue calls setForm", () => {
      renderComponent();
      const firstDayDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "First Day of the Week *");
      const firstDayDropdown = firstDayDropdowns[firstDayDropdowns.length-1][0];
      const updateValue = firstDayDropdown.updateValue;
      act(() => updateValue({}, 1));
      expect(mockSetForm).toHaveBeenLastCalledWith({
        type: userFormActions.SET_WFM_FIRST_DAY_OF_WEEK,
        payload: 1
      });
    });
  });
  describe("Roles", () => {
    describe("disable", () => {
      test("is not disabled when formmode is insert", () => {
        renderComponent();
        const rolesDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Roles");
        const rolesDropdown = rolesDropdowns[rolesDropdowns.length-1][0];
        expect(rolesDropdown.disabled).toBe(false);
      });
      test("is disabled when formmode is not insert", () => {
        const formState = {
          ...initialFormState,
          formMode: "update"
        };
        useFormState.mockReturnValue(formState);
        renderComponent();
        const rolesDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Roles");
        const rolesDropdown = rolesDropdowns[rolesDropdowns.length-1][0];
        expect(rolesDropdown.disabled).toBe(true);
      });
    });
    test("options", () => {
      const formState = {
        ...initialFormState,
        calabrio_wfm: {
          ...initialFormState.calabrio_wfm,
          BusinessUnitId
        }
      };
      useFormState.mockReturnValue(formState);
      renderComponent();
      const rolesDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Roles");
      const rolesDropdown = rolesDropdowns[rolesDropdowns.length-1][0];
      const expectedRawOptions = initialTestState.calabrioContext.wfmOptions.find(bu => bu.Id === BusinessUnitId).Roles;
      const expectedDropdownOptions = expectedRawOptions.map(o => {
        return {
          ...o,
          label: o.Name,
          value: o.Id
        }
      })
      expect(rolesDropdown.options).toEqual(expectedDropdownOptions);
    });
    test("updateValue calls setForm", () => {
      renderComponent();
      const rolesDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Roles");
      const rolesDropdown = rolesDropdowns[rolesDropdowns.length-1][0];
      const updateValue = rolesDropdown.updateValue;
      act(() => updateValue({}, ["111"]));
      expect(mockSetForm).toHaveBeenLastCalledWith({
        type: userFormActions.SET_WFM_ROLES,
        payload: ["111"]
      });
    });
  });
  describe("Skill Fields", () => {
    describe("Skills", () => {
      describe("disable", () => {
        test("is not disabled when formmode is insert", () => {
          renderComponent();
          const skillsDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Skills");
          const skillsDropdown = skillsDropdowns[skillsDropdowns.length-1][0];
          expect(skillsDropdown.disabled).toBe(false);
        });
        test("is disabled when formmode is not insert", () => {
          const formState = {
            ...initialFormState,
            formMode: "update"
          };
          useFormState.mockReturnValue(formState);
          renderComponent();
          const skillsDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Skills");
          const skillsDropdown = skillsDropdowns[skillsDropdowns.length-1][0];
          expect(skillsDropdown.disabled).toBe(true);
        });
      });
      test("options", () => {
        const formState = {
          ...initialFormState,
          calabrio_wfm: {
            ...initialFormState.calabrio_wfm,
            BusinessUnitId
          }
        };
        useFormState.mockReturnValue(formState);
        renderComponent();
        const skillsDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Skills");
        const skillsDropdown = skillsDropdowns[skillsDropdowns.length-1][0];
        const expectedRawOptions = initialTestState.calabrioContext.wfmOptions.find(bu => bu.Id === BusinessUnitId).Skills;
        const expectedDropdownOptions = expectedRawOptions.map(o => {
          return {
            ...o,
            label: o.Name,
            value: o.Id
          }
        });
        expect(skillsDropdown.options).toEqual(expectedDropdownOptions);
      });
      test("updateValue calls setForm", () => {
        renderComponent();
        let skillsDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Skills");
        let skillsDropdown = skillsDropdowns[skillsDropdowns.length-1][0];
        const updateValue = skillsDropdown.updateValue;
        act(() => updateValue({}, [{
          Id: "222",
          Name: "Skill2"
        }]));
        skillsDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Skills");
        skillsDropdown = skillsDropdowns[skillsDropdowns.length-1][0];
        expect(skillsDropdown.value).toStrictEqual([{
          Id: "222",
          Name: "Skill2",
          label: "Skill2",
          value:  "222"
        }]);
      });
    });
    describe("Skills Start Date", () => {
      describe("disable", () => {
        test("is not disabled when formmode is insert", () => {
          renderComponent();
          const skillDatePickers = DatePicker.mock.calls.filter((m) => m[0].label === "Skills Start Date");
          const skillDatePicker = skillDatePickers[skillDatePickers.length-1][0];
          expect(skillDatePicker.disabled).toBe(false);
        });
        test("is disabled when formmode is not insert", () => {
          const formState = {
            ...initialFormState,
            formMode: "update"
          };
          useFormState.mockReturnValue(formState);
          renderComponent();
          const skillDatePickers = DatePicker.mock.calls.filter((m) => m[0].label === "Skills Start Date");
          const skillDatePicker = skillDatePickers[skillDatePickers.length-1][0];
          expect(skillDatePicker.disabled).toBe(true);
        });
      });
      test("onChange updates team fields", () => {
        renderComponent();
        let skillDatePickers = DatePicker.mock.calls.filter((m) => m[0].label === "Skills Start Date");
        let skillDatePicker = skillDatePickers[skillDatePickers.length-1][0];
        const onChange = skillDatePicker.onChange;
        act(() => onChange("12/23/2023"));
        skillDatePickers = DatePicker.mock.calls.filter((m) => m[0].label === "Skills Start Date");
        skillDatePicker = skillDatePickers[skillDatePickers.length-1][0];
        expect(skillDatePicker.value).toBe("12/23/2023");
      });
    });
    describe("Error fields", () => {
      describe("team field is populated but team start date is not", () => {
        test("team start date error should === true", () => {
          renderComponent();
          let skillsDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Skills");
          let skillsDropdown = skillsDropdowns[skillsDropdowns.length-1][0];
          const updateValue = skillsDropdown.updateValue;
          act(() => updateValue({}, [{
            Id: "222",
            Name: "Skill2"
          }]));
          const skillDatePickers = DatePicker.mock.calls.filter((m) => m[0].label === "Skills Start Date");
          const skillDatePicker = skillDatePickers[skillDatePickers.length-1][0];
          render(skillDatePicker.renderInput());
          const textFieldLength = TextField.mock.calls.length;
          const textField = TextField.mock.calls[textFieldLength-1][0];
          expect(textField.error).toBe(true);
        })
      });
      describe("team start date field is populated but team is not", () => {
        test("team error should === true", () => {
          renderComponent();
          let skillDatePickers = DatePicker.mock.calls.filter((m) => m[0].label === "Skills Start Date");
          let skillDatePicker = skillDatePickers[skillDatePickers.length-1][0];
          const onChange = skillDatePicker.onChange;
          act(() => onChange("12/23/2023"));
          let skillsDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Skills");
          let skillsDropdown = skillsDropdowns[skillsDropdowns.length-1][0];
          expect(skillsDropdown.error).toBe(true);
        })
      });
    });
    describe("Both Fields are populated", () => {
      test("should call setForm", () => {
        renderComponent();
        let skillsDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Skills");
        let skillsDropdown = skillsDropdowns[skillsDropdowns.length-1][0];
        const updateValue = skillsDropdown.updateValue;
        act(() => updateValue({}, [{
          Id: "222",
          Name: "Skill2"
        }]));
        let skillDatePickers = DatePicker.mock.calls.filter((m) => m[0].label === "Skills Start Date");
        let skillDatePicker = skillDatePickers[skillDatePickers.length-1][0];
        const onChange = skillDatePicker.onChange;
        act(() => onChange("12/23/2023"));
        skillsDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Skills");
        skillsDropdown = skillsDropdowns[skillsDropdowns.length-1][0];
        expect(skillsDropdown.error).toBe(false);
        skillDatePickers = DatePicker.mock.calls.filter((m) => m[0].label === "Skills Start Date");
        skillDatePicker = skillDatePickers[skillDatePickers.length-1][0];
        render(skillDatePicker.renderInput());
        const textFieldLength = TextField.mock.calls.length;
        const textField = TextField.mock.calls[textFieldLength-1][0];
        expect(textField.error).toBe(false);
        expect(mockSetForm).toHaveBeenLastCalledWith({
          type: userFormActions.SET_WFM_SKILLS,
          payload: {
            skills: [{
              Id: "222",
              Name: "Skill2"
            }],
            startDate: "12/23/2023"
          }
        });
      });
    });
  });
  describe("Workflow Control Set", () => {
    describe("disable", () => {
      test("is not disabled when formmode is insert", () => {
        renderComponent();
        const controlSetDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Workflow Control Set");
        const controlSetDropdown = controlSetDropdowns[controlSetDropdowns.length-1][0];
        expect(controlSetDropdown.disabled).toBe(false);
      });
      test("is disabled when formmode is not insert", () => {
        const formState = {
          ...initialFormState,
          formMode: "update"
        };
        useFormState.mockReturnValue(formState);
        renderComponent();
        const controlSetDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Workflow Control Set");
        const controlSetDropdown = controlSetDropdowns[controlSetDropdowns.length-1][0];
        expect(controlSetDropdown.disabled).toBe(true);
      });
    });
    test("options", () => {
      renderComponent();
      const controlSetDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Workflow Control Set");
      const controlSetDropdown = controlSetDropdowns[controlSetDropdowns.length-1][0];
      const expectedRawOptions = initialTestState.calabrioContext.wfmOptions.find(bu => bu.Id === BusinessUnitId).Workflow_Control_Sets;
      const expectedDropdownOptions = expectedRawOptions.map(o => {
        return {
          ...o,
          label: o.Name,
          value: o.Id
        }
      })
      expect(controlSetDropdown.options).toEqual(expectedDropdownOptions);
    });
    test("updateValue calls setForm", () => {
      renderComponent();
      const controlSetDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Workflow Control Set");
      const controlSetDropdown = controlSetDropdowns[controlSetDropdowns.length-1][0];
      const updateValue = controlSetDropdown.updateValue;
      act(() => updateValue({}, { value: "111" }));
      expect(mockSetForm).toHaveBeenLastCalledWith({
        type: userFormActions.SET_WFM_CONTROL_SET,
        payload: "111"
      });
    });
  });
  describe("Optional Columns", () => {
    describe("disable", () => {
      test("is not disabled when formmode is insert", () => {
        renderComponent();
        const columnsDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Optional Columns");
        const columnsDropdown = columnsDropdowns[columnsDropdowns.length-1][0];
        expect(columnsDropdown.disabled).toBe(false);
      });
      test("is disabled when formmode is not insert", () => {
        const formState = {
          ...initialFormState,
          formMode: "update"
        };
        useFormState.mockReturnValue(formState);
        renderComponent();
        const columnsDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Optional Columns");
        const columnsDropdown = columnsDropdowns[columnsDropdowns.length-1][0];
        expect(columnsDropdown.disabled).toBe(true);
      });
    });
    test("options", () => {
      const formState = {
        ...initialFormState,
        calabrio_wfm: {
          ...initialFormState.calabrio_wfm,
          BusinessUnitId
        }
      };
      useFormState.mockReturnValue(formState);
      renderComponent();
      const columnsDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Optional Columns");
      const columnsDropdown = columnsDropdowns[columnsDropdowns.length-1][0];
      const expectedRawOptions = initialTestState.calabrioContext.wfmOptions.find(bu => bu.Id === BusinessUnitId).Optional_Columns;
      const expectedDropdownOptions = expectedRawOptions.map(o => {
        return {
          ...o,
          label: o.Name,
          value: o.Id
        }
      })
      expect(columnsDropdown.options).toEqual(expectedDropdownOptions);
    });
    test("updateValue adds to optionalColumns", () => {
      renderComponent();
      const columnOption = {
        value: "222",
        label: "OptionalCol2",
        Id: "222",
        Name: "OptionalCol2"
      };
      let columnsDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Optional Columns");
      let columnsDropdown = columnsDropdowns[columnsDropdowns.length-1][0];
      const updateValue = columnsDropdown.updateValue;
      act(() => updateValue({}, [columnOption]));
      columnsDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Optional Columns");
      columnsDropdown = columnsDropdowns[columnsDropdowns.length-1][0];
      expect(columnsDropdown.value).toStrictEqual([{
        ...columnOption,
        columnValue: ""
      }]);
      let optionalColumnFields = TextField.mock.calls.filter((m) => m[0]?.label === `${columnOption.Name} value *`);
      let optionalColumnField = optionalColumnFields[optionalColumnFields.length-1][0];
      expect(optionalColumnField.value).toBe("");
      expect(optionalColumnField.error).toBe(true);
    });
    test("updating optional column value calls setForm", () => {
      renderComponent();
      const columnOption1 = {
        value: "111",
        label: "OptionalCol1",
        Id: "111",
        Name: "OptionalCol1"
      };
      const columnOption2 = {
        value: "222",
        label: "OptionalCol2",
        Id: "222",
        Name: "OptionalCol2"
      };
      let columnsDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Optional Columns");
      let columnsDropdown = columnsDropdowns[columnsDropdowns.length-1][0];
      const updateValue = columnsDropdown.updateValue;
      act(() => updateValue({}, [ columnOption1, columnOption2 ]));
      columnsDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Optional Columns");
      columnsDropdown = columnsDropdowns[columnsDropdowns.length-1][0];

      let optionalColumnFields = TextField.mock.calls.filter((m) => m[0]?.label === `${columnOption2.Name} value *`);
      let optionalColumnField = optionalColumnFields[optionalColumnFields.length-1][0];
      const valueOnChange = optionalColumnField.onChange;
      act(() => valueOnChange({
        target: {
          value: "kittens"
        }
      }))
      optionalColumnFields = TextField.mock.calls.filter((m) => m[0]?.label === `${columnOption2.Name} value *`);
      optionalColumnField = optionalColumnFields[optionalColumnFields.length-1][0];
      expect(optionalColumnField.value).toBe("kittens");
      expect(optionalColumnField.error).toBe(false);
      columnsDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Optional Columns");
      columnsDropdown = columnsDropdowns[columnsDropdowns.length-1][0];
      expect(columnsDropdown.value).toStrictEqual([
        {
          ...columnOption1,
          columnValue: ""
        },
        {
          ...columnOption2,
          columnValue: "kittens"
        }
      ]);
      expect(mockSetForm).toHaveBeenLastCalledWith({
        type: userFormActions.SET_WFM_OPTIONAL_COLUMNS,
        payload: [
          {
            Id: '222',
            Value: 'kittens'
          }
        ]
      });
    });
  });
  describe("Notes", () => {
    describe("disable", () => {
      test("is not disabled when formmode is insert", () => {
        renderComponent();
        const noteFields = TextareaAutosize.mock.calls;
        const noteField = noteFields[noteFields.length-1][0];
        expect(noteField.disabled).toBe(false);
      });
      test("is disabled when formmode is not insert", () => {
        const formState = {
          ...initialFormState,
          formMode: "update"
        };
        useFormState.mockReturnValue(formState);
        renderComponent();
        const noteFields = TextareaAutosize.mock.calls;
        const noteField = noteFields[noteFields.length-1][0];
        expect(noteField.disabled).toBe(true);
      });
    });
    test("onChange calls setForm", () => {
      renderComponent();
      const noteFields = TextareaAutosize.mock.calls;
      const noteField = noteFields[noteFields.length-1][0];
      const onChange = noteField.onChange;
      act(() => onChange({ 
        target: {
          value: "surprise!"
        }
       }));
      expect(mockSetForm).toHaveBeenLastCalledWith({
        type: userFormActions.SET_WFM_NOTE,
        payload: "surprise!"
      });
    });
  });
  describe("Absence", () => {});
  describe("Budget Group", () => {});
  describe("Shift Bag", () => {});
  describe("Schedule Fields", () => {
    describe("Person start date", () => {
      describe("disable", () => {
        test("is not disabled when formmode is insert", () => {
          renderComponent();
          const personDatePickers = DatePicker.mock.calls.filter((m) => m[0].label === "Person Start Date");
          const personDatePicker = personDatePickers[personDatePickers.length-1][0];
          expect(personDatePicker.disabled).toBe(false);
        });
        test("is disabled when formmode is not insert", () => {
          const formState = {
            ...initialFormState,
            formMode: "update"
          };
          useFormState.mockReturnValue(formState);
          renderComponent();
          const personDatePickers = DatePicker.mock.calls.filter((m) => m[0].label === "Person Start Date");
          const personDatePicker = personDatePickers[personDatePickers.length-1][0];
          expect(personDatePicker.disabled).toBe(true);
        });
      });
      test("onChange updates team fields", () => {
        renderComponent();
        let personDatePickers = DatePicker.mock.calls.filter((m) => m[0].label === "Person Start Date");
        let personDatePicker = personDatePickers[personDatePickers.length-1][0];
        const onChange = personDatePicker.onChange;
        act(() => onChange("12/23/2023"));
        personDatePickers = DatePicker.mock.calls.filter((m) => m[0].label === "Person Start Date");
        personDatePicker = personDatePickers[personDatePickers.length-1][0];
        expect(mockSetForm).toHaveBeenLastCalledWith({
          type: userFormActions.SET_WFM_EMP_START_DATE,
          payload: "12/23/2023"
        });
      });
    });
    describe("Part Time Percentage", () => {});
    describe("Contract Schedule", () => {});
    describe("Contract", () => {});
  });
  describe("Rotation Fields", () => {});
  describe("Availability Fields", () => {
    describe("disable", () => {
      test("is not disabled when formmode is insert", () => {
        renderComponent();
        const availabilityDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Availability");
        const availabilityDropdown = availabilityDropdowns[availabilityDropdowns.length-1][0];
        expect(availabilityDropdown.disabled).toBe(false);
      });
      test("is disabled when formmode is not insert", () => {
        const formState = {
          ...initialFormState,
          formMode: "update"
        };
        useFormState.mockReturnValue(formState);
        renderComponent();
        const availabilityDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Availability");
        const availabilityDropdown = availabilityDropdowns[availabilityDropdowns.length-1][0];
        expect(availabilityDropdown.disabled).toBe(true);
      });
    });
    test("options", () => {
      const formState = {
        ...initialFormState,
        calabrio_wfm: {
          ...initialFormState.calabrio_wfm,
          BusinessUnitId
        }
      };
      useFormState.mockReturnValue(formState);
      renderComponent();
      const availabilityDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Availability");
      const expectedRawOptions = initialTestState.calabrioContext.wfmOptions.find(bu => bu.Id === BusinessUnitId).Availabilities;
      const expectedDropdownOptions = expectedRawOptions.map(o => {
        return {
          ...o,
          label: o.Name,
          value: o.Id
        }
      });
      expect(availabilityDropdowns[availabilityDropdowns.length-1][0].options).toStrictEqual(expectedDropdownOptions);
    });
    test("updateValue calls setForm when Availability and Availability Start date are populated", () => {
      renderComponent();
      let availabilityDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Availability");
      let availabilityDropdown = availabilityDropdowns[availabilityDropdowns.length-1][0];
      const updateValue = availabilityDropdown.updateValue;
      act(() => updateValue({}, "boo"));
      availabilityDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Availability");
      availabilityDropdown = availabilityDropdowns[availabilityDropdowns.length-1][0];
    });
  });
  describe("Skill Fields", () => {});
});