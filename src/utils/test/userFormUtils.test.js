import { formModes } from "globals";
import {
  isProfileIdValid,
  isManagerValid,
  isNNumberValid,
  isExtensionValid,
  isInactiveForwardToValid,
  isDidDifferentValid,
  getTargetProfile,
  getOverflowSkillFromProfile,
  getOverflowSkills,
  workerHasOverFlowSkill,
  getNonOverflowSkills,
  isFormUpdated,
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
const initialFormState = {
  formMode: formModes.INSERT,
  defaultSkills: [],
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

describe("isProfileIdValid", () => {
  test("should return true when profile is populated", () => {
    const form = {
      profileId: {
        value: "2"
      }
    };
    const result = isProfileIdValid(form);
    expect(result).toBe(true);
  });
  test("should return false when profile is empty string", () => {
    const form = {
      profileId: {
        value: ""
      }
    };
    const result = isProfileIdValid(form);
    expect(result).toBe(false);
  });
});

describe("isManagerValid", () => {
  test("should return true when manager is populated", () => {
    const form = {
      manager: {
        value: "Rebecca"
      }
    };
    const result = isManagerValid(form);
    expect(result).toBe(true);
  });
  test("should return false when manager is empty string", () => {
    const form = {
      manager: {
        value: ""
      }
    };
    const result = isManagerValid(form);
    expect(result).toBe(false);
  });
});

describe("isNNumberValid", () => {
  test("should return true when nNumberFetchedUser is populated", () => {
    const form = {
      nNumberFetchedUser: {
        whatever: "Mike"
      }
    };
    const result = isNNumberValid(form);
    expect(result).toBe(true);
  });
  test("should return false when nNumberFetchedUser is not populated", () => {
    const form = {
      nNumberFetchedUser: null
    };
    const result = isNNumberValid(form);
    expect(result).toBe(false);
  });
});

describe("isExtensionValid", () => {
  test("should return true when extension is valid", () => {
    const form = {
      extension: {
        valid: true,
        value: "5245"
      }
    };
    const result = isExtensionValid(form);
    expect(result).toBe(true);
  });
  test("should return true when extension is empty string", () => {
    const form = {
      extension: {
        value: "",
        valid: false
      }
    };
    const result = isExtensionValid(form);
    expect(result).toBe(true);
  });
  test("should return false when extension is invalid and value is not an empty string", () => {
    const form = {
      extension: {
        valid: false,
        value: "5245"
      }
    };
    const result = isExtensionValid(form);
    expect(result).toBe(false);
  });
});

describe("isInactiveForwardToValid", () => {
  describe("forwardToToggle === true", () => {
    test("should return true when inactiveForwardTo is not null", () => {
      const form = {
        inactiveForwardTo: {
          value: "WK12334"
        }
      };
      const result = isInactiveForwardToValid(form, true);
      expect(result).toBe(true);
    });
    test("should return false when inactiveForwardTo is null", () => {
      const form = {
        inactiveForwardTo: {
          value: null
        }
      };
      const result = isInactiveForwardToValid(form, true);
      expect(result).toBe(false);
    });
  });
  describe("forwardToToggle === false", () => {
    test("should return true", () => {
      const result = isInactiveForwardToValid({}, false);
      expect(result).toBe(true);
    });
  });
});

describe("isDidDifferentValid", () => {
  describe("forwardToToggle === true", () => {
    test("should return true if both outgoing and directDial Num have been changed", () => {
      const form = {
        outgoing: {
          value: "+16038518200"
        },
        directDialNum: {
          value: "+16032453160"
        }
      };
      const result = isDidDifferentValid(form, mockWorkers[2], true);
      expect(result).toBe(true);
    });
    test("should return true if both outgoing and directDial Num are unchanged", () => {
      const form = {
        outgoing: {
          value: validFormOptions.didE164
        },
        directDialNum: {
          value: validFormOptions.directDialNum.e164
        }
      };
      const result = isDidDifferentValid(form, mockWorkers[2], true);
      expect(result).toBe(true);
    });
    test("should return false if only one number is changed", () => {
      const form = {
        outgoing: {
          value: "+16038518200"
        },
        directDialNum: {
          value: validFormOptions.directDialNum.tenDig
        }
      };
      const result = isDidDifferentValid(form, mockWorkers[2], true);
      expect(result).toBe(false);
    });
  });
  describe("forwardToToggle === false", () => {
    test("should return true", () => {
      const result = isDidDifferentValid({}, mockWorkers[2], false);
      expect(result).toBe(true);
    });
  });
});

describe("getTargetProfile", () => {
  test("should return profile when found in profile list", () => {
    const result = getTargetProfile(profileList, "2");
    expect(result).toStrictEqual(profileList[1]);
  });
  test("should return undefined if profile is not found", () => {
    const result = getTargetProfile(profileList, "4");
    expect(result).toBe(undefined);
  });
});

describe("getOverflowSkillFromProfile", () => {
  test("should return skill if profile has overflow skill", () => {
    const result = getOverflowSkillFromProfile(profileList, profileList[1].profile_id);
    expect(result).toBe("whateverOverflowSkill");
  });
  test("should return undefined if profile does not have overflow skill", () => {
    const result = getOverflowSkillFromProfile(profileList, profileList[0].profile_id);
    expect(result).toBe(undefined);
  });
});

describe("getOverflowSkills", () => {
  test("should return overflow skills from profile list", () => {
    const result = getOverflowSkills(profileList);
    expect(result).toStrictEqual(["whateverOverflowSkill", "anotherOverflowSkill"]);
  });
});

describe("workerHasOverFlowSkill", () => {
  test("should return true if worker has overflow skill", () => {
    const worker = {
      attributes: {
        routing: {
          skills: ["aisgL1", "whateverOverflowSkill"]
        }
      }
    };
    const result = workerHasOverFlowSkill(worker, profileList);
    expect(result).toBe(true);
  });
  test("should return false if worker does not have overflow skill", () => {
    const worker = {
      attributes: {
        routing: {
          skills: ["aisgL1"]
        }
      }
    };
    const result = workerHasOverFlowSkill(worker, profileList);
    expect(result).toBe(false);
  });
});

describe("getNonOverflowSkills", () => {
  test("should return non overflow skills", () => {
    const worker = {
      attributes: {
        routing: {
          skills: ["aisgL1"]
        }
      }
    };
    const result = getNonOverflowSkills(worker, profileList);
    expect(result).toStrictEqual(["aisgL1"]);
  });
});

describe("isFormUpdated", () => {
  test("form was not updated", () => {
    const result = isFormUpdated(initialFormState);
    expect(result).toBe(false);
  });
  test("form.defaultSkillsUpdated was updated", () => {
    const updatedForm = {
      ...initialFormState,
      defaultSkillsUpdated: true
    };
    const result = isFormUpdated(updatedForm);
    expect(result).toBe(true);
  });
  test("form.manager.updated was updated", () => {
    const updatedForm = {
      ...initialFormState,
      manager: {
        updated: true
      }
    };
    const result = isFormUpdated(updatedForm);
    expect(result).toBe(true);
  });
  test("form.profileId.updated was updated", () => {
    const updatedForm = {
      ...initialFormState,
      profileId: {
        updated: true
      }
    };
    const result = isFormUpdated(updatedForm);
    expect(result).toBe(true);
  });
  test("form.outgoing.updated was updated", () => {
    const updatedForm = {
      ...initialFormState,
      outgoing: {
        updated: true
      }
    };
    const result = isFormUpdated(updatedForm);
    expect(result).toBe(true);
  });
  test("form.alternateDid.updated was updated", () => {
    const updatedForm = {
      ...initialFormState,
      alternateDid: {
        updated: true
      }
    };
    const result = isFormUpdated(updatedForm);
    expect(result).toBe(true);
  });
  test("form.directDialNum.updated was updated", () => {
    const updatedForm = {
      ...initialFormState,
      directDialNum: {
        updated: true
      }
    };
    const result = isFormUpdated(updatedForm);
    expect(result).toBe(true);
  });
  test("form.nNumber.updated was updated", () => {
    const updatedForm = {
      ...initialFormState,
      nNumber: {
        updated: true
      }
    };
    const result = isFormUpdated(updatedForm);
    expect(result).toBe(true);
  });
  test("form.extension.updated was updated", () => {
    const updatedForm = {
      ...initialFormState,
      extension: {
        updated: true
      }
    };
    const result = isFormUpdated(updatedForm);
    expect(result).toBe(true);
  });
  test("form.inactiveForwardTo.updated was updated", () => {
    const updatedForm = {
      ...initialFormState,
      inactiveForwardTo: {
        updated: true
      }
    };
    const result = isFormUpdated(updatedForm);
    expect(result).toBe(true);
  });
  test("form.zeroOutEnabledUpdated was updated", () => {
    const updatedForm = {
      ...initialFormState,
      zeroOutEnabledUpdated: true
    };
    const result = isFormUpdated(updatedForm);
    expect(result).toBe(true);
  });
});

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
          formMode: formModes.UPDATE,
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