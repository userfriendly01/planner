import SkillDropDown from "../SkillDropDown";
import { FilterableSelect } from "components";
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
  FilterableSelect: jest.fn()
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
    setupMockedComponents({ FilterableSelect });
    mockUpdateSkill.mockClear();
  });
  describe("initial state", () => {
    test("should render FilterableSelect with correct props", () => {
      const rendered = renderComponent();
      expect(FilterableSelect.mock.calls.length).toBe(1);
      expectMockedComponent(rendered, { FilterableSelect });
      expectOnlyPassedProps(FilterableSelect, {
        optionsList: skills
      });
    });
  });
  describe("changes made to the add skills drop down", () => {
    test("should call updateSkill function with selected value", () => {
      renderComponent();
      const selectedValue = JSON.stringify(skills[1]);
      act(() => {
        const updateSkill = FilterableSelect.mock.calls[0][0].updateSkill;
        updateSkill(selectedValue);
      });
      expect(mockUpdateSkill).toHaveBeenCalledWith(selectedValue);
    });
  });
});