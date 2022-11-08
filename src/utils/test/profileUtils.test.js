 import React from "react";
 import { Check } from "@mui/icons-material";
 import {
  formatProfileBooleanData,
  formatOverflowSkillData,
  formatActivityData
 } from "../profileUtils";
 import { ActivitiesDiv } from "../../components/tabs/profilesettings/ProfileSettingsTable/ProfileSettingsTable.Styles"

describe("profileUtils", () => {
  describe("formatProfileBooleanData", () => {
    test("should return Check component", () => {
      expect(formatProfileBooleanData(1)).toStrictEqual(<Check />);
    });
    test("should return empty string for non 1 value", () => {
      expect(formatProfileBooleanData(0)).toBe("");
    });
  });

  describe("formatProfileBooleanDataTrueFalse", () => {
    test("should return Check component", () => {
      expect(formatProfileBooleanDataTrueFalse(1)).toStrictEqual({ value: true });
    });
    test("should return empty string for non 1 value", () => {
      expect(formatProfileBooleanDataTrueFalse(0)).toStrictEqual({ value: false });
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

  describe("formatActivityData", () => {
    test("should return activity within activity div", () => {
      expect(formatActivityData("Busy")).toStrictEqual(<ActivitiesDiv>{"Busy"}</ActivitiesDiv>);
    });
    test("should return empty string for null activity", () => {
      expect(formatActivityData(null)).toBe("");
    });
  });
});