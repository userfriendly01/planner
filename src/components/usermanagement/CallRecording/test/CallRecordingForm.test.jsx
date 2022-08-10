import React from "react";
import CallRecordingForm from "../CallRecordingForm";
import CallRecordingScope from "../CallRecordingScope";
import { Dropdown } from "components";
import {
  useAdminState,
  useFormDispatch,
  useFormState
} from "context";
import { getCalabrioUser } from "services";
import {
  act,
  calabrioContext,
  expectOnlyPassedProps,
  initialFormState,
  initialTestState,
  render,
  setupMockedComponents,
  waitFor
} from "testUtils";
import { calabrioTimeZones } from "utils";


jest.mock("../CallRecordingScope", () => ({
  __esModule: true,
  default: jest.fn()
}));

jest.mock("components", () => ({
  Dropdown: jest.fn(),
  StyledButton: jest.fn()
}));

jest.mock("context", () => ({
  useAdminState: jest.fn(),
  useFormState: jest.fn(),
  useFormDispatch: jest.fn(),
  userFormActions: jest.requireActual("context").userFormActions
}));

const mockSetForm = jest.fn();
const twilioWorker = {
  sid: "WK12354345"
};

describe("CallRecordingForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAdminState.mockReturnValue(initialTestState);
    useFormDispatch.mockReturnValue(mockSetForm);
    setupMockedComponents({
      CallRecordingScope,
      Dropdown
    });
  });
  describe("User is being created", () => {
    describe("initial render", () => {
      const expectedPayload = {
        ...initialFormState.calabrioUser,
        scope: {
          groups: [
            {
              checked: false,
              groupId: 100,
              name: "Hawaii 50 Group",
              partial: false
            }, {
              checked: false,
              groupId: 200,
              name: "FNOL Group",
              partial: false
            },
            {
              checked: false,
              groupId: 300,
              name: "No Teams Group",
              partial: false
            }
          ],
          teams: [{
            checked: false,
            groupId: 101,
            name: "Hawaii Team 50",
            parentGroupId: 100
          }, {
            checked: false,
            groupId: 102,
            name: "Hawaii Specialty Team",
            parentGroupId: 100
          }, {
            checked: false,
            groupId: 201,
            name: "FNOL Team",
            parentGroupId: 200
          }]
        }
      };
      describe("groups length is 0 while groups > 0", () => {
        const form = {
          ...initialFormState,
          calabrioUser: {
            ...initialFormState.calabrioUser,
            scope: {
              groups: [],
              teams: [{
                name: "Team 1",
                id: 2
              }]
            }
          }
        };
        beforeEach(() => {
          useFormState.mockReturnValue(form);
        });
        test("setScopeOnNewUser is called", () => {
          render(<CallRecordingForm twilioWorker={twilioWorker} />);
          expect(mockSetForm).toBeCalledTimes(1);
          expect(mockSetForm).toBeCalledWith({
            type: "SET_CALABRIO_USER",
            payload: expectedPayload
          });
        });
      });
      describe("teams length is 0 while teams > 0", () => {
        const form = {
          ...initialFormState,
          calabrioUser: {
            ...initialFormState.calabrioUser,
            scope: {
              teams: [],
              groups: [{
                name: "Group 1",
                id: 2
              }]
            }
          }
        };
        beforeEach(() => {
          useFormState.mockReturnValue(form);
        });
        test("setScopeOnNewUser is called", () => {
          render(<CallRecordingForm twilioWorker={twilioWorker} />);
          expect(mockSetForm).toBeCalledTimes(1);
          expect(mockSetForm).toBeCalledWith({
            type: "SET_CALABRIO_USER",
            payload: expectedPayload
          });
        });
      });
      describe("groups and teams are both empty", () => {
        const form = {
          ...initialFormState,
          calabrioUser: {
            ...initialFormState.calabrioUser,
            scope: {
              groups: [],
              teams: []
            }
          }
        };
        beforeEach(() => {
          useFormState.mockReturnValue(form);
        });
        test("Form is rendered as expected", () => {
          render(<CallRecordingForm twilioWorker={twilioWorker} />);
          expect(Dropdown.mock.calls.length).toBe(3);
          expectOnlyPassedProps(Dropdown, {
            label: "Roles",
            multiple: true,
            options: calabrioContext.roles.map(role => {
              return {
                ...role,
                label: role.name,
                value: role.id
              };
            }),
            value: []
          }, 0);
          expectOnlyPassedProps(Dropdown, {
            label: "Team",
            options: calabrioContext.teams.map(team => {
              return {
                ...team,
                label: team.name,
                value: team.groupId
              };
            }),
            value: ""
          }, 1);
          expect(CallRecordingScope.mock.calls.length).toBe(1);
          expect(getCalabrioUser).toHaveBeenCalledTimes(0);
          expect(mockSetForm).toHaveBeenCalledTimes(1);
          expect(mockSetForm).toHaveBeenCalledWith({
            type: "SET_CALABRIO_USER",
            payload: {
              updated: false,
              roles: [],
              scope: {
                groups: [{
                  checked: false,
                  groupId: 100,
                  name: "Hawaii 50 Group",
                  partial: false
                }, {
                  checked: false,
                  groupId: 200,
                  name: "FNOL Group",
                  partial: false
                },
                {
                  checked: false,
                  groupId: 300,
                  name: "No Teams Group",
                  partial: false
                }],
                teams: [{
                  checked: false,
                  groupId: 101,
                  name: "Hawaii Team 50",
                  parentGroupId: 100
                }, {
                  checked: false,
                  groupId: 102,
                  name: "Hawaii Specialty Team",
                  parentGroupId: 100
                }, {
                  checked: false,
                  groupId: 201,
                  name: "FNOL Team",
                  parentGroupId: 200
                }]
              },
              team: null,
              timezone: {
                label: "EST",
                value: 173
              }
            }
          });
        });
      });
      describe("groups and teams are both length > 0", () => {
        const form = {
          ...initialFormState,
          calabrioUser: {
            ...initialFormState.calabrioUser,
            scope: {
              ...initialFormState.calabrioUser.scope,
              teams: [{
                name: "Team 1",
                id: 2
              }],
              groups: [{
                name: "Group 1",
                id: 2
              }]
            }
          }
        };
        beforeEach(() => {
          useFormState.mockReturnValue(form);
        });
        test("Form is rendered as expected", () => {
          render(<CallRecordingForm twilioWorker={twilioWorker} />);
          expect(Dropdown.mock.calls.length).toBe(3);
          expectOnlyPassedProps(Dropdown, {
            label: "Roles",
            multiple: true,
            options: calabrioContext.roles.map(role => {
              return {
                ...role,
                label: role.name,
                value: role.id
              };
            }),
            value: []
          }, 0);
          expectOnlyPassedProps(Dropdown, {
            label: "Team",
            options: calabrioContext.teams.map(team => {
              return {
                ...team,
                label: team.name,
                value: team.groupId
              };
            }),
            value: ""
          }, 1);
          expect(CallRecordingScope.mock.calls.length).toBe(1);
          expect(getCalabrioUser).toHaveBeenCalledTimes(0);
          expect(mockSetForm).toHaveBeenCalledTimes(0);
        });
      });
    });
    describe("Role Dropdown", () => {
      const form = {
        ...initialFormState,
        calabrioUser: {
          ...initialFormState.calabrioUser,
          scope: {
            ...initialFormState.calabrioUser.scope,
            teams: [{
              name: "Team 1",
              id: 2
            }],
            groups: [{
              name: "Group 1",
              id: 2
            }]
          }
        }
      };
      beforeEach(() => {
        useFormState.mockReturnValue(form);
      });
      describe("updateValue is called", () => {
        test("setForm is called with the appropriate params", () => {
          render(<CallRecordingForm twilioWorker={twilioWorker} />);
          expect(Dropdown.mock.calls.length).toBe(3);
          const updateRole = Dropdown.mock.calls[0][0].updateValue;
          act(() => {
            updateRole(null, [calabrioContext.roles[0], calabrioContext.roles[2]]);
          });
          expect(mockSetForm).toHaveBeenCalledTimes(1);
          expect(mockSetForm).toHaveBeenCalledWith({
            type: "SET_CALABRIO_ROLES",
            payload: [calabrioContext.roles[0], calabrioContext.roles[2]]
          });
        });
      });
    });
    describe("Team Dropdown", () => {
      const form = {
        ...initialFormState,
        manager: {
          value: {
            calabrio_team_ids: [102, 101]
          }
        }
      };
      beforeEach(() => {
        useFormState.mockReturnValue(form);
      });
      describe("manager's'calabrio teams is not null", () => {
        test("The dropdown should only show the managers teams", () => {
          render(<CallRecordingForm twilioWorker={twilioWorker} />);
          expect(Dropdown.mock.calls[1][0].label).toBe("Team");
          expect(Dropdown.mock.calls[1][0].options.length).toBe(2);
        });
      });
      describe("updateValue is called", () => {
        beforeEach(() => {
          useFormState.mockReturnValue(initialFormState);
        });
        test("setForm is called with the appropriate params", () => {
          render(<CallRecordingForm twilioWorker={twilioWorker} />);
          expect(Dropdown.mock.calls.length).toBe(3);
          expect(Dropdown.mock.calls[1][0].label).toBe("Team");
          expect(Dropdown.mock.calls[1][0].options.length).toBe(3);

          const updateTeam = Dropdown.mock.calls[1][0].updateValue;
          act(() => {
            updateTeam(null, calabrioContext.teams[0]);
          });
          expect(mockSetForm).toHaveBeenCalledTimes(1);
          expect(mockSetForm).toHaveBeenCalledWith({
            type: "SET_CALABRIO_TEAM",
            payload: calabrioContext.teams[0]
          });
        });
      });
    });
    describe("Timezone Dropdown", () => {
      const form = {
        ...initialFormState,
        calabrioUser: {
          ...initialFormState.calabrioUser,
          scope: {
            ...initialFormState.calabrioUser.scope,
            teams: [{
              name: "Team 1",
              id: 2
            }],
            groups: [{
              name: "Group 1",
              id: 2
            }]
          }
        }
      };
      beforeEach(() => {
        useFormState.mockReturnValue(form);
      });
      describe("updateValue is called", () => {
        test("setForm is called with the appropriate params", () => {
          render(<CallRecordingForm twilioWorker={twilioWorker} />);
          expect(Dropdown.mock.calls.length).toBe(3);
          expect(Dropdown.mock.calls[2][0].options).toBe(calabrioTimeZones);
          const updateTimeZone = Dropdown.mock.calls[2][0].updateValue;
          act(() => {
            updateTimeZone(null, calabrioTimeZones[1]);
          });
          expect(mockSetForm).toHaveBeenCalledTimes(1);
          expect(mockSetForm).toHaveBeenCalledWith({
            type: "SET_CALABRIO_TIMEZONE",
            payload: calabrioTimeZones[1]
          });
        });
      });
    });
  });

  describe("User is being updated", () => {
    describe("initial successful render", () => {
      const user = {
        groupId: 201,
        roles: [{
          id: 2,
          name: "Agent"
        }],
        scope: {
          groups: [200],
          teams: [201]
        }
      };
      const formState = {
        ...initialFormState,
        formMode: "update",
        nNumberFetchedUser: {
          email: "faith.Cuneo@libertymutual.com",
          firstName: "Faith",
          lastName: "Cuneo"
        }
      };
      beforeEach(() => {
        getCalabrioUser.mockResolvedValue({
          data: user
        });
        useFormState.mockReturnValue(formState);
      });
      test("Form is rendered as expected", async () => {
        render(<CallRecordingForm twilioWorker={twilioWorker} />);
        expect(Dropdown.mock.calls.length).toBe(3);
        expect(CallRecordingScope.mock.calls.length).toBe(1);
        expect(getCalabrioUser).toHaveBeenCalledTimes(1);
        expect(getCalabrioUser).toHaveBeenCalledWith(220);
        await waitFor(() => {
          expect(mockSetForm).toHaveBeenCalledTimes(2);
          expect(mockSetForm).toHaveBeenCalledWith({
            type: "SET_CALABRIO_USER",
            payload: {
              id: 220,
              roles: [{
                id: 2,
                name: "Agent"
              }],
              scope: {
                groups: [{
                  checked: false,
                  groupId: 100,
                  name: "Hawaii 50 Group",
                  partial: false
                }, {
                  checked: true,
                  groupId: 200,
                  name: "FNOL Group",
                  partial: false
                },
                {
                  checked: false,
                  groupId: 300,
                  name: "No Teams Group",
                  partial: false
                }],
                teams: [{
                  checked: false,
                  groupId: 101,
                  name: "Hawaii Team 50",
                  parentGroupId: 100
                }, {
                  checked: false,
                  groupId: 102,
                  name: "Hawaii Specialty Team",
                  parentGroupId: 100
                }, {
                  checked: true,
                  groupId: 201,
                  name: "FNOL Team",
                  parentGroupId: 200
                }]
              },
              team: {
                groupId: 201,
                name: "FNOL Team",
                parentGroupId: 200
              },
              timezone: {
                label: "EST",
                value: 173
              }
            }
          });
        });
      });
    });
    describe("worker was not found in Calabrio User state", () => {
      const formState = {
        ...initialFormState,
        calabrioUser: {
          ...initialFormState.calabrioUser,
          team: {
            value: 225,
            label: "Team 1"
          },
          roles: [],
          scope: {
            groups: [],
            teams: []
          }
        },
        formMode: "update",
        nNumberFetchedUser: {
          email: "Mike.Nieman@libertymutual.com",
          firstName: "Mike",
          lastName: "Nieman"
        }
      };
      beforeEach(() => {
        useFormState.mockReturnValue(formState);
      });
      test("Form is rendered as expected", async () => {
        render(<CallRecordingForm twilioWorker={twilioWorker} />);
        expect(Dropdown.mock.calls.length).toBe(3);
        expect(CallRecordingScope.mock.calls.length).toBe(1);
        expect(getCalabrioUser).toHaveBeenCalledTimes(0);
        expect(mockSetForm).toHaveBeenCalledTimes(2);
        expect(console.warn).toHaveBeenCalledWith("No user was found in Calabrio with this email");
      });
    });
    describe("Worker was found in Calabrio User state but failed to fetch user", () => {
      const formState = {
        ...initialFormState,
        calabrioUser: {
          team: {
            value: 225,
            label: "Team 1"
          },
          roles: [],
          scope: {
            groups: [],
            teams: []
          }
        },
        formMode: "update",
        nNumberFetchedUser: {
          email: "faith.Cuneo@libertymutual.com",
          firstName: "Faith",
          lastName: "Cuneo"
        }
      };
      beforeEach(() => {
        getCalabrioUser.mockRejectedValue({ aww: "boo" });
        useFormState.mockReturnValue(formState);
      });
      test("Form is rendered as expected", async () => {
        render(<CallRecordingForm twilioWorker={twilioWorker} />);
        expect(Dropdown.mock.calls.length).toBe(3);
        expect(CallRecordingScope.mock.calls.length).toBe(1);
        expect(getCalabrioUser).toHaveBeenCalledTimes(1);
        expect(getCalabrioUser).toHaveBeenCalledWith(220);
        expect(mockSetForm).toHaveBeenCalledTimes(2);
        await waitFor(() => {
          //Mocking issue to fix
          // expect(console.error.mock.calls.length).toBe(1);
        });
      });
    });
  });
});
