import DefaultSkillSelector from "../DefaultSkillSelector";
import {
  Add,
  Delete
} from "@mui/icons-material";
import {
  PriorityDropDownButts,
  SkillDropdown
} from "components";
import { useAdminState } from "context";
import React from "react";
import { act } from "react-dom/test-utils";
import {
  expectMockedComponent,
  expectOnlyPassedProps,
  getMockedComponentProps,
  fireEvent,
  render,
  initialTestState as initialState,
  setupMockedComponents
} from "testUtils";
import { theme } from "globals";
import { ThemeProvider } from "styled-components";

jest.mock("@mui/icons-material", () => ({
  __esModule: true,
  Add: jest.fn(),
  Delete: jest.fn()
}));

jest.mock("components", () => ({
  __esModule: true,
  PriorityDropDownButts: jest.fn(),
  SkillDropdown: jest.fn()
}));

jest.mock("context", () => ({
  useAdminState: jest.fn()
}));

const mockSetDefaultSkills = jest.fn();

const initialTestState = {
  ...initialState,
  skillContext: {
    skills: [
      {
        name: "skillA",
        levels: []
      },
      {
        name: "skillB",
        levels: [ 1, 2, 3, 4 ]
      },
      {
        name: "skillC",
        levels: [ 0, 1, 2, 3, 4, 5, 6, 7 ]
      },
      {
        name: "skillD",
        levels: []
      }
    ]
  }
};

const getAddSkillButton = rendered => rendered.getByTestId("add-skill-button");
const getDeleteSkillButton = (rendered, instance) => rendered.getAllByTestId("delete-skill-button")[instance];

