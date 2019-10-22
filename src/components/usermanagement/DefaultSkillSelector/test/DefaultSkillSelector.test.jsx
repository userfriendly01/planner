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
const taskrouterSkills = initialTestState.skillContext.taskrouterSkills;

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
          taskrouterSkills
        });
      });
    });
    describe("worker has a default skill with priorities", () => {
      const defaultSkills = {
        skills: [ "skillB" ],
        levels: { "skillB": 3 }
      };
      describe("skill has priorities", () => {
        test("should render the skill drop down, the priority drop down (with current priority displayed), and remove icon", () => {
          const rendered = renderComponent(defaultSkills);
          expect(rendered.container).toHaveTextContent("Default Profile");
          expectMockedComponent(rendered, { SkillDropDown });
          expectMockedComponent(rendered, { AddCircleOutlineRounded });
          expect(rendered.container).toHaveTextContent("skillB");
          expectMockedComponent(rendered, { PriorityDropDown });
          expectOnlyPassedProps(PriorityDropDown, {
            availablePriorities: [1, 2, 3, 4]
          });
          expectMockedComponent(rendered, { DeleteRounded });
        });
      });
      describe("skill does not have priorities", () => {
        const defaultSkills = {
          skills: [ "skillA" ],
          levels: {}
        };
        test("should render the skill and remove icon but not the priority drop down", () => {
          const rendered = renderComponent(defaultSkills);
          expect(rendered.container).toHaveTextContent("Default Profile");
          expectMockedComponent(rendered, { SkillDropDown });
          expectMockedComponent(rendered, { AddCircleOutlineRounded });
          expect(rendered.container).toHaveTextContent("skillA");
          expectMockedComponent(rendered, { PriorityDropDown }, 0);
          expectMockedComponent(rendered, { DeleteRounded });
        });
      });
    });
  });

  describe("changes made to the add skill drop down", () => {
    // the test below tests that we start with a skill w/ no priorities
    // add a test where we start with priorities and expect priority drop down to render twice
    const defaultSkills = {
      skills: [ "skillA" ],
      levels: {}
    };
    describe("new skill is selected that has priorities", () => {
      test("should render priority drop down (with correct priority options); add button should appear disabled until a priority is selected", done => {
        const rendered = renderComponent(defaultSkills);
        act(() => {
          const updateSkill = SkillDropDown.mock.calls[0][0].updateSkill;
          updateSkill("skillC");
        });
        expectMockedComponent(rendered, { PriorityDropDown });
        expectOnlyPassedProps(PriorityDropDown, {
          availablePriorities: [0, 1, 2, 3, 4, 5, 6, 7 ]
        });
        expectMockedComponent(rendered, { AddCircleOutlineRounded });
        expectOnlyPassedProps(AddCircleOutlineRounded, { color: "disabled" });

        act(() => {
          const updatePriority = PriorityDropDown.mock.calls[0][0].updatePriority;
          updatePriority(6);
        });
        console.log("[1][0]", PriorityDropDown.mock.calls[1][0]);
        expectOnlyPassedProps(AddCircleOutlineRounded, { color: "inherit" });
        done();
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