import { SkillsList } from "../SkillsList";
import { Dropdown } from "components/Dropdown";
import { useFormState } from "context/appContext";
import React from "react";
import { act } from "react-dom/test-utils";
import {
  expectMockedComponent,
  expectOnlyPassedProps,
  render,
  setupMockedComponents
} from "testUtils";

jest.mock("components/Dropdown", () => ({
  Dropdown: jest.fn()
}));

jest.mock("context/appContext", () => ({
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
      value: 1,
      label: "skillgroupA",
      isSkillGroup: true,
      skills: [{ name: "skill1"  }]
    },
    {
      value: 2,
      label: "skillgroupB",
      isSkillGroup: true,
      skills: [{ name: "skill2" }, { name: "skill1" }]
    },
    {
      label: "divider",
      value: "divider"
    },
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

  const skillGroups = [
    {
      skillGroupId: 1,
      skill_group_name: "skillgroupA",
      skills: [
        { name: "skill1" }
      ]
    },
    {
      skillGroupId: 2,
      skill_group_name: "skillgroupB",
      skills: [
        { name: "skill2" },
        { name: "skill1" }
      ]
    }
  ];

  const mockUpdateSkill = jest.fn();
  const renderComponent = () => render(<SkillsList skills={skills} skillGroups={skillGroups} skillValue={"skill3"} updateSkill={mockUpdateSkill} />);
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
    test.only("should call updateValue function with selected value", () => {
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