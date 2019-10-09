import AddPriorityDropDown from "../AddPriorityDropDown";
import { CustomSelect } from "components";
import React from "react";
import {
  expectMockedComponent,
  expectOnlyPassedProps,
  render,
  setupMockedComponents
} from "testUtils";

jest.mock("components", () => ({
  __esModule: true,
  CustomSelect: jest.fn()
}));

describe("<AddPriorityDropDown />", () => {
  const priorities = [1, 2, 3];
  const mockUpdatePriority = jest.fn();
  const renderComponent = () => {
    return render(<AddPriorityDropDown
      availablePriorities={priorities}
      disabled={true}
      priorityValue={1}
      updatePriority={mockUpdatePriority}
    />);
  };
  beforeEach(() => {
    setupMockedComponents({ CustomSelect });
    mockUpdatePriority.mockClear();
  });
  describe("initial state", () => {
    test("should render CustomSelect with correct props", () => {
      const rendered = renderComponent();
      expect(CustomSelect.mock.calls.length).toBe(1);
      expectMockedComponent(rendered, { CustomSelect });
      expectOnlyPassedProps(CustomSelect, {
        label: "",
        labelWidth: 0,
        optionsList: [1, 2, 3],
        value: 1
      });
      const optionsDisplayFunc = CustomSelect.mock.calls[0][0].optionsDisplayFunc;
      optionsDisplayFunc("whatever");
    });
  });
});