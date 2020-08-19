import {
  OutlinedSelect,
  SimpleSelect
} from "../CustomSelect";
import React from "react";
import {
  fireEvent,
  muiErrorClassRegex,
  render
} from "testUtils";

const mockDisplayFunc = jest.fn();
const updateValueFunc = jest.fn();

const getOptionsElements = rendered => rendered.queryAllByTestId("select-option");

describe("CustomSelect", () => {

  beforeEach(() => {
    mockDisplayFunc.mockClear();
    mockDisplayFunc.mockImplementation(val => ({
      display: `test${val.item}`,
      key: val.item,
      value: `test${val.item}`
    }));
    updateValueFunc.mockClear();
  });

  describe("<OutlinedSelect />", () => {

    const renderWithProps = ({
      error, helperText, label, labelWidth, optionsList, optionsDisplayFunc, updateValue, value, noBlankValue
    }) => {
      return render(<OutlinedSelect
        error={error}
        helperText={helperText}
        label={label}
        labelWidth={labelWidth}
        noBlankValue={noBlankValue}
        optionsList={optionsList}
        optionsDisplayFunc={optionsDisplayFunc}
        updateValue={updateValue}
        value={value} />);
    };

    const testList = [
      { item: "one" },
      { item: "two" }
    ];

    describe("noBlankValue = false", () => {
      test("should display each option in addition to extra blank value", () => {
        const rendered = renderWithProps({
          label: "test",
          labelWidth: 41,
          optionsList: testList,
          optionsDisplayFunc: mockDisplayFunc,
          updateValue: updateValueFunc,
          value: "testone",
          noBlankValue: false
        });
        expect(getOptionsElements(rendered).length).toBe(testList.length + 1);
      });
    });
    describe("noBlankValue = undefined", () => {
      test("should display each option in addition to extra blank value", () => {
        const rendered = renderWithProps({
          label: "test",
          labelWidth: 41,
          optionsList: testList,
          optionsDisplayFunc: mockDisplayFunc,
          updateValue: updateValueFunc,
          value: "testone"
        });
        expect(getOptionsElements(rendered).length).toBe(testList.length + 1);
      });
    });
    describe("error is passed", () => {
      test("should render with style error", () => {
        const rendered = renderWithProps({
          error: true,
          label: "test",
          labelWidth: 41,
          optionsList: testList,
          optionsDisplayFunc: mockDisplayFunc,
          updateValue: updateValueFunc,
          value: "testone",
          noBlankValue: true
        });
        const { className } = rendered.queryByText("test");
        expect(muiErrorClassRegex.test(className)).toBeTruthy();
      });
    });
    describe("error is not passed", () => {
      test("should render with style error", () => {
        const rendered = renderWithProps({
          label: "test",
          labelWidth: 41,
          optionsList: testList,
          optionsDisplayFunc: mockDisplayFunc,
          updateValue: updateValueFunc,
          value: "testone",
          noBlankValue: true
        });
        const { className } = rendered.queryByText("test");
        expect(muiErrorClassRegex.test(className)).toBeFalsy();
      });
    });
    describe("helperText is passed", () => {
      test("should not display helper text", () => {
        const helperText = "Do some stuff";
        const rendered = renderWithProps({
          helperText,
          label: "test",
          labelWidth: 41,
          optionsList: testList,
          optionsDisplayFunc: mockDisplayFunc,
          updateValue: updateValueFunc,
          value: "testone",
          noBlankValue: true
        });
        expect(rendered.queryByText(helperText)).toBeInTheDocument();
      });
    });
    describe("noBlankValue = true", () => {
      test("should display each option with no extra blank value", () => {
        const rendered = renderWithProps({
          label: "test",
          labelWidth: 41,
          optionsList: testList,
          optionsDisplayFunc: mockDisplayFunc,
          updateValue: updateValueFunc,
          value: "testone",
          noBlankValue: true
        });
        expect(getOptionsElements(rendered).length).toBe(testList.length);
      });
    });
    test("when we have an empty array, we should only show the option of value='', and the header.", () => {
      const rendered = renderWithProps({
        label: "TestLabel",
        labelWidth: 41,
        optionsList: [],
        optionsDisplayFunc: mockDisplayFunc,
        updateValue: updateValueFunc,
        value: ""
      });
      expect(rendered.queryByDisplayValue("").length).toBe(1);
      expect(rendered.queryByText("TestLabel")).toBeInTheDocument();
      expect(updateValueFunc.mock.calls.length).toBe(0);
    });
    test("when we send in an array, we should properly set the options list based on the optionsDisplayFunc.", () => {
      const rendered = renderWithProps({
        label: "test",
        labelWidth: 41,
        optionsList: testList,
        optionsDisplayFunc: mockDisplayFunc,
        updateValue: updateValueFunc,
        value: "testone"
      });
      expect(rendered.getByText("testone", { selector: "option" })).toBeInTheDocument();
      expect(rendered.getByText("testtwo", { selector: "option" })).toBeInTheDocument();
    });
    test("the value being sent in should be preselected.", () => {
      const rendered = renderWithProps({
        label: "test",
        labelWidth: 41,
        optionsList: testList,
        optionsDisplayFunc: mockDisplayFunc,
        updateValue: updateValueFunc,
        value: "testone"
      });
      expect(rendered.getByDisplayValue("testone")).toBeInTheDocument();
      expect(rendered.queryAllByDisplayValue("testtwo").length).toBe(0);
    });
    test("selecting an option should fire the change event function.", () => {
      const rendered = renderWithProps({
        label: "test",
        labelWidth: 41,
        optionsList: testList,
        optionsDisplayFunc: mockDisplayFunc,
        updateValue: updateValueFunc,
        value: "testone"
      });
      const value = "testtwo";
      fireEvent.change(rendered.getByTestId("outlined-select-input"),  { target: { value }});
      expect(updateValueFunc).toHaveBeenCalledWith(value);
    });
  });

  describe("<SimpleSelect />", () => {

    const testList = [
      { item: "cool" },
      { item: "wow" },
      { item: "amazing" },
      { item: "neat" },
      { item: "whoa" }
    ];

    const renderWithProps = (optionsList, noBlankValue, value, fontSize, disabled) => render(<SimpleSelect
      disabled={disabled}
      fontSize={fontSize}
      noBlankValue={noBlankValue}
      optionsDisplayFunc={mockDisplayFunc}
      optionsList={optionsList}
      updateValue={updateValueFunc}
      value={value}
    />);

    describe("noBlankValue = false", () => {
      const noBlankValue = false;
      test("should display each option in addition to extra blank value", () => {
        const rendered = renderWithProps(testList, noBlankValue);
        expect(getOptionsElements(rendered).length).toBe(testList.length + 1);
      });
    });
    describe("noBlankValue = undefined", () => {
      const noBlankValue = undefined;
      test("should display each option in addition to extra blank value", () => {
        const rendered = renderWithProps(testList, noBlankValue);
        expect(getOptionsElements(rendered).length).toBe(testList.length + 1);
      });
    });
    describe("noBlankValue = true", () => {
      const noBlankValue = true;
      test("should display each option with no extra blank value", () => {
        const rendered = renderWithProps(testList, noBlankValue);
        expect(getOptionsElements(rendered).length).toBe(testList.length);
      });
    });
    test("when we send in an array, we should properly set the options list based on the optionsDisplayFunc.", () => {
      const rendered = renderWithProps(testList);
      testList.forEach(option => {
        expect(rendered.getByText(`test${option.item}`, { selector: "option" })).toBeInTheDocument();
      });
    });
    test("the value being sent in should be preselected.", () => {
      const value = testList[3].item;
      const rendered = renderWithProps(testList, undefined, value);
      expect(rendered.queryAllByDisplayValue(`test${testList[0].item}`).length).toBe(0);
      expect(rendered.queryAllByDisplayValue(`test${testList[1].item}`).length).toBe(0);
      expect(rendered.queryAllByDisplayValue(`test${testList[2].item}`).length).toBe(0);
      expect(rendered.queryAllByDisplayValue(`test${testList[3].item}`).length).toBe(0);
      expect(rendered.queryAllByDisplayValue(`test${testList[4].item}`).length).toBe(0);
    });
    test("selecting an option should fire the change event function.", () => {
      const value = "testcool";
      const rendered = renderWithProps(testList, true, value);
      const inputElement = rendered.getByTestId("simple-select-input");
      fireEvent.change(inputElement, { target: { value }});
      expect(updateValueFunc).toHaveBeenCalledWith(value);
    });
    test("passing optional props will still render Select component properly", () => {
      const rendered = renderWithProps(testList, true, "whatever", 42, true);
      expect(getOptionsElements(rendered).length).toBe(testList.length);
    });
  });
});