import { ProfileSettingsTable } from "../ProfileSettingsTable";
import { checkIfPO } from "authentication/authUtils";
import React from "react";
import {
  act,
  expectMockedComponent,
  fireEvent,
  initialSkillState,
  initialTestState,
  render,
  setupMockedComponents,
  mockProfiles
} from "testUtils";
import {
  profileEntryFormDispatch, useAdminState, useSkillState
} from "context/appContext";
import { ProfileEntryForm } from "orgmanagement/ProfileEntryForm";
import {
  Check, Edit
} from "@mui/icons-material";

jest.mock("authentication/authUtils", () => ({
  checkIfPO: jest.fn()
}));

jest.mock("@mui/icons-material", () => ({
  Check: jest.fn(),
  Edit: jest.fn()
}));


jest.mock("orgmanagement/ProfileEntryForm", () => ({
  ProfileEntryForm: jest.fn()
}));

jest.mock("context/appContext", () => ({
  useAdminState: jest.fn(),
  useSkillState: jest.fn(),
  profileEntryFormDispatch: jest.fn(),
  profileEntryFormActions: { SET_UPDATE_PROFILE_FORM_STATE: "SET_UPDATE_PROFILE_FORM_STATE" }
}));

const mockSetForm = jest.fn();
const setProfileModalState = jest.fn();

