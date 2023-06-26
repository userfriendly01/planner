import WfmForm from "../WfmForm";
import React from "react";
import {
  useAdminState,
  userFormActions,
  useFormState,
  useFormDispatch
} from "context";
import { Dropdown } from "components";
import {
  TextareaAutosize,
  TextField,
  IconButton,
  Tooltip
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
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

const mockSetForm = jest.fn();

test("boo", () => {
  expect(true).toBe(true);
});

const renderComponent = (missingFields) => {
  return render(
    <WfmForm missingFields={missingFields || []}/>
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
    describe("wfmoptions and wfmOrg are loaded", () => {
      test("should render as expected", () => {
        renderComponent();
        expect(Dropdown.mock.calls.length).toBe(30); //renders twice
        expect(Dropdown.mock.calls[0][0].label).toBe("Business Unit *");
        expect(Dropdown.mock.calls[1][0].label).toBe("Team");
        expect(Dropdown.mock.calls[2][0].label).toBe("First Day of the Week *");
        expect(Dropdown.mock.calls[3][0].label).toBe("Roles");
        expect(Dropdown.mock.calls[4][0].label).toBe("Skills");
        expect(Dropdown.mock.calls[5][0].label).toBe("Workflow Control Set");
        expect(Dropdown.mock.calls[6][0].label).toBe("Optional Columns");
        expect(Dropdown.mock.calls[7][0].label).toBe("Budget Group");
        expect(Dropdown.mock.calls[8][0].label).toBe("Part Time Percentage");
        expect(Dropdown.mock.calls[9][0].label).toBe("Contract Schedule");
        expect(Dropdown.mock.calls[10][0].label).toBe("Contract");
        expect(Dropdown.mock.calls[11][0].label).toBe("Shift Bag");
        expect(Dropdown.mock.calls[12][0].label).toBe("Rotation");
        expect(Dropdown.mock.calls[13][0].label).toBe("Rotation Start Week");
        expect(Dropdown.mock.calls[14][0].label).toBe("Availability");
        expect(TextField.mock.calls.length).toBe(2); //renders twice
        expect(TextField.mock.calls[0][0].label).toBe("Identity");
        expect(DatePicker.mock.calls.length).toBe(10); //renders twice
        expect(DatePicker.mock.calls[0][0].label).toBe("Team Start Date");
        expect(DatePicker.mock.calls[1][0].label).toBe("Person Start Date");
        expect(DatePicker.mock.calls[2][0].label).toBe("Skills Start Date");
        expect(DatePicker.mock.calls[3][0].label).toBe("Rotation Start Date");
        expect(DatePicker.mock.calls[4][0].label).toBe("Availability Start Date");
      });
    });
  });
  describe("Business Unit Dropdown", () => {
    describe("error", () => {
      describe("BusinessUnitId is on missingFields array", () => {
        describe("form.calabrio_wfm.BusinessUnitId === null", () => {
          test("error should be true", () => {
            renderComponent(["BusinessUnitId"]);
            const buDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Business Unit *");
            const buDropdown = buDropdowns[buDropdowns.length-1][0];
            expect(buDropdown.error).toBe(true);
          });
        });
        describe("form.calabrio_wfm.BusinessUnitId !== null", () => {
          test("error should be false", () => {
            const formState = {
              ...initialFormState,
              calabrio_wfm: {
                ...initialFormState.calabrio_wfm,
                BusinessUnitId: "123-321"
              }
            };
            useFormState.mockReturnValue(formState);
            renderComponent(["BusinessUnitId"]);
            const buDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Business Unit *");
            const buDropdown = buDropdowns[buDropdowns.length-1][0];
            expect(buDropdown.error).toBe(false);
          });
        });
      });
    });
    describe("disable", () => {
      test("is not disabled when formmode is insert", () => {
        renderComponent();
        const buDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Business Unit *");
        const buDropdown = buDropdowns[buDropdowns.length-1][0];
        expect(buDropdown.disabled).toBe(false);
      });
      test("is disabled when formmode is not insert && Id is populated", () => {
        const formState = {
          ...initialFormState,
          formMode: "update",
          calabrio_wfm: {
            ...initialFormState.calabrio_wfm,
            Id: "I Exist Already"
          }
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
    test("clear dropdown updates field calls setForm with null", () => {
      renderComponent();
      const buDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Business Unit *");
      const buDropdown = buDropdowns[buDropdowns.length-1][0];
      const updateValue = buDropdown.updateValue;
      act(() => updateValue({}, null));
      expect(mockSetForm).toHaveBeenLastCalledWith({
        type: userFormActions.SET_WFM_BUSINESS_UNIT,
        payload: null
      });
    });
  });
  describe("Team Fields", () => {
    describe("Team", () => {
      describe("error", () => {
        describe("TeamId is on missingFields array", () => {
          describe("form.calabrio_wfm.TeamStartDate === null", () => {
            test("error should be true", () => {
              renderComponent(["TeamId"]);
              const teamDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Team");
              const teamDropdown = teamDropdowns[teamDropdowns.length-1][0];
              expect(teamDropdown.error).toBe(true);
            });
          });
          describe("form.calabrio_wfm.TeamStartDate !== null", () => {
            test("error should be false", () => {
              const formState = {
                ...initialFormState,
                calabrio_wfm: {
                  ...initialFormState.calabrio_wfm,
                  TeamId: "111"
                }
              };
              useFormState.mockReturnValue(formState);
              renderComponent(["TeamId"]);
              const teamDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Team");
              const teamDropdown = teamDropdowns[teamDropdowns.length-1][0];
              expect(teamDropdown.error).toBe(false);
            });
          });
        });
      });
      describe("disable", () => {
        test("is not disabled when formmode is insert", () => {
          renderComponent();
          const teamDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Team");
          const teamDropdown = teamDropdowns[teamDropdowns.length-1][0];
          expect(teamDropdown.disabled).toBe(false);
        });
        test("is disabled when formmode is not insert && Id is populated", () => {
          const formState = {
            ...initialFormState,
            formMode: "update",
            calabrio_wfm: {
              ...initialFormState.calabrio_wfm,
              Id: "I Exist Already"
            }
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
      test("clear dropdown updates field calls setForm with null", () => {
        renderComponent();
        let teamDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Team");
        let teamDropdown = teamDropdowns[teamDropdowns.length-1][0];
        const updateValue = teamDropdown.updateValue;
        act(() => updateValue({}, null));
        teamDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Team");
        teamDropdown = teamDropdowns[teamDropdowns.length-1][0];
        expect(teamDropdown.value).toBe("");
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
        test("is not rendered when formmode is not insert && Id is populated", () => {
          const formState = {
            ...initialFormState,
            formMode: "update",
            calabrio_wfm: {
              ...initialFormState.calabrio_wfm,
              Id: "I Exist Already"
            }
          };
          useFormState.mockReturnValue(formState);
          renderComponent();
          const teamDatePickers = DatePicker.mock.calls.filter((m) => m[0].label === "Team Start Date");
          expect(teamDatePickers.length).toBe(0);
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
        expect(teamDatePicker.value).toBe("2023-12-23");
      });
      test("onChange null updates team fields with null", () => {
        renderComponent();
        let teamDatePickers = DatePicker.mock.calls.filter((m) => m[0].label === "Team Start Date");
        let teamDatePicker = teamDatePickers[teamDatePickers.length-1][0];
        const onChange = teamDatePicker.onChange;
        act(() => onChange(null));
        teamDatePickers = DatePicker.mock.calls.filter((m) => m[0].label === "Team Start Date");
        teamDatePicker = teamDatePickers[teamDatePickers.length-1][0];
        expect(teamDatePicker.value).toBe(null);
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
      describe("TeamId is on missingFields array", () => {
        describe("form.calabrio_wfm.TeamId === null", () => {
          test("error should be true", () => {
            renderComponent(["TeamId"]);
            const teamDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Team");
            const teamDropdown = teamDropdowns[teamDropdowns.length-1][0];
            expect(teamDropdown.error).toBe(true);
          });
        });
        describe("form.calabrio_wfm.TeamId !== null", () => {
          test("error should be false", () => {
            const formState = {
              ...initialFormState,
              calabrio_wfm: {
                ...initialFormState.calabrio_wfm,
                TeamId: "111"
              }
            };
            useFormState.mockReturnValue(formState);
            renderComponent(["TeamId"]);
            const teamDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Team");
            const teamDropdown = teamDropdowns[teamDropdowns.length-1][0];
            expect(teamDropdown.error).toBe(false);
          });
        });
      });
      describe("TeamStartDate is on missingFields array", () => {
        describe("form.calabrio_wfm.TeamStartDate === null", () => {
          test("error should be true", () => {
            renderComponent(["TeamStartDate"]);
            const teamDatePickers = DatePicker.mock.calls.filter((m) => m[0].label === "Team Start Date");
            const teamDatePicker = teamDatePickers[teamDatePickers.length-1][0];
            render(teamDatePicker.renderInput());
            const textFieldLength = TextField.mock.calls.length;
            const textField = TextField.mock.calls[textFieldLength-1][0];
            expect(textField.error).toBe(true);
          });
        });
        describe("form.calabrio_wfm.TeamStartDate !== null", () => {
          test("error should be false", () => {
            const formState = {
              ...initialFormState,
              calabrio_wfm: {
                ...initialFormState.calabrio_wfm,
                TeamStartDate: "05/02/1991"
              }
            };
            useFormState.mockReturnValue(formState);
            renderComponent(["TeamStartDate"]);
            const teamDatePickers = DatePicker.mock.calls.filter((m) => m[0].label === "Team Start Date");
            const teamDatePicker = teamDatePickers[teamDatePickers.length-1][0];
            render(teamDatePicker.renderInput());
            const textFieldLength = TextField.mock.calls.length;
            const textField = TextField.mock.calls[textFieldLength-1][0];
            expect(textField.error).toBe(false);
          });
        });
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
            startDate: "2023-12-23"
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
      test("is disabled when formmode is not insert && Id is populated", () => {
        const formState = {
          ...initialFormState,
          formMode: "update",
          calabrio_wfm: {
            ...initialFormState.calabrio_wfm,
            Id: "I Exist Already"
          }
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
    describe("error", () => {
      describe("FirstDayOfWeek is on missingFields array", () => {
        describe("form.calabrio_wfm.FirstDayOfWeek === null", () => {
          test("error should be true", () => {
            renderComponent(["FirstDayOfWeek"]);
            const teamDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "First Day of the Week *");
            const teamDropdown = teamDropdowns[teamDropdowns.length-1][0];
            expect(teamDropdown.error).toBe(true);
          });
        });
        describe("form.calabrio_wfm.FirstDayOfWeek !== null", () => {
          test("error should be false", () => {
            const formState = {
              ...initialFormState,
              calabrio_wfm: {
                ...initialFormState.calabrio_wfm,
                FirstDayOfWeek: 0
              }
            };
            useFormState.mockReturnValue(formState);
            renderComponent(["FirstDayOfWeek"]);
            const teamDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "First Day of the Week *");
            const teamDropdown = teamDropdowns[teamDropdowns.length-1][0];
            expect(teamDropdown.error).toBe(false);
          });
        });
      });
    });
    describe("disable", () => {
      test("is not disabled when formmode is insert", () => {
        renderComponent();
        const firstDayDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "First Day of the Week *");
        const firstDayDropdown = firstDayDropdowns[firstDayDropdowns.length-1][0];
        expect(firstDayDropdown.disabled).toBe(false);
      });
      test("is disabled when formmode is not insert && Id is populated", () => {
        const formState = {
          ...initialFormState,
          formMode: "update",
          calabrio_wfm: {
            ...initialFormState.calabrio_wfm,
            Id: "I Exist Already"
          }
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
      act(() => updateValue({}, { value: 1 }));
      expect(mockSetForm).toHaveBeenLastCalledWith({
        type: userFormActions.SET_WFM_FIRST_DAY_OF_WEEK,
        payload: 1
      });
    });
    test("clear dropdown updates field calls setForm with null", () => {
      renderComponent();
      const firstDayDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "First Day of the Week *");
      const firstDayDropdown = firstDayDropdowns[firstDayDropdowns.length-1][0];
      const updateValue = firstDayDropdown.updateValue;
      act(() => updateValue({}, null));
      expect(mockSetForm).toHaveBeenLastCalledWith({
        type: userFormActions.SET_WFM_FIRST_DAY_OF_WEEK,
        payload: null
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
      test("is disabled when formmode is not insert && Id is populated", () => {
        const formState = {
          ...initialFormState,
          formMode: "update",
          calabrio_wfm: {
            ...initialFormState.calabrio_wfm,
            Id: "I Exist Already"
          }
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
        test("is disabled when formmode is not insert && Id is populated", () => {
          const formState = {
            ...initialFormState,
            formMode: "update",
            calabrio_wfm: {
              ...initialFormState.calabrio_wfm,
              Id: "I Exist Already"
            }
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
        test("does not render when formmode is not insert && Id is populated", () => {
          const formState = {
            ...initialFormState,
            formMode: "update",
            calabrio_wfm: {
              ...initialFormState.calabrio_wfm,
              Id: "I Exist Already"
            }
          };
          useFormState.mockReturnValue(formState);
          renderComponent();
          const skillDatePickers = DatePicker.mock.calls.filter((m) => m[0].label === "Skills Start Date");
          expect(skillDatePickers.length).toBe(0);
        });
      });
      test("onChange updates skill date field", () => {
        renderComponent();
        let skillDatePickers = DatePicker.mock.calls.filter((m) => m[0].label === "Skills Start Date");
        let skillDatePicker = skillDatePickers[skillDatePickers.length-1][0];
        const onChange = skillDatePicker.onChange;
        act(() => onChange("12/23/2023"));
        skillDatePickers = DatePicker.mock.calls.filter((m) => m[0].label === "Skills Start Date");
        skillDatePicker = skillDatePickers[skillDatePickers.length-1][0];
        expect(skillDatePicker.value).toBe("2023-12-23");
      });
      test("onChange to null updates skill date field to null", () => {
        renderComponent();
        let skillDatePickers = DatePicker.mock.calls.filter((m) => m[0].label === "Skills Start Date");
        let skillDatePicker = skillDatePickers[skillDatePickers.length-1][0];
        const onChange = skillDatePicker.onChange;
        act(() => onChange(null));
        skillDatePickers = DatePicker.mock.calls.filter((m) => m[0].label === "Skills Start Date");
        skillDatePicker = skillDatePickers[skillDatePickers.length-1][0];
        expect(skillDatePicker.value).toBe("");
      });
    });
    describe("Error fields", () => {
      describe("skills field is populated but skill start date is not", () => {
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
      describe("skill start date field is populated but skills is not", () => {
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
      describe("PersonSkills is on missingFields array", () => {
        describe("form.calabrio_wfm.PersonSkills === null", () => {
          test("error should be true", () => {
            renderComponent(["PersonSkills"]);
            let skillsDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Skills");
            let skillsDropdown = skillsDropdowns[skillsDropdowns.length-1][0];
            expect(skillsDropdown.error).toBe(true);
          });
        });
        describe("form.calabrio_wfm.PersonSkills !== null", () => {
          test("error should be false", () => {
            const formState = {
              ...initialFormState,
              calabrio_wfm: {
                ...initialFormState.calabrio_wfm,
                PersonSkills: ["SKILL"]
              }
            };
            useFormState.mockReturnValue(formState);
            renderComponent(["PersonSkills"]);
            let skillsDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Skills");
            let skillsDropdown = skillsDropdowns[skillsDropdowns.length-1][0];
            expect(skillsDropdown.error).toBe(false);
          });
        });
      });
      describe("SkillsStartDate is on missingFields array", () => {
        describe("form.calabrio_wfm.SkillsStartDate === null", () => {
          test("error should be true", () => {
            renderComponent(["SkillsStartDate"]);
            const teamDatePickers = DatePicker.mock.calls.filter((m) => m[0].label === "Skills Start Date");
            const teamDatePicker = teamDatePickers[teamDatePickers.length-1][0];
            render(teamDatePicker.renderInput());
            const textFieldLength = TextField.mock.calls.length;
            const textField = TextField.mock.calls[textFieldLength-1][0];
            expect(textField.error).toBe(true);
          });
        });
        describe("form.calabrio_wfm.SkillsStartDate !== null", () => {
          test("error should be false", () => {
            const formState = {
              ...initialFormState,
              calabrio_wfm: {
                ...initialFormState.calabrio_wfm,
                SkillsStartDate: "05/02/1991"
              }
            };
            useFormState.mockReturnValue(formState);
            renderComponent(["SkillsStartDate"]);
            const teamDatePickers = DatePicker.mock.calls.filter((m) => m[0].label === "Skills Start Date");
            const teamDatePicker = teamDatePickers[teamDatePickers.length-1][0];
            render(teamDatePicker.renderInput());
            const textFieldLength = TextField.mock.calls.length;
            const textField = TextField.mock.calls[textFieldLength-1][0];
            expect(textField.error).toBe(false);
          });
        });
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
            startDate: "2023-12-23"
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
      test("is disabled when formmode is not insert && Id is populated", () => {
        const formState = {
          ...initialFormState,
          formMode: "update",
          calabrio_wfm: {
            ...initialFormState.calabrio_wfm,
            Id: "I Exist Already"
          }
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
    test("clear dropdown updates field calls setForm with null", () => {
      renderComponent();
      const controlSetDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Workflow Control Set");
      const controlSetDropdown = controlSetDropdowns[controlSetDropdowns.length-1][0];
      const updateValue = controlSetDropdown.updateValue;
      act(() => updateValue({}, null));
      expect(mockSetForm).toHaveBeenLastCalledWith({
        type: userFormActions.SET_WFM_CONTROL_SET,
        payload: null
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
      test("is disabled when formmode is not insert && Id is populated", () => {
        const formState = {
          ...initialFormState,
          formMode: "update",
          calabrio_wfm: {
            ...initialFormState.calabrio_wfm,
            Id: "I Exist Already"
          }
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
    test("Adding a column does not delete the value in other columns", () => {
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
      act(() => updateValue({}, [ columnOption1 ]));
      columnsDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Optional Columns");
      columnsDropdown = columnsDropdowns[columnsDropdowns.length-1][0];
      const updateValueAgain = columnsDropdown.updateValue;
      act(() => updateValueAgain({}, [ columnOption1, columnOption2 ]));

      let optionalColumn2Fields = TextField.mock.calls.filter((m) => m[0]?.label === `${columnOption2.Name} value *`);
      let optionalColumn2Field = optionalColumn2Fields[optionalColumn2Fields.length-1][0];
      const value2OnChange = optionalColumn2Field.onChange;
      act(() => value2OnChange({
        target: {
          value: "kittens"
        }
      }))
      let optionalColumn1Fields = TextField.mock.calls.filter((m) => m[0]?.label === `${columnOption1.Name} value *`);
      let optionalColumn1Field = optionalColumn1Fields[optionalColumn1Fields.length-1][0];
      const value1OnChange = optionalColumn1Field.onChange;
      act(() => value1OnChange({
        target: {
          value: "puppies"
        }
      }))
      columnsDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Optional Columns");
      columnsDropdown = columnsDropdowns[columnsDropdowns.length-1][0];
      expect(columnsDropdown.value).toStrictEqual([
        {
          ...columnOption1,
          columnValue: "puppies"
        },
        {
          ...columnOption2,
          columnValue: "kittens"
        }
      ]);
      expect(mockSetForm).toHaveBeenCalledWith({
        type: userFormActions.SET_WFM_OPTIONAL_COLUMNS,
        payload: [
          {
            Id: '222',
            Value: 'kittens'
          }
        ]
      });
      expect(mockSetForm).toHaveBeenCalledWith({
        type: userFormActions.SET_WFM_OPTIONAL_COLUMNS,
        payload: [
          {
            Id: '111',
            Value: 'puppies'
          },
          {
            Id: '222',
            Value: 'kittens'
          }
        ]
      });
    });
    test("when column/value already exist, setForm is not called", () => {
      renderComponent();
      let columnsDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Optional Columns");
      let columnsDropdown = columnsDropdowns[columnsDropdowns.length-1][0];
      const updateValue = columnsDropdown.updateValue;
      act(() => updateValue({}, []));
      expect(mockSetForm).not.toHaveBeenLastCalledWith({
        type: userFormActions.SET_WFM_OPTIONAL_COLUMNS,
        payload: []
      });
    });
  });
  describe("Budget Group", () => {
    describe("disable", () => {
      test("is not disabled when formmode is insert", () => {
        renderComponent();
        const budgetGroupDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Budget Group");
        const budgetGroupDropdown = budgetGroupDropdowns[budgetGroupDropdowns.length-1][0];
        expect(budgetGroupDropdown.disabled).toBe(false);
      });
      test("is disabled when formmode is not insert && Id is populated", () => {
        const formState = {
          ...initialFormState,
          formMode: "update",
          calabrio_wfm: {
            ...initialFormState.calabrio_wfm,
            Id: "I Exist Already"
          }
        };
        useFormState.mockReturnValue(formState);
        renderComponent();
        const budgetGroupDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Budget Group");
        const budgetGroupDropdown = budgetGroupDropdowns[budgetGroupDropdowns.length-1][0];
        expect(budgetGroupDropdown.disabled).toBe(true);
      });
    });
    test("options", () => {
      renderComponent();
      const budgetGroupDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Budget Group");
      const budgetGroupDropdown = budgetGroupDropdowns[budgetGroupDropdowns.length-1][0];
      const expectedRawOptions = initialTestState.calabrioContext.wfmOptions.find(bu => bu.Id === BusinessUnitId).Budget_Groups;
      const expectedDropdownOptions = expectedRawOptions.map(o => {
        return {
          ...o,
          label: o.Name,
          value: o.Id
        }
      });
      expect(budgetGroupDropdown.options).toStrictEqual(expectedDropdownOptions);
    });
    test("updateValue calls setForm", () => {
      renderComponent();
      const budgetGroupDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Budget Group");
      const budgetGroupDropdown = budgetGroupDropdowns[budgetGroupDropdowns.length-1][0];
      const updateValue = budgetGroupDropdown.updateValue;
      act(() => updateValue({}, { value: "000"}));
      expect(mockSetForm).toHaveBeenLastCalledWith({
        type: userFormActions.SET_WFM_BUDGET_GROUP,
        payload: "000"
      });
    });
    test("clear dropdown updates field calls setForm with null", () => {
      renderComponent();
      const budgetGroupDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Budget Group");
      const budgetGroupDropdown = budgetGroupDropdowns[budgetGroupDropdowns.length-1][0];
      const updateValue = budgetGroupDropdown.updateValue;
      act(() => updateValue({}, null));
      expect(mockSetForm).toHaveBeenLastCalledWith({
        type: userFormActions.SET_WFM_BUDGET_GROUP,
        payload: null
      });
    });
  });
  describe("Shift Bag", () => {
    describe("disable", () => {
      test("is not disabled when formmode is insert", () => {
        renderComponent();
        const shiftBagDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Shift Bag");
        const shiftBagDropdown = shiftBagDropdowns[shiftBagDropdowns.length-1][0];
        expect(shiftBagDropdown.disabled).toBe(false);
      });
      test("is disabled when formmode is not insert && Id is populated", () => {
        const formState = {
          ...initialFormState,
          formMode: "update",
          calabrio_wfm: {
            ...initialFormState.calabrio_wfm,
            Id: "I Exist Already"
          }
        };
        useFormState.mockReturnValue(formState);
        renderComponent();
        const shiftBagDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Shift Bag");
        const shiftBagDropdown = shiftBagDropdowns[shiftBagDropdowns.length-1][0];
        expect(shiftBagDropdown.disabled).toBe(true);
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
      const shiftBagDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Shift Bag");
      const shiftBagDropdown = shiftBagDropdowns[shiftBagDropdowns.length-1][0];
      const expectedRawOptions = initialTestState.calabrioContext.wfmOptions.find(bu => bu.Id === BusinessUnitId).Shift_Bags;
      const expectedDropdownOptions = expectedRawOptions.map(o => {
        return {
          ...o,
          label: o.Name,
          value: o.Id
        }
      });
      expect(shiftBagDropdown.options).toStrictEqual(expectedDropdownOptions);
    });
    test("updateValue calls setForm", () => {
      renderComponent();
      const shiftBagDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Shift Bag");
      const shiftBagDropdown = shiftBagDropdowns[shiftBagDropdowns.length-1][0];
      const updateValue = shiftBagDropdown.updateValue;
      act(() => updateValue({}, { value: "111"}));
      expect(mockSetForm).toHaveBeenLastCalledWith({
        type: userFormActions.SET_WFM_SHIFT_BAG,
        payload: "111"
      });
    });
    test("clear dropdown updates field calls setForm with null", () => {
      renderComponent();
      const shiftBagDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Shift Bag");
      const shiftBagDropdown = shiftBagDropdowns[shiftBagDropdowns.length-1][0];
      const updateValue = shiftBagDropdown.updateValue;
      act(() => updateValue({}, null));
      expect(mockSetForm).toHaveBeenLastCalledWith({
        type: userFormActions.SET_WFM_SHIFT_BAG,
        payload: null
      });
    });
  });
  describe("Schedule Fields", () => {
    describe("Person Start Date", () => {
      describe("error", () => {
        describe("Person Start Date is on missingFields array", () => {
          describe("form.calabrio_wfm.EmploymentStartDate === null", () => {
            test("error should be true", () => {
              renderComponent(["EmploymentStartDate"]);
              const personDatePickers = DatePicker.mock.calls.filter((m) => m[0].label === "Person Start Date");
              const personDatePicker = personDatePickers[personDatePickers.length-1][0];
              render(personDatePicker.renderInput());
              const textFieldLength = TextField.mock.calls.length;
              const textField = TextField.mock.calls[textFieldLength-1][0];
              expect(textField.error).toBe(true);
            });
          });
          describe("form.calabrio_wfm.EmploymentStartDate !== null", () => {
            test("error should be false", () => {
              const formState = {
                ...initialFormState,
                calabrio_wfm: {
                  ...initialFormState.calabrio_wfm,
                  EmploymentStartDate: "05/02/1991"
                }
              };
              useFormState.mockReturnValue(formState);
              renderComponent(["EmploymentStartDate"]);
              const personDatePickers = DatePicker.mock.calls.filter((m) => m[0].label === "Person Start Date");
              const personDatePicker = personDatePickers[personDatePickers.length-1][0];
              render(personDatePicker.renderInput());
              const textFieldLength = TextField.mock.calls.length;
              const textField = TextField.mock.calls[textFieldLength-1][0];
              expect(textField.error).toBe(false);
            });
          });
        });
      });
      describe("disable", () => {
        test("is not disabled when formmode is insert", () => {
          renderComponent();
          const personDatePickers = DatePicker.mock.calls.filter((m) => m[0].label === "Person Start Date");
          const personDatePicker = personDatePickers[personDatePickers.length-1][0];
          expect(personDatePicker.disabled).toBe(false);
        });
        test("is disabled when formmode is not insert && Id is populated", () => {
          const formState = {
            ...initialFormState,
            formMode: "update",
            calabrio_wfm: {
              ...initialFormState.calabrio_wfm,
              Id: "I Exist Already"
            }
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
          payload: "2023-12-23"
        });
      });
      test("onChange null updates team fields to null", () => {
        renderComponent();
        let personDatePickers = DatePicker.mock.calls.filter((m) => m[0].label === "Person Start Date");
        let personDatePicker = personDatePickers[personDatePickers.length-1][0];
        const onChange = personDatePicker.onChange;
        act(() => onChange(null));
        personDatePickers = DatePicker.mock.calls.filter((m) => m[0].label === "Person Start Date");
        personDatePicker = personDatePickers[personDatePickers.length-1][0];
        expect(mockSetForm).toHaveBeenLastCalledWith({
          type: userFormActions.SET_WFM_EMP_START_DATE,
          payload: null
        });
      });
      test("error field is true when another schedule field is selected", () => {
        renderComponent();
        let teamDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Team");
        let teamDropdown = teamDropdowns[teamDropdowns.length-1][0];
        const updateValue = teamDropdown.updateValue;
        act(() => updateValue({}, { value: "111" }));
        const personDatePickers = DatePicker.mock.calls.filter((m) => m[0].label === "Person Start Date");
        const personDatePicker = personDatePickers[personDatePickers.length-1][0];
        render(personDatePicker.renderInput());
        const textFieldLength = TextField.mock.calls.length;
        const textField = TextField.mock.calls[textFieldLength-1][0];
        expect(textField.error).toBe(true);
      });
    });
    describe("Part Time Percentage", () => {
      describe("error", () => {
        describe("PartTimePercentageId is on missingFields array", () => {
          describe("form.calabrio_wfm.PartTimePercentageId === null", () => {
            test("error should be true", () => {
              renderComponent(["PartTimePercentageId"]);
              const partTimeDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Part Time Percentage");
              const partTimeDropdown = partTimeDropdowns[partTimeDropdowns.length-1][0];
              expect(partTimeDropdown.error).toBe(true);
            });
          });
          describe("form.calabrio_wfm.PartTimePercentageId !== null", () => {
            test("error should be false", () => {
              const formState = {
                ...initialFormState,
                calabrio_wfm: {
                  ...initialFormState.calabrio_wfm,
                  PartTimePercentageId: "PP510354"
                }
              };
              useFormState.mockReturnValue(formState);
              renderComponent(["PartTimePercentageId"]);
              const partTimeDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Part Time Percentage");
              const partTimeDropdown = partTimeDropdowns[partTimeDropdowns.length-1][0];
              expect(partTimeDropdown.error).toBe(false);
            });
          });
        });
      });
      describe("disable", () => {
        test("is not disabled when formmode is insert", () => {
          renderComponent();
          const partTimeDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Part Time Percentage");
          const partTimeDropdown = partTimeDropdowns[partTimeDropdowns.length-1][0];
          expect(partTimeDropdown.disabled).toBe(false);
        });
        test("is disabled when formmode is not insert && Id is populated", () => {
          const formState = {
            ...initialFormState,
            formMode: "update",
            calabrio_wfm: {
              ...initialFormState.calabrio_wfm,
              Id: "I Exist Already"
            }
          };
          useFormState.mockReturnValue(formState);
          renderComponent();
          const partTimeDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Part Time Percentage");
          const partTimeDropdown = partTimeDropdowns[partTimeDropdowns.length-1][0];
          expect(partTimeDropdown.disabled).toBe(true);
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
        const partTimeDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Part Time Percentage");
        const partTimeDropdown = partTimeDropdowns[partTimeDropdowns.length-1][0];
        const expectedRawOptions = initialTestState.calabrioContext.wfmOptions.find(bu => bu.Id === BusinessUnitId).Part_Time_Percentages;
        const expectedDropdownOptions = expectedRawOptions.map(o => {
          return {
            ...o,
            label: o.Name,
            value: o.Id
          }
        });
        expect(partTimeDropdown.options).toStrictEqual(expectedDropdownOptions);
      });
      test("updateValue calls setForm", () => {
        renderComponent();
        const partTimeDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Part Time Percentage");
        const partTimeDropdown = partTimeDropdowns[partTimeDropdowns.length-1][0];
        const updateValue = partTimeDropdown.updateValue;
        act(() => updateValue({}, { value: "111"}));
        expect(mockSetForm).toHaveBeenLastCalledWith({
          type: userFormActions.SET_WFM_PART_TIME_PERCENTAGE,
          payload: "111"
        });
      });
      test("clear dropdown updates field calls setForm with null", () => {
        renderComponent();
        const partTimeDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Part Time Percentage");
        const partTimeDropdown = partTimeDropdowns[partTimeDropdowns.length-1][0];
        const updateValue = partTimeDropdown.updateValue;
        act(() => updateValue({}, null));
        expect(mockSetForm).toHaveBeenLastCalledWith({
          type: userFormActions.SET_WFM_PART_TIME_PERCENTAGE,
          payload: null
        });
      });
    });
    describe("Contract Schedule", () => {
      describe("error", () => {
        describe("ContractScheduleId is on missingFields array", () => {
          describe("form.calabrio_wfm.ContractScheduleId === null", () => {
            test("error should be true", () => {
              renderComponent(["ContractScheduleId"]);
              const contractScheduleDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Contract Schedule");
              const contractScheduleDropdown = contractScheduleDropdowns[contractScheduleDropdowns.length-1][0];
              expect(contractScheduleDropdown.error).toBe(true);
            });
          });
          describe("form.calabrio_wfm.ContractScheduleId !== null", () => {
            test("error should be false", () => {
              const formState = {
                ...initialFormState,
                calabrio_wfm: {
                  ...initialFormState.calabrio_wfm,
                  ContractScheduleId: "CS510354"
                }
              };
              useFormState.mockReturnValue(formState);
              renderComponent(["ContractScheduleId"]);
              const contractScheduleDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Contract Schedule");
              const contractScheduleDropdown = contractScheduleDropdowns[contractScheduleDropdowns.length-1][0];
              expect(contractScheduleDropdown.error).toBe(false);
            });
          });
        });
      });
      describe("disable", () => {
        test("is not disabled when formmode is insert", () => {
          renderComponent();
          const contractScheduleDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Contract Schedule");
          const contractScheduleDropdown = contractScheduleDropdowns[contractScheduleDropdowns.length-1][0];
          expect(contractScheduleDropdown.disabled).toBe(false);
        });
        test("is disabled when formmode is not insert && Id is populated", () => {
          const formState = {
            ...initialFormState,
            formMode: "update",
            calabrio_wfm: {
              ...initialFormState.calabrio_wfm,
              Id: "I Exist Already"
            }
          };
          useFormState.mockReturnValue(formState);
          renderComponent();
          const contractScheduleDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Contract Schedule");
          const contractScheduleDropdown = contractScheduleDropdowns[contractScheduleDropdowns.length-1][0];
          expect(contractScheduleDropdown.disabled).toBe(true);
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
        const contractScheduleDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Contract Schedule");
        const contractScheduleDropdown = contractScheduleDropdowns[contractScheduleDropdowns.length-1][0];
        const expectedRawOptions = initialTestState.calabrioContext.wfmOptions.find(bu => bu.Id === BusinessUnitId).Contract_Schedules;
        const expectedDropdownOptions = expectedRawOptions.map(o => {
          return {
            ...o,
            label: o.Name,
            value: o.Id
          }
        });
        expect(contractScheduleDropdown.options).toStrictEqual(expectedDropdownOptions);
      });
      test("updateValue calls setForm", () => {
        renderComponent();
        const contractScheduleDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Contract Schedule");
        const contractScheduleDropdown = contractScheduleDropdowns[contractScheduleDropdowns.length-1][0];
        const updateValue = contractScheduleDropdown.updateValue;
        act(() => updateValue({}, { value: "111"}));
        expect(mockSetForm).toHaveBeenLastCalledWith({
          type: userFormActions.SET_WFM_CONTRACT_SCHEDULE,
          payload: "111"
        });
      });
      test("clear dropdown updates field calls setForm with null", () => {
        renderComponent();
        const contractScheduleDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Contract Schedule");
        const contractScheduleDropdown = contractScheduleDropdowns[contractScheduleDropdowns.length-1][0];
        const updateValue = contractScheduleDropdown.updateValue;
        act(() => updateValue({}, null));
        expect(mockSetForm).toHaveBeenLastCalledWith({
          type: userFormActions.SET_WFM_CONTRACT_SCHEDULE,
          payload: null
        });
      });
    });
    describe("Contract", () => {
      describe("error", () => {
        describe("ContractId is on missingFields array", () => {
          describe("form.calabrio_wfm.ContractId === null", () => {
            test("error should be true", () => {
              renderComponent(["ContractId"]);
              const contractDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Contract");
              const contractDropdown = contractDropdowns[contractDropdowns.length-1][0];
              expect(contractDropdown.error).toBe(true);
            });
          });
          describe("form.calabrio_wfm.ContractId !== null", () => {
            test("error should be false", () => {
              const formState = {
                ...initialFormState,
                calabrio_wfm: {
                  ...initialFormState.calabrio_wfm,
                  ContractId: "CS510354"
                }
              };
              useFormState.mockReturnValue(formState);
              renderComponent(["ContractId"]);
              const contractDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Contract");
              const contractDropdown = contractDropdowns[contractDropdowns.length-1][0];
              expect(contractDropdown.error).toBe(false);
            });
          });
        });
      });
      describe("disable", () => {
        test("is not disabled when formmode is insert", () => {
          renderComponent();
          const contractDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Contract");
          const contractDropdown = contractDropdowns[contractDropdowns.length-1][0];
          expect(contractDropdown.disabled).toBe(false);
        });
        test("is disabled when formmode is not insert && Id is populated", () => {
          const formState = {
            ...initialFormState,
            formMode: "update",
            calabrio_wfm: {
              ...initialFormState.calabrio_wfm,
              Id: "I Exist Already"
            }
          };
          useFormState.mockReturnValue(formState);
          renderComponent();
          const contractDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Contract");
          const contractDropdown = contractDropdowns[contractDropdowns.length-1][0];
          expect(contractDropdown.disabled).toBe(true);
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
        const contractDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Contract");
        const contractDropdown = contractDropdowns[contractDropdowns.length-1][0];
        const expectedRawOptions = initialTestState.calabrioContext.wfmOptions.find(bu => bu.Id === BusinessUnitId).Contracts;
        const expectedDropdownOptions = expectedRawOptions.map(o => {
          return {
            ...o,
            label: o.Name,
            value: o.Id
          }
        });
        expect(contractDropdown.options).toStrictEqual(expectedDropdownOptions);
      });
      test("updateValue calls setForm", () => {
        renderComponent();
        const contractDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Contract");
        const contractDropdown = contractDropdowns[contractDropdowns.length-1][0];
        const updateValue = contractDropdown.updateValue;
        act(() => updateValue({}, { value: "111"}));
        expect(mockSetForm).toHaveBeenLastCalledWith({
          type: userFormActions.SET_WFM_CONTRACT,
          payload: "111"
        });
      });
      test("clear dropdown updates field calls setForm with null", () => {
        renderComponent();
        const contractDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Contract");
        const contractDropdown = contractDropdowns[contractDropdowns.length-1][0];
        const updateValue = contractDropdown.updateValue;
        act(() => updateValue({}, null));
        expect(mockSetForm).toHaveBeenLastCalledWith({
          type: userFormActions.SET_WFM_CONTRACT,
          payload: null
        });
      });
    });
  });
  describe("Rotation Fields", () => {
    describe("Rotation", () => {
      describe("disable", () => {
        test("is not disabled when formmode is insert", () => {
          renderComponent();
          const rotationDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Rotation");
          const rotationDropdown = rotationDropdowns[rotationDropdowns.length-1][0];
          expect(rotationDropdown.disabled).toBe(false);
        });
        test("is not rendered when formmode is not insert && Id is populated", () => {
          const formState = {
            ...initialFormState,
            formMode: "update",
            calabrio_wfm: {
              ...initialFormState.calabrio_wfm,
              Id: "I Exist Already"
            }
          };
          useFormState.mockReturnValue(formState);
          renderComponent();
          const rotationDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Rotation");
          expect(rotationDropdowns.length).toBe(0);
        });
      });
      test("options", () => {
        renderComponent();
        const rotationDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Rotation");
        const rotationDropdown = rotationDropdowns[rotationDropdowns.length-1][0];
        const expectedRawOptions = initialTestState.calabrioContext.wfmOptions.find(bu => bu.Id === BusinessUnitId).Rotations;
        const expectedDropdownOptions = expectedRawOptions.map(o => {
          return {
            ...o,
            label: o.Name,
            value: o.Id
          }
        });
        expect(rotationDropdown.options).toStrictEqual(expectedDropdownOptions);
      });
      test("updateValue updates team fields", () => {
        renderComponent();
        let rotationDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Rotation");
        let rotationDropdown = rotationDropdowns[rotationDropdowns.length-1][0];
        const updateValue = rotationDropdown.updateValue;
        act(() => updateValue({}, { value: "111" }));
        rotationDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Rotation");
        rotationDropdown = rotationDropdowns[rotationDropdowns.length-1][0];
        expect(rotationDropdown.value.Id).toBe("111");
      });
      test("clear dropdown updates field calls setForm with null", () => {
        renderComponent();
        let rotationDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Rotation");
        let rotationDropdown = rotationDropdowns[rotationDropdowns.length-1][0];
        const updateValue = rotationDropdown.updateValue;
        act(() => updateValue({}, null));
        rotationDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Rotation");
        rotationDropdown = rotationDropdowns[rotationDropdowns.length-1][0];
        expect(rotationDropdown.value).toBe("");
      });
    });
    describe("Rotation Start Date", () => {
      describe("disable", () => {
        test("is not disabled when formmode is insert", () => {
          renderComponent();
          const rotationDatePickers = DatePicker.mock.calls.filter((m) => m[0].label === "Rotation Start Date");
          const rotationDatePicker = rotationDatePickers[rotationDatePickers.length-1][0];
          expect(rotationDatePicker.disabled).toBe(false);
        });
        test("is not rendered when formmode is not insert && Id is populated", () => {
          const formState = {
            ...initialFormState,
            formMode: "update",
            calabrio_wfm: {
              ...initialFormState.calabrio_wfm,
              Id: "I Exist Already"
            }
          };
          useFormState.mockReturnValue(formState);
          renderComponent();
          const rotationDatePickers = DatePicker.mock.calls.filter((m) => m[0].label === "Rotation Start Date");
          expect(rotationDatePickers.length).toBe(0);
        });
      });
      test("onChange updates rotation start date field", () => {
        renderComponent();
        let rotationDatePickers = DatePicker.mock.calls.filter((m) => m[0].label === "Rotation Start Date");
        let rotationDatePicker = rotationDatePickers[rotationDatePickers.length-1][0];
        const onChange = rotationDatePicker.onChange;
        act(() => onChange("12/23/2023"));
        rotationDatePickers = DatePicker.mock.calls.filter((m) => m[0].label === "Rotation Start Date");
        rotationDatePicker = rotationDatePickers[rotationDatePickers.length-1][0];
        expect(rotationDatePicker.value).toBe("2023-12-23");
      });
      test("onChange to null updates rotation start date field to null", () => {
        renderComponent();
        let rotationDatePickers = DatePicker.mock.calls.filter((m) => m[0].label === "Rotation Start Date");
        let rotationDatePicker = rotationDatePickers[rotationDatePickers.length-1][0];
        const onChange = rotationDatePicker.onChange;
        act(() => onChange(null));
        rotationDatePickers = DatePicker.mock.calls.filter((m) => m[0].label === "Rotation Start Date");
        rotationDatePicker = rotationDatePickers[rotationDatePickers.length-1][0];
        expect(rotationDatePicker.value).toBe(null);
      });
    });
    describe("Error fields", () => {
      describe("Rotation field only is populated", () => {
        test("Rotation start date & start week error should === true", () => {
          renderComponent();
          let rotationDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Rotation");
          let rotationDropdown = rotationDropdowns[rotationDropdowns.length-1][0];
          const updateValue = rotationDropdown.updateValue;
          act(() => updateValue({}, { value: "111" }));
          const rotationDatePickers = DatePicker.mock.calls.filter((m) => m[0].label === "Rotation Start Date");
          const rotationDatePicker = rotationDatePickers[rotationDatePickers.length-1][0];
          render(rotationDatePicker.renderInput());
          const textFieldLength = TextField.mock.calls.length;
          const textField = TextField.mock.calls[textFieldLength-1][0];
          expect(textField.error).toBe(true);
          let rotationWeekDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Rotation Start Week");
          let rotationWeekDropdown = rotationWeekDropdowns[rotationWeekDropdowns.length-1][0];
          expect(rotationWeekDropdown.error).toBe(true);
        })
      });
      describe("Rotation start date field only is populated", () => {
        test("Rotation and rotation start week error should === true", () => {
          renderComponent();
          let rotationDatePickers = DatePicker.mock.calls.filter((m) => m[0].label === "Rotation Start Date");
          let rotationDatePicker = rotationDatePickers[rotationDatePickers.length-1][0];
          const onChange = rotationDatePicker.onChange;
          act(() => onChange("12/23/2023"));
          const rotationDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Rotation");
          const rotationDropdown = rotationDropdowns[rotationDropdowns.length-1][0];
          expect(rotationDropdown.error).toBe(true);
          let rotationWeekDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Rotation Start Week");
          let rotationWeekDropdown = rotationWeekDropdowns[rotationWeekDropdowns.length-1][0];
          expect(rotationWeekDropdown.error).toBe(true);
        })
      });
      describe("Rotation start week only is populated", () => {
        test("Rotation start date & start week error should === true", () => {
          renderComponent();
          let rotationWeekDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Rotation Start Week");
          let rotationWeekDropdown = rotationWeekDropdowns[rotationWeekDropdowns.length-1][0];
          const updateValue = rotationWeekDropdown.updateValue;
          act(() => updateValue({}, { value: 9 }));
          const rotationDatePickers = DatePicker.mock.calls.filter((m) => m[0].label === "Rotation Start Date");
          const rotationDatePicker = rotationDatePickers[rotationDatePickers.length-1][0];
          render(rotationDatePicker.renderInput());
          const textFieldLength = TextField.mock.calls.length;
          const textField = TextField.mock.calls[textFieldLength-1][0];
          expect(textField.error).toBe(true);
          let rotationDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Rotation");
          let rotationDropdown = rotationDropdowns[rotationDropdowns.length-1][0];
          expect(rotationDropdown.error).toBe(true);
        })
      });
      describe("RotationId is on missingFields array", () => {
        describe("form.calabrio_wfm.RotationId === null", () => {
          test("error should be true", () => {
            renderComponent(["RotationId"]);
            const rotationDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Rotation");
            const rotationDropdown = rotationDropdowns[rotationDropdowns.length-1][0];
            expect(rotationDropdown.error).toBe(true);
          });
        });
        describe("form.calabrio_wfm.RotationId !== null", () => {
          test("error should be false", () => {
            const formState = {
              ...initialFormState,
              calabrio_wfm: {
                ...initialFormState.calabrio_wfm,
                RotationId: "111"
              }
            };
            useFormState.mockReturnValue(formState);
            renderComponent(["RotationId"]);
            const rotationDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Rotation");
            const rotationDropdown = rotationDropdowns[rotationDropdowns.length-1][0];
            expect(rotationDropdown.error).toBe(false);
          });
        });
      });
      describe("RotationStartDate is on missingFields array", () => {
        describe("form.calabrio_wfm.RotationStartDate === null", () => {
          test("error should be true", () => {
            renderComponent(["RotationStartDate"]);
            const teamDatePickers = DatePicker.mock.calls.filter((m) => m[0].label === "Rotation Start Date");
            const teamDatePicker = teamDatePickers[teamDatePickers.length-1][0];
            render(teamDatePicker.renderInput());
            const textFieldLength = TextField.mock.calls.length;
            const textField = TextField.mock.calls[textFieldLength-1][0];
            expect(textField.error).toBe(true);
          });
        });
        describe("form.calabrio_wfm.RotationStartDate !== null", () => {
          test("error should be false", () => {
            const formState = {
              ...initialFormState,
              calabrio_wfm: {
                ...initialFormState.calabrio_wfm,
                RotationStartDate: "05/02/1991"
              }
            };
            useFormState.mockReturnValue(formState);
            renderComponent(["RotationStartDate"]);
            const rotationDatePickers = DatePicker.mock.calls.filter((m) => m[0].label === "Rotation Start Date");
            const rotationDatePicker = rotationDatePickers[rotationDatePickers.length-1][0];
            render(rotationDatePicker.renderInput());
            const textFieldLength = TextField.mock.calls.length;
            const textField = TextField.mock.calls[textFieldLength-1][0];
            expect(textField.error).toBe(false);
          });
        });
      });
      describe("RotationStartWeek is on missingFields array", () => {
        describe("form.calabrio_wfm.RotationStartWeek === null", () => {
          test("error should be true", () => {
            renderComponent(["RotationStartWeek"]);
            const rotationWeekDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Rotation Start Week");
            const rotationWeekDropdown = rotationWeekDropdowns[rotationWeekDropdowns.length-1][0];
            expect(rotationWeekDropdown.error).toBe(true);
          });
        });
        describe("form.calabrio_wfm.RotationStartWeek !== null", () => {
          test("error should be false", () => {
            const formState = {
              ...initialFormState,
              calabrio_wfm: {
                ...initialFormState.calabrio_wfm,
                RotationStartWeek: 0
              }
            };
            useFormState.mockReturnValue(formState);
            renderComponent(["RotationStartWeek"]);
            const rotationWeekDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Rotation Start Week");
            const rotationWeekDropdown = rotationWeekDropdowns[rotationWeekDropdowns.length-1][0];
            expect(rotationWeekDropdown.error).toBe(false);
          });
        });
      });
    });
    describe("All Fields are populated", () => {
      test("should call setForm", () => {
        renderComponent();
        let rotationDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Rotation");
        let rotationDropdown = rotationDropdowns[rotationDropdowns.length-1][0];
        const updateValue = rotationDropdown.updateValue;
        act(() => updateValue({}, { value: "111" }));
        let rotationWeekDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Rotation Start Week");
        let rotationWeekDropdown = rotationWeekDropdowns[rotationWeekDropdowns.length-1][0];
        const updateWeekValue = rotationWeekDropdown.updateValue;
        act(() => updateWeekValue({}, { value: 1 }));
        let teamDatePickers = DatePicker.mock.calls.filter((m) => m[0].label === "Rotation Start Date");
        let teamDatePicker = teamDatePickers[teamDatePickers.length-1][0];
        const onChange = teamDatePicker.onChange;
        act(() => onChange("12/23/2023"));
        rotationDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Rotation");
        rotationDropdown = rotationDropdowns[rotationDropdowns.length-1][0];
        expect(rotationDropdown.error).toBe(false);
        rotationWeekDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Rotation Start Week");
        rotationWeekDropdown = rotationWeekDropdowns[rotationWeekDropdowns.length-1][0];
        expect(rotationWeekDropdown.error).toBe(false);
        teamDatePickers = DatePicker.mock.calls.filter((m) => m[0].label === "Rotation Start Date");
        teamDatePicker = teamDatePickers[teamDatePickers.length-1][0];
        render(teamDatePicker.renderInput());
        const textFieldLength = TextField.mock.calls.length;
        const textField = TextField.mock.calls[textFieldLength-1][0];
        expect(textField.error).toBe(false);
        expect(mockSetForm).toHaveBeenLastCalledWith({
          type: userFormActions.SET_WFM_ROTATION,
          payload: {
            id: "111",
            startDate: "2023-12-23",
            startWeek: 1
          }
        });
      });
    });
  });
  describe("Availability Fields", () => {
    describe("Availability", () => {
      describe("disable", () => {
        test("is not disabled when formmode is insert", () => {
          renderComponent();
          const availabilityDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Availability");
          const availabilityDropdown = availabilityDropdowns[availabilityDropdowns.length-1][0];
          expect(availabilityDropdown.disabled).toBe(false);
        });
        test("is not rendered when formmode is not insert && Id is populated", () => {
          const formState = {
            ...initialFormState,
            formMode: "update",
            calabrio_wfm: {
              ...initialFormState.calabrio_wfm,
              Id: "I Exist Already"
            }
          };
          useFormState.mockReturnValue(formState);
          renderComponent();
          const availabilityDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Availability");
          expect(availabilityDropdowns.length).toBe(0);
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
        const availabilityDropdown = availabilityDropdowns[availabilityDropdowns.length-1][0];
        const expectedRawOptions = initialTestState.calabrioContext.wfmOptions.find(bu => bu.Id === BusinessUnitId).Availabilities;
        const expectedDropdownOptions = expectedRawOptions.map(o => {
          return {
            ...o,
            label: o.Name,
            value: o.Id
          }
        });
        expect(availabilityDropdown.options).toStrictEqual(expectedDropdownOptions);
      });
      test("updateValue updates availability fields", () => {
        renderComponent();
        let availabilityDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Availability");
        let availabilityDropdown = availabilityDropdowns[availabilityDropdowns.length-1][0];
        const updateValue = availabilityDropdown.updateValue;
        act(() => updateValue({}, { value: "123123" }));
        availabilityDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Availability");
        availabilityDropdown = availabilityDropdowns[availabilityDropdowns.length-1][0];
        expect(availabilityDropdown.value.Id).toBe("123123");
      });
      test("clear dropdown updates field calls setForm with null", () => {
        renderComponent();
        let availabilityDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Availability");
        let availabilityDropdown = availabilityDropdowns[availabilityDropdowns.length-1][0];
        const updateValue = availabilityDropdown.updateValue;
        act(() => updateValue({}, null));
        availabilityDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Availability");
        availabilityDropdown = availabilityDropdowns[availabilityDropdowns.length-1][0];
        expect(availabilityDropdown.value).toBe("");
      });
    });
    describe("Availability Start Date", () => {
      describe("disable", () => {
        test("is not disabled when formmode is insert", () => {
          renderComponent();
          const availabilityDatePickers = DatePicker.mock.calls.filter((m) => m[0].label === "Availability Start Date");
          const availabilityDatePicker = availabilityDatePickers[availabilityDatePickers.length-1][0];
          expect(availabilityDatePicker.disabled).toBe(false);
        });
        test("is not rendered when formmode is not insert && Id is populated", () => {
          const formState = {
            ...initialFormState,
            formMode: "update",
            calabrio_wfm: {
              ...initialFormState.calabrio_wfm,
              Id: "I Exist Already"
            }
          };
          useFormState.mockReturnValue(formState);
          renderComponent();
          const availabilityDatePickers = DatePicker.mock.calls.filter((m) => m[0].label === "Availability Start Date");
          expect(availabilityDatePickers.length).toBe(0);
        });
      });
      test("onChange updates availability start date field", () => {
        renderComponent();
        let availabilityDatePickers = DatePicker.mock.calls.filter((m) => m[0].label === "Availability Start Date");
        let availabilityDatePicker = availabilityDatePickers[availabilityDatePickers.length-1][0];
        const onChange = availabilityDatePicker.onChange;
        act(() => onChange("12/23/2023"));
        availabilityDatePickers = DatePicker.mock.calls.filter((m) => m[0].label === "Availability Start Date");
        availabilityDatePicker = availabilityDatePickers[availabilityDatePickers.length-1][0];
        expect(availabilityDatePicker.value).toBe("2023-12-23");
      });
      test("onChange to null updates availability start date field to null", () => {
        renderComponent();
        let availabilityDatePickers = DatePicker.mock.calls.filter((m) => m[0].label === "Availability Start Date");
        let availabilityDatePicker = availabilityDatePickers[availabilityDatePickers.length-1][0];
        const onChange = availabilityDatePicker.onChange;
        act(() => onChange(null));
        availabilityDatePickers = DatePicker.mock.calls.filter((m) => m[0].label === "Availability Start Date");
        availabilityDatePicker = availabilityDatePickers[availabilityDatePickers.length-1][0];
        expect(availabilityDatePicker.value).toBe(null);
      });
    });
    describe("Error fields", () => {
      describe("availability field is populated but team start date is not", () => {
        test("availability start date error should === true", () => {
          renderComponent();
          let availabilityDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Availability");
          let availabilityDropdown = availabilityDropdowns[availabilityDropdowns.length-1][0];
          const updateValue = availabilityDropdown.updateValue;
          act(() => updateValue({}, { value: "123123" }));
          const availabilityDatePickers = DatePicker.mock.calls.filter((m) => m[0].label === "Availability Start Date");
          const availabilityDatePicker = availabilityDatePickers[availabilityDatePickers.length-1][0];
          render(availabilityDatePicker.renderInput());
          const textFieldLength = TextField.mock.calls.length;
          const textField = TextField.mock.calls[textFieldLength-1][0];
          expect(textField.error).toBe(true);
        })
      });
      describe("availability start date field is populated but team is not", () => {
        test("availability error should === true", () => {
          renderComponent();
          let availabilityDatePickers = DatePicker.mock.calls.filter((m) => m[0].label === "Availability Start Date");
          let availabilityDatePicker = availabilityDatePickers[availabilityDatePickers.length-1][0];
          const onChange = availabilityDatePicker.onChange;
          act(() => onChange("12/23/2023"));
          const availabilityDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Availability");
          const availabilityDropdown = availabilityDropdowns[availabilityDropdowns.length-1][0];
          expect(availabilityDropdown.error).toBe(true);
        })
      });
      describe("AvailabilityId is on missingFields array", () => {
        describe("form.calabrio_wfm.AvailabilityId === null", () => {
          test("error should be true", () => {
            renderComponent(["AvailabilityId"]);
            const availabilityDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Availability");
            const availabilityDropdown = availabilityDropdowns[availabilityDropdowns.length-1][0];
            expect(availabilityDropdown.error).toBe(true);
          });
        });
        describe("form.calabrio_wfm.AvailabilityId !== null", () => {
          test("error should be false", () => {
            const formState = {
              ...initialFormState,
              calabrio_wfm: {
                ...initialFormState.calabrio_wfm,
                AvailabilityId: "111"
              }
            };
            useFormState.mockReturnValue(formState);
            renderComponent(["AvailabilityId"]);
            const availabilityDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Availability");
            const availabilityDropdown = availabilityDropdowns[availabilityDropdowns.length-1][0];
            expect(availabilityDropdown.error).toBe(false);
          });
        });
      });
      describe("AvailabilityStartDate is on missingFields array", () => {
        describe("form.calabrio_wfm.AvailabilityStartDate === null", () => {
          test("error should be true", () => {
            renderComponent(["AvailabilityStartDate"]);
            const availabilityDatePickers = DatePicker.mock.calls.filter((m) => m[0].label === "Availability Start Date");
            const availabilityDatePicker = availabilityDatePickers[availabilityDatePickers.length-1][0];
            render(availabilityDatePicker.renderInput());
            const textFieldLength = TextField.mock.calls.length;
            const textField = TextField.mock.calls[textFieldLength-1][0];
            expect(textField.error).toBe(true);
          });
        });
        describe("form.calabrio_wfm.AvailabilityStartDate !== null", () => {
          test("error should be false", () => {
            const formState = {
              ...initialFormState,
              calabrio_wfm: {
                ...initialFormState.calabrio_wfm,
                AvailabilityStartDate: "05/02/1991"
              }
            };
            useFormState.mockReturnValue(formState);
            renderComponent(["AvailabilityStartDate"]);
            const availabilityDatePickers = DatePicker.mock.calls.filter((m) => m[0].label === "Availability Start Date");
            const availabilityDatePicker = availabilityDatePickers[availabilityDatePickers.length-1][0];
            render(availabilityDatePicker.renderInput());
            const textFieldLength = TextField.mock.calls.length;
            const textField = TextField.mock.calls[textFieldLength-1][0];
            expect(textField.error).toBe(false);
          });
        });
      });
    });
    describe("Both Fields are populated", () => {
      test("should call setForm", () => {
        renderComponent();
        let availabilityDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Availability");
        let availabilityDropdown = availabilityDropdowns[availabilityDropdowns.length-1][0];
        const updateValue = availabilityDropdown.updateValue;
        act(() => updateValue({}, { value: "123123" }));
        let availabilityDatePickers = DatePicker.mock.calls.filter((m) => m[0].label === "Availability Start Date");
        let availabilityDatePicker = availabilityDatePickers[availabilityDatePickers.length-1][0];
        const onChange = availabilityDatePicker.onChange;
        act(() => onChange("12/23/2023"));
        availabilityDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Availability");
        availabilityDropdown = availabilityDropdowns[availabilityDropdowns.length-1][0];
        expect(availabilityDropdown.error).toBe(false);
        availabilityDatePickers = DatePicker.mock.calls.filter((m) => m[0].label === "Availability Start Date");
        availabilityDatePicker = availabilityDatePickers[availabilityDatePickers.length-1][0];
        render(availabilityDatePicker.renderInput());
        const textFieldLength = TextField.mock.calls.length;
        const textField = TextField.mock.calls[textFieldLength-1][0];
        expect(textField.error).toBe(false);
        expect(mockSetForm).toHaveBeenLastCalledWith({
          type: userFormActions.SET_WFM_AVAILABILITY,
          payload: {
            id: "123123",
            startDate: "2023-12-23"
          }
        });
      });
    });
  });
});