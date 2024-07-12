import { DirectoryNumberForm } from "../DirectoryNumberForm";
import React from "react";
import {
  render,
  setupMockedComponents,
  expectOnlyPassedProps,
  initialTestState,
  waitFor,
  mockDirectoryList
} from "testUtils";
import { ModalOverlay } from "components/ModalOverlay";
import { PhoneNumberInput } from "components/PhoneNumberInput";
import { StyledButton } from "components/StyledButton";
import {
  useAdminDispatch, useAdminState
} from "context/appContext";
import {
  createDirectoryEntry, editDirectoryEntry, listUMSoftphoneConfigs
} from "services/profile";
import {
  TextField, Tooltip
} from "@mui/material";

jest.mock("@mui/material", () => ({
  TextField: jest.fn(),
  Tooltip: jest.fn(),
  Paper: jest.requireActual("@mui/material").Paper
}));

jest.mock("components/ModalOverlay", () => ({
  ModalOverlay: jest.fn()
}));

jest.mock("components/PhoneNumberInput", () => ({
  PhoneNumberInput: jest.fn()
}));

jest.mock("components/StyledButton", () => ({
  StyledButton: jest.fn()
}));

jest.mock("services/profile", () => ({
  createDirectoryEntry: jest.fn(),
  editDirectoryEntry: jest.fn(),
  listUMSoftphoneConfigs: jest.fn()
}));

jest.mock("context/appContext", () => ({
  useAdminState: jest.fn(),
  useAdminDispatch: jest.fn()
}));

jest.useFakeTimers();

const mockHandleClose = jest.fn();
const mockAdminDispatch = jest.fn();

