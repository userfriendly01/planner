import UserEntryForm from "../UserEntryForm";
import {
  MergeUsersModal,
  ModalOverlay,
  StyledButton,
  UserFormAccordion,
  UserFormButtons
} from "components";
import {
  useAdminState,
  useFormState,
  useFormDispatch,
  userFormActions
} from "context";
import { formModes } from "globals";
import React from "react";
import {
  act,
  expectMockedComponent,
  expectOnlyPassedProps,
  mockStore,
  render,
  setupMockedComponents,
  mockWorkers,
  mockSkills,
  initialFormState,
  initialTestState
} from "testUtils";

jest.mock("components", () => ({
  __esModule: true,
  MergeUsersModal: jest.fn(),
  ModalOverlay: jest.fn(),
  UserFormAccordion: jest.fn(),
  StyledButton: jest.fn(),
  UserFormButtons: jest.fn()
}));

jest.mock("context", () => ({
  __esModule: true,
  useAdminState: jest.fn(),
  useFormState: jest.fn(),
  useFormDispatch: jest.fn(),
  userFormActions: jest.requireActual("context").userFormActions,
  initialState: jest.requireActual("context").initialState
}));

jest.useFakeTimers();
const mockSetForm = jest.fn();
const mockHandleClose = jest.fn();

describe("<UserEntryForm />", () => {

  beforeEach(() => {
    jest.clearAllMocks();
    mockStore.reset();
    useFormDispatch.mockReturnValue(mockSetForm);
    useFormState.mockReturnValue(initialFormState);
    useAdminState.mockReturnValue(initialTestState);
    setupMockedComponents({
      MergeUsersModal,
      ModalOverlay,
      UserFormAccordion,
      UserFormButtons,
      StyledButton
    });
  });

  const renderComponent = () => {
    return render(
      <UserEntryForm
        workers={mockWorkers}
        worker= {mockWorkers[0]}
        skills= {mockSkills}
        handleClose={mockHandleClose}
      />, initialTestState
    );
  };
  describe("Initial State", () => {
    test("Should render the correct initial state", () => {
      renderComponent();
      expect(ModalOverlay.mock.calls.length).toBe(0);
      expect(UserFormAccordion.mock.calls.length).toBe(1);
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
        expect(rendered.container).toHaveTextContent("Add a User");
      });
      test(`Header should read 'Edit User' & user's name when form.formMode === ${formModes.UPDATE}`, () => {
        useFormState.mockReturnValue({
          ...initialFormState,
          formMode: formModes.UPDATE
        });
        const rendered = renderComponent();
        expect(rendered.container).toHaveTextContent("Edit User");
        expect(rendered.container).toHaveTextContent("Test 1");
      });
    });
    describe("handleClose", () => {
      test("when handle close is called from child components, setForm is called", () => {
        renderComponent();
        const handleClose = UserFormButtons.mock.calls[0][0].handleClose;
        act(() => {
          handleClose();
        });
        expect(mockHandleClose).toBeCalledTimes(1);
        expect(mockSetForm).toBeCalledTimes(1);
        expect(mockSetForm).toBeCalledWith({
          type: userFormActions.RESET_FORM
        });
      });
    });
  });
});