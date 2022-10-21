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
  test("empty overflow skill is valid", () => {
    const result = isOverflowSkillValid("");
    expect(result).toBe(true);
  });
});

describe("isProfileFormValid", () => {
  test("should return true when all three profileId, profileName and overflowSkill are valid", () => {
    const form = {
      profileId: 40,
      profileName: { valid: true },
      overflowSkill: { valid: true }
    };
    const result = isProfileFormValid(form);
    expect(result).toBe(true);
  });
  test("should return form invalid (null) when profileId is null", () => {
    const form = {
      profileId: null,
      profileName: { valid: true },
      overflowSkill: { valid: true }
    };
    const result = isProfileFormValid(form);
    expect(result).toBe(null);
  });
  test("should return false when profileName is invalid", () => {
    const form = {
      profileId: 40,
      profileName: { valid: false },
      overflowSkill: { valid: true }
    };
    const result = isProfileFormValid(form);
    expect(result).toBe(false);
  });
  test("should return false when overflowSkill is invalid", () => {
    const form = {
      profileId: 40,
      profileName: { valid: true },
      overflowSkill: { valid: false }
    };
    const result = isProfileFormValid(form);
    expect(result).toBe(false);
  });
});