import { useAdminState } from "context/appContext";
import { Directory } from "../Directory";
import { DirectoryEntryForm } from "orgmanagement/DirectoryEntryForm";
import { PhoneNumberTable } from "orgmanagement/PhoneNumberTable";
import { StyledButton } from "components/StyledButton";
import {
  formModes, timeouts
} from "globals/index";
import { ModalOverlayStatuses } from "globals/interfaces";
import React from "react";
import { deleteDirectory } from "services/directory";
import {
  act,
  expectMockedComponent,
  expectOnlyPassedProps,
  getMockedComponentProps,
  initialTestState,
  render,
  setupMockedComponents,
  waitFor
} from "testUtils";

jest.useFakeTimers();

jest.mock("orgmanagement/DirectoryEntryForm", () => ({
  DirectoryEntryForm: jest.fn()
}));

jest.mock("orgmanagement/PhoneNumberTable", () => ({
  PhoneNumberTable: jest.fn()
}));

jest.mock("components/StyledButton", () => ({
  StyledButton: jest.fn()
}));

jest.mock("context/appContext", () => ({
  useAdminState: jest.fn()
}));

jest.mock("services/directory", () => ({
  deleteDirectory: jest.fn()
}));

const profileId = "89";
const refreshProfileData = jest.fn();
const directory = [
  {
    directory_id: 16,
    first_nme: "Bo",
    last_nme: "Jackson",
    phone_num: "800-123-4567"
  },
  {
    directory_id: 18,
    first_nme: "Daryl",
    last_nme: "Strawberry",
    phone_num: "900-555-1212"
  },
  {
    directory_id: 20,
    first_nme: "Michael Jack",
    last_nme: "Schmidt",
    phone_num: "800-123-4569"
  }
];

const renderComponent = () => render(<Directory directory={directory} profileId={profileId} refreshProfileData={refreshProfileData} />);

describe("<Directory />", () => {

  let confirmSpy;
  beforeAll(() => confirmSpy = jest.spyOn(window, "confirm"));
  afterAll(() => confirmSpy.mockRestore());

  beforeEach(() => {
    jest.clearAllMocks();
    setupMockedComponents({
      DirectoryEntryForm,
      PhoneNumberTable,
      StyledButton
    });

    useAdminState.mockReturnValue(initialTestState);
  });

  test("initial render should just be the button and the table", () => {
    const rendered = renderComponent();
    expectMockedComponent(rendered, { StyledButton });
    expectMockedComponent(rendered, { PhoneNumberTable });
  });

  test("when the add button is clicked, we should render the modal with the proper state", () => {
    renderComponent();
    const addButtonOnClick = getMockedComponentProps(StyledButton, 0).onClick;
    act(() => addButtonOnClick());
    expectOnlyPassedProps(DirectoryEntryForm, {
      directoryState: {
        directoryEntryFormInitialValues: {
          first_nme: "",
          last_nme: "",
          phone_num: ""
        },
        directoryEntryFormMode: formModes.INSERT,
        directoryId: null,
        isDirectoryEntryFormOpen: true,
        overlayMessage: "",
        saveState: {
          status: null
        },
        takenPhoneNums: [directory[0].phone_num, directory[1].phone_num, directory[2].phone_num]
      }
    }, 0);
  });

  test("when an edit button is clicked, we should render the modal with the proper state", () => {
    renderComponent();
    const editFunction = getMockedComponentProps(PhoneNumberTable, 0).editFunction;
    act(() => editFunction(directory[1])());
    expectOnlyPassedProps(DirectoryEntryForm, {
      directoryState: {
        directoryEntryFormInitialValues: {
          first_nme: directory[1].first_nme,
          last_nme: directory[1].last_nme,
          phone_num: directory[1].phone_num
        },
        directoryEntryFormMode: formModes.UPDATE,
        directoryId: directory[1].directory_id,
        isDirectoryEntryFormOpen: true,
        overlayMessage: "",
        saveState: {
          status: null
        },
        takenPhoneNums: [directory[0].phone_num, directory[2].phone_num]
      },
      profileId
    }, 0);
  });

  test("when the close modal function is called, the modal should be hidden", () => {
    const rendered = renderComponent();
    const editFunction = getMockedComponentProps(PhoneNumberTable, 0).editFunction;
    act(() => editFunction(directory[1])());
    expectMockedComponent(rendered, { DirectoryEntryForm }, 1);
    const closeModal = getMockedComponentProps(DirectoryEntryForm, 0).closeModal;
    act(() => closeModal());
    expectMockedComponent(rendered, { DirectoryEntryForm }, 0);
  });

  describe("deleting", () => {
    describe("the user confirms the deletion", () => {
      beforeEach(() => confirmSpy.mockImplementation(jest.fn(() => true)));
      test("if the delete is successful, we should show the processing modal, then show the success response, and refresh the profile", async () => {
        deleteDirectory.mockResolvedValue("GOOOOOOD");
        renderComponent();
        const deleteFunction = getMockedComponentProps(PhoneNumberTable, 0).deleteFunction;
        await waitFor(() => deleteFunction(directory[1].directory_id)());
        act(() => {
          // advance timers so overlay times out
          jest.advanceTimersByTime(timeouts.MODAL_OVERLAY);
        });
        expect(refreshProfileData.mock.calls.length).toBe(1);
        expect(PhoneNumberTable.mock.calls[0][0].saveState).toEqual({ status: null });
        expect(PhoneNumberTable.mock.calls[1][0].saveState).toEqual({
          overlayMessage: "Deleting directory entry...",
          status: ModalOverlayStatuses.SAVING
        });
        expect(PhoneNumberTable.mock.calls[2][0].saveState).toEqual({
          overlayMessage: "Successfully deleted directory entry",
          status: ModalOverlayStatuses.SUCCESS
        });
        expect(PhoneNumberTable.mock.calls[3][0].saveState).toEqual({ status: null });
      });
      test("if the delete fails, we should show the processing modal, then show the failure response, and not refresh the profile", async () => {
        deleteDirectory.mockRejectedValue("BAAAAD");
        renderComponent();
        const deleteFunction = getMockedComponentProps(PhoneNumberTable, 0).deleteFunction;
        await waitFor(() => deleteFunction(directory[1].directory_id)());
        act(() => {
          // advance timers so overlay times out
          jest.advanceTimersByTime(timeouts.MODAL_OVERLAY);
        });
        expect(refreshProfileData.mock.calls.length).toBe(0);
        expect(PhoneNumberTable.mock.calls[0][0].saveState).toEqual({ status: null });
        expect(PhoneNumberTable.mock.calls[1][0].saveState).toEqual({
          overlayMessage: "Deleting directory entry...",
          status: ModalOverlayStatuses.SAVING
        });
        expect(PhoneNumberTable.mock.calls[2][0].saveState).toEqual({
          overlayMessage: "Failed to delete directory entry",
          status: ModalOverlayStatuses.FAIL
        });
        expect(PhoneNumberTable.mock.calls[3][0].saveState).toEqual({ status: null });
      });
    });
    describe("the user cancels the deletion", () => {
      beforeEach(() => confirmSpy.mockImplementation(jest.fn(() => false)));
      test("we should not do anything", async () => {
        renderComponent();
        const deleteFunction = getMockedComponentProps(PhoneNumberTable, 0).deleteFunction;
        await waitFor(() => deleteFunction(directory[1].directory_id)());
        expect(deleteDirectory.mock.calls.length).toBe(0);
        expect(refreshProfileData.mock.calls.length).toBe(0);
        expect(PhoneNumberTable.mock.calls.length).toBe(1);
      });
    });
  });
});
