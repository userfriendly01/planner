import { SkillLevels } from "../SkillLevels";
import { Dropdown } from "components/Dropdown";
import React from "react";
import {
  expectMockedComponent,
  expectOnlyPassedProps,
  getMockedComponentProps,
  render,
  setupMockedComponents
} from "testUtils";

jest.mock("components/Dropdown", () => ({
  Dropdown: jest.fn()
}));

describe("<SkillLevels />", () => {
  const priorities = [1, 2, 3];
  const mockUpdatePriority = jest.fn();
  const renderComponent = () => {
    return render(<SkillLevels
      availablePriorities={priorities}
      priorityValue={1}
      updatePriority={mockUpdatePriority}
    />);
  };
  beforeEach(() => {
    setupMockedComponents({ Dropdown });
    mockUpdatePriority.mockClear();
  });
  describe("initial state", () => {
    test("should render Dropdown with correct props", () => {
      const rendered = renderComponent();
      expect(Dropdown.mock.calls.length).toBe(1);
      expectMockedComponent(rendered, { Dropdown });
      expectOnlyPassedProps(Dropdown, {
        options: [{
          label: "1",
          value: 1
        },
        {
          label: "2",
          value: 2
        },
        {
          label: "3",
          value: 3
        }],
        value: {
          label: "1",
          value: 1
        }
      });
      const props = getMockedComponentProps(Dropdown);
      props.updateValue(null, { value: "cool" });
      expect(mockUpdatePriority).toHaveBeenCalledWith("cool");
    });
  });
});