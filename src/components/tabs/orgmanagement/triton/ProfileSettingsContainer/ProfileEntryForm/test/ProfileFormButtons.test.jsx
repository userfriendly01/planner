import { ProfileFormButtons } from "../ProfileFormButtons";
import React from "react";
import {
  profileEntryFormDispatch,
  profileEntryFormState,
  useAdminDispatch,
  useAdminState
} from "context/appContext";
import { profileEntryFormActions } from "context/profileEntryFormReducer";
import { StyledButton } from "components/StyledButton";
import { formModes } from "globals";
import { ModalOverlayStatuses } from "globals/interfaces";
import {
  isProfileFormValid, constructProfilePayload
} from "utils/profileUtils";
import {
  render,
  setupMockedComponents,
  initialProfileEntryFormState,
  waitFor,
  validProfileEntryFormState,
  initialTestState
} from "testUtils";
import {
  createAccessGroup,
  createProfile,
  editProfile,
  loadSoftphoneConfigRelationships
} from "services/profile";
import { getPaginatedResults } from "utils/graphUtils";

jest.useFakeTimers();

jest.mock("components/StyledButton", () => ({
  StyledButton: jest.fn()
}));

jest.mock("context/appContext", () => ({
  profileEntryFormState: jest.fn(),
  profileEntryFormDispatch: jest.fn(),
  useAdminState: jest.fn(),
  useAdminDispatch: jest.fn()
}));

jest.mock("utils/profileUtils", () => ({
  isProfileFormValid: jest.fn(),
  constructProfilePayload: jest.fn()
}));

jest.mock("services/profile", () => ({
  createAccessGroup: jest.fn(),
  createProfile: jest.fn(),
  editProfile: jest.fn(),
  loadSoftphoneConfigRelationships: jest.fn()
}));

jest.mock("utils/graphUtils", () => ({
  getPaginatedResults: jest.fn()
}));

const profilePayload = { profile: "yay" };
const mockSetForm = jest.fn();
const mockAdminDispatch = jest.fn();
const mockHandleClose = jest.fn();
const mockUpdateLoading = jest.fn();

