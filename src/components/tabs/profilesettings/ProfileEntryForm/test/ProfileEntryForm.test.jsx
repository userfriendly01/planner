import ProfileEntryForm from "../ProfileEntryForm";
import React from "react";
import {
  mockStore,
  render,
  expectMockedComponent,
  setupMockedComponents,
  expectOnlyPassedProps,
  initialFormState,
  mockProfile,
  initialTestState,
  act
} from "testUtils";
import {
  ModalOverlay,
  ProfileFormButtons,
  ProfileFormFields
} from "components";
import {
  profileEntryFormDispatch,
  profileEntryFormState,
  useAdminState
} from "context";

jest.mock("components", () => ({
  __esModule: true,
  ModalOverlay: jest.fn(),
  StyledButton: jest.fn(),
  FormButton: jest.fn(),
  ProfileFormButtons: jest.fn(),
  ProfileFormFields: jest.fn(),
  ProfileNameTextField: jest.fn()
}));

jest.mock("context", () => ({
  __esModule: true,
  useAdminState: jest.fn(),
  profileEntryFormState: jest.fn(),
  profileEntryFormDispatch: jest.fn()
}));

jest.useFakeTimers();
const mockSetForm = jest.fn();
const mockHandleClose = jest.fn();

describe("<ProfileEntryForm />", () => {

  beforeEach(() => {
    jest.clearAllMocks();
    mockStore.reset();
    profileEntryFormDispatch.mockReturnValue(mockSetForm);
    profileEntryFormState.mockReturnValue(initialFormState);
    useAdminState.mockReturnValue(initialTestState);
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
        profile={mockProfile}
      />, initialTestState
    );
  };

  describe("Initial State", () => {
    test("Should render the correct initial state", () => {
      renderComponent();
      expect(ModalOverlay.mock.calls.length).toBe(0);
      expect(ProfileFormButtons.mock.calls.length).toBe(1);
    });
    test("handle no profiles, and intialize with profile id 1", () => {
      useAdminState.mockReturnValue({
        ...initialTestState,
        profileContext: {
          profiles: []
        }
      });
      renderComponent();
      expect(ModalOverlay.mock.calls.length).toBe(0);
      expect(ProfileFormButtons.mock.calls.length).toBe(1);
      expect(mockSetForm).toHaveBeenCalledWith({
        "payload": 1,
        "type": "SET_PROFILE_ID"
      });
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
