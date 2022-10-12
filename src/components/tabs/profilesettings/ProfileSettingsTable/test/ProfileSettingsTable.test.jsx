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
        completeTasksOnActivityChange_option_i: {
          data: [0]
        },
        policy_number_edit_i: {
          data: [0]
        },
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
        completeTasksOnActivityChange_option_i: {
          data: [0]
        },
        policy_number_edit_i: {
          data: [0]
        },
      },
    ];
    test("should render header and correct info & buttons for each entry", () => {
      const rendered = render(<ProfileSettingsTable profileList={profiles}/>)
      expect(rendered.getByText("ID", { selector: "th" })).toBeInTheDocument();
      expect(rendered.getByText("Name", { selector: "th" })).toBeInTheDocument();
      expect(rendered.getByText("Recorded", { selector: "th" })).toBeInTheDocument();
      expect(rendered.getByText("Auto Answered", { selector: "th" })).toBeInTheDocument();
      expect(rendered.getByText("PMT PRCSG", { selector: "th" })).toBeInTheDocument();
      expect(rendered.getByText("Outbound Recorded", { selector: "th" })).toBeInTheDocument();
      expect(rendered.getByText("ACW Option", { selector: "th" })).toBeInTheDocument();
      expect(rendered.getByText("Manual Recorded", { selector: "th" })).toBeInTheDocument();
      expect(rendered.getByText("ACW Data Entry", { selector: "th" })).toBeInTheDocument();
      expect(rendered.getByText("Manual Recorded Inbound", { selector: "th" })).toBeInTheDocument();
      expect(rendered.getByText("Agent Assisted Pay", { selector: "th" })).toBeInTheDocument();
      expect(rendered.getByText("Overflow Skill", { selector: "th" })).toBeInTheDocument();
      expect(rendered.getByText("CTAC Profile Change", { selector: "th" })).toBeInTheDocument();
      expect(rendered.getByText("Policy Number Edit", { selector: "th" })).toBeInTheDocument();
      const tableRows = rendered.getAllByTestId("table-row");
      expect(tableRows.length).toBe(2);
    });
  });
});
