 import React from "react";
 import { Check } from "@mui/icons-material";
 import {
  formatProfileBooleanData,
  formatOverflowSkillData
 } from "../profileUtils";

describe("profileUtils", () => {
  describe("formatProfileBooleanData", () => {
    test("should return Check component", () => {
      expect(formatProfileBooleanData(1)).toStrictEqual(<Check />);
    });
    test("should return empty string for non 1 value", () => {
      expect(formatProfileBooleanData(0)).toBe("");
    });
  });

  describe("formatOverflowSkillData", () => {
    test("should return overflow skill", () => {
      expect(formatOverflowSkillData("OverflowSkill")).toBe("OverflowSkill");
    });
    test("should return empty string for null overflow skill", () => {
      expect(formatOverflowSkillData(null)).toBe("");
    });
  });
});