describe("<DirectoryNumberForm />", () => {

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    useAdminState.mockReturnValue(initialTestState);
    useAdminDispatch.mockReturnValue(mockAdminDispatch);
    listUMSoftphoneConfigs.mockResolvedValue("Yay");
    setupMockedComponents({
      ModalOverlay,
      PhoneNumberInput,
      StyledButton,
      TextField,
      Tooltip
    });
  });

  const renderComponent = tableState => {
    const rendered =  render(
      <DirectoryNumberForm
        closeModal={mockHandleClose}
        selectedProfile={2}
        phoneNumberState={tableState}
        filteredList={mockDirectoryList.filter(dl => dl.profile_id = 2)}
      />
    );
    Tooltip.mock.calls.map(call => {
      render(call[0].children);
    });
    return rendered;
  };

  describe("type === create", () => {
    const tableState = {
      formMode: "Create",
      entry: {}
    };
    describe("Initial State", () => {
      test("Should render the correct initial state", () => {
        renderComponent(tableState);
        expect(ModalOverlay.mock.calls.length).toBe(0);
        expect(TextField).toHaveBeenCalledTimes(2);
        expect(PhoneNumberInput).toHaveBeenCalledTimes(1);
        expectOnlyPassedProps(TextField, {
          label: "First Name *",
          value: ""
        }, 0);
        expectOnlyPassedProps(TextField, {
          label: "Last Name *",
          value: ""
        }, 1);
        expectOnlyPassedProps(PhoneNumberInput, {
          label: "Transfer Number *",
          disabled: false,
          number: ""
        }, 0);
      });
      describe("transfer number update value", () => {
        test("formDirectoryEntry is updated", () => {
          const maskedValue = "(603) 851-8200";
          const unmaskedValue = "6038518200";
          const isValid = true;
          renderComponent(tableState);
          expect(PhoneNumberInput).toHaveBeenCalledTimes(1);
          const updateValue = PhoneNumberInput.mock.calls[0][0].updateValue;
          updateValue(maskedValue, unmaskedValue, isValid);
          expect(PhoneNumberInput).toHaveBeenCalledTimes(2);
          expect(PhoneNumberInput.mock.calls[1][0].number).toBe(maskedValue);
        });
      });
      describe("Friendly Name update value", () => {
        test("formDirectoryListEntry is updated", () => {
          const event = { target: { value: "Faith Cuneo" }};
          renderComponent(tableState);
          expect(TextField).toHaveBeenCalledTimes(2);
          const onChange = TextField.mock.calls[0][0].onChange;
          onChange(event);
          expect(TextField).toHaveBeenCalledTimes(4);
          expect(TextField.mock.calls[2][0].value).toBe(event.target.value);
        });
      });
      describe("External Number update value", () => {
        test("formDirectoryEntry is updated", () => {
          const event = { target: { value: "(800) 555-5555" }};
          renderComponent(tableState);
          expect(TextField).toHaveBeenCalledTimes(2);
          const onChange = TextField.mock.calls[1][0].onChange;
          onChange(event);
          expect(TextField).toHaveBeenCalledTimes(4);
          expect(TextField.mock.calls[3][0].value).toBe(event.target.value);
        });
      });
      describe("Save button is clicked", () => {
        describe("form is not valid", () => {
          test("button should be disabled", () => {
            const tableState = {
              formMode: "Create",
              entry: {
                ...mockDirectoryList[1],
                first_name: ""
              }
            };
            renderComponent(tableState);
            expect(StyledButton).toHaveBeenCalledTimes(2);
            expect(StyledButton.mock.calls[1][0].disabled).toBe(true);
          });
        });
        describe("service call is successful", () => {
          beforeEach(() => {
            createDirectoryEntry.mockResolvedValue("Yay");
          });
          test("should call updateDirectoryListEntry", async () => {
            const tableState = {
              formMode: "Create",
              entry: {
                first_name: "Faith",
                last_name: "Cuneo",
                directory_num: "8005552434"
              }
            };
            renderComponent(tableState);
            const maskedValue = "(603) 851-8200";
            const unmaskedValue = "6038518200";
            const isValid = true;
            const updateValue = PhoneNumberInput.mock.calls[0][0].updateValue;
            updateValue(maskedValue, unmaskedValue, isValid);
            expect(StyledButton).toHaveBeenCalledTimes(4);
            expect(StyledButton.mock.calls[3][0].disabled).toBe(false);
            const save = StyledButton.mock.calls[3][0].onClick;
            save();
            await waitFor(() => expect(ModalOverlay).toHaveBeenCalledTimes(2));
            expectOnlyPassedProps(ModalOverlay, {
              message: "Adding directory entry...",
              status: "saving"
            }, 0);
            expectOnlyPassedProps(ModalOverlay, {
              message: "Successfully created directory entry",
              status: "success"
            }, 1);
            expect(listUMSoftphoneConfigs).toHaveBeenCalledTimes(1);
            jest.runAllTimers();
            await waitFor(() => expect(mockHandleClose).toHaveBeenCalledTimes(1));
          });
        });
        describe("service call fails", () => {
          beforeEach(() => {
            createDirectoryEntry.mockRejectedValue("Booo");
          });
          test("should call updateDirectoryEntry", async () => {
            const tableState = {
              formMode: "Create",
              entry: {
                first_name: "Faith",
                last_name: "Cuneo",
                directory_num: "8005552434"
              }
            };
            renderComponent(tableState);
            const maskedValue = "(603) 851-8200";
            const unmaskedValue = "6038518200";
            const isValid = true;
            const updateValue = PhoneNumberInput.mock.calls[0][0].updateValue;
            updateValue(maskedValue, unmaskedValue, isValid);
            expect(StyledButton).toHaveBeenCalledTimes(4);
            expect(StyledButton.mock.calls[3][0].disabled).toBe(false);
            const save = StyledButton.mock.calls[3][0].onClick;
            save();
            await waitFor(() => expect(ModalOverlay).toHaveBeenCalledTimes(2));
            expectOnlyPassedProps(ModalOverlay, {
              message: "Adding directory entry...",
              status: "saving"
            }, 0);
            expectOnlyPassedProps(ModalOverlay, {
              message: "Failed to create directory entry",
              status: "fail"
            }, 1);
            expect(listUMSoftphoneConfigs).not.toHaveBeenCalled();
          });
        });
      });
    });
  });
  describe("type === edit", () => {
    const tableState = {
      formMode: "Edit",
      entry: mockDirectoryList[1]
    };
    describe("form is valid", () => {
      describe("Initial State", () => {
        test("Should render the correct initial state", () => {
          renderComponent(tableState);
          expect(ModalOverlay.mock.calls.length).toBe(0);
          expect(TextField).toHaveBeenCalledTimes(2);
          expect(PhoneNumberInput).toHaveBeenCalledTimes(1);
          expectOnlyPassedProps(TextField, {
            label: "First Name *",
            value: "Billy Bob"
          }, 0);
          expectOnlyPassedProps(TextField, {
            label: "Last Name *",
            value: "Thorton"
          }, 1);
          expectOnlyPassedProps(PhoneNumberInput, {
            label: "Transfer Number *",
            disabled: true,
            helperText: false,
            number: "7158706175",
            error: false
          }, 0);
        });
      });
      describe("Close button is clicked", () => {
        test("should call closeModal", () => {
          renderComponent(tableState);
          expect(StyledButton).toHaveBeenCalledTimes(2);
          const closeModal = StyledButton.mock.calls[0][0].onClick;
          closeModal();
          expect(mockHandleClose).toHaveBeenCalled();
        });
      });
      describe("Save button is clicked", () => {
        describe("form is not valid", () => {
          test("button should be disabled", () => {
            const tableState = {
              formMode: "Edit",
              entry: {
                ...mockDirectoryList[1],
                first_name: ""
              }
            };
            renderComponent(tableState);
            expect(StyledButton).toHaveBeenCalledTimes(2);
            expect(StyledButton.mock.calls[1][0].disabled).toBe(true);
          });
        });
        describe("service call is successful", () => {
          beforeEach(() => {
            editDirectoryEntry.mockResolvedValue("Yay");
          });
          test("should call updateDirectoryEntry", async () => {
            const tableState = {
              formMode: "Edit",
              entry: {
                first_name: "Faith",
                last_name: "Cuneo",
                directory_num: "6038518200"
              }
            };
            renderComponent(tableState);
            expect(StyledButton).toHaveBeenCalledTimes(2);
            expect(StyledButton.mock.calls[1][0].disabled).toBe(false);
            const save = StyledButton.mock.calls[1][0].onClick;
            save();
            await waitFor(() => expect(ModalOverlay).toHaveBeenCalledTimes(2));
            expectOnlyPassedProps(ModalOverlay, {
              message: "Updating directory entry...",
              status: "saving"
            }, 0);
            expectOnlyPassedProps(ModalOverlay, {
              message: "Successfully updated directory entry",
              status: "success"
            }, 1);
            expect(listUMSoftphoneConfigs).toHaveBeenCalledTimes(1);
            await waitFor(() => {
              jest.runAllTimers();
              expect(mockHandleClose).toHaveBeenCalledTimes(1);
            });
          });
        });
        describe("service call fails", () => {
          beforeEach(() => {
            editDirectoryEntry.mockRejectedValue("Boo");
          });
          test("should call updateDirectoryEntry", async () => {
            const tableState = {
              formMode: "Edit",
              entry: {
                first_name: "Faith",
                last_name: "Cuneo",
                directory_num: "8005552434"
              }
            };
            renderComponent(tableState);
            expect(StyledButton).toHaveBeenCalledTimes(2);
            expect(StyledButton.mock.calls[1][0].disabled).toBe(false);
            const save = StyledButton.mock.calls[1][0].onClick;
            save();
            await waitFor(() => expect(ModalOverlay).toHaveBeenCalledTimes(2));
            expectOnlyPassedProps(ModalOverlay, {
              message: "Updating directory entry...",
              status: "saving"
            }, 0);
            expectOnlyPassedProps(ModalOverlay, {
              message: "Failed to update directory entry",
              status: "fail"
            }, 1);
            expect(listUMSoftphoneConfigs).not.toHaveBeenCalled();
          });
        });
      });
    });
  });
});
