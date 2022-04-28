import {
  Action,
  Manager,
  formModes
} from "../../globals";
import {
  UserFormState,
  ExtensionSearchStatuses
} from "components/usermanagement/UserEntryForm/UserEntryForm.Interfaces";
import {
  formatE164PhoneNumber,
  getValidSkillsObject,
  getZeroOutEnabledFromProfile
} from "utils";

import { SearchParams } from "components/usermanagement/UserEntryForm/ExtensionSearchParams";
const searchParams = SearchParams.getValues();

export const userFormActions = {
  ASSIGN_EXTENSION: "ASSIGN_EXTENSION",
  CHECK_TEAM: "CHECK_TEAM",
  CHECK_GROUP: "CHECK_GROUP",
  CLEAR_EXTENSION: "CLEAR_EXTENSION",
  CLEAR_N_NUMBER: "CLEAR_N_NUMBER",
  CLEAR_OUTGOING_NUMBER: "CLEAR_OUTGOING_NUMBER",
  COMPLETE_N_NUMBER: "COMPLETE_N_NUMBER",
  EDIT_PEN_CLICK_FORWARD_TO_TOGGLE: "EDIT_PEN_CLICK_FORWARD_TO_TOGGLE",
  EDIT_PEN_CLICK_NO_FORWARD_TO_TOGGLE: "EDIT_PEN_CLICK_NO_FORWARD_TO_TOGGLE",
  INITIATE_DID_FIELDS: "INITIATE_DID_FIELDS",
  INITIATE_ZERO_OUT_FIELDS: "INITIATE_ZERO_OUT_FIELDS",
  RESET_FORM: "RESET_FORM",
  RESET_FORM_AFTER_ADD: "RESET_FORM_AFTER_ADD",
  SET_BLUR_ON_FIELD: "SET_BLUR_ON_FIELD",
  SET_CALABRIO_USER: "SET_CALABRIO_USER",
  SET_EXTENSION_MESSAGE: "SET_EXTENSION_MESSAGE",
  SET_EXTENSION_RETRIES: "SET_EXTENSION_RETRIES",
  SET_EXTENSION_VERIFIED: "EXTENSION_VERIFIED",
  SET_UPDATE_FORM_STATE: "SET_UPDATE_FORM_STATE",
  SET_USER_PREVIOUSLY_ADDED_TRUE: "SET_USER_PREVIOUSLY_ADDED_TRUE",
  UPDATE_DEFAULT_SKILLS: "UPDATE_DEFAULT_SKILLS",
  UPDATE_EXTENSION: "UPDATE_EXTENSION",
  UPDATE_INACTIVE_FORWARD_TO: "UPDATE_INACTIVE_FORWARD_TO",
  UPDATE_MANAGER: "UPDATE_MANAGER",
  UPDATE_N_NUMBER: "UPDATE_N_NUMBER",
  UPDATE_PHONE_NUMBER: "UPDATE_PHONE_NUMBER",
  UPDATE_TEAM: "UPDATE_TEAM"
};

const initialDefaultSkills = getValidSkillsObject();

export const initialUserFormState: UserFormState = {
  formMode: formModes.INSERT,
  defaultSkills: initialDefaultSkills,
  defaultSkillsUpdated: false,
  didUser: false,
  extension: {
    value: "",
    blurred: false,
    updated: false,
    valid: false
  },
  extensionStatus: {
    searchStatus: ExtensionSearchStatuses.Idle,
    retriesRemaining: searchParams.MaxRetries,
    message: "",
    isError: false,
    originalExtension: ""
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
  nNumber: {
    value: "n",
    blurred: false,
    updated: false
  },
  nNumberFetchedUser: null,
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
  calabrioUser: {
    isScreenRecorded: false,
    team: null,
    roles: [],
    scope: {
      groups: [],
      teams: [],
      tenant: null
    }
  },
  userPreviouslyAdded: false,
  zeroOutEnabled: false,
  zeroOutEnabledUpdated: false,
  editDisabled: false
};

export const userFormReducer = (state: UserFormState, action: Action): UserFormState => {
  switch (action.type) {
    case userFormActions.ASSIGN_EXTENSION: {
      return {
        ...state,
        extensionStatus: {
          ...state.extensionStatus,
          searchStatus: ExtensionSearchStatuses.PickANumber,
          message: "Searching..."
        }
      };
    }
    case userFormActions.CHECK_GROUP: {
      state.calabrioUser.scope.groups[action.payload.index][action.payload.boxType] = action.payload.checked;
      return {
        ...state,
        calabrioUser: {
          ...state.calabrioUser,
          scope: {
            ...state.calabrioUser.scope,
            groups: state.calabrioUser.scope.groups
          }
        }
      };
    }
    case userFormActions.CHECK_TEAM: {
      state.calabrioUser.scope.teams[action.payload.index].checked = action.payload.checked;
      return {
        ...state,
        calabrioUser: {
          ...state.calabrioUser,
          scope: {
            ...state.calabrioUser.scope,
            teams: state.calabrioUser.scope.teams
          }
        }
      };
    }
    case userFormActions.CLEAR_EXTENSION: {
      return {
        ...state,
        extension: {
          ...state.extension,
          value: "",
          updated: true,
          valid: false
        },
        extensionStatus: {
          ...state.extensionStatus,
          searchStatus: ExtensionSearchStatuses.Idle,
          retriesRemaining: searchParams.MaxRetries,
          isError: false,
          message: ""
        }
      };
    }
    case userFormActions.CLEAR_N_NUMBER: {
      return {
        ...state,
        nNumber: {
          ...state.nNumber,
          value: "n",
          updated: false
        },
        nNumberFetchedUser: null
      };
    }
    case userFormActions.CLEAR_OUTGOING_NUMBER: {
      return {
        ...state,
        outgoing: initialUserFormState.outgoing
      };
    }
    case userFormActions.COMPLETE_N_NUMBER: {
      const nNumber = action.payload.nNumber;
      const fetchedUser = action.payload.fetchedUser;
      return {
        ...state,
        nNumber: {
          ...state.nNumber,
          value: nNumber
        },
        nNumberFetchedUser: fetchedUser
      };
    }
    case userFormActions.EDIT_PEN_CLICK_FORWARD_TO_TOGGLE: {
      const worker = action.payload;
      return {
        ...state,
        directDialNum: {
          ...state.directDialNum,
          value: formatE164PhoneNumber(worker.directDialNum),
          e164: undefined,
          updated: false,
          valid: true
        },
        inactiveForwardTo: {
          value: null,
          updated: false
        },
        outgoing: {
          ...state.outgoing,
          value: formatE164PhoneNumber(worker.attributes.did),
          e164: undefined,
          updated: false,
          valid: true
        },
        editDisabled: !state.editDisabled
      };
    }
    case userFormActions.EDIT_PEN_CLICK_NO_FORWARD_TO_TOGGLE: {
      return {
        ...state,
        editDisabled: !state.editDisabled
      };
    }
    case userFormActions.INITIATE_DID_FIELDS: {
      const zeroOutEnabled = state.didUser ? false : state.zeroOutEnabled;
      return {
        ...state,
        didUser: !state.didUser,
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
        zeroOutEnabled
      };
    }
    case userFormActions.INITIATE_ZERO_OUT_FIELDS: {
      return {
        ...state,
        zeroOutEnabled: !state.zeroOutEnabled,
        zeroOutEnabledUpdated: true
      };
    }
    case userFormActions.RESET_FORM: {
      return {
        ...initialUserFormState
      };
    }
    case userFormActions.RESET_FORM_AFTER_ADD: {
      const didUser = action.payload.didUser;
      const outgoingPayload = didUser ? { value: "" } : action.payload.outgoing;
      const profileId = action.payload.profileIdValue;
      const manager = action.payload.managerValue;

      return {
        ...initialUserFormState,
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
      };
    }
    case userFormActions.SET_BLUR_ON_FIELD: {
      const field = action.payload;
      return {
        ...state,
        [field]: {
          ...state[field],
          blurred: true
        }
      };
    }
    case userFormActions.SET_CALABRIO_USER: {
      return {
        ...state,
        calabrioUser: action.payload
      };
    }
    case userFormActions.SET_EXTENSION_MESSAGE: {
      const message = action.payload.message;
      const isError = action.payload.isError;
      return {
        ...state,
        extensionStatus: {
          ...state.extensionStatus,
          message: message,
          isError: isError,
          searchStatus: ExtensionSearchStatuses.Idle,
          retriesRemaining: searchParams.MaxRetries
        }
      };
    }
    case userFormActions.SET_EXTENSION_RETRIES: {
      const remaining = state.extensionStatus.retriesRemaining - 1;
      return {
        ...state,
        extensionStatus: {
          ...state.extensionStatus,
          searchStatus: remaining ? ExtensionSearchStatuses.PickANumber : ExtensionSearchStatuses.Idle,
          retriesRemaining: remaining
        }
      };
    }
    case userFormActions.SET_EXTENSION_VERIFIED: {
      return {
        ... state,
        extensionStatus: {
          ...state.extensionStatus,
          searchStatus: ExtensionSearchStatuses.Idle,
          retriesRemaining: searchParams.MaxRetries,
          message: "Verified",
          isError: false
        }
      };
    }

    case userFormActions.SET_UPDATE_FORM_STATE: {
      const worker = action.payload.worker;
      const managers = action.payload.managers;
      return {
        ...state,
        formMode: formModes.UPDATE,
        defaultSkills: getValidSkillsObject(worker.attributes.default_skills),
        extension: {
          ...state.extension,
          value: worker.attributes.extension || "",
          valid: true
        },
        extensionStatus: {
          ...state.extensionStatus,
          originalExtension: worker.attributes.extension || "",
          isError: false,
          message: ""
        },
        manager: {
          ...state.manager,
          value: JSON.stringify(managers.find((m: Manager) => m.manager_n_number === worker.attributes.manager_n_number))
        },
        nNumber: {
          ...state.nNumber,
          value: worker.attributes.n_number || "n"
        },
        outgoing: {
          ...state.outgoing,
          value: worker.attributes.did ? formatE164PhoneNumber(worker.attributes.did) : "",
          valid: worker.attributes.did ? true : false
        },
        profileId: {
          ...state.profileId,
          value: worker.attributes.profile_id
        },
        alternateDid: {
          ...state.alternateDid,
          value: worker.alternateDid ? formatE164PhoneNumber(worker.alternateDid) : "",
          valid: worker.alternateDid ? true : false
        },
        directDialNum: {
          ...state.directDialNum,
          value: worker.directDialNum ? formatE164PhoneNumber(worker.directDialNum) : "",
          valid: worker.directDialNum ? true : false
        },
        didUser: worker.directDialNum ? true : false,
        zeroOutEnabled: worker.zeroOutEnabled || false,
        editDisabled: worker.directDialNum ? true : false
      };
    }
    case userFormActions.SET_USER_PREVIOUSLY_ADDED_TRUE: {
      return {
        ...state,
        userPreviouslyAdded: true
      };
    }
    case userFormActions.UPDATE_DEFAULT_SKILLS: {
      const defaultSkills = action.payload;
      return {
        ...state,
        defaultSkillsUpdated: true,
        defaultSkills
      };
    }
    case userFormActions.UPDATE_EXTENSION: {
      const extension = action.payload.extension;
      const isValid = action.payload.isValid;
      const message = isValid ? "Extension is valid" : "";
      return {
        ...state,
        extension: {
          ...state.extension,
          value: extension,
          blurred: isValid,
          updated: true,
          valid: isValid
        },
        extensionStatus: {
          ...state.extensionStatus,
          message,
          searchStatus: ExtensionSearchStatuses.Idle,
          retriesRemaining: searchParams.MaxRetries
        }
      };
    }
    case userFormActions.UPDATE_INACTIVE_FORWARD_TO: {
      const inactiveForwardTo = action.payload;
      return {
        ...state,
        inactiveForwardTo: {
          value: inactiveForwardTo,
          updated: true
        }
      };
    }
    case userFormActions.UPDATE_MANAGER: {
      const manager = action.payload;
      return {
        ...state,
        manager: {
          ...state.manager,
          value: manager,
          updated: true
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
        [field]: {
          ...state[field],
          value,
          e164,
          updated: true,
          valid: isValid && (e164 ? true : false)
        }
      };
    }
    case userFormActions.UPDATE_TEAM: {
      const profileId = action.payload.profileId;
      const profiles = action.payload.profiles;
      return {
        ...state,
        profileId: {
          ...state.profileId,
          value: profileId,
          updated: true
        },
        zeroOutEnabled: getZeroOutEnabledFromProfile(profiles, profileId)
      };
    }
    default:
      return state;
  }
};
