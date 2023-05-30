import React from "react";
import {
  Check,
  AutoAwesomeMotion
} from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import {
  formatProfileBooleanData,
  formatProfileBooleanDataTrueFalse,
  formatProfileACWDataEntry,
  formatSimpleText,
  formatActivityData,
  formatCallTagsName,
  formatAggregateQueues,
  formatSelfServiceIndicatorData,
  createProfilePayload,
  updateProfilePayload
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
    test("should return multiple BubbleDivs with display names / tooltips inside", () => {
      const options = [
        {
          display_nme: "Claim Number",
          wrkr_tsk_info_id: 2,
          wrkr_tsk_info_nme: "claim_number",
          profile_id: 15,
          options_id: null,
          options: null
        },
        {
          display_nme: "Call Type",
          wrkr_tsk_info_id: 1,
          wrkr_tsk_info_nme: "call_type",
          profile_id: 15,
          options_id: null,
          options: null
        },
        {
          display_nme: "Negotiation Type",
          wrkr_tsk_info_nme: "negotiation_type",
          wrkr_tsk_info_id: 3,
          profile_id: 15,
          options_id: 1,
          options: [
            "Info Exchange",
            "Bargaining",
            "Closing",
            "N/A",
            "Offer"
          ]
        }
      ];
      expect(formatProfileACWDataEntry(1, options, BubbleDiv, HighlightRed)).toStrictEqual(
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

  describe("formatSimpleText", () => {
    test("should return overflow skill", () => {
      expect(formatSimpleText("OverflowSkill")).toBe("OverflowSkill");
    });
    test("should return empty string for null overflow skill", () => {
      expect(formatSimpleText(null)).toBe("");
    });
  });

  describe("formatActivityData", () => {
    test("should return activity within a BubbleDiv", () => {
      expect(formatActivityData("Busy", BubbleDiv)).toStrictEqual(<BubbleDiv>{"Busy"}</BubbleDiv>);
    });
    test("should return empty string for null activity", () => {
      expect(formatActivityData(null, BubbleDiv)).toBe("");
    });
  });

  describe("formatCallTagsName", () => {
    test("should return a formatted call tag with one underscore", () => {
      expect(formatCallTagsName("claim_number")).toStrictEqual("Claim Number");
    });
    test("should return a formatted call tag with multiple underscores", () => {
      expect(formatCallTagsName("aces_claim_number")).toStrictEqual("Aces Claim Number");
    });
    test("should return a formatted call tag with no underscores", () => {
      expect(formatCallTagsName("notes")).toStrictEqual("Notes");
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

  describe("formatAggregateQueues", () => {
    test("test should return single queue ", () => {
      const aggrQueue = [
        {
          profile_id: 0,
          aggregate_queues_id: 1,
          aggregate_queues_nme: "PSU Claims - Level 1",
          aggregate_queues_type: "single",
          owner_type: "profile",
          worker_sid: null,
          queues: [
            {
              skill_id: 1,
              skill_num: "psu-l1",
              skill_nme: "PSU Claims - Level 1",
              tsk_que_sid: "WQ9e7f40c067bb9006022f43266122a257"
            }
          ]
        }
      ];
      expect(formatAggregateQueues(aggrQueue, BubbleDiv)).toStrictEqual([<BubbleDiv key={"PSU Claims - Level 1"}>{"PSU Claims - Level 1"}</BubbleDiv>]);
    });
    test("test should return aggregated queue with icon", () => {
      const aggrQueue = [
        {
          profile_id: 0,
          aggregate_queues_id: 1,
          aggregate_queues_nme: "PSU Claims - Level 1",
          aggregate_queues_type: "aggregate",
          owner_type: "profile",
          worker_sid: null,
          queues: [
            {
              skill_id: 1,
              skill_num: "psu-l1",
              skill_nme: "PSU Claims - Level 1",
              tsk_que_sid: "WQ9e7f40c067bb9006022f43266122a257"
            }
          ]
        }
      ];
      expect(formatAggregateQueues(aggrQueue, BubbleDiv)).toStrictEqual([<BubbleDiv key={"PSU Claims - Level 1"}>{"PSU Claims - Level 1"} <AutoAwesomeMotion fontSize="1 rem"/></BubbleDiv>]);
    });
    test("no queues, test should be empty array", () => {
      const aggrQueue = [];
      expect(formatAggregateQueues(aggrQueue, BubbleDiv)).toStrictEqual([]);
    });
  });

  describe("createProfilePayload", () => {
    const form = {
      profileId: null,
      activitiesList: [
        {
          activity_id: 1
        },
        {
          activity_id: 7
        },
        {
          activity_id: 12
        },
      ],
      callTagsList: [
        {
          wrkr_tsk_info_id: 1,
          wrkr_tsk_info_nme:'claim_number',
          options_id: 1
        },
        {
          wrkr_tsk_info_id: 2,
          wrkr_tsk_info_nme:'aces_claim_number',
          options_id: 1
        }
      ],
      autoAnswered: {
        value: true
      },
      inboundRecorded: {
        value: true
      },
      outboundRecorded: {
        value: true
      },
      acwOption: {
        value: false
      },
      manualRecorded: {
        value: false
      },
      acwDataEntry: {
        value: true
      },
      manualRecordedInbound: {
        value: true
      },
      agentAssistedPay: {
        value: true
      },
      voiceMailTranscription: {
        value: false
      },
      paymentProcessing: {
        value: true
      },
      policyNumberEdit: {
        value: false
      },
      clickToDial: {
        value: false
      },
      overflowSkill: {
        value: "OverflowTestSKill",
        updated: false,
        valid: true
      },
      profileName: {
        value: "UnitTestProfile",
        updated: false,
        valid: false
      },
      transferQueues: [
        {
          ctmSkillId: 1,
          ctmSkillDisplayName: "AISG"
        },
        {
          ctmSkillId: 5,
          ctmSkillDisplayName: "Gold"
        },
        {
          ctmSkillId: -10,
          ctmSkillDisplayName: "Licensed Sales Center"
        }
      ],
      operatingUnit: {
        ou_sid: "123",
        ou_name: "hello"
      },
      accessGroup: {
        value: true,
        updated: true
      },
      accessGroupId: 2,
      accessGroupIdUpdated: true,
    };
    const expected = {
      activities: [1,7,12],
      acw_data_entry_i: true,
      acw_option_i: false,
      agent_assisted_pay_i: true,
      aggregateQueues: [10],
      auto_answd_i: true,
      callTags: [
        {
          display_nme: "Claim Number",
          options_id: 1,
          wrkr_tsk_info_id: 1
        },
        {
          display_nme: "Aces Claim Number",
          options_id: 1,
          wrkr_tsk_info_id: 2
        }
      ],
      click_to_dial_i: false,
      manual_record_inbound_i: true,
      manual_recorded_i: false,
      operating_unit_nme: "hello",
      operating_unit_sid: "123",
      otbnd_recorded_i: true,
      overflow_skill: "OverflowTestSKill",
      pmt_prcsg_i: true,
      policy_number_edit_i: false,
      profile_id: null,
      profile_nme: "UnitTestProfile",
      recorded_i: true,
      transferQueues: [
        {
          skill_id: 1,
          skill_nme: "AISG"
        },
        {
          skill_id: 5,
          skill_nme: "Gold"
        }
      ],
      access_group: true,
      voice_mail_transcription_i: false,
      access_group_id: 2
    };

    test("should return a formatted call tag with one underscore", () => {
      expect(createProfilePayload(form)).toStrictEqual(expected);
    });
  });

  describe("updateProfilePayload", () => {
    const form = {
      profileId: 1,
      activitiesList: [
        {
          activity_id: 1
        },
        {
          activity_id: 7
        },
        {
          activity_id: 12
        },
      ],
      activitiesUpdated: true,
      callTagsList: [
        {
          wrkr_tsk_info_id: 1,
          wrkr_tsk_info_nme:'claim_number',
          options_id: 1
        },
        {
          wrkr_tsk_info_id: 2,
          wrkr_tsk_info_nme:'aces_claim_number',
          options_id: 1
        }
      ],
      callTagsUpdated: true,
      autoAnswered: {
        value: true,
        updated: true
      },
      inboundRecorded: {
        value: true,
        updated: true
      },
      outboundRecorded: {
        value: true,
        updated: true
      },
      acwOption: {
        value: false,
        updated: true
      },
      manualRecorded: {
        value: false,
        updated: true
      },
      acwDataEntry: {
        value: true,
        updated: true
      },
      manualRecordedInbound: {
        value: true,
        updated: true
      },
      agentAssistedPay: {
        value: true,
        updated: true
      },
      voiceMailTranscription: {
        value: false,
        updated: true
      },
      paymentProcessing: {
        value: true,
        updated: true
      },
      policyNumberEdit: {
        value: false,
        updated: true
      },
      clickToDial: {
        value: false,
        updated: true
      },
      overflowSkill: {
        value: "OverflowTestSKill",
        updated: true,
        valid: true
      },
      profileName: {
        value: "UnitTestProfile",
        updated: true,
        valid: false
      },
      transferQueues: [
        {
          ctmSkillId: 1,
          ctmSkillDisplayName: "AISG"
        },
        {
          ctmSkillId: 5,
          ctmSkillDisplayName: "Gold"
        },
        {
          ctmSkillId: -10,
          ctmSkillDisplayName: "Licensed Sales Center"
        }
      ],
      queuesUpdated: true,
      operatingUnit: {
        ou_name: "hello",
        ou_sid: "123"
      },
      accessGroup: {
        value: true,
        updated: true
      },
      accessGroupId: 2,
      accessGroupIdUpdated: true
    };

    const expected = {
      activities: [1,7,12],
      acw_data_entry_i: true,
      acw_option_i: false,
      agent_assisted_pay_i: true,
      aggregateQueues: [10],
      auto_answd_i: true,
      callTags: [
        {
          display_nme: "Claim Number",
          options_id: 1,
          wrkr_tsk_info_id: 1
        },
        {
          display_nme: "Aces Claim Number",
          options_id: 1,
          wrkr_tsk_info_id: 2
        }
      ],
      click_to_dial_i: false,
      manual_record_inbound_i: true,
      manual_recorded_i: false,
      otbnd_recorded_i: true,
      overflow_skill: "OverflowTestSKill",
      pmt_prcsg_i: true,
      policy_number_edit_i: false,
      profile_id: 1,
      profile_nme: "UnitTestProfile",
      recorded_i: true,
      transferQueues: [
        {
          skill_id: 1,
          skill_nme: "AISG"
        },
        {
          skill_id: 5,
          skill_nme: "Gold"
        }
      ],
      voice_mail_transcription_i: false,
      access_group: true,
      operating_unit_sid: "123",
      operating_unit_nme: "hello",
      access_group_id: 2
    }

    test("should return a formatted call tag with one underscore", () => {
      expect(createProfilePayload(form)).toStrictEqual(expected);
    });
  });
});
