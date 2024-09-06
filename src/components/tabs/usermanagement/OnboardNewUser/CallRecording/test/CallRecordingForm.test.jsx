import React from "react";
import { CallRecordingForm } from "../CallRecordingForm";
import { CallRecordingScope } from "usermanagement/CallRecordingScope";
import { Dropdown } from "components/Dropdown";
import {
  useAdminState,
  useFormDispatch,
  useFormState
} from "context/appContext";
import { getCalabrioUser } from "services/calabrio";
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
import { calabrioTimeZones } from "utils/calabrioUtils";
import { logger } from "utils/logger";

jest.mock("usermanagement/CallRecordingScope", () => ({
  CallRecordingScope: jest.fn()
}));

jest.mock("components/StyledButton", () => ({
  StyledButton: jest.fn()
}));

jest.mock("components/Dropdown", () => ({
  Dropdown: jest.fn()
}));

jest.mock("context/appContext", () => ({
  useAdminState: jest.fn(),
  useFormState: jest.fn(),
  useFormDispatch: jest.fn()
}));

jest.mock("services/calabrio", () => ({
  getCalabrioUser: jest.fn()
}));

const mockSetForm = jest.fn();
const twilioWorker = {
  sid: "WK5678"
};

describe("CallRecordingForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
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
        ...initialFormState.calabrio_qm,
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
          calabrio_qm: {
            ...initialFormState.calabrio_qm,
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
          render(<CallRecordingForm twilioWorker={twilioWorker} missingFields={[]} />);
          expect(mockSetForm).toBeCalledTimes(1);
          expect(mockSetForm).toBeCalledWith({
            type: "SET_CALABRIO_QM_USER",
            payload: expectedPayload
          });
        });
      });
      describe("teams length is 0 while teams > 0", () => {
        const form = {
          ...initialFormState,
          calabrio_qm: {
            ...initialFormState.calabrio_qm,
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
          render(<CallRecordingForm twilioWorker={twilioWorker} missingFields={[]} />);
          expect(mockSetForm).toBeCalledTimes(1);
          expect(mockSetForm).toBeCalledWith({
            type: "SET_CALABRIO_QM_USER",
            payload: expectedPayload
          });
        });
      });
      describe("groups and teams are both empty", () => {
        const form = {
          ...initialFormState,
          calabrio_qm: {
            ...initialFormState.calabrio_qm,
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
          render(<CallRecordingForm twilioWorker={twilioWorker} missingFields={[]} />);
          expect(Dropdown.mock.calls.length).toBe(3);
          expectOnlyPassedProps(Dropdown, {
            label: "Roles *",
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
            label: "Team *",
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
            type: "SET_CALABRIO_QM_USER",
            payload: {
              updated: false,
              userFound: false,
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
              qmViews: [],
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
          calabrio_qm: {
            ...initialFormState.calabrio_qm,
            scope: {
              ...initialFormState.calabrio_qm.scope,
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
          render(<CallRecordingForm twilioWorker={twilioWorker} missingFields={[]} />);
          expect(Dropdown.mock.calls.length).toBe(3);
          expectOnlyPassedProps(Dropdown, {
            label: "Roles *",
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
            label: "Team *",
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
        calabrio_qm: {
          ...initialFormState.calabrio_qm,
          scope: {
            ...initialFormState.calabrio_qm.scope,
            teams: [{
              name: "Team 1",
              id: 2
            }],
            groups: [{
              name: "Group 1",
              id: 2
            }]
          },
        }
      };
      beforeEach(() => {
        useFormState.mockReturnValue({ ...form });
      });
      describe("Selected Profile in the form is 18 (Workers Comp)", () => {
        const workersCompForm = {
          ...initialFormState,
          triton: {
            ...initialFormState.triton,
            profileId: { value: 18 }
          },
          calabrio_qm: {
            ...initialFormState.calabrio_qm,
            scope: {
              groups: [],
              teams: [{
                name: "Team 1",
                id: 2
              }]
            }
          }
        };
        test("New User, No Screen is auto selected", () => {
          useFormState.mockReturnValue(workersCompForm);
          render(<CallRecordingForm twilioWorker={twilioWorker} missingFields={[]} />);
          expect(Dropdown.mock.calls[0][0].options).toEqual([{
            id: 1,
            label: "QM Supervisor",
            name: "QM Supervisor",
            permissions: [{ name: "permission 1" }],
            value: 1
          },
          {
            id: 4,
            label: "No Screen",
            name: "No Screen",
            value: 4
          }]);
          expect(mockSetForm).toHaveBeenLastCalledWith({
            type: "SET_CALABRIO_ROLES",
            payload: [{
              id: 4,
              label: "No Screen",
              name: "No Screen",
              value: 4
            }]
          });
        });
        test("Existing user with QM Supervisor role will auto populate with both No Screen and QM Supervisor", () => {
          workersCompForm.calabrio_qm.roles.push({
            id: 1,
            value: 1,
            name: "QM Supervisor",
            label: "QM Supervisor",
            permissions: [{ name: "permission 1" }]
          }, {
            id: 12,
            value: 12,
            name: "boo",
            label: "boo"
          });
          useFormState.mockReturnValue(workersCompForm);
          render(<CallRecordingForm twilioWorker={twilioWorker} missingFields={[]} />);
          expect(Dropdown.mock.calls[0][0].options).toEqual([{
            id: 1,
            label: "QM Supervisor",
            name: "QM Supervisor",
            permissions: [{ name: "permission 1" }],
            value: 1
          },
          {
            id: 4,
            label: "No Screen",
            name: "No Screen",
            value: 4
          }]);
          expect(mockSetForm).toHaveBeenLastCalledWith({
            type: "SET_CALABRIO_ROLES",
            payload: [{
              id: 1,
              value: 1,
              name: "QM Supervisor",
              label: "QM Supervisor",
              permissions: [{ name: "permission 1" }]
            },
            {
              id: 4,
              label: "No Screen",
              name: "No Screen",
              value: 4
            }]
          });
        });
      });
      describe("QM Roles is on missingFields array", () => {
        const form = {
          ...initialFormState,
          calabrio_qm: {
            team: null,
            scope: {
              teams: [],
              groups: []
            },
            qmViews: []
          }
        };
        beforeEach(() => {
          useFormState.mockReturnValue({ ...form });
        });
        test("error should be true", () => {
          render(<CallRecordingForm twilioWorker={twilioWorker} missingFields={["QM Roles"]} />);
          expect(Dropdown.mock.calls.length).toBe(3);
          expect(Dropdown.mock.calls[0][0].error).toBe(true);
        });
      });
      describe("updateValue is called", () => {
        test("setForm is called with the appropriate params", () => {
          render(<CallRecordingForm twilioWorker={twilioWorker} missingFields={[]} />);
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
        triton: {
          ...initialFormState.triton,
          manager: {
            value: {
              calabrio_team_ids: [102, 101]
            }
          }
        }
      };
      beforeEach(() => {
        useFormState.mockReturnValue(form);
      });
      describe("manager's'calabrio teams is not null", () => {
        test("The dropdown should show only the manager's teams' parent groups' children", () => {
          render(<CallRecordingForm twilioWorker={twilioWorker} missingFields={[]} />);
          expect(Dropdown.mock.calls[1][0].label).toBe("Team *");
          expect(Dropdown.mock.calls[1][0].options.length).toBe(2);
          expect(Dropdown.mock.calls[1][0].options[0].label).toBe("Hawaii Team 50");
          expect(Dropdown.mock.calls[1][0].options[1].label).toBe("Hawaii Specialty Team");
        });
      });
      describe("QM Team is on missingFields array", () => {
        test("error should be true", () => {
          render(<CallRecordingForm twilioWorker={twilioWorker} missingFields={["QM Team"]} />);
          expect(Dropdown.mock.calls.length).toBe(3);
          expect(Dropdown.mock.calls[1][0].error).toBe(true);
        });
      });
      describe("updateValue is called", () => {
        beforeEach(() => {
          useFormState.mockReturnValue(initialFormState);
        });
        test("setForm is called with the appropriate params", () => {
          render(<CallRecordingForm twilioWorker={twilioWorker} missingFields={[]} />);
          expect(Dropdown.mock.calls.length).toBe(3);
          expect(Dropdown.mock.calls[1][0].label).toBe("Team *");
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
        calabrio_qm: {
          ...initialFormState.calabrio_qm,
          scope: {
            ...initialFormState.calabrio_qm.scope,
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
          render(<CallRecordingForm twilioWorker={twilioWorker} missingFields={[]} />);
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
        id: 220,
        acdId: "WK5678",
        groupId: 201,
        roles: [{
          id: 2,
          name: "Agent"
        }],
        scope: {
          groups: [200],
          teams: [201]
        },
        qmViews: []
      };
      const formState = {
        ...initialFormState,
        formMode: "update",
        nNumber: {
          ...initialFormState.nNumber,
          nNumberFetchedUser: {
            email: "faith.Cuneo@libertymutual.com",
            firstName: "Faith",
            lastName: "Cuneo"
          }
        }
      };
      beforeEach(() => {
        getCalabrioUser.mockResolvedValue({
          data: user
        });
        useFormState.mockReturnValue(formState);
      });
      test("Form is rendered as expected", async () => {
        const rendered = render(<CallRecordingForm twilioWorker={twilioWorker} missingFields={[]} />);
        expect(Dropdown.mock.calls.length).toBe(3);
        expect(CallRecordingScope.mock.calls.length).toBe(1);
        expect(getCalabrioUser).toHaveBeenCalledTimes(1);
        expect(getCalabrioUser).toHaveBeenCalledWith("Access Token", 220);
        await waitFor(() => {
          expect(mockSetForm).toHaveBeenCalledTimes(2);
          expect(mockSetForm).toHaveBeenCalledWith({
            type: "SET_CALABRIO_QM_USER",
            payload: {
              updated: true,
              acdId: "WK5678",
              email: "Faith.Cuneo@libertymutual.com",
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
              },
              qmViews:[]
            }
          });
        });
      });
    });
    describe("no twilio worker passed", () => {
      const formState = {
        ...initialFormState,
        formMode: "update",
        nNumber: {
          value: "n0122227",
          nNumberFetchedUser: {
            email: "Mike.Nieman@libertymutual.com",
            firstName: "Mike",
            lastName: "Nieman"
          }
        }
      };
      beforeEach(() => {
        useFormState.mockReturnValue(formState);
      });
      test("should use the form.nNumber.value", () => {
        render(<CallRecordingForm twilioWorker={null} missingFields={[]} />);
        expect(Dropdown.mock.calls.length).toBe(3);
        expect(CallRecordingScope.mock.calls.length).toBe(1);
        expect(getCalabrioUser).toHaveBeenCalledTimes(0);
        expect(mockSetForm).toHaveBeenCalledTimes(2);
        expect(logger.warn).toHaveBeenCalledWith("No matching profile was found in Calabrio for this user", {}, false);
      });
    });
    describe("no matching profile was found for Calabrio User", () => {
      const formState = {
        ...initialFormState,
        calabrio_qm: {
          ...initialFormState.calabrio_qm,
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
        nNumber: {
          ...initialFormState.nNumber,
          nNumberFetchedUser: {
            email: "Mike.Nieman@libertymutual.com",
            firstName: "Mike",
            lastName: "Nieman"
          }
        }
      };
      beforeEach(() => {
        useFormState.mockReturnValue(formState);
      });
      test("Form is rendered as expected", async () => {
        render(<CallRecordingForm twilioWorker={{ sid: "WK0000" }} missingFields={[]}/>);
        expect(Dropdown.mock.calls.length).toBe(3);
        expect(CallRecordingScope.mock.calls.length).toBe(1);
        expect(getCalabrioUser).toHaveBeenCalledTimes(0);
        expect(mockSetForm).toHaveBeenCalledTimes(1);
        expect(logger.warn).toHaveBeenCalledWith("No matching profile was found in Calabrio for this user", {}, false);
      });
    });
    describe("multiple matching profiles were found for Calabrio User", () => {
      const noRolesFormState = {
        ...initialFormState,
        calabrio_qm: {
          ...initialFormState.calabrio_qm,
          roles: []
        },
        formMode: "update",
        nNumber: {
          value: "n0222444",
          nNumberFetchedUser: {
            email: "faith.Cuneo@libertymutual.com",
            firstName: "Faith",
            lastName: "Cuneo"
          }
        }
      };
      const noRolesUser = {
        id: 200,
        acdId: "WK1234",
        groupId: 201,
        roles: null,
        scope: {
          groups: [200],
          teams: [201]
        }
      };
      const tritonWorker = {
        sid: "WK1234",
        attributes: {
          email: "Faith.Cuneo@libertymutual.com"
        }
      };
      beforeEach(() => {
        getCalabrioUser.mockResolvedValue({
          data: noRolesUser
        });
        useFormState.mockReturnValue(noRolesFormState);
      });
      test("Form is rendered as expected", async () => {
        render(<CallRecordingForm twilioWorker={tritonWorker} missingFields={[]} />);
        expect(Dropdown.mock.calls.length).toBe(3);
        expect(CallRecordingScope.mock.calls.length).toBe(1);
        expect(getCalabrioUser).toHaveBeenCalledTimes(1);
        expect(getCalabrioUser).toHaveBeenCalledWith("Access Token", 200);
        await waitFor(() => {
          expect(mockSetForm).toHaveBeenCalledTimes(4);
          expect(mockSetForm).toHaveBeenCalledWith({
            type: "SET_DISCREPANCIES",
            payload: {
              type: "Calabrio QM",
              message: "Calabrio QM Record found for user where the ACD ID does not match the Triton Worker. This will require manual review/correction. Search Calabrio for a record (active or inactive) where the ACD equals wk1234, make that the primary user and deactivate all other users."
            }
          });
          expect(mockSetForm).toHaveBeenCalledWith({
            type: "SET_DISCREPANCIES",
            payload: {
              type: "Calabrio QM",
              message: "Calabrio Email does not match HR email. This could cause Calabrio Login issues. This will require manual review/correction."
            }
          });
          expect(mockSetForm).toHaveBeenCalledWith({
            type: "SET_CALABRIO_QM_USER",
            payload: {
              updated: true,
              acdId: "WK1234",
              email: "Brittany.Magee@libertymutual.com",
              id: 200,
              roles: [],
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
          expect(mockSetForm).toHaveBeenCalledWith({
            type: "SET_DISCREPANCIES",
            payload: {
              type: "Calabrio QM",
              message: "Multiple (2) Calabrio Records Found for this user. Requires manual review/correction."
            }
          });
        });
        expect(logger.warn).toHaveBeenCalledWith("Multiple matching profiles were found in Calabrio for this user", {}, false);
      });
    });
    describe("Ad Login on User Record does not match form.nNumber.value", () => {
      const user = {
        acdId: "WK5678",
        groupId: 201,
        roles: [{
          id: 2,
          name: "Agent"
        }],
        scope: {
          groups: [200],
          teams: [201]
        },
        adLogin: "LM\n0223786"
      };
      const formState = {
        ...initialFormState,
        formMode: "update",
        nNumber: {
          value: "n023786",
          nNumberFetchedUser: {
            email: "faith.Cuneo@libertymutual.com",
            firstName: "Faith",
            lastName: "Cuneo"
          }
        }
      };
      beforeEach(() => {
        getCalabrioUser.mockResolvedValue({
          data: user
        });
        useFormState.mockReturnValue(formState);
      });
      test("Form is rendered as expected", async () => {
        render(<CallRecordingForm twilioWorker={{
          sid: "WK5678"
        }} missingFields={[]} />);
        expect(Dropdown.mock.calls.length).toBe(3);
        expect(CallRecordingScope.mock.calls.length).toBe(1);
        expect(getCalabrioUser).toHaveBeenCalledTimes(1);
        expect(getCalabrioUser).toHaveBeenCalledWith("Access Token", 220);
        await waitFor(() => {
          expect(mockSetForm).toHaveBeenCalledTimes(2);
          expect(mockSetForm).toHaveBeenCalledWith(
            {
              type: "SET_DISCREPANCIES",
              payload: {
                message: "User is not correctly set up for screen recording in Calabrio.",
                type: "Calabrio QM"
              }
            });
          expect(mockSetForm).toHaveBeenCalledWith({
            type: "SET_CALABRIO_QM_USER",
            payload: {
              updated: true,
              acdId: "WK5678",
              email: "Faith.Cuneo@libertymutual.com",
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
    describe("Email on User Record does not match form.nNumberFetchedUser.email", () => {
      const user = {
        acdId: "WK1234",
        groupId: 201,
        roles: [{
          id: 2,
          name: "Agent"
        }],
        scope: {
          groups: [200],
          teams: [201]
        },
        adLogin: "LM\n0223786",
        qmViews: []
      };
      const formState = {
        ...initialFormState,
        formMode: "update",
        nNumber: {
          value: "n0222444",
          nNumberFetchedUser: {
            email: "faith.cuneo@libertymutual.com",
            firstName: "Faith",
            lastName: "Cuneo"
          }
        }
      };
      beforeEach(() => {
        getCalabrioUser.mockResolvedValue({
          data: user
        });
        useFormState.mockReturnValue(formState);
      });
      test("Form is rendered as expected", async () => {
        render(<CallRecordingForm twilioWorker={{
          sid: "WK1234"
        }} missingFields={[]} />);
        expect(Dropdown.mock.calls.length).toBe(3);
        expect(CallRecordingScope.mock.calls.length).toBe(1);
        expect(getCalabrioUser).toHaveBeenCalledTimes(1);
        expect(getCalabrioUser).toHaveBeenCalledWith("Access Token", 200);
        await waitFor(() => {
          expect(mockSetForm).toHaveBeenCalledTimes(2);
          expect(mockSetForm.mock.calls[0][0]).toStrictEqual(
            {
              type: "SET_DISCREPANCIES",
              payload: {
                message: "Calabrio Email does not match HR email. This could cause Calabrio Login issues. This will require manual review/correction.",
                type: "Calabrio QM"
              }
            });
          expect(mockSetForm.mock.calls[1][0]).toStrictEqual({
            type: "SET_CALABRIO_QM_USER",
            payload: {
              acdId: "WK1234",
              email: "Brittany.Magee@libertymutual.com",
              updated: true,
              id: 200,
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
              qmViews: [],
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
    describe("Worker was found in Calabrio User state but failed to fetch user", () => {
      const formState = {
        ...initialFormState,
        calabrio_qm: {
          ...initialFormState.calabrio_qm,
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
        nNumber: {
          ...initialFormState.nNumber,
          nNumberFetchedUser: {
            email: "faith.Cuneo@libertymutual.com",
            firstName: "Faith",
            lastName: "Cuneo"
          }
        }
      };
      beforeEach(() => {
        getCalabrioUser.mockRejectedValue({ aww: "boo" });
        useFormState.mockReturnValue(formState);
      });
      test("Form is rendered as expected", async () => {
        render(<CallRecordingForm twilioWorker={twilioWorker} missingFields={[]} />);
        expect(Dropdown.mock.calls.length).toBe(3);
        expect(CallRecordingScope.mock.calls.length).toBe(1);
        expect(getCalabrioUser).toHaveBeenCalledTimes(1);
        expect(getCalabrioUser).toHaveBeenCalledWith("Access Token", 220);
        expect(mockSetForm).toHaveBeenCalledTimes(1);
        await waitFor(() => {
          //Mocking issue to fix
          expect(logger.error.mock.calls.length).toBe(1);
        });
      });
    });
    describe("QM View", () => {
      const user = {
        acdId: "WK1234",
        groupId: 201,
        roles: [{
          id: 2,
          name: "Agent"
        }],
        scope: {
          groups: [200],
          teams: [201]
        },
        adLogin: "LM\n0223786",
        qmViews: []
      };
      const formState = {
        ...initialFormState,
        formMode: "update",
        nNumber: {
          value: "n0222444",
          nNumberFetchedUser: {
            email: "faith.cuneo@libertymutual.com",
            firstName: "Faith",
            lastName: "Cuneo"
          }
        },
        calabrio_qm: {
          ...initialFormState.calabrio_qm,
          team: 824, 
          qmViews: [{
            id: 1,
            name: "FNOL"
          }]
        }
      };
      beforeEach(() => {

      });
      test("User has a qm view, qm View displays in the form", () => {
        getCalabrioUser.mockResolvedValue({
          data: user
        });
        useFormState.mockReturnValue(formState);

        const rendered = render(<CallRecordingForm twilioWorker={twilioWorker} missingFields={[]} />);
        expect(Dropdown.mock.calls.length).toBe(3);
        expect(CallRecordingScope.mock.calls.length).toBe(1);
        expect(getCalabrioUser).toHaveBeenCalledTimes(1);
        expect(getCalabrioUser).toHaveBeenCalledWith("Access Token", 220);
        expect(rendered.getByTestId('qm-view')).toHaveTextContent("QM View: FNOL")
        expect(mockSetForm).toHaveBeenCalledTimes(1);
      });
      test("User has a NO qm view, qm View displays as default in the form", () => {
        const form = {
          ...formState,
          calabrio_qm: {
            ...formState.calabrio_qm,
            qmViews: []
          }
        }
        getCalabrioUser.mockResolvedValue({
          data: user
        });
        useFormState.mockReturnValue(form);

        const rendered = render(<CallRecordingForm twilioWorker={twilioWorker} missingFields={[]} />);
        expect(Dropdown.mock.calls.length).toBe(3);
        expect(CallRecordingScope.mock.calls.length).toBe(1);
        expect(getCalabrioUser).toHaveBeenCalledTimes(1);
        expect(getCalabrioUser).toHaveBeenCalledWith("Access Token", 220);
        expect(rendered.getByTestId('qm-view')).toHaveTextContent("QM View: Default")
        expect(mockSetForm).toHaveBeenCalledTimes(1);
      })
    });
  });
});
