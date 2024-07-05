import { ProfileSettingsContainer } from "../ProfileSettingsContainer";
import { checkIfPO } from "authentication/authUtils";
import MockAdapter from "axios-mock-adapter";
import { StyledButton } from "components/StyledButton";
import { ProfileSettingsTable } from "components/tabs/orgmanagement/triton/ProfileSettingsContainer/ProfileSettingsTable/ProfileSettingsTable";
import { ProfileEntryForm } from "orgmanagement/ProfileEntryForm";
import { Modal } from "@mui/material";
import { PageLoadSpinner } from "components/PageLoadSpinner";
import { useAdminDispatch, useAdminState, useSkillDispatch, useSkillState } from "context/appContext";
import React from "react";
import { act } from "react-dom/test-utils";
import { loadSoftphoneConfigRelationships } from "services/profile";
import { loadSkillOptions } from "services/skill";
import {
  expectMockedComponent,
  render,
  setupMockedComponents,
  initialTestState as initialState,
  initialSkillState,
  mockProfiles
} from "testUtils";
import { myAxios } from "utils/myAxios";

const axiosMock = new MockAdapter(myAxios);

jest.mock("components/StyledButton", () => ({
  StyledButton: jest.fn()
}));

jest.mock("orgmanagement/ProfileSettingsTable", () => ({
  ProfileSettingsTable: jest.fn()
}));

jest.mock("orgmanagement/ProfileEntryForm", () => ({
  ProfileEntryForm: jest.fn()
}));

jest.mock("components/PageLoadSpinner", () => ({
  PageLoadSpinner: jest.fn()
}));

jest.mock("services/profile", () => ({
  loadSoftphoneConfigRelationships: jest.fn()
}));

jest.mock("services/skill", () => ({
  loadSkillOptions: jest.fn()
}));

jest.mock("context/appContext", () => ({
  useAdminState: jest.fn(),
  useAdminDispatch: jest.fn(),
  useSkillState: jest.fn(),
  useSkillDispatch: jest.fn(),
  ProfileEntryFormStateProvider: jest.requireActual("context/appContext").ProfileEntryFormStateProvider
}));

jest.mock("context/reducer", () => ({
  default: jest.fn()
}));

jest.mock("context/userFormReducer", () => ({
  default: jest.fn()
}));

jest.mock("@mui/material", () => ({
  Modal: jest.fn()
}));

jest.mock("authentication/authUtils", () => ({
  checkIfPO: jest.fn()
}));


const initialTestState = {
  ...initialState,
  profileContext: {
    profiles: mockProfiles
  },
  userContext: {
    nNumber: "n1234567"
  }
};

describe("<ProfileSettingsContainer />", () => {

  beforeEach(() => {
    axiosMock.reset();
    jest.clearAllMocks();
    useAdminState.mockReturnValue(initialTestState);
    useSkillState.mockReturnValue(initialSkillState);
    checkIfPO.mockReturnValue(true);
    setupMockedComponents({
      ProfileSettingsTable,
      StyledButton,
      Modal,
      ProfileEntryForm
    });
  });

  const renderComponent = () => {
    return render(<ProfileSettingsContainer />);
  };

  describe("Profile Entry Form Modal", () => {
    test.only("form should not render on initial state", () => {
      const rendered = renderComponent();
      expectMockedComponent(rendered, { ProfileEntryForm }, 0);
    });
    test("create profile button and profile settings table is shown when dropdown is changed to PROFILE_SETTINGS", () => {
      const rendered = renderComponent();
      expectMockedComponent(rendered, { StyledButton }, 1);
      expectMockedComponent(rendered, { ProfileSettingsTable }, 1);
    });
    test("When ProfileEntryForm handleClose is called, setProfileEntryFormState is set to open === false", () => {
      const rendered = renderComponent();
      expectMockedComponent(rendered, { ProfileEntryForm }, 0);
      expect(StyledButton.mock.calls[0][0].children).toBe("Create Profile");
      act(() => {
        const onClick = StyledButton.mock.calls[0][0].onClick;
        onClick();
      });
      render(Modal.mock.calls[0][0].children);
      expectMockedComponent(rendered, { ProfileEntryForm }, 1);
      const handleClose = ProfileEntryForm.mock.calls[0][0].handleClose;
      act(() => {
        handleClose();
      });
    });
  });
});