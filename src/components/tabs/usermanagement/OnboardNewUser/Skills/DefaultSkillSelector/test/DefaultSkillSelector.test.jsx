import { DefaultSkillSelector } from "../DefaultSkillSelector";
import {
  Add,
  Delete
} from "@mui/icons-material";
import { SkillsList } from "usermanagement/SkillsList";
import { SkillLevels } from "usermanagement/SkillLevels";
import {
  useSkillState
} from "context/appContext";
import React from "react";
import {
  act,
  waitFor,
  expectMockedComponent,
  expectOnlyPassedProps,
  getMockedComponentProps,
  fireEvent,
  render,
  setupMockedComponents
} from "testUtils";
import { theme } from "globals/theme";
import { ThemeProvider } from "styled-components";

jest.mock("@mui/icons-material", () => ({
  Add: jest.fn(),
  Delete: jest.fn()
}));

jest.mock("usermanagement/SkillLevels", () => ({
  SkillLevels: jest.fn()
}));

jest.mock("usermanagement/SkillsList", () => ({
  SkillsList: jest.fn()
}));

jest.mock("context/appContext", () => ({
  useSkillState: jest.fn()
}));

const mockSetDefaultSkills = jest.fn();

const skills = [
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
];
const skillGroups = [
  {
    skillGroupId: 1,
    skill_group_name: "skillGroupA",
    skills: [
      {
        name: "skillA",
        levels: []
      },
      {
        name: "skillB",
        levels: [ 1, 2, 3, 4 ]
      }
    ]
  }
];

const getAddSkillButton = rendered => rendered.getByTestId("add-skill-button");
const getDeleteSkillButton = (rendered, instance) => rendered.getAllByTestId("delete-skill-button")[instance];

