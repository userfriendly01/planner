import React from "react";
import {
  Check,
  AutoAwesomeMotion
} from "@mui/icons-material";
import {
  formatProfileBooleanData,
  formatProfileBooleanDataTrueFalse,
  formatProfileACWDataEntry,
  formatOverflowSkillData,
  formatActivityData,
  formatAggregateQueues
} from "../profileUtils";
import {
  BubbleDiv,
  HighlightRed
} from "../../components/tabs/profilesettings/ProfileSettingsTable/ProfileSettingsTable.Styles";

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
    test("should return true value object", () => {
      expect(formatProfileBooleanDataTrueFalse(1)).toStrictEqual({ value: true });
    });
    test("should return false value object", () => {
      expect(formatProfileBooleanDataTrueFalse(0)).toStrictEqual({ value: false });
    });
  });

  describe("formatProfileACWDataEntry", () => {
    test("should return a single BubbleDivs with display name inside", () => {
      const options = [{
        display_nme: "Claim Number",
        wrkr_tsk_info_id: 2,
        profile_id: 15
      }];
      expect(formatProfileACWDataEntry(1, options)).toStrictEqual([<BubbleDiv key={2}>{"Claim Number"}</BubbleDiv>]);
    });
    test("should return multiple BubbleDivs with display names inside", () => {
      const options = [
        {
          display_nme: 'Claim Number',
          wrkr_tsk_info_id: 2,
          profile_id: 15,
          options_id: null
        },
        {
          display_nme: 'Call Type',
          wrkr_tsk_info_id: 1,
          profile_id: 15,
          options_id: null
        },
        {
          display_nme: 'Negotiation Type',
          wrkr_tsk_info_id: 3,
          profile_id: 15,
          options_id: 1
        }
      ]
      expect(formatProfileACWDataEntry(1, options)).toStrictEqual(
        [
          <BubbleDiv key={2}>{"Claim Number"}</BubbleDiv>,
          <BubbleDiv key={1}>{"Call Type"}</BubbleDiv>,
          <BubbleDiv key={3}>{"Negotiation Type"}</BubbleDiv>
        ]
      );
    });
    test("should return a highlighted red error when feature is enabled and options are empty", () => {
      const options = [];
      expect(formatProfileACWDataEntry(1, options)).toStrictEqual(<HighlightRed>{"Options not configured but feature enabled"}</HighlightRed>);
    });
    test("should return a highlighted red error when feature is disabled and options are not empty", () => {
      const options = [{
        display_nme: 'Claim Number',
        wrkr_tsk_info_id: 2,
        profile_id: 15,
        options_id: null
      }];
      expect(formatProfileACWDataEntry(0, options)).toStrictEqual(<HighlightRed>{"Options configured but feature disabled"}</HighlightRed>);
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
    test("should return activity within a BubbleDiv", () => {
      expect(formatActivityData("Busy")).toStrictEqual(<BubbleDiv>{"Busy"}</BubbleDiv>);
    });
    test("should return empty string for null activity", () => {
      expect(formatActivityData(null)).toBe("");
    });
  });

  describe("formatProfileACWDataEntry", () => {

    test("test should return single queue ", () => {
      const aggrQueue = [
        {
          "id": 0,
          "name": "PGS Gold",
          "ownerType": "profile",
          "workerSid": null,
          "queues": [
            {
              "id": 106,
              "skillName": "pgsGoldSpanish",
              "taskQueueName": "PGS - Gold Spanish",
              "taskQueueSid": "WQaae7385a70e4c4ef8d74f1f93ebd5c33"
            }
          ]
        }
      ];
      expect(formatAggregateQueues(aggrQueue)).toStrictEqual([<BubbleDiv key={"PGS Gold"}>{"PGS Gold"}</BubbleDiv>]);
    });

    test("test should return aggregated queue with icon", () => {
      const aggrQueue = [
        {
          "id": 0,
          "name": "PGS Gold",
          "ownerType": "profile",
          "workerSid": null,
          "queues": [
            {
              "id": 106,
              "skillName": "pgsGoldSpanish",
              "taskQueueName": "PGS - Gold Spanish",
              "taskQueueSid": "WQaae7385a70e4c4ef8d74f1f93ebd5c33"
            },
            {
              "id": 107,
              "skillName": "pgsGold Service Testing",
              "taskQueueName": "PGS - Gold Spanish",
              "taskQueueSid": "WQaae7385a70e4c4ef8d74f1f93ebd5c33"
            }
          ]
        }
      ];
      expect(formatAggregateQueues(aggrQueue)).toStrictEqual([<BubbleDiv key={"PGS Gold"}>{"PGS Gold"} <AutoAwesomeMotion fontSize="1 rem"/></BubbleDiv>]);
    });

    test("no queues, test should be empty array", () => {
      const aggrQueue = [];
      expect(formatAggregateQueues(aggrQueue)).toStrictEqual([]);
    });
  });
});
