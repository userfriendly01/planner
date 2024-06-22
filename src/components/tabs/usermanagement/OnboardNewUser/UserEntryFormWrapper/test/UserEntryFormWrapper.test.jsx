import { UserEntryForm } from "../UserEntryFormWrapper";
import { DeleteTritonUser } from "usermanagement/DeleteUserProfiles";
import { ModalOverlay } from "components/ModalOverlay";
import { StyledButton } from "components/StyledButton";
import { CallRecordingForm } from "usermanagement/CallRecordingForm";
import { UserFormButtons } from "usermanagement/UserFormButtons";
import { WfmForm } from "usermanagement/WfmForm";
import {
  useAdminState,
  useFormState,
  useFormDispatch
} from "context/appContext";
import { userFormActions } from "context/userFormReducer";
import { formModes } from "globals";
import { Checkbox } from "@mui/material";
import { useNavigate } from "react-router-dom";
import React from "react";
import {
  act,
  expectMockedComponent,
  expectOnlyPassedProps,
  render,
  setupMockedComponents,
  initialFormState,
  initialTestState
} from "testUtils";

jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn()
}));

jest.mock("@mui/material", () => ({
  Checkbox: jest.fn(),
  Divider: jest.fn(),
  Tabs: jest.fn()
}));

jest.mock("usermanagement/DeleteUserProfiles", () => ({
  DeleteTritonUser: jest.fn()
}));

jest.mock("usermanagement/CallRecordingForm", () => ({
  CallRecordingForm: jest.fn()
}));

jest.mock("components/ModalOverlay", () => ({
  ModalOverlay: jest.fn()
}));

jest.mock("usermanagement/BasicFormInfo", () => ({
  BasicFormInfo: jest.fn()
}));

jest.mock("components/StyledButton", () => ({
  StyledButton: jest.fn()
}));

jest.mock("usermanagement/UserFormButtons", () => ({
  UserFormButtons: jest.fn()
}));

jest.mock("usermanagement/WfmForm", () => ({
  WfmForm: jest.fn()
}));

jest.mock("context/appContext", () => ({
  useAdminState: jest.fn(),
  useFormState: jest.fn(),
  useFormDispatch: jest.fn()
}));

jest.useFakeTimers();
const mockNavigate = jest.fn();
const mockSetForm = jest.fn();
const mockHandleClose = jest.fn();

