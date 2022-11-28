import ProfileSettingsTable from "../ProfileSettingsTable";
import React from "react";
import {
  act,
  expectMockedComponent,
  fireEvent,
  render,
  setupMockedComponents
} from "testUtils";
import { profileEntryFormDispatch } from "context";
import { ProfileEntryForm } from "components"

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
    setupMockedComponents({
      ProfileEntryForm
    });
    jest.clearAllMocks();
    profileEntryFormDispatch.mockReturnValue(mockSetForm);
  });

  const validNid = "n0138110"
  const profiles = [
    {
      profile_id: 1,
      profile_nme: "Game of Phones",
      recorded_i: {
        data: [0]
      },
      auto_answd_i: {
        data: [0]
      },
      pmt_prcsg_i: {
        data: [0]
      },
      otbnd_recorded_i: {
        data: [1]
      },
      acw_option_i: {
        data: [0]
      },
      manual_recorded_i: {
        data: [1]
      },
      acw_data_entry_i: {
        data: [0]
      },
      manual_record_inbound_i: {
        data: [1]
      },
      agent_assisted_pay_i: {
        data: [1]
      },
      overflow_skill: "Overflow Skill",
      policy_number_edit_i: {
        data: [0]
      },
      voice_mail_transcription_i: {
        data: [0]
      },
      activities: "[{\"id\": 1, \"name\": \"Offline\", \"availability\": 0}]",
      callTags: "[{\"display_nme\": \"Call Type\", \"options_id\": 1, \"profile_id\": 15, \"row_crtn_dtm\": \"2019-10-24T12:58:48.000Z\", \"row_updt_dtm\": \"2019-10-24T12:58:48.000Z\", \"wrkr_tsk_info_id\": 1}]"
    },
    {
      profile_id: 2,
      profile_nme: "Game of Gnomes",
      recorded_i: {
        data: [1]
      },
      auto_answd_i: {
        data: [1]
      },
      pmt_prcsg_i: {
        data: [1]
      },
      otbnd_recorded_i: {
        data: [1]
      },
      acw_option_i: {
        data: [1]
      },
      manual_recorded_i: {
        data: [1]
      },
      acw_data_entry_i: {
        data: [0]
      },
      manual_record_inbound_i: {
        data: [1]
      },
      agent_assisted_pay_i: {
        data: [1]
      },
      overflow_skill: "Overflow Skill 2",
      policy_number_edit_i: {
        data: [0]
      },
      voice_mail_transcription_i: {
        data: [0]
      },
      activities: "[{\"id\": 1, \"name\": \"Offline\", \"availability\": 0}]"
    }
  ];

  describe("profile has entries in its profile list", () => {
    test("should render correct column headers and number of rows", async () => {
      const rendered = render(<ProfileSettingsTable profileList={profiles} loggedInRep={validNid} setProfileModalState={setProfileModalState}/>)
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
      expect(rendered.getByText("Activities", { selector: "th" })).toBeInTheDocument();
      const tableRows = rendered.getAllByTestId("table-row");
      const tableHeaders = rendered.getAllByTestId("table-header");
      expect(tableRows.length).toBe(2);
      expect(tableHeaders.length).toBe(16);
    });

    test("should render correct tooltips", async () => {
      const rendered = render(<ProfileSettingsTable profileList={profiles} loggedInRep={validNid} setProfileModalState={setProfileModalState}/>)
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
      expect(rendered.getByLabelText("Profile Activities")).toBeInTheDocument();
    });
  });

  describe("Edit icon", () => {
    test("when clicked in row should show ProfileEntryForm for corresponding profile", () => {
      const rendered = render(<ProfileSettingsTable profileList={profiles} loggedInRep={validNid} setProfileModalState={setProfileModalState}/>)
      const editButtons = rendered.getAllByTestId("edit-button");
      expectMockedComponent(rendered, { ProfileEntryForm }, 0);
      const indexClicked = 1;
      act(() => fireEvent.click(editButtons[indexClicked]));
      expect(setProfileModalState).toHaveBeenCalledWith({
        open: true
      });
    });
    test("does not render any edit icons for an invalidNid", () => {
      const invalidNid = 'n0288362'
      const rendered = render(<ProfileSettingsTable profileList={profiles} loggedInRep={invalidNid} setProfileModalState={setProfileModalState}/>)
      expect(rendered.queryAllByTestId("edit-button")).toHaveLength(0);
    });
    test("renders an edit icon per profile for a validNid", () => {
      const rendered = render(<ProfileSettingsTable profileList={profiles} loggedInRep={validNid} setProfileModalState={setProfileModalState}/>)
      expect(rendered.queryAllByTestId("edit-button")).toHaveLength(2);
    });
  });
});
