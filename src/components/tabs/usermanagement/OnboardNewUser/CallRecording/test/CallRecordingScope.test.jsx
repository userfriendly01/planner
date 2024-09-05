import React from "react";
import { CallRecordingScope } from "usermanagement/CallRecordingScope";
import { StyledButton } from "components/StyledButton";
import {
  useFormState,
  useFormDispatch
} from "context/appContext";
import {
  Checkbox,
  TextField
} from "@mui/material";
import {
  act,
  calabrioContext,
  fireEvent,
  render,
  setupMockedComponents
} from "testUtils";
import { theme } from "globals/theme";
import { ThemeProvider } from "styled-components";

jest.mock("@mui/material", () => ({
  Checkbox: jest.fn(),
  TextField: jest.fn()
}));

jest.mock("components/StyledButton", () => ({
  StyledButton: jest.fn()
}));

jest.mock("context/appContext", () => ({
  useAdminState: jest.fn(),
  useFormState: jest.fn(),
  useFormDispatch: jest.fn()
}));

const mockSetForm = jest.fn();
const groups = calabrioContext.groups.map(g => {
  return {
    ...g,
    partial: false,
    checked: false
  };
});

const teams = calabrioContext.teams.map(g => {
  return {
    ...g,
    checked: false
  };
});

const renderComponent = (customGroups, customTeams) => {
  return render (
    <ThemeProvider theme={theme}>
      <CallRecordingScope
        calabrioUser={{
          scope: {
            groups: customGroups ? customGroups : groups,
            teams: customTeams ? customTeams : teams
          }
        }}
      />
    </ThemeProvider>
  );
};

