import DirectoryEntryForm from "../DirectoryEntryForm";
import {
  TextField,
  Tooltip
} from "@material-ui/core";
import { InfoOutlined } from "@material-ui/icons";
import {
  PaperContainer,
  ModalPhoneNumber,
  ModalOverlay,
  StyledButton
} from "components";
import {
  formModes,
  modalOverlayStatuses,
  timeouts
} from "globals";
import React from "react";
import {
  insertDirectory,
  updateDirectory
} from "services";
import {
  act,
  expectMockedComponent,
  expectOnlyPassedProps,
  getLastInstanceCalled,
  getMockedComponentProps,
  render,
  setupMockedComponents,
  waitFor
} from "testUtils";

jest.useFakeTimers();

jest.mock("@material-ui/core", () => ({
  __esModule: true,
  TextField: jest.fn(),
  Tooltip: jest.fn()
}));

jest.mock("@material-ui/icons", () => ({
  __esModule: true,
  InfoOutlined: jest.fn()
}));

jest.mock("components", () => ({
  __esModule: true,
  PaperContainer: jest.fn(),
  ModalPhoneNumber: jest.fn(),
  ModalOverlay: jest.fn(),
  StyledButton: jest.fn()
}));

jest.mock("services", () => ({
  __esModule: true,
  insertDirectory: jest.fn(),
  updateDirectory: jest.fn()
}));

const first_nme = "Some";
const last_nme = "Contact";
const phone_num = "8006665555";
const directoryId = 892;
const takenPhoneNums = ["6038886666", "8009994444"];
const profileId = "99";
const refreshProfileData = jest.fn();
const closeModal = jest.fn();

const renderComponent = directoryState => render(
  <DirectoryEntryForm
    closeModal={closeModal}
    directoryState={directoryState}
    profileId={profileId}
    refreshProfileData={refreshProfileData}
  />
);

