import SkillDropDown from "../SkillDropDown";
import { SimpleSelect } from "components";
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
  SimpleSelect: jest.fn()
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
    setupMockedComponents({ SimpleSelect });
    mockUpdateSkill.mockClear();
  });
  describe("initial state", () => {
    test("should render SimpleSelect with correct props", () => {
      const rendered = renderComponent();
      expect(SimpleSelect.mock.calls.length).toBe(1);
      expectMockedComponent(rendered, { SimpleSelect });
      expectOnlyPassedProps(SimpleSelect, {
        optionsList: skills,
        value: "skill3"
      });
      const optionsDisplayFunc = SimpleSelect.mock.calls[0][0].optionsDisplayFunc;
      expect(optionsDisplayFunc({ skill: "whatever" })).toEqual({
        display: "whatever",
        key: "whatever",
        value: "whatever"
      });
    });
  });
  describe("changes made to the add skills drop down", () => {
    test("should call updateSkill function with selected value", () => {
      renderComponent();
      const selectedValue = JSON.stringify(skills[1]);
      act(() => {
        const updateValue = SimpleSelect.mock.calls[0][0].updateValue;
        updateValue(selectedValue);
      });
      expect(mockUpdateSkill).toHaveBeenCalledWith(selectedValue);
    });
  });
});