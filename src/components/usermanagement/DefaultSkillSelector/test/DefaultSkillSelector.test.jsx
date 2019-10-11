import DefaultSkillSelector from "../DefaultSkillSelector";
import {
  PriorityDropDown,
  SkillDropDown,
  DefaultPriorityDropDown
} from "components";
import { initialState } from "context";
import React from "react";
// import { act } from "react-dom/test-utils";
import {
  // expectMockedComponent,
  // expectOnlyPassedProps,
  render,
  setupMockedComponents
} from "testUtils";

jest.mock("components", () => ({
  __esModule: true,
  PriorityDropDown: jest.fn(),
  SkillDropDown: jest.fn(),
  DefaultPriorityDropDown: jest.fn()
}));

const initialTestState = {
  ...initialState,
  skillsContext: {
    skills: [
      {
        minimum: null,
        multivalue: false,
        name: "grscollections-l1",
        maximum: null
      },
      {
        minimum: 0,
        multivalue: true,
        name: "test",
        maximum: 3
      },
      {
        minimum: 1,
        multivalue: true,
        name: "sbscFarm",
        maximum: 3
      },
      {
        minimum: 1,
        multivalue: true,
        name: "bscCbsHelpDesk",
        maximum: 3
      }
    ]
  }
};

describe("<DefaultSkillSelector />", () => {
  const defaultSkills = {
    skills: ["psu-l1", "psu-l2", "466"],
    levels: {
      "psu-l1": 3,
      "psu-l2": 4
    }
  };

  const renderComponent = () => render(<DefaultSkillSelector defaultSkills={defaultSkills} />, initialTestState);
  beforeEach(() => {
    setupMockedComponents({
      PriorityDropDown,
      SkillDropDown,
      DefaultPriorityDropDown
    });
  });

  describe("initial state", () => {
    describe("worker has no default skills", () => {
      test("should render header and correct components with correct props; should not render PriorityDropDown", () => {
        // SkillDropDown, AddCircleOutlineRounded (disabled)
        const rendered = renderComponent();
        expect(rendered.container).toHaveTextContent("Default Profile");
      });
    });
    describe("worker has default skills", () => {
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