import { PhoneNumberContainer } from "../PhoneNumberContainer";
import React from "react";
import {
  render,
  setupMockedComponents,
  expectOnlyPassedProps,
  initialTestState,
  mockDirectoryList,
  mockDialList,
  waitFor
} from "testUtils";
import {
  useAdminDispatch, useAdminState
} from "context/appContext";
import { DialListNumberForm } from "orgmanagement/DialListNumberForm";
import { ProfileDropDown } from "orgmanagement/ProfileDropDown";
import { useLocation } from "react-router-dom";
import {
  deleteDialListEntry, deleteDirectoryEntry
} from "services/profile";
import { Modal } from "@mui/material";
import { DirectoryNumberForm } from "orgmanagement/DirectoryNumberForm";
import { PhoneNumberTable } from "orgmanagement/PhoneNumberTable";
import { StyledButton } from "components/StyledButton";
import { getPaginatedResults } from "utils/graphUtils";


jest.mock("react-router-dom", () => ({
  useLocation: jest.fn()
}));

jest.mock("@mui/material", () => ({
  Modal: jest.fn(),
  Paper: jest.requireActual("@mui/material").Paper
}));

jest.mock("components/StyledButton", () => ({
  StyledButton: jest.fn()
}));

jest.mock("orgmanagement/DialListNumberForm", () => ({
  DialListNumberForm: jest.fn()
}));

jest.mock("orgmanagement/DirectoryNumberForm", () => ({
  DirectoryNumberForm: jest.fn()
}));

jest.mock("orgmanagement/PhoneNumberTable", () => ({
  PhoneNumberTable: jest.fn()
}));

jest.mock("orgmanagement/ProfileDropDown", () => ({
  ProfileDropDown: jest.fn()
}));

jest.mock("services/profile", () => ({
  deleteDialListEntry: jest.fn(),
  deleteDirectoryEntry: jest.fn()
}));

jest.mock("utils/graphUtils", () => ({
  getPaginatedResults: jest.fn()
}));

jest.mock("context/appContext", () => ({
  useAdminState: jest.fn(),
  useAdminDispatch: jest.fn()
}));

jest.useFakeTimers();
const mockDispatch = jest.fn();

