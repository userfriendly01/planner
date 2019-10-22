import SkillDropDown from "../SkillDropDown";
import { CustomSelect } from "components";
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
  CustomSelect: jest.fn()
}));

describe("<SkillDropDown />", () => {
  const skills = [
    { skill: "skill3" },
    { skill: "skill2" },
    { skill: "skill1" },
    { skill: "skill4" }
  ];
  const mockUpdateSkill = jest.fn();
  const renderComponent = () => render(<SkillDropDown taskrouterSkills={skills} skillValue={"skill3"} updateSkill={mockUpdateSkill} />);
  beforeEach(() => {
    setupMockedComponents({ CustomSelect });
    mockUpdateSkill.mockClear();
  });
  describe("initial state", () => {
    test("should render CustomSelect with correct props", () => {
      const rendered = renderComponent();
      expect(CustomSelect.mock.calls.length).toBe(1);
      expectMockedComponent(rendered, { CustomSelect });
      expectOnlyPassedProps(CustomSelect, {
        label: "Add Default Skill",
        labelWidth: 120,
        optionsList: skills,
        value: "skill3"
      });
      const optionsDisplayFunc = CustomSelect.mock.calls[0][0].optionsDisplayFunc;
      optionsDisplayFunc({ name: "whatever" });
    });
  });
  describe("changes made to the add skills drop down", () => {
    test("should call updateSkill function with selected value", () => {
      renderComponent();
      const selectedValue = JSON.stringify(skills[1]);
      act(() => {
        const updateValue = CustomSelect.mock.calls[0][0].updateValue;
        updateValue(selectedValue);
      });
      expect(mockUpdateSkill).toHaveBeenCalledWith(selectedValue);
    });
  });
});