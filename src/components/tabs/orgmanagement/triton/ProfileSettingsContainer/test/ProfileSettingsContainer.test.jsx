import { ProfileSettingsContainer } from "../ProfileSettingsContainer";
import { checkIfPO } from "authentication/authUtils";
import MockAdapter from "axios-mock-adapter";
import { StyledButton } from "components/StyledButton";
import { ProfileSettingsTable } from "components/tabs/orgmanagement/triton/ProfileSettingsTable/ProfileSettingsTable";
import { ProfileEntryForm } from "orgmanagement/ProfileEntryForm";
import { Modal } from "@mui/material";
import { useAdminState } from "context/appContext";
import React from "react";
import { act } from "react-dom/test-utils";
import {
  expectMockedComponent,
  render,
  setupMockedComponents,
  initialTestState as initialState
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

jest.mock("context/appContext", () => ({
  useAdminState: jest.fn(),
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

const profileList = [
  {
    profile_name: "test1",
    profile_id: 1
  },
  {
    profile_name: "test2",
    profile_id: 2
  },
  {
    profile_name: "test3",
    profile_id: 3
  }
];

const initialTestState = {
  ...initialState,
  profileContext: {
    profiles: profileList
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
    test("form should not render on initial state", () => {
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