import { ProfileEntryForm } from "../ProfileEntryForm";
import React from "react";
import {
  render,
  expectMockedComponent,
  setupMockedComponents,
  expectOnlyPassedProps,
  initialFormState,
  initialTestState,
  act
} from "testUtils";
import { ModalOverlay } from "components/ModalOverlay";
import { ProfileFormButtons } from "orgmanagement/ProfileFormButtons";
import { ProfileFormFields } from "orgmanagement/ProfileFormFields";
import { profileEntryFormState } from "context/appContext";

jest.mock("components/ModalOverlay", () => ({
  ModalOverlay: jest.fn()
}));

jest.mock("components/StyledButton", () => ({
  StyledButton: jest.fn()
}));

jest.mock("orgmanagement/ProfileFormButtons", () => ({
  ProfileFormButtons: jest.fn()
}));

jest.mock("orgmanagement/ProfileFormFields", () => ({
  ProfileFormFields: jest.fn()
}));

jest.mock("context/appContext", () => ({
  useAdminState: jest.fn(),
  profileEntryFormState: jest.fn(),
  profileEntryFormDispatch: jest.fn()
}));

jest.useFakeTimers();
const mockHandleClose = jest.fn();

describe("<ProfileEntryForm />", () => {

  beforeEach(() => {
    jest.clearAllMocks();
    profileEntryFormState.mockReturnValue(initialFormState);
    setupMockedComponents({
      ModalOverlay,
      ProfileFormButtons,
      ProfileFormFields
    });
  });

  const renderComponent = () => {
    return render(
      <ProfileEntryForm
        handleClose={mockHandleClose}
      />, initialTestState
    );
  };

  describe("Initial State", () => {
    test("Should render the correct initial state", () => {
      renderComponent();
      expect(ModalOverlay.mock.calls.length).toBe(0);
      expect(ProfileFormButtons.mock.calls.length).toBe(1);
    });
  });

  describe("Modal Overlay", () => {
    test("Modal Overlay should render when loading.saveProfile", () => {
      renderComponent();
      act(() => {
        const updateLoading = ProfileFormButtons.mock.calls[0][0].updateLoading;
        updateLoading({
          overlayMessage: "Saving profile...",
          saveStatus: "loading",
          saveProfile: true
        });
      });
      const expectedModalOverlayProps = {
        status: "loading",
        message: "Saving profile..."
      };
      expectOnlyPassedProps(ModalOverlay, expectedModalOverlayProps, 0);
    });
    test("loading should be updated when ModalOverlay handleClose is called", () => {
      const rendered = renderComponent();
      act(() => {
        const updateLoading = ProfileFormButtons.mock.calls[0][0].updateLoading;
        updateLoading({
          overlayMessage: "Saving profile...",
          saveStatus: "loading",
          saveProfile: true
        });
      });
      expect(rendered.container).toHaveTextContent("ModalOverlay");
      act(() => {
        const handleClose = ModalOverlay.mock.calls[0][0].handleClose;
        handleClose();
      });
      expectMockedComponent(rendered, ModalOverlay, 0);
      expect(rendered.container).not.toHaveTextContent("ModalOverlay");
    });
  });
});