describe("<ProfileFormButtons />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAdminState.mockReturnValue(initialTestState);
    useAdminDispatch.mockReturnValue(mockAdminDispatch);
    profileEntryFormState.mockReturnValue(validProfileEntryFormState);
    profileEntryFormDispatch.mockReturnValue(mockSetForm);
    isProfileFormValid.mockReturnValue(true);
    createProfile.mockResolvedValue({ response: "success" });
    editProfile.mockResolvedValue({ response: "success" });
    constructProfilePayload.mockReturnValue(profilePayload);
    getPaginatedResults.mockResolvedValue(initialTestState.profileContext.profiles);
    loadSoftphoneConfigRelationships.mockResolvedValue();
    setupMockedComponents({
      StyledButton
    });
  });

  const renderComponent = () => {
    return render(
      <ProfileFormButtons
        handleClose={mockHandleClose}
        loading={""}
        updateLoading={mockUpdateLoading}
      />
    );
  };

  describe("Create Profile Button", () => {
    describe(`form.formMode === ${formModes.INSERT}`, () => {
      describe("Initial State", () => {
        beforeEach(() => {
          profileEntryFormState.mockReturnValue(initialProfileEntryFormState);
        });
        test("ProfileFormButtons should be called 'Create Profile'", () => {
          renderComponent();
          expect(StyledButton.mock.calls[1][0].children).toBe("Create Profile");
        });
        test("When form is valid, Create Profile Button is enabled", () => {
          renderComponent();
          expect(StyledButton.mock.calls[1][0].disabled).toBe(false);
        });
        test("When form is invalid, Create Profile Button is disabled", () => {
          isProfileFormValid.mockReturnValue(false);
          renderComponent();
          expect(StyledButton.mock.calls[1][0].disabled).toBe(true);
        });
      });
      describe("create profile is clicked", () => {
        test("service call to create profile is successful", async () => {
          renderComponent();
          expect(StyledButton).toHaveBeenCalledTimes(2);
          expect(StyledButton.mock.calls[1][0].disabled).toBe(false);
          const onClick = StyledButton.mock.calls[1][0].onClick;
          onClick();
          await waitFor(() => {
            expect(mockUpdateLoading).toHaveBeenCalledWith({
              "saveStatus": ModalOverlayStatuses.SAVING,
              "overlayMessage": "Creating new profile..",
              "saveProfile": true
            });
            expect(createProfile).toHaveBeenCalledTimes(1);
            jest.runAllTimers();

            expect(mockUpdateLoading).toHaveBeenCalledWith({
              "saveStatus": ModalOverlayStatuses.SUCCESS,
              "overlayMessage": "Successfully created profile GRS Claims. Please notify the data office of this change.",
              "saveProfile": true
            });
            expect(mockUpdateLoading).toHaveBeenCalledWith({
              "saveProfile": false
            });
            expect(mockUpdateLoading).toHaveBeenCalledTimes(3);
            expect(mockHandleClose).toHaveBeenCalledTimes(1);
            expect(getPaginatedResults).toHaveBeenCalledTimes(1);
            expect(loadSoftphoneConfigRelationships).toHaveBeenCalledTimes(1);
            expect(loadSoftphoneConfigRelationships).toHaveBeenCalledWith(initialTestState.profileContext, mockAdminDispatch);
            expect(mockSetForm).toHaveBeenCalledTimes(1);
            expect(mockSetForm).toHaveBeenCalledWith({ type: profileEntryFormActions.RESET_FORM });
          });
        });
        test("service call to create profile is unsuccessful", async () => {
          const errorRes = {
            response: "error"
          };
          createProfile.mockRejectedValue(errorRes);
          renderComponent();
          const onClick = StyledButton.mock.calls[1][0].onClick;
          onClick();
          await waitFor(() => {
            expect(createProfile).toHaveBeenCalledTimes(1);
            jest.runAllTimers();
            expect(mockUpdateLoading).toHaveBeenCalledTimes(3);
            expect(mockUpdateLoading).toHaveBeenCalledWith({
              "saveStatus": ModalOverlayStatuses.SAVING,
              "overlayMessage": "Creating new profile..",
              "saveProfile": true
            });
            expect(mockUpdateLoading).toHaveBeenCalledWith({
              "saveStatus": ModalOverlayStatuses.FAIL,
              "overlayMessage": "Error creating profile GRS Claims: error",
              "saveProfile": true
            });
            expect(mockUpdateLoading).toHaveBeenCalledWith({
              "saveProfile": false
            });
            expect(mockHandleClose).toHaveBeenCalledTimes(0);
            expect(mockSetForm).toHaveBeenCalledTimes(0);
            expect(mockSetForm).not.toHaveBeenCalledWith({ type: profileEntryFormActions.RESET_FORM });
          });
        });
        describe("new access group is selected", () => {
          beforeEach(() => {
            profileEntryFormState.mockReturnValue({
              ...validProfileEntryFormState,
              accessGroup: {
                ...validProfileEntryFormState.accessGroup,
                isNew: true
              }
            });
          });
          describe("create access group is successful", () => {
            test("should continue to create profile", async () => {
              createAccessGroup.mockResolvedValue("Yay!");
              renderComponent();
              expect(StyledButton).toHaveBeenCalledTimes(2);
              expect(StyledButton.mock.calls[1][0].disabled).toBe(false);
              const onClick = StyledButton.mock.calls[1][0].onClick;
              onClick();
              await waitFor(() => {
                expect(mockUpdateLoading).toHaveBeenCalledWith({
                  "saveStatus": ModalOverlayStatuses.SAVING,
                  "overlayMessage": "Creating new profile..",
                  "saveProfile": true
                });
                expect(createAccessGroup).toHaveBeenCalledTimes(1);
                expect(createProfile).toHaveBeenCalledTimes(1);
                jest.runAllTimers();

                expect(mockUpdateLoading).toHaveBeenCalledWith({
                  "saveStatus": ModalOverlayStatuses.SUCCESS,
                  "overlayMessage": "Successfully created profile GRS Claims. Please notify the data office of this change.",
                  "saveProfile": true
                });
                expect(mockUpdateLoading).toHaveBeenCalledWith({
                  "saveProfile": false
                });
                expect(mockUpdateLoading).toHaveBeenCalledTimes(3);
                expect(mockHandleClose).toHaveBeenCalledTimes(1);
                expect(mockSetForm).toHaveBeenCalledTimes(1);
                expect(mockSetForm).toHaveBeenCalledWith({ type: profileEntryFormActions.RESET_FORM });
              });
            });
          });
          describe("create access group fails", () => {
            test("should cancel process of creating profile", async () => {
              const errorRes = {
                response: "error"
              };
              createAccessGroup.mockRejectedValue(errorRes);
              renderComponent();
              const onClick = StyledButton.mock.calls[1][0].onClick;
              onClick();
              await waitFor(() => {
                expect(createAccessGroup).toHaveBeenCalledTimes(1);
                expect(createProfile).toHaveBeenCalledTimes(0);
                jest.runAllTimers();
                expect(mockUpdateLoading).toHaveBeenCalledTimes(3);
                expect(mockUpdateLoading).toHaveBeenCalledWith({
                  "saveStatus": ModalOverlayStatuses.SAVING,
                  "overlayMessage": "Creating new profile..",
                  "saveProfile": true
                });
                expect(mockUpdateLoading).toHaveBeenCalledWith({
                  "saveStatus": ModalOverlayStatuses.FAIL,
                  "overlayMessage": "Error creating profile GRS Claims: error",
                  "saveProfile": true
                });
                expect(mockUpdateLoading).toHaveBeenCalledWith({
                  "saveProfile": false
                });
                expect(mockHandleClose).toHaveBeenCalledTimes(0);
                expect(mockSetForm).toHaveBeenCalledTimes(0);
                expect(mockSetForm).not.toHaveBeenCalledWith({ type: profileEntryFormActions.RESET_FORM });
              });
            });
          });
        });
      });
      describe("close is clicked", () => {
        test("Modal is closed, and form resets", async () => {
          renderComponent();
          const onClick = StyledButton.mock.calls[0][0].onClick;
          onClick();
          expect(mockHandleClose).toHaveBeenCalledTimes(1);
          expect(mockSetForm).toHaveBeenCalledTimes(1);
          expect(mockSetForm).toHaveBeenCalledWith({ type: profileEntryFormActions.RESET_FORM });
        });
      });
    });
  });

  describe("Update Profile Button", () => {
    beforeEach(() => {
      profileEntryFormState.mockReturnValue({
        ...validProfileEntryFormState,
        formMode: formModes.UPDATE
      });
    });
    describe(`form.formMode === ${formModes.UPDATE}`, () => {
      describe("Initial State", () => {
        test("ProfileFormButtons should be called 'Update Profile'", () => {
          renderComponent();
          expect(StyledButton.mock.calls[1][0].children).toBe("Update Profile");
        });
        test("When form is valid, Update Profile Button is enabled", () => {
          renderComponent();
          expect(StyledButton.mock.calls[1][0].disabled).toBe(false);
        });
        test("When form is invalid, Update Profile Button is disabled", () => {
          isProfileFormValid.mockReturnValue(false);
          renderComponent();
          expect(StyledButton.mock.calls[1][0].disabled).toBe(true);
        });
      });
      describe("edit profile is clicked", () => {
        test("service call to edit profile is successful", async () => {
          renderComponent();
          expect(StyledButton).toHaveBeenCalledTimes(2);
          expect(StyledButton.mock.calls[1][0].disabled).toBe(false);
          const onClick = StyledButton.mock.calls[1][0].onClick;
          onClick();
          await waitFor(() => {
            expect(mockUpdateLoading).toHaveBeenCalledWith({
              "saveStatus": ModalOverlayStatuses.SAVING,
              "overlayMessage": "Updating profile..",
              "saveProfile": true
            });
            expect(editProfile).toHaveBeenCalledTimes(1);
            jest.runAllTimers();

            expect(mockUpdateLoading).toHaveBeenCalledWith({
              "saveStatus": ModalOverlayStatuses.SUCCESS,
              "overlayMessage": "Successfully updated profile GRS Claims. ",
              "saveProfile": true
            });
            expect(mockUpdateLoading).toHaveBeenCalledWith({
              "saveProfile": false
            });
            expect(mockUpdateLoading).toHaveBeenCalledTimes(3);
            expect(mockHandleClose).toHaveBeenCalledTimes(1);
            expect(mockSetForm).toHaveBeenCalledTimes(1);
            expect(mockSetForm).toHaveBeenCalledWith({ type: profileEntryFormActions.RESET_FORM });
          });
        });
        test("service call to edit profile is unsuccessful", async () => {
          const errorRes = {
            response: "error"
          };
          editProfile.mockRejectedValue(errorRes);
          renderComponent();
          const onClick = StyledButton.mock.calls[1][0].onClick;
          onClick();
          await waitFor(() => {
            expect(editProfile).toHaveBeenCalledTimes(1);
            jest.runAllTimers();
            expect(mockUpdateLoading).toHaveBeenCalledTimes(3);
            expect(mockUpdateLoading).toHaveBeenCalledWith({
              "saveStatus": ModalOverlayStatuses.SAVING,
              "overlayMessage": "Updating profile..",
              "saveProfile": true
            });
            expect(mockUpdateLoading).toHaveBeenCalledWith({
              "saveStatus": ModalOverlayStatuses.FAIL,
              "overlayMessage": "Error updating profile GRS Claims: error",
              "saveProfile": true
            });
            expect(mockUpdateLoading).toHaveBeenCalledWith({
              "saveProfile": false
            });
            expect(mockHandleClose).toHaveBeenCalledTimes(0);
            expect(mockSetForm).toHaveBeenCalledTimes(0);
            expect(mockSetForm).not.toHaveBeenCalledWith({ type: profileEntryFormActions.RESET_FORM });
          });
        });
      });
      describe("close is clicked", () => {
        test("Modal is closed, and form resets", async () => {
          renderComponent();
          const onClick = StyledButton.mock.calls[0][0].onClick;
          onClick();
          expect(mockHandleClose).toHaveBeenCalledTimes(1);
          expect(mockSetForm).toHaveBeenCalledTimes(1);
          expect(mockSetForm).toHaveBeenCalledWith({ type: profileEntryFormActions.RESET_FORM });
        });
      });
    });
  });
});