describe("<CallRecordingScope", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useFormState.mockReturnValue({ formMode: "update" });
    useFormDispatch.mockReturnValue(mockSetForm);
    setupMockedComponents({
      Checkbox,
      TextField,
      StyledButton
    });
  });
  describe("initial render", () => {
    describe("groups.length === 0 && selectedGroup is null", () => {
      test("'Failed to load Calabrio Organization' should be displayed", () => {
        const rendered = renderComponent([]);
        expect(rendered.container).toHaveTextContent("Failed to load Calabrio Organization");
      });
    });
    describe("groups.length > 0", () => {
      test("setSelectedGroup and checkIfPartial was called for the first row", () => {
        const rendered = render(
          <ThemeProvider theme={theme}>
            <CallRecordingScope
              calabrioUser={{
                scope: {
                  groups: [
                    ...groups,
                    {
                      groupId: 300,
                      name: "Trigger Group",
                      checked: false,
                      partial: true
                    }
                  ],
                  teams
                }
              }}
              setForm={mockSetForm}
            />
          </ThemeProvider>
        );
        expect(rendered.getByTestId("group-row-100").selected).toBe(true);
        expect(rendered.getByTestId("group-row-200").selected).toBe(false);
        expect(mockSetForm).toBeCalledTimes(1);
        expect(mockSetForm).toBeCalledWith({
          type: "CHECK_CALABRIO_GROUP",
          payload: {
            boxType: "partial",
            "checked": false,
            "index": 3
          }
        });
      });
    });
    test("component renders as expected", () => {
      const rendered = renderComponent();
      const groupRows = [];
      const teamRows = [];
      groups.forEach(g => {
        if(rendered.queryByTestId(`group-row-${g.groupId}`)){
          groupRows.push(rendered.queryByTestId(`group-row-${g.groupId}`));
        }
      });
      teams.forEach(t => {
        if(rendered.queryByTestId(`team-row-${t.groupId}`)){
          teamRows.push(rendered.queryByTestId(`team-row-${t.groupId}`));
        }
      });
      expect(rendered.container).toHaveTextContent("Full Admin Access");
      expect(groupRows.length).toBe(3);
      expect(teamRows.length).toBe(2);
      expect(Checkbox.mock.calls.length).toBe(6);
    });
  });
  describe("checkIfParial", () => {
    describe("children teams do not exist", () => {
      test("partial should be false for the group", () => {
        const customGroups = [
          {
            ...groups[0]
          },
          {
            ...groups[1]
          },
          {
            ...groups[2],
            partial: true
          }
        ];
        renderComponent(customGroups);
        expect(mockSetForm).toBeCalledTimes(1);
        expect(mockSetForm).toBeCalledWith({
          type: "CHECK_CALABRIO_GROUP",
          payload: {
            boxType: "partial",
            checked: false,
            index: 2
          }
        });
      });
    });
    describe("no children teams are checked && the group is not checked", () => {
      test("partial should be false for the group", () => {
        const customGroups = [
          {
            ...groups[0]
          },
          {
            ...groups[1],
            partial: true
          },
          {
            ...groups[2]
          }
        ];
        renderComponent(customGroups);
        expect(mockSetForm).toBeCalledTimes(1);
        expect(mockSetForm).toBeCalledWith({
          type: "CHECK_CALABRIO_GROUP",
          payload: {
            boxType: "partial",
            checked: false,
            index: 1
          }
        });
      });
    });
    describe("no children teams are checked and the group is checked", () => {
      test("partial should be true for the group", () => {
        const customGroups = [
          {
            ...groups[0]
          },
          {
            ...groups[1],
            checked: true
          },
          {
            ...groups[2]
          }
        ];
        renderComponent(customGroups);
        expect(mockSetForm).toBeCalledTimes(1);
        expect(mockSetForm).toBeCalledWith({
          type: "CHECK_CALABRIO_GROUP",
          payload: {
            boxType: "partial",
            checked: true,
            index: 1
          }
        });
      });
    });
    describe("there are child teams checked && the group is not checked", () => {
      test("partial should be true for the group", () => {
        const customTeams = [
          {
            ...teams[0],
            checked: true
          },
          {
            ...teams[1]
          },
          {
            ...teams[2]
          }
        ];
        renderComponent(null, customTeams);
        expect(mockSetForm).toBeCalledTimes(1);
        expect(mockSetForm).toBeCalledWith({
          type: "CHECK_CALABRIO_GROUP",
          payload: {
            boxType: "partial",
            checked: true,
            index: 0
          }
        });
      });
    });
    describe("all the children teams are checked and the group is checked", () => {
      test("partial should be false for the group", () => {
        const customTeams = [
          {
            ...teams[0],
            checked: true
          },
          {
            ...teams[1],
            checked: true
          },
          {
            ...teams[2]
          }
        ];
        const customGroups = [
          {
            ...groups[0],
            checked: true,
            partial: true
          },
          {
            ...groups[1]
          },
          {
            ...groups[2]
          }
        ];
        renderComponent(customGroups, customTeams);
        expect(mockSetForm).toBeCalledTimes(1);
        expect(mockSetForm).toBeCalledWith({
          type: "CHECK_CALABRIO_GROUP",
          payload: {
            boxType: "partial",
            checked: false,
            index: 0
          }
        });
      });
    });
    describe("only some of the children teams are checked and the group is checked", () => {
      test("partial should be true for the group", () => {
        const customTeams = [
          {
            ...teams[0],
            checked: true
          },
          {
            ...teams[1]
          },
          {
            ...teams[2]
          }
        ];
        const customGroups = [
          {
            ...groups[0],
            checked: true,
            partial: false
          },
          {
            ...groups[1]
          },
          {
            ...groups[2]
          }
        ];
        renderComponent(customGroups, customTeams);
        expect(mockSetForm).toBeCalledTimes(1);
        expect(mockSetForm).toBeCalledWith({
          type: "CHECK_CALABRIO_GROUP",
          payload: {
            boxType: "partial",
            checked: true,
            index: 0
          }
        });
      });
    });
    describe("all the children teams are checked and the group is not checked", () => {
      test("partial should be true for the group", () => {
        const customTeams = [
          {
            ...teams[0],
            checked: true
          },
          {
            ...teams[1],
            checked: true
          },
          {
            ...teams[2]
          }
        ];
        const customGroups = [
          {
            ...groups[0],
            partial: false
          },
          {
            ...groups[1]
          },
          {
            ...groups[2]
          }
        ];
        renderComponent(customGroups, customTeams);
        expect(mockSetForm).toBeCalledTimes(1);
        expect(mockSetForm).toBeCalledWith({
          type: "CHECK_CALABRIO_GROUP",
          payload: {
            boxType: "partial",
            checked: true,
            index: 0
          }
        });
      });
    });
    describe("group is already false when logic indicates it should be false", () => {
      test("Should not call to update the form", () => {
        const customTeams = [
          {
            ...teams[0],
            checked: true
          },
          {
            ...teams[1],
            checked: true
          },
          {
            ...teams[2]
          }
        ];
        const customGroups = [
          {
            ...groups[0],
            checked: true,
            partial: false
          },
          {
            ...groups[1]
          },
          {
            ...groups[2]
          }
        ];
        renderComponent(customGroups, customTeams);
        expect(mockSetForm).toBeCalledTimes(0);
      });
    });
    describe("group is already true when logic indicates it should be true", () => {
      test("Should not call to update the form", () => {
        const customTeams = [
          {
            ...teams[0],
            checked: true
          },
          {
            ...teams[1],
            checked: true
          },
          {
            ...teams[2]
          }
        ];
        const customGroups = [
          {
            ...groups[0],
            partial: true
          },
          {
            ...groups[1]
          },
          {
            ...groups[2]
          }
        ];
        renderComponent(customGroups, customTeams);
        expect(mockSetForm).toBeCalledTimes(0);
      });
    });
  });
  describe("admin check box", () => {
    describe("admin box is checked", () => {
      test("all groups and teams are marked as checked", () => {
        const customTeams = [
          {
            ...teams[0],
            checked: true
          },
          {
            ...teams[1],
            checked: true
          },
          {
            ...teams[2],
            checked: true
          }
        ];
        const customGroups = [
          {
            ...groups[0],
            checked: true
          },
          {
            ...groups[1],
            checked: true
          },
          {
            ...groups[2],
            checked: true
          }
        ];
        renderComponent(customTeams, customGroups);
        expect(Checkbox.mock.calls[0][0]["data-testid"]).toBe("admin-checkbox");
        expect(Checkbox.mock.calls[0][0].checked).toBe(true);
      });
    });
    describe("admin box is unchecked", () => {
      test("all groups and teams are marked as unchecked", () => {
        renderComponent();
        expect(Checkbox.mock.calls[0][0]["data-testid"]).toBe("admin-checkbox");
        expect(Checkbox.mock.calls[0][0].checked).toBe(false);
        act(() => {
          Checkbox.mock.calls[0][0].onChange({
            target: {
              checked: true
            }
          });
        });
        expect(mockSetForm).toBeCalledTimes(10);
      });
    });
    describe("only some teams/groups are checked", () => {
      test("checkIfAdmin should return false", () => {
        const customTeams = [
          {
            ...teams[0]
          },
          {
            ...teams[1],
            checked: true
          },
          {
            ...teams[2],
            checked: true
          }
        ];
        const customGroups = [
          {
            ...groups[0],
            checked: true
          },
          {
            ...groups[1]
          },
          {
            ...groups[2],
            checked: true
          }
        ];
        renderComponent(customTeams, customGroups);
        expect(Checkbox.mock.calls[0][0]["data-testid"]).toBe("admin-checkbox");
        expect(Checkbox.mock.calls[0][0].checked).toBe(false);
      });
    });
  });
  describe("group is selected", () => {
    test("setSelectedGroup is run", () => {
      const rendered = renderComponent();
      expect(rendered.getByTestId("group-row-100").selected).toBe(true);
      expect(rendered.getByTestId("group-row-200").selected).toBe(false);
      act(() => {
        fireEvent.click(rendered.getByTestId("group-row-200"));
      });
      expect(rendered.getByTestId("group-row-200").selected).toBe(true);
      expect(rendered.getByTestId("group-row-100").selected).toBe(false);
    });
  });
  describe("group is checked", () => {
    describe("group has children", () => {
      test("handleCheckGroup and handleCheckTeam is run", () => {
        renderComponent();
        expect(mockSetForm).toBeCalledTimes(0);
        const checkbox = Checkbox.mock.calls.find(c => c[0]["data-testid"] === "group-checkbox-100")[0];
        expect(checkbox.checked).toBe(false);
        act(() => {
          checkbox.onChange({
            target: {
              checked: true
            }
          });
        });
        expect(mockSetForm).toBeCalledTimes(4);
      });
    });
    describe("group has no children", () => {
      test("handleCheckGroup is run", () => {
        renderComponent();
        expect(mockSetForm).toBeCalledTimes(0);
        const noTeamsCheckbox = Checkbox.mock.calls.find(c => c[0]["data-testid"] === "group-checkbox-300");
        const checkBox = noTeamsCheckbox[0].onChange;
        act(() => checkBox({
          target: {
            checked: true
          }
        }));
        expect(mockSetForm).toBeCalledTimes(2);
        expect(mockSetForm.mock.calls[0][0]).toStrictEqual(
          {
            payload: {
              boxType: "checked",
              checked: true,
              index: 2
            },
            type: "CHECK_CALABRIO_GROUP"
          }
        );
        expect(mockSetForm.mock.calls[1][0]).toStrictEqual(
          {
            payload: {
              boxType: "partial",
              checked: false,
              index: 2
            },
            type: "CHECK_CALABRIO_GROUP"
          }
        );
      });
    });
  });
  describe("team is checked", () => {
    test("handleCheckTeam is run", () => {
      renderComponent();
      expect(mockSetForm).toBeCalledTimes(0);
      const checkbox = Checkbox.mock.calls.find(c => c[0]["data-testid"] === "team-checkbox-102")[0];
      expect(checkbox.checked).toBe(false);
      act(() => {
        checkbox.onChange({
          target: {
            checked: true
          }
        });
      });
      expect(mockSetForm).toBeCalledTimes(1);
    });
  });
});
