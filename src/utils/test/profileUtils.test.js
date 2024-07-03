import React from "react";
import { Check } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import {
  formatProfileACWDataEntry,
  formatSelfServiceIndicatorData,
  constructProfilePayload,
  isProfileFormValid
} from "../profileUtils";
import {
  BubbleDiv,
  HighlightRed
} from "components/tabs/orgmanagement/triton/ProfileSettingsContainer/ProfileSettingsTable/ProfileSettingsTable.Styles";

describe("profileUtils", () => {
  describe("isProfileFormValid", () => {
    test("should return true when activitiesList, profileName, profile Id, operating unit are valid", () => {
      const form = {
        updated: true,
        activitiesList: [2,3],
        profileId: "80",
        profileName: "New Profile",
        callTagsList: [],
        operatingUnit: {
          ou_name: "nothing"
        },
        accessGroup: {
          isNew: false
        },
        forwardToNum: {
          valid: true
        }
      };
      const result = isProfileFormValid(form);
      expect(result).toBe(true);
    });
    test("should return true when new access group is valid, callTagsList(not empty) and accessGrouptoggle(false) are valid", () => {
      const form = {
        updated: true,
        activitiesList: [2,3],
        profileId: 1,
        profileName: "Snowball",
        callTagsList: [{
          options_id: 1,
          wrkr_tsk_info_nme: "Negotiation Type",
          wrkr_tsk_info_id: 3
        }],
        operatingUnit: {
          ou_name: "nothing"
        },
        accessGroup: {
          isNew: true,
          access_group_name: "new access group",
          twilio_dashboard_url: "www.cats"
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
  });

  describe("formatProfileACWDataEntry", () => {
    //strict equal bug?
    xtest("should return multiple BubbleDivs with display names / tooltips inside", () => {
      const callTags = [
        {
          display_name: "Claim Number",
          attribute_name: "claim_number",
          options: null
        },
        {
          display_name: "Call Type",
          attribute_name: "call_type",
          options: null
        },
        {
          display_name: "Negotiation Type",
          attribute_name: "negotiation_type",
          options: [
            "Info Exchange",
            "Bargaining",
            "Closing",
            "N/A",
            "Offer"
          ]
        }
      ];
      expect(formatProfileACWDataEntry(1, callTags, BubbleDiv, HighlightRed)).toStrictEqual(
        [
          <Tooltip key={2} placement="top" title={""}>
            <BubbleDiv key={2}>{"Claim Number"}</BubbleDiv>
          </Tooltip>,
          <Tooltip key={1} placement="top" title={""}>
            <BubbleDiv key={1}>{"Call Type"}</BubbleDiv>
          </Tooltip>,
          <Tooltip key={3} placement="top" title={"Info Exchange, Bargaining, Closing, N/A, Offer"}>
            <BubbleDiv key={3}>{"Negotiation Type"}</BubbleDiv>
          </Tooltip>
        ]
      );
    });
    test("should return a highlighted red error when feature is enabled and options are empty", () => {
      const options = [];
      expect(formatProfileACWDataEntry(1, options, BubbleDiv, HighlightRed)).toStrictEqual(<HighlightRed>{"Call tags not configured but feature enabled"}</HighlightRed>);
    });
    test("should return a highlighted red error when feature is disabled and options are not empty", () => {
      const options = [{
        display_nme: "Claim Number",
        wrkr_tsk_info_id: 2,
        wrkr_tsk_info_nme: "claim_number",
        profile_id: 15,
        options_id: null,
        options: null
      }];
      expect(formatProfileACWDataEntry(0, options, BubbleDiv, HighlightRed)).toStrictEqual(<HighlightRed>{"Call tags configured but feature disabled"}</HighlightRed>);
    });
  });

  describe("formatSelfServiceIndicatorData", () => {
    test("should return check if profileId is 39 or above ", () => {
      expect(formatSelfServiceIndicatorData(45)).toEqual(<Check />);
    });
    test("should return check if profileId is 39 or above ", () => {
      expect(formatSelfServiceIndicatorData(20)).toEqual("");
    });
    test("should return check, if correct profile is a string", () => {
      expect(formatSelfServiceIndicatorData("39")).toEqual(<Check />);
    });
  });
});