describe("<UserEntryFormWrapper />", () => {

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    useFormDispatch.mockReturnValue(mockSetForm);
    useFormState.mockReturnValue({ ...initialFormState });
    useAdminState.mockReturnValue(initialTestState);
    useNavigate.mockReturnValue(mockNavigate);
    setupMockedComponents({
      CallRecordingForm,
      DeleteTritonUser,
      Checkbox,
      ModalOverlay,
      UserFormButtons,
      StyledButton,
      WfmForm
    });
  });

  const renderComponent = () => {
    return render(
      <UserEntryForm
        handleClose={mockHandleClose}
      />, initialTestState
    );
  };
  describe("Initial State", () => {
    test("Should render the correct initial state", () => {
      const { unmount } = renderComponent();
      expect(ModalOverlay.mock.calls.length).toBe(0);
      act(() => unmount());
    });
    describe("Modal Overlay", () => {
      test("Modal Overlay should render when loading.saveUser", () => {
        const { unmount } = renderComponent();
        act(() => {
          const updateLoading = UserFormButtons.mock.calls[0][0].updateLoading;
          updateLoading({
            lookupUser: false,
            overlayMessage: "Saving User...",
            saveStatus: "loading",
            saveUser: true
          });
        });
        const expectedModalOverlayProps = {
          status: "loading",
          message: "Saving User..."
        };
        expectOnlyPassedProps(ModalOverlay, expectedModalOverlayProps, 0);
        act(() => unmount());
      });
      test("loading should be updated when ModalOverlay handleClose is called", () => {
        const rendered = renderComponent();
        act(() => {
          const updateLoading = UserFormButtons.mock.calls[0][0].updateLoading;
          updateLoading({
            lookupUser: false,
            overlayMessage: "Saving User...",
            saveStatus: "loading",
            saveUser: true
          });
        });
        expect(rendered.container).toHaveTextContent("ModalOverlay");
        act(() => {
          const handleClose = ModalOverlay.mock.calls[0][0].handleClose;
          handleClose();
        });
        expectMockedComponent(rendered, ModalOverlay, 0);
        expect(rendered.container).not.toHaveTextContent("ModalOverlay");
        act(() => rendered.unmount());
      });
    });
    describe("Header", () => {
      test(`Header should read 'Add a User' when form.formMode === ${formModes.INSERT}`, () => {
        const {
          container, unmount
        } = renderComponent();
        expect(container).toHaveTextContent("Onboard New User");
        act(() => unmount());
      });
      test(`Header should read 'Edit User' & user's name when form.formMode === ${formModes.UPDATE}`, () => {
        useFormState.mockReturnValue({
          ...initialFormState,
          formMode: formModes.UPDATE,
          nNumber: {
            value: "n222354"
          }
        });
        const {
          container, unmount
        } = render(
          <UserEntryForm
            handleClose={mockHandleClose}
          />
        );
        expect(container).toHaveTextContent("Edit User");
        expect(container).toHaveTextContent("Susan Delfino");
        act(() => unmount());
      });
    });
    describe("Discrepancies are present", () => {
      beforeEach(() => {
        useFormState.mockReturnValue({
          ...initialFormState,
          discrepancies: [
            {
              type: "Calabrio",
              message: "Missing Profile"
            }
          ]
        });
      });
      test("Should render discrepancy messages", () => {
        const {
          container, unmount
        } = renderComponent();
        expect(ModalOverlay.mock.calls.length).toBe(0);
        expect(container).toHaveTextContent("Discrepencies have been found for this worker. They will be corrected when you hit `Save User` unless otherwise specified ");
        expect(container).toHaveTextContent("Missing Profile");
        act(() => unmount());
      });
      describe("triton user already in state", () => {
        test("should add discrepancy", () => {
          const message = "This user already seems to have a Triton Record. Please cancel out of this form and edit their worker instead.";
          useFormState.mockReturnValue({
            ...initialFormState,
            nNumber: {
              ...initialFormState.nNumber,
              value: "n0263786"
            },
            discrepancies: []
          });
          const { unmount } = renderComponent();
          expect(mockSetForm).toHaveBeenCalledTimes(3);
          expect(mockSetForm).toHaveBeenCalledWith({
            type: userFormActions.SET_DISCREPANCIES,
            payload: {
              type: "General",
              message: message
            }
          });
          expect(mockSetForm).toHaveBeenCalledWith({
            type: userFormActions.UPDATE_USER_FOUND,
            payload: {
              system: "triton",
              isFound: true
            }
          });
          expect(mockSetForm).toHaveBeenCalledWith({
            type: userFormActions.UPDATE_USER_FOUND,
            payload: {
              system: "calabrio_qm",
              isFound: true
            }
          });
          act(() => unmount());
        });
      });
      describe("duplicate triton user discrepency is listed but nNumber was cleared", () => {
        test("should clear discrepancy", () => {
          const message = "This user already seems to have a Triton Record. Please cancel out of this form and edit their worker instead.";
          useFormState.mockReturnValue({
            ...initialFormState,
            discrepancies: [
              {
                type: "Calabrio",
                message
              }
            ]
          });
          const { unmount } = renderComponent();
          expect(mockSetForm).toHaveBeenCalledTimes(3);
          expect(mockSetForm).toHaveBeenCalledWith({
            type: userFormActions.CLEAR_DISCREPANCY,
            payload: message
          });
          expect(mockSetForm).toHaveBeenCalledWith({
            type: userFormActions.UPDATE_USER_FOUND,
            payload: {
              system: "triton",
              isFound: true
            }
          });
          expect(mockSetForm).toHaveBeenCalledWith({
            type: userFormActions.UPDATE_USER_FOUND,
            payload: {
              system: "calabrio_qm",
              isFound: true
            }
          });
          act(() => unmount());
        });
      });
    });
    describe("check userFound boxes", () => {
      describe("triton checkbox", () => {
        test("updates triton.userFound", () => {
          const { unmount } = renderComponent();
          const checkTritonBox = Checkbox.mock.calls[0][0].onChange;
          act(() => checkTritonBox({
            target: {
              checked: false
            }
          }));
          expect(mockSetForm).toHaveBeenCalledTimes(3);
          expect(mockSetForm).toHaveBeenCalledWith({
            type: userFormActions.UPDATE_USER_FOUND,
            payload: {
              system: "triton",
              isFound: true
            }
          });
          expect(mockSetForm).toHaveBeenCalledWith({
            type: userFormActions.UPDATE_USER_FOUND,
            payload: {
              system: "calabrio_qm",
              isFound: true
            }
          });
          expect(mockSetForm).toHaveBeenCalledWith({
            type: userFormActions.UPDATE_USER_FOUND,
            payload: {
              system: "triton",
              isFound: false
            }
          });
          act(() => unmount());
        });
      });
      describe("calabrio QM", () => {
        beforeEach(() => {
          useFormState.mockReturnValue({
            ...initialFormState,
            calabrio_qm: {
              userFound: true
            },
            calabrio_wfm: {
              userFound: true
            }
          });
        });
        test("updates calabrio_qm.userFound", () => {
          const { unmount } = renderComponent();
          expect(WfmForm).toHaveBeenCalledTimes(1);
          expect(CallRecordingForm).toHaveBeenCalledTimes(1);
          const checkQMBox = Checkbox.mock.calls[1][0].onChange;
          act(() => checkQMBox({
            target: {
              checked: false
            }
          }));
          expect(mockSetForm).toHaveBeenCalledTimes(3);
          expect(mockSetForm).toHaveBeenCalledWith({
            type: userFormActions.UPDATE_USER_FOUND,
            payload: {
              system: "triton",
              isFound: true
            }
          });
          expect(mockSetForm).toHaveBeenCalledWith({
            type: userFormActions.UPDATE_USER_FOUND,
            payload: {
              system: "calabrio_qm",
              isFound: true
            }
          });
          expect(mockSetForm).toHaveBeenCalledWith({
            type: userFormActions.UPDATE_USER_FOUND,
            payload: {
              system: "calabrio_qm",
              isFound: false
            }
          });
          act(() => unmount());
        });
      });
      describe("calabrio WFM", () => {
        test("updates calabrio_wfm.userFound", () => {
          const { unmount } = renderComponent();
          const checkWfmBox = Checkbox.mock.calls[2][0].onChange;
          act(() => checkWfmBox({
            target: {
              checked: true
            }
          }));
          expect(mockSetForm).toHaveBeenCalledTimes(3);
          expect(mockSetForm).toHaveBeenCalledWith({
            type: userFormActions.UPDATE_USER_FOUND,
            payload: {
              system: "triton",
              isFound: true
            }
          });
          expect(mockSetForm).toHaveBeenCalledWith({
            type: userFormActions.UPDATE_USER_FOUND,
            payload: {
              system: "calabrio_qm",
              isFound: true
            }
          });
          expect(mockSetForm).toHaveBeenCalledWith({
            type: userFormActions.UPDATE_USER_FOUND,
            payload: {
              system: "calabrio_wfm",
              isFound: true
            }
          });
          act(() => unmount());
        });
      });
    });
    describe("handleClose", () => {
      test("when handle close is called from child components, setForm is called", () => {
        const { unmount } = renderComponent();
        const handleClose = UserFormButtons.mock.calls[0][0].handleClose;
        act(() => {
          handleClose();
        });
        expect(mockNavigate).toHaveBeenCalledTimes(1);
        expect(mockNavigate).toHaveBeenCalledWith(-1);
        act(() => unmount());
      });
    });
    describe("formMode === DELETE", () => {
      beforeEach(() => {
        useFormState.mockReturnValue({
          ...initialFormState,
          formMode: formModes.DELETE
        });
      });
      test("Should render the correct initial state", () => {
        const {
          unmount, container
        } = renderComponent();
        expect(container).toHaveTextContent("Deactivate User");
        expect(DeleteTritonUser.mock.calls.length).toBe(1);
        act(() => unmount());
      });
    });
  });
});