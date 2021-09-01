import {
  Action,
  UserEntryFormState,
  TwilioWorker,
  TritonProfile,
  TwilioWorkerSkills
} from "../../globals/interfaces";
import {
  getValidSkillsObject,
  formatE164PhoneNumber
} from "utils";

const SET_UPDATE_FORM_STATE = "SET_UPDATE_FORM_STATE";
const UPDATE_PHONE_NUMBER = "UPDATE_PHONE_NUMBER";
const SET_BLUR_ON_FIELD = "SET_BLUR_ON_FIELD";
const EDIT_PEN_CLICK_FORWARD_TO_TOGGLE = "EDIT_PEN_CLICK_FORWARD_TO_TOGGLE";
const EDIT_PEN_CLICK_NO_FORWARD_TO_TOGGLE = "EDIT_PEN_CLICK_NO_FORWARD_TO_TOGGLE";
const RESET_FORM_ON_CREATE = "RESET_FORM_ON_CREATE";
const UPDATE_MANAGER = "UPDATE_MANAGER";
const UPDATE_TEAM = "UPDATE_TEAM";
const CLEAR_N_NUMBER = "CLEAR_N_NUMBER";
const UPDATE_N_NUMBER = "UPDATE_N_NUMBER";
const COMPLETE_N_NUMBER = "COMPLETE_N_NUMBER";
const CLEAR_EXTENSION = "CLEAR_EXTENSION";
const UPDATE_EXTENSION = "UPDATE_EXTENSION";
const INITIATE_DID_FIELDS = "INITIATE_DID_FIELDS";
const INITIATE_ZERO_OUT_FIELDS = "INITIATE_ZERO_OUT_FIELDS";
const UPDATE_DEFAULT_SKILLS = "UPDATE_DEFAULT_SKILLS";
const UPDATE_INACTIVE_FORWARD_TO = "UPDATE_INACTIVE_FORWARD_TO";

const initialDefaultSkills = getValidSkillsObject();
const getTargetProfile = (profiles: TritonProfile[], newProfileValue: string) => profiles.find((profile: any) => profile.profile_id === +newProfileValue);
const getZeroOutEnabledFromProfile = (profiles: TritonProfile[], newProfileValue: string): boolean => getTargetProfile(profiles, newProfileValue).overflow_skill !== null;

export const UserFormActions = {
  setUpdateFormState: (payload: { worker: TwilioWorker, managers: any[]}): Action => ({
    type: SET_UPDATE_FORM_STATE,
    payload
  }),
  updatePhoneNumber: (payload: { field: string, maskedValue: string, isValid: boolean, e164Number: string }): Action => ({
    type: UPDATE_PHONE_NUMBER,
    payload
  }),
  setBlurOnField: (payload: string): Action => ({
    type: SET_BLUR_ON_FIELD,
    payload
  }),
  editPenClickForwardToToggle: (payload: TwilioWorker): Action => ({
    type: EDIT_PEN_CLICK_FORWARD_TO_TOGGLE,
    payload
  }),
  editPenClickNoForwardToToggle: (): Action => ({
    type: EDIT_PEN_CLICK_NO_FORWARD_TO_TOGGLE,
    payload: null
  }),
  resetFormOnCreate: (): Action => ({
    type: RESET_FORM_ON_CREATE,
    payload: null
  }),
  updateManager: (payload: string): Action => ({
    type: UPDATE_MANAGER,
    payload
  }),
  updateTeam: (payload: { profileId: string, profiles: TritonProfile[] }): Action => ({
    type: UPDATE_TEAM,
    payload
  }),
  clearNNumber: (): Action => ({
    type: CLEAR_N_NUMBER,
    payload: null
  }),
  updateNNumber: (payload: string): Action => ({
    type: UPDATE_N_NUMBER,
    payload
  }),
  completeNNumber: (payload: { nNumber: string, fetchedUser: any }): Action => ({
    type: COMPLETE_N_NUMBER,
    payload
  }),
  clearExtension: (): Action => ({
    type: CLEAR_EXTENSION,
    payload: null
  }),
  updateExtension: (payload: { extension: string, isValid: boolean }): Action => ({
    type: UPDATE_EXTENSION,
    payload
  }),
  initiateDidFields: (): Action => ({
    type: INITIATE_DID_FIELDS,
    payload: null
  }),
  initiateZeroOutFields: (): Action => ({
    type: INITIATE_ZERO_OUT_FIELDS,
    payload: null
  }),
  updateDefaultSkills: (payload: TwilioWorkerSkills): Action => ({
    type: UPDATE_DEFAULT_SKILLS,
    payload
  }),
  updateInactiveForwardTo: (payload: string): Action => ({
    type: UPDATE_INACTIVE_FORWARD_TO,
    payload
  })
};

export const initialUserFormState: UserEntryFormState = {
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
    case SET_UPDATE_FORM_STATE: {
      const worker = action.payload.worker;
      const managers = action.payload.managers;
      return {
        ...state,
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
    case UPDATE_PHONE_NUMBER: {
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
    case SET_BLUR_ON_FIELD: {
      const field = action.payload.field;
      return {
        ...state,
        [field]: {
          ...state[field],
          blurred: true
        }
      };
    }
    case EDIT_PEN_CLICK_FORWARD_TO_TOGGLE: {
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
    case EDIT_PEN_CLICK_NO_FORWARD_TO_TOGGLE: {
      return {
        ...state,
        editDisabled: !state.editDisabled
      };
    }
    case RESET_FORM_ON_CREATE: {
      return {
        ...initialUserFormState
      };
    }
    case UPDATE_MANAGER: {
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
    case UPDATE_TEAM: {
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
    case CLEAR_N_NUMBER: {
      return {
        ...state,
        nNumber: {
          ...state.nNumber,
          value: "n",
          updated: true
        },
        nNumberFetchedUser: null
      };
    }
    case UPDATE_N_NUMBER: {
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
    case COMPLETE_N_NUMBER: {
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
    case CLEAR_EXTENSION: {
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
    case UPDATE_EXTENSION: {
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
    case INITIATE_DID_FIELDS: {
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
        }
      };
    }
    case INITIATE_ZERO_OUT_FIELDS: {
      return {
        ...state,
        zeroOutEnabled: !state.zeroOutEnabled,
        zeroOutEnabledUpdated: true
      };
    }
    case UPDATE_DEFAULT_SKILLS: {
      const defaultSkills = action.payload;
      return {
        ...state,
        defaultSkillsUpdated: true,
        defaultSkills
      };
    }
    case UPDATE_INACTIVE_FORWARD_TO: {
      const inactiveForwardTo = action.payload;
      return {
        ...state,
        inactiveForwardTo: {
          value: inactiveForwardTo,
          updated: true
        }
      };
    }
    default:
      return state;
  }
};