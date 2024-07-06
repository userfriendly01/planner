import { DialListNumberForm } from "../DialListNumberForm";
import React from "react";
import {
  render,
  setupMockedComponents,
  expectOnlyPassedProps,
  initialTestState,
  mockDialList,
  waitFor
} from "testUtils";
import { ModalOverlay } from "components/ModalOverlay";
import { PhoneNumberInput } from "components/PhoneNumberInput";
import { StyledButton } from "components/StyledButton";
import {
  useAdminDispatch, useAdminState
} from "context/appContext";
import {
  createDialListEntry, editDialListEntry, listUMSoftphoneConfigs
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
  createDialListEntry: jest.fn(),
  editDialListEntry: jest.fn(),
  listUMSoftphoneConfigs: jest.fn()
}));

jest.mock("context/appContext", () => ({
  useAdminState: jest.fn(),
  useAdminDispatch: jest.fn()
}));

jest.useFakeTimers();

const mockHandleClose = jest.fn();
const mockAdminDispatch = jest.fn();

describe("<DialListNumberForm />", () => {

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
      <DialListNumberForm
        closeModal={mockHandleClose}
        selectedProfile={1}
        phoneNumberState={tableState}
        filteredList={mockDialList.filter(dl => dl.profile_id = 1)}
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
          label: "Friendly Name *",
          value: null
        }, 0);
        expectOnlyPassedProps(TextField, {
          label: "External Number (Optional)",
          value: null
        }, 1);
        expectOnlyPassedProps(PhoneNumberInput, {
          label: "Transfer Number *",
          disabled: false,
          number: ""
        }, 0);
      });
      describe("transfer number update value", () => {
        test("formDialListEntry is updated", () => {
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
        test("formDialListEntry is updated", () => {
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
        test("formDialListEntry is updated", () => {
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
                ...mockDialList[0],
                contact_name: ""
              }
            };
            renderComponent(tableState);
            expect(StyledButton).toHaveBeenCalledTimes(2);
            expect(StyledButton.mock.calls[1][0].disabled).toBe(true);
          });
        });
        describe("service call is successful", () => {
          beforeEach(() => {
            createDialListEntry.mockResolvedValue("Yay");
          });
          test("should call updateDialListEntry", async () => {
            const tableState = {
              formMode: "Create",
              entry: {
                contact_name: "Faith Cuneo",
                contact_num: "6038518200",
                external_num: "8005552434"
              }
            };
            renderComponent(tableState);
            expect(StyledButton).toHaveBeenCalledTimes(2);
            expect(StyledButton.mock.calls[1][0].disabled).toBe(false);
            const save = StyledButton.mock.calls[1][0].onClick;
            save();
            await waitFor(() => expect(ModalOverlay).toHaveBeenCalledTimes(2));
            expectOnlyPassedProps(ModalOverlay, {
              message: "Adding dial list entry...",
              status: "saving"
            }, 0);
            expectOnlyPassedProps(ModalOverlay, {
              message: "Successfully created dial list entry",
              status: "success"
            }, 1);
            expect(listUMSoftphoneConfigs).toHaveBeenCalledTimes(1);
            jest.runAllTimers();
            await waitFor(() => expect(mockHandleClose).toHaveBeenCalledTimes(1));
          });
        });
        describe("service call fails", () => {
          beforeEach(() => {
            createDialListEntry.mockRejectedValue("Booo");
          });
          test("should call updateDialListEntry", async () => {
            const tableState = {
              formMode: "Create",
              entry: {
                contact_name: "Faith Cuneo",
                contact_num: "6038518200",
                external_num: "8005552434"
              }
            };
            renderComponent(tableState);
            expect(StyledButton).toHaveBeenCalledTimes(2);
            expect(StyledButton.mock.calls[1][0].disabled).toBe(false);
            const save = StyledButton.mock.calls[1][0].onClick;
            save();
            await waitFor(() => expect(ModalOverlay).toHaveBeenCalledTimes(2));
            expectOnlyPassedProps(ModalOverlay, {
              message: "Adding dial list entry...",
              status: "saving"
            }, 0);
            expectOnlyPassedProps(ModalOverlay, {
              message: "Failed to create dial list entry",
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
      entry: mockDialList[0]
    };
    describe("form is valid", () => {
      describe("Initial State", () => {
        test("Should render the correct initial state", () => {
          renderComponent(tableState);
          expect(ModalOverlay.mock.calls.length).toBe(0);
          expect(TextField).toHaveBeenCalledTimes(2);
          expect(PhoneNumberInput).toHaveBeenCalledTimes(1);
          expectOnlyPassedProps(TextField, {
            label: "Friendly Name *",
            value: "Ohio Casualty (OCAS Legacy)"
          }, 0);
          expectOnlyPassedProps(TextField, {
            label: "External Number (Optional)",
            value: null
          }, 1);
          expectOnlyPassedProps(PhoneNumberInput, {
            label: "Transfer Number *",
            disabled: true,
            helperText: false,
            number: "8008436446",
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
                ...mockDialList[0],
                contact_name: ""
              }
            };
            renderComponent(tableState);
            expect(StyledButton).toHaveBeenCalledTimes(2);
            expect(StyledButton.mock.calls[1][0].disabled).toBe(true);
          });
        });
        describe("service call is successful", () => {
          beforeEach(() => {
            editDialListEntry.mockResolvedValue("Yay");
          });
          test("should call updateDialListEntry", async () => {
            const tableState = {
              formMode: "Edit",
              entry: {
                contact_name: "Faith Cuneo",
                contact_num: "6038518200",
                external_num: "8005552434"
              }
            };
            renderComponent(tableState);
            expect(StyledButton).toHaveBeenCalledTimes(2);
            expect(StyledButton.mock.calls[1][0].disabled).toBe(false);
            const save = StyledButton.mock.calls[1][0].onClick;
            save();
            await waitFor(() => expect(ModalOverlay).toHaveBeenCalledTimes(2));
            expectOnlyPassedProps(ModalOverlay, {
              message: "Updating dial list entry...",
              status: "saving"
            }, 0);
            expectOnlyPassedProps(ModalOverlay, {
              message: "Successfully updated dial list entry",
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
            editDialListEntry.mockRejectedValue("Boo");
          });
          test("should call updateDialListEntry", async () => {
            const tableState = {
              formMode: "Edit",
              entry: {
                contact_name: "Faith Cuneo",
                contact_num: "6038518200",
                external_num: "8005552434"
              }
            };
            renderComponent(tableState);
            expect(StyledButton).toHaveBeenCalledTimes(2);
            expect(StyledButton.mock.calls[1][0].disabled).toBe(false);
            const save = StyledButton.mock.calls[1][0].onClick;
            save();
            await waitFor(() => expect(ModalOverlay).toHaveBeenCalledTimes(2));
            expectOnlyPassedProps(ModalOverlay, {
              message: "Updating dial list entry...",
              status: "saving"
            }, 0);
            expectOnlyPassedProps(ModalOverlay, {
              message: "Failed to update dial list entry",
              status: "fail"
            }, 1);
            expect(listUMSoftphoneConfigs).not.toHaveBeenCalled();
          });
        });
      });
    });
  });
});
