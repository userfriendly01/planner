import {
  initialUserFormState,
  userFormReducer,
  userFormActions
} from "context";
import { formModes } from "globals";
import {
  getValidSkillsObject,
  formatE164PhoneNumber
} from "utils";

const profiles = [
  {
    profile_nme: "test1",
    profile_id: 1,
    overflow_skill: null
  },
  {
    profile_nme: "test2",
    profile_id: 2,
    overflow_skill: "whateverOverflowSkill"
  },
  {
    profile_nme: "test3",
    profile_id: 3,
    overflow_skill: "anotherOverflowSkill"
  }
];
const managers = [
  {
    manager_first_name: "John",
    manager_last_name: "Wick",
    manager_n_number: "n1234567",
    manager_id: "01"
  },
  {
    manager_first_name: "Test",
    manager_last_name: "Manager",
    manager_n_number: "n7454853",
    manager_id: "02"
  }
];
const validFormOptions = {
  alternateDid: {
    e164: "+18001234567",
    masked: "(800)123-4567",
    tenDig: "8001234567"
  },
  defaultSkills: {
    levels: {
      "a": 1,
      "b": 3
    },
    skills: ["a", "b", "c"]
  },
  did: "6034567890",
  didE164: "+16034567890",
  directDialNum: {
    e164: "+18002345678",
    masked: "(800)234-5678",
    tenDig: "8002345678"
  },
  extension: "1234",
  manager: managers[0],
  nNumber: "n1234567",
  profileId: profiles[0].profile_id
};
const workers = [
  {
    attributes: {
      default_skills: {
        skills: [
          "466",
          "psuUm"
        ],
        levels: {
          "466": 3
        }
      },
      full_name: "Test 1",
      office_location_name: "Neptune",
      routing: {
        skills: [
          "466",
          "psuUm"
        ],
        levels: {
          "466": 3
        }
      },
      profile_id: 15
    },
    sid: "WK0",
    skillsDifferent: false
  },
  {
    attributes: {
      full_name: "Test 2",
      office_location_name: "Uranus",
      profile_id: 15
    },
    sid: "WK1",
    skillsDifferent: false
  },
  {
    // DID worker with overflow skill
    sid: "WK2",
    activateEp: true,
    alternateDid: validFormOptions.alternateDid.e164,
    directDialNum: validFormOptions.directDialNum.e164,
    zeroOutEnabled: true,
    attributes: {
      default_skills: validFormOptions.defaultSkills,
      did: validFormOptions.didE164,
      extension: validFormOptions.extension,
      full_name: "Test 3",
      n_number: "n0263786",
      manager_first_name: validFormOptions.manager.manager_first_name,
      manager_last_name: validFormOptions.manager.manager_last_name,
      manager_n_number: validFormOptions.manager.manager_n_number,
      office_location_name: "Jupiter",
      profile_id: profiles[1].profile_id,
      routing: {
        skills: [
          profiles[1].overflow_skill,
          "whatever"
        ],
        levels: {
          "whatever": 1
        }
      }
    }
  },
  {
    // DID worker without overflow skill
    sid: "WK3",
    activateEp: true,
    alternateDid: validFormOptions.alternateDid.e164,
    directDialNum: validFormOptions.directDialNum.e164,
    zeroOutEnabled: true,
    attributes: {
      default_skills: validFormOptions.defaultSkills,
      did: validFormOptions.didE164,
      extension: validFormOptions.extension,
      full_name: "Test 4",
      manager_first_name: validFormOptions.manager.manager_first_name,
      manager_last_name: validFormOptions.manager.manager_last_name,
      manager_n_number: validFormOptions.manager.manager_n_number,
      office_location_name: "Pluto",
      profile_id: profiles[1].profile_id,
      routing: {
        skills: [
          "payinBills"
        ],
        levels: {
          "payinBills": 1
        }
      }
    }
  }
];

