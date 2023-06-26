import ProfileSettingsTable from "../ProfileSettingsTable";
import { checkIfPO } from "authentication";
import React from "react";
import {
  act,
  expectMockedComponent,
  fireEvent,
  render,
  setupMockedComponents
} from "testUtils";
import { profileEntryFormDispatch } from "context";
import { ProfileEntryForm } from "components";

jest.mock("authentication", () => ({
  checkIfPO: jest.fn()
}));

jest.mock("context", () => ({
  __esModule: true,
  profileEntryFormDispatch: jest.fn(),
  profileEntryFormActions: { SET_UPDATE_PROFILE_FORM_STATE: "SET_UPDATE_PROFILE_FORM_STATE" }
}));

jest.mock("components", () => ({
  __esModule: true,
  ProfileEntryForm: jest.fn()
}));

const mockSetForm = jest.fn();
const setProfileModalState = jest.fn();

describe("<ProfileSettingsTable />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    checkIfPO.mockReturnValue(false);
    setupMockedComponents({
      ProfileEntryForm
    });
    profileEntryFormDispatch.mockReturnValue(mockSetForm);
  });

  const validNid = "n0138110";
  const profiles = [
    {
      activities: [{
        profile_id: 0,
        activity_id: 1,
        activity_nme: "Offline",
        availability: 0
      }],
      acw_data_entry_i: {
        data: [1],
        type: "Buffer"
      },
      acw_option_i: {
        data: [0],
        type: "Buffer"
      },
      agent_assisted_pay_i: {
        data: [1],
        type: "Buffer"
      },
      aggregateQueues: [
        {
          aggregate_queues_id: 0,
          aggregate_queues_nme: "PGS - Gold Spanish",
          aggregate_queues_type: "single",
          owner_type: "profile",
          profile_id: 0,
          queues: [
            {
              skill_id: 106,
              skill_nme: "PGS - Gold Spanish",
              skill_num: "pgsGoldSpanish",
              tsk_que_sid: "WQaae7385a70e4c4ef8d74f1f93ebd5c33"
            }
          ],
          workerSid: null
        }
      ],
      auto_answd_i: {
        data: [0],
        type: "Buffer"
      },
      callTags: [{
        profile_id: 15,
        display_nme: "Negotiation Type",
        wrkr_tsk_info_id: 3,
        wrkr_tsk_info_nme: "negotiation_type",
        options_id: 1,
        options: [
          "Info Exchange",
          "Bargaining",
          "Closing",
          "N/A",
          "Offer"
        ]
      }],
      click_to_dial_i: {
        data: [1],
        type: "Buffer"
      },
      manual_record_inbound_i: {
        data: [1],
        type: "Buffer"
      },
      manual_recorded_i: {
        data: [1],
        type: "Buffer"
      },
      otbnd_recorded_i: {
        data: [1],
        type: "Buffer"
      },
      overflow_skill: "Test Overflow Skill",
      pmt_prcsg_i: {
        data: [0],
        type: "Buffer"
      },
      policy_number_edit_i: {
        data: [0],
        type: "Buffer"
      },
      profile_id: 1,
      profile_nme: "Game of Phones",
      recorded_i: {
        data: [0],
        type: "Buffer"
      },
      skills: [{
        profile_id: 12,
        skill_id: 21,
        skill_num: "bscCbs",
        skill_nme: "BSC - CBS"
      }],
      voice_mail_transcription_i: {
        data: [0],
        type: "Buffer"
      }
    }
  ];

  const renderComponent = Nid => {
    const rendered = render(<ProfileSettingsTable profileList={profiles} loggedInRep={Nid} setProfileModalState={setProfileModalState}/>);
    return rendered;
  };

  describe("profile settings table", () => {
    test("should render correct column headers and number of rows", async () => {
      const rendered = renderComponent(validNid);
      expect(rendered.getByText("ID", { selector: "th" })).toBeInTheDocument();
      expect(rendered.getByText("Name", { selector: "th" })).toBeInTheDocument();
      expect(rendered.getByText("Inbound Recorded", { selector: "th" })).toBeInTheDocument();
      expect(rendered.getByText("Auto Answered", { selector: "th" })).toBeInTheDocument();
      expect(rendered.getByText("Payment Processing", { selector: "th" })).toBeInTheDocument();
      expect(rendered.getByText("Outbound Recorded", { selector: "th" })).toBeInTheDocument();
      expect(rendered.getByText("ACW Option", { selector: "th" })).toBeInTheDocument();
      expect(rendered.getByText("Manual Recorded", { selector: "th" })).toBeInTheDocument();
      expect(rendered.getByText("ACW Data Entry", { selector: "th" })).toBeInTheDocument();
      expect(rendered.getByText("Manual Recorded Inbound", { selector: "th" })).toBeInTheDocument();
      expect(rendered.getByText("Agent Assisted Pay", { selector: "th" })).toBeInTheDocument();
      expect(rendered.getByText("Overflow Skill", { selector: "th" })).toBeInTheDocument();
      expect(rendered.getByText("Policy Number Edit", { selector: "th" })).toBeInTheDocument();
      expect(rendered.getByText("Voice Mail Transcription", { selector: "th" })).toBeInTheDocument();
      expect(rendered.getByText("Click To Dial", { selector: "th" })).toBeInTheDocument();
      expect(rendered.getByText("Self Service Indicator", { selector: "th" })).toBeInTheDocument();
      expect(rendered.getByText("Activities", { selector: "th" })).toBeInTheDocument();
      expect(rendered.getByText("Transfer Queues", { selector: "th" })).toBeInTheDocument();
      expect(rendered.getByText("Access Group", { selector: "th" })).toBeInTheDocument();
      expect(rendered.getByText("Operational Unit", { selector: "th" })).toBeInTheDocument();
      const tableRows = rendered.getAllByTestId("table-row");
      const tableHeaders = rendered.getAllByTestId("table-header");
      expect(tableRows.length).toBe(1);
      expect(tableHeaders.length).toBe(20);
    });

    test("should render correct tooltips", async () => {
      const rendered = renderComponent(validNid);
      expect(rendered.getByLabelText("Unique Profile Identification")).toBeInTheDocument();
      expect(rendered.getByLabelText("Profile Name")).toBeInTheDocument();
      expect(rendered.getByLabelText("All inbound calls are automatically recorded")).toBeInTheDocument();
      expect(rendered.getByLabelText("Automatically accepts a call and routes to an agent")).toBeInTheDocument();
      expect(rendered.getByLabelText("UI Feature: Click for payment button is enabled to manually pause/resume call recordings")).toBeInTheDocument();
      expect(rendered.getByLabelText("All outbound calls are automatically recorded")).toBeInTheDocument();
      expect(rendered.getByLabelText("UI Feature: Agent has the choice to enable or disable after call work (wrap-up). Default setting is off")).toBeInTheDocument();
      expect(rendered.getByLabelText("UI Feature: Manual recording button appears in call controls when enabled. User will have the ability to manually start and stop recordings")).toBeInTheDocument();
      expect(rendered.getByLabelText("UI Feature: If enabled, during wrap-up, call tagging toggle appears which gives an input form to the user")).toBeInTheDocument();
      expect(rendered.getByLabelText("UI Feature: Manual recording button appears in call controls when enabled. User will have the ability to manually start and stop recordings on inbound calls")).toBeInTheDocument();
      expect(rendered.getByLabelText("Not a currently enabled UI feature")).toBeInTheDocument();
      expect(rendered.getByLabelText("An agent misses a call and it is forwarded to the next available agent with the same manager")).toBeInTheDocument();
      expect(rendered.getByLabelText("UI Feature: An agent can capture and save a different policy number than what the IVR previously loaded")).toBeInTheDocument();
      expect(rendered.getByLabelText("Voice mail will be transcribed and sent within the notification email to the user")).toBeInTheDocument();
      expect(rendered.getByLabelText("Enable click-to-dial/transfer from external application")).toBeInTheDocument();
      expect(rendered.getByLabelText("Self service indicator is applicable to profiles with an id of 39 and above, but is actually set at the worker attribute level")).toBeInTheDocument();
      expect(rendered.getByLabelText("Profile Activities")).toBeInTheDocument();
      expect(rendered.getByLabelText("UI Feature: Additional transfer queues that will appear in the Triton queue ticker")).toBeInTheDocument();
      expect(rendered.getByLabelText("Column to show which OU a profile is assigned to")).toBeInTheDocument();
    });

    test("should render row data", async () => {
      const rendered = renderComponent(validNid);
      expect(rendered.container).toHaveTextContent("1");
      expect(rendered.container).toHaveTextContent("Game of Phones");
      expect(rendered.container).toHaveTextContent("Test Overflow Skill");
    });
  });

  describe("Edit icon", () => {
    describe("invalid NNumber", () => {
      test("does not render any edit icons for an invalidNid", () => {
        const invalidNid = "n0288362";
        const rendered = renderComponent(invalidNid);
        expect(rendered.queryAllByTestId("edit-button")).toHaveLength(0);
      });
    });
    describe("valid NNumber", () => {
      beforeEach(() => {
        checkIfPO.mockReturnValue(true);
      });
      test("when clicked in row should show ProfileEntryForm for corresponding profile", () => {
        const rendered = renderComponent(validNid);
        const editButtons = rendered.getAllByTestId("edit-button");
        expectMockedComponent(rendered, { ProfileEntryForm }, 0);
        const indexClicked = 0;
        act(() => fireEvent.click(editButtons[indexClicked]));
        expect(setProfileModalState).toHaveBeenCalledWith({
          open: true
        });
      });
      test("renders an edit icon per profile for a validNid", () => {
        const rendered = renderComponent(validNid);
        expect(rendered.queryAllByTestId("edit-button")).toHaveLength(1);
      });
    });
  });
});
