import PriorityDropDown from "../PriorityDropDown";
import { SimpleSelect } from "components";
import React from "react";
import {
  expectMockedComponent,
  expectOnlyPassedProps,
  getMockedComponentProps,
  render,
  setupMockedComponents
} from "testUtils";

jest.mock("components", () => ({
  __esModule: true,
  SimpleSelect: jest.fn()
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
    setupMockedComponents({ SimpleSelect });
    mockUpdatePriority.mockClear();
  });
  describe("initial state", () => {
    test("should render SimpleSelect with correct props", () => {
      const rendered = renderComponent();
      expect(SimpleSelect.mock.calls.length).toBe(1);
      expectMockedComponent(rendered, { SimpleSelect });
      expectOnlyPassedProps(SimpleSelect, {
        noBlankValue: true,
        optionsList: [1, 2, 3],
        value: 1
      });
      const props = getMockedComponentProps(SimpleSelect);
      expect(props.optionsDisplayFunc("whatever")).toEqual({
        display: "whatever",
        key: "whatever",
        value: "whatever"
      });
      props.updateValue("cool");
      expect(mockUpdatePriority).toHaveBeenCalledWith("cool");
    });
  });
});