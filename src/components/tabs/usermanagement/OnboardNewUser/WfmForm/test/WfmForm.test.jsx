import WfmForm from "../WfmForm";
import React from "react";
import {
  useAdminState,
  userFormActions,
  useFormState,
  useFormDispatch
} from "context";
import { Dropdown, ModalFetchingRing } from "components";
import {
  TextareaAutosize,
  TextField,
  IconButton,
  Tooltip
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { getWfmUserByNNumber } from "services";
import {
  initialFormState,
  initialTestState,
  setupMockedComponents,
  act,
  render,
  waitFor
} from "testUtils";
import {
  getWfmTeams,
  daysOfTheWeekOptions,
  getCalabrioWfmOrg
} from "utils";

jest.mock("context", () => ({
  useAdminState: jest.fn(),
  useAdminDispatch: jest.fn(),
  userFormActions: jest.requireActual("context").userFormActions,
  useFormState: jest.fn(),
  useFormDispatch: jest.fn()
}));

jest.mock("utils", () => ({
  daysOfTheWeekOptions: jest.requireActual("utils").daysOfTheWeekOptions,
  getWfmBusinessUnits: jest.requireActual("utils").getWfmBusinessUnits,
  getWfmTeams: jest.requireActual("utils").getWfmTeams,
  getWfmOptions: jest.requireActual("utils").getWfmOptions,
  isUnpopulatedField: jest.requireActual("utils").isUnpopulatedField,
  getCalabrioWfmOrg: jest.fn(),
  identifyUserProfiles: jest.requireActual("utils").identifyUserProfiles,
  isWfmUserValid: jest.requireActual("utils").isWfmUserValid
}));

jest.mock("components", () => ({
  Dropdown: jest.fn(),
  NNumberInput: jest.fn(),
  StyledButton: jest.fn(),
  ModalFetchingRing: jest.fn()
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
const mockSetMissingFields = jest.fn();
const BusinessUnitId = "123-321";

const renderComponent = (missingFields) => {
  const rendered = render(
    <WfmForm missingFields={missingFields || []} setMissingFields={mockSetMissingFields} />
  );
  if (Dropdown.mock.calls.length > 0) {
    expect(Dropdown).toHaveBeenCalledTimes(2);
    const updateValue = Dropdown.mock.calls[1][0].updateValue;
    act(() => updateValue(null, { value: BusinessUnitId }));
    expect(Dropdown).toHaveBeenCalledTimes(3);
  }
  return rendered;
};

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
    getCalabrioWfmOrg.mockResolvedValue(initialTestState);
    setupMockedComponents({
      Dropdown,
      DatePicker,
      TextField,
      TextareaAutosize,
      ModalFetchingRing
    });
  });
  describe("initial render", () => {
    describe("wfmoptions are loaded", () => {
      test("should render as expected", async () => {
        renderComponent();
        await waitFor(() => expect(Dropdown.mock.calls.length).toBe(18));
        expect(Dropdown.mock.calls[0][0].label).toBe("Business Unit *");
        expect(Dropdown.mock.calls[1][0].label).toBe("Business Unit *");
        expect(Dropdown.mock.calls[2][0].label).toBe("Business Unit *");
        expect(Dropdown.mock.calls[3][0].label).toBe("Business Unit *");
        expect(Dropdown.mock.calls[4][0].label).toBe("Team");
        expect(Dropdown.mock.calls[5][0].label).toBe("First Day of the Week *");
        expect(Dropdown.mock.calls[6][0].label).toBe("Roles");
        expect(Dropdown.mock.calls[7][0].label).toBe("Skills");
        expect(Dropdown.mock.calls[8][0].label).toBe("Workflow Control Set");
        expect(Dropdown.mock.calls[9][0].label).toBe("Optional Columns");
        expect(Dropdown.mock.calls[10][0].label).toBe("Budget Group");
        expect(Dropdown.mock.calls[11][0].label).toBe("Part Time Percentage");
        expect(Dropdown.mock.calls[12][0].label).toBe("Contract Schedule");
        expect(Dropdown.mock.calls[13][0].label).toBe("Contract");
        expect(Dropdown.mock.calls[14][0].label).toBe("Shift Bag");
        expect(Dropdown.mock.calls[15][0].label).toBe("Rotation");
        expect(Dropdown.mock.calls[16][0].label).toBe("Rotation Start Week");
        expect(Dropdown.mock.calls[17][0].label).toBe("Availability");
        expect(TextField.mock.calls.length).toBe(1);
        expect(TextField.mock.calls[0][0].label).toBe("Identity");
        expect(DatePicker.mock.calls.length).toBe(5);
        expect(DatePicker.mock.calls[0][0].label).toBe("Team Start Date");
        expect(DatePicker.mock.calls[1][0].label).toBe("Person Start Date");
        expect(DatePicker.mock.calls[2][0].label).toBe("Skills Start Date");
        expect(DatePicker.mock.calls[3][0].label).toBe("Rotation Start Date");
        expect(DatePicker.mock.calls[4][0].label).toBe("Availability Start Date");
      });
    });
    describe("wfmoptions are not loaded", () => {
      test("should render as expected", () => {
        useAdminState.mockReturnValue({
          ...initialTestState,
          calabrioContext: {
            ...initialTestState.calabrioContext,
            wfmOptions: []
          }
        });
        const rendered = renderComponent();
        expect(Dropdown.mock.calls.length).toBe(0);
        expect(rendered.container).toHaveTextContent("WFM Options did not load, please refresh triton and try again");
      });
    });
    describe("form.calabrio_wfm.userFound === true", () => {
      const formState = {
        ...initialFormState,
        calabrio_wfm: {
          ...initialFormState.calabrio_wfm,
          Id: null,
          userFound: true
        },
        formMode: "update"
      };
      const wfmUser = {
        BusinessUnitId: "123-321",
        Id: "Whatever"
      };
      describe("form.calabrio_wfm.Id is null", () => {
        describe("getWfmUserByNNumber throws an error", () => {
          test("should not call an additional set form", async () => {
            useFormState.mockReturnValue(formState)
            getWfmUserByNNumber.mockRejectedValue("Boo");
            render(
              <WfmForm missingFields={[]} setMissingFields={mockSetMissingFields} />
            );
            await waitFor(() => {
              expect(getWfmUserByNNumber).toHaveBeenCalledTimes(1);
              expect(mockSetForm).toHaveBeenCalledTimes(1);
            });
          });
        });
        describe("getWfmUserByNNumber returns no worker", () => {
          test("should not call an additional set form", async () => {
            useFormState.mockReturnValue(formState)
            getWfmUserByNNumber.mockResolvedValue({
              data: {
                Result: []
              }
            })
            render(
              <WfmForm missingFields={[]} setMissingFields={mockSetMissingFields} />
            );
            await waitFor(() => {
              expect(getWfmUserByNNumber).toHaveBeenCalledTimes(1);
              expect(mockSetForm).toHaveBeenCalledTimes(1);
            });
          });
        });
        describe("getWfmUserByNNumber returns a worker", () => {
          test("should call checkForWfmWorker", async () => {
            useFormState.mockReturnValue(formState)
            getWfmUserByNNumber.mockResolvedValue({
              data: {
                Result: [wfmUser]
              }
            })
            render(
              <WfmForm missingFields={[]} setMissingFields={mockSetMissingFields} />
            );
            await waitFor(() => {
              expect(getWfmUserByNNumber).toHaveBeenCalledTimes(1);
              expect(mockSetForm).toHaveBeenCalledTimes(2);
              expect(mockSetForm).toHaveBeenCalledWith({
                type: "SET_UPDATE_WFM_FORM_STATE",
                payload: {
                  formMode: formState.formMode,
                  user: wfmUser,
                  state: initialTestState
                }
              })
            });
          });
        });
      });
      describe("form.calabrio_wfm.Id is not null", () => {
        test("should not call getWfmUserByNNumber", async () => {
          useFormState.mockReturnValue({
            ...formState,
            calabrio_wfm: {
              ...formState.calabrio_wfm,
              Id: "32164856"
            }
          });
          render(
            <WfmForm missingFields={[]} setMissingFields={mockSetMissingFields} />
          );
          await waitFor(() => {
            expect(getWfmUserByNNumber).toHaveBeenCalledTimes(0);
            expect(mockSetForm).toHaveBeenCalledTimes(1);
          });
        });
      });
    });
    describe("business units fail", () => {
      test("should render failed message", async () => {
        getCalabrioWfmOrg.mockRejectedValue("booo");
        const rendered = renderComponent();
        await waitFor(() => expect(rendered.container).toHaveTextContent("Business Unit Data failed to load"));
      });
    });
  });
  describe("Business Unit Dropdown", () => {
    describe("error", () => {
      describe("BusinessUnitId is on missingFields array", () => {
        describe("form.calabrio_wfm.BusinessUnitId === null", () => {
          test("error should be true", () => {
            render(
              <WfmForm missingFields={["BusinessUnitId"]} setMissingFields={mockSetMissingFields} />
            );
            const buDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Business Unit *");
            const buDropdown = buDropdowns[buDropdowns.length - 1][0];
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
            const buDropdown = buDropdowns[buDropdowns.length - 1][0];
            expect(buDropdown.error).toBe(false);
          });
        });
      });
    });
    test("options", () => {
      renderComponent();
      const buDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Business Unit *");
      const buDropdown = buDropdowns[buDropdowns.length - 1][0];
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
      const buDropdown = buDropdowns[buDropdowns.length - 1][0];
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
      const buDropdown = buDropdowns[buDropdowns.length - 1][0];
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
            test("error should be true", async () => {
              renderComponent(["TeamId"]);
              await waitFor(() => expect(Dropdown.mock.calls.length).toBe(18));
              const teamDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Team");
              const teamDropdown = teamDropdowns[teamDropdowns.length - 1][0];
              expect(teamDropdown.error).toBe(true);
            });
          });
          describe("form.calabrio_wfm.TeamStartDate !== null", () => {
            test("error should be false", async () => {
              const formState = {
                ...initialFormState,
                calabrio_wfm: {
                  ...initialFormState.calabrio_wfm,
                  TeamId: "111"
                }
              };
              useFormState.mockReturnValue(formState);
              renderComponent(["TeamId"]);
              await waitFor(() => expect(Dropdown.mock.calls.length).toBe(18));
              const teamDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Team");
              const teamDropdown = teamDropdowns[teamDropdowns.length - 1][0];
              expect(teamDropdown.error).toBe(false);
            });
          });
        });
      });
      describe("disable", () => {
        test("is not disabled when formmode is insert", async () => {
          renderComponent();
          await waitFor(() => expect(Dropdown.mock.calls.length).toBe(18));
          const teamDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Team");
          const teamDropdown = teamDropdowns[teamDropdowns.length - 1][0];
          expect(teamDropdown.disabled).toBe(false);
        });
        test("is disabled when formmode is not insert && Id is populated", async () => {
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
          await waitFor(() => expect(Dropdown.mock.calls.length).toBe(15));
          const teamDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Team");
          const teamDropdown = teamDropdowns[teamDropdowns.length - 1][0];
          expect(teamDropdown.disabled).toBe(true);
        });
      });
      test("options", async () => {
        renderComponent();
        await waitFor(() => expect(Dropdown.mock.calls.length).toBe(18));
        const teamDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Team");
        const teamDropdown = teamDropdowns[teamDropdowns.length - 1][0];
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
      test("updateValue updates team fields", async () => {
        renderComponent();
        await waitFor(() => expect(Dropdown.mock.calls.length).toBe(18));
        let teamDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Team");
        let teamDropdown = teamDropdowns[teamDropdowns.length - 1][0];
        const updateValue = teamDropdown.updateValue;
        act(() => updateValue({}, { value: "111" }));
        expect(mockSetForm).toHaveBeenLastCalledWith({
          type: userFormActions.SET_WFM_TEAM,
          payload: {
            id: "111",
            startDate: undefined
          }
        });
      });
      test("clear dropdown updates field calls setForm with null", async () => {
        renderComponent();
        await waitFor(() => expect(Dropdown.mock.calls.length).toBe(18));
        let teamDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Team");
        let teamDropdown = teamDropdowns[teamDropdowns.length - 1][0];
        const updateValue = teamDropdown.updateValue;
        act(() => updateValue({}, null));
        teamDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Team");
        teamDropdown = teamDropdowns[teamDropdowns.length - 1][0];
        expect(teamDropdown.value).toBe("");
      });
    });
    describe("Team Start Date", () => {
      describe("disable", () => {
        test("is not disabled when formmode is insert", async () => {
          renderComponent();
          await waitFor(() => expect(Dropdown.mock.calls.length).toBe(18));
          const teamDatePickers = DatePicker.mock.calls.filter((m) => m[0].label === "Team Start Date");
          const teamDatePicker = teamDatePickers[teamDatePickers.length - 1][0];
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
      test("onChange updates team fields", async () => {
        renderComponent();
        await waitFor(() => expect(Dropdown.mock.calls.length).toBe(18));
        let teamDatePickers = DatePicker.mock.calls.filter((m) => m[0].label === "Team Start Date");
        let teamDatePicker = teamDatePickers[teamDatePickers.length - 1][0];
        const onChange = teamDatePicker.onChange;
        act(() => onChange("12/23/2023"));
        expect(mockSetForm).toHaveBeenLastCalledWith({
          type: userFormActions.SET_WFM_TEAM,
          payload: {
            id: null,
            startDate: "2023-12-23"
          }
        });
      });
      test("onChange null updates team fields with null", async () => {
        renderComponent();
        await waitFor(() => expect(Dropdown.mock.calls.length).toBe(18));
        let teamDatePickers = DatePicker.mock.calls.filter((m) => m[0].label === "Team Start Date");
        let teamDatePicker = teamDatePickers[teamDatePickers.length - 1][0];
        const onChange = teamDatePicker.onChange;
        act(() => onChange(null));
        expect(mockSetForm).toHaveBeenLastCalledWith({
          type: userFormActions.SET_WFM_TEAM,
          payload: {
            id: null,
            startDate: null
          }
        });
      });
    });
    describe("Error fields", () => {
      describe("TeamId is on missingFields array", () => {
        describe("form.calabrio_wfm.TeamId === null", () => {
          test("error should be true", async () => {
            renderComponent(["TeamId"]);
            await waitFor(() => expect(Dropdown.mock.calls.length).toBe(18));
            const teamDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Team");
            const teamDropdown = teamDropdowns[teamDropdowns.length - 1][0];
            expect(teamDropdown.error).toBe(true);
          });
        });
        describe("form.calabrio_wfm.TeamId !== null", () => {
          test("error should be false", async () => {
            const formState = {
              ...initialFormState,
              calabrio_wfm: {
                ...initialFormState.calabrio_wfm,
                TeamId: "111"
              }
            };
            useFormState.mockReturnValue(formState);
            renderComponent(["TeamId"]);
            await waitFor(() => expect(Dropdown.mock.calls.length).toBe(18));
            const teamDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Team");
            const teamDropdown = teamDropdowns[teamDropdowns.length - 1][0];
            expect(teamDropdown.error).toBe(false);
          });
        });
      });
      describe("TeamStartDate is on missingFields array", () => {
        describe("form.calabrio_wfm.TeamStartDate === null", () => {
          test("error should be true", async () => {
            renderComponent(["TeamStartDate"]);
            await waitFor(() => expect(Dropdown.mock.calls.length).toBe(18));
            const teamDatePickers = DatePicker.mock.calls.filter((m) => m[0].label === "Team Start Date");
            const teamDatePicker = teamDatePickers[teamDatePickers.length - 1][0];
            render(teamDatePicker.renderInput());
            const textFieldLength = TextField.mock.calls.length;
            const textField = TextField.mock.calls[textFieldLength - 1][0];
            expect(textField.error).toBe(true);
          });
        });
        describe("form.calabrio_wfm.TeamStartDate !== null", () => {
          test("error should be false", async () => {
            const formState = {
              ...initialFormState,
              calabrio_wfm: {
                ...initialFormState.calabrio_wfm,
                TeamStartDate: "05/02/1991"
              }
            };
            useFormState.mockReturnValue(formState);
            renderComponent(["TeamStartDate"]);
            await waitFor(() => expect(Dropdown.mock.calls.length).toBe(18));
            const teamDatePickers = DatePicker.mock.calls.filter((m) => m[0].label === "Team Start Date");
            const teamDatePicker = teamDatePickers[teamDatePickers.length - 1][0];
            render(teamDatePicker.renderInput());
            const textFieldLength = TextField.mock.calls.length;
            const textField = TextField.mock.calls[textFieldLength - 1][0];
            expect(textField.error).toBe(false);
          });
        });
      });
    });
  });
  describe("Identity Field", () => {
    describe("disable", () => {
      test("is not disabled when formmode is insert", async () => {
        renderComponent();
        await waitFor(() => expect(Dropdown.mock.calls.length).toBe(18));
        const identityFields = TextField.mock.calls.filter((m) => m[0].label === "Identity");
        const identityField = identityFields[identityFields.length - 1][0];
        expect(identityField.disabled).toBe(false);
      });
      test("is disabled when formmode is not insert && Id is populated", async () => {
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
        await waitFor(() => expect(Dropdown.mock.calls.length).toBe(15));
        const identityFields = TextField.mock.calls.filter((m) => m[0].label === "Identity");
        const identityField = identityFields[identityFields.length - 1][0];
        expect(identityField.disabled).toBe(true);
      });
    });
    describe("InputProps", () => {
      describe("initial render", () => {
        test("should render as expected", async () => {
          renderComponent();
          await waitFor(() => expect(Dropdown.mock.calls.length).toBe(18));
          const identityFields = TextField.mock.calls.filter((m) => m[0].label === "Identity");
          const identityField = identityFields[identityFields.length - 1][0];
          render(identityField.InputProps.endAdornment);
          expect(Tooltip.mock.calls.length).toBe(1);
          expect(Tooltip.mock.calls[0][0].title).toBe("Use HR Email");
          render(Tooltip.mock.calls[0][0].children);
          expect(IconButton.mock.calls.length).toBe(1);
        })
      });
      describe("Icon Button is clicked", () => {
        test("should call setForm", async () => {
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
          await waitFor(() => expect(Dropdown.mock.calls.length).toBe(18));
          const identityFields = TextField.mock.calls.filter((m) => m[0].label === "Identity");
          const identityField = identityFields[identityFields.length - 1][0];
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
    test("onChange calls setForm", async () => {
      renderComponent();
      await waitFor(() => expect(Dropdown.mock.calls.length).toBe(18));
      const identityFields = TextField.mock.calls.filter((m) => m[0].label === "Identity");
      const identityField = identityFields[identityFields.length - 1][0];
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
          test("error should be true", async () => {
            renderComponent(["FirstDayOfWeek"]);
            await waitFor(() => expect(Dropdown.mock.calls.length).toBe(18));
            const teamDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "First Day of the Week *");
            const teamDropdown = teamDropdowns[teamDropdowns.length - 1][0];
            expect(teamDropdown.error).toBe(true);
          });
        });
        describe("form.calabrio_wfm.FirstDayOfWeek !== null", () => {
          test("error should be false", async () => {
            const formState = {
              ...initialFormState,
              calabrio_wfm: {
                ...initialFormState.calabrio_wfm,
                FirstDayOfWeek: 0
              }
            };
            useFormState.mockReturnValue(formState);
            renderComponent(["FirstDayOfWeek"]);
            await waitFor(() => expect(Dropdown.mock.calls.length).toBe(18));
            const teamDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "First Day of the Week *");
            const teamDropdown = teamDropdowns[teamDropdowns.length - 1][0];
            expect(teamDropdown.error).toBe(false);
          });
        });
      });
    });
    describe("disable", () => {
      test("is not disabled when formmode is insert", async () => {
        renderComponent();
        await waitFor(() => expect(Dropdown.mock.calls.length).toBe(18));
        const firstDayDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "First Day of the Week *");
        const firstDayDropdown = firstDayDropdowns[firstDayDropdowns.length - 1][0];
        expect(firstDayDropdown.disabled).toBe(false);
      });
      test("is disabled when formmode is not insert && Id is populated", async () => {
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
        await waitFor(() => expect(Dropdown.mock.calls.length).toBe(15));
        const firstDayDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "First Day of the Week *");
        const firstDayDropdown = firstDayDropdowns[firstDayDropdowns.length - 1][0];
        expect(firstDayDropdown.disabled).toBe(true);
      });
    });
    test("options", async () => {
      renderComponent();
      await waitFor(() => expect(Dropdown.mock.calls.length).toBe(18));
      const firstDayDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "First Day of the Week *");
      const firstDayDropdown = firstDayDropdowns[firstDayDropdowns.length - 1][0];
      expect(firstDayDropdown.options).toEqual(daysOfTheWeekOptions);
    });
    test("updateValue calls setForm", async () => {
      renderComponent();
      await waitFor(() => expect(Dropdown.mock.calls.length).toBe(18));
      const firstDayDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "First Day of the Week *");
      const firstDayDropdown = firstDayDropdowns[firstDayDropdowns.length - 1][0];
      const updateValue = firstDayDropdown.updateValue;
      act(() => updateValue({}, { value: 1 }));
      expect(mockSetForm).toHaveBeenLastCalledWith({
        type: userFormActions.SET_WFM_FIRST_DAY_OF_WEEK,
        payload: 1
      });
    });
    test("clear dropdown updates field calls setForm with null", async () => {
      renderComponent();
      await waitFor(() => expect(Dropdown.mock.calls.length).toBe(18));
      const firstDayDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "First Day of the Week *");
      const firstDayDropdown = firstDayDropdowns[firstDayDropdowns.length - 1][0];
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
      test("is not disabled when formmode is insert", async () => {
        renderComponent();
        await waitFor(() => expect(Dropdown.mock.calls.length).toBe(18));
        const rolesDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Roles");
        const rolesDropdown = rolesDropdowns[rolesDropdowns.length - 1][0];
        expect(rolesDropdown.disabled).toBe(false);
      });
      test("is disabled when formmode is not insert && Id is populated", async () => {
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
        await waitFor(() => expect(Dropdown.mock.calls.length).toBe(15));
        const rolesDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Roles");
        const rolesDropdown = rolesDropdowns[rolesDropdowns.length - 1][0];
        expect(rolesDropdown.disabled).toBe(true);
      });
    });
    test("options", async () => {
      const formState = {
        ...initialFormState,
        calabrio_wfm: {
          ...initialFormState.calabrio_wfm,
          BusinessUnitId
        }
      };
      useFormState.mockReturnValue(formState);
      renderComponent();
      await waitFor(() => expect(Dropdown.mock.calls.length).toBe(18));
      const rolesDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Roles");
      const rolesDropdown = rolesDropdowns[rolesDropdowns.length - 1][0];
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
    test("updateValue calls setForm", async () => {
      renderComponent();
      await waitFor(() => expect(Dropdown.mock.calls.length).toBe(18));
      const rolesDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Roles");
      const rolesDropdown = rolesDropdowns[rolesDropdowns.length - 1][0];
      const updateValue = rolesDropdown.updateValue;
      act(() => updateValue({}, ["111"]));
      expect(mockSetForm).toHaveBeenLastCalledWith({
        type: userFormActions.SET_WFM_ROLES,
        payload: ["111"]
      });
    });
    test("updateValue calls setForm", async () => {
      renderComponent();
      await waitFor(() => expect(Dropdown.mock.calls.length).toBe(18));
      const rolesDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Roles");
      const rolesDropdown = rolesDropdowns[rolesDropdowns.length - 1][0];
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
        test("is not disabled when formmode is insert", async () => {
          renderComponent();
          await waitFor(() => expect(Dropdown.mock.calls.length).toBe(18));
          const skillsDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Skills");
          const skillsDropdown = skillsDropdowns[skillsDropdowns.length - 1][0];
          expect(skillsDropdown.disabled).toBe(false);
        });
        test("is disabled when formmode is not insert && Id is populated", async () => {
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
          await waitFor(() => expect(Dropdown.mock.calls.length).toBe(15));
          const skillsDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Skills");
          const skillsDropdown = skillsDropdowns[skillsDropdowns.length - 1][0];
          expect(skillsDropdown.disabled).toBe(true);
        });
      });
      test("options", async () => {
        const formState = {
          ...initialFormState,
          calabrio_wfm: {
            ...initialFormState.calabrio_wfm,
            BusinessUnitId
          }
        };
        useFormState.mockReturnValue(formState);
        renderComponent();
        await waitFor(() => expect(Dropdown.mock.calls.length).toBe(18));
        const skillsDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Skills");
        const skillsDropdown = skillsDropdowns[skillsDropdowns.length - 1][0];
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
      test("updateValue calls setForm", async () => {
        renderComponent();
        await waitFor(() => expect(Dropdown.mock.calls.length).toBe(18));
        let skillsDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Skills");
        let skillsDropdown = skillsDropdowns[skillsDropdowns.length - 1][0];
        const updateValue = skillsDropdown.updateValue;
        act(() => updateValue({}, [{
          Id: "222",
          Name: "Skill2"
        }]));
        expect(mockSetForm).toHaveBeenLastCalledWith({
          type: userFormActions.SET_WFM_SKILLS,
          payload: {
            skills: [{
              Id: "222",
              Name: "Skill2"
            }],
            startDate: undefined
          }
        });
        skillsDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Skills");
        skillsDropdown = skillsDropdowns[skillsDropdowns.length - 1][0];
      });
      describe("option in options array is undefined", () => {
        test("should return empty array for options", async () => {
          useAdminState.mockReturnValue({
            ...initialTestState,
            calabrioContext: {
              ...initialTestState.calabrioContext,
              wfmOptions: [
                {
                  Id: "123-321",
                  Name: "WFM Business Unit1",
                  Absences: undefined,
                  Availabilities: undefined,
                  Budget_Groups: undefined,
                  Contract_Schedules: undefined,
                  Contracts: undefined,
                  Optional_Columns: undefined,
                  Part_Time_Percentages: undefined,
                  Roles: undefined,
                  Rotations: undefined,
                  Shift_Bags: undefined,
                  Skills: undefined,
                  Workflow_Control_Sets: undefined
                },
              ]
            }
          });
          renderComponent();
          await waitFor(() => expect(Dropdown.mock.calls.length).toBe(18));
          const skillsDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Skills");
          const skillsDropdown = skillsDropdowns[skillsDropdowns.length - 1][0];
          expect(skillsDropdown.options).toStrictEqual([]);
        });
      });
    });
    describe("Skills Start Date", () => {
      describe("disable", () => {
        test("is not disabled when formmode is insert", async () => {
          renderComponent();
          await waitFor(() => expect(Dropdown.mock.calls.length).toBe(18));
          const skillDatePickers = DatePicker.mock.calls.filter((m) => m[0].label === "Skills Start Date");
          const skillDatePicker = skillDatePickers[skillDatePickers.length - 1][0];
          expect(skillDatePicker.disabled).toBe(false);
        });
        test("does not render when formmode is not insert && Id is populated", async () => {
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
          await waitFor(() => expect(Dropdown.mock.calls.length).toBe(15));
          const skillDatePickers = DatePicker.mock.calls.filter((m) => m[0].label === "Skills Start Date");
          expect(skillDatePickers.length).toBe(0);
        });
      });
      test("onChange updates skill date field", async () => {
        renderComponent();
        await waitFor(() => expect(Dropdown.mock.calls.length).toBe(18));
        let skillDatePickers = DatePicker.mock.calls.filter((m) => m[0].label === "Skills Start Date");
        let skillDatePicker = skillDatePickers[skillDatePickers.length - 1][0];
        const onChange = skillDatePicker.onChange;
        act(() => onChange("12/23/2023"));
        expect(mockSetForm).toHaveBeenLastCalledWith({
          type: userFormActions.SET_WFM_SKILLS,
          payload: {
            skills: [],
            startDate: "2023-12-23"
          }
        });
      });
      test("onChange to null updates skill date field to null", async () => {
        renderComponent();
        await waitFor(() => expect(Dropdown.mock.calls.length).toBe(18));
        let skillDatePickers = DatePicker.mock.calls.filter((m) => m[0].label === "Skills Start Date");
        let skillDatePicker = skillDatePickers[skillDatePickers.length - 1][0];
        const onChange = skillDatePicker.onChange;
        act(() => onChange(null));
        expect(mockSetForm).toHaveBeenLastCalledWith({
          type: userFormActions.SET_WFM_SKILLS,
          payload: {
            skills: [],
            startDate: null
          }
        });
      });
    });
    describe("Error fields", () => {
      describe("PersonSkills is on missingFields array", () => {
        describe("form.calabrio_wfm.PersonSkills === null", () => {
          test("error should be true", async () => {
            renderComponent(["PersonSkills"]);
            await waitFor(() => expect(Dropdown.mock.calls.length).toBe(18));
            let skillsDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Skills");
            let skillsDropdown = skillsDropdowns[skillsDropdowns.length - 1][0];
            expect(skillsDropdown.error).toBe(true);
          });
        });
        describe("form.calabrio_wfm.PersonSkills !== null", () => {
          test("error should be false", async () => {
            const formState = {
              ...initialFormState,
              calabrio_wfm: {
                ...initialFormState.calabrio_wfm,
                PersonSkills: ["SKILL"]
              }
            };
            useFormState.mockReturnValue(formState);
            renderComponent(["PersonSkills"]);
            await waitFor(() => expect(Dropdown.mock.calls.length).toBe(18));
            let skillsDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Skills");
            let skillsDropdown = skillsDropdowns[skillsDropdowns.length - 1][0];
            expect(skillsDropdown.error).toBe(false);
          });
        });
      });
      describe("SkillsStartDate is on missingFields array", () => {
        describe("form.calabrio_wfm.SkillsStartDate === null", () => {
          test("error should be true", async () => {
            renderComponent(["SkillsStartDate"]);
            await waitFor(() => expect(Dropdown.mock.calls.length).toBe(18));
            const teamDatePickers = DatePicker.mock.calls.filter((m) => m[0].label === "Skills Start Date");
            const teamDatePicker = teamDatePickers[teamDatePickers.length - 1][0];
            render(teamDatePicker.renderInput());
            const textFieldLength = TextField.mock.calls.length;
            const textField = TextField.mock.calls[textFieldLength - 1][0];
            expect(textField.error).toBe(true);
          });
        });
        describe("form.calabrio_wfm.SkillsStartDate !== null", () => {
          test("error should be false", async () => {
            const formState = {
              ...initialFormState,
              calabrio_wfm: {
                ...initialFormState.calabrio_wfm,
                SkillsStartDate: "05/02/1991"
              }
            };
            useFormState.mockReturnValue(formState);
            renderComponent(["SkillsStartDate"]);
            await waitFor(() => expect(Dropdown.mock.calls.length).toBe(18));
            const teamDatePickers = DatePicker.mock.calls.filter((m) => m[0].label === "Skills Start Date");
            const teamDatePicker = teamDatePickers[teamDatePickers.length - 1][0];
            render(teamDatePicker.renderInput());
            const textFieldLength = TextField.mock.calls.length;
            const textField = TextField.mock.calls[textFieldLength - 1][0];
            expect(textField.error).toBe(false);
          });
        });
      });
    });
  });
  describe("Workflow Control Set", () => {
    describe("disable", () => {
      test("is not disabled when formmode is insert", async () => {
        renderComponent();
        await waitFor(() => expect(Dropdown.mock.calls.length).toBe(18));
        const controlSetDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Workflow Control Set");
        const controlSetDropdown = controlSetDropdowns[controlSetDropdowns.length - 1][0];
        expect(controlSetDropdown.disabled).toBe(false);
      });
      test("is disabled when formmode is not insert && Id is populated", async () => {
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
        await waitFor(() => expect(Dropdown.mock.calls.length).toBe(15));
        const controlSetDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Workflow Control Set");
        const controlSetDropdown = controlSetDropdowns[controlSetDropdowns.length - 1][0];
        expect(controlSetDropdown.disabled).toBe(true);
      });
    });
    test("options", async () => {
      renderComponent();
      await waitFor(() => expect(Dropdown.mock.calls.length).toBe(18));
      const controlSetDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Workflow Control Set");
      const controlSetDropdown = controlSetDropdowns[controlSetDropdowns.length - 1][0];
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
    test("updateValue calls setForm", async () => {
      renderComponent();
      await waitFor(() => expect(Dropdown.mock.calls.length).toBe(18));
      const controlSetDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Workflow Control Set");
      const controlSetDropdown = controlSetDropdowns[controlSetDropdowns.length - 1][0];
      const updateValue = controlSetDropdown.updateValue;
      act(() => updateValue({}, { value: "111" }));
      expect(mockSetForm).toHaveBeenLastCalledWith({
        type: userFormActions.SET_WFM_CONTROL_SET,
        payload: "111"
      });
    });
    test("clear dropdown updates field calls setForm with null", async () => {
      renderComponent();
      await waitFor(() => expect(Dropdown.mock.calls.length).toBe(18));
      const controlSetDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Workflow Control Set");
      const controlSetDropdown = controlSetDropdowns[controlSetDropdowns.length - 1][0];
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
      test("is not disabled when formmode is insert", async () => {
        renderComponent();
        await waitFor(() => expect(Dropdown.mock.calls.length).toBe(18));
        const columnsDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Optional Columns");
        const columnsDropdown = columnsDropdowns[columnsDropdowns.length - 1][0];
        expect(columnsDropdown.disabled).toBe(false);
      });
      test("is disabled when formmode is not insert && Id is populated", async () => {
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
        await waitFor(() => expect(Dropdown.mock.calls.length).toBe(15));
        const columnsDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Optional Columns");
        const columnsDropdown = columnsDropdowns[columnsDropdowns.length - 1][0];
        expect(columnsDropdown.disabled).toBe(true);
      });
    });
    test("options", async () => {
      const formState = {
        ...initialFormState,
        calabrio_wfm: {
          ...initialFormState.calabrio_wfm,
          BusinessUnitId
        }
      };
      useFormState.mockReturnValue(formState);
      renderComponent();
      await waitFor(() => expect(Dropdown.mock.calls.length).toBe(18));
      const columnsDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Optional Columns");
      const columnsDropdown = columnsDropdowns[columnsDropdowns.length - 1][0];
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
    test("updateValue adds to optionalColumns", async () => {
      renderComponent();
      await waitFor(() => expect(Dropdown.mock.calls.length).toBe(18));
      const columnOption = {
        value: "222",
        label: "OptionalCol2",
        Id: "222",
        Name: "OptionalCol2"
      };
      let columnsDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Optional Columns");
      let columnsDropdown = columnsDropdowns[columnsDropdowns.length - 1][0];
      const updateValue = columnsDropdown.updateValue;
      act(() => updateValue({}, [columnOption]));
      columnsDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Optional Columns");
      columnsDropdown = columnsDropdowns[columnsDropdowns.length - 1][0];
      expect(columnsDropdown.value).toStrictEqual([{
        ...columnOption,
        columnValue: ""
      }]);
      let optionalColumnFields = TextField.mock.calls.filter((m) => m[0]?.label === `${columnOption.Name} value *`);
      let optionalColumnField = optionalColumnFields[optionalColumnFields.length - 1][0];
      expect(optionalColumnField.value).toBe("");
      expect(optionalColumnField.error).toBe(true);
    });
    test("updating optional column value calls setForm", async () => {
      renderComponent();
      await waitFor(() => expect(Dropdown.mock.calls.length).toBe(18));
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
      let columnsDropdown = columnsDropdowns[columnsDropdowns.length - 1][0];
      const updateValue = columnsDropdown.updateValue;
      act(() => updateValue({}, [columnOption1, columnOption2]));
      columnsDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Optional Columns");
      columnsDropdown = columnsDropdowns[columnsDropdowns.length - 1][0];

      let optionalColumnFields = TextField.mock.calls.filter((m) => m[0]?.label === `${columnOption2.Name} value *`);
      let optionalColumnField = optionalColumnFields[optionalColumnFields.length - 1][0];
      const valueOnChange = optionalColumnField.onChange;
      act(() => valueOnChange({
        target: {
          value: "kittens"
        }
      }))
      optionalColumnFields = TextField.mock.calls.filter((m) => m[0]?.label === `${columnOption2.Name} value *`);
      optionalColumnField = optionalColumnFields[optionalColumnFields.length - 1][0];
      expect(optionalColumnField.value).toBe("kittens");
      expect(optionalColumnField.error).toBe(false);
      columnsDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Optional Columns");
      columnsDropdown = columnsDropdowns[columnsDropdowns.length - 1][0];
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
    test("Adding a column does not delete the value in other columns", async () => {
      renderComponent();
      await waitFor(() => expect(Dropdown.mock.calls.length).toBe(18));
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
      let columnsDropdown = columnsDropdowns[columnsDropdowns.length - 1][0];
      const updateValue = columnsDropdown.updateValue;
      act(() => updateValue({}, [columnOption1]));
      columnsDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Optional Columns");
      columnsDropdown = columnsDropdowns[columnsDropdowns.length - 1][0];
      const updateValueAgain = columnsDropdown.updateValue;
      act(() => updateValueAgain({}, [columnOption1, columnOption2]));

      let optionalColumn2Fields = TextField.mock.calls.filter((m) => m[0]?.label === `${columnOption2.Name} value *`);
      let optionalColumn2Field = optionalColumn2Fields[optionalColumn2Fields.length - 1][0];
      const value2OnChange = optionalColumn2Field.onChange;
      act(() => value2OnChange({
        target: {
          value: "kittens"
        }
      }))
      let optionalColumn1Fields = TextField.mock.calls.filter((m) => m[0]?.label === `${columnOption1.Name} value *`);
      let optionalColumn1Field = optionalColumn1Fields[optionalColumn1Fields.length - 1][0];
      const value1OnChange = optionalColumn1Field.onChange;
      act(() => value1OnChange({
        target: {
          value: "puppies"
        }
      }))
      columnsDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Optional Columns");
      columnsDropdown = columnsDropdowns[columnsDropdowns.length - 1][0];
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
    test("when column/value already exist, setForm is not called", async () => {
      renderComponent();
      await waitFor(() => expect(Dropdown.mock.calls.length).toBe(18));
      let columnsDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Optional Columns");
      let columnsDropdown = columnsDropdowns[columnsDropdowns.length - 1][0];
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
      test("is not disabled when formmode is insert", async () => {
        renderComponent();
        await waitFor(() => expect(Dropdown.mock.calls.length).toBe(18));
        const budgetGroupDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Budget Group");
        const budgetGroupDropdown = budgetGroupDropdowns[budgetGroupDropdowns.length - 1][0];
        expect(budgetGroupDropdown.disabled).toBe(false);
      });
      test("is disabled when formmode is not insert && Id is populated", async () => {
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
        await waitFor(() => expect(Dropdown.mock.calls.length).toBe(15));
        const budgetGroupDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Budget Group");
        const budgetGroupDropdown = budgetGroupDropdowns[budgetGroupDropdowns.length - 1][0];
        expect(budgetGroupDropdown.disabled).toBe(true);
      });
    });
    test("options", async () => {
      renderComponent();
      await waitFor(() => expect(Dropdown.mock.calls.length).toBe(18));
      const budgetGroupDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Budget Group");
      const budgetGroupDropdown = budgetGroupDropdowns[budgetGroupDropdowns.length - 1][0];
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
    test("updateValue calls setForm", async () => {
      renderComponent();
      await waitFor(() => expect(Dropdown.mock.calls.length).toBe(18));
      const budgetGroupDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Budget Group");
      const budgetGroupDropdown = budgetGroupDropdowns[budgetGroupDropdowns.length - 1][0];
      const updateValue = budgetGroupDropdown.updateValue;
      act(() => updateValue({}, { value: "000" }));
      expect(mockSetForm).toHaveBeenLastCalledWith({
        type: userFormActions.SET_WFM_BUDGET_GROUP,
        payload: "000"
      });
    });
    test("clear dropdown updates field calls setForm with null", async () => {
      renderComponent();
      await waitFor(() => expect(Dropdown.mock.calls.length).toBe(18));
      const budgetGroupDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Budget Group");
      const budgetGroupDropdown = budgetGroupDropdowns[budgetGroupDropdowns.length - 1][0];
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
      test("is not disabled when formmode is insert", async () => {
        renderComponent();
        await waitFor(() => expect(Dropdown.mock.calls.length).toBe(18));
        const shiftBagDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Shift Bag");
        const shiftBagDropdown = shiftBagDropdowns[shiftBagDropdowns.length - 1][0];
        expect(shiftBagDropdown.disabled).toBe(false);
      });
      test("is disabled when formmode is not insert && Id is populated", async () => {
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
        await waitFor(() => expect(Dropdown.mock.calls.length).toBe(15));
        const shiftBagDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Shift Bag");
        const shiftBagDropdown = shiftBagDropdowns[shiftBagDropdowns.length - 1][0];
        expect(shiftBagDropdown.disabled).toBe(true);
      });
    });
    test("options", async () => {
      const formState = {
        ...initialFormState,
        calabrio_wfm: {
          ...initialFormState.calabrio_wfm,
          BusinessUnitId
        }
      };
      useFormState.mockReturnValue(formState);
      renderComponent();
      await waitFor(() => expect(Dropdown.mock.calls.length).toBe(18));
      const shiftBagDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Shift Bag");
      const shiftBagDropdown = shiftBagDropdowns[shiftBagDropdowns.length - 1][0];
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
    test("updateValue calls setForm", async () => {
      renderComponent();
      await waitFor(() => expect(Dropdown.mock.calls.length).toBe(18));
      const shiftBagDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Shift Bag");
      const shiftBagDropdown = shiftBagDropdowns[shiftBagDropdowns.length - 1][0];
      const updateValue = shiftBagDropdown.updateValue;
      act(() => updateValue({}, { value: "111" }));
      expect(mockSetForm).toHaveBeenLastCalledWith({
        type: userFormActions.SET_WFM_SHIFT_BAG,
        payload: "111"
      });
    });
    test("clear dropdown updates field calls setForm with null", async () => {
      renderComponent();
      await waitFor(() => expect(Dropdown.mock.calls.length).toBe(18));
      const shiftBagDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Shift Bag");
      const shiftBagDropdown = shiftBagDropdowns[shiftBagDropdowns.length - 1][0];
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
            test("error should be true", async () => {
              renderComponent(["EmploymentStartDate"]);
              await waitFor(() => expect(Dropdown.mock.calls.length).toBe(18));
              const personDatePickers = DatePicker.mock.calls.filter((m) => m[0].label === "Person Start Date");
              const personDatePicker = personDatePickers[personDatePickers.length - 1][0];
              render(personDatePicker.renderInput());
              const textFieldLength = TextField.mock.calls.length;
              const textField = TextField.mock.calls[textFieldLength - 1][0];
              expect(textField.error).toBe(true);
            });
          });
          describe("form.calabrio_wfm.EmploymentStartDate !== null", () => {
            test("error should be false", async () => {
              const formState = {
                ...initialFormState,
                calabrio_wfm: {
                  ...initialFormState.calabrio_wfm,
                  EmploymentStartDate: "05/02/1991"
                }
              };
              useFormState.mockReturnValue(formState);
              renderComponent(["EmploymentStartDate"]);
              await waitFor(() => expect(Dropdown.mock.calls.length).toBe(18));
              const personDatePickers = DatePicker.mock.calls.filter((m) => m[0].label === "Person Start Date");
              const personDatePicker = personDatePickers[personDatePickers.length - 1][0];
              render(personDatePicker.renderInput());
              const textFieldLength = TextField.mock.calls.length;
              const textField = TextField.mock.calls[textFieldLength - 1][0];
              expect(textField.error).toBe(false);
            });
          });
        });
      });
      describe("disable", () => {
        test("is not disabled when formmode is insert", async () => {
          renderComponent();
          await waitFor(() => expect(Dropdown.mock.calls.length).toBe(18));
          const personDatePickers = DatePicker.mock.calls.filter((m) => m[0].label === "Person Start Date");
          const personDatePicker = personDatePickers[personDatePickers.length - 1][0];
          expect(personDatePicker.disabled).toBe(false);
        });
        test("is disabled when formmode is not insert && Id is populated", async () => {
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
          await waitFor(() => expect(Dropdown.mock.calls.length).toBe(15));
          const personDatePickers = DatePicker.mock.calls.filter((m) => m[0].label === "Person Start Date");
          const personDatePicker = personDatePickers[personDatePickers.length - 1][0];
          expect(personDatePicker.disabled).toBe(true);
        });
      });
      test("onChange updates team fields", async () => {
        renderComponent();
        await waitFor(() => expect(Dropdown.mock.calls.length).toBe(18));
        let personDatePickers = DatePicker.mock.calls.filter((m) => m[0].label === "Person Start Date");
        let personDatePicker = personDatePickers[personDatePickers.length - 1][0];
        const onChange = personDatePicker.onChange;
        act(() => onChange("12/23/2023"));
        personDatePickers = DatePicker.mock.calls.filter((m) => m[0].label === "Person Start Date");
        personDatePicker = personDatePickers[personDatePickers.length - 1][0];
        expect(mockSetForm).toHaveBeenLastCalledWith({
          type: userFormActions.SET_WFM_EMP_START_DATE,
          payload: "2023-12-23"
        });
      });
      test("onChange null updates team fields to null", async () => {
        renderComponent();
        await waitFor(() => expect(Dropdown.mock.calls.length).toBe(18));
        let personDatePickers = DatePicker.mock.calls.filter((m) => m[0].label === "Person Start Date");
        let personDatePicker = personDatePickers[personDatePickers.length - 1][0];
        const onChange = personDatePicker.onChange;
        act(() => onChange(null));
        personDatePickers = DatePicker.mock.calls.filter((m) => m[0].label === "Person Start Date");
        personDatePicker = personDatePickers[personDatePickers.length - 1][0];
        expect(mockSetForm).toHaveBeenLastCalledWith({
          type: userFormActions.SET_WFM_EMP_START_DATE,
          payload: null
        });
      });
    });
    describe("Part Time Percentage", () => {
      describe("error", () => {
        describe("PartTimePercentageId is on missingFields array", () => {
          describe("form.calabrio_wfm.PartTimePercentageId === null", () => {
            test("error should be true", async () => {
              renderComponent(["PartTimePercentageId"]);
              await waitFor(() => expect(Dropdown.mock.calls.length).toBe(18));
              const partTimeDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Part Time Percentage");
              const partTimeDropdown = partTimeDropdowns[partTimeDropdowns.length - 1][0];
              expect(partTimeDropdown.error).toBe(true);
            });
          });
          describe("form.calabrio_wfm.PartTimePercentageId !== null", () => {
            test("error should be false", async () => {
              const formState = {
                ...initialFormState,
                calabrio_wfm: {
                  ...initialFormState.calabrio_wfm,
                  PartTimePercentageId: "PP510354"
                }
              };
              useFormState.mockReturnValue(formState);
              renderComponent(["PartTimePercentageId"]);
              await waitFor(() => expect(Dropdown.mock.calls.length).toBe(18));
              const partTimeDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Part Time Percentage");
              const partTimeDropdown = partTimeDropdowns[partTimeDropdowns.length - 1][0];
              expect(partTimeDropdown.error).toBe(false);
            });
          });
        });
      });
      describe("disable", () => {
        test("is not disabled when formmode is insert", async () => {
          renderComponent();
          await waitFor(() => expect(Dropdown.mock.calls.length).toBe(18));
          const partTimeDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Part Time Percentage");
          const partTimeDropdown = partTimeDropdowns[partTimeDropdowns.length - 1][0];
          expect(partTimeDropdown.disabled).toBe(false);
        });
        test("is disabled when formmode is not insert && Id is populated", async () => {
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
          await waitFor(() => expect(Dropdown.mock.calls.length).toBe(15));
          const partTimeDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Part Time Percentage");
          const partTimeDropdown = partTimeDropdowns[partTimeDropdowns.length - 1][0];
          expect(partTimeDropdown.disabled).toBe(true);
        });
      });
      test("options", async () => {
        const formState = {
          ...initialFormState,
          calabrio_wfm: {
            ...initialFormState.calabrio_wfm,
            BusinessUnitId
          }
        };
        useFormState.mockReturnValue(formState);
        renderComponent();
        await waitFor(() => expect(Dropdown.mock.calls.length).toBe(18));
        const partTimeDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Part Time Percentage");
        const partTimeDropdown = partTimeDropdowns[partTimeDropdowns.length - 1][0];
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
      test("updateValue calls setForm", async () => {
        renderComponent();
        await waitFor(() => expect(Dropdown.mock.calls.length).toBe(18));
        const partTimeDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Part Time Percentage");
        const partTimeDropdown = partTimeDropdowns[partTimeDropdowns.length - 1][0];
        const updateValue = partTimeDropdown.updateValue;
        act(() => updateValue({}, { value: "111" }));
        expect(mockSetForm).toHaveBeenLastCalledWith({
          type: userFormActions.SET_WFM_PART_TIME_PERCENTAGE,
          payload: "111"
        });
      });
      test("clear dropdown updates field calls setForm with null", async () => {
        renderComponent();
        await waitFor(() => expect(Dropdown.mock.calls.length).toBe(18));
        const partTimeDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Part Time Percentage");
        const partTimeDropdown = partTimeDropdowns[partTimeDropdowns.length - 1][0];
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
            test("error should be true", async () => {
              renderComponent(["ContractScheduleId"]);
              await waitFor(() => expect(Dropdown.mock.calls.length).toBe(18));
              const contractScheduleDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Contract Schedule");
              const contractScheduleDropdown = contractScheduleDropdowns[contractScheduleDropdowns.length - 1][0];
              expect(contractScheduleDropdown.error).toBe(true);
            });
          });
          describe("form.calabrio_wfm.ContractScheduleId !== null", () => {
            test("error should be false", async () => {
              const formState = {
                ...initialFormState,
                calabrio_wfm: {
                  ...initialFormState.calabrio_wfm,
                  ContractScheduleId: "CS510354"
                }
              };
              useFormState.mockReturnValue(formState);
              renderComponent(["ContractScheduleId"]);
              await waitFor(() => expect(Dropdown.mock.calls.length).toBe(18));
              const contractScheduleDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Contract Schedule");
              const contractScheduleDropdown = contractScheduleDropdowns[contractScheduleDropdowns.length - 1][0];
              expect(contractScheduleDropdown.error).toBe(false);
            });
          });
        });
      });
      describe("disable", () => {
        test("is not disabled when formmode is insert", async () => {
          renderComponent();
          await waitFor(() => expect(Dropdown.mock.calls.length).toBe(18));
          const contractScheduleDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Contract Schedule");
          const contractScheduleDropdown = contractScheduleDropdowns[contractScheduleDropdowns.length - 1][0];
          expect(contractScheduleDropdown.disabled).toBe(false);
        });
        test("is disabled when formmode is not insert && Id is populated", async () => {
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
          await waitFor(() => expect(Dropdown.mock.calls.length).toBe(15));
          const contractScheduleDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Contract Schedule");
          const contractScheduleDropdown = contractScheduleDropdowns[contractScheduleDropdowns.length - 1][0];
          expect(contractScheduleDropdown.disabled).toBe(true);
        });
      });
      test("options", async () => {
        const formState = {
          ...initialFormState,
          calabrio_wfm: {
            ...initialFormState.calabrio_wfm,
            BusinessUnitId
          }
        };
        useFormState.mockReturnValue(formState);
        renderComponent();
        await waitFor(() => expect(Dropdown.mock.calls.length).toBe(18));
        const contractScheduleDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Contract Schedule");
        const contractScheduleDropdown = contractScheduleDropdowns[contractScheduleDropdowns.length - 1][0];
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
      test("updateValue calls setForm", async () => {
        renderComponent();
        await waitFor(() => expect(Dropdown.mock.calls.length).toBe(18));
        const contractScheduleDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Contract Schedule");
        const contractScheduleDropdown = contractScheduleDropdowns[contractScheduleDropdowns.length - 1][0];
        const updateValue = contractScheduleDropdown.updateValue;
        act(() => updateValue({}, { value: "111" }));
        expect(mockSetForm).toHaveBeenLastCalledWith({
          type: userFormActions.SET_WFM_CONTRACT_SCHEDULE,
          payload: "111"
        });
      });
      test("clear dropdown updates field calls setForm with null", async () => {
        renderComponent();
        await waitFor(() => expect(Dropdown.mock.calls.length).toBe(18));
        const contractScheduleDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Contract Schedule");
        const contractScheduleDropdown = contractScheduleDropdowns[contractScheduleDropdowns.length - 1][0];
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
            test("error should be true", async () => {
              renderComponent(["ContractId"]);
              await waitFor(() => expect(Dropdown.mock.calls.length).toBe(18));
              const contractDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Contract");
              const contractDropdown = contractDropdowns[contractDropdowns.length - 1][0];
              expect(contractDropdown.error).toBe(true);
            });
          });
          describe("form.calabrio_wfm.ContractId !== null", () => {
            test("error should be false", async () => {
              const formState = {
                ...initialFormState,
                calabrio_wfm: {
                  ...initialFormState.calabrio_wfm,
                  ContractId: "CS510354"
                }
              };
              useFormState.mockReturnValue(formState);
              renderComponent(["ContractId"]);
              await waitFor(() => expect(Dropdown.mock.calls.length).toBe(18));
              const contractDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Contract");
              const contractDropdown = contractDropdowns[contractDropdowns.length - 1][0];
              expect(contractDropdown.error).toBe(false);
            });
          });
        });
      });
      describe("disable", () => {
        test("is not disabled when formmode is insert", async () => {
          renderComponent();
          await waitFor(() => expect(Dropdown.mock.calls.length).toBe(18));
          const contractDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Contract");
          const contractDropdown = contractDropdowns[contractDropdowns.length - 1][0];
          expect(contractDropdown.disabled).toBe(false);
        });
        test("is disabled when formmode is not insert && Id is populated", async () => {
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
          await waitFor(() => expect(Dropdown.mock.calls.length).toBe(15));
          const contractDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Contract");
          const contractDropdown = contractDropdowns[contractDropdowns.length - 1][0];
          expect(contractDropdown.disabled).toBe(true);
        });
      });
      test("options", async () => {
        const formState = {
          ...initialFormState,
          calabrio_wfm: {
            ...initialFormState.calabrio_wfm,
            BusinessUnitId
          }
        };
        useFormState.mockReturnValue(formState);
        renderComponent();
        await waitFor(() => expect(Dropdown.mock.calls.length).toBe(18));
        const contractDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Contract");
        const contractDropdown = contractDropdowns[contractDropdowns.length - 1][0];
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
      test("updateValue calls setForm", async () => {
        renderComponent();
        await waitFor(() => expect(Dropdown.mock.calls.length).toBe(18));
        const contractDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Contract");
        const contractDropdown = contractDropdowns[contractDropdowns.length - 1][0];
        const updateValue = contractDropdown.updateValue;
        act(() => updateValue({}, { value: "111" }));
        expect(mockSetForm).toHaveBeenLastCalledWith({
          type: userFormActions.SET_WFM_CONTRACT,
          payload: "111"
        });
      });
      test("clear dropdown updates field calls setForm with null", async () => {
        renderComponent();
        await waitFor(() => expect(Dropdown.mock.calls.length).toBe(18));
        const contractDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Contract");
        const contractDropdown = contractDropdowns[contractDropdowns.length - 1][0];
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
        test("is not disabled when formmode is insert", async () => {
          renderComponent();
          await waitFor(() => expect(Dropdown.mock.calls.length).toBe(18));
          const rotationDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Rotation");
          const rotationDropdown = rotationDropdowns[rotationDropdowns.length - 1][0];
          expect(rotationDropdown.disabled).toBe(false);
        });
        test("is not rendered when formmode is not insert && Id is populated", async () => {
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
          await waitFor(() => expect(Dropdown.mock.calls.length).toBe(15));
          const rotationDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Rotation");
          expect(rotationDropdowns.length).toBe(0);
        });
      });
      test("options", async () => {
        renderComponent();
        await waitFor(() => expect(Dropdown.mock.calls.length).toBe(18));
        const rotationDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Rotation");
        const rotationDropdown = rotationDropdowns[rotationDropdowns.length - 1][0];
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
      test("updateValue updates team fields", async () => {
        renderComponent();
        await waitFor(() => expect(Dropdown.mock.calls.length).toBe(18));
        let rotationDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Rotation");
        let rotationDropdown = rotationDropdowns[rotationDropdowns.length - 1][0];
        const updateValue = rotationDropdown.updateValue;
        act(() => updateValue({}, { value: "111" }));
        expect(mockSetForm).toHaveBeenCalledWith({
          type: userFormActions.SET_WFM_ROTATION,
          payload: {
            id: "111",
            startDate: undefined,
            startWeek: undefined
          }
        })
      });
      test("clear dropdown updates field calls setForm with null", async () => {
        renderComponent();
        await waitFor(() => expect(Dropdown.mock.calls.length).toBe(18));
        let rotationDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Rotation");
        let rotationDropdown = rotationDropdowns[rotationDropdowns.length - 1][0];
        const updateValue = rotationDropdown.updateValue;
        act(() => updateValue({}, null));
        expect(mockSetForm).toHaveBeenCalledWith({
          type: userFormActions.SET_WFM_ROTATION,
          payload: {
            id: null,
            startDate: undefined,
            startWeek: undefined
          }
        })
      });
    });
    describe("Rotation Start Date", () => {
      describe("disable", () => {
        test("is not disabled when formmode is insert", async () => {
          renderComponent();
          await waitFor(() => expect(Dropdown.mock.calls.length).toBe(18));
          const rotationDatePickers = DatePicker.mock.calls.filter((m) => m[0].label === "Rotation Start Date");
          const rotationDatePicker = rotationDatePickers[rotationDatePickers.length - 1][0];
          expect(rotationDatePicker.disabled).toBe(false);
        });
        test("is not rendered when formmode is not insert && Id is populated", async () => {
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
          await waitFor(() => expect(Dropdown.mock.calls.length).toBe(15));
          const rotationDatePickers = DatePicker.mock.calls.filter((m) => m[0].label === "Rotation Start Date");
          expect(rotationDatePickers.length).toBe(0);
        });
      });
      test("onChange updates rotation start date field", async () => {
        renderComponent();
        await waitFor(() => expect(Dropdown.mock.calls.length).toBe(18));
        let rotationDatePickers = DatePicker.mock.calls.filter((m) => m[0].label === "Rotation Start Date");
        let rotationDatePicker = rotationDatePickers[rotationDatePickers.length - 1][0];
        const onChange = rotationDatePicker.onChange;
        act(() => onChange("12/23/2023"));
        expect(mockSetForm).toHaveBeenCalledWith({
          type: userFormActions.SET_WFM_ROTATION,
          payload: {
            id: null,
            startDate: "2023-12-23",
            startWeek: undefined
          }
        })
      });
      test("onChange to null updates rotation start date field to null", async () => {
        renderComponent();
        await waitFor(() => expect(Dropdown.mock.calls.length).toBe(18));
        let rotationDatePickers = DatePicker.mock.calls.filter((m) => m[0].label === "Rotation Start Date");
        let rotationDatePicker = rotationDatePickers[rotationDatePickers.length - 1][0];
        const onChange = rotationDatePicker.onChange;
        act(() => onChange(null));
        expect(mockSetForm).toHaveBeenCalledWith({
          type: userFormActions.SET_WFM_ROTATION,
          payload: {
            id: null,
            startDate: null,
            startWeek: undefined
          }
        })
      });
    });
    describe("Rotation Start Week", () => {
      describe("disable", () => {
        test("is not disabled when formmode is insert", async () => {
          renderComponent();
          await waitFor(() => expect(Dropdown.mock.calls.length).toBe(18));
          const rotationDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Rotation Start Week");
          const rotationDropdown = rotationDropdowns[rotationDropdowns.length - 1][0];
          expect(rotationDropdown.disabled).toBe(false);
        });
        test("is not rendered when formmode is not insert && Id is populated", async () => {
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
          await waitFor(() => expect(Dropdown.mock.calls.length).toBe(15));
          const rotationDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Rotation Start Week");
          expect(rotationDropdowns.length).toBe(0);
        });
      });
      test("options", async () => {
        renderComponent();
        await waitFor(() => expect(Dropdown.mock.calls.length).toBe(18));
        const rotationDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Rotation Start Week");
        const rotationDropdown = rotationDropdowns[rotationDropdowns.length - 1][0];
        const expectedRawOptions = [1, 2, 3, 4, 5]
        const expectedDropdownOptions = expectedRawOptions.map(o => {
          return {
            label: o.toString(),
            value: o
          }
        });
        expect(rotationDropdown.options).toStrictEqual(expectedDropdownOptions);
      });
      test("updateValue updates team fields", async () => {
        renderComponent();
        await waitFor(() => expect(Dropdown.mock.calls.length).toBe(18));
        let rotationDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Rotation Start Week");
        let rotationDropdown = rotationDropdowns[rotationDropdowns.length - 1][0];
        const updateValue = rotationDropdown.updateValue;
        act(() => updateValue({}, { value: 1 }));
        expect(mockSetForm).toHaveBeenCalledWith({
          type: userFormActions.SET_WFM_ROTATION,
          payload: {
            id: null,
            startDate: undefined,
            startWeek: 1
          }
        })
      });
      test("clear dropdown updates field calls setForm with null", async () => {
        renderComponent();
        await waitFor(() => expect(Dropdown.mock.calls.length).toBe(18));
        let rotationDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Rotation Start Week");
        let rotationDropdown = rotationDropdowns[rotationDropdowns.length - 1][0];
        const updateValue = rotationDropdown.updateValue;
        act(() => updateValue({}, null));
        expect(mockSetForm).toHaveBeenCalledWith({
          type: userFormActions.SET_WFM_ROTATION,
          payload: {
            id: null,
            startDate: undefined,
            startWeek: undefined
          }
        })
      });
    });
    describe("Error fields", () => {
      describe("RotationId is on missingFields array", () => {
        describe("form.calabrio_wfm.RotationId === null", () => {
          test("error should be true", async () => {
            renderComponent(["RotationId"]);
            await waitFor(() => expect(Dropdown.mock.calls.length).toBe(18));
            const rotationDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Rotation");
            const rotationDropdown = rotationDropdowns[rotationDropdowns.length - 1][0];
            expect(rotationDropdown.error).toBe(true);
          });
        });
        describe("form.calabrio_wfm.RotationId !== null", () => {
          test("error should be false", async () => {
            const formState = {
              ...initialFormState,
              calabrio_wfm: {
                ...initialFormState.calabrio_wfm,
                RotationId: "111"
              }
            };
            useFormState.mockReturnValue(formState);
            renderComponent(["RotationId"]);
            await waitFor(() => expect(Dropdown.mock.calls.length).toBe(18));
            const rotationDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Rotation");
            const rotationDropdown = rotationDropdowns[rotationDropdowns.length - 1][0];
            expect(rotationDropdown.error).toBe(false);
          });
        });
      });
      describe("RotationStartDate is on missingFields array", () => {
        describe("form.calabrio_wfm.RotationStartDate === null", () => {
          test("error should be true", async () => {
            renderComponent(["RotationStartDate"]);
            await waitFor(() => expect(Dropdown.mock.calls.length).toBe(18));
            const teamDatePickers = DatePicker.mock.calls.filter((m) => m[0].label === "Rotation Start Date");
            const teamDatePicker = teamDatePickers[teamDatePickers.length - 1][0];
            render(teamDatePicker.renderInput());
            const textFieldLength = TextField.mock.calls.length;
            const textField = TextField.mock.calls[textFieldLength - 1][0];
            expect(textField.error).toBe(true);
          });
        });
        describe("form.calabrio_wfm.RotationStartDate !== null", () => {
          test("error should be false", async () => {
            const formState = {
              ...initialFormState,
              calabrio_wfm: {
                ...initialFormState.calabrio_wfm,
                RotationStartDate: "05/02/1991"
              }
            };
            useFormState.mockReturnValue(formState);
            renderComponent(["RotationStartDate"]);
            await waitFor(() => expect(Dropdown.mock.calls.length).toBe(18));
            const rotationDatePickers = DatePicker.mock.calls.filter((m) => m[0].label === "Rotation Start Date");
            const rotationDatePicker = rotationDatePickers[rotationDatePickers.length - 1][0];
            render(rotationDatePicker.renderInput());
            const textFieldLength = TextField.mock.calls.length;
            const textField = TextField.mock.calls[textFieldLength - 1][0];
            expect(textField.error).toBe(false);
          });
        });
      });
      describe("RotationStartWeek is on missingFields array", () => {
        describe("form.calabrio_wfm.RotationStartWeek === null", () => {
          test("error should be true", async () => {
            renderComponent(["RotationStartWeek"]);
            await waitFor(() => expect(Dropdown.mock.calls.length).toBe(18));
            const rotationWeekDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Rotation Start Week");
            const rotationWeekDropdown = rotationWeekDropdowns[rotationWeekDropdowns.length - 1][0];
            expect(rotationWeekDropdown.error).toBe(true);
          });
        });
        describe("form.calabrio_wfm.RotationStartWeek !== null", () => {
          test("error should be false", async () => {
            const formState = {
              ...initialFormState,
              calabrio_wfm: {
                ...initialFormState.calabrio_wfm,
                RotationStartWeek: 0
              }
            };
            useFormState.mockReturnValue(formState);
            renderComponent(["RotationStartWeek"]);
            await waitFor(() => expect(Dropdown.mock.calls.length).toBe(18));
            const rotationWeekDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Rotation Start Week");
            const rotationWeekDropdown = rotationWeekDropdowns[rotationWeekDropdowns.length - 1][0];
            expect(rotationWeekDropdown.error).toBe(false);
          });
        });
      });
    });
  });
  describe("Availability Fields", () => {
    describe("Availability", () => {
      describe("disable", () => {
        test("is not disabled when formmode is insert", async () => {
          renderComponent();
          await waitFor(() => expect(Dropdown.mock.calls.length).toBe(18));
          const availabilityDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Availability");
          const availabilityDropdown = availabilityDropdowns[availabilityDropdowns.length - 1][0];
          expect(availabilityDropdown.disabled).toBe(false);
        });
        test("is not rendered when formmode is not insert && Id is populated", async () => {
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
          await waitFor(() => expect(Dropdown.mock.calls.length).toBe(15));
          const availabilityDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Availability");
          expect(availabilityDropdowns.length).toBe(0);
        });
      });
      test("options", async () => {
        const formState = {
          ...initialFormState,
          calabrio_wfm: {
            ...initialFormState.calabrio_wfm,
            BusinessUnitId
          }
        };
        useFormState.mockReturnValue(formState);
        renderComponent();
        await waitFor(() => expect(Dropdown.mock.calls.length).toBe(18));
        const availabilityDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Availability");
        const availabilityDropdown = availabilityDropdowns[availabilityDropdowns.length - 1][0];
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
      test("updateValue updates availability fields", async () => {
        renderComponent();
        await waitFor(() => expect(Dropdown.mock.calls.length).toBe(18));
        let availabilityDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Availability");
        let availabilityDropdown = availabilityDropdowns[availabilityDropdowns.length - 1][0];
        const updateValue = availabilityDropdown.updateValue;
        act(() => updateValue({}, { value: "123123" }));
        expect(mockSetForm).toHaveBeenCalledWith({
          type: userFormActions.SET_WFM_AVAILABILITY,
          payload: {
            id: "123123",
            startDate: undefined
          }
        });
      });
      test("clear dropdown updates field calls setForm with null", async () => {
        renderComponent();
        await waitFor(() => expect(Dropdown.mock.calls.length).toBe(18));
        let availabilityDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Availability");
        let availabilityDropdown = availabilityDropdowns[availabilityDropdowns.length - 1][0];
        const updateValue = availabilityDropdown.updateValue;
        act(() => updateValue({}, null));
        expect(mockSetForm).toHaveBeenCalledWith({
          type: userFormActions.SET_WFM_AVAILABILITY,
          payload: {
            id: null,
            startDate: undefined
          }
        });
      });
    });
    describe("Availability Start Date", () => {
      describe("disable", () => {
        test("is not disabled when formmode is insert", async () => {
          renderComponent();
          await waitFor(() => expect(Dropdown.mock.calls.length).toBe(18));
          const availabilityDatePickers = DatePicker.mock.calls.filter((m) => m[0].label === "Availability Start Date");
          const availabilityDatePicker = availabilityDatePickers[availabilityDatePickers.length - 1][0];
          expect(availabilityDatePicker.disabled).toBe(false);
        });
        test("is not rendered when formmode is not insert && Id is populated", async () => {
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
          await waitFor(() => expect(Dropdown.mock.calls.length).toBe(15));
          const availabilityDatePickers = DatePicker.mock.calls.filter((m) => m[0].label === "Availability Start Date");
          expect(availabilityDatePickers.length).toBe(0);
        });
      });
      test("onChange updates availability start date field", async () => {
        renderComponent();
        await waitFor(() => expect(Dropdown.mock.calls.length).toBe(18));
        let availabilityDatePickers = DatePicker.mock.calls.filter((m) => m[0].label === "Availability Start Date");
        let availabilityDatePicker = availabilityDatePickers[availabilityDatePickers.length - 1][0];
        const onChange = availabilityDatePicker.onChange;
        act(() => onChange("12/23/2023"));
        expect(mockSetForm).toHaveBeenCalledWith({
          type: userFormActions.SET_WFM_AVAILABILITY,
          payload: {
            id: null,
            startDate: "2023-12-23"
          }
        });
      });
      test("onChange to null updates availability start date field to null", async () => {
        renderComponent();
        await waitFor(() => expect(Dropdown.mock.calls.length).toBe(18));
        let availabilityDatePickers = DatePicker.mock.calls.filter((m) => m[0].label === "Availability Start Date");
        let availabilityDatePicker = availabilityDatePickers[availabilityDatePickers.length - 1][0];
        const onChange = availabilityDatePicker.onChange;
        act(() => onChange(null));
        expect(mockSetForm).toHaveBeenCalledWith({
          type: userFormActions.SET_WFM_AVAILABILITY,
          payload: {
            id: null,
            startDate: null
          }
        });
      });
    });
    describe("Error fields", () => {
      describe("AvailabilityId is on missingFields array", () => {
        describe("form.calabrio_wfm.AvailabilityId === null", () => {
          test("error should be true", async () => {
            renderComponent(["AvailabilityId"]);
            await waitFor(() => expect(Dropdown.mock.calls.length).toBe(18));
            const availabilityDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Availability");
            const availabilityDropdown = availabilityDropdowns[availabilityDropdowns.length - 1][0];
            expect(availabilityDropdown.error).toBe(true);
          });
        });
        describe("form.calabrio_wfm.AvailabilityId !== null", () => {
          test("error should be false", async () => {
            const formState = {
              ...initialFormState,
              calabrio_wfm: {
                ...initialFormState.calabrio_wfm,
                AvailabilityId: "111"
              }
            };
            useFormState.mockReturnValue(formState);
            renderComponent(["AvailabilityId"]);
            await waitFor(() => expect(Dropdown.mock.calls.length).toBe(18));
            const availabilityDropdowns = Dropdown.mock.calls.filter((m) => m[0].label === "Availability");
            const availabilityDropdown = availabilityDropdowns[availabilityDropdowns.length - 1][0];
            expect(availabilityDropdown.error).toBe(false);
          });
        });
      });
      describe("AvailabilityStartDate is on missingFields array", () => {
        describe("form.calabrio_wfm.AvailabilityStartDate === null", () => {
          test("error should be true", async () => {
            renderComponent(["AvailabilityStartDate"]);
            await waitFor(() => expect(Dropdown.mock.calls.length).toBe(18));
            const availabilityDatePickers = DatePicker.mock.calls.filter((m) => m[0].label === "Availability Start Date");
            const availabilityDatePicker = availabilityDatePickers[availabilityDatePickers.length - 1][0];
            render(availabilityDatePicker.renderInput());
            const textFieldLength = TextField.mock.calls.length;
            const textField = TextField.mock.calls[textFieldLength - 1][0];
            expect(textField.error).toBe(true);
          });
        });
        describe("form.calabrio_wfm.AvailabilityStartDate !== null", () => {
          test("error should be false", async () => {
            const formState = {
              ...initialFormState,
              calabrio_wfm: {
                ...initialFormState.calabrio_wfm,
                AvailabilityStartDate: "05/02/1991"
              }
            };
            useFormState.mockReturnValue(formState);
            renderComponent(["AvailabilityStartDate"]);
            await waitFor(() => expect(Dropdown.mock.calls.length).toBe(18));
            const availabilityDatePickers = DatePicker.mock.calls.filter((m) => m[0].label === "Availability Start Date");
            const availabilityDatePicker = availabilityDatePickers[availabilityDatePickers.length - 1][0];
            render(availabilityDatePicker.renderInput());
            const textFieldLength = TextField.mock.calls.length;
            const textField = TextField.mock.calls[textFieldLength - 1][0];
            expect(textField.error).toBe(false);
          });
        });
      });
    });
  });
});