describe("<ProfileSettingsTable />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAdminState.mockReturnValue(initialTestState);
    useSkillState.mockReturnValue(initialSkillState);
    checkIfPO.mockReturnValue(false);
    setupMockedComponents({
      ProfileEntryForm,
      Edit,
      Check
    });
    profileEntryFormDispatch.mockReturnValue(mockSetForm);
  });

  const validNid = "n0138110";

  const renderComponent = Nid => {
    const rendered = render(<ProfileSettingsTable loggedInRep={Nid} setProfileModalState={setProfileModalState}/>);
    return rendered;
  };

  describe("profile settings table", () => {
    test("should render correct column headers and number of rows", async () => {
      const rendered = renderComponent(validNid, mockProfiles);
      expect(rendered.getByText("ID", { selector: "th" })).toBeInTheDocument();
      expect(rendered.getByText("Name", { selector: "th" })).toBeInTheDocument();
      expect(rendered.getByText("Inbound Recorded", { selector: "th" })).toBeInTheDocument();
      expect(rendered.getByText("Auto Answered", { selector: "th" })).toBeInTheDocument();
      expect(rendered.getByText("Payment Processing", { selector: "th" })).toBeInTheDocument();
      expect(rendered.getByText("Outbound Recorded", { selector: "th" })).toBeInTheDocument();
      expect(rendered.getByText("ACW Option", { selector: "th" })).toBeInTheDocument();
      expect(rendered.getByText("Manual Outbound Recorded", { selector: "th" })).toBeInTheDocument();
      expect(rendered.getByText("ACW Data Entry", { selector: "th" })).toBeInTheDocument();
      expect(rendered.getByText("Manual Inbound Recorded", { selector: "th" })).toBeInTheDocument();
      expect(rendered.getByText("Agent Assisted Pay", { selector: "th" })).toBeInTheDocument();
      expect(rendered.getByText("Overflow Skill", { selector: "th" })).toBeInTheDocument();
      expect(rendered.getByText("Policy Number Edit", { selector: "th" })).toBeInTheDocument();
      expect(rendered.getByText("Voice Mail Transcription", { selector: "th" })).toBeInTheDocument();
      expect(rendered.getByText("Call Reason", { selector: "th" })).toBeInTheDocument();
      expect(rendered.getByText("Click To Dial", { selector: "th" })).toBeInTheDocument();
      expect(rendered.getByText("EFT Authorization", { selector: "th" })).toBeInTheDocument();
      expect(rendered.getByText("Claim Number Edit", { selector: "th" })).toBeInTheDocument();
      expect(rendered.getByText("Self Service Indicator", { selector: "th" })).toBeInTheDocument();
      expect(rendered.getByText("Activities", { selector: "th" })).toBeInTheDocument();
      expect(rendered.getByText("Transfer Queues", { selector: "th" })).toBeInTheDocument();
      expect(rendered.getByText("Access Group", { selector: "th" })).toBeInTheDocument();
      expect(rendered.getByText("Operating Unit", { selector: "th" })).toBeInTheDocument();
      expect(rendered.getByText("FTO Backup", { selector: "th" })).toBeInTheDocument();
      const tableRows = rendered.getAllByTestId("table-row");
      const tableHeaders = rendered.getAllByTestId("table-header");
      expect(tableRows.length).toBe(3);
      expect(tableHeaders.length).toBe(25);
    });

    test("should render correct tooltips", async () => {
      const rendered = renderComponent(validNid, mockProfiles);
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
      expect(rendered.getByLabelText("Enable EFT authorization tagging on recordings")).toBeInTheDocument();
      expect(rendered.getByLabelText("UI Feature: An agent can capture and save a different claim number than what the IVR previously loaded")).toBeInTheDocument();
      expect(rendered.getByLabelText("UI Feature: Allows agent to record call reason data.")).toBeInTheDocument();
      expect(rendered.getByLabelText("Self service indicator is applicable to profiles with an id of 39 and above, but is actually set at the worker attribute level")).toBeInTheDocument();
      expect(rendered.getByLabelText("Profile Activities")).toBeInTheDocument();
      expect(rendered.getByLabelText("UI Feature: Additional transfer queues that will appear in the Triton queue ticker")).toBeInTheDocument();
      expect(rendered.getByLabelText("Which OU a profile is assigned to")).toBeInTheDocument();
      expect(rendered.getByLabelText("Default forward to number to be used when no overflow skill exists")).toBeInTheDocument();
      expect(rendered.getByLabelText("Enable/Disable the FTO Backup Workers feature")).toBeInTheDocument();
    });

    test("should render row data", async () => {
      const rendered = renderComponent(validNid, mockProfiles);
      expect(Check).toHaveBeenCalledTimes(15);
      expect(Edit).toHaveBeenCalledTimes(0);
      expect(rendered.container).toHaveTextContent("0"); // Profile Number
      expect(rendered.container).toHaveTextContent("Game of Phones"); // Profile Name
      expect(rendered.container).toHaveTextContent("lscOBDialer1"); // Overflow Skill
      expect(rendered.container).toHaveTextContent("Claims"); //Operating Unit Name
      expect(rendered.container).toHaveTextContent("(866) 568-0296"); // forward to num
      expect(rendered.container).toHaveTextContent("NI Billing & Collections"); //task queue
      expect(rendered.container).toHaveTextContent("PSU Claims - Level 1"); //task queue
      expect(rendered.container).toHaveTextContent("Canon"); // Access Group Name
      expect(rendered.container).toHaveTextContent("Negotiation Type"); //CallTag
      expect(rendered.container).toHaveTextContent("Claim Number"); //CallTag
    });
  });

  describe("Edit icon", () => {
    describe("invalid NNumber", () => {
      test("does not render any edit icons for an invalidNid", () => {
        const invalidNid = "n0288362";
        const rendered = renderComponent(invalidNid, mockProfiles);
        expect(rendered.queryAllByTestId("edit-button")).toHaveLength(0);
      });
    });
    describe("valid NNumber", () => {
      beforeEach(() => {
        checkIfPO.mockReturnValue(true);
      });
      test("when clicked in row should show ProfileEntryForm for corresponding profile", () => {
        const rendered = renderComponent(validNid, mockProfiles);
        const editButtons = rendered.getAllByTestId("edit-button");
        expectMockedComponent(rendered, { ProfileEntryForm }, 0);
        const indexClicked = 0;
        act(() => fireEvent.click(editButtons[indexClicked]));
        expect(setProfileModalState).toHaveBeenCalledWith({
          open: true
        });
      });
      test("renders an edit icon per profile for a validNid", () => {
        renderComponent(validNid, mockProfiles);
        expect(Edit).toHaveBeenCalledTimes(3);
      });
    });
  });
});
