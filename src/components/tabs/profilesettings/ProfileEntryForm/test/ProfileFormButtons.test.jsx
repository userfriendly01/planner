import ProfileFormButtons from "../ProfileFormButtons";
import React from "react";
import {
  profileEntryFormDispatch,
  profileEntryFormState,
  profileEntryFormActions
} from "context";
import {
  Modal
} from "@mui/material";
import {
  StyledButton
} from "components";
import {
  formModes
} from "globals";
import {
  isProfileFormValid
} from "utils";
import {
  act,
  initialTestState,
  render,
  setupMockedComponents,
  initialProfileEntryFormState,
  waitFor,
  validProfileEntryFormState
} from "testUtils";

jest.useFakeTimers();

jest.mock("components", () => ({
  StyledButton: jest.fn()
}));

jest.mock("context", () => ({
  __esModule: true,
  profileEntryFormState: jest.fn(),
  profileEntryFormDispatch: jest.fn(),
  profileEntryFormActions: { RESET_FORM: "RESET_FORM" }
}));

jest.mock("@mui/material", () => ({
  Tooltip: jest.fn(),
  Modal: jest.fn()
}));

jest.mock("utils", () => ({
  isProfileFormValid: jest.fn(),
  wait: jest.requireActual("utils").wait
}));

console.log = jest.fn();

const mockSetForm = jest.fn();
const mockHandleClose = jest.fn();
const mockUpdateLoading = jest.fn();

describe("<ProfileFormButtons />", () => {

  beforeEach(() => {
    setupMockedComponents({
      StyledButton,
      Modal
    });
    profileEntryFormDispatch.mockReturnValue(mockSetForm);
    profileEntryFormState.mockReturnValue(initialProfileEntryFormState);
    isProfileFormValid.mockReturnValue(true);
  });

  const renderComponent = () => {
    return render(
      <ProfileFormButtons
        handleClose={mockHandleClose}
        loading={""}
        updateLoading={mockUpdateLoading}
        profile={""}
      />,
      initialTestState
    );
  };

  describe("Add/Save Profile Button", () => {
    describe(`form.formMode === ${formModes.INSERT}`, () => {
      describe("Initial State", () => {
        test("ProfileFormButtons should be called 'Add Profile'", () => {
          renderComponent();
          expect(StyledButton.mock.calls[1][0].children).toBe("Add Profile");
        });
        test("When form is valid, Add Profile Button is enabled", () => {
          isProfileFormValid.mockReturnValue(true);
          renderComponent();
          expect(StyledButton.mock.calls[1][0].disabled).toBe(false);
        });
        test("When form is invalid, Add Profile Button is disabled", () => {
          isProfileFormValid.mockReturnValue(false);
          renderComponent();
          expect(StyledButton.mock.calls[1][0].disabled).toBe(true);
        });
      });
      describe("create profile is clicked", () => {
        test("service call to create profile is successful", async () => {
          profileEntryFormState.mockReturnValue(validProfileEntryFormState);
          renderComponent();
          act(() => {
            const onClick = StyledButton.mock.calls[1][0].onClick;
            onClick();
          });
          await waitFor(() => {
            expect(console.log).toHaveBeenCalledTimes(1);
            jest.runAllTimers();
            expect(mockUpdateLoading).toHaveBeenCalledTimes(3);
            expect(mockHandleClose).toHaveBeenCalledTimes(1);
          });
        });
      });
      describe("close is clicked", () => {
        beforeEach(() => {
          jest.clearAllMocks();
        });
        test("Modal is closed, and form resets", async () => {
          renderComponent();
          act(() => {
            const onClick = StyledButton.mock.calls[0][0].onClick;
            onClick();
          });
          expect(mockHandleClose).toHaveBeenCalledTimes(1);
          expect(mockSetForm).toHaveBeenCalledTimes(1);
          expect(mockSetForm).toHaveBeenCalledWith({ type: profileEntryFormActions.RESET_FORM });
        });
      });
    });

  });

});
