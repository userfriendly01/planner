import PriorityDropDown from "../PriorityDropDown";
import { OutlinedSelect } from "components";
import React from "react";
import {
  expectMockedComponent,
  expectOnlyPassedProps,
  render,
  setupMockedComponents
} from "testUtils";

jest.mock("components", () => ({
  __esModule: true,
  OutlinedSelect: jest.fn()
}));

describe("<PriorityDropDown />", () => {
  const priorities = [1, 2, 3];
  const mockUpdatePriority = jest.fn();
  const renderComponent = () => {
    return render(<PriorityDropDown
      availablePriorities={priorities}
      disabled={true}
      priorityValue={1}
      updatePriority={mockUpdatePriority}
    />);
  };
  beforeEach(() => {
    setupMockedComponents({ OutlinedSelect });
    mockUpdatePriority.mockClear();
  });
  describe("initial state", () => {
    test("should render OutlinedSelect with correct props", () => {
      const rendered = renderComponent();
      expect(OutlinedSelect.mock.calls.length).toBe(1);
      expectMockedComponent(rendered, { OutlinedSelect });
      expectOnlyPassedProps(OutlinedSelect, {
        label: "",
        labelWidth: 0,
        optionsList: [1, 2, 3],
        value: 1
      });
      const optionsDisplayFunc = OutlinedSelect.mock.calls[0][0].optionsDisplayFunc;
      optionsDisplayFunc("whatever");
    });
  });
});