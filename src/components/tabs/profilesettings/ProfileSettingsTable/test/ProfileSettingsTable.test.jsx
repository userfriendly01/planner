import ProfileSettingsTable from "../ProfileSettingsTable";
import React from "react";
import { render } from "testUtils";

describe("<ProfileSettingsTable />", () => {
  describe("profile has entries in its profile list", () => {
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
        activities: ["Offline", "Available", "Busy"]
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
        activities: ["Offline", "Available", "Busy"]
      }
    ];

    test("should render correct column headers and number of rows", async () => {
      const rendered = render(<ProfileSettingsTable profileList={profiles}/>)
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
      expect(tableRows.length).toBe(2);
    });

    test("should render correct tooltips", async () => {
      const rendered = render(<ProfileSettingsTable profileList={profiles}/>)
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
      expect(rendered.getByLabelText("enter tooltip here")).toBeInTheDocument();
      expect(rendered.getByLabelText("Profile Activities")).toBeInTheDocument();
    });
  });
});
