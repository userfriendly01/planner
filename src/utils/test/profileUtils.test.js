import React from "react";
import { Check } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import {
  formatProfileACWDataEntry,
  formatSelfServiceIndicatorData,
  formatTransferQueues,
  constructProfilePayload,
  isProfileFormValid
} from "../profileUtils";
import {
  BubbleDiv,
  HighlightRed
} from "components/tabs/orgmanagement/triton/ProfileSettingsContainer/ProfileSettingsTable/ProfileSettingsTable.Styles";
import { validProfileEntryFormState } from "testUtils";

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
          options: ["stuff", "things"],
          display_name: "Negotiation Type",
          attribute_name: "negotiation_type"
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
    test("should return false when callTagsList options are not valid", () => {
      const form = {
        updated: true,
        activitiesList: [2,3],
        profileId: 1,
        profileName: "Snowball",
        callTagsList: [{
          options: ["", ""],
          display_name: "Negotiation Type",
          attribute_name: "negotiation_type"
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
      expect(result).toBe(false);
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
    test("should return multiple BubbleDivs with display names / tooltips inside", () => {
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
      expect(formatProfileACWDataEntry(1, callTags, BubbleDiv, HighlightRed)).toEqual(
        [
          <Tooltip key={"claim_number"} placement="top" title={""}>
            <BubbleDiv key={"claim_number"}>{"Claim Number"}</BubbleDiv>
          </Tooltip>,
          <Tooltip key={"call_type"} placement="top" title={""}>
            <BubbleDiv key={"call_type"}>{"Call Type"}</BubbleDiv>
          </Tooltip>,
          <Tooltip key={"negotiation_type"} placement="top" title={"Info Exchange, Bargaining, Closing, N/A, Offer"}>
            <BubbleDiv key={"negotiation_type"}>{"Negotiation Type"}</BubbleDiv>
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
    test("returns empty string when no acwtags and no calltag length", () => {
      expect(formatProfileACWDataEntry(0, [], BubbleDiv, HighlightRed)).toStrictEqual("");
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
  describe("formatTransferQueues", () => {
    test("returns bubbleDiv with taskQueue friendly name", () => {
      expect(formatTransferQueues(["123"], [{
        sid: "123",
        friendly_name: "cool queue"
      }], BubbleDiv)).toEqual(
        [<BubbleDiv key={"123"}>{"cool queue"}</BubbleDiv>]
      );
    });
    test("returns bubbleDiv with taskQueue friendly name unknown", () => {
      expect(formatTransferQueues(["123"], [{
        sid: "",
        friendly_name: "Unknown"
      }], BubbleDiv)).toEqual(
        [<BubbleDiv key={"123"}>{"Unknown"}</BubbleDiv>]
      );
    });
  });
  describe("constructProfilePayload", () => {
    const expectedResult = {
      profile_name: "GRS Claims",
      profile_id: 40,
      overflow_skill: "lscOBDialer1",
      acw_option: false,
      acw_tags: true,
      agnt_asst_pay: false,
      backup_workers: false,
      auto_ans: true,
      edt_policy_num: false,
      edt_claim_num: false,
      call_reason: false,
      clk_to_dial: false,
      eft_auth: false,
      inbnd_rec: true,
      man_outbnd_rec: true,
      man_inbnd_rec: false,
      outbnd_rec: true,
      takes_paymnts: false,
      voice_mail_trans: false,
      ou_name: "Claims",
      ou_sid: "OUe98d4f81e49ccf1ae16b29f8611d1b6c",
      fwd_to_num: "6038518200",
      screenpop_ids: ["2hTaQUwxFmf2zanRlQ4lrnbkYaI", "2hTaUah5ZGZ1YcxskXiQkCac9zY"],
      activity_sids: ["5", "7"],
      access_group_id: "2hTZxPiac4Bur9tn5pafmEjag1E",
      call_tags: [
        {
          attribute_name: "negotiation_type",
          display_name: "Negotiation Type",
          options: ["Info Exchange", "Bargaining", "Closing"]
        },
        {
          attribute_name: "claim_number",
          display_name: "Claim Number",
          options: null
        }
      ],
      transfer_queues: ["WQda5066ddff9e0eebf2f168e40d98cc19", "WQ9e7f40c067bb9006022f43266122a257"]
    };
    test("returns formatted payload, sets profileId when formmode is insert", () => {
      const result = constructProfilePayload(validProfileEntryFormState);
      expect(result).toEqual(expectedResult);
    });
    test("returns formatted payload, does not set profileId when formmode is not insert", () => {
      const notInsertProfileForm = {
        ...validProfileEntryFormState,
        formMode: "UPDATE",
        overflowSkill: {},
        forwardToNum: {
          unmaskedValue: null
        },
        accessGroup: {}
      };
      delete expectedResult.profile_id;
      expectedResult.fwd_to_num = null;
      expectedResult.overflow_skill = null;
      expectedResult.access_group_id = null;
      const result = constructProfilePayload(notInsertProfileForm);
      expect(result).toEqual(expectedResult);
    });
  });
});
