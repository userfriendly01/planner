import React from "react";
import CallRecordingForm from "../CallRecordingForm";
import CallRecordingScope from "../CallRecordingScope";
import { Dropdown } from "components";
import {
  useAdminState,
  useFormState,
  useFormDispatch
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

jest.mock("../CallRecordingScope", () => ({
  __esModule: true,
  default: jest.fn()
}));

jest.mock("components", () => ({
  Dropdown: jest.fn(),
  StyledButton: jest.fn()
}));

jest.mock("services", () => ({
  getCalabrioUser: jest.fn()
}));

jest.mock("context", () => ({
  useAdminState: jest.fn(),
  useFormState: jest.fn(),
  useFormDispatch: jest.fn(),
  userFormActions: jest.requireActual("context").userFormActions
}));

const mockSetForm = jest.fn();

describe("CallRecordingForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAdminState.mockReturnValue(initialTestState);
    useFormState.mockReturnValue(initialFormState);
    useFormDispatch.mockReturnValue(mockSetForm);
    setupMockedComponents({
      CallRecordingScope,
      Dropdown
    });
  });
  describe("User is being created", () => {
    describe("initial render", () => {
      test("Form is rendered as expected", () => {
        render(<CallRecordingForm/>);
        expect(Dropdown.mock.calls.length).toBe(2);
        expectOnlyPassedProps(Dropdown, {
          label: "Roles",
          multiple: true,
          options: calabrioContext.roles.map(role => {
            return {
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
              label: team.name,
              value: team.groupId
            };
          }),
          value: null
        }, 1);
        expect(CallRecordingScope.mock.calls.length).toBe(1);
        expect(getCalabrioUser).toHaveBeenCalledTimes(0);
        expect(mockSetForm).toHaveBeenCalledTimes(1);
        expect(mockSetForm).toHaveBeenCalledWith({
          type: "SET_CALABRIO_USER",
          payload: {
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
            team: null
          }
        });
      });
    });
    describe("Role Dropdown", () => {
      describe("updateValue is called", () => {
        test("setForm is called with the appropriate params", () => {
          render(<CallRecordingForm/>);
          expect(Dropdown.mock.calls.length).toBe(2);
          const updateRole = Dropdown.mock.calls[0][0].updateValue;
          act(() => {
            updateRole(null, [calabrioContext.roles[0], calabrioContext.roles[2]]);
          });
          expect(mockSetForm).toHaveBeenCalledTimes(2);
          expect(mockSetForm).toHaveBeenCalledWith({
            type: "SET_CALABRIO_ROLES",
            payload: [calabrioContext.roles[0], calabrioContext.roles[2]]
          });
        });
      });
    });
    describe("Team Dropdown", () => {
      describe("updateValue is called", () => {
        test("setForm is called with the appropriate params", () => {
          render(<CallRecordingForm/>);
          expect(Dropdown.mock.calls.length).toBe(2);
          const updateTeam = Dropdown.mock.calls[1][0].updateValue;
          act(() => {
            updateTeam(null, calabrioContext.teams[0]);
          });
          expect(mockSetForm).toHaveBeenCalledTimes(2);
          expect(mockSetForm).toHaveBeenCalledWith({
            type: "SET_CALABRIO_TEAM",
            payload: calabrioContext.teams[0]
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
          teams: [102, 201]
        }
      };
      beforeEach(() => {
        useFormState.mockReturnValue({
          ...initialFormState,
          calabrioUser: {
            team: 225,
            roles: [],
            scope: {
              groups: [],
              teams: []
            }
          },
          formMode: "UPDATE",
          nNumberFetchedUser: {
            email: "faith.Cuneo@libertymutual.com",
            firstName: "Faith",
            lastName: "Cuneo"
          }
        });
        getCalabrioUser.mockResolvedValue(user);
      });
      test("Form is rendered as expected", async () => {
        render(<CallRecordingForm/>);
        expect(Dropdown.mock.calls.length).toBe(2);
        expect(CallRecordingScope.mock.calls.length).toBe(1);
        expect(getCalabrioUser).toHaveBeenCalledTimes(1);
        expect(getCalabrioUser).toHaveBeenCalledWith(220);
        await waitFor(() => {
          expect(mockSetForm).toHaveBeenCalledTimes(1);
          expect(mockSetForm).toHaveBeenCalledWith({
            type: "SET_CALABRIO_USER",
            payload: {
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
                }],
                teams: [{
                  checked: false,
                  groupId: 101,
                  name: "Hawaii Team 50",
                  parentGroupId: 100
                }, {
                  checked: true,
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
              team: 201
            }
          });
        });
      });
    });
    describe("worker was not found in Calabrio User state", () => {
      beforeEach(() => {
        useFormState.mockReturnValue({
          ...initialFormState,
          calabrioUser: {
            team: 225,
            roles: [],
            scope: {
              groups: [],
              teams: []
            }
          },
          formMode: "UPDATE",
          nNumberFetchedUser: {
            email: "Mike.Nieman@libertymutual.com",
            firstName: "Mike",
            lastName: "Nieman"
          }
        });
      });
      test("Form is rendered as expected", async () => {
        render(<CallRecordingForm/>);
        expect(Dropdown.mock.calls.length).toBe(2);
        expect(CallRecordingScope.mock.calls.length).toBe(1);
        expect(getCalabrioUser).toHaveBeenCalledTimes(0);
        expect(mockSetForm).toHaveBeenCalledTimes(0);
        expect(console.warn).toHaveBeenCalledWith("No user was found in Calabrio with this email");
      });
    });
    describe("Worker was found in Calabrio User state but failed to fetch user", () => {
      beforeEach(() => {
        useFormState.mockReturnValue({
          ...initialFormState,
          calabrioUser: {
            team: 225,
            roles: [],
            scope: {
              groups: [],
              teams: []
            }
          },
          formMode: "UPDATE",
          nNumberFetchedUser: {
            email: "faith.Cuneo@libertymutual.com",
            firstName: "Faith",
            lastName: "Cuneo"
          }
        });
        getCalabrioUser.mockRejectedValue({ aww: "boo" });
      });
      test("Form is rendered as expected", async () => {
        render(<CallRecordingForm/>);
        expect(Dropdown.mock.calls.length).toBe(2);
        expect(CallRecordingScope.mock.calls.length).toBe(1);
        expect(getCalabrioUser).toHaveBeenCalledTimes(1);
        expect(getCalabrioUser).toHaveBeenCalledWith(220);
        expect(mockSetForm).toHaveBeenCalledTimes(0);
        await waitFor(() => {
          expect(console.error.mock.calls.length).toBe(1);
        });
      });
    });
  });
});
