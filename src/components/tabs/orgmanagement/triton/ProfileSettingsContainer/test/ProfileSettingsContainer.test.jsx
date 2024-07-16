import { ProfileSettingsContainer } from "../ProfileSettingsContainer";
import { checkIfPO } from "authentication/authUtils";
import MockAdapter from "axios-mock-adapter";
import { StyledButton } from "components/StyledButton";
import { ProfileSettingsTable } from "components/tabs/orgmanagement/triton/ProfileSettingsContainer/ProfileSettingsTable/ProfileSettingsTable";
import { ProfileEntryForm } from "orgmanagement/ProfileEntryForm";
import { Modal } from "@mui/material";
import { PageLoadSpinner } from "components/PageLoadSpinner";
import { apolloClient } from "components/core/Auth/SharedGraphAPIProvider";
import {
  useAdminDispatch, useAdminState, useSkillState
} from "context/appContext";
import React from "react";
import {
  expectMockedComponent,
  render,
  setupMockedComponents,
  initialTestState as initialState,
  initialSkillState,
  mockProfiles,
  waitFor
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

jest.mock("components/core/Auth/SharedGraphAPIProvider", () => ({
  apolloClient: {
    mutate: jest.fn(),
    query: jest.fn()
  }
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


jest.mock("@mui/material", () => ({
  Modal: jest.fn()
}));

jest.mock("authentication/authUtils", () => ({
  checkIfPO: jest.fn()
}));

const initialTestState = {
  ...initialState,
  profileContext: {
    ...initialState.profileContext,
    profiles: mockProfiles
  },
  userContext: {
    nNumber: "n1234567"
  }
};

const mockDispatch = jest.fn();
describe("<ProfileSettingsContainer />", () => {

  beforeEach(() => {
    axiosMock.reset();
    jest.clearAllMocks();
    useAdminState.mockReturnValue(initialTestState);
    useAdminDispatch.mockReturnValue(mockDispatch);
    useSkillState.mockReturnValue(initialSkillState);
    apolloClient.query.mockResolvedValue();
    checkIfPO.mockReturnValue(true);
    setupMockedComponents({
      ProfileSettingsTable,
      PageLoadSpinner,
      StyledButton,
      Modal,
      ProfileEntryForm
    });
  });

  const renderComponent = () => {
    return render(<ProfileSettingsContainer />);
  };

  describe("Profile Entry Form Modal", () => {
    test("form should not render on initial state", () => {
      checkIfPO.mockReturnValue(false);
      renderComponent();
      expect(PageLoadSpinner).toHaveBeenCalledTimes(1);
    });
    describe("loading === true", () => {
      test("create profile button and profile settings table is shown when loading === true", async () => {
        const rendered = renderComponent();
        await waitFor(() => expect(StyledButton).toHaveBeenCalledTimes(1));
        expectMockedComponent(rendered, { StyledButton }, 1);
        expectMockedComponent(rendered, { ProfileSettingsTable }, 1);
      });
      test("When ProfileEntryForm handleClose is called, setProfileEntryFormState is set to open === false", async () => {
        const rendered = renderComponent();
        await waitFor(() => expect(StyledButton).toHaveBeenCalledTimes(1));
        expect(StyledButton.mock.calls[0][0].children).toBe("Create Profile");
        const onClick = StyledButton.mock.calls[0][0].onClick;
        onClick();
        expect(Modal).toHaveBeenCalledTimes(2);
        render(Modal.mock.calls[1][0].children);
        expectMockedComponent(rendered, { ProfileEntryForm }, 1);
        const handleClose = ProfileEntryForm.mock.calls[0][0].handleClose;
        handleClose();
        const closeModal = Modal.mock.calls[1][0].onClose;
        closeModal();
      });
    });
  });
});