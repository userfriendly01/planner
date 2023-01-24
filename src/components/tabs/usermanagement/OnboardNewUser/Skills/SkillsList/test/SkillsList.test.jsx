import SkillsList from "../SkillsList";
import { Dropdown } from "components";
import { useFormState } from "context";
import React from "react";
import { act } from "react-dom/test-utils";
import {
  expectMockedComponent,
  expectOnlyPassedProps,
  render,
  setupMockedComponents
} from "testUtils";

jest.mock("components", () => ({
  __esModule: true,
  Dropdown: jest.fn()
}));

jest.mock("context", () => ({
  useFormState: jest.fn()
}));

describe("<SkillsList />", () => {
  const skills = [
    { name: "skill3" },
    { name: "skill2" },
    { name: "skill1" },
    { name: "skill4" }
  ];

  const options = [
    {
      label: "skill3",
      value: "skill3"
    },
    {
      label: "skill2",
      value: "skill2"
    },
    {
      label: "skill1",
      value: "skill1"
    },
    {
      label: "skill4",
      value: "skill4"
    }
  ];

  const mockUpdateSkill = jest.fn();
  const renderComponent = () => render(<SkillsList skills={skills} skillValue={"skill3"} updateSkill={mockUpdateSkill} />);
  beforeEach(() => {
    setupMockedComponents({ Dropdown });
    useFormState.mockReturnValue({ formMode: "insert" });
    mockUpdateSkill.mockClear();
  });
  describe("initial state", () => {
    test("should render FilterableSelect with correct props", () => {
      const rendered = renderComponent();
      expect(Dropdown.mock.calls.length).toBe(1);
      expectMockedComponent(rendered, { Dropdown });
      expectOnlyPassedProps(Dropdown, {
        options: options
      });
    });
  });
  describe("changes made to the add skills drop down", () => {
    test("should call updateValue function with selected value", () => {
      renderComponent();
      const selectedValue = JSON.stringify(skills[1]);
      act(() => {
        const updateValue = Dropdown.mock.calls[0][0].updateValue;
        updateValue(null, selectedValue);
      });
      expect(mockUpdateSkill).toHaveBeenCalledWith(selectedValue);
    });
  });
});