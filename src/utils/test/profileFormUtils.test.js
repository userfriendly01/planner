import {
  isOverflowSkillValid,
  isProfileFormValid,
  isProfileNameValid
} from "../profileFormUtils";

describe("isProfileNameValid", () => {
  test("should return true when valid profile name is entered", () => {
    const result = isProfileNameValid("Test Value");
    expect(result).toBe(true);
  });
  test("profile name is valid when it is alphanumeric with special characters", () => {
    const result = isProfileNameValid("Te$t-Value (profile)");
    expect(result).toBe(true);
  });
  test("should return false when profile name is over 80 characters", () => {
    const result = isProfileNameValid("testprofiletestprofiletestprofiletestprofiletestprofiletestprofiletestprofiletestprofiletestprofile");
    expect(result).toBe(false);
  });
  test("should return false when profile name is empty string", () => {
    const result = isProfileNameValid("");
    expect(result).toBe(false);
  });
});

describe("isOverflowSkillValid", () => {
  test("should return true when valid overflow skill is entered", () => {
    const result = isOverflowSkillValid("skill23");
    expect(result).toBe(true);
  });
  test("overflow skill is invalid when space is entered", () => {
    const result = isOverflowSkillValid("test skill");
    expect(result).toBe(false);
  });
  test("overflow skill is invalid when special character", () => {
    const result = isOverflowSkillValid("test-skill");
    expect(result).toBe(false);
  });
  test("overflow skill is invalid when over 80 characters", () => {
    const result = isOverflowSkillValid("testoverflowskilltestoverflowskilltestoverflowskilltestoverflowskilltestoverflowskill");
    expect(result).toBe(false);
  });
  test("empty overflow skill is valid", () => {
    const result = isOverflowSkillValid("");
    expect(result).toBe(true);
  });
});

