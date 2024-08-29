import {
  Action, UMManager
} from "globals/interfaces";
import { formModes } from "globals";
import { UserFormState } from "usermanagement/UserEntryFormWrapper.Interfaces";
import { ExtensionSearchStatuses } from "usermanagement/ExtensionInput.Interfaces";
import { SearchParams } from "usermanagement/ExtensionSearchParams";
import { formatE164PhoneNumber } from "utils/numberUtils";
import { calabrioTimeZones } from "utils/calabrioUtils";
import { getValidSkillsObject } from "utils/skillsUtils";
import { getZeroOutEnabledFromProfile } from "utils/usermanagementUtils";
import { getWfmOptions } from "utils/calabrioUtils";

const searchParams = SearchParams.getValues();

export const userFormActions = {
  ADD_ROUTING_TEAM: "ADD_ROUTING_TEAM",
  ASSIGN_EXTENSION: "ASSIGN_EXTENSION",
  CHECK_CALABRIO_TEAM: "CHECK_CALABRIO_TEAM",
  CHECK_CALABRIO_GROUP: "CHECK_CALABRIO_GROUP",
  CLEAR_DISCREPANCY: "CLEAR_DISCREPANCY",
  CLEAR_EXTENSION: "CLEAR_EXTENSION",
  CLEAR_N_NUMBER: "CLEAR_N_NUMBER",
  CLEAR_OUTGOING_NUMBER: "CLEAR_OUTGOING_NUMBER",
  COMPLETE_N_NUMBER: "COMPLETE_N_NUMBER",
  INITIATE_DID_FIELDS: "INITIATE_DID_FIELDS",
  INITIATE_ZERO_OUT_FIELDS: "INITIATE_ZERO_OUT_FIELDS",
  RESET_FORM: "RESET_FORM",
  RESET_FORM_AFTER_ADD: "RESET_FORM_AFTER_ADD",
  SET_BLUR_ON_FIELD: "SET_BLUR_ON_FIELD",
  SET_CALABRIO_QM_USER: "SET_CALABRIO_QM_USER",
  SET_CALABRIO_TEAM: "SET_CALABRIO_TEAM",
  SET_CALABRIO_TIMEZONE: "SET_CALABRIO_TIMEZONE",
  SET_CALABRIO_ROLES: "SET_CALABRIO_ROLES",
  SET_BACK_UP_WORKER: "SET_BACK_UP_WORKER",
  SET_CALLER_STATES: "SET_CALLER_STATES",
  SET_SALES_ASSOCIATE_WORKER: "SET_SALES_ASSOCIATE_WORKER",
  SET_DISCREPANCIES: "SET_DISCREPANCIES",
  SET_EXTENSION_MESSAGE: "SET_EXTENSION_MESSAGE",
  SET_EXTENSION_RETRIES: "SET_EXTENSION_RETRIES",
  SET_EXTENSION_VERIFIED: "EXTENSION_VERIFIED",
  SET_UPDATE_TRITON_FORM_STATE: "SET_UPDATE_TRITON_FORM_STATE",
  SET_UPDATE_QM_FORM_STATE: "SET_UPDATE_QM_FORM_STATE",
  SET_UPDATE_WFM_FORM_STATE: "SET_UPDATE_WFM_FORM_STATE",
  SET_WFM_BUSINESS_UNIT: "SET_WFM_BUSINESS_UNIT",
  SET_WFM_AVAILABILITY: "SET_WFM_AVAILABILITY",
  SET_WFM_ABSENCE: "SET_WFM_ABSENCE",
  SET_WFM_TEAM: "SET_WFM_TEAM",
  SET_WFM_SKILLS: "SET_WFM_SKILLS",
  SET_WFM_CONTROL_SET: "SET_WFM_CONTROL_SET",
  SET_WFM_CONTRACT: "SET_WFM_CONTRACT",
  SET_WFM_CONTRACT_SCHEDULE: "SET_WFM_CONTRACT_SCHEDULE",
  SET_WFM_BUDGET_GROUP: "SET_WFM_BUDGET_GROUP",
  SET_WFM_EMP_START_DATE: "SET_WFM_EMP_START_DATE",
  SET_WFM_PART_TIME_PERCENTAGE: "SET_WFM_PART_TIME_PERCENTAGE",
  SET_WFM_SHIFT_BAG: "SET_WFM_SHIFT_BAG",
  SET_WFM_NOTE: "SET_WFM_NOTE",
  SET_WFM_ROLES: "SET_WFM_ROLES",
  SET_WFM_ROTATION: "SET_WFM_ROTATION",
  SET_WFM_FIRST_DAY_OF_WEEK: "SET_WFM_FIRST_DAY_OF_WEEK",
  SET_WFM_OPTIONAL_COLUMNS: "SET_WFM_OPTIONAL_COLUMNS",
  SET_WFM_IDENTITY: "SET_WFM_IDENTITY",
  SET_WFM_TERMINATION_DATE: "SET_WFM_TERMINATION_DATE",
  SET_WFM_USER_DATA: "SET_WFM_USER_DATA",
  SET_DELETE_FORM_STATE: "SET_DELETE_FORM_STATE",
  SET_USER_PREVIOUSLY_ADDED_TRUE: "SET_USER_PREVIOUSLY_ADDED_TRUE",
  UPDATE_DEFAULT_SKILLS: "UPDATE_DEFAULT_SKILLS",
  UPDATE_EXTENSION: "UPDATE_EXTENSION",
  UPDATE_INACTIVE_FORWARD_TO: "UPDATE_INACTIVE_FORWARD_TO",
  UPDATE_MANAGER: "UPDATE_MANAGER",
  UPDATE_N_NUMBER: "UPDATE_N_NUMBER",
  UPDATE_PHONE_NUMBER: "UPDATE_PHONE_NUMBER",
  UPDATE_TEAM: "UPDATE_TEAM",
  UPDATE_SELF_SERVICE_INDICATOR: "UPDATE_SELF_SERVICE_INDICATOR",
  UPDATE_USER_FOUND: "UPDATE_USER_FOUND",
  UPDATE_BACK_UP_WORKER_FLAG: "UPDATE_BACK_UP_WORKER_FLAG",
  RESET_BACK_UP_WORKER_FLAG: "RESET_BACK_UP_WORKER_FLAG"
};

