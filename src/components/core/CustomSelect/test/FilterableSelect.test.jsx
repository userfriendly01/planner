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

const updateSkillFunc = jest.fn();

const options = [
  {
    value: "bscCbs",
    label: "bscCbs"
  },
  {
    value: "aisg-l1",
    label: "aisg-l1"
  },
  {
    value: "FARM",
    label: "FARM"
  }
];

describe("<FilterableSelect />", () => {
  beforeEach(() => {
    setupMockedComponents({ Select });
    updateSkillFunc.mockClear();
  });

  test("Test the FilterableSelect renders with the correct props", () => {
    const rendered = render(<FilterableSelect optionsList={options} updateValue={updateSkillFunc}/>);
    expectMockedComponent(rendered, { Select }, 1);
    expectOnlyPassedProps(Select, {
      clearable: true,
      onSelectResetsInput: true,
      options: options,
      searchable: true
    });
  });

  test("Test the FilterableSelect value should change on selection of a skill", () => {
    render(<FilterableSelect optionsList={options} updateValue={updateSkillFunc}/>);
    const onChange = Select.mock.calls[0][0].onChange;
    const changeTo = options[1];
    onChange(changeTo);
    expect(updateSkillFunc).toHaveBeenCalledWith(changeTo);
  });
});