describe("isProfileFormValid", () => {
  test("should return true when activitiesList, profileName, overflowSkill, acwDataEntry(disabled), callTagsList(empty) and accessGrouptoggle(true) are valid", () => {
    const form = {
      activitiesList: [2,3],
      profileName: { valid: true },
      overflowSkill: { valid: true },
      acwDataEntry: { value: false },
      callTagsList: [],
      operatingUnit: {
        ou_name: "nothing"
      },
      accessGroup: {
        value: true,
        updated: true
      },
      accessGroupId: 2,
      accessGroupIdUpdated: true,
      forwardToNum: {
        unmaskedValue: "8005551212",
        valid: true
      }
    };
    const result = isProfileFormValid(form);
    expect(result).toBe(true);
  });
  test("should return true when activitiesList, profileName, overflowSkill, acwDataEntry(enabled), callTagsList(not empty) and accessGrouptoggle(false) are valid", () => {
    const form = {
      activitiesList: [2,3],
      profileName: { valid: true },
      overflowSkill: { valid: true },
      acwDataEntry: { value: true },
      callTagsList: [{
        options_id: 1,
        wrkr_tsk_info_nme: "Negotiation Type",
        wrkr_tsk_info_id: 3
      }],
      operatingUnit: {
        ou_name: "nothing"
      },
      accessGroup: {
        value: false,
        updated: false
      },
      accessGroupId: null,
      accessGroupIdUpdated: false,
      forwardToNum: {
        unmaskedValue: "8005551212",
        valid: true
      }
    };
    const result = isProfileFormValid(form);
    expect(result).toBe(true);
  });
  test("should return form valid when profileId is null", () => {
    const form = {
      profileId: null,
      activitiesList: [2,3],
      profileName: { valid: true },
      overflowSkill: { valid: true },
      acwDataEntry: { value: false },
      callTagsList: [],
      operatingUnit: {
        ou_name: "nothing"
      },
      accessGroup: {
        value: false,
        updated: false
      },
      forwardToNum: {
        unmaskedValue: "8005551212",
        valid: true
      }
    };
    const result = isProfileFormValid(form);
    expect(result).toBe(true);
  });
  test("should return false when profileName is invalid", () => {
    const form = {
      activitiesList: [2,3],
      profileName: { valid: false },
      overflowSkill: { valid: true },
      acwDataEntry: { value: false },
      callTagsList: [],
      operatingUnit: {
        ou_name: "nothing"
      },
      forwardToNum: {
        unmaskedValue: "8005551212",
        valid: true
      }
    };
    const result = isProfileFormValid(form);
    expect(result).toBe(false);
  });
  test("should return false when overflowSkill is invalid", () => {
    const form = {
      activitiesList: [2,3],
      profileName: { valid: true },
      overflowSkill: { valid: false },
      acwDataEntry: { value: false },
      callTagsList: [],
      operatingUnit: {
        ou_name: "nothing"
      },
      forwardToNum: {
        unmaskedValue: "8005551212",
        valid: true
      }
    };
    const result = isProfileFormValid(form);
    expect(result).toBe(false);
  });
  test("should return false when no activities added / activitiesList is empty", () => {
    const form = {
      activitiesList: [],
      profileName: { valid: true },
      overflowSkill: { valid: false },
      acwDataEntry: { value: false },
      callTagsList: [],
      operatingUnit: {
        ou_name: "nothing"
      },
      forwardToNum: {
        unmaskedValue: "8005551212",
        valid: true
      }
    };
    const result = isProfileFormValid(form);
    expect(result).toBe(false);
  });
  test("should return false when acwDataEntry is enabled and callTagsList is empty", () => {
    const form = {
      activitiesList: [2,3],
      profileName: { valid: true },
      overflowSkill: { valid: true },
      acwDataEntry: { value: true },
      callTagsList: [],
      operatingUnit: {
        ou_name: "nothing"
      },
      forwardToNum: {
        unmaskedValue: "8005551212",
        valid: true
      }
    };
    const result = isProfileFormValid(form);
    expect(result).toBe(false);
  });
  test("should return false when acwDataEntry is disbaled and callTagsList is not empty", () => {
    const form = {
      activitiesList: [2,3],
      profileName: { valid: true },
      overflowSkill: { valid: true },
      acwDataEntry: { value: false },
      callTagsList: [{
        options_id: 1,
        wrkr_tsk_info_nme: "Negotiation Type",
        wrkr_tsk_info_id: 3
      }],
      operatingUnit: {
        ou_name: "nothing"
      },
      forwardToNum: {
        unmaskedValue: "8005551212",
        valid: true
      }
    };
    const result = isProfileFormValid(form);
    expect(result).toBe(false);
  });
  test("should return false when accessGroup toggle is enabled and accessGroup dropdown is not selected", () => {
    const form = {
      activitiesList: [2,3],
      profileName: { valid: true },
      overflowSkill: { valid: true },
      acwDataEntry: { value: true },
      callTagsList: [],
      operatingUnit: {
        ou_name: "nothing"
      },
      accessGroup: {
        value: true,
        updated: true
      },
      accessGroupId: null,
      accessGroupIdUpdated: true,
      forwardToNum: {
        unmaskedValue: "8005551212",
        valid: true
      }
    };
    const result = isProfileFormValid(form);
    expect(result).toBe(false);
  });
  test("should return false when forwardToNum valid is false", () => {
    const form = {
      activitiesList: [2,3],
      profileName: { valid: true },
      overflowSkill: { valid: true },
      acwDataEntry: { value: false },
      callTagsList: [],
      operatingUnit: {
        ou_name: "nothing"
      },
      accessGroup: {
        value: false,
        updated: false
      },
      accessGroupId: null,
      accessGroupIdUpdated: true,
      forwardToNum: {
        unmaskedValue: "blargh",
        valid: false
      }
    };
    const result = isProfileFormValid(form);
    expect(result).toBe(false);
  });
  test("should return true when forwardToNum unmasked value is null", () => {
    const form = {
      activitiesList: [2,3],
      profileName: { valid: true },
      overflowSkill: { valid: true },
      acwDataEntry: { value: false },
      callTagsList: [],
      operatingUnit: {
        ou_name: "nothing"
      },
      accessGroup: {
        value: false,
        updated: false
      },
      accessGroupId: null,
      accessGroupIdUpdated: true,
      forwardToNum: {
        unmaskedValue: null,
        valid: false
      }
    };
    const result = isProfileFormValid(form);
    expect(result).toBe(true);
  });
});