export const initialUserFormState: UserFormState = {
  formMode: formModes.INSERT,
  discrepancies: [],
  nNumber: {
    value: "n",
    blurred: false,
    updated: false,
    nNumberFetchedUser: null
  },
  triton: {
    userFound: false,
    attributes: [],
    defaultSkills: {
      updated: false,
      skills: [],
      levels: {}
    },
    routing: {
      team: "",
      backup_workers: [],
      backup_workers_active: false,
      caller_states: [],
      sales_assoc_workers: [],
      skills: [],
      level: {},
      updated: false
    },
    didUser: false,
    did: {
      value: "",
      blurred: false,
      e164: undefined,
      updated: false,
      valid: false
    },
    extension: {
      value: "",
      blurred: false,
      updated: false,
      valid: false,
      status: {
        searchStatus: ExtensionSearchStatuses.Idle,
        retriesRemaining: searchParams.MaxRetries,
        message: "",
        isError: false,
        originalExtension: ""
      }
    },
    inactiveForwardTo: {
      value: null,
      updated: false
    },
    manager: {
      value: "",
      blurred: false,
      updated: false
    },
    outgoing: {
      value: "",
      blurred: false,
      e164: undefined,
      updated: false,
      valid: false
    },
    profileId: {
      value: "",
      blurred: false,
      updated: false
    },
    selfServiceInd: {
      value: false,
      updated: false
    },
    userPreviouslyAdded: false,
    zeroOutEnabled: {
      value: false,
      updated: false
    }
  },
  calabrio_qm: {
    userFound: false,
    updated: false,
    id: null,
    team: null,
    timezone: calabrioTimeZones[0],
    roles: [],
    scope: {
      groups: [],
      teams: []
    }
  },
  calabrio_wfm: {
    userFound: false,
    OptionalColumns: [],
    Id: null,
    Identity: null,
    FirstName: null,
    LastName: null,
    EmploymentNumber: null,
    Email: null,
    DisplayName: null,
    TerminationDate: null,
    EmploymentStartDate: null,
    TimeZoneId: null,
    BusinessUnitId: null,
    TeamId: null,
    TeamStartDate: null,
    PersonSkills: [],
    SkillsStartDate: null,
    WorkflowControlSetId: null,
    ContractId: null,
    ContractScheduleId: null,
    BudgetGroupId: null,
    PartTimePercentageId: null,
    ShiftBagId: null,
    Note: null,
    Roles: [],
    AvailabilityId: null,
    AvailabilityStartDate: null,
    AbsenceId: null,
    RotationId: null,
    RotationStartDate: null,
    RotationStartWeek: null,
    FirstDayOfWeek: null,
    ParentTeam: null
  }
};