describe("<DefaultSkillSelector />", () => {
  const renderComponent = defaultSkills => render(
    <ThemeProvider theme={theme}>
      <DefaultSkillSelector defaultSkills={defaultSkills} setDefaultSkills={mockSetDefaultSkills} />
    </ThemeProvider>
  );
  beforeEach(() => {
    useAdminState.mockReturnValue(initialTestState);
    setupMockedComponents({
      Add,
      Delete,
      PriorityDropDownButts,
      SkillDropdown
    });
    mockSetDefaultSkills.mockClear();
  });

  describe("initial state", () => {
    describe("worker has no default skills", () => {
      test("should render header and correct components with correct props; should not render PriorityDropDownButts", () => {
        const defaultSkills = {
          skills: [],
          levels: {}
        };
        const rendered = renderComponent(defaultSkills);
        expectMockedComponent(rendered, { SkillDropdown });
        expectMockedComponent(rendered, { Add });
        expectMockedComponent(rendered, { PriorityDropDownButts }, 0);
        expectOnlyPassedProps(SkillDropdown, {
          skills: initialTestState.skillContext.skills
        });
      });
    });
    describe("worker has a default skill with priorities", () => {
      const defaultSkills = {
        skills: [ "skillB" ],
        levels: { "skillB": 3 }
      };
      test("should render the skill drop down, the priority drop down (with current priority displayed), and remove icon", () => {
        const rendered = renderComponent(defaultSkills);
        expectMockedComponent(rendered, { SkillDropdown });
        expectMockedComponent(rendered, { Add });
        expect(rendered.container).toHaveTextContent("skillB");
        expect(rendered.container).not.toHaveTextContent("skillA");
        expect(rendered.container).not.toHaveTextContent("skillC");
        expect(rendered.container).not.toHaveTextContent("skillD");
        expectMockedComponent(rendered, { PriorityDropDownButts });
        expectOnlyPassedProps(PriorityDropDownButts, {
          availablePriorities: [ 1, 2, 3, 4 ]
        });
        expectMockedComponent(rendered, { Delete });
      });
    });
    describe("worker has a default skill without priorities", () => {
      const defaultSkills = {
        skills: [ "skillA" ],
        levels: {}
      };
      test("should render the skill and remove icon but not the priority drop down", () => {
        const rendered = renderComponent(defaultSkills);
        expectMockedComponent(rendered, { SkillDropdown });
        expectMockedComponent(rendered, { Add });
        expect(rendered.container).toHaveTextContent("skillA");
        expect(rendered.container).not.toHaveTextContent("skillB");
        expect(rendered.container).not.toHaveTextContent("skillC");
        expect(rendered.container).not.toHaveTextContent("skillD");
        expectMockedComponent(rendered, { PriorityDropDownButts }, 0);
        expectMockedComponent(rendered, { Delete });
      });
    });
  });

  describe("changes made to the add skill drop down", () => {
    describe("new skill is selected that has priorities", () => {
      test("should render priority drop down with correct priority options; add button should appear disabled until a priority is selected;"
      + "when add skill button is clicked, should add a row with the skill name, priority drop down, and remove icon and"
      + "should update defaultSkills", () => {
        const defaultSkills = {
          skills: [ "skillA" ],
          levels: {}
        };
        const rendered = renderComponent(defaultSkills);
        expect(rendered.container).not.toHaveTextContent("skillC");
        act(() => {
          const { updateSkill } = getMockedComponentProps(SkillDropdown);
          updateSkill({ value: "skillC" } );
        });
        act(() => {
          fireEvent.click(getAddSkillButton(rendered));
        });
        expect(mockSetDefaultSkills).toHaveBeenCalledTimes(0);
        expectMockedComponent(rendered, { PriorityDropDownButts });
        expectOnlyPassedProps(PriorityDropDownButts, {
          availablePriorities: [ 0, 1, 2, 3, 4, 5, 6, 7 ]
        });
        expectMockedComponent(rendered, { Add });
        act(() => {
          const { updatePriority } = getMockedComponentProps(PriorityDropDownButts);
          updatePriority(6);
        });
        act(() => {
          fireEvent.click(getAddSkillButton(rendered));
        });
        expect(rendered.container).toHaveTextContent("skillA");
        expect(rendered.container).toHaveTextContent("skillC");
        expectOnlyPassedProps(PriorityDropDownButts, {
          availablePriorities: [ 0, 1, 2, 3, 4, 5, 6, 7 ],
          priorityValue: 6
        });
        expectMockedComponent(rendered, { Delete }, 2);
        expect(mockSetDefaultSkills).toHaveBeenCalledWith({
          skills: [ "skillA", "skillC" ],
          levels: { skillC: 6 }
        });
      });
    });
    describe("new skill is selected that does not have priorities", () => {
      test("should not render priority drop down; add button should be enabled; when add skill button is clicked,"
      + "should add a row with the skill name, priority drop down, and remove icon and"
      + "should update defaultSkills", () => {
        const defaultSkills = {
          skills: [ "skillA" ],
          levels: {}
        };
        const rendered = renderComponent(defaultSkills);
        act(() => {
          const updateSkill = SkillDropdown.mock.calls[0][0].updateSkill;
          updateSkill({ value: "skillD" });
        });
        act(() => {
          fireEvent.click(getAddSkillButton(rendered));
        });
        expect(rendered.container).toHaveTextContent("skillA");
        expect(rendered.container).toHaveTextContent("skillD");
        expectMockedComponent(rendered, { PriorityDropDownButts }, 0);
        expectMockedComponent(rendered, { Delete }, 2);
        expect(mockSetDefaultSkills).toHaveBeenCalledWith({
          skills: [ "skillA", "skillD" ],
          levels: {}
        });
      });
    });
  });

  describe("remove button", () => {
    test("should display once for each skill in defaultSkills; when clicked, skill should be removed", () => {
      const defaultSkills = {
        skills: [ "skillA", "skillB" ],
        levels: { skillB: 3 }
      };
      const rendered = renderComponent(defaultSkills);
      expectMockedComponent(rendered, { Delete }, 2);
      act(() => {
        fireEvent.click(getDeleteSkillButton(rendered, 1));
      });
      expect(mockSetDefaultSkills).toHaveBeenCalledWith({
        skills: [ "skillA" ],
        levels: {}
      });
    });
  });

  describe("change made to priority level of existing skill", () => {
    test("should update priority", () => {
      const defaultSkills = {
        skills: [ "skillB" ],
        levels: { skillB: 1 }
      };
      renderComponent(defaultSkills);
      act(() => {
        const updatePriority = PriorityDropDownButts.mock.calls[0][0].updatePriority;
        updatePriority(2);
      });
      expect(mockSetDefaultSkills).toHaveBeenCalledWith({
        skills: [ "skillB" ],
        levels: { skillB: 2 }
      });
    });
  });
});