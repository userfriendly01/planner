import { BulkUpdateDefaultSkills } from "../BulkUpdateDefaultSkills";
import { getUpdateTemplates } from "usermanagement/templates";
import { Dropdown } from "components/Dropdown";
import { DefaultSkillSelector } from "usermanagement/DefaultSkillSelector";
import { useSkillState } from "context/appContext";
import React from "react";
import {
  act,
  render,
  setupMockedComponents
} from "testUtils";

jest.mock("components/Dropdown", () => ({
  Dropdown: jest.fn()
}));

jest.mock("usermanagement/DefaultSkillSelector", () => ({
  DefaultSkillSelector: jest.fn()
}));

jest.mock("components/StyledButton", () => ({
  StyledButton: jest.fn()
}));

jest.mock("context/appContext", () => ({
  useSkillState: jest.fn()
}));

const skills = [
  {
    name: "skillz",
    levels: [1, 9001]
  },
  {
    name: "noLevelsHere",
    levels: []
  }
];

const adminState = {
  skillContext: {
    skills
  }
};

const dropdownOptions = [
  {
    label: "Add Skills",
    value: "ADD"
  },
  {
    label: "Delete Skill",
    value: "DELETE"
  },
  {
    label: "Override Skills",
    value: "OVERRIDE"
  }
];

const mockReplaceTemplates = jest.fn();
const mockUpdateTemplates = jest.fn();
const mockRemoveTemplates = jest.fn();

const updateTemplates = getUpdateTemplates();

describe("<BulkUpdateDefaultSkills />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useSkillState.mockReturnValue({
      skills: adminState.skillContext.skills
    });
    setupMockedComponents({
      Dropdown,
      DefaultSkillSelector
    });
  });

  const renderComponent = selectedTemplates => {
    return render(
      <BulkUpdateDefaultSkills
        template={updateTemplates.UPDATE_DEFAULT_SKILLS}
        selectedTemplates={selectedTemplates || []}
        replaceTemplate={mockReplaceTemplates}
        updateTemplate={mockUpdateTemplates}
        removeTemplate={mockRemoveTemplates}
      />
    );
  };

  describe("initial render", () => {
    describe("component is rendered as expected", () => {
      test("should render options in default state", () => {
        renderComponent([]);
        expect(Dropdown.mock.calls[0][0].options).toStrictEqual(dropdownOptions);
        expect(Dropdown.mock.calls[0][0].value.toString()).toBe("");
      });
    });
    describe("Options dropdown is updated to ADD SKILL", () => {
      test("DefaultSkillSelector is rendered", () => {
        renderComponent([]);
        expect(Dropdown.mock.calls.length).toBe(2);
        expect(Dropdown.mock.calls[0][0].value).toBe("");
        const onOptionChange = Dropdown.mock.calls[0][0].updateValue;
        act(() => onOptionChange(null, dropdownOptions[0]));
        expect(Dropdown.mock.calls.length).toBe(3);
        expect(Dropdown.mock.calls[1][0].value).toBe("");
        expect(Dropdown.mock.calls[2][0].value).toBe("Add Skills");
        expect(DefaultSkillSelector.mock.calls[0][0].defaultSkills).toStrictEqual({
          levels: {},
          skills: []
        });
      });
      describe("skills are selected from DefaultSkillSelector", () => {
        const selectedSkill = {
          skills: ["skillz"],
          levels: {}
        };
        describe("template is not already in the selected templates list", () => {
          test("replace template is called", () => {
            renderComponent([]);
            expect(Dropdown.mock.calls.length).toBe(2);
            expect(Dropdown.mock.calls[0][0].value).toBe("");
            const onOptionChange = Dropdown.mock.calls[0][0].updateValue;
            act(() => onOptionChange(null, dropdownOptions[0]));
            const setDefaultSkills = DefaultSkillSelector.mock.calls[0][0].setDefaultSkills;
            act(() => { setDefaultSkills(selectedSkill); });
            expect(mockReplaceTemplates).toHaveBeenCalledTimes(1);
            expect(mockReplaceTemplates).toHaveBeenCalledWith({
              ...updateTemplates.UPDATE_DEFAULT_SKILLS,
              data: {
                key: "default_skills",
                value: selectedSkill,
                option: dropdownOptions[0]
              }
            });
            expect(mockUpdateTemplates).toHaveBeenCalledTimes(0);
            expect(mockRemoveTemplates).toHaveBeenCalledTimes(0);
          });
        });
        describe("template is already in the selected templates list", () => {
          test("updateTemplate function is called", () => {
            const selectedTemplate = { ...updateTemplates.UPDATE_DEFAULT_SKILLS };
            renderComponent([selectedTemplate]);
            expect(Dropdown.mock.calls.length).toBe(1);
            expect(Dropdown.mock.calls[0][0].value).toBe("");
            const onOptionChange = Dropdown.mock.calls[0][0].updateValue;
            act(() => onOptionChange(null, dropdownOptions[0]));
            const setDefaultSkills = DefaultSkillSelector.mock.calls[0][0].setDefaultSkills;
            act(() => { setDefaultSkills(selectedSkill); });
            expect(mockUpdateTemplates).toHaveBeenCalledTimes(1);
            expect(mockUpdateTemplates).toHaveBeenCalledWith(selectedTemplate, {
              key: "default_skills",
              value: selectedSkill,
              option: dropdownOptions[0]
            });
            expect(mockReplaceTemplates).toHaveBeenCalledTimes(0);
            expect(mockRemoveTemplates).toHaveBeenCalledTimes(2);
          });
        });
      });
    });
    describe("Options dropdown is updated to DELETE SKILL", () => {
      test("Single select dropdown is rendered", () => {
        renderComponent([]);
        expect(Dropdown.mock.calls.length).toBe(2);
        expect(Dropdown.mock.calls[0][0].value).toBe("");
        const onOptionChange = Dropdown.mock.calls[0][0].updateValue;
        act(() => onOptionChange(null, dropdownOptions[1]));
        expect(Dropdown.mock.calls.length).toBe(4);
        expect(Dropdown.mock.calls[1][0].value).toBe("");
        expect(Dropdown.mock.calls[2][0].value).toBe("Delete Skill");
        expect(Dropdown.mock.calls[3][0].options.toString()).toBe([
          {
            label: "skillz",
            value: "skillz"
          },
          {
            label: "noLevelsHere",
            value: "noLevelsHere"
          }
        ].toString());
      });
      describe("skills are selected from Dropdown", () => {
        const selectedSkill = {
          skills: ["skillz"],
          levels: {}
        };
        describe("template is not already in the selected templates list", () => {
          test("replace template is called", () => {
            renderComponent([]);
            expect(Dropdown.mock.calls.length).toBe(2);
            expect(Dropdown.mock.calls[0][0].value).toBe("");
            const onOptionChange = Dropdown.mock.calls[0][0].updateValue;
            act(() => onOptionChange(null, dropdownOptions[1]));
            const setSkillToDelete = Dropdown.mock.calls[3][0].updateValue;
            act(() => { setSkillToDelete(null, { value: "skillz" }); });
            expect(mockReplaceTemplates).toHaveBeenCalledTimes(1);
            expect(mockReplaceTemplates).toHaveBeenCalledWith({
              ...updateTemplates.UPDATE_DEFAULT_SKILLS,
              data: {
                key: "default_skills",
                value: selectedSkill,
                option: dropdownOptions[1]
              }
            });
            expect(mockUpdateTemplates).toHaveBeenCalledTimes(0);
            expect(mockRemoveTemplates).toHaveBeenCalledTimes(0);
          });
        });
        describe("template is already in the selected templates list", () => {
          test("updateTemplate function is called", () => {
            const selectedTemplate = { ...updateTemplates.UPDATE_DEFAULT_SKILLS };
            renderComponent([selectedTemplate]);
            expect(Dropdown.mock.calls.length).toBe(1);
            expect(Dropdown.mock.calls[0][0].value).toBe("");
            const onOptionChange = Dropdown.mock.calls[0][0].updateValue;
            act(() => onOptionChange(null, dropdownOptions[1]));
            const setSkillToDelete = Dropdown.mock.calls[2][0].updateValue;
            act(() => { setSkillToDelete(null, { value: "skillz" }); });
            expect(mockUpdateTemplates).toHaveBeenCalledTimes(1);
            expect(mockUpdateTemplates).toHaveBeenCalledWith(selectedTemplate, {
              key: "default_skills",
              value: selectedSkill,
              option: dropdownOptions[1]
            });
            expect(mockReplaceTemplates).toHaveBeenCalledTimes(0);
            expect(mockRemoveTemplates).toHaveBeenCalledTimes(2);
          });
        });
      });
    });
    describe("Options dropdown is updated to OVERRIDE SKILL", () => {
      test("DefaultSkillSelector is rendered", () => {
        renderComponent([]);
        expect(Dropdown.mock.calls.length).toBe(2);
        expect(Dropdown.mock.calls[0][0].value).toBe("");
        const onOptionChange = Dropdown.mock.calls[0][0].updateValue;
        act(() => onOptionChange(null, dropdownOptions[2]));
        expect(Dropdown.mock.calls.length).toBe(3);
        expect(Dropdown.mock.calls[1][0].value).toBe("");
        expect(Dropdown.mock.calls[2][0].value).toBe("Override Skills");
        expect(DefaultSkillSelector.mock.calls[0][0].defaultSkills).toStrictEqual({
          levels: {},
          skills: []
        });
      });
      describe("skills are selected from DefaultSkillSelector", () => {
        const selectedSkill = {
          skills: ["skillz"],
          levels: {}
        };
        describe("template is not already in the selected templates list", () => {
          test("replace template is called", () => {
            renderComponent([]);
            expect(Dropdown.mock.calls.length).toBe(2);
            expect(Dropdown.mock.calls[0][0].value).toBe("");
            const onOptionChange = Dropdown.mock.calls[0][0].updateValue;
            act(() => onOptionChange(null, dropdownOptions[2]));
            const setDefaultSkills = DefaultSkillSelector.mock.calls[0][0].setDefaultSkills;
            act(() => { setDefaultSkills(selectedSkill); });
            expect(mockReplaceTemplates).toHaveBeenCalledTimes(1);
            expect(mockReplaceTemplates).toHaveBeenCalledWith({
              ...updateTemplates.UPDATE_DEFAULT_SKILLS,
              data: {
                key: "default_skills",
                value: selectedSkill,
                option: dropdownOptions[2]
              }
            });
            expect(mockUpdateTemplates).toHaveBeenCalledTimes(0);
            expect(mockRemoveTemplates).toHaveBeenCalledTimes(0);
          });
        });
        describe("template is already in the selected templates list", () => {
          test("updateTemplate function is called", () => {
            const selectedTemplate = { ...updateTemplates.UPDATE_DEFAULT_SKILLS };
            renderComponent([selectedTemplate]);
            expect(Dropdown.mock.calls.length).toBe(1);
            expect(Dropdown.mock.calls[0][0].value).toBe("");
            const onOptionChange = Dropdown.mock.calls[0][0].updateValue;
            act(() => onOptionChange(null, dropdownOptions[2]));
            const setDefaultSkills = DefaultSkillSelector.mock.calls[0][0].setDefaultSkills;
            act(() => { setDefaultSkills(selectedSkill); });
            expect(mockUpdateTemplates).toHaveBeenCalledTimes(1);
            expect(mockUpdateTemplates).toHaveBeenCalledWith(selectedTemplate, {
              key: "default_skills",
              value: selectedSkill,
              option: dropdownOptions[2]
            });
            expect(mockReplaceTemplates).toHaveBeenCalledTimes(0);
            expect(mockRemoveTemplates).toHaveBeenCalledTimes(2);
          });
        });
      });
    });
  });
});