export const userFormReducer = (state: any, action: Action): UserFormState => {
  switch (action.type) {
    case userFormActions.ASSIGN_EXTENSION: {
      return {
        ...state,
        triton: {
          ...state.triton,
          extension: {
            ...state.triton.extension,
            status: {
              ...state.triton.extension.status,
              searchStatus: ExtensionSearchStatuses.PickANumber,
              message: "Searching..."
            }
          }
        }
      };
    }
    case userFormActions.CHECK_CALABRIO_GROUP: {
      state.calabrio_qm.scope.groups[action.payload.index][action.payload.boxType] = action.payload.checked;
      return {
        ...state,
        calabrio_qm: {
          ...state.calabrio_qm,
          scope: {
            ...state.calabrio_qm.scope,
            groups: state.calabrio_qm.scope.groups
          },
          updated: true
        }
      };
    }
    case userFormActions.CHECK_CALABRIO_TEAM: {
      state.calabrio_qm.scope.teams[action.payload.index].checked = action.payload.checked;
      return {
        ...state,
        calabrio_qm: {
          ...state.calabrio_qm,
          scope: {
            ...state.calabrio_qm.scope,
            teams: state.calabrio_qm.scope.teams
          },
          updated: true
        }
      };
    }
    case userFormActions.CLEAR_DISCREPANCY: {
      const message = action.payload;
      return {
        ...state,
        discrepancies: state.discrepancies.filter((d: any) => d.message !== message)
      };
    }
    case userFormActions.CLEAR_EXTENSION: {
      return {
        ...state,
        triton: {
          ...state.triton,
          extension: {
            ...state.triton.extension,
            value: "",
            updated: true,
            valid: false,
            status: {
              ...state.triton.extension.status,
              searchStatus: ExtensionSearchStatuses.Idle,
              retriesRemaining: searchParams.MaxRetries,
              isError: false,
              message: ""
            }
          }
        }
      };
    }
    case userFormActions.CLEAR_N_NUMBER: {
      return {
        ...state,
        nNumber: {
          ...state.nNumber,
          value: "n",
          updated: false,
          nNumberFetchedUser: null
        }
      };
    }
    case userFormActions.CLEAR_OUTGOING_NUMBER: {
      return {
        ...state,
        triton: {
          ...state.triton,
          outgoing: initialUserFormState.triton.outgoing
        }
      };
    }
    case userFormActions.COMPLETE_N_NUMBER: {
      const nNumber = action.payload.nNumber;
      const fetchedUser = action.payload.fetchedUser;
      return {
        ...state,
        nNumber: {
          ...state.nNumber,
          value: nNumber,
          nNumberFetchedUser: fetchedUser
        }
      };
    }
    case userFormActions.INITIATE_DID_FIELDS: {
      const zeroOutEnabledValue = state.triton.didUser ? false : state.triton.zeroOutEnabled.value;
      return {
        ...state,
        triton: {
          ...state.triton,
          didUser: !state.triton.didUser,
          did: {
            value: "",
            blurred: false,
            e164: undefined,
            updated: false,
            valid: false
          },
          zeroOutEnabled: {
            value: zeroOutEnabledValue,
            updated: false
          }
        }
      };
    }
    case userFormActions.INITIATE_ZERO_OUT_FIELDS: {
      return {
        ...state,
        triton: {
          ...state.triton,
          zeroOutEnabled: {
            updated: true,
            value: !state.triton.zeroOutEnabled.value
          }
        }
      };
    }
    case userFormActions.UPDATE_SELF_SERVICE_INDICATOR: {
      return {
        ...state,
        triton: {
          ...state.triton,
          selfServiceInd: {
            value: !state.triton.selfServiceInd.value,
            updated: true
          }
        }
      };
    }
    case userFormActions.UPDATE_BACK_UP_WORKER_FLAG: {
      return {
        ...state,
        triton: {
          ...state.triton,
          routing: {
            ...state.triton.routing,
            backup_workers_active: !state.triton.routing.backup_workers_active,
            updated: true
          }
        }
      };
    }
    case userFormActions.RESET_BACK_UP_WORKER_FLAG: {
      return {
        ...state,
        triton: {
          ...state.triton,
          routing: {
            ...state.triton.routing,
            backup_workers_active: false,
            updated: true
          }
        }
      };
    }
    case userFormActions.RESET_FORM: {
      return {
        ...initialUserFormState,
        triton: {
          ...initialUserFormState.triton,
          defaultSkills: {
            updated: false,
            skills: [],
            levels: {}
          }
        }
      };
    }
    case userFormActions.RESET_FORM_AFTER_ADD: {
      const didUser = action.payload.didUser;
      const outgoingPayload = didUser ? { value: "" } : action.payload.outgoing;
      const profileId = action.payload.profileIdValue;
      const manager = action.payload.managerValue;
      return {
        ...initialUserFormState,
        triton: {
          ...initialUserFormState.triton,
          userFound: true,
          defaultSkills: {
            updated: false,
            skills: [],
            levels: {}
          },
          didUser,
          manager: {
            value: manager,
            blurred: false,
            updated: true
          },
          outgoing: {
            value: outgoingPayload.value,
            blurred: false,
            e164: outgoingPayload.e164,
            updated: true,
            valid: true
          },
          profileId: {
            value: profileId,
            blurred: false,
            updated: true
          }
        },
        calabrio_qm: {
          ...initialUserFormState.calabrio_qm,
          userFound: true
        }
      };
    }
    case userFormActions.ADD_ROUTING_TEAM: {
      const routingTeam = action.payload.routingTeamName;
      return {
        ...state,
        triton: {
          ...state.triton,
          routing: {
            ...state.triton.routing,
            team: routingTeam,
            updated: true
          }
        }

      };
    }
    case userFormActions.SET_CALLER_STATES: {
      const callerStateRoutingAttr = action.payload.callerStateRouting;
      return {
        ...state,
        triton: {
          ...state.triton,
          routing: {
            ...state.triton.routing,
            caller_states: callerStateRoutingAttr,
            updated: true
          }
        }
      };
    }
    case userFormActions.SET_SALES_ASSOCIATE_WORKER: {
      const salesAssociateWorkerAttr = action.payload.salesAssociateWorkerRouting;
      return {
        ...state,
        triton: {
          ...state.triton,
          routing: {
            ...state.triton.routing,
            sales_assoc_workers: salesAssociateWorkerAttr,
            updated: true
          }
        }
      };
    }
    case userFormActions.SET_BACK_UP_WORKER: {
      const backupWorkerAttr = action.payload.backupWorkerRouting;
      return {
        ...state,
        triton: {
          ...state.triton,
          routing: {
            ...state.triton.routing,
            backup_workers: backupWorkerAttr,
            updated: true
          }
        }
      };
    }
    case userFormActions.SET_BLUR_ON_FIELD: {
      const field = action.payload.field;
      const system = action.payload.system;
      if (system) {
        return {
          ...state,
          [system]: {
            ...state[system],
            [field]: {
              ...state[system][field],
              blurred: true
            }
          }
        };
      } else {
        return {
          ...state,
          [field]: {
            ...state[field],
            blurred: true
          }
        };
      }
    }
    case userFormActions.SET_CALABRIO_QM_USER: {
      return {
        ...state,
        calabrio_qm: {
          userFound: true,
          ...action.payload
        }
      };
    }
    case userFormActions.SET_CALABRIO_ROLES: {
      return {
        ...state,
        calabrio_qm: {
          ...state.calabrio_qm,
          roles: action.payload,
          updated: true
        }
      };
    }
    case userFormActions.SET_CALABRIO_TEAM: {
      return {
        ...state,
        calabrio_qm: {
          ...state.calabrio_qm,
          team: action.payload,
          updated: true
        }
      };
    }
    case userFormActions.SET_CALABRIO_TIMEZONE: {
      return {
        ...state,
        calabrio_qm: {
          ...state.calabrio_qm,
          timezone: action.payload,
          updated: true
        }
      };
    }
    case userFormActions.SET_DISCREPANCIES: {
      return {
        ...state,
        discrepancies: [...state.discrepancies.slice(), action.payload]
      };
    }
    case userFormActions.SET_EXTENSION_MESSAGE: {
      const message = action.payload.message;
      const isError = action.payload.isError;
      return {
        ...state,
        triton: {
          ...state.triton,
          extension: {
            ...state.triton.extension,
            status: {
              ...state.triton.extension.status,
              message: message,
              isError: isError,
              searchStatus: ExtensionSearchStatuses.Idle,
              retriesRemaining: searchParams.MaxRetries
            }
          }
        }
      };
    }
    case userFormActions.SET_EXTENSION_RETRIES: {
      const remaining = state.triton.extension.status.retriesRemaining - 1;
      return {
        ...state,
        triton: {
          ...state.triton,
          extension: {
            ...state.triton.extension,
            status: {
              ...state.triton.extension.status,
              searchStatus: remaining ? ExtensionSearchStatuses.PickANumber : ExtensionSearchStatuses.Idle,
              retriesRemaining: remaining
            }
          }
        }
      };
    }
    case userFormActions.SET_EXTENSION_VERIFIED: {
      return {
        ...state,
        triton: {
          ...state.triton,
          extension: {
            ...state.triton.extension,
            status: {
              ...state.triton.extension.status,
              searchStatus: ExtensionSearchStatuses.Idle,
              retriesRemaining: searchParams.MaxRetries,
              message: "Verified",
              isError: false
            }
          }
        }
      };
    }
    case userFormActions.SET_UPDATE_TRITON_FORM_STATE: {
      const worker = action.payload.worker;
      const managers = action.payload.managers;
      return {
        ...state,
        formMode: action.payload.formMode,
        nNumber: {
          ...state.nNumber,
          value: worker.attributes.n_number
        },
        triton: {
          ...state.triton,
          userFound: true,
          attributes: worker.attributes,
          defaultSkills: {
            ...state.triton.defaultSkills,
            ...getValidSkillsObject(worker.attributes.default_skills)
          },
          routing: {
            ...getValidSkillsObject(worker.attributes.routing)
          },
          didUser: worker.did ? true : false,
          extension: {
            ...state.triton.extension,
            value: worker.attributes.extension || "",
            valid: true,
            status: {
              ...state.triton.extension.status,
              originalExtension: worker.attributes.extension || "",
              isError: false,
              message: ""
            }
          },
          manager: {
            ...state.triton.manager,
            value: managers.find((m: UMManager) => m.manager_n_num === worker.attributes.manager_n_number)
          },
          outgoing: {
            ...state.triton.outgoing,
            value: worker.attributes.caller_id ? formatE164PhoneNumber(worker.attributes.caller_id) : "",
            valid: worker.attributes.caller_id ? true : false
          },
          profileId: {
            ...state.triton.profileId,
            value: worker.attributes.profile_id
          },
          did: {
            ...state.triton.did,
            value: worker.did ? formatE164PhoneNumber(worker.did) : "",
            valid: worker.did ? true : false
          },
          zeroOutEnabled: {
            ...state.triton.zeroOutEnabled,
            value: worker.zeroOutEnabled || false
          },
          selfServiceInd: {
            ...state.triton.selfServiceInd,
            value: worker.selfServiceInd || false
          },
          sid: worker.sid
        }
      };
    }
    case userFormActions.SET_UPDATE_QM_FORM_STATE: {
      const user = action.payload.user;
      return {
        ...state,
        formMode: action.payload.formMode,
        calabrio_qm: {
          ...state.calabrio_qm,
          userFound: true,
          ...user
        }
      };
    }
    case userFormActions.SET_UPDATE_WFM_FORM_STATE: {
      const user = action.payload.user;
      const appState = action.payload.state;

      const Roles: any[] = [];
      const PersonSkills: any[] = [];
      const OptionalColumns: any[] = [];

      user.Roles?.forEach((ur: any) => {
        const availableRole = getWfmOptions(appState)?.Roles?.find((r: any) => r.Id === ur.RoleId);
        if (availableRole) {
          Roles.push({
            ...availableRole,
            value: availableRole.Id,
            label: availableRole.Name
          });
        }
      });
      user.PersonSkills?.forEach((us: any) => {
        const availableSkill = getWfmOptions(appState)?.Skills?.find((s: any) => s.Id === us.SkillId);
        if (availableSkill) {
          PersonSkills.push({
            ...availableSkill,
            label: availableSkill.Name,
            value: availableSkill.Id
          });
        }
      });

      if (user.OptionalColumns) {
        Object.keys(user.OptionalColumns).forEach((id: string) => {
          const optionalColumn = getWfmOptions(appState)?.Optional_Columns?.find((o: any) => o.Id === id);
          if (optionalColumn) {
            OptionalColumns.push({
              ...optionalColumn,
              value: optionalColumn.Id,
              label: optionalColumn.Name,
              columnValue: user.OptionalColumns[id]
            });
          }
        });
      }

      return {
        ...state,
        formMode: action.payload.formMode,
        calabrio_wfm: {
          ...state.calabrio_wfm,
          userFound: true,
          ...user,
          Roles,
          PersonSkills,
          OptionalColumns
        }
      };
    }
    case userFormActions.SET_WFM_BUSINESS_UNIT: {
      return {
        ...state,
        calabrio_wfm: {
          ...state.calabrio_wfm,
          BusinessUnitId: action.payload
        }
      };
    }
    case userFormActions.SET_WFM_TEAM: {
      return {
        ...state,
        calabrio_wfm: {
          ...state.calabrio_wfm,
          TeamId: action.payload.id,
          TeamStartDate: action.payload.startDate
        }
      };
    }
    case userFormActions.SET_WFM_SKILLS: {
      return {
        ...state,
        calabrio_wfm: {
          ...state.calabrio_wfm,
          PersonSkills: action.payload.skills,
          SkillsStartDate: action.payload.startDate
        }
      };
    }
    case userFormActions.SET_WFM_CONTROL_SET: {
      return {
        ...state,
        calabrio_wfm: {
          ...state.calabrio_wfm,
          WorkflowControlSetId: action.payload
        }
      };
    }
    case userFormActions.SET_WFM_CONTRACT: {
      return {
        ...state,
        calabrio_wfm: {
          ...state.calabrio_wfm,
          ContractId: action.payload
        }
      };
    }
    case userFormActions.SET_WFM_CONTRACT_SCHEDULE: {
      return {
        ...state,
        calabrio_wfm: {
          ...state.calabrio_wfm,
          ContractScheduleId: action.payload
        }
      };
    }
    case userFormActions.SET_WFM_BUDGET_GROUP: {
      return {
        ...state,
        calabrio_wfm: {
          ...state.calabrio_wfm,
          BudgetGroupId: action.payload
        }
      };
    }
    case userFormActions.SET_WFM_PART_TIME_PERCENTAGE: {
      return {
        ...state,
        calabrio_wfm: {
          ...state.calabrio_wfm,
          PartTimePercentageId: action.payload
        }
      };
    }
    case userFormActions.SET_WFM_SHIFT_BAG: {
      return {
        ...state,
        calabrio_wfm: {
          ...state.calabrio_wfm,
          ShiftBagId: action.payload
        }
      };
    }
    case userFormActions.SET_WFM_NOTE: {
      return {
        ...state,
        calabrio_wfm: {
          ...state.calabrio_wfm,
          Note: action.payload
        }
      };
    }
    case userFormActions.SET_WFM_ROLES: {
      return {
        ...state,
        calabrio_wfm: {
          ...state.calabrio_wfm,
          Roles: action.payload
        }
      };
    }
    case userFormActions.SET_WFM_FIRST_DAY_OF_WEEK: {
      return {
        ...state,
        calabrio_wfm: {
          ...state.calabrio_wfm,
          FirstDayOfWeek: action.payload
        }
      };
    }
    case userFormActions.SET_WFM_OPTIONAL_COLUMNS: {
      return {
        ...state,
        calabrio_wfm: {
          ...state.calabrio_wfm,
          OptionalColumns: action.payload
        }
      };
    }
    case userFormActions.SET_WFM_IDENTITY: {
      return {
        ...state,
        calabrio_wfm: {
          ...state.calabrio_wfm,
          Identity: action.payload
        }
      };
    }
    case userFormActions.SET_WFM_ABSENCE: {
      return {
        ...state,
        calabrio_wfm: {
          ...state.calabrio_wfm,
          AbsenceId: action.payload
        }
      };
    }
    case userFormActions.SET_WFM_AVAILABILITY: {
      return {
        ...state,
        calabrio_wfm: {
          ...state.calabrio_wfm,
          AvailabilityId: action.payload.id,
          AvailabilityStartDate: action.payload.startDate
        }
      };
    }
    case userFormActions.SET_WFM_ROTATION: {
      return {
        ...state,
        calabrio_wfm: {
          ...state.calabrio_wfm,
          RotationId: action.payload.id,
          RotationStartDate: action.payload.startDate,
          RotationStartWeek: action.payload.startWeek
        }
      };
    }
    case userFormActions.SET_WFM_TERMINATION_DATE: {
      return {
        ...state,
        calabrio_wfm: {
          ...state.calabrio_wfm,
          TerminationDate: action.payload
        }
      };
    }
    case userFormActions.SET_WFM_EMP_START_DATE: {
      return {
        ...state,
        calabrio_wfm: {
          ...state.calabrio_wfm,
          EmploymentStartDate: action.payload
        }
      };
    }
    case userFormActions.SET_WFM_USER_DATA: {
      return {
        ...state,
        calabrio_wfm: {
          ...state.calabrio_wfm,
          FirstName: action.payload.firstName,
          LastName: action.payload.lastName,
          EmploymentNumber: action.payload.nNumber,
          Email: action.payload.email,
          DisplayName: action.payload.fullName
        }
      };
    }
    case userFormActions.SET_DELETE_FORM_STATE: {
      const worker = action.payload.worker;
      const managers = action.payload.managers;
      return {
        ...state,
        formMode: formModes.DELETE,
        nNumber: {
          ...state.nNumber,
          value: worker.attributes.n_number || "n"
        },
        triton: {
          ...state.triton,
          userFound: true,
          sid: worker.sid,
          attributes: worker.attributes,
          defaultSkills: {
            ...state.triton.defaultSkills,
            ...getValidSkillsObject(worker.attributes.default_skills)
          },
          extension: {
            ...state.triton.extension,
            value: worker.attributes.extension || "",
            valid: true,
            status: {
              ...state.triton.extension.status,
              originalExtension: worker.attributes.extension || "",
              isError: false,
              message: ""
            }
          },
          manager: {
            ...state.triton.manager,
            value: managers.find((m: UMManager) => m.manager_n_num === worker.attributes.manager_n_number)
          },
          outgoing: {
            ...state.triton.outgoing,
            value: worker.attributes.caller_id ? formatE164PhoneNumber(worker.attributes.caller_id) : "",
            valid: worker.attributes.caller_id ? true : false
          },
          profileId: {
            ...state.triton.profileId,
            value: worker.attributes.profile_id
          },
          did: {
            ...state.triton.did,
            value: worker.did ? formatE164PhoneNumber(worker.did) : "",
            valid: worker.did ? true : false
          },
          didUser: worker.did ? true : false,
          zeroOutEnabled: {
            ...state.triton.zeroOutEnabled,
            value: worker.zeroOutEnabled || false
          },
          selfServiceInd: {
            ...state.triton.selfServiceInd,
            value: worker.selfServiceInd || false
          }
        }
      };
    }
    case userFormActions.SET_USER_PREVIOUSLY_ADDED_TRUE: {
      return {
        ...state,
        triton: {
          ...state.triton,
          userPreviouslyAdded: true
        }
      };
    }
    case userFormActions.UPDATE_DEFAULT_SKILLS: {
      const defaultSkills = action.payload;
      return {
        ...state,
        triton: {
          ...state.triton,
          defaultSkills: {
            ...defaultSkills,
            updated: true
          }
        }
      };
    }
    case userFormActions.UPDATE_EXTENSION: {
      const extension = action.payload.extension;
      const isValid = action.payload.isValid;
      const message = isValid ? "Extension is valid" : "";
      return {
        ...state,
        triton: {
          ...state.triton,
          extension: {
            ...state.triton.extension,
            value: extension,
            blurred: isValid,
            updated: true,
            valid: isValid,
            status: {
              ...state.triton.extension.status,
              message,
              searchStatus: ExtensionSearchStatuses.Idle,
              retriesRemaining: searchParams.MaxRetries,
              isError: false
            }
          }
        }
      };
    }
    case userFormActions.UPDATE_INACTIVE_FORWARD_TO: {
      const inactiveForwardTo = action.payload;
      return {
        ...state,
        triton: {
          ...state.triton,
          inactiveForwardTo: {
            value: inactiveForwardTo,
            updated: true
          }
        }
      };
    }
    case userFormActions.UPDATE_MANAGER: {
      const manager = action.payload;
      return {
        ...state,
        triton: {
          ...state.triton,
          manager: {
            ...state.triton.manager,
            value: manager,
            updated: true
          }
        }
      };
    }
    case userFormActions.UPDATE_N_NUMBER: {
      const nNumber = action.payload;
      return {
        ...state,
        nNumber: {
          ...state.nNumber,
          value: nNumber,
          updated: true
        }
      };
    }
    case userFormActions.UPDATE_PHONE_NUMBER: {
      const field = action.payload.field;
      const value = action.payload.maskedValue;
      const isValid = action.payload.isValid;
      const e164 = action.payload.e164Number;
      const initialValue = action.payload.initialValue;

      return {
        ...state,
        triton: {
          ...state.triton,
          [field]: {
            ...state.triton[field],
            value,
            e164,
            updated: initialValue !== e164,
            valid: isValid && (e164 ? true : false)
          }
        }
      };
    }
    case userFormActions.UPDATE_TEAM: {
      const profileId = action.payload.profileId;
      const profiles = action.payload.profiles;
      return {
        ...state,
        triton: {
          ...state.triton,
          profileId: {
            ...state.triton.profileId,
            value: profileId,
            updated: true
          },
          zeroOutEnabled: {
            ...state.triton.zeroOutEnabled,
            value: getZeroOutEnabledFromProfile(profiles, profileId)
          }
        }
      };
    }
    case userFormActions.UPDATE_USER_FOUND: {
      const system = action.payload.system;
      const isFound = action.payload.isFound;
      if (state[system]) {
        return {
          ...state,
          [system]: {
            ...initialUserFormState[system],
            userFound: isFound,
            updated: true
          }
        };
      } else {
        return state;
      }
    }
    default:
      return state;
  }
};
