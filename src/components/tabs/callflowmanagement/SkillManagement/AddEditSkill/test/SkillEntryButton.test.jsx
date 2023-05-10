import SkillEntryButton from "../SkillEntryButton";
import React from "react";
import {
  act,
  render,
  setupMockedComponents,
  initialTestState,
  authenticationProfileTemplates
} from "testUtils";
import { Modal } from "@mui/material";
import SkillEntryFormModal from "../SkillEntryFormModal";
import { StyledExportButton } from "../../Skills.Styles";
import { useAdminState } from "context";
import { getAuthenticationProfileTemplates } from "authentication";

jest.mock("../../Skills.Styles", () => ({
  StyledExportButton: jest.fn()
}));

jest.mock("components", () => ({
  StyledButton: jest.fn()
}));

jest.mock("@mui/material", () => ({
  Modal: jest.fn()
}));

jest.mock("../SkillEntryFormModal", () => ({
  __esModule: true,
  default: jest.fn()
}));

jest.mock("context", () => ({
  useAdminState: jest.fn()
}));

describe("<SkillEntryButton />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getAuthenticationProfileTemplates.mockReturnValue(authenticationProfileTemplates);
    useAdminState.mockReturnValue({
      ...initialTestState,
      userContext: {
        ...initialTestState.userContext,
        authenticationProfiles: [
          {
            ...initialTestState.userContext.authenticationProfiles[0],
            isAdmin: true,
            profileId: 0
          }
        ]
      }
    });
    setupMockedComponents({
      Modal,
      StyledExportButton,
      SkillEntryFormModal
    });
  });
  describe("initial render", () => {
    test("should render as expected", () => {
      render(<SkillEntryButton
        formMode={"INSERT"}
        taskQueues={[]}
        applications={[]}
        timeOfDays={[]} />);

      expect(Modal.mock.calls[0][0].open).toBe(false);
      expect(Modal.mock.calls.length).toBe(1);
      expect(StyledExportButton.mock.calls.length).toBe(1);
      expect(SkillEntryFormModal.mock.calls.length).toBe(0);
    });
    test("if user is not admin, button does not render", () => {
      useAdminState.mockReturnValueOnce({
        ...initialTestState,
        userContext: {
          ...initialTestState.userContext,
          authenticationProfiles: [
            {
              ...initialTestState.userContext.authenticationProfiles[0],
              isAdmin: false,
              profileId: 10
            }
          ]
        }
      });
      render(<SkillEntryButton
        formMode={"INSERT"}
        taskQueues={[]}
        applications={[]}
        timeOfDays={[]} />);
      expect(Modal.mock.calls.length).toBe(0);
      expect(StyledExportButton.mock.calls.length).toBe(0);
      expect(SkillEntryFormModal.mock.calls.length).toBe(0);
    });
  });
  describe("Button is clicked", () => {
    test("Modal opens", () => {
      render(<SkillEntryButton
        formMode={"INSERT"}
        taskQueues={[ { thing: "1" }]}
        applications={[ { stuff: "yay" }]}
        timeOfDays={[{ cool: "beans" }]} />);
      expect(Modal.mock.calls[0][0].open).toBe(false);
      expect(Modal.mock.calls.length).toBe(1);
      const onClick = StyledExportButton.mock.calls[0][0].onClick;
      act(() => {
        onClick();
      });

      render(Modal.mock.calls[1][0].children);
      expect(Modal.mock.calls.length).toBe(2);
      expect(Modal.mock.calls[1][0].open).toBe(true);
      expect(SkillEntryFormModal.mock.calls.length).toBe(1);
    });
  });
});