describe("<DirectoryEntryForm />", () => {

  beforeEach(() => {
    jest.clearAllMocks();
    setupMockedComponents({
      InfoOutlined,
      ModalPhoneNumber,
      ModalOverlay,
      StyledButton,
      TextField,
      Tooltip
    });
    PaperContainer.mockImplementation(props => <div>{props.children}</div>);
  });

  describe("form is in INSERT mode", () => {
    const directoryEntryFormMode = formModes.INSERT;

    describe("directoryState.directoryEntryFormInitialValues does not include intial values", () => {
      const directoryState = {
        directoryId,
        directoryEntryFormInitialValues: {},
        directoryEntryFormMode,
        takenPhoneNums
      };

      test("header text has add verbiage", done => {
        const rendered = renderComponent(directoryState);
        expect(rendered.container).toHaveTextContent("Add Directory Entry");
        done();
      });

      test("should render input components with no initial values, no error flags on inputs and save button disabled", done => {
        renderComponent(directoryState);
        // Phone Number input for phone_num
        expectOnlyPassedProps(ModalPhoneNumber, {
          error: false,
          helperText: null,
          number: "",
          showError: false
        }, getLastInstanceCalled(ModalPhoneNumber));
        // First Name input for first_nme
        expectOnlyPassedProps(TextField, {
          error: false,
          helperText: null,
          value: ""
        }, getLastInstanceCalled(TextField) - 1);
        // Last Name input for last_nme
        expectOnlyPassedProps(TextField, {
          error: false,
          helperText: null,
          value: ""
        }, getLastInstanceCalled(TextField));
        // Check that Save button is disabled
        expectOnlyPassedProps(StyledButton, {
          disabled: true
        }, getLastInstanceCalled(StyledButton) - 1);
        done();
      });

      test("calling onBlur on text fields and making fields invalid should trigger the various error logic", done => {
        renderComponent(directoryState);
        act(() => {
          // Phone Number input
          getMockedComponentProps(ModalPhoneNumber, getLastInstanceCalled(ModalPhoneNumber)).onBlur();
        });
        act(() => {
          // First Name input
          getMockedComponentProps(TextField, getLastInstanceCalled(TextField) - 1).onBlur();
        });
        act(() => {
          // Last Name input
          getMockedComponentProps(TextField, getLastInstanceCalled(TextField)).onBlur();
        });
        // Transfer Number input for phone_num should use its native error logic so we set showError to true
        expectOnlyPassedProps(ModalPhoneNumber, {
          error: false,
          helperText: null,
          number: "",
          showError: true
        }, getLastInstanceCalled(ModalPhoneNumber));
        // Friendly Name input for first_nme
        expectOnlyPassedProps(TextField, {
          error: true,
          helperText: "Please enter a first name",
          value: ""
        }, getLastInstanceCalled(TextField) - 1);
        expectOnlyPassedProps(TextField, {
          error: true,
          helperText: "Please enter a last name",
          value: ""
        }, getLastInstanceCalled(TextField));
        const updatedContactNum = "(800) who-cares";
        act(() => {
          // Phone Number input set to valid but duplicate number
          getMockedComponentProps(ModalPhoneNumber, getLastInstanceCalled(ModalPhoneNumber))
            .updateValue(updatedContactNum, takenPhoneNums[0], true);
        });
        // Phone Number input for phone_num is valid but is a duplicate
        expectOnlyPassedProps(ModalPhoneNumber, {
          error: true,
          helperText: "Number already exists in directory",
          number: updatedContactNum,
          showError: true
        }, getLastInstanceCalled(ModalPhoneNumber));
        done();
      });

      describe("service call to insert directory entry succeeds", () => {

        beforeEach(() => {
          insertDirectory.mockResolvedValue({ who: "cares?" });
        });

        test("submit button should be disabled then entering valid values in all the required fields should enable the submit button and show success overlay on click", async () => {
          const rendered = renderComponent(directoryState);
          // Check that Save button is disabled
          expectOnlyPassedProps(StyledButton, {
            disabled: true
          }, getLastInstanceCalled(StyledButton) - 1);

          const updatedMaskedNumber = "(603) 888 1234";
          const updatedUnmaskedNumber = "6038881234";
          const updatedFirstNme = "New!!!";
          const updatedLastNme = "Name!!!";

          act(() => {
            // Phone Number input update
            getMockedComponentProps(ModalPhoneNumber, getLastInstanceCalled(ModalPhoneNumber))
              .updateValue(updatedMaskedNumber, updatedUnmaskedNumber, true);
          });
          act(() => {
            // First Name input update
            getMockedComponentProps(TextField, getLastInstanceCalled(TextField) - 1).onChange({
              target: {
                value: updatedFirstNme
              }
            });
          });
          act(() => {
            // Last Name input update
            getMockedComponentProps(TextField, getLastInstanceCalled(TextField)).onChange({
              target: {
                value: updatedLastNme
              }
            });
          });
          // Check that Save button is enabled
          expectOnlyPassedProps(StyledButton, {
            disabled: false
          }, getLastInstanceCalled(StyledButton) - 1);
          // Save button click
          act(() => {
            getMockedComponentProps(StyledButton, getLastInstanceCalled(StyledButton) - 1)
              .onClick();
          });
          await waitFor(() => {
            // Validate requst body sent
            expect(insertDirectory.mock.calls[0]).toEqual([
              updatedFirstNme,
              updatedLastNme,
              updatedUnmaskedNumber,
              profileId
            ]);
            expectMockedComponent(rendered, { ModalOverlay });
            // First call of ModalOverlay displays pending status
            expectOnlyPassedProps(ModalOverlay, {
              message: "Adding directory entry...",
              status: modalOverlayStatuses.SAVING
            }, getLastInstanceCalled(ModalOverlay) - 1);
            // Second call of ModalOverlay displays success message
            expectOnlyPassedProps(ModalOverlay, {
              message: "Successfully added directory entry",
              status: modalOverlayStatuses.SUCCESS
            }, getLastInstanceCalled(ModalOverlay));
            expect(refreshProfileData).toHaveBeenCalledTimes(1);
          });
          // Run timers so get rid of ModalOverlay
          act(() => {
            jest.advanceTimersByTime(timeouts.MODAL_OVERLAY);
          });
          await waitFor(() => {
            // Form is closed
            expect(closeModal).toHaveBeenCalledWith();
          });
        });
      });

      describe("service call to insert directory entry fails", () => {

        beforeEach(() => {
          insertDirectory.mockRejectedValue({ who: "cares? but this is bad wahhhh" });
        });

        test("submit button should be disabled then entering valid values in all the required fields should enable the submit button and show failure overlay on click", async () => {
          const rendered = renderComponent(directoryState);
          // Check that Save button is disabled
          expectOnlyPassedProps(StyledButton, {
            disabled: true
          }, getLastInstanceCalled(StyledButton) - 1);

          const updatedMaskedNumber = "(603) 888 1234";
          const updatedUnmaskedNumber = "6038881234";
          const updatedFirstNme = "New!!!";
          const updatedLastNme = "Name!!!";

          act(() => {
            // Phone Number input update
            getMockedComponentProps(ModalPhoneNumber, getLastInstanceCalled(ModalPhoneNumber))
              .updateValue(updatedMaskedNumber, updatedUnmaskedNumber, true);
          });
          act(() => {
            // First Name input update
            getMockedComponentProps(TextField, getLastInstanceCalled(TextField) - 1).onChange({
              target: {
                value: updatedFirstNme
              }
            });
          });
          act(() => {
            // Last Name input update
            getMockedComponentProps(TextField, getLastInstanceCalled(TextField)).onChange({
              target: {
                value: updatedLastNme
              }
            });
          });
          // Check that Save button is enabled
          expectOnlyPassedProps(StyledButton, {
            disabled: false
          }, getLastInstanceCalled(StyledButton) - 1);
          // Save button click
          act(() => {
            getMockedComponentProps(StyledButton, getLastInstanceCalled(StyledButton) - 1)
              .onClick();
          });
          await waitFor(() => {
            // Validate requst body sent
            expect(insertDirectory.mock.calls[0]).toEqual([
              updatedFirstNme,
              updatedLastNme,
              updatedUnmaskedNumber,
              profileId
            ]);
            expectMockedComponent(rendered, { ModalOverlay });
            // First call of ModalOverlay displays pending status
            expectOnlyPassedProps(ModalOverlay, {
              message: "Adding directory entry...",
              status: modalOverlayStatuses.SAVING
            }, getLastInstanceCalled(ModalOverlay) - 1);
            // Second call of ModalOverlay displays failure message
            expectOnlyPassedProps(ModalOverlay, {
              message: "Failed to add directory entry",
              status: modalOverlayStatuses.FAIL
            }, getLastInstanceCalled(ModalOverlay));
            expect(refreshProfileData).toHaveBeenCalledTimes(0);
          });
          // Run timers so get rid of ModalOverlay
          act(() => {
            jest.advanceTimersByTime(timeouts.MODAL_OVERLAY);
          });
          await waitFor(() => {
            // Overlay is hidden
            expect(closeModal).not.toHaveBeenCalled();
            expectMockedComponent(rendered, { ModalOverlay }, 0);
          });
        });
      });
    });
  });

  describe("form is in UPDATE mode", () => {
    const directoryEntryFormMode = formModes.UPDATE;

    describe("directoryState.directoryEntryFormInitialValues includes initial values for all fields", () => {
      const directoryState = {
        directoryId,
        directoryEntryFormInitialValues: {
          first_nme,
          last_nme,
          phone_num
        },
        directoryEntryFormMode,
        takenPhoneNums
      };

      test("header text has edit verbiage", done => {
        const rendered = renderComponent(directoryState);
        expect(rendered.container).toHaveTextContent("Edit Directory Entry");
        done();
      });

      test("should render input components with initial values and no error flags on inputs and save button enabled", done => {
        renderComponent(directoryState);
        // Phone Number input for phone_num
        expectOnlyPassedProps(ModalPhoneNumber, {
          error: false,
          helperText: null,
          number: phone_num,
          showError: false
        }, getLastInstanceCalled(ModalPhoneNumber));
        // First Name input for first_nme
        expectOnlyPassedProps(TextField, {
          error: false,
          helperText: null,
          value: first_nme
        }, getLastInstanceCalled(TextField) - 1);
        // Last Name input for last_nme
        expectOnlyPassedProps(TextField, {
          error: false,
          helperText: null,
          value: last_nme
        }, getLastInstanceCalled(TextField));
        // Check that Save button is enabled
        expectOnlyPassedProps(StyledButton, {
          disabled: false
        }, getLastInstanceCalled(StyledButton) - 1);
        done();
      });

      test("calling onBlur for text fields should not trigger the error logic", done => {
        renderComponent(directoryState);
        act(() => {
          // Phone Number input
          getMockedComponentProps(ModalPhoneNumber, getLastInstanceCalled(ModalPhoneNumber)).onBlur();
        });
        act(() => {
          // First Name input
          getMockedComponentProps(TextField, getLastInstanceCalled(TextField) - 1).onBlur();
        });
        act(() => {
          // Last Name input
          getMockedComponentProps(TextField, getLastInstanceCalled(TextField)).onBlur();
        });
        // Phone Number input for phone_num
        expectOnlyPassedProps(ModalPhoneNumber, {
          error: false,
          helperText: null,
          number: phone_num,
          showError: true
        }, getLastInstanceCalled(ModalPhoneNumber));
        // First Name input for first_nme
        expectOnlyPassedProps(TextField, {
          error: false,
          helperText: null,
          value: first_nme
        }, getLastInstanceCalled(TextField) - 1);
        // Last Name input for last_nme
        expectOnlyPassedProps(TextField, {
          error: false,
          helperText: null,
          value: last_nme
        }, getLastInstanceCalled(TextField));
        done();
      });
    });

    describe("directoryState.directoryEntryFormInitialValues does not include intial values", () => {
      const directoryState = {
        directoryId,
        directoryEntryFormInitialValues: {},
        directoryEntryFormMode,
        takenPhoneNums
      };

      describe("service call to update directory entry succeeds", () => {

        beforeEach(() => {
          updateDirectory.mockResolvedValue({ who: "cares?" });
        });

        test("submit button should be disabled then entering valid values in all the required fields should enable the submit button and show success overlay on click", async () => {
          const rendered = renderComponent(directoryState);
          // Check that Save button is disabled
          expectOnlyPassedProps(StyledButton, {
            disabled: true
          }, getLastInstanceCalled(StyledButton) - 1);

          const updatedMaskedNumber = "(603) 888 1234";
          const updatedUnmaskedNumber = "6038881234";
          const updatedFirstNme = "New!!!";
          const updatedLastNme = "Name!!!";

          act(() => {
            // Phone Number input update
            getMockedComponentProps(ModalPhoneNumber, getLastInstanceCalled(ModalPhoneNumber))
              .updateValue(updatedMaskedNumber, updatedUnmaskedNumber, true);
          });
          act(() => {
            // First Name input update
            getMockedComponentProps(TextField, getLastInstanceCalled(TextField) - 1).onChange({
              target: {
                value: updatedFirstNme
              }
            });
          });
          act(() => {
            // Last Name input update
            getMockedComponentProps(TextField, getLastInstanceCalled(TextField)).onChange({
              target: {
                value: updatedLastNme
              }
            });
          });
          // Check that Save button is enabled
          expectOnlyPassedProps(StyledButton, {
            disabled: false
          }, getLastInstanceCalled(StyledButton) - 1);
          // Save button click
          act(() => {
            getMockedComponentProps(StyledButton, getLastInstanceCalled(StyledButton) - 1)
              .onClick();
          });
          await waitFor(() => {
            expect(updateDirectory.mock.calls[0]).toEqual([
              directoryId,
              updatedFirstNme,
              updatedLastNme,
              updatedUnmaskedNumber
            ]);
            expectMockedComponent(rendered, { ModalOverlay });
            // First call of ModalOverlay displays pending status
            expectOnlyPassedProps(ModalOverlay, {
              message: "Updating directory entry...",
              status: modalOverlayStatuses.SAVING
            }, getLastInstanceCalled(ModalOverlay) - 1);
            // Second call of ModalOverlay displays success message
            expectOnlyPassedProps(ModalOverlay, {
              message: "Successfully updated directory entry",
              status: modalOverlayStatuses.SUCCESS
            }, getLastInstanceCalled(ModalOverlay));
            expect(refreshProfileData).toHaveBeenCalledTimes(1);
          });
          // Run timers so get rid of ModalOverlay
          act(() => {
            jest.advanceTimersByTime(timeouts.MODAL_OVERLAY);
          });
          await waitFor(() => {
            // Form is closed
            expect(closeModal).toHaveBeenCalledWith();
          });
        });
      });

      describe("service call to update directory entry fails", () => {

        beforeEach(() => {
          updateDirectory.mockRejectedValue({ who: "cares? but this is bad wahhhh" });
        });

        test("submit button should be disabled then entering valid values in all the required fields should enable the submit button and show failure overlay on click", async () => {
          const rendered = renderComponent(directoryState);
          // Check that Save button is disabled
          expectOnlyPassedProps(StyledButton, {
            disabled: true
          }, getLastInstanceCalled(StyledButton) - 1);

          const updatedMaskedNumber = "(603) 888 1234";
          const updatedUnmaskedNumber = "6038881234";
          const updatedFirstNme = "New!!!";
          const updatedLastNme = "Name!!!";

          act(() => {
            // Phone Number input update
            getMockedComponentProps(ModalPhoneNumber, getLastInstanceCalled(ModalPhoneNumber))
              .updateValue(updatedMaskedNumber, updatedUnmaskedNumber, true);
          });
          act(() => {
            // First Name input update
            getMockedComponentProps(TextField, getLastInstanceCalled(TextField) - 1).onChange({
              target: {
                value: updatedFirstNme
              }
            });
          });
          act(() => {
            // Last Name input update
            getMockedComponentProps(TextField, getLastInstanceCalled(TextField)).onChange({
              target: {
                value: updatedLastNme
              }
            });
          });
          // Check that Save button is enabled
          expectOnlyPassedProps(StyledButton, {
            disabled: false
          }, getLastInstanceCalled(StyledButton) - 1);
          // Save button click
          act(() => {
            getMockedComponentProps(StyledButton, getLastInstanceCalled(StyledButton) - 1)
              .onClick();
          });
          await waitFor(() => {
            expectMockedComponent(rendered, { ModalOverlay });
            // First call of ModalOverlay displays pending status
            expectOnlyPassedProps(ModalOverlay, {
              message: "Updating directory entry...",
              status: modalOverlayStatuses.SAVING
            }, getLastInstanceCalled(ModalOverlay) - 1);
            // Second call of ModalOverlay displays failure message
            expectOnlyPassedProps(ModalOverlay, {
              message: "Failed to update directory entry",
              status: modalOverlayStatuses.FAIL
            }, getLastInstanceCalled(ModalOverlay));
            expect(refreshProfileData).toHaveBeenCalledTimes(0);
          });
          // Run timers so get rid of ModalOverlay
          act(() => {
            jest.advanceTimersByTime(timeouts.MODAL_OVERLAY);
          });
          await waitFor(() => {
            // Overlay is hidden
            expectMockedComponent(rendered, { ModalOverlay }, 0);
          });
        });
      });
    });
  });
});