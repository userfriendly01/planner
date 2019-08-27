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

const renderWithProps = (label, labelWidth, optionsList, optionsDisplayFunc, updateValue, value) => {
  return render(<CustomSelect
    label={label}
    labelWidth={labelWidth}
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
});