describe("<DefaultSkillSelector />", () => {
  const renderComponent = defaultSkills => render(
    <ThemeProvider theme={theme}>
      <DefaultSkillSelector defaultSkills={defaultSkills} setDefaultSkills={mockSetDefaultSkills} />
    </ThemeProvider>
  );
  beforeEach(() => {
    useSkillState.mockReturnValue({
      skills,
      skillGroups
    });
    setupMockedComponents({
      Add,
      Delete,
      SkillLevels,
      SkillsList
    });
    mockSetDefaultSkills.mockClear();
  });

  describe("initial state", () => {
    describe("worker has no default skills", () => {
      //Kaleigh Halp
      test.only("should render header and correct components with correct props; should not render SkillLevels", () => {
        const defaultSkills = {
          skills: [],
          levels: {}
        };
        const rendered = renderComponent(defaultSkills);
        expectMockedComponent(rendered, { SkillsList });
        expectMockedComponent(rendered, { Add });
        expectMockedComponent(rendered, { SkillLevels }, 0);
        expectOnlyPassedProps(SkillsList, {
          skills,
          skillGroups
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
        expectMockedComponent(rendered, { SkillsList });
        expectMockedComponent(rendered, { Add });
        expect(rendered.container).toHaveTextContent("skillB");
        expect(rendered.container).not.toHaveTextContent("skillA");
        expect(rendered.container).not.toHaveTextContent("skillC");
        expect(rendered.container).not.toHaveTextContent("skillD");
        expectMockedComponent(rendered, { SkillLevels });
        expectOnlyPassedProps(SkillLevels, {
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
        expectMockedComponent(rendered, { SkillsList });
        expectMockedComponent(rendered, { Add });
        expect(rendered.container).toHaveTextContent("skillA");
        expect(rendered.container).not.toHaveTextContent("skillB");
        expect(rendered.container).not.toHaveTextContent("skillC");
        expect(rendered.container).not.toHaveTextContent("skillD");
        expectMockedComponent(rendered, { SkillLevels }, 0);
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
          const { updateSkill } = getMockedComponentProps(SkillsList);
          updateSkill({ value: "skillC" } );
        });
        act(() => {
          fireEvent.click(getAddSkillButton(rendered));
        });
        expect(mockSetDefaultSkills).toHaveBeenCalledTimes(0);
        expectMockedComponent(rendered, { SkillLevels });
        expectOnlyPassedProps(SkillLevels, {
          availablePriorities: [ 0, 1, 2, 3, 4, 5, 6, 7 ]
        });
        expectMockedComponent(rendered, { Add });
        act(() => {
          const { updatePriority } = getMockedComponentProps(SkillLevels);
          updatePriority(6);
        });
        act(() => {
          fireEvent.click(getAddSkillButton(rendered));
        });
        expect(rendered.container).toHaveTextContent("skillA");
        expect(rendered.container).toHaveTextContent("skillC");
        expectOnlyPassedProps(SkillLevels, {
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
          const updateSkill = SkillsList.mock.calls[0][0].updateSkill;
          updateSkill({ value: "skillD" });
        });
        act(() => {
          fireEvent.click(getAddSkillButton(rendered));
        });
        expect(rendered.container).toHaveTextContent("skillA");
        expect(rendered.container).toHaveTextContent("skillD");
        expectMockedComponent(rendered, { SkillLevels }, 0);
        expectMockedComponent(rendered, { Delete }, 2);
        expect(mockSetDefaultSkills).toHaveBeenCalledWith({
          skills: [ "skillA", "skillD" ],
          levels: {}
        });
      });
    });
    describe("new skill group is selected", () => {
      test(`should not render priority dropdown, add button enabled, 
        should add rows for each skill within skill group when add is clicked with priority dropdown defaulted to 1
        and remove button and should update default skills`, () => {
        const defaultSkills = {
          skills: [],
          levels: {}
        };
        const rendered = renderComponent(defaultSkills);
        act(() => {
          const updateSkill = SkillsList.mock.calls[0][0].updateSkill;
          updateSkill({
            label: "skillGroupA",
            value: 1,
            isSkillGroup: true,
            skills: skillGroups[0].skills
          });
        });
        act(() => {
          fireEvent.click(getAddSkillButton(rendered));
        });
        expect(rendered.container).toHaveTextContent("skillA");
        expect(rendered.container).toHaveTextContent("skillB");
        expectOnlyPassedProps(SkillLevels, {
          availablePriorities: [ 1, 2, 3, 4 ],
          priorityValue: 1
        });
        expectMockedComponent(rendered, { Delete }, 2);
        expect(mockSetDefaultSkills).toHaveBeenCalledWith({
          skills: [ "skillA", "skillB" ],
          levels: { "skillB": 1 }
        });
      });
      test(`should not render priority dropdown, add button enabled, 
      should add rows for each skill (but should not add a duplicate) within skill group when add is clicked with priority dropdown defaulted to 1
      and remove button and should update default skills`, async () => {
        const defaultSkills = {
          skills: ["skillA"],
          levels: {}
        };
        const rendered = renderComponent(defaultSkills);
        const updateSkill = SkillsList.mock.calls[0][0].updateSkill;
        updateSkill({
          label: "skillGroupA",
          value: 1,
          isSkillGroup: true,
          skills: skillGroups[0].skills
        });
        fireEvent.click(getAddSkillButton(rendered));
        expect(rendered.container).toHaveTextContent("skillA");
        await waitFor(() => expect(rendered.container).toHaveTextContent("skillB"));
        expectOnlyPassedProps(SkillLevels, {
          availablePriorities: [ 1, 2, 3, 4 ],
          priorityValue: 1
        });
        expectMockedComponent(rendered, { Delete }, 2);
        expect(mockSetDefaultSkills).toHaveBeenCalledWith({
          skills: [ "skillA", "skillB" ],
          levels: { "skillB": 1 }
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
        const updatePriority = SkillLevels.mock.calls[0][0].updatePriority;
        updatePriority(2);
      });
      expect(mockSetDefaultSkills).toHaveBeenCalledWith({
        skills: [ "skillB" ],
        levels: { skillB: 2 }
      });
    });
  });
});