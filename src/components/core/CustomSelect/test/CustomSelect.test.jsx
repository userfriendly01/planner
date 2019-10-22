import CustomSelect from "../CustomSelect";
import React from "react";
import {
  fireEvent,
  render
} from "testUtils";

const mockDisplayFunc = jest.fn(val => {
  return {
    display: `test${val.item}`,
    key: val.item,
    value: `test${val.item}`
  };
});

const testList = [
  {
    item: "one"
  },
  {
    item: "two"
  }
];

const updateValueFunc = jest.fn();

const getOptionsElements = rendered => rendered.queryAllByTestId("select-option");

const renderWithProps = (label, labelWidth, optionsList, optionsDisplayFunc, updateValue, value, noBlankValue) => {
  return render(<CustomSelect
    label={label}
    labelWidth={labelWidth}
    noBlankValue={noBlankValue}
    optionsList={optionsList}
    optionsDisplayFunc={optionsDisplayFunc}
    updateValue={updateValue}
    value={value} />);
};

describe("<CustomSelect />", () => {
  beforeEach(() => {
    mockDisplayFunc.mockClear();
    updateValueFunc.mockClear();
  });
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
    fireEvent.change(rendered.getByTestId("customSelect"),  { target: { value: "testtwo" }});
    expect(updateValueFunc.mock.calls.length).toBe(1);
  });
  test("omitting the labelWidth prop will still render Select component properly", () => {
    const rendered = render(<CustomSelect
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