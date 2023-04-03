import {
  Autocomplete,
  Divider,
  TextField
}from "@mui/material";
import { Dropdown } from "../Dropdown";
import React from "react";
import {
  act,
  expectOnlyPassedProps,
  render,
  setupMockedComponents
} from "testUtils";
jest.mock("@mui/material", () => ({
  __esModule: true,
  Autocomplete: jest.fn(),
  Divider: jest.fn(),
  TextField: jest.fn(),
  Button: jest.fn(),
  Tabs: jest.fn(),
  Tab: jest.fn(),
  Paper: jest.fn(),
  Checkbox: jest.fn()
}));

jest.mock("@mui/x-data-grid", () => ({
  __esModule: true,
  DataGrid: jest.fn(),
  GridToolbar: jest.fn()
}));

jest.mock("@mui/x-date-pickers/TimePicker", () => ({
  TimePicker: jest.fn()
}));

const mockOnBlur = jest.fn();
const mockUpdateValue = jest.fn();

const label = "Dropdown";
const value = 3;
const options = [
  {
    label: "Option One",
    value: 1
  },
  {
    label: "Option Two",
    value: 2
  },
  {
    label: "Option Three",
    value: 3
  }
];


describe("CustomDropdown", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setupMockedComponents({
      Autocomplete,
      Divider,
      TextField
    });
  });
  describe("initial render", () => {
    const renderComponent = value => render(<Dropdown
      options={options}
      label={label}
      updateValue={mockUpdateValue}
      value={value}
      onBlur={mockOnBlur}
    />);

    describe("value is an object", () => {
      describe("value.value is a valid option", () => {
        test("Dropdown should render with expected props", () => {
          const value = options[0];
          renderComponent(value);
          const renderInput = Autocomplete.mock.calls[0][0].renderInput;
          const handleCheckEqual = Autocomplete.mock.calls[0][0].isOptionEqualToValue;
          const input = renderInput();
          render(input);
          expect(handleCheckEqual(options[0], value)).toBe(true);
          expect(handleCheckEqual(options[1], value)).toBe(false);
          expect(handleCheckEqual(options[2], value)).toBe(false);
          expectOnlyPassedProps(TextField, {
            error: undefined,
            label
          });
          expectOnlyPassedProps(Autocomplete, {
            multiple: undefined,
            size: "medium",
            disableClearable: true,
            disableCloseOnSelect: undefined,
            limitTags: 1,
            options,
            value,
            onChange: mockUpdateValue,
            disabled: undefined,
            onBlur: mockOnBlur,
            sx: {
              ".MuiOutlinedInput-notchedOutline": { border: "invalidValueToForceOriginalStyling" },
              margin: "5px",
              minHeight: "56px",
              width: "250px"
            }
          });
        });
      });
      describe("value.value === '' ", () => {
        test("Dropdown should render with expected props", () => {
          const value = { value: "" };
          renderComponent(value);
          const renderInput = Autocomplete.mock.calls[0][0].renderInput;
          const handleCheckEqual = Autocomplete.mock.calls[0][0].isOptionEqualToValue;
          const input = renderInput();
          render(input);
          expect(handleCheckEqual(options[0], value)).toBe(true);
          expect(handleCheckEqual(options[1], value)).toBe(true);
          expect(handleCheckEqual(options[2], value)).toBe(true);
          expectOnlyPassedProps(TextField, {
            error: undefined,
            label
          });
          expectOnlyPassedProps(Autocomplete, {
            multiple: undefined,
            size: "medium",
            disableClearable: true,
            disableCloseOnSelect: undefined,
            limitTags: 1,
            options,
            value,
            onChange: mockUpdateValue,
            disabled: undefined,
            onBlur: mockOnBlur,
            sx: {
              ".MuiOutlinedInput-notchedOutline": { border: "invalidValueToForceOriginalStyling" },
              margin: "5px",
              minHeight: "56px",
              width: "250px"
            }
          });
        });
      });
      describe("value.value is not a valid option", () => {
        test("Dropdown should render with expected props", () => {
          const value = { value: 4 };
          renderComponent(value);
          const renderInput = Autocomplete.mock.calls[0][0].renderInput;
          const handleCheckEqual = Autocomplete.mock.calls[0][0].isOptionEqualToValue;
          const input = renderInput();
          render(input);
          expect(handleCheckEqual(options[0], value)).toBe(false);
          expect(handleCheckEqual(options[1], value)).toBe(false);
          expect(handleCheckEqual(options[2], value)).toBe(false);
          expectOnlyPassedProps(TextField, {
            error: undefined,
            label
          });
          expectOnlyPassedProps(Autocomplete, {
            multiple: undefined,
            size: "medium",
            disableClearable: true,
            disableCloseOnSelect: undefined,
            limitTags: 1,
            options,
            value,
            onChange: mockUpdateValue,
            disabled: undefined,
            onBlur: mockOnBlur,
            sx: {
              ".MuiOutlinedInput-notchedOutline": { border: "invalidValueToForceOriginalStyling" },
              margin: "5px",
              minHeight: "56px",
              width: "250px"
            }
          });
        });
      });
    });
    describe("value is not an object", () => {
      describe("value is a valid option", () => {
        test("Dropdown should render with expected props", () => {
          const value = 1;
          renderComponent(value);
          const renderInput = Autocomplete.mock.calls[0][0].renderInput;
          const handleCheckEqual = Autocomplete.mock.calls[0][0].isOptionEqualToValue;
          const input = renderInput();
          render(input);
          expect(handleCheckEqual(options[0], value)).toBe(true);
          expect(handleCheckEqual(options[1], value)).toBe(false);
          expect(handleCheckEqual(options[2], value)).toBe(false);
          expectOnlyPassedProps(TextField, {
            error: undefined,
            label
          });
          expectOnlyPassedProps(Autocomplete, {
            multiple: undefined,
            size: "medium",
            disableClearable: true,
            disableCloseOnSelect: undefined,
            limitTags: 1,
            options,
            value,
            onChange: mockUpdateValue,
            disabled: undefined,
            onBlur: mockOnBlur,
            sx: {
              ".MuiOutlinedInput-notchedOutline": { border: "invalidValueToForceOriginalStyling" },
              margin: "5px",
              minHeight: "56px",
              width: "250px"
            }
          });
        });
      });
      describe("value === '' ", () => {
        test("Dropdown should render with expected props", () => {
          const value = "";
          renderComponent(value);
          const renderInput = Autocomplete.mock.calls[0][0].renderInput;
          const handleCheckEqual = Autocomplete.mock.calls[0][0].isOptionEqualToValue;
          const input = renderInput();
          render(input);
          expect(handleCheckEqual(options[0], value)).toBe(true);
          expect(handleCheckEqual(options[1], value)).toBe(true);
          expect(handleCheckEqual(options[2], value)).toBe(true);
          expectOnlyPassedProps(TextField, {
            error: undefined,
            label
          });
          expectOnlyPassedProps(Autocomplete, {
            multiple: undefined,
            size: "medium",
            disableClearable: true,
            disableCloseOnSelect: undefined,
            limitTags: 1,
            options,
            value,
            onChange: mockUpdateValue,
            disabled: undefined,
            onBlur: mockOnBlur,
            sx: {
              ".MuiOutlinedInput-notchedOutline": { border: "invalidValueToForceOriginalStyling" },
              margin: "5px",
              minHeight: "56px",
              width: "250px"
            }
          });
        });
      });
      describe("value is not a valid option", () => {
        test("Dropdown should render with expected props", () => {
          const value = "4";
          renderComponent(value);
          const renderInput = Autocomplete.mock.calls[0][0].renderInput;
          const handleCheckEqual = Autocomplete.mock.calls[0][0].isOptionEqualToValue;
          const input = renderInput();
          render(input);
          expect(handleCheckEqual(options[0], value)).toBe(false);
          expect(handleCheckEqual(options[1], value)).toBe(false);
          expect(handleCheckEqual(options[2], value)).toBe(false);
          expectOnlyPassedProps(TextField, {
            error: undefined,
            label
          });
          expectOnlyPassedProps(Autocomplete, {
            multiple: undefined,
            size: "medium",
            disableClearable: true,
            disableCloseOnSelect: undefined,
            limitTags: 1,
            options,
            value,
            onChange: mockUpdateValue,
            disabled: undefined,
            onBlur: mockOnBlur,
            sx: {
              ".MuiOutlinedInput-notchedOutline": { border: "invalidValueToForceOriginalStyling" },
              margin: "5px",
              minHeight: "56px",
              width: "250px"
            }
          });
        });
      });
    });
  });
  describe("multiple === true", () => {
    test("Dropdown should render with expected props", () => {
      render(<Dropdown
        options={options}
        multiple={true}
        label={label}
        updateValue={mockUpdateValue}
        value={value}
        onBlur={mockOnBlur}
      />);
      const renderInput = Autocomplete.mock.calls[0][0].renderInput;
      const input = renderInput();
      render(input);
      expectOnlyPassedProps(TextField, {
        error: undefined,
        label
      });
      expectOnlyPassedProps(Autocomplete, {
        multiple: true,
        size: "medium",
        disableClearable: false,
        disableCloseOnSelect: true,
        limitTags: 1,
        options,
        value,
        onChange: mockUpdateValue,
        disabled: undefined,
        onBlur: mockOnBlur,
        sx: {
          ".MuiOutlinedInput-notchedOutline": { border: "invalidValueToForceOriginalStyling" },
          margin: "5px",
          minHeight: "56px",
          width: "250px"
        }
      });
    });
  });
  describe("error === true", () => {
    test("Dropdown should render with expected props", () => {
      render(<Dropdown
        options={options}
        error={true}
        label={label}
        updateValue={mockUpdateValue}
        value={value}
        onBlur={mockOnBlur}
      />);
      const renderInput = Autocomplete.mock.calls[0][0].renderInput;
      const input = renderInput();
      render(input);
      expectOnlyPassedProps(TextField, {
        error: true,
        label
      });
      expectOnlyPassedProps(Autocomplete, {
        multiple: undefined,
        size: "medium",
        disableClearable: true,
        disableCloseOnSelect: undefined,
        limitTags: 1,
        options,
        value,
        onChange: mockUpdateValue,
        disabled: undefined,
        onBlur: mockOnBlur,
        sx: {
          ".MuiOutlinedInput-notchedOutline": { border: "invalidValueToForceOriginalStyling" },
          margin: "5px",
          minHeight: "56px",
          width: "250px"
        }
      });
    });
  });
  describe("styles object is passed through", () => {
    const styles = {
      width: "100px",
      height: "100px",
      margin: "10px",
      noBorder: true,
      fontSize: "10px",
      small: true
    };
    test("Dropdown should render with expected styles", () => {
      render(<Dropdown
        options={options}
        styles={styles}
        label={label}
        updateValue={mockUpdateValue}
        value={value}
        onBlur={mockOnBlur}
      />);
      const renderInput = Autocomplete.mock.calls[0][0].renderInput;
      const input = renderInput();
      render(input);
      expectOnlyPassedProps(TextField, {
        error: undefined,
        label
      });
      expectOnlyPassedProps(Autocomplete, {
        multiple: undefined,
        size: "small",
        disableClearable: true,
        disableCloseOnSelect: undefined,
        limitTags: 1,
        options,
        value,
        onChange: mockUpdateValue,
        disabled: undefined,
        onBlur: mockOnBlur,
        sx: {
          ".MuiOutlinedInput-notchedOutline": { border: "none" },
          margin: "10px",
          minHeight: "100px",
          width: "100px"
        }
      });
    });
  });
  describe("onBlur is called", () => {
    test("mockOnBlur is called", () => {
      const value = options[0];
      render(<Dropdown
        options={options}
        label={label}
        updateValue={mockUpdateValue}
        value={value}
        onBlur={mockOnBlur}
      />);
      const onBlur = Autocomplete.mock.calls[0][0].onBlur;
      act(() => {
        onBlur();
        expect(mockOnBlur).toHaveBeenCalledTimes(1);
      });
    });
  });
  describe("onChange is called", () => {
    test("mockUpdateValue is called", () => {
      const startingValue = options[0];
      render(<Dropdown
        options={options}
        label={label}
        updateValue={mockUpdateValue}
        value={startingValue}
        onBlur={mockOnBlur}
      />);
      const onChange = Autocomplete.mock.calls[0][0].onChange;
      const updatedValue = options[1];
      act(() => {
        onChange(updatedValue);
        expect(mockUpdateValue).toHaveBeenCalledTimes(1);
        expect(mockUpdateValue).toHaveBeenCalledWith(updatedValue);
      });
    });
  });
  describe("options list includes a divider", () => {
    test("1 Divider is rendered", () => {
      const dividedOptions = [
        ...options,
        {
          label: "divider",
          value: "divider"
        }
      ];
      render(<Dropdown
        options={dividedOptions}
        label={label}
        updateValue={mockUpdateValue}
        value={value}
        onBlur={mockOnBlur}
      />);
      const renderOption = Autocomplete.mock.calls[0][0].renderOption;
      act(() => {
        const optionOne = renderOption({}, dividedOptions[0]);
        const optionTwo = renderOption({}, dividedOptions[1]);
        const optionThree = renderOption({}, dividedOptions[2]);
        const divider = renderOption({}, dividedOptions[3]);
        const renderedLIOne = render(optionOne);
        const renderedLITwo = render(optionTwo);
        const renderedLIThree = render(optionThree);
        render(divider);

        expect(renderedLIOne.container).toHaveTextContent("Option One");
        expect(renderedLITwo.container).toHaveTextContent("Option Two");
        expect(renderedLIThree.container).toHaveTextContent("Option Three");
        expect(Divider.mock.calls.length).toBe(1);
      });
    });
  });
  describe("custom render is passed", () => {
    test("custom render is rendered", () => {
      const CustomRender = jest.fn();
      setupMockedComponents({
        CustomRender
      });
      render(<Dropdown
        options={options}
        label={label}
        updateValue={mockUpdateValue}
        value={value}
        onBlur={mockOnBlur}
        CustomRender={CustomRender}
      />);
      const renderOption = Autocomplete.mock.calls[0][0].renderOption;
      act(() => {
        const optionOne = renderOption({}, options[0]);
        const optionTwo = renderOption({}, options[1]);
        const optionThree = renderOption({}, options[2]);
        render(optionOne);
        render(optionTwo);
        render(optionThree);
        expect(CustomRender).toBeCalledTimes(3);
        expect(CustomRender.mock.calls[0][0].option.label).toBe("Option One");
        expect(CustomRender.mock.calls[1][0].option.label).toBe("Option Two");
        expect(CustomRender.mock.calls[2][0].option.label).toBe("Option Three");
      });
    });
  });
  describe("Dropdown with label CallerType", () => {
    test("Dropdown should render with renderOptions and return List", () => {
      const dropDownOptions = ["TestingCallerType", "Testing2CallerType"];
      const value = "TestingCallerType";
      const props = {
        "data-option-index": 1
      };
      render(<Dropdown
        options={dropDownOptions}
        multiple={true}
        label="Caller Type"
        updateValue={mockUpdateValue}
        value={value}
        onBlur={mockOnBlur}
      />);
      const renderOptions = Autocomplete.mock.calls[0][0].renderOption;
      const rendered = renderOptions(props,dropDownOptions);
      expect(rendered).toBeTruthy();
    });
  });
});