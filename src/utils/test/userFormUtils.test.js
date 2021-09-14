import { formModes } from "globals";
import {
  isFormValid
} from "../userFormUtils";

const managerList = [
  {
    manager_first_name: "John",
    manager_last_name: "Wick",
    manager_n_number: "n1234567"
  },
  {
    manager_first_name: "Test",
    manager_last_name: "Manager",
    manager_n_number: "n7454853"
  }
];

const profileList = [
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
  manager: managerList[0],
  nNumber: "n1234567",
  profileId: profileList[0].profile_id
};

const mockWorkers = [
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
      manager_first_name: validFormOptions.manager.manager_first_name,
      manager_last_name: validFormOptions.manager.manager_last_name,
      manager_n_number: validFormOptions.manager.manager_n_number,
      office_location_name: "Jupiter",
      profile_id: profileList[1].profile_id,
      routing: {
        skills: [
          profileList[1].overflow_skill,
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
      profile_id: profileList[1].profile_id,
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

const validFormState = {
  formMode: formModes.INSERT,
  defaultSkills: [],
  defaultSkillsUpdated: false,
  didUser: false,
  extension: {
    value: "5245",
    blurred: false,
    updated: true,
    valid: true
  },
  inactiveForwardTo: {
    value: null,
    updated: false
  },
  manager: {
    value: "Rebecca Miller",
    blurred: false,
    updated: true
  },
  nNumber: {
    value: "n0263786",
    blurred: false,
    updated: true
  },
  nNumberFetchedUser: {
    nNumber: "n0263786",
    firstName: "Faith",
    lastName: "Cuneo"
  },
  outgoing: {
    value: "6038518200",
    blurred: false,
    e164: "+16038518200",
    updated: true,
    valid: true
  },
  profileId: {
    value: "2",
    blurred: false,
    updated: true
  },
  alternateDid: {
    value: "6032453160",
    blurred: false,
    e164: "+16032453160",
    updated: true,
    valid: true
  },
  directDialNum: {
    value: "6032453160",
    blurred: false,
    e164: "+16032453160",
    updated: true,
    valid: true
  },
  zeroOutEnabled: false,
  zeroOutEnabledUpdated: false,
  editDisabled: false
};

describe("isFormValid", () => {
  describe("Form is valid", () => {
    describe("forwardToToggle === true", () => {
      test("isFormValid should return true", () => {
        const form = {
          ...validFormState,
          inactiveForwardTo: {
            ...validFormState.inactiveForwardTo,
            value: "WK2345123"
          }
        };
        expect(isFormValid(form, mockWorkers[2], true)).toBe(true);
      });
    });
    describe("form.didUser === true && forwardToToggle === false", () => {
      test("isFormValid should return true", () => {
        expect(isFormValid(validFormState, mockWorkers[0], false)).toBe(true);
      });
    });
    describe("extension is empty", () => {
      test("isFormValid should return true", () => {
        const form = {
          ...validFormState,
          extension: {
            ...validFormState.extension,
            valid: false,
            value: ""
          }
        };
        expect(isFormValid(form, mockWorkers[0], false)).toBe(true);
      });
    });
  });
  describe("Form is invalid", () => {
    describe(`form.formMode === ${formModes.INSERT} && nNumberFetchedUser is null`, () => {
      test("isFormValid should return false", () => {
        const form = {
          ...validFormState,
          nNumberFetchedUser: null
        };
        expect(isFormValid(form, mockWorkers[0], false)).toBe(false);
      });
    });
    describe("Profile Id is empty string", () => {
      test("isFormValid should return false", () => {
        const form = {
          ...validFormState,
          profileId: {
            ...validFormState.profileId,
            value: ""
          }
        };
        expect(isFormValid(form, mockWorkers[0], false)).toBe(false);
      });
    });
    describe("Manager is empty string", () => {
      test("isFormValid should return false", () => {
        const form = {
          ...validFormState,
          manager: {
            ...validFormState.manager,
            value: ""
          }
        };
        expect(isFormValid(form, mockWorkers[0], false)).toBe(false);
      });
    });
    describe("Outgoing number is not valid", () => {
      test("isFormValid should return false", () => {
        const form = {
          ...validFormState,
          outgoing: {
            ...validFormState.outgoing,
            valid: false
          }
        };
        expect(isFormValid(form, mockWorkers[0], false)).toBe(false);
      });
    });
    describe("Extension is not valid", () => {
      test("isFormValid should return false", () => {
        const form = {
          ...validFormState,
          extension: {
            ...validFormState.extension,
            valid: false
          }
        };
        expect(isFormValid(form, mockWorkers[0], false)).toBe(false);
      });
    });
    describe("inactiveForwardTo is not valid", () => {
      describe("forwardToToggle === true", () => {
        const form = {
          ...validFormState,
          inactiveForwardTo: {
            ...validFormState.inactiveForwardTo,
            value: null
          }
        };
        expect(isFormValid(form, mockWorkers[0], true)).toBe(false);
      });
    });
    describe("form.didUser === true", () => {
      describe("Direct Dial Number is not valid", () => {
        test("isFormValid should return false", () => {
          const form = {
            ...validFormState,
            didUser: true,
            directDialNum: {
              ...validFormState.directDialNum,
              valid: false
            }
          };
          expect(isFormValid(form, mockWorkers[2], false)).toBe(false);
        });
      });
      describe("Alternate DID is not valid", () => {
        test("isFormValid should return false", () => {
          const form = {
            ...validFormState,
            didUser: true,
            alternateDid: {
              ...validFormState.alternateDid,
              valid: false
            }
          };
          expect(isFormValid(form, mockWorkers[2], false)).toBe(false);
        });
      });
      describe("forwardToToggle === true", () => {
        describe("Outgoing number was updated but Direct Dial Number was not", () => {
          test("isFormValid should return false", () => {
            const form = {
              ...validFormState,
              directDialNum: {
                ...validFormState.directDialNum,
                updated: false,
                value: validFormOptions.directDialNum
              }
            };
            expect(isFormValid(form, mockWorkers[2], true)).toBe(false);
          });
        });
        describe("Direct Dial number was updated but Outbound Number was not", () => {
          test("isFormValid should return false", () => {
            const form = {
              ...validFormState,
              outbound: {
                ...validFormState.outbound,
                updated: false,
                value: validFormOptions.didE164
              }
            };
            expect(isFormValid(form, mockWorkers[2], true)).toBe(false);
          });
        });
      });
    });
  });
});