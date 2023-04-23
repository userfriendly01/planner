import {
  Action,
  Manager,
  formModes
} from "../../globals";
import { UserFormState } from "components/tabs/usermanagement/OnboardNewUser/UserEntryFormWrapper/UserEntryFormWrapper.Interfaces";
import { ExtensionSearchStatuses } from "components/tabs/usermanagement/OnboardNewUser/Extension/ExtensionInput/ExtensionInput.Interfaces";
import { SearchParams } from "components/tabs/usermanagement/OnboardNewUser/Extension/ExtensionSearchParams";
import { formatE164PhoneNumber } from "utils/formatNumberUtils";
import { calabrioTimeZones } from "utils/calabrioUtils";
import { getValidSkillsObject } from "utils/skillsUtils";
import { getZeroOutEnabledFromProfile } from "utils/userManagementUtils";

const searchParams = SearchParams.getValues();

export const userFormActions = {
  ASSIGN_EXTENSION: "ASSIGN_EXTENSION",
  CHECK_CALABRIO_TEAM: "CHECK_CALABRIO_TEAM",
  CHECK_CALABRIO_GROUP: "CHECK_CALABRIO_GROUP",
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
  SET_DISCREPANCIES: "SET_DISCREPANCIES",
  SET_EXTENSION_MESSAGE: "SET_EXTENSION_MESSAGE",
  SET_EXTENSION_RETRIES: "SET_EXTENSION_RETRIES",
  SET_EXTENSION_VERIFIED: "EXTENSION_VERIFIED",
  SET_UPDATE_FORM_STATE: "SET_UPDATE_FORM_STATE",
  SET_DELETE_FORM_STATE: "SET_DELETE_FORM_STATE",
  SET_USER_PREVIOUSLY_ADDED_TRUE: "SET_USER_PREVIOUSLY_ADDED_TRUE",
  UPDATE_DEFAULT_SKILLS: "UPDATE_DEFAULT_SKILLS",
  UPDATE_EXTENSION: "UPDATE_EXTENSION",
  UPDATE_INACTIVE_FORWARD_TO: "UPDATE_INACTIVE_FORWARD_TO",
  UPDATE_MANAGER: "UPDATE_MANAGER",
  UPDATE_N_NUMBER: "UPDATE_N_NUMBER",
  UPDATE_PHONE_NUMBER: "UPDATE_PHONE_NUMBER",
  UPDATE_TEAM: "UPDATE_TEAM",
  UPDATE_SELF_SERVICE_INDICATOR: "UPDATE_SELF_SERVICE_INDICATOR"
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
    alternateDid: {
      value: "",
      blurred: false,
      e164: undefined,
      updated: false,
      valid: false
    },
    defaultSkills: {
      updated: false,
      skills: [],
      levels: {}
    },
    didUser: false,
    directDialNum: {
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

  }
}

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
          },
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
      const zeroOutEnabledValue = state.triton.didUser ? false : state.triton.zeroOutEnabled;
      return {
        ...state,
        triton: {
          ...state.triton,
          didUser: !state.triton.didUser,
          alternateDid: {
            value: "",
            blurred: false,
            e164: undefined,
            updated: false,
            valid: false
          },
          directDialNum: {
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
    case userFormActions.UPDATE_SELF_SERVICE_INDICATOR:{
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
    case userFormActions.RESET_FORM: {
      //FAITH - make sure default skills reset
      return {
        ...initialUserFormState
      };
    }
    case userFormActions.RESET_FORM_AFTER_ADD: {
      const didUser = action.payload.didUser;
      const outgoingPayload = didUser ? { value: "" } : action.payload.outgoing;
      const profileId = action.payload.profileIdValue;
      const manager = action.payload.managerValue;
      //FAITH make sure default skills reset
      return {
        ...initialUserFormState,
        triton: {
          ...state.triton,
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
        }
      };
    }
    case userFormActions.SET_BLUR_ON_FIELD: {
      const field = action.payload;
      return {
        ...state,
        triton: {
          ...state.triton,
          [field]: {
            ...state.triton[field],
            blurred: true
          }
        }
      };
    }
    case userFormActions.SET_CALABRIO_QM_USER: {
      return {
        ...state,
        calabrio_qm: action.payload
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
    case userFormActions.SET_UPDATE_FORM_STATE: {
      const worker = action.payload.worker;
      const managers = action.payload.managers;
      return {
        ...state,
        formMode: formModes.UPDATE,
        nNumber: {
          ...state.nNumber,
          value: worker.attributes.n_number || "n"
        },
        triton: {
          ...state.triton,
          defaultSkills: {
            ...state.triton.defaultSkills,
            ...getValidSkillsObject(worker.attributes.default_skills)
          },
          didUser: worker.directDialNum ? true : false,
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
            value: managers.find((m: Manager) => m.manager_n_number === worker.attributes.manager_n_number)
          },
          outgoing: {
            ...state.triton.outgoing,
            value: worker.attributes.did ? formatE164PhoneNumber(worker.attributes.did) : "",
            valid: worker.attributes.did ? true : false
          },
          profileId: {
            ...state.triton.profileId,
            value: worker.attributes.profile_id
          },
          alternateDid: {
            ...state.triton.alternateDid,
            value: worker.alternateDid ? formatE164PhoneNumber(worker.alternateDid) : "",
            valid: worker.alternateDid ? true : false
          },
          directDialNum: {
            ...state.triton.directDialNum,
            value: worker.directDialNum ? formatE164PhoneNumber(worker.directDialNum) : "",
            valid: worker.directDialNum ? true : false
          },
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
            value: managers.find((m: Manager) => m.manager_n_number === worker.attributes.manager_n_number)
          },
          outgoing: {
            ...state.triton.outgoing,
            value: worker.attributes.did ? formatE164PhoneNumber(worker.attributes.did) : "",
            valid: worker.attributes.did ? true : false
          },
          profileId: {
            ...state.triton.profileId,
            value: worker.attributes.profile_id
          },
          alternateDid: {
            ...state.triton.alternateDid,
            value: worker.alternateDid ? formatE164PhoneNumber(worker.alternateDid) : "",
            valid: worker.alternateDid ? true : false
          },
          directDialNum: {
            ...state.triton.directDialNum,
            value: worker.directDialNum ? formatE164PhoneNumber(worker.directDialNum) : "",
            valid: worker.directDialNum ? true : false
          },
          didUser: worker.directDialNum ? true : false,
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
            updated: true,
            ...defaultSkills
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
              retriesRemaining: searchParams.MaxRetries
            }
          },
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
      return {
        ...state,
        triton: {
          ...state.triton,
          [field]: {
            ...state.triton[field],
            value,
            e164,
            updated: true,
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
            ...state.profileId,
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
    default:
      return state;
  }
};