describe("userFormReducer", () => {
  describe("RESET_FORM_ON_CREATE", () => {
    test("should reset form to initial state", () => {
      const initialTestState = {
        ...initialUserFormState,
        profileId: {
          value: "2"
        }
      };
      const action = { type: userFormActions.RESET_FORM_ON_CREATE };
      const result = userFormReducer(initialTestState, action);
      expect(result).toStrictEqual(initialUserFormState);
    });
  });
  describe("SET_UPDATE_FORM_STATE for DID User", () => {
    test("should reset form to update state", () => {
      const worker = workers[2];
      const payload = {
        worker: workers[2],
        formMode: formModes.UPDATE,
        managers
      };
      const action = {
        type: userFormActions.SET_UPDATE_FORM_STATE,
        payload
      };
      const result = userFormReducer(initialUserFormState, action);
      const expectedFormState = {
        ...initialUserFormState,
        formMode: payload.formMode,
        defaultSkills: getValidSkillsObject(worker.attributes.default_skills),
        extension: {
          ...initialUserFormState.extension,
          value: worker.attributes.extension,
          valid: true
        },
        manager: {
          ...initialUserFormState.manager,
          value: JSON.stringify(managers.find(m => m.manager_n_number === worker.attributes.manager_n_number))
        },
        nNumber: {
          ...initialUserFormState.nNumber,
          value: worker.attributes.n_number
        },
        outgoing: {
          ...initialUserFormState.outgoing,
          value: formatE164PhoneNumber(worker.attributes.did),
          valid: true
        },
        profileId: {
          ...initialUserFormState.profileId,
          value: worker.attributes.profile_id
        },
        alternateDid: {
          ...initialUserFormState.alternateDid,
          value: formatE164PhoneNumber(worker.alternateDid),
          valid: true
        },
        directDialNum: {
          ...initialUserFormState.directDialNum,
          value: formatE164PhoneNumber(worker.directDialNum),
          valid: true
        },
        didUser: true,
        zeroOutEnabled: worker.zeroOutEnabled,
        editDisabled: true
      };
      expect(result).toStrictEqual(expectedFormState);
    });
  });
  describe("SET_UPDATE_FORM_STATE for NonDID User", () => {
    test("should reset form to update state", () => {
      const worker = workers[0];
      const payload = {
        worker: workers[0],
        formMode: formModes.UPDATE,
        managers
      };
      const action = {
        type: userFormActions.SET_UPDATE_FORM_STATE,
        payload
      };
      const result = userFormReducer(initialUserFormState, action);
      const expectedFormState = {
        ...initialUserFormState,
        formMode: payload.formMode,
        defaultSkills: getValidSkillsObject(worker.attributes.default_skills),
        extension: {
          ...initialUserFormState.extension,
          value: "",
          valid: true
        },
        manager: {
          ...initialUserFormState.manager,
          value: JSON.stringify(managers.find(m => m.manager_n_number === worker.attributes.manager_n_number))
        },
        nNumber: {
          ...initialUserFormState.nNumber,
          value: "n"
        },
        outgoing: {
          ...initialUserFormState.outgoing,
          value: "",
          valid: false
        },
        profileId: {
          ...initialUserFormState.profileId,
          value: worker.attributes.profile_id
        },
        alternateDid: {
          ...initialUserFormState.alternateDid,
          value: "",
          valid: false
        },
        directDialNum: {
          ...initialUserFormState.directDialNum,
          value: "",
          valid: false
        },
        didUser: false,
        zeroOutEnabled: false,
        editDisabled: false
      };
      expect(result).toStrictEqual(expectedFormState);
    });
  });
  describe("SET_BLUR_ON_FIELD", () => {
    test("should reset field blurred property to true", () => {
      const payload = "outgoing";
      const action = {
        type: userFormActions.SET_BLUR_ON_FIELD,
        payload
      };
      const result = userFormReducer(initialUserFormState, action);
      const expectedFormState = {
        ...initialUserFormState,
        outgoing: {
          ...initialUserFormState.outgoing,
          blurred: true
        }
      };
      expect(result).toStrictEqual(expectedFormState);
    });
  });
  describe("INITIATE_DID_FIELDS - DID User", () => {
    test("should initiate DID fields", () => {
      const action = { type: userFormActions.INITIATE_DID_FIELDS };
      const result = userFormReducer({
        ...initialUserFormState,
        didUser: true
      }, action);
      const expectedFormState = {
        ...initialUserFormState,
        didUser: false,
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
        zeroOutEnabled: false
      };
      expect(result).toStrictEqual(expectedFormState);
    });
  });
  describe("INITIATE_DID_FIELDS - NonDID User", () => {
    test("should initiate DID fields", () => {
      const action = { type: userFormActions.INITIATE_DID_FIELDS };
      const result = userFormReducer(initialUserFormState, action);
      const expectedFormState = {
        ...initialUserFormState,
        didUser: !initialUserFormState.didUser,
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
        zeroOutEnabled: false
      };
      expect(result).toStrictEqual(expectedFormState);
    });
  });
  describe("INITIATE_ZERO_OUT_FIELDS", () => {
    test("should initiate zero out fields", () => {
      const action = { type: userFormActions.INITIATE_ZERO_OUT_FIELDS };
      const result = userFormReducer(initialUserFormState, action);
      const expectedFormState = {
        ...initialUserFormState,
        zeroOutEnabled: !initialUserFormState.zeroOutEnabled,
        zeroOutEnabledUpdated: true
      };
      expect(result).toStrictEqual(expectedFormState);
    });
  });
  describe("UPDATE_MANAGER", () => {
    test("should update manager", () => {
      const payload = {
        manager_first_name: "Rebecca",
        manager_last_name: "Miller",
        manager_n_number: "n0001234"
      };
      const action = {
        type: userFormActions.UPDATE_MANAGER,
        payload
      };
      const result = userFormReducer(initialUserFormState, action);
      const expectedFormState = {
        ...initialUserFormState,
        manager: {
          ...initialUserFormState.manager,
          value: payload,
          updated: true
        }
      };
      expect(result).toStrictEqual(expectedFormState);
    });
  });
  describe("UPDATE_TEAM", () => {
    test("should update team", () => {
      const payload = {
        profileId: profiles[0].profile_id,
        profiles
      };
      const action = {
        type: userFormActions.UPDATE_TEAM,
        payload
      };
      const result = userFormReducer(initialUserFormState, action);
      const expectedFormState = {
        ...initialUserFormState,
        profileId: {
          ...initialUserFormState.profileId,
          value: payload.profileId,
          updated: true
        },
        zeroOutEnabled: false
      };
      expect(result).toStrictEqual(expectedFormState);
    });
  });
  describe("UPDATE_PHONE_NUMBER with e164", () => {
    test("should update phone number", () => {
      const payload = {
        field: "outgoing",
        maskedValue: "(603) 851-8200",
        isValid: true,
        e164Number: "+16038518200"
      };
      const action = {
        type: userFormActions.UPDATE_PHONE_NUMBER,
        payload
      };
      const result = userFormReducer(initialUserFormState, action);
      const expectedFormState = {
        ...initialUserFormState,
        outgoing: {
          ...initialUserFormState.outgoing,
          value: payload.maskedValue,
          e164: payload.e164Number,
          updated: true,
          valid: true
        }
      };
      expect(result).toStrictEqual(expectedFormState);
    });
  });
  describe("UPDATE_PHONE_NUMBER without e164", () => {
    test("should update phone number", () => {
      const payload = {
        field: "outgoing",
        maskedValue: "(603) 851-8200",
        isValid: true,
        e164Number: ""
      };
      const action = {
        type: userFormActions.UPDATE_PHONE_NUMBER,
        payload
      };
      const result = userFormReducer(initialUserFormState, action);
      const expectedFormState = {
        ...initialUserFormState,
        outgoing: {
          ...initialUserFormState.outgoing,
          value: payload.maskedValue,
          e164: payload.e164Number,
          updated: true,
          valid: false
        }
      };
      expect(result).toStrictEqual(expectedFormState);
    });
  });
  describe("UPDATE_N_NUMBER", () => {
    test("should update nNumber", () => {
      const payload = "n0263786";
      const action = {
        type: userFormActions.UPDATE_N_NUMBER,
        payload
      };
      const result = userFormReducer(initialUserFormState, action);
      const expectedFormState = {
        ...initialUserFormState,
        nNumber: {
          ...initialUserFormState.nNumber,
          value: payload,
          updated: true
        }
      };
      expect(result).toStrictEqual(expectedFormState);
    });
  });
  describe("COMPLETE_N_NUMBER", () => {
    test("should update fetched user", () => {
      const payload = {
        nNumber: "n0263786",
        fetchedUser: {
          firstName: "Faith",
          lastName: "Cuneo"
        }
      };
      const action = {
        type: userFormActions.COMPLETE_N_NUMBER,
        payload
      };
      const result = userFormReducer(initialUserFormState, action);
      const expectedFormState = {
        ...initialUserFormState,
        nNumber: {
          ...initialUserFormState.nNumber,
          value: payload.nNumber
        },
        nNumberFetchedUser: payload.fetchedUser
      };
      expect(result).toStrictEqual(expectedFormState);
    });
  });
  describe("CLEAR_N_NUMBER", () => {
    test("should clear nNumber", () => {
      const action = { type: userFormActions.CLEAR_N_NUMBER };
      const startingFormState = {
        ...initialUserFormState,
        nNumber: {
          ...initialUserFormState.nNumber,
          value: "n0263786"
        },
        nNumberFetchedUser: {
          firstName: "Faith",
          lastName: "Cuneo"
        }
      };
      const result = userFormReducer(startingFormState, action);
      expect(result).toStrictEqual(initialUserFormState);
    });
  });
  describe("UPDATE_DEFAULT_SKILLS", () => {
    test("should update default skills", () => {
      const payload = workers[0].default_skills;
      const action = {
        type: userFormActions.UPDATE_DEFAULT_SKILLS,
        payload
      };
      const result = userFormReducer(initialUserFormState, action);
      const expectedFormState = {
        ...initialUserFormState,
        defaultSkillsUpdated: true,
        defaultSkills: workers[0].default_skills
      };
      expect(result).toStrictEqual(expectedFormState);
    });
  });
  describe("UPDATE_INACTIVE_FORWARD_TO", () => {
    test("should update inactive forward to", () => {
      const payload = "WK1231112";
      const action = {
        type: userFormActions.UPDATE_INACTIVE_FORWARD_TO,
        payload
      };
      const result = userFormReducer(initialUserFormState, action);
      const expectedFormState ={
        ...initialUserFormState,
        inactiveForwardTo: {
          value: payload,
          updated: true
        }
      };
      expect(result).toStrictEqual(expectedFormState);
    });
  });
  describe("UPDATE_EXTENSION", () => {
    test("should update extension", () => {
      const payload = {
        extension: validFormOptions.extension,
        isValid: true
      };
      const action = {
        type: userFormActions.UPDATE_EXTENSION,
        payload
      };
      const result = userFormReducer(initialUserFormState, action);
      const expectedFormState ={
        ...initialUserFormState,
        extension: {
          ...initialUserFormState.extension,
          value: validFormOptions.extension,
          blurred: payload.isValid,
          updated: true,
          valid: payload.isValid
        }
      };
      expect(result).toStrictEqual(expectedFormState);
    });
  });
  describe("CLEAR_EXTENSION", () => {
    test("should clear extension", () => {
      const action = { type: userFormActions.CLEAR_EXTENSION };
      const initialTestState = {
        ...initialUserFormState,
        extension: {
          ...initialUserFormState.extension,
          value: validFormOptions.extension,
          blurred: true,
          updated: true,
          valid: true
        }
      };
      const result = userFormReducer(initialTestState, action);
      const expectedFormState = {
        ...initialTestState,
        extension: {
          ...initialTestState.extension,
          value: "",
          valid: false
        }
      };
      expect(result).toStrictEqual(expectedFormState);
    });
  });
  describe("EDIT_PEN_CLICK_FORWARD_TO_TOGGLE", () => {
    test("should set forward to toggle fields", () => {
      const payload = workers[2];
      const action = {
        type: userFormActions.EDIT_PEN_CLICK_FORWARD_TO_TOGGLE,
        payload
      };
      const result = userFormReducer(initialUserFormState, action);
      const expectedFormState = {
        ...initialUserFormState,
        directDialNum: {
          ...initialUserFormState.directDialNum,
          value: formatE164PhoneNumber(workers[2].directDialNum),
          e164: undefined,
          updated: false,
          valid: true
        },
        inactiveForwardTo: {
          value: null,
          updated: false
        },
        outgoing: {
          ...initialUserFormState.outgoing,
          value: formatE164PhoneNumber(workers[2].attributes.did),
          e164: undefined,
          updated: false,
          valid: true
        },
        editDisabled: !initialUserFormState.editDisabled
      };
      expect(result).toStrictEqual(expectedFormState);
    });
  });
  describe("EDIT_PEN_CLICK_NO_FORWARD_TO_TOGGLE", () => {
    test("should reset forward to toggle", () => {
      const action = { type: userFormActions.EDIT_PEN_CLICK_NO_FORWARD_TO_TOGGLE };
      const initialTestState = {
        ...initialUserFormState,
        directDialNum: {
          ...initialUserFormState.directDialNum,
          value: formatE164PhoneNumber(workers[2].directDialNum),
          e164: undefined,
          updated: false,
          valid: true
        },
        inactiveForwardTo: {
          value: null,
          updated: false
        },
        outgoing: {
          ...initialUserFormState.outgoing,
          value: formatE164PhoneNumber(workers[2].attributes.did),
          e164: undefined,
          updated: false,
          valid: true
        },
        editDisabled: !initialUserFormState.editDisabled
      };
      const result = userFormReducer(initialTestState, action);
      expect(result).toStrictEqual({
        ...initialTestState,
        editDisabled: !initialTestState.editDisabled
      });
    });
  });
  describe("Default Case", () => {
    test("should return state", () => {
      const action = { type: "default" };
      const result = userFormReducer(initialUserFormState, action);
      expect(result).toStrictEqual(initialUserFormState);
    });
  });
});