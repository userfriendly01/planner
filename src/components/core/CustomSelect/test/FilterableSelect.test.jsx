import FilterableSelect from "../FilterableSelect";
import React from "react";
import Select from "react-select";
import {
  expectMockedComponent,
  expectOnlyPassedProps,
  render,
  setupMockedComponents
} from "testUtils";

jest.mock("react-select", () => ({
  __esModule: true,
  default: jest.fn()
}));

const updateValueFunc = jest.fn();

const options = [
  {
    value: "value1",
    label: "label1"
  },
  {
    value: "value2",
    label: "label2"
  },
  {
    value: "value3",
    label: "label3"
  }
];

describe("<FilterableSelect />", () => {
  beforeEach(() => {
    setupMockedComponents({ Select });
    updateValueFunc.mockClear();
  });

  test("Test the FilterableSelect renders with the correct props", () => {
    const rendered = render(<FilterableSelect optionsList={options} updateValue={updateValueFunc}/>);
    expectMockedComponent(rendered, { Select }, 1);
    expectOnlyPassedProps(Select, {
      clearable: true,
      onSelectResetsInput: true,
      options: options,
      searchable: true
    });
  });

  test("Test the FilterableSelect value should change on selection of an option", () => {
    render(<FilterableSelect optionsList={options} updateValue={updateValueFunc}/>);
    const onChange = Select.mock.calls[0][0].onChange;
    const changeTo = options[1];
    onChange(changeTo);
    expect(updateValueFunc).toHaveBeenCalledWith(changeTo);
  });
});