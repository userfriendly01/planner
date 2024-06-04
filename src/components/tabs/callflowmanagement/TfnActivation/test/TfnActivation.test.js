import { TfnActivation } from "../TfnActivation";
import { StyledButton } from "components/StyledButton";
import { Dropdown } from "components/Dropdown";
import { PhoneNumberInput } from "components/PhoneNumberInput";
import { useAdminState } from "context/appContext";
import React from "react";
import {
  getTfn,
  updateTfn
} from "services/tfnActivation";
import {
  act,
  expectOnlyPassedProps,
  getLastInstanceCalled,
  initialTestState,
  render,
  setupMockedComponents,
  waitFor
} from "testUtils";
import { Close } from "@mui/icons-material";
import { TextField } from "@mui/material";
import { logger } from "utils/logger";

jest.mock("@mui/material", () => ({
  TextField: jest.fn(),
  InputAdornment: jest.requireActual("@mui/material").InputAdornment
}));

jest.mock("@mui/icons-material", () => ({
  Close: jest.fn()
}));

jest.mock("components/Dropdown", () => ({
  Dropdown: jest.fn()
}));

jest.mock("components/PhoneNumberInput", () => ({
  PhoneNumberInput: jest.fn()
}));

jest.mock("components/StyledButton", () => ({
  StyledButton: jest.fn()
}));

jest.mock("context/appContext", () => ({
  useAdminState: jest.fn()
}));

jest.mock("services/tfnActivation", () => ({
  getTfn: jest.fn(),
  updateTfn: jest.fn()
}));

jest.useFakeTimers();

const mockSetSaveResult = jest.fn();
const mockSetConfirmationModalOpts = jest.fn();
const mockConfirmationModalOpts = {
  open: false,
  confirmationText: "Are you sure?",
  exportButton: false
};

const renderComponent = customOpts => {
  render(<TfnActivation
    confirmationModalOpts={customOpts || mockConfirmationModalOpts}
    setSaveResult={mockSetSaveResult}
    setConfirmationModalOpts={mockSetConfirmationModalOpts}
  />);
};

const renderComponentWithAdditionalFields = customOpts => {
  renderComponent(customOpts);
  expect(Dropdown.mock.calls.length).toBe(0);
  const updatePhoneNumber = PhoneNumberInput.mock.calls[0][0].updateValue;
  act(() => {
    updatePhoneNumber("(603) 851-8200", 6038518200, true, "+16038518200");
  });
  expect(Dropdown.mock.calls.length).toBe(1);
};

