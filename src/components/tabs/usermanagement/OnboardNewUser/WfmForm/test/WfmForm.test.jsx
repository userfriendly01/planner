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
  Switch,
  TextareaAutosize,
  TextField,
  IconButton,
  Tooltip
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
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
  Wrapper, Row
} from "../WfmForm.Styles";
import { calabrioTimeZones } from "utils";

jest.mock("../WfmForm.Styles", () => ({
  Wrapper: jest.fn(),
  Row: jest.fn()
}));

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
  InputAdornment: jest.fn(),
  Switch: jest.fn(),
  TextareaAutosize: jest.fn(),
  TextField: jest.fn(),
  IconButton: jest.fn(),
  Tooltip: jest.fn(),
  Paper: jest.fn()
}));

jest.mock("@mui/x-date-pickers/AdapterDayjs", () => ({
  AdapterDayjs: jest.fn()
}));

jest.mock("@mui/x-date-pickers/LocalizationProvider", () => ({
  LocalizationProvider: jest.fn()
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

// TODO: FINISH THESE TESTS...
describe("<WfmForm />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useFormDispatch.mockReturnValue(mockSetForm);
    useFormState.mockReturnValue(initialFormState);
    useAdminState.mockReturnValue(initialTestState);
    setupMockedComponents({
      Dropdown
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
        render(Wrapper.mock.calls[0][0].children);
        render(LocalizationProvider.mock.calls[0][0].children);
        Row.mock.calls.forEach((call, index) => render(Row.mock.calls[index][0].children));
        expect(WFMLoadRetryModal.mock.calls.length).toBe(1);
        expect(Dropdown.mock.calls.length).toBe(1);
        expect(NNumberInput.mock.calls.length).toBe(1);
      });
    });
    describe("wfmoptions and wfmOrg are loaded", () => {
      test("should render as expected", () => {
        renderComponent();
        render(Wrapper.mock.calls[0][0].children);
        render(LocalizationProvider.mock.calls[0][0].children);
        Row.mock.calls.forEach((call, index) => render(Row.mock.calls[index][0].children));

        expect(Row.mock.calls.length).toBe(7);
        expect(DatePicker.mock.calls.length).toBe(2);
        expect(Dropdown.mock.calls.length).toBe(10);
        expect(NNumberInput.mock.calls.length).toBe(1);
        expect(Dropdown.mock.calls[0][0].label).toBe("Business Unit *");
        expect(Dropdown.mock.calls[1][0].label).toBe("First Day of the Week *");
        expect(Dropdown.mock.calls[2][0].label).toBe("Time Zone");
        expect(Dropdown.mock.calls[3][0].label).toBe("Availability");
        expect(Dropdown.mock.calls[4][0].label).toBe("Roles");
        expect(Dropdown.mock.calls[5][0].label).toBe("Skills");
        expect(Dropdown.mock.calls[6][0].label).toBe("Workflow Control Set");
        expect(Dropdown.mock.calls[7][0].label).toBe("Rotation");
        expect(Dropdown.mock.calls[8][0].label).toBe("Rotation Start Week");
        expect(Dropdown.mock.calls[9][0].label).toBe("Optional Columns");
      });
    });
  });
  describe("NNumberInput", () => {
    describe("triton.userFound is false", () => {
      describe("disable", () => {
        test("formMode is update, nnumberinput is disabled", () => {
          const formState = {
            ...initialFormState,
            formMode: "update"
          };
          useFormState.mockReturnValue(formState);
          renderComponent();
          render(Wrapper.mock.calls[0][0].children);
          render(LocalizationProvider.mock.calls[0][0].children);
          Row.mock.calls.forEach((call, index) => render(Row.mock.calls[index][0].children));
          expect(NNumberInput.mock.calls.length).toBe(1);
          expect(NNumberInput.mock.calls[0][0].disabled).toBe(true);
        });
        test("formMode is Delete, nnumberinput is disabled", () => {
          const formState = {
            ...initialFormState,
            formMode: "delete"
          };
          useFormState.mockReturnValue(formState);
          renderComponent();
          render(Wrapper.mock.calls[0][0].children);
          render(LocalizationProvider.mock.calls[0][0].children);
          Row.mock.calls.forEach((call, index) => render(Row.mock.calls[index][0].children));
          expect(NNumberInput.mock.calls.length).toBe(1);
          expect(NNumberInput.mock.calls[0][0].disabled).toBe(true);
        });
        test("form.nNumber.nNumberFetchedUser has value, nnumberinput is disabled", () => {
          const formState = {
            ...initialFormState,
            nNumber: {
              nNumberFetchedUser: {
                stuff: "yea"
              }
            }
          };
          useFormState.mockReturnValue(formState);
          renderComponent();
          render(Wrapper.mock.calls[0][0].children);
          render(LocalizationProvider.mock.calls[0][0].children);
          Row.mock.calls.forEach((call, index) => render(Row.mock.calls[index][0].children));
          expect(NNumberInput.mock.calls.length).toBe(1);
          expect(NNumberInput.mock.calls[0][0].disabled).toBe(true);
        });
        test("formmode is not update or delete, no form.nNumber.nNumberFetchedUser , nnumberinput is NOT disabled", () => {
          const formState = {
            ...initialFormState,
            nNumber: {}
          };
          useFormState.mockReturnValue(formState);
          renderComponent();
          render(Wrapper.mock.calls[0][0].children);
          render(LocalizationProvider.mock.calls[0][0].children);
          Row.mock.calls.forEach((call, index) => render(Row.mock.calls[index][0].children));
          expect(NNumberInput.mock.calls.length).toBe(1);
          expect(NNumberInput.mock.calls[0][0].disabled).toBe(false);
        });
      });
      test("onClear calls setform with CLEAR_N_NUMBER", () => {
        renderComponent();
        render(Wrapper.mock.calls[0][0].children);
        render(LocalizationProvider.mock.calls[0][0].children);
        Row.mock.calls.forEach((call, index) => render(Row.mock.calls[index][0].children));
        expect(NNumberInput.mock.calls.length).toBe(1);
        expect(NNumberInput.mock.calls[0][0].disabled).toBe(false);
        const onClear = NNumberInput.mock.calls[0][0].onClear;
        act(() => onClear());
        expect(mockSetForm).toHaveBeenCalledWith({
          type: userFormActions.CLEAR_N_NUMBER
        });
      });
      test("onComplete calls setform with COMPLETE_N_NUMBER", () => {
        renderComponent();
        render(Wrapper.mock.calls[0][0].children);
        render(LocalizationProvider.mock.calls[0][0].children);
        Row.mock.calls.forEach((call, index) => render(Row.mock.calls[index][0].children));
        expect(NNumberInput.mock.calls.length).toBe(1);
        expect(NNumberInput.mock.calls[0][0].disabled).toBe(false);
        const onComplete = NNumberInput.mock.calls[0][0].onComplete;
        act(() => onComplete({ user: "hey" }, "n1234567"));
        expect(mockSetForm).toHaveBeenLastCalledWith({
          type: userFormActions.COMPLETE_N_NUMBER,
          payload: {
            nNumber: "n1234567",
            fetchedUser: { user: "hey" }
          }
        });
      });
      test("onUpdate calls setform with UPDATE_N_NUMBER", () => {
        renderComponent();
        render(Wrapper.mock.calls[0][0].children);
        render(LocalizationProvider.mock.calls[0][0].children);
        Row.mock.calls.forEach((call, index) => render(Row.mock.calls[index][0].children));
        expect(NNumberInput.mock.calls.length).toBe(1);
        expect(NNumberInput.mock.calls[0][0].disabled).toBe(false);
        const onUpdate = NNumberInput.mock.calls[0][0].onUpdate;
        act(() => onUpdate("n1234567"));
        expect(mockSetForm).toHaveBeenLastCalledWith({
          type: userFormActions.UPDATE_N_NUMBER,
          payload: "n1234567"
        });
      });
    });
    describe("triton.userFound is true", () => {
      const formStateTritonUserFound = {
        ...initialFormState,
        triton: {
          ...initialFormState.triton,
          userFound: true
        }
      };
      beforeEach(() => {
        useFormState.mockReturnValue(formStateTritonUserFound);
      });
      test("NNumberInput should not render", () => {
        renderComponent();
        render(Wrapper.mock.calls[0][0].children);
        render(LocalizationProvider.mock.calls[0][0].children);
        Row.mock.calls.forEach((call, index) => render(Row.mock.calls[index][0].children));
        expect(NNumberInput.mock.calls.length).toBe(0);
      });
    });
  });
  describe("Dropdowns", () => {
    describe("Business Unit *", () => {
      describe("disable", () => {
        test("is not disabled when formmode is insert", () => {
          renderComponent();
          render(Wrapper.mock.calls[0][0].children);
          render(LocalizationProvider.mock.calls[0][0].children);
          Row.mock.calls.forEach((call, index) => render(Row.mock.calls[index][0].children));
          const buDropdown = Dropdown.mock.calls[0][0];
          expect(buDropdown.disabled).toBe(false);
        });
        test("is disabled when formmode is not insert", () => {
          const formState = {
            ...initialFormState,
            formMode: "update"
          };
          useFormState.mockReturnValue(formState);
          renderComponent();
          render(Wrapper.mock.calls[0][0].children);
          render(LocalizationProvider.mock.calls[0][0].children);
          Row.mock.calls.forEach((call, index) => render(Row.mock.calls[index][0].children));
          const buDropdown = Dropdown.mock.calls[0][0];
          expect(buDropdown.disabled).toBe(true);
        });
      });
      test("options", () => {
        renderComponent();
        render(Wrapper.mock.calls[0][0].children);
        render(LocalizationProvider.mock.calls[0][0].children);
        Row.mock.calls.forEach((call, index) => render(Row.mock.calls[index][0].children));
        const buDropdown = Dropdown.mock.calls[0][0];
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
        render(Wrapper.mock.calls[0][0].children);
        render(LocalizationProvider.mock.calls[0][0].children);
        Row.mock.calls.forEach((call, index) => render(Row.mock.calls[index][0].children));
        const updateValue = Dropdown.mock.calls[0][0].updateValue;
        act(() => updateValue({}, { value: "123-321" }));
        expect(mockSetForm).toHaveBeenLastCalledWith({
          type: userFormActions.SET_WFM_BUSINESS_UNIT,
          payload: "123-321"
        });
      });
    });
    describe("First Day of the Week *", () => {
      describe("disable", () => {
        test("is not disabled when formmode is insert", () => {
          renderComponent();
          render(Wrapper.mock.calls[0][0].children);
          render(LocalizationProvider.mock.calls[0][0].children);
          Row.mock.calls.forEach((call, index) => render(Row.mock.calls[index][0].children));
          const dowDropdown = Dropdown.mock.calls[1][0];
          expect(dowDropdown.disabled).toBe(false);
        });
        test("is disabled when formmode is not insert", () => {
          const formState = {
            ...initialFormState,
            formMode: "update"
          };
          useFormState.mockReturnValue(formState);
          renderComponent();
          render(Wrapper.mock.calls[0][0].children);
          render(LocalizationProvider.mock.calls[0][0].children);
          Row.mock.calls.forEach((call, index) => render(Row.mock.calls[index][0].children));
          const dowDropdown = Dropdown.mock.calls[1][0];
          expect(dowDropdown.disabled).toBe(true);
        });
      });
      test("options", () => {
        renderComponent();
        render(Wrapper.mock.calls[0][0].children);
        render(LocalizationProvider.mock.calls[0][0].children);
        Row.mock.calls.forEach((call, index) => render(Row.mock.calls[index][0].children));
        const dowDropdown = Dropdown.mock.calls[1][0];
        expect(dowDropdown.options).toEqual([0, 1, 2,3,4,5,6]);
      });
      test("updateValue calls setForm", () => {
        renderComponent();
        render(Wrapper.mock.calls[0][0].children);
        render(LocalizationProvider.mock.calls[0][0].children);
        Row.mock.calls.forEach((call, index) => render(Row.mock.calls[index][0].children));
        const updateValue = Dropdown.mock.calls[1][0].updateValue;
        act(() => updateValue({}, 1));
        expect(mockSetForm).toHaveBeenLastCalledWith({
          type: userFormActions.SET_WFM_FIRST_DAY_OF_WEEK,
          payload: 1
        });
      });
    });
    describe("Time Zone", () => {
      describe("disable", () => {
        test("is not disabled when formmode is insert", () => {
          renderComponent();
          render(Wrapper.mock.calls[0][0].children);
          render(LocalizationProvider.mock.calls[0][0].children);
          Row.mock.calls.forEach((call, index) => render(Row.mock.calls[index][0].children));
          const timezoneDropdown = Dropdown.mock.calls[2][0];
          expect(timezoneDropdown.disabled).toBe(false);
        });
        test("is disabled when formmode is not insert", () => {
          const formStateTritonUserFound = {
            ...initialFormState,
            formMode: "update"
          };
          useFormState.mockReturnValue(formStateTritonUserFound);
          renderComponent();
          render(Wrapper.mock.calls[0][0].children);
          render(LocalizationProvider.mock.calls[0][0].children);
          Row.mock.calls.forEach((call, index) => render(Row.mock.calls[index][0].children));
          const timezoneDropdown = Dropdown.mock.calls[2][0];
          expect(timezoneDropdown.disabled).toBe(true);
        });
      });
      test("options", () => {
        renderComponent();
        render(Wrapper.mock.calls[0][0].children);
        render(LocalizationProvider.mock.calls[0][0].children);
        Row.mock.calls.forEach((call, index) => render(Row.mock.calls[index][0].children));
        const timezoneDropdown = Dropdown.mock.calls[2][0];
        expect(timezoneDropdown.options).toEqual(calabrioTimeZones);
      });
      test("updateValue calls setForm", () => {
        renderComponent();
        render(Wrapper.mock.calls[0][0].children);
        render(LocalizationProvider.mock.calls[0][0].children);
        Row.mock.calls.forEach((call, index) => render(Row.mock.calls[index][0].children));
        const updateValue = Dropdown.mock.calls[2][0].updateValue;
        act(() => updateValue({}, calabrioTimeZones[0]));
        expect(mockSetForm).toHaveBeenLastCalledWith({
          type: userFormActions.SET_WFM_TIME_ZONE,
          payload: "America/New_York"
        });
      });
    });
    describe("Availability", () => {
      describe("disable", () => {
        test("is not disabled when formmode is insert", () => {
          renderComponent();
          render(Wrapper.mock.calls[0][0].children);
          render(LocalizationProvider.mock.calls[0][0].children);
          Row.mock.calls.forEach((call, index) => render(Row.mock.calls[index][0].children));
          const availabilityDropdown = Dropdown.mock.calls[3][0];
          expect(availabilityDropdown.disabled).toBe(false);
        });
        test("is disabled when formmode is not insert", () => {
          const formState = {
            ...initialFormState,
            formMode: "update"
          };
          useFormState.mockReturnValue(formState);
          renderComponent();
          render(Wrapper.mock.calls[0][0].children);
          render(LocalizationProvider.mock.calls[0][0].children);
          Row.mock.calls.forEach((call, index) => render(Row.mock.calls[index][0].children));
          const availabilityDropdown = Dropdown.mock.calls[3][0];
          expect(availabilityDropdown.disabled).toBe(true);
        });
      });
    //   TODO: WHY ARE THE OPTIONS EMPTY???
    //   test("options", () => {
    //     const formState = {
    //       ...initialFormState,
    //       calabrio_wfm: {
    //         ...initialFormState.calabrio_wfm,
    //         BusinessUnitId: "123-321"
    //       }
    //     };
    //     useFormState.mockReturnValue(formState);
    //     renderComponent();
    //     render(Wrapper.mock.calls[0][0].children);
    //     render(LocalizationProvider.mock.calls[0][0].children);
    //     Row.mock.calls.forEach((call, index) => render(Row.mock.calls[index][0].children));
    //     const availabilityDropdown = Dropdown.mock.calls[3][0];
    //     console.warn("LOOK AT ME", Dropdown.mock.calls[3])
    //     expect(availabilityDropdown.options).toEqual([]);
    //   });
    // TODO: THIS ONE IS WEIRD TOO
    //   test.only("updateValue calls setForm", () => {
    //     renderComponent();
    //     render(Wrapper.mock.calls[0][0].children);
    //     render(LocalizationProvider.mock.calls[0][0].children);
    //     Row.mock.calls.forEach((call, index) => render(Row.mock.calls[index][0].children));
    //     const updateValue = Dropdown.mock.calls[3][0].updateValue;
    //     act(() => updateValue({}, "boo"));
    //     expect(mockSetForm).toHaveBeenLastCalledWith({
    //       type: userFormActions.SET_WFM_AVAILABILITY,
    //       payload: {
    //         Id: "boo"
    //       }
    //     });
    //   });
    });
    describe("Roles", () => {
      describe("disable", () => {
        test("is not disabled when formmode is insert", () => {
          renderComponent();
          render(Wrapper.mock.calls[0][0].children);
          render(LocalizationProvider.mock.calls[0][0].children);
          Row.mock.calls.forEach((call, index) => render(Row.mock.calls[index][0].children));
          const rolesDropdown = Dropdown.mock.calls[4][0];
          expect(rolesDropdown.disabled).toBe(false);
        });
        test("is disabled when formmode is not insert", () => {
          const formState = {
            ...initialFormState,
            formMode: "update"
          };
          useFormState.mockReturnValue(formState);
          renderComponent();
          render(Wrapper.mock.calls[0][0].children);
          render(LocalizationProvider.mock.calls[0][0].children);
          Row.mock.calls.forEach((call, index) => render(Row.mock.calls[index][0].children));
          const rolesDropdown = Dropdown.mock.calls[4][0];
          console.warn("rolesDropdown", rolesDropdown);
          expect(rolesDropdown.disabled).toBe(true);
        });
      });
      //   TODO: this one. what the heck is the trick with the options??
      //   test("options", () => {
      //     const formState = {
      //       ...initialFormState,
      //       calabrio_wfm: {
      //         ...initialFormState.calabrio_wfm,
      //         BusinessUnitId: "123-321"
      //       }
      //     };
      //     useFormState.mockReturnValue(formState);
      //     renderComponent();
      //     render(Wrapper.mock.calls[0][0].children);
      //     render(LocalizationProvider.mock.calls[0][0].children);
      //     Row.mock.calls.forEach((call, index) => render(Row.mock.calls[index][0].children));
      //     const rolesDropdown = Dropdown.mock.calls[4][0];
      //     expect(rolesDropdown.options).toEqual(["boo"]);
      //   });
      test("updateValue calls setForm", () => {
        renderComponent();
        render(Wrapper.mock.calls[0][0].children);
        render(LocalizationProvider.mock.calls[0][0].children);
        Row.mock.calls.forEach((call, index) => render(Row.mock.calls[index][0].children));
        const updateValue = Dropdown.mock.calls[4][0].updateValue;
        act(() => updateValue({}, ["111"]));
        expect(mockSetForm).toHaveBeenLastCalledWith({
          type: userFormActions.SET_WFM_ROLES,
          payload: ["111"]
        });
      });
    });
    describe("Skills", () => {
    //   test("options", () => {
    //     const formState = {
    //       ...initialFormState,
    //       calabrio_wfm: {
    //         ...initialFormState.calabrio_wfm,
    //         BusinessUnitId: "123-321"
    //       }
    //     };
    //     useFormState.mockReturnValue(formState);
    //     renderComponent();
    //     render(Wrapper.mock.calls[0][0].children);
    //     render(LocalizationProvider.mock.calls[0][0].children);
    //     Row.mock.calls.forEach((call, index) => render(Row.mock.calls[index][0].children));
    //     const skillsDropdown = Dropdown.mock.calls[5][0];
    //     expect(skillsDropdown.options).toEqual(["boo"]);
    //   });
    //   test("updateValue calls setForm", () => {
    //     renderComponent();
    //     render(Wrapper.mock.calls[0][0].children);
    //     render(LocalizationProvider.mock.calls[0][0].children);
    //     Row.mock.calls.forEach((call, index) => render(Row.mock.calls[index][0].children));
    //     const updateValue = Dropdown.mock.calls[5][0].updateValue;
    //     act(() => updateValue({}, ["111", "222"]));
    //     expect(mockSetForm).toHaveBeenLastCalledWith({
    //       type: userFormActions.SET_WFM_SKILLS,
    //       payload: ["111", "222"]
    //     });
    //   });
    });
    describe("Workflow Control Set", () => {});
    describe("Rotation", () => {});
    describe("Rotation Start Week", () => {});
    describe("Optional Columns", () => {});
    describe("Team *", () => {});
    describe("Absence", () => {});
    describe("Budget Group", () => {});
    describe("Part Time Percentage", () => {});
    describe("Contract Schedule", () => {});
    describe("Contract", () => {});
    describe("Shift Bag", () => {});
  });
  describe("TextField", () => {
    describe("Identity", () => {});

  });
  describe("DatePicker", () => {
    describe("Person start date", () => {

    });
  });
});