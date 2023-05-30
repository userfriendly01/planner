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
  removeProfileZeroIfAdminNotInProfileZero,
  getOverflowSkills,
  workerHasOverFlowSkill,
  getNonOverflowSkills,
  isFormUpdated,
  isFormValid,
  isQMUserValid,
  isWfmUserValid,
  fetchUser as fetchUserUtil,
  findMatchingWorker,
  identifyProfileDiscrepancies,
  identifyUserProfiles
} from "../userManagementUtils";
import { fetchUser } from "services";
import {
  initialTestState,
  initialFormState,
  validFormState
} from "testUtils";

jest.mock("services", () => ({
  fetchUser: jest.fn()
}));

const mockSetForm = jest.fn();

const adminStateIsAdmin = {
  userContext: {
    pingIdentity: {
      groups: ["CN=gci-cicct-triton-prod-admin"]
    }
  }
};

const adminStateIsNotAdmin = {
  userContext: {
    pingIdentity: {
      groups: ["CN=gci-cicct-triton-not-admin"]
    }
  }
};
const adminStateIsErroneous = {
  frog: {
    merp: {
      bloop: ["ribbit"]
    }
  }
};
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
const profileListWithZero = [
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
  },
  {
    profile_nme: "test0",
    profile_id: 0,
    overflow_skill: "anotherOverflowSkill"
  }
];
const validFormOptions = {
  calabrioUser: {
    team: 214,
    roles: ["imarole"]
  },
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
    selfServiceInd: true,
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
    selfServiceInd: true,
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

describe("isProfileIdValid", () => {
  test("should return true when profile is populated", () => {
    const form = {
      triton: {
        profileId: {
          value: "2"
        }
      }
    };
    const result = isProfileIdValid(form);
    expect(result).toBe(true);
  });
  test("should return false when profile is empty string", () => {
    const form = {
      triton: {
        profileId: {
          value: ""
        }
      }
    };
    const result = isProfileIdValid(form);
    expect(result).toBe(false);
  });
});
describe("isManagerValid", () => {
  test("should return true when manager is populated", () => {
    const form = {
      triton: {
        manager: {
          value: "Rebecca"
        }
      }
    };
    const result = isManagerValid(form);
    expect(result).toBe(true);
  });
  test("should return false when manager is empty string", () => {
    const form = {
      triton: {
        manager: {
          value: ""
        }
      }
    };
    const result = isManagerValid(form);
    expect(result).toBe(false);
  });
});
describe("isNNumberValid", () => {
  test("should return true when nNumberFetchedUser is populated", () => {
    const form = {
      nNumber: {
        nNumberFetchedUser: {
          whatever: "Mike"
        }
      }
    };
    const result = isNNumberValid(form);
    expect(result).toBe(true);
  });
  test("should return false when nNumberFetchedUser is not populated", () => {
    const form = {
      nNumber: {
        nNumberFetchedUser: null
      }
    };
    const result = isNNumberValid(form);
    expect(result).toBe(false);
  });
});
describe("isExtensionValid", () => {
  test("should return true when extension is valid", () => {
    const form = {
      triton: {
        extension: {
          valid: true,
          value: "5245"
        }
      }
    };
    const result = isExtensionValid(form);
    expect(result).toBe(true);
  });
  test("should return true when extension is empty string", () => {
    const form = {
      triton: {
        extension: {
          value: "",
          valid: false
        }
      }
    };
    const result = isExtensionValid(form);
    expect(result).toBe(true);
  });
  test("should return false when extension is invalid and value is not an empty string", () => {
    const form = {
      triton: {
        extension: {
          valid: false,
          value: "5245"
        }
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
        triton: {
          inactiveForwardTo: {
            value: "WK12334"
          }
        }
      };
      const result = isInactiveForwardToValid(form, true);
      expect(result).toBe(true);
    });
    test("should return false when inactiveForwardTo is null", () => {
      const form = {
        triton: {
          inactiveForwardTo: {
            value: null
          }
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
        triton: {
          outgoing: {
            value: "+16038518200"
          },
          directDialNum: {
            value: "+16032453160"
          }
        }
      };
      const result = isDidDifferentValid(form, mockWorkers[2], true);
      expect(result).toBe(true);
    });
    test("should return true if both outgoing and directDial Num are unchanged", () => {
      const form = {
        triton: {
          outgoing: {
            value: validFormOptions.didE164
          },
          directDialNum: {
            value: validFormOptions.directDialNum.e164
          }
        }
      };
      const result = isDidDifferentValid(form, mockWorkers[2], true);
      expect(result).toBe(true);
    });
    test("should return false if only one number is changed", () => {
      const form = {
        triton: {
          outgoing: {
            value: "+16038518200"
          },
          directDialNum: {
            value: validFormOptions.directDialNum.tenDig
          }
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
describe("removeProfileZeroIfAdminNotInProfileZero", () => {
  test("user is a triton-admin, should return full profile list", () => {
    const result = removeProfileZeroIfAdminNotInProfileZero(adminStateIsAdmin, profileListWithZero);
    expect(result).toEqual(profileListWithZero);
  });
  test("user is not a triton-admin, should return full not profile list", () => {
    const result = removeProfileZeroIfAdminNotInProfileZero(adminStateIsNotAdmin, profileListWithZero);
    expect(result).toEqual(profileList);
  });
  test("user state is erroneous, should return full not profile list", () => {
    const result = removeProfileZeroIfAdminNotInProfileZero(adminStateIsErroneous, profileListWithZero);
    expect(result).toEqual(profileList);
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
      triton: {
        defaultSkills: {
          updated: true
        }
      }
    };
    const result = isFormUpdated(updatedForm);
    expect(result).toBe(true);
  });
  test("form.manager.updated was updated", () => {
    const updatedForm = {
      ...initialFormState,
      triton: {
        ...initialFormState.triton,
        manager: {
          updated: true
        }
      }
    };
    const result = isFormUpdated(updatedForm);
    expect(result).toBe(true);
  });
  test("form.profileId.updated was updated", () => {
    const updatedForm = {
      ...initialFormState,
      triton: {
        ...initialFormState.triton,
        profileId: {
          updated: true
        }
      }
    };
    const result = isFormUpdated(updatedForm);
    expect(result).toBe(true);
  });
  test("form.outgoing.updated was updated", () => {
    const updatedForm = {
      ...initialFormState,
      triton: {
        ...initialFormState.triton,
        outgoing: {
          updated: true
        }
      }
    };
    const result = isFormUpdated(updatedForm);
    expect(result).toBe(true);
  });
  test("form.alternateDid.updated was updated", () => {
    const updatedForm = {
      ...initialFormState,
      triton: {
        ...initialFormState.triton,
        alternateDid: {
          updated: true
        }
      }
    };
    const result = isFormUpdated(updatedForm);
    expect(result).toBe(true);
  });
  test("form.directDialNum.updated was updated", () => {
    const updatedForm = {
      ...initialFormState,
      triton: {
        ...initialFormState.triton,
        directDialNum: {
          updated: true
        }
      }
    };
    const result = isFormUpdated(updatedForm);
    expect(result).toBe(true);
  });
  test("form.nNumber.updated was updated", () => {
    const updatedForm = {
      ...initialFormState,
      nNumber: {
        ...initialFormState.nNumber,
        updated: true
      }
    };
    const result = isFormUpdated(updatedForm);
    expect(result).toBe(true);
  });
  test("form.extension.updated was updated", () => {
    const updatedForm = {
      ...initialFormState,
      triton: {
        ...initialFormState.triton,
        extension: {
          updated: true
        }
      }
    };
    const result = isFormUpdated(updatedForm);
    expect(result).toBe(true);
  });
  test("form.inactiveForwardTo.updated was updated", () => {
    const updatedForm = {
      ...initialFormState,
      triton: {
        ...initialFormState.triton,
        inactiveForwardTo: {
          updated: true
        }
      }
    };
    const result = isFormUpdated(updatedForm);
    expect(result).toBe(true);
  });
  test("form.zeroOutEnabledUpdated was updated", () => {
    const updatedForm = {
      ...initialFormState,
      triton: {
        ...initialFormState.triton,
        zeroOutEnabled: {
          updated: true
        }
      }
    };
    const result = isFormUpdated(updatedForm);
    expect(result).toBe(true);
  });
  test("form.selfServiceIndUpdated was updated", () => {
    const updatedForm = {
      ...initialFormState,
      triton: {
        ...initialFormState.triton,
        selfServiceInd: {
          updated: true
        }
      }
    };
    const result = isFormUpdated(updatedForm);
    expect(result).toBe(true);
  });
});
describe.only("isQMUserValid", () => {
  test("form.calabrio_qm === false, should return array with all required fields", () => {
    const form = {
      calabrio_qm: {
        userFound: false,
        team: "Ill be ignored"
      }
    }
    const result = isQMUserValid(form);
    expect(result).toStrictEqual(["team","roles"]);
  });
  test("roles are empty array, should return error", () => {
    const form = {
      calabrio_qm: {
        userFound: true,
        team: "Team Buffy",
        roles: []
      }
    }
    const result = isQMUserValid(form);
    expect(result).toStrictEqual(["roles"]);
  });
  test("team is null, should return error", () => {
    const form = {
      calabrio_qm: {
        userFound: true,
        team: null,
        roles: [{ name: "Role1"}]
      }
    }
    const result = isQMUserValid(form);
    expect(result).toStrictEqual(["team"]);
  });
  test("team is empty string, should return error", () => {
    const form = {
      calabrio_qm: {
        userFound: true,
        team: "",
        roles: [{ name: "Role1"}]
      }
    }
    const result = isQMUserValid(form);
    expect(result).toStrictEqual(["team"]);
  });
  test("all required fields are valid, should return empty array", () => {
    const form = {
      calabrio_qm: {
        userFound: true,
        team: "Valid Team",
        roles: [{ name: "Role1"}]
      }
    }
    const result = isQMUserValid(form);
    expect(result).toStrictEqual([]);
  });
});
describe("isWfmUserValid", () => {
  const validWfmUser = {
      userFound: true,
      FirstName: "Faith",
      LastName: "Cuneo",
      EmploymentNumber: "n0263786",
      Email: "faith.cuneo@libertymutual.com",
      DisplayName: "Faith Cuneo",
      BusinessUnitId: "BU123239",
      FirstDayOfWeek: 2
  }
  describe("calabrio_wfm.userFound === false", () => {
    test("required fields are returned", () => {
      const form = {
        calabrio_wfm: {
          ...validWfmUser,
          userFound: false
        }
      }
      const result = isWfmUserValid(form);
      expect(result).toStrictEqual([]);
    });
  });
  describe("required fields", () => {
    test("required field is null, should return BU in array", () => {
      const form = {
        calabrio_wfm: {
          ...validWfmUser,
          BusinessUnitId: null
        }
      }
      const result = isWfmUserValid(form);
      expect(result).toStrictEqual(["BusinessUnitId"]);
    });
    test("required field is empty string, should return BU in array", () => {
      const form = {
        calabrio_wfm: {
          ...validWfmUser,
          BusinessUnitId: ""
        }
      }
      const result = isWfmUserValid(form);
      expect(result).toStrictEqual(["BusinessUnitId"]);
    });
    test("required field is empty array, should return BU in array", () => {
      const form = {
        calabrio_wfm: {
          ...validWfmUser,
          BusinessUnitId: []
        }
      }
      const result = isWfmUserValid(form);
      expect(result).toStrictEqual(["BusinessUnitId"]);
    });
    test("required field is false, should return empty array", () => {
      const form = {
        calabrio_wfm: {
          ...validWfmUser,
          BusinessUnitId: false
        }
      }
      const result = isWfmUserValid(form);
      expect(result).toStrictEqual(["BusinessUnitId"]);
    });
  });
  describe("logicalRequiredFields", () => {
    test("no fields are populated, should not add to array", () => {
      const form = {
        calabrio_wfm: {
          ...validWfmUser,
          PersonSkills: [],
          SkillsStartDate: null
        }
      }
      const result = isWfmUserValid(form);
      expect(result).toStrictEqual([]);
    });
    test("all fields populated, should not add to array", () => {
      const form = {
        calabrio_wfm: {
          ...validWfmUser,
          PersonSkills: ["Skill1"],
          SkillsStartDate: "05/02/1991"
        }
      }
      const result = isWfmUserValid(form);
      expect(result).toStrictEqual([]);
    });
    test("all fields populated with a false value, should not add to array", () => {
      const form = {
        calabrio_wfm: {
          ...validWfmUser,
          AvailabilityId: "AV928371",
          AvailabilityStartDate: false
        }
      }
      const result = isWfmUserValid(form);
      expect(result).toStrictEqual([]);
    });
    test("partial fields populated - empty string, should add to array", () => {
      const form = {
        calabrio_wfm: {
          ...validWfmUser,
          PersonSkills: ["Skill1"],
          SkillsStartDate: ""
        }
      }
      const result = isWfmUserValid(form);
      expect(result).toStrictEqual(["SkillsStartDate"]);
    });
    test("partial fields populated - null, should add to array", () => {
      const form = {
        calabrio_wfm: {
          ...validWfmUser,
          PersonSkills: ["Skill1"],
          SkillsStartDate: null
        }
      }
      const result = isWfmUserValid(form);
      expect(result).toStrictEqual(["SkillsStartDate"]);
    });
    test("partial fields populated - empty array, should add to array", () => {
      const form = {
        calabrio_wfm: {
          ...validWfmUser,
          PersonSkills: [],
          SkillsStartDate: "05/02/1991"
        }
      }
      const result = isWfmUserValid(form);
      expect(result).toStrictEqual(["PersonSkills"]);
    });
  });
});
describe("isFormValid", () => {
  describe("Form is valid", () => {
    describe("forwardToToggle === true", () => {
      test("isFormValid should return true", () => {
        const form = {
          ...validFormState,
          triton: {
            ...validFormState.triton,
            inactiveForwardTo: {
              ...validFormState.triton.inactiveForwardTo,
              value: "WK2345123"
            }
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
          triton: {
            ...validFormState.triton,
            extension: {
              ...validFormState.extension,
              valid: false,
              value: ""
            }
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
          nNumber: {
            ...initialFormState.nNumber,
            nNumberFetchedUser: null
          }
        };
        expect(isFormValid(form, mockWorkers[0], false)).toBe(false);
      });
    });
    describe("Profile Id is empty string", () => {
      test("isFormValid should return false", () => {
        const form = {
          ...validFormState,
          formMode: formModes.UPDATE,
          triton: {
            ...initialFormState.triton,
            profileId: {
              ...validFormState.profileId,
              value: ""
            }
          }
        };
        expect(isFormValid(form, mockWorkers[0], false)).toBe(false);
      });
    });
    describe("Manager is empty string", () => {
      test("isFormValid should return false", () => {
        const form = {
          ...validFormState,
          triton: {
            ...initialFormState.triton,
            manager: {
              ...validFormState.manager,
              value: ""
            }
          }
        };
        expect(isFormValid(form, mockWorkers[0], false)).toBe(false);
      });
    });
    describe("Outgoing number is not valid", () => {
      test("isFormValid should return false", () => {
        const form = {
          ...validFormState,
          triton: {
            ...initialFormState.triton,
            outgoing: {
              ...validFormState.outgoing,
              valid: false
            }
          }
        };
        expect(isFormValid(form, mockWorkers[0], false)).toBe(false);
      });
    });
    describe("Extension is not valid", () => {
      test("isFormValid should return false", () => {
        const form = {
          ...validFormState,
          triton: {
            ...initialFormState.triton,
            extension: {
              ...validFormState.extension,
              valid: false
            }
          }
        };
        expect(isFormValid(form, mockWorkers[0], false)).toBe(false);
      });
    });
    describe("inactiveForwardTo is not valid", () => {
      describe("forwardToToggle === true", () => {
        const form = {
          ...validFormState,
          triton: {
            ...initialFormState.triton,
            inactiveForwardTo: {
              ...validFormState.inactiveForwardTo,
              value: null
            }
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
            triton: {
              ...initialFormState.triton,
              didUser: true,
              directDialNum: {
                ...validFormState.directDialNum,
                valid: false
              }
            }
          };
          expect(isFormValid(form, mockWorkers[2], false)).toBe(false);
        });
      });
      describe("Alternate DID is not valid", () => {
        test("isFormValid should return false", () => {
          const form = {
            ...validFormState,
            triton: {
              ...initialFormState.triton,
              didUser: true,
              alternateDid: {
                ...validFormState.alternateDid,
                valid: false
              }
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
              triton: {
                ...initialFormState.triton,
                directDialNum: {
                  ...validFormState.directDialNum,
                  updated: false,
                  value: validFormOptions.directDialNum
                }
              }
            };
            expect(isFormValid(form, mockWorkers[2], true)).toBe(false);
          });
        });
        describe("Direct Dial number was updated but Outbound Number was not", () => {
          test("isFormValid should return false", () => {
            const form = {
              ...validFormState,
              triton: {
                ...initialFormState.triton,
                outbound: {
                  ...validFormState.outbound,
                  updated: false,
                  value: validFormOptions.didE164
                }
              }
            };
            expect(isFormValid(form, mockWorkers[2], true)).toBe(false);
          });
        });
      });
    });
  });
});
describe("fetchUser", () => {
  describe("fetchUserServiceCall fails", () => {
    test("setForm is called with 'SET_DISCREPANCIES' and returns nNumber and null fetchedUser", async () => {
      fetchUser.mockRejectedValueOnce("boo");
      const result = await fetchUserUtil("n1234567", mockSetForm, "error Message", "i am an errorType");
      expect(result).toEqual({
        nNumber: "n1234567",
        fetchedUser: null
      });
      expect(mockSetForm).toHaveBeenCalledWith({
        type: "SET_DISCREPANCIES",
        payload: {
          type: "i am an errorType",
          message: "error Message"
        }
      });
    });
  });
  describe("fetchUserServiceCall succeeds", () => {
    test("setForm is called with 'SET_DISCREPANCIES' and returns nNumber and null fetchedUser", async () => {
      fetchUser.mockResolvedValueOnce({
        email: "email@lmig.com",
        other: "stuff"
      });
      const result = await fetchUserUtil("n1234567", mockSetForm, "error Message", "i am an errorType");
      expect(result).toEqual({
        nNumber: "n1234567",
        fetchedUser: {
          email: "email@lmig.com",
          other: "stuff"
        }
      });
      expect(mockSetForm).toHaveBeenCalledWith({
        type: "COMPLETE_N_NUMBER",
        payload: {
          nNumber: "n1234567",
          fetchedUser: {
            email: "email@lmig.com",
            other: "stuff"
          }
        }
      });
    });
  });
});
describe("findMatchingWorker", () => {
  test("no matching worker is found, returns null", () => {
    const result = findMatchingWorker("boo", "nope", "nomatch@email.com", initialTestState.workerContext.workers);
    expect(result).toEqual(null);
  });
  test("matching worker found on workerSid, returns matching worker", () => {
    const result = findMatchingWorker("WK049358", "nope", "nomatch@email.com", initialTestState.workerContext.workers);
    expect(result).toEqual({
      skillsDifferent: true,
      sid: "wk049358",
      attributes: {
        full_name: "Faith Cuneo",
        emp_first_name: "Faith",
        emp_last_name: "Cuneo",
        n_number: "N0263786",
        extension: "1234",
        profile_id: 12,
        manager_n_number: "n023356"
      }
    });
  });
  test("matching worker found on nNumber, returns matching worker", () => {
    const result = findMatchingWorker(null, "N0000000", "nomatch@email.com", initialTestState.workerContext.workers);
    expect(result).toEqual({
      attributes: {
        full_name: "Gloria Sake",
        emp_first_name: "Gloria",
        emp_last_name: "Sake",
        n_number: "n0000000",
        extension: "2345",
        profile_id: "12",
        manager_n_number: "n0263786"
      },
      sid: "WK1234"
    });
  });
  test("matching worker found on email, returns matching worker", () => {
    const result = findMatchingWorker(null, "boo", "Faith.Cuneo@libertymutual.com", initialTestState.calabrioContext.users);
    expect(result).toEqual({
      id: 220,
      acdId: "WK5678",
      firstName: "Faith",
      lastName: "Cuneo",
      groupId: 201,
      email: "Faith.Cuneo@libertymutual.com"
    });
  });
});
describe("identifyUserProfiles", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe("nNumber has not been fetched yet", () => {
    const form = {
      ...initialFormState,
      nNumber: {
        ...initialFormState.nNumber,
        value: "n0263786"
      },
      triton: {
        ...initialFormState.triton,
        userFound: false
      }
    }
    test("should call fetchUser and set the nNumber object", async () => {
      await identifyUserProfiles(form, mockSetForm, initialTestState); 
      expect(fetchUser).toHaveBeenCalledTimes(1);
      expect(fetchUser).toHaveBeenCalledWith("n0263786");
    });
  });
  describe("system is triton", () => {
    describe("calabrio qm user and calabrio wfm users not found", () => {
      test("calls just resolves", async () => {
        const formState = {
          ...validFormState,
          triton: {
            ...validFormState.triton,
            userFound: true
          },
          calabrio_wfm: {
            userFound: false
          }
        };
        const result = await identifyUserProfiles(formState, mockSetForm, initialTestState);
        expect(fetchUser).toHaveBeenCalledTimes(0);
        expect(mockSetForm).toHaveBeenCalledTimes(0);
        expect(result).toBe("Faith - we should be done"); // lol...
      });
    });
    describe("calabrio qm user is not found but calabrio wfm user found", () => {
      test("system is calabrio_qm, calls setForm with COMPLETE_N_NUMBER, resolves", async () => {
        const formState = {
          ...validFormState,
          triton: {
            ...validFormState.triton,
            sid: "WK1234",
            attributes: {
              email: "Brittany.Magee@libertymutual.com"
            },
            userFound: true
          },
          calabrio_wfm: {
            userFound: true
          }
        };
        await identifyUserProfiles(formState, mockSetForm, initialTestState);
        expect(fetchUser).toHaveBeenCalledTimes(0);
        expect(mockSetForm).toHaveBeenCalledWith({
          type: "COMPLETE_N_NUMBER",
          payload: {
            nNumber: "n0263786",
            fetchedUser: {
              id: 200,
              acdId: "WK1234",
              firstName: "Brittany",
              lastName: "Magee",
              groupId: 102,
              adLogin: "LM\\n0222444",
              email: "Brittany.Magee@libertymutual.com"
            }
          }
        });
      });
    });
    describe("calabrio wfm users found false in form,", () => {
      test("calls SET_UPDATE_WFM_FORM_STATE with ", async () => {
        const formState = {
          ...validFormState,
          nNumber: {
            value: "n1111111"
          },
          triton: {
            ...validFormState.triton,
            sid: "WK1234",
            attributes: {
              email: "Person@libertymutual.com"
            },
            userFound: true
          },
          calabrio_wfm: {
            userFound: false
          }
        };
        await identifyUserProfiles(formState, mockSetForm, initialTestState);
        expect(fetchUser).toHaveBeenCalledTimes(1);
        expect(mockSetForm).toHaveBeenCalledWith({
          type: "SET_UPDATE_WFM_FORM_STATE",
          payload: {
            state: initialTestState,
            user: {
              BusinessUnitId: "123-321",
              ParentTeam: "111",
              EmploymentNumber: "n1111111",
              Email: "Person@libertymutual.com",
              TeamId: "111"
            }
          }
        });
      });
    });
  });
  describe("system is calabrio_qm", () => {
    test("calabrio wfm userFound is false, just resolves?", async () => {
      const formState = {
        ...validFormState,
        triton: {
          ...validFormState.triton,
          sid: "WK1234",
          attributes: {
            email: "Person@libertymutual.com"
          },
          userFound: false
        },
        calabrio_qm: {
          userFound: true
        },
        calabrio_wfm: {
          userFound: false
        }
      };
      await identifyUserProfiles(formState, mockSetForm, initialTestState);
      expect(fetchUser).toHaveBeenCalledTimes(0);
      expect(mockSetForm).toHaveBeenCalledTimes(0);
    });
  });
  describe("system is calabrio_wfm", () => {
    test("calabrio wfm userFound is true, finds triton worker, setForm called with SET_UPDATE_TRITON_FORM_STATE", async () => {
      const formState = {
        ...validFormState,
        nNumber: {
          value: "n1111111",
          nNumberFetchedUser: {
            email: "Person@libertymutual.com"
          }
        },
        triton: {
          ...validFormState.triton,
          sid: "WK1234",
          attributes: {
            email: "Person@libertymutual.com"
          },
          userFound: false
        },
        calabrio_qm: {
          userFound: false
        },
        calabrio_wfm: {
          ...validFormState.calabrio_wfm,
          EmploymentNumber: "n1111111",
          Identity: "Person@libertymutual.com",
          Email: "Person@libertymutual.com",
          userFound: true
        }
      };
      await identifyUserProfiles(formState, mockSetForm, initialTestState);
      expect(fetchUser).toHaveBeenCalledTimes(0);
      expect(mockSetForm).toHaveBeenCalledTimes(1);
      expect(mockSetForm).toHaveBeenCalledWith({
        type: "SET_UPDATE_TRITON_FORM_STATE",
        payload: {
          worker: {
            attributes: {
              emp_first_name: "Bree",
              emp_last_name: "Hodge",
              extension: "3456",
              full_name: "Bree Hodge",
              manager_n_number: "n0263512",
              n_number: "n1111111"
            }
          },
          managers: initialTestState.managerContext.managers
        }
      });
    });
  });
});