describe("TfnActivation", () => {
  beforeEach(() => {
    useAdminState.mockReturnValue(initialTestState);
    getTfn.mockResolvedValue("Phone Number not found");
    jest.clearAllMocks();
    setupMockedComponents({
      Close,
      Dropdown,
      PhoneNumberInput,
      StyledButton,
      TextField
    });
  });
  describe("initial render", () => {
    test("component renders with expected props", () => {
      renderComponent();
      expect(Dropdown).toHaveBeenCalledTimes(0);
      expect(TextField).toHaveBeenCalledTimes(0);
      expect(StyledButton).toHaveBeenCalledTimes(0);
      expect(PhoneNumberInput).toHaveBeenCalledTimes(1);
      expectOnlyPassedProps(PhoneNumberInput, {
        id: "Toll Free Number",
        label: "Toll Free Number",
        number: "",
        showError: false
      });
    });
  });
  describe("getTfn fails", () => {
    beforeEach(() => {
      getTfn.mockRejectedValue("aww");
    });
    test("error is swallowed and logged - default information is used", async () => {
      renderComponentWithAdditionalFields();
      await waitFor(() => {
        expect(logger.error).toHaveBeenCalledTimes(1);
      });
    });
  });
  describe("Non Valid Phone Number is Entered", () => {
    describe("onBlur is called", () => {
      test("showError === true", () => {
        renderComponent();
        const updatePhoneNumber = PhoneNumberInput.mock.calls[0][0].updateValue;
        act(() => {
          updatePhoneNumber("(603) 851", 603851, false, "+1603851");
        });
        const updateOnBlur = PhoneNumberInput.mock.calls[0][0].onBlur;
        act(() => {
          updateOnBlur();
        });
        expect(PhoneNumberInput.mock.calls[getLastInstanceCalled(PhoneNumberInput)][0].showError).toBe(true);
      });
    });
  });
  describe("Valid Phone Number is Entered", () => {
    describe("phoneNumber does not exist in the database", () => {
      test("should render additional fields with default data", () => {
        renderComponentWithAdditionalFields();
        expectOnlyPassedProps(Dropdown, {
          value: null
        });
        expectOnlyPassedProps(TextField, {
          label: "Display Name",
          value: ""
        }, 0);
        expectOnlyPassedProps(TextField, {
          label: "Entry Message",
          value: "Thank you for calling Liberty Mutual Insurance"
        }, 1);
        expectOnlyPassedProps(StyledButton, {
          disabled: true
        }, 0);
      });
    });
    describe("phoneNumber exists in the database", () => {
      const phoneNumberResponse = {
        data: {
          callflow_id: 9,
          display_nme: "Existing TFN",
          entry_msg: "I already live here, sir"
        }
      };
      beforeEach(() => {
        getTfn.mockResolvedValue(phoneNumberResponse);
      });
      test("should render additional fields with existing data", async () => {
        renderComponentWithAdditionalFields();
        await waitFor(() => {
          expect(Dropdown.mock.calls.length).toBe(2);
        });
        expectOnlyPassedProps(Dropdown, {
          value: {
            name: "SBSC",
            callflowId: 9,
            defaultSkill: "sbscCertificates",
            voiceWebhookUrl: "https://cicct-app-gateway.libertymutual.com/sbsc/entry/jc",
            label: "SBSC",
            value: 9
          }
        }, 1);
        expectOnlyPassedProps(TextField, {
          label: "Display Name",
          value: phoneNumberResponse.data.display_nme
        }, 2);
        expectOnlyPassedProps(TextField, {
          label: "Entry Message",
          value: phoneNumberResponse.data.entry_msg
        }, 3);
        expectOnlyPassedProps(StyledButton, {
          disabled: false
        }, getLastInstanceCalled(StyledButton));
      });
    });
    describe("onBlur is called", () => {
      test("showError === false", () => {
        renderComponentWithAdditionalFields();
        const updateOnBlur = PhoneNumberInput.mock.calls[getLastInstanceCalled(PhoneNumberInput)][0].onBlur;
        act(() => {
          updateOnBlur();
        });
        expect(PhoneNumberInput.mock.calls[getLastInstanceCalled(PhoneNumberInput)][0].showError).toBe(false);
      });
    });
  });
  describe("Additional fields", () => {
    describe("group dropdown", () => {
      describe("updateValue is called", () => {
        describe("group selection !== BL Sales", () => {
          const updatedGroup = {
            name: "Claims Intake Vanity",
            callflowId: 20,
            defaultSkill: "ccGeneralSkill12",
            voiceWebhookUrl: "https://cicct-app-gateway.libertymutual.com/claimsintake/vanity/entry/jc",
            label: "Claims Intake Vanity",
            value: 20
          };
          test("group value is updated and entry message is unchanged", () => {
            renderComponentWithAdditionalFields();
            const updateEntryMessage = TextField.mock.calls[1][0].onChange;
            act(() => {
              updateEntryMessage({
                target: {
                  value: "Custom Entry Message"
                }
              });
            });
            const updateGroup = Dropdown.mock.calls[1][0].updateValue;
            act(() => {
              updateGroup(null, updatedGroup);
            });
            expect(Dropdown.mock.calls[getLastInstanceCalled(Dropdown)][0].value).toBe(updatedGroup);
            expect(TextField.mock.calls[getLastInstanceCalled(TextField)][0].value).toBe("Custom Entry Message");
          });
        });
        describe("group selection === BL Sales", () => {
          const updatedGroup = {
            name: "BL Sales",
            callflowId: 3,
            defaultSkill: "blSalesL1",
            voiceWebhookUrl: "https://cicct-app-gateway.libertymutual.com/blsales/welcome/jc",
            label: "BL Sales",
            value: 3
          };
          test("group value is updated and entry message is updated to default", () => {
            renderComponentWithAdditionalFields();
            const updateEntryMessage = TextField.mock.calls[1][0].onChange;
            act(() => {
              updateEntryMessage({
                target: {
                  value: "Custom Entry Message"
                }
              });
            });
            const updateGroup = Dropdown.mock.calls[1][0].updateValue;
            act(() => {
              updateGroup(null, updatedGroup);
            });
            expect(Dropdown.mock.calls[getLastInstanceCalled(Dropdown)][0].value).toBe(updatedGroup);
            expect(TextField.mock.calls[getLastInstanceCalled(TextField)][0].value).toBe("Thank you for calling Liberty Mutual Insurance");
          });
        });
      });
    });
    describe("Display Name Field", () => {
      describe("updateValue is called", () => {
        test("display name value is updated", () => {
          renderComponentWithAdditionalFields();
          const updateDisplayName = TextField.mock.calls[0][0].onChange;
          act(() => {
            updateDisplayName({
              target: {
                value: "Custom Display Name"
              }
            });
          });
          expect(TextField.mock.calls[2][0].value).toBe("Custom Display Name");
        });
      });
    });
    describe("Entry Message Field", () => {
      describe("group.name === BL Sales", () => {
        const updatedGroup = {
          name: "BL Sales",
          callflowId: 3,
          defaultSkill: "blSalesL1",
          voiceWebhookUrl: "https://cicct-app-gateway.libertymutual.com/blsales/welcome/jc",
          label: "BL Sales",
          value: 3
        };
        test(" entry message field should be reset to default and disabled", () => {
          renderComponentWithAdditionalFields();
          const updateEntryMessage = TextField.mock.calls[1][0].onChange;
          act(() => {
            updateEntryMessage({
              target: {
                value: "Custom Entry Message"
              }
            });
          });
          const updateGroup = Dropdown.mock.calls[1][0].updateValue;
          act(() => {
            updateGroup(null, updatedGroup);
          });
          expect(Dropdown.mock.calls[getLastInstanceCalled(Dropdown)][0].value).toBe(updatedGroup);
          expect(TextField.mock.calls[getLastInstanceCalled(TextField)][0].value).toBe("Thank you for calling Liberty Mutual Insurance");
          expect(TextField.mock.calls[getLastInstanceCalled(TextField)][0].disabled).toBe(true);
        });
      });
      describe("updateValue is called", () => {
        test("entry message value is updated", () => {
          renderComponentWithAdditionalFields();
          const updateDisplayName = TextField.mock.calls[1][0].onChange;
          act(() => {
            updateDisplayName({
              target: {
                value: "Custom Entry Message"
              }
            });
          });
          expect(TextField.mock.calls[3][0].value).toBe("Custom Entry Message");
        });
      });
    });
  });
  describe("Submit Button is clicked", () => {
    const phoneNumberResponse = {
      data: {
        callflow_id: 9,
        display_nme: "Existing TFN",
        entry_msg: "I already live here, sir"
      }
    };
    beforeEach(() => {
      getTfn.mockResolvedValue(phoneNumberResponse);
    });
    test("setConfirmationModalOpts is called", async () => {
      renderComponentWithAdditionalFields();
      await waitFor(() => {
        expect(Dropdown.mock.calls.length).toBe(2);
      });
      expect(StyledButton.mock.calls[1][0].disabled).toBe(false);
      const clickSubmit = StyledButton.mock.calls[1][0].onClick;
      act(() => {
        clickSubmit();
      });
      expect(mockSetConfirmationModalOpts).toHaveBeenCalledTimes(1);
      expectOnlyPassedProps(mockSetConfirmationModalOpts, {
        confirmationText: "Are you sure you want to update this TFN?",
        open: true,
        exportButton: false
      });
    });
  });
  describe("Confirmation Modal", () => {
    const phoneNumberResponse = {
      data: {
        callflow_id: 9,
        display_nme: "Existing TFN",
        entry_msg: "I already live here, sir"
      }
    };
    beforeEach(() => {
      getTfn.mockResolvedValue(phoneNumberResponse);
    });
    describe("onClose is called", () => {
      test("setConfirmationModalOpts is called", async() => {
        renderComponentWithAdditionalFields();
        await waitFor(() => {
          expect(Dropdown.mock.calls.length).toBe(2);
        });
        expect(StyledButton.mock.calls[1][0].disabled).toBe(false);
        const clickSubmit = StyledButton.mock.calls[1][0].onClick;
        act(() => {
          clickSubmit();
        });
        const closeConfirmationModal = mockSetConfirmationModalOpts.mock.calls[0][0].callbackMethods.handleClose;
        act(() => {
          closeConfirmationModal();
        });
        expectOnlyPassedProps(mockSetConfirmationModalOpts, {
          open: false
        }, 1);
      });
    });
    describe("onConfirm is called", () => {
      describe("updateTfn succeeds", () => {
        beforeEach(() => {
          updateTfn.mockResolvedValue();
        });
        test("Save Result is set to success", async () => {
          renderComponentWithAdditionalFields();
          await waitFor(() => {
            expect(Dropdown.mock.calls.length).toBe(2);
          });
          expect(StyledButton.mock.calls[1][0].disabled).toBe(false);
          const clickSubmit = StyledButton.mock.calls[1][0].onClick;
          act(() => {
            clickSubmit();
          });
          const confirmConfirmationModal = mockSetConfirmationModalOpts.mock.calls[0][0].callbackMethods.onConfirm;
          act(() => {
            confirmConfirmationModal();
          });
          await waitFor(() => {
            expect(mockSetSaveResult.mock.calls.length).toBe(2);
          });
          expect(mockSetSaveResult.mock.calls[0][0]).toStrictEqual({
            message: "Processing...",
            status: "saving"
          });
          expect(mockSetSaveResult.mock.calls[1][0]).toStrictEqual({
            message: "Request Successfully Processed",
            status: "success"
          });
          jest.runAllTimers();
          expect(mockSetSaveResult.mock.calls[2][0]).toStrictEqual({
            message: "",
            status: null
          });
          expectOnlyPassedProps(mockSetConfirmationModalOpts, {
            open: false
          }, 1);
        });
      });
      describe("updateTfn fails", () => {
        beforeEach(() => {
          updateTfn.mockRejectedValue("aww");
        });
        test("Save Result is set to failed", async () => {
          renderComponentWithAdditionalFields();
          await waitFor(() => {
            expect(Dropdown.mock.calls.length).toBe(2);
          });
          expect(StyledButton.mock.calls[1][0].disabled).toBe(false);
          const clickSubmit = StyledButton.mock.calls[1][0].onClick;
          act(() => {
            clickSubmit();
          });
          const confirmConfirmationModal = mockSetConfirmationModalOpts.mock.calls[0][0].callbackMethods.onConfirm;
          act(() => {
            confirmConfirmationModal();
          });
          await waitFor(() => {
            expect(mockSetSaveResult.mock.calls.length).toBe(2);
          });
          expect(mockSetSaveResult.mock.calls[0][0]).toStrictEqual({
            message: "Processing...",
            status: "saving"
          });
          expect(mockSetSaveResult.mock.calls[1][0]).toStrictEqual({
            message: "Request Failed",
            status: "fail"
          });
          expect(mockSetConfirmationModalOpts).toHaveBeenCalledTimes(1);
        });
      });
    });
  });
});