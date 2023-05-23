import UserEntryForm from "../UserEntryFormWrapper";
import {
  ModalOverlay,
  StyledButton,
  UserFormButtons
} from "components";
import {
  useAdminState,
  useFormState,
  useFormDispatch
} from "context";
import { formModes } from "globals";
import { useNavigate } from "react-router-dom";
import React from "react";
import {
  act,
  expectMockedComponent,
  expectOnlyPassedProps,
  render,
  setupMockedComponents,
  mockWorkers,
  initialFormState,
  initialTestState
} from "testUtils";

jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn()
}));

jest.mock("components", () => ({
  __esModule: true,
  DeleteTritonUser: jest.fn(),
  CallRecordingForm: jest.fn(),
  ModalOverlay: jest.fn(),
  BasicFormInfo: jest.fn(),
  StyledButton: jest.fn(),
  UserFormButtons: jest.fn()
}));

jest.mock("context", () => ({
  __esModule: true,
  useAdminState: jest.fn(),
  useFormState: jest.fn(),
  useFormDispatch: jest.fn(),
  userFormActions: jest.requireActual("context").userFormActions,
  initialState: jest.requireActual("context").initialState,
  profileEntryFormActions: jest.requireActual("context").profileEntryFormActions
}));

jest.useFakeTimers();
const mockNavigate = jest.fn();
const mockSetForm = jest.fn();
const mockHandleClose = jest.fn();

describe("<UserEntryForm />", () => {

  beforeEach(() => {
    jest.clearAllMocks();
    useFormDispatch.mockReturnValue(mockSetForm);
    useFormState.mockReturnValue(initialFormState);
    useAdminState.mockReturnValue(initialTestState);
    useNavigate.mockReturnValue(mockNavigate);
    setupMockedComponents({
      ModalOverlay,
      UserFormButtons,
      StyledButton
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
      renderComponent();
      expect(ModalOverlay.mock.calls.length).toBe(0);
    });
    describe("Modal Overlay", () => {
      test("Modal Overlay should render when loading.saveUser", () => {
        renderComponent();
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
      });
    });
    describe("Header", () => {
      test(`Header should read 'Add a User' when form.formMode === ${formModes.INSERT}`, () => {
        const rendered = renderComponent();
        expect(rendered.container).toHaveTextContent("Onboard New User");
      });
      test(`Header should read 'Edit User' & user's name when form.formMode === ${formModes.UPDATE}`, () => {
        useFormState.mockReturnValue({
          ...initialFormState,
          formMode: formModes.UPDATE,
          nNumber: {
            value: "n222354"
          }
        });
        const rendered = render(
          <UserEntryForm
            handleClose={mockHandleClose}
          />
        );
        expect(rendered.container).toHaveTextContent("Edit User");
        expect(rendered.container).toHaveTextContent("Susan Delfino");
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
        const rendered = renderComponent();
        expect(ModalOverlay.mock.calls.length).toBe(0);
        expect(rendered.container).toHaveTextContent("Discrepencies have been found for this worker. They will be corrected when you hit 'Save User' unless otherwise specified ");
        expect(rendered.container).toHaveTextContent("Missing Profile");
      });
    });
    describe("handleClose", () => {
      test("when handle close is called from child components, setForm is called", () => {
        renderComponent();
        const handleClose = UserFormButtons.mock.calls[0][0].handleClose;
        act(() => {
          handleClose();
        });
        expect(mockNavigate).toHaveBeenCalledTimes(1);
        expect(mockNavigate).toHaveBeenCalledWith(-1);
      });
    });
  });
});