import DefaultSkillSelector from "../DefaultSkillSelector";
import {
  AddCircleOutlineRounded,
  DeleteRounded
} from "@material-ui/icons";
import {
  PriorityDropDown,
  SkillDropDown
} from "components";
import { initialState } from "context";
import React from "react";
import { act } from "react-dom/test-utils";
import {
  expectMockedComponent,
  expectOnlyPassedProps,
  render,
  setupMockedComponents
} from "testUtils";

jest.mock("@material-ui/icons", () => ({
  __esModule: true,
  AddCircleOutlineRounded: jest.fn(),
  DeleteRounded: jest.fn()
}));

jest.mock("components", () => ({
  __esModule: true,
  PriorityDropDown: jest.fn(),
  SkillDropDown: jest.fn(),
  DefaultPriorityDropDown: jest.fn()
}));

const mockSetDefaultSkills = jest.fn();

const initialTestState = {
  ...initialState,
  skillContext: {
    taskrouterSkills: [
      {
        skill: "skillA",
        levels: []
      },
      {
        skill: "skillB",
        levels: [1, 2, 3, 4]
      },
      {
        skill: "skillC",
        levels: [0, 1, 2, 3, 4, 5, 6, 7]
      }
    ]
  }
};

describe("<DefaultSkillSelector />", () => {
  const renderComponent = defaultSkills => render(<DefaultSkillSelector defaultSkills={defaultSkills} setDefaultSkills={mockSetDefaultSkills} />, initialTestState);
  beforeEach(() => {
    setupMockedComponents({
      AddCircleOutlineRounded,
      DeleteRounded,
      PriorityDropDown,
      SkillDropDown
    });
    mockSetDefaultSkills.mockClear();
  });

  describe("initial state", () => {
    describe("worker has no default skills", () => {
      test("should render header and correct components with correct props; should not render PriorityDropDown", () => {
        const defaultSkills = {
          skills: [],
          levels: {}
        };
        const rendered = renderComponent(defaultSkills);
        expect(rendered.container).toHaveTextContent("Default Profile");
        expectMockedComponent(rendered, { SkillDropDown });
        expectMockedComponent(rendered, { AddCircleOutlineRounded });
        expectMockedComponent(rendered, { PriorityDropDown }, 0);
        expectOnlyPassedProps(SkillDropDown, {
          skillValue: "",
          taskrouterSkills: initialTestState.skillContext.taskrouterSkills
          // updateSkill: null
        });
      });
    });
    describe("worker has default skills", () => {
      // const defaultSkills = {
      //   skills: ["defaultSkillA", "defaultSkillB", "defaultSkillC"],
      //   levels: {
      //     "defaultSkillA": 3,
      //     "defaultSkillB": 4
      //   }
      // };
      describe("skill has priorities", () => {
        test("should render the skill, the priority drop down (with current priority displayed), and remove icon", () => {
          //
        });
      });
      describe("skill does not have priorities", () => {
        test("should render the skill and remove icon but not the priority drop down", () => {
          //
        });
      });
    });
  });

  describe("changes made to the add skill drop down", () => {
    describe("new skill is selected that has priorities", () => {
      test("should render priority drop down (with correct priority options) and add button should be enabled", () => {
        //
      });
      describe("add skill button is clicked", () => {
        test("should add a row with the skill name, priority drop down, and remove icon", () => {
          //
        });
      });
    });

    describe("new skill is selected that does not have priorities", () => {
      test("should not render priority drop down; add button should be enabled", () => {
        //
      });
      describe("add skill button is clicked", () => {
        test("should add a row with the skill name and remove icon", () => {
          //
        });
      });
    });
  });

});