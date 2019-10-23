import {
  OutlinedSelect,
  SimpleSelect
} from "../CustomSelect";
import React from "react";
import {
  fireEvent,
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

    const renderWithProps = (label, labelWidth, optionsList, optionsDisplayFunc, updateValue, value, noBlankValue) => {
      return render(<OutlinedSelect
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
        const rendered = renderWithProps("test", 41, testList, mockDisplayFunc, updateValueFunc, "testone", false);
        expect(getOptionsElements(rendered).length).toBe(testList.length + 1);
      });
    });
    describe("noBlankValue = undefined", () => {
      test("should display each option in addition to extra blank value", () => {
        const rendered = renderWithProps("test", 41, testList, mockDisplayFunc, updateValueFunc, "testone");
        expect(getOptionsElements(rendered).length).toBe(testList.length + 1);
      });
    });
    describe("noBlankValue = true", () => {
      test("should display each option with no extra blank value", () => {
        const rendered = renderWithProps("test", 41, testList, mockDisplayFunc, updateValueFunc, "testone", true);
        expect(getOptionsElements(rendered).length).toBe(testList.length);
      });
    });
    test("when we have an empty array, we should only show the option of value='', and the header.", () => {
      const rendered = renderWithProps("TestLabel", 41, [], mockDisplayFunc, updateValueFunc, "");
      expect(rendered.queryByDisplayValue("").length).toBe(1);
      expect(rendered.queryByLabelText("TestLabel").length).toBe(1);
      expect(updateValueFunc.mock.calls.length).toBe(0);
    });
    test("when we send in an array, we should properly set the options list based on the optionsDisplayFunc.", () => {
      const rendered = renderWithProps("test", 41, testList, mockDisplayFunc, updateValueFunc, "testone");
      expect(rendered.getByText("testone", { selector: "option" })).toBeInTheDocument();
      expect(rendered.getByText("testtwo", { selector: "option" })).toBeInTheDocument();
    });
    test("the value being sent in, should be preselected.", () => {
      const rendered = renderWithProps("test", 41, testList, mockDisplayFunc, updateValueFunc, "testone");
      expect(rendered.getByDisplayValue("testone")).toBeInTheDocument();
      expect(rendered.queryAllByDisplayValue("testtwo").length).toBe(0);
    });
    test("selecting an option should fire the change event function.", () => {
      const rendered = renderWithProps("test", 41, testList, mockDisplayFunc, updateValueFunc, "testone");
      const value = "testtwo";
      fireEvent.change(rendered.getByTestId("outlined-select-input"),  { target: { value }});
      expect(updateValueFunc).toHaveBeenCalledWith(value);
    });
    test("omitting the labelWidth prop will still render Select component properly", () => {
      const rendered = render(<OutlinedSelect
        label={"label whatever"}
        optionsList={testList}
        optionsDisplayFunc={mockDisplayFunc}
        updateValue={updateValueFunc}
        value={"value whatever"} />);
      expect(rendered.container).toHaveTextContent("label whatever");
      expect(rendered.container).toHaveTextContent("testone");
      expect(rendered.container).toHaveTextContent("testtwo");
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