describe("<PhoneNumberContainer />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAdminState.mockReturnValue(initialTestState);
    useAdminDispatch.mockReturnValue(mockDispatch);
    getPaginatedResults.mockResolvedValue("Yay");
    useLocation.mockReturnValue();
    setupMockedComponents({
      Modal,
      StyledButton,
      DialListNumberForm,
      DirectoryNumberForm,
      PhoneNumberTable,
      ProfileDropDown
    });
  });

  const renderComponent = () => {
    return render(<PhoneNumberContainer/>);
  };

  describe("Initial Directory State", () => {
    beforeEach(() => {
      useLocation.mockReturnValue({ pathname: "directory" });
    });
    test("Should render the correct initial state", () => {
      renderComponent();
      expect(Modal).toHaveBeenCalledTimes(1);
      expect(ProfileDropDown).toHaveBeenCalledTimes(1);
      expect(StyledButton).not.toHaveBeenCalled();
      expect(PhoneNumberTable).not.toHaveBeenCalled();
      expect(DirectoryNumberForm).not.toHaveBeenCalled();
      expect(DialListNumberForm).not.toHaveBeenCalled();
    });
    describe("setSelectedProfile", () => {
      test("styled button and phone number table are rendered", () => {
        renderComponent();
        expect(Modal).toHaveBeenCalledTimes(1);
        expect(ProfileDropDown).toHaveBeenCalledTimes(1);
        const setSelectedProfile = ProfileDropDown.mock.calls[0][0].setSelectedProfile;
        setSelectedProfile(4);
        expect(StyledButton).toHaveBeenCalledTimes(1);
        expect(StyledButton.mock.calls[0][0].children.join("")).toBe("Add Directory Entry");
        expect(StyledButton).toHaveBeenCalledTimes(1);
        expect(PhoneNumberTable).toHaveBeenCalledTimes(1);
      });
    });
    describe("addButtonOnClick is called", () => {
      test("should render add modal", () => {
        renderComponent();
        expect(Modal).toHaveBeenCalledTimes(1);
        expect(ProfileDropDown).toHaveBeenCalledTimes(1);
        const setSelectedProfile = ProfileDropDown.mock.calls[0][0].setSelectedProfile;
        setSelectedProfile(2);
        expect(Modal).toHaveBeenCalledTimes(2);
        expect(Modal.mock.calls[1][0].open).toBe(false);
        expect(StyledButton).toHaveBeenCalledTimes(1);
        const clickCreate = StyledButton.mock.calls[0][0].onClick;
        clickCreate();
        expect(Modal).toHaveBeenCalledTimes(3);
        expect(Modal.mock.calls[2][0].open).toBe(true);
        render(Modal.mock.calls[2][0].children);
        expectOnlyPassedProps(DirectoryNumberForm, {
          filteredList: [mockDirectoryList[1], mockDirectoryList[2]],
          phoneNumberState: {
            type: "Directory",
            entry: {},
            formMode: "Create",
            isModalOpen: true,
            overlayMessage: "",
            saveState: {
              status: null
            }
          },
          selectedProfile: 2
        });
      });
    });
    describe("editButtonOnClick is called", () => {
      test("should render edit modal", () => {
        renderComponent();
        expect(Modal).toHaveBeenCalledTimes(1);
        expect(ProfileDropDown).toHaveBeenCalledTimes(1);
        const setSelectedProfile = ProfileDropDown.mock.calls[0][0].setSelectedProfile;
        setSelectedProfile(2);
        expect(Modal).toHaveBeenCalledTimes(2);
        expect(Modal.mock.calls[1][0].open).toBe(false);
        expect(PhoneNumberTable).toHaveBeenCalledTimes(1);
        const clickEdit = PhoneNumberTable.mock.calls[0][0].editFunction;
        clickEdit(mockDirectoryList[1]);
        expect(Modal).toHaveBeenCalledTimes(3);
        expect(Modal.mock.calls[2][0].open).toBe(true);
        render(Modal.mock.calls[2][0].children);
        expectOnlyPassedProps(DirectoryNumberForm, {
          filteredList: [mockDirectoryList[1], mockDirectoryList[2]],
          phoneNumberState: {
            type: "Directory",
            entry: {
              id: "2hTZxaWxVVBut1hWII0zHvFcYxg",
              first_name: "Billy Bob",
              last_name: "Thorton",
              directory_num: "7158706175",
              profile_id: 2
            },
            formMode: "Edit",
            isModalOpen: true,
            overlayMessage: "",
            saveState: {
              status: null
            }
          },
          selectedProfile: 2
        });
      });
    });
    describe("deleteButtonOnClick is called", () => {
      beforeEach(() => {
        jest.spyOn(window, "confirm").mockImplementation(jest.fn(() => true));
      });
      describe("confirm popUp === false", () => {
        test("should not call delete function", () => {
          jest.spyOn(window, "confirm").mockImplementation(jest.fn(() => false));
          renderComponent();
          const setSelectedProfile = ProfileDropDown.mock.calls[0][0].setSelectedProfile;
          setSelectedProfile(2);
          expect(PhoneNumberTable).toHaveBeenCalledTimes(1);
          const clickDelete = PhoneNumberTable.mock.calls[0][0].deleteFunction;
          clickDelete(mockDirectoryList[1]);
          expect(deleteDirectoryEntry).not.toHaveBeenCalled();
        });
      });
      describe("confirm popUp === true", () => {
        describe("delete entry is successful", () => {
          test("delete functionality is run", async  () => {
            deleteDirectoryEntry.mockResolvedValue("Yay");
            renderComponent();
            const setSelectedProfile = ProfileDropDown.mock.calls[0][0].setSelectedProfile;
            setSelectedProfile(2);
            expect(PhoneNumberTable).toHaveBeenCalledTimes(1);
            const clickDelete = PhoneNumberTable.mock.calls[0][0].deleteFunction;
            clickDelete(mockDirectoryList[1]);
            expect(deleteDirectoryEntry).toHaveBeenCalled();
            expect(PhoneNumberTable).toHaveBeenCalledTimes(2);
            expect(PhoneNumberTable.mock.calls[1][0].saveState).toStrictEqual({
              overlayMessage: "Deleting Directory entry...",
              status: "saving"
            });
            await waitFor(() => expect(PhoneNumberTable).toHaveBeenCalledTimes(3));
            expect(getPaginatedResults).toHaveBeenCalled();
            expect(PhoneNumberTable.mock.calls[2][0].saveState).toStrictEqual({
              overlayMessage: "Successfully deleted Directory entry",
              status: "success"
            });
            jest.runAllTimers();
            await waitFor(() => expect(PhoneNumberTable).toHaveBeenCalledTimes(4));
            expect(PhoneNumberTable.mock.calls[3][0].saveState).toStrictEqual({
              overlayMessage: "",
              status: null
            });
          });
        });
        describe("delete entry fails", () => {
          test("delete functionality is run", async  () => {
            deleteDirectoryEntry.mockRejectedValue("Boo");
            renderComponent();
            const setSelectedProfile = ProfileDropDown.mock.calls[0][0].setSelectedProfile;
            setSelectedProfile(2);
            expect(PhoneNumberTable).toHaveBeenCalledTimes(1);
            const clickDelete = PhoneNumberTable.mock.calls[0][0].deleteFunction;
            clickDelete(mockDirectoryList[1]);
            expect(deleteDirectoryEntry).toHaveBeenCalled();
            expect(PhoneNumberTable).toHaveBeenCalledTimes(2);
            expect(PhoneNumberTable.mock.calls[1][0].saveState).toStrictEqual({
              overlayMessage: "Deleting Directory entry...",
              status: "saving"
            });
            await waitFor(() => expect(PhoneNumberTable).toHaveBeenCalledTimes(3));
            expect(getPaginatedResults).not.toHaveBeenCalled();
            expect(PhoneNumberTable.mock.calls[2][0].saveState).toStrictEqual({
              overlayMessage: "Failed to delete Directory entry",
              status: "fail"
            });
            jest.runAllTimers();
            await waitFor(() => expect(PhoneNumberTable).toHaveBeenCalledTimes(4));
            expect(PhoneNumberTable.mock.calls[3][0].saveState).toStrictEqual({
              overlayMessage: "",
              status: null
            });
          });
        });
      });
    });
    describe("close modal", () => {
      test("Should render the correct initial state", () => {
        renderComponent();
        const setSelectedProfile = ProfileDropDown.mock.calls[0][0].setSelectedProfile;
        setSelectedProfile(2);
        expect(Modal.mock.calls[1][0].open).toBe(false);
        expect(StyledButton).toHaveBeenCalledTimes(1);
        const clickCreate = StyledButton.mock.calls[0][0].onClick;
        clickCreate();
        expect(Modal).toHaveBeenCalledTimes(3);
        expect(Modal.mock.calls[2][0].open).toBe(true);
        render(Modal.mock.calls[2][0].children);
        const closeModal = DirectoryNumberForm.mock.calls[0][0].closeModal;
        closeModal();
        expect(Modal).toHaveBeenCalledTimes(4);
        expect(Modal.mock.calls[3][0].open).toBe(false);
      });
    });
  });
  describe("Initial DialList State", () => {
    beforeEach(() => {
      useLocation.mockReturnValue({ pathname: "diallist" });
    });
    test("Should render the correct initial state", () => {
      renderComponent();
      expect(Modal).toHaveBeenCalledTimes(1);
      expect(ProfileDropDown).toHaveBeenCalledTimes(1);
      expect(StyledButton).not.toHaveBeenCalled();
      expect(PhoneNumberTable).not.toHaveBeenCalled();
      expect(DirectoryNumberForm).not.toHaveBeenCalled();
      expect(DialListNumberForm).not.toHaveBeenCalled();
    });
    describe("setSelectedProfile", () => {
      test("styled button and phone number table are rendered", () => {
        renderComponent();
        expect(Modal).toHaveBeenCalledTimes(1);
        expect(ProfileDropDown).toHaveBeenCalledTimes(1);
        const setSelectedProfile = ProfileDropDown.mock.calls[0][0].setSelectedProfile;
        setSelectedProfile(4);
        expect(StyledButton).toHaveBeenCalledTimes(1);
        expect(StyledButton.mock.calls[0][0].children.join("")).toBe("Add DialList Entry");
        expect(StyledButton).toHaveBeenCalledTimes(1);
        expect(PhoneNumberTable).toHaveBeenCalledTimes(1);
      });
    });
    describe("addButtonOnClick is called", () => {
      test("should render add modal", () => {
        renderComponent();
        expect(Modal).toHaveBeenCalledTimes(1);
        expect(ProfileDropDown).toHaveBeenCalledTimes(1);
        const setSelectedProfile = ProfileDropDown.mock.calls[0][0].setSelectedProfile;
        setSelectedProfile(2);
        expect(StyledButton).toHaveBeenCalledTimes(1);
        const clickCreate = StyledButton.mock.calls[0][0].onClick;
        clickCreate();
        expect(Modal).toHaveBeenCalledTimes(3);
        expect(Modal.mock.calls[2][0].open).toBe(true);
        render(Modal.mock.calls[2][0].children);
        expectOnlyPassedProps(DialListNumberForm, {
          filteredList: [mockDialList[3]],
          phoneNumberState: {
            type: "DialList",
            entry: {},
            formMode: "Create",
            isModalOpen: true,
            overlayMessage: "",
            saveState: {
              status: null
            }
          },
          selectedProfile: 2
        });
      });
    });
    describe("editButtonOnClick is called", () => {
      test("should render edit modal", () => {
        renderComponent();
        expect(Modal).toHaveBeenCalledTimes(1);
        expect(ProfileDropDown).toHaveBeenCalledTimes(1);
        const setSelectedProfile = ProfileDropDown.mock.calls[0][0].setSelectedProfile;
        setSelectedProfile(2);
        expect(Modal).toHaveBeenCalledTimes(2);
        expect(Modal.mock.calls[1][0].open).toBe(false);
        expect(PhoneNumberTable).toHaveBeenCalledTimes(1);
        const clickEdit = PhoneNumberTable.mock.calls[0][0].editFunction;
        clickEdit(mockDialList[3]);
        expect(Modal).toHaveBeenCalledTimes(3);
        expect(Modal.mock.calls[2][0].open).toBe(true);
        render(Modal.mock.calls[2][0].children);
        expectOnlyPassedProps(DialListNumberForm, {
          filteredList: [mockDialList[3]],
          phoneNumberState: {
            type: "DialList",
            entry: {
              profile_id: 2,
              contact_num: "4127439935",
              contact_name: "LNW Billing",
              external_num: "8005381648",
              id: "2hTa9yfOM8aEclEdQIXnbWhGaEh"
            },
            formMode: "Edit",
            isModalOpen: true,
            overlayMessage: "",
            saveState: {
              status: null
            }
          },
          selectedProfile: 2
        });
      });
    });
    describe("deleteButtonOnClick is called", () => {
      beforeEach(() => {
        jest.spyOn(window, "confirm").mockImplementation(jest.fn(() => true));
      });
      describe("confirm popUp === false", () => {
        test("should not call delete function", () => {
          jest.spyOn(window, "confirm").mockImplementation(jest.fn(() => false));
          renderComponent();
          const setSelectedProfile = ProfileDropDown.mock.calls[0][0].setSelectedProfile;
          setSelectedProfile(2);
          expect(PhoneNumberTable).toHaveBeenCalledTimes(1);
          const clickDelete = PhoneNumberTable.mock.calls[0][0].deleteFunction;
          clickDelete(mockDirectoryList[1]);
          expect(deleteDialListEntry).not.toHaveBeenCalled();
        });
      });
      describe("confirm popUp === true", () => {
        describe("delete entry is successful", () => {
          test("delete functionality is run", async  () => {
            deleteDialListEntry.mockResolvedValue("Yay");
            renderComponent();
            const setSelectedProfile = ProfileDropDown.mock.calls[0][0].setSelectedProfile;
            setSelectedProfile(2);
            expect(PhoneNumberTable).toHaveBeenCalledTimes(1);
            const clickDelete = PhoneNumberTable.mock.calls[0][0].deleteFunction;
            clickDelete(mockDirectoryList[1]);
            expect(deleteDialListEntry).toHaveBeenCalled();
            expect(PhoneNumberTable).toHaveBeenCalledTimes(2);
            expect(PhoneNumberTable.mock.calls[1][0].saveState).toStrictEqual({
              overlayMessage: "Deleting DialList entry...",
              status: "saving"
            });
            await waitFor(() => expect(PhoneNumberTable).toHaveBeenCalledTimes(3));
            expect(getPaginatedResults).toHaveBeenCalled();
            expect(PhoneNumberTable.mock.calls[2][0].saveState).toStrictEqual({
              overlayMessage: "Successfully deleted DialList entry",
              status: "success"
            });
            jest.runAllTimers();
            await waitFor(() => expect(PhoneNumberTable).toHaveBeenCalledTimes(4));
            expect(PhoneNumberTable.mock.calls[3][0].saveState).toStrictEqual({
              overlayMessage: "",
              status: null
            });
          });
        });
        describe("delete entry fails", () => {
          test("delete functionality is run", async  () => {
            deleteDialListEntry.mockRejectedValue("Boo");
            renderComponent();
            const setSelectedProfile = ProfileDropDown.mock.calls[0][0].setSelectedProfile;
            setSelectedProfile(2);
            expect(PhoneNumberTable).toHaveBeenCalledTimes(1);
            const clickDelete = PhoneNumberTable.mock.calls[0][0].deleteFunction;
            clickDelete(mockDirectoryList[1]);
            expect(deleteDialListEntry).toHaveBeenCalled();
            expect(PhoneNumberTable).toHaveBeenCalledTimes(2);
            expect(PhoneNumberTable.mock.calls[1][0].saveState).toStrictEqual({
              overlayMessage: "Deleting DialList entry...",
              status: "saving"
            });
            await waitFor(() => expect(PhoneNumberTable).toHaveBeenCalledTimes(3));
            expect(getPaginatedResults).not.toHaveBeenCalled();
            expect(PhoneNumberTable.mock.calls[2][0].saveState).toStrictEqual({
              overlayMessage: "Failed to delete DialList entry",
              status: "fail"
            });
            jest.runAllTimers();
            await waitFor(() => expect(PhoneNumberTable).toHaveBeenCalledTimes(4));
            expect(PhoneNumberTable.mock.calls[3][0].saveState).toStrictEqual({
              overlayMessage: "",
              status: null
            });
          });
        });
      });
    });
    describe("close modal", () => {
      test("Should render the correct initial state", () => {
        renderComponent();
        const setSelectedProfile = ProfileDropDown.mock.calls[0][0].setSelectedProfile;
        setSelectedProfile(2);
        expect(Modal.mock.calls[1][0].open).toBe(false);
        expect(StyledButton).toHaveBeenCalledTimes(1);
        const clickCreate = StyledButton.mock.calls[0][0].onClick;
        clickCreate();
        expect(Modal).toHaveBeenCalledTimes(3);
        expect(Modal.mock.calls[2][0].open).toBe(true);
        render(Modal.mock.calls[2][0].children);
        const closeModal = DialListNumberForm.mock.calls[0][0].closeModal;
        closeModal();
        expect(Modal).toHaveBeenCalledTimes(4);
        expect(Modal.mock.calls[3][0].open).toBe(false);
        Modal.mock.calls[3][0].onClose();
      });
    });
  });
});
