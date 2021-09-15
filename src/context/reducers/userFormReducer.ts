import {
  Action,
  UserEntryFormState,
  TritonProfile,
  formModes
} from "../../globals";
import {
  getValidSkillsObject,
  formatE164PhoneNumber
} from "utils";

export const userFormActions = {
  SET_UPDATE_FORM_STATE: "SET_UPDATE_FORM_STATE",
  UPDATE_PHONE_NUMBER: "UPDATE_PHONE_NUMBER",
  SET_BLUR_ON_FIELD: "SET_BLUR_ON_FIELD",
  EDIT_PEN_CLICK_FORWARD_TO_TOGGLE: "EDIT_PEN_CLICK_FORWARD_TO_TOGGLE",
  EDIT_PEN_CLICK_NO_FORWARD_TO_TOGGLE: "EDIT_PEN_CLICK_NO_FORWARD_TO_TOGGLE",
  RESET_FORM_ON_CREATE: "RESET_FORM_ON_CREATE",
  UPDATE_MANAGER: "UPDATE_MANAGER",
  UPDATE_TEAM: "UPDATE_TEAM",
  CLEAR_N_NUMBER: "CLEAR_N_NUMBER",
  UPDATE_N_NUMBER: "UPDATE_N_NUMBER",
  COMPLETE_N_NUMBER: "COMPLETE_N_NUMBER",
  CLEAR_EXTENSION: "CLEAR_EXTENSION",
  UPDATE_EXTENSION: "UPDATE_EXTENSION",
  INITIATE_DID_FIELDS: "INITIATE_DID_FIELDS",
  INITIATE_ZERO_OUT_FIELDS: "INITIATE_ZERO_OUT_FIELDS",
  UPDATE_DEFAULT_SKILLS: "UPDATE_DEFAULT_SKILLS",
  UPDATE_INACTIVE_FORWARD_TO: "UPDATE_INACTIVE_FORWARD_TO"
};

const initialDefaultSkills = getValidSkillsObject();
const getTargetProfile = (profiles: TritonProfile[], newProfileValue: string) => profiles.find((profile: any) => profile.profile_id === +newProfileValue);
const getZeroOutEnabledFromProfile = (profiles: TritonProfile[], newProfileValue: string): boolean => getTargetProfile(profiles, newProfileValue).overflow_skill !== null;

export const initialUserFormState: UserEntryFormState = {
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
  zeroOutEnabled: false,
  zeroOutEnabledUpdated: false,
  editDisabled: false
};

export const userFormReducer = (state: UserEntryFormState, action: Action): UserEntryFormState => {
  switch (action.type) {
    case userFormActions.RESET_FORM_ON_CREATE: {
      return {
        ...initialUserFormState
      };
    }
    case userFormActions.SET_UPDATE_FORM_STATE: {
      const worker = action.payload.worker;
      const managers = action.payload.managers;
      const formMode = action.payload.formMode;
      return {
        ...state,
        formMode,
        defaultSkills: getValidSkillsObject(worker.attributes.default_skills),
        extension: {
          ...state.extension,
          value: worker.attributes.extension || "",
          valid: true
        },
        manager: {
          ...state.manager,
          value: JSON.stringify(managers.find((m: any) => m.manager_n_number === worker.attributes.manager_n_number))
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
    case userFormActions.UPDATE_DEFAULT_SKILLS: {
      const defaultSkills = action.payload;
      return {
        ...state,
        defaultSkillsUpdated: true,
        defaultSkills
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
    case userFormActions.UPDATE_EXTENSION: {
      const extension = action.payload.extension;
      const isValid = action.payload.isValid;
      return {
        ...state,
        extension: {
          ...state.extension,
          value: extension,
          blurred: isValid,
          updated: true,
          valid: isValid
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
        }
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
    default:
      return state;
  }
};