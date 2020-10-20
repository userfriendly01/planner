import DialListEntryForm from "../DialListEntryForm";
import {
  TextField,
  Tooltip
} from "@material-ui/core";
import { InfoOutlined } from "@material-ui/icons";
import MockAdapter from "axios-mock-adapter";
import {
  PaperContainer,
  ModalPhoneNumber,
  StatusOverlay,
  StyledButton
} from "components";
import {
  apiPaths,
  formModes,
  statusOverlayStatuses,
  statusOverlayTimeout
} from "globals";
import React from "react";
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
import { myAxios } from "utils";

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
  StatusOverlay: jest.fn(),
  StyledButton: jest.fn()
}));

const axiosMock = new MockAdapter(myAxios);

const contact_nme = "Some Contact";
const contact_num = "8006665555";
const dialListId = 892;
const external_num = "1-800-whatever";
const otherContactNums = ["6038886666", "8009994444"];
const profileId = "99";
const refreshProfileData = jest.fn();
const setDialListTableState = jest.fn();

const renderComponent = dialListTableState => render(
  <DialListEntryForm
    dialListTableState={dialListTableState}
    profileId={profileId}
    refreshProfileData={refreshProfileData}
    setDialListTableState={setDialListTableState}
  />
);

describe("<DialListEntryForm />", () => {

  beforeEach(() => {
    axiosMock.reset();
    jest.clearAllMocks();
    setupMockedComponents({
      InfoOutlined,
      ModalPhoneNumber,
      StatusOverlay,
      StyledButton,
      TextField,
      Tooltip
    });
    PaperContainer.mockImplementation(props => <div>{props.children}</div>);
  });

  describe("form is in INSERT mode", () => {
    const dialListEntryFormMode = formModes.INSERT;

    describe("dialListTableState.dialListEntryFormInitialValues does not include intial values", () => {
      const dialListTableState = {
        dialListId,
        dialListEntryFormInitialValues: {},
        dialListEntryFormMode,
        otherContactNums
      };

      test("header text has add verbiage", done => {
        const rendered = renderComponent(dialListTableState);
        expect(rendered.container).toHaveTextContent("Add Dial List Entry");
        done();
      });

      test("should render input components with no initial values, no error flags on inputs and save button disabled", done => {
        renderComponent(dialListTableState);
        // Transfer Number input for contact_num
        expectOnlyPassedProps(ModalPhoneNumber, {
          error: false,
          helperText: null,
          number: "",
          showError: false
        }, getLastInstanceCalled(ModalPhoneNumber));
        // Friendly Name input for contact_nme
        expectOnlyPassedProps(TextField, {
          error: false,
          helperText: null,
          value: ""
        }, getLastInstanceCalled(TextField) - 1);
        // External Number input for external_num
        expectOnlyPassedProps(TextField, {
          value: ""
        }, getLastInstanceCalled(TextField));
        // Check that Save button is enabled
        expectOnlyPassedProps(StyledButton, {
          disabled: true
        }, getLastInstanceCalled(StyledButton) - 1);
        done();
      });

      test("calling onBlur on text fields and making fields invalid should trigger the various error logic", done => {
        renderComponent(dialListTableState);
        act(() => {
          // Transfer Number input
          getMockedComponentProps(ModalPhoneNumber, getLastInstanceCalled(ModalPhoneNumber)).onBlur();
        });
        act(() => {
          // Friendly Name input
          getMockedComponentProps(TextField, getLastInstanceCalled(TextField) - 1).onBlur();
        });
        // Transfer Number input for contact_num should use its native error logic so we set showError to true
        expectOnlyPassedProps(ModalPhoneNumber, {
          error: false,
          helperText: null,
          number: "",
          showError: true
        }, getLastInstanceCalled(ModalPhoneNumber));
        // Friendly Name input for contact_nme
        expectOnlyPassedProps(TextField, {
          error: true,
          helperText: "Please enter a friendly name",
          value: ""
        }, getLastInstanceCalled(TextField) - 1);
        const updatedContactNum = "(800) who-cares";
        act(() => {
          // Transfer Number input set to valid but duplicate number
          getMockedComponentProps(ModalPhoneNumber, getLastInstanceCalled(ModalPhoneNumber))
            .updateValue(updatedContactNum, otherContactNums[0], true);
        });
        // Transfer Number input for contact_num is valid but is a duplicate
        expectOnlyPassedProps(ModalPhoneNumber, {
          error: true,
          helperText: "Number already exists in dial list",
          number: updatedContactNum,
          showError: true
        }, getLastInstanceCalled(ModalPhoneNumber));
        done();
      });

      describe("service call to insert dial list entry succeeds", () => {

        beforeEach(() => {
          axiosMock.onPost(apiPaths.DIAL_LIST).reply(200, { who: "cares?" });
        });

        test("submit button should be disabled then entering valid values in all the required fields should enable the submit button and show success overlay on click", async () => {
          const rendered = renderComponent(dialListTableState);
          // Check that Save button is disabled
          expectOnlyPassedProps(StyledButton, {
            disabled: true
          }, getLastInstanceCalled(StyledButton) - 1);

          const updatedMaskedNumber = "(603) 888 1234";
          const updatedUnmaskedNumber = "6038881234";
          const updatedContactNme = "New Name!!!";

          act(() => {
            // Transfer Number input update
            getMockedComponentProps(ModalPhoneNumber, getLastInstanceCalled(ModalPhoneNumber))
              .updateValue(updatedMaskedNumber, updatedUnmaskedNumber, true);
          });
          act(() => {
            // Friendly Name input update
            getMockedComponentProps(TextField, getLastInstanceCalled(TextField) - 1).onChange({
              target: {
                value: updatedContactNme
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
            expect(axiosMock.history.post[0].data).toBe(JSON.stringify({
              contact_nme: updatedContactNme,
              contact_num: updatedUnmaskedNumber,
              external_num: "",
              profile_id: profileId
            }));
            expectMockedComponent(rendered, { StatusOverlay });
            // First call of StatusOverlay displays pending status
            expectOnlyPassedProps(StatusOverlay, {
              message: "Adding dial list entry...",
              status: statusOverlayStatuses.SAVING
            }, getLastInstanceCalled(StatusOverlay) - 1);
            // Second call of StatusOverlay displays success message
            expectOnlyPassedProps(StatusOverlay, {
              message: "Successfully added dial list entry",
              status: statusOverlayStatuses.SUCCESS
            }, getLastInstanceCalled(StatusOverlay));
            expect(refreshProfileData).toHaveBeenCalledTimes(1);
          });
          // Run timers so get rid of StatusOverlay
          act(() => {
            jest.advanceTimersByTime(statusOverlayTimeout);
          });
          await waitFor(() => {
            // Form is closed
            expect(setDialListTableState).toHaveBeenCalledWith({
              ...dialListTableState,
              isDialListEntryFormOpen: false
            });
          });
        });
      });

      describe("service call to insert dial list entry fails", () => {

        beforeEach(() => {
          axiosMock.onPost(apiPaths.DIAL_LIST).reply(500, { who: "cares? but this is bad wahhhh" });
        });

        test("submit button should be disabled then entering valid values in all the required fields should enable the submit button and show failure overlay on click", async () => {
          const rendered = renderComponent(dialListTableState);
          // Check that Save button is disabled
          expectOnlyPassedProps(StyledButton, {
            disabled: true
          }, getLastInstanceCalled(StyledButton) - 1);

          const updatedMaskedNumber = "(603) 888 1234";
          const updatedUnmaskedNumber = "6038881234";
          const updatedContactNme = "New Name!!!";
          const updatedExternalNum = "1-800-whatever lol";

          act(() => {
            // Transfer Number input update
            getMockedComponentProps(ModalPhoneNumber, getLastInstanceCalled(ModalPhoneNumber))
              .updateValue(updatedMaskedNumber, updatedUnmaskedNumber, true);
          });
          act(() => {
            // Friendly Name input update
            getMockedComponentProps(TextField, getLastInstanceCalled(TextField) - 1).onChange({
              target: {
                value: updatedContactNme
              }
            });
          });
          act(() => {
            // External num field update
            getMockedComponentProps(TextField, getLastInstanceCalled(TextField)).onChange({
              target: {
                value: updatedExternalNum
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
            expect(axiosMock.history.post[0].data).toBe(JSON.stringify({
              contact_nme: updatedContactNme,
              contact_num: updatedUnmaskedNumber,
              external_num: updatedExternalNum,
              profile_id: profileId
            }));
            expectMockedComponent(rendered, { StatusOverlay });
            // First call of StatusOverlay displays pending status
            expectOnlyPassedProps(StatusOverlay, {
              message: "Adding dial list entry...",
              status: statusOverlayStatuses.SAVING
            }, getLastInstanceCalled(StatusOverlay) - 1);
            // Second call of StatusOverlay displays failure message
            expectOnlyPassedProps(StatusOverlay, {
              message: "Failed to add dial list entry",
              status: statusOverlayStatuses.FAIL
            }, getLastInstanceCalled(StatusOverlay));
            expect(refreshProfileData).toHaveBeenCalledTimes(0);
          });
          // Run timers so get rid of StatusOverlay
          act(() => {
            jest.advanceTimersByTime(statusOverlayTimeout);
          });
          await waitFor(() => {
            // Overlay is hidden
            expectMockedComponent(rendered, { StatusOverlay }, 0);
          });
        });
      });
    });
  });

  describe("form is in UPDATE mode", () => {
    const dialListEntryFormMode = formModes.UPDATE;

    describe("dialListTableState.dialListEntryFormInitialValues includes initial values for all fields", () => {
      const dialListTableState = {
        dialListId,
        dialListEntryFormInitialValues: {
          contact_nme,
          contact_num,
          external_num
        },
        dialListEntryFormMode,
        otherContactNums
      };

      test("header text has edit verbiage", done => {
        const rendered = renderComponent(dialListTableState);
        expect(rendered.container).toHaveTextContent("Edit Dial List Entry");
        done();
      });

      test("should render input components with initial values and no error flags on inputs and save button enabled", done => {
        renderComponent(dialListTableState);
        // Transfer Number input for contact_num
        expectOnlyPassedProps(ModalPhoneNumber, {
          error: false,
          helperText: null,
          number: contact_num,
          showError: false
        }, getLastInstanceCalled(ModalPhoneNumber));
        // Friendly Name input for contact_nme
        expectOnlyPassedProps(TextField, {
          error: false,
          helperText: null,
          value: contact_nme
        }, getLastInstanceCalled(TextField) - 1);
        // External Number input for external_num
        expectOnlyPassedProps(TextField, {
          value: external_num
        }, getLastInstanceCalled(TextField));
        // Check that Save button is enabled
        expectOnlyPassedProps(StyledButton, {
          disabled: false
        }, getLastInstanceCalled(StyledButton) - 1);
        done();
      });

      test("calling onBlur for text fields should not trigger the error logic", done => {
        renderComponent(dialListTableState);
        act(() => {
          // Transfer Number input
          getMockedComponentProps(ModalPhoneNumber, getLastInstanceCalled(ModalPhoneNumber)).onBlur();
        });
        act(() => {
          // Friendly Name input
          getMockedComponentProps(TextField, getLastInstanceCalled(TextField) - 1).onBlur();
        });
        // Transfer Number input for contact_num
        expectOnlyPassedProps(ModalPhoneNumber, {
          error: false,
          helperText: null,
          number: contact_num,
          showError: true
        }, getLastInstanceCalled(ModalPhoneNumber));
        // Friendly Name input for contact_nme
        expectOnlyPassedProps(TextField, {
          error: false,
          helperText: null,
          value: contact_nme
        }, getLastInstanceCalled(TextField) - 1);
        done();
      });
    });

    describe("dialListTableState.dialListEntryFormInitialValues does not include intial values", () => {
      const dialListTableState = {
        dialListId,
        dialListEntryFormInitialValues: {},
        dialListEntryFormMode,
        otherContactNums
      };

      describe("service call to update dial list entry succeeds", () => {

        beforeEach(() => {
          axiosMock.onPut(apiPaths.DIAL_LIST_ENTRY(dialListId)).reply(200, { who: "cares?" });
        });

        test("submit button should be disabled then entering valid values in all the required fields should enable the submit button and show success overlay on click", async () => {
          expect(apiPaths.DIAL_LIST_ENTRY(dialListId)).toBe("butts");
          const rendered = renderComponent(dialListTableState);
          // Check that Save button is disabled
          expectOnlyPassedProps(StyledButton, {
            disabled: true
          }, getLastInstanceCalled(StyledButton) - 1);

          const updatedMaskedNumber = "(603) 888 1234";
          const updatedUnmaskedNumber = "6038881234";
          const updatedContactNme = "New Name!!!";
          const updatedExternalNum = "1-800-again nobody cares";

          act(() => {
            // Transfer Number input update
            getMockedComponentProps(ModalPhoneNumber, getLastInstanceCalled(ModalPhoneNumber))
              .updateValue(updatedMaskedNumber, updatedUnmaskedNumber, true);
          });
          act(() => {
            // Friendly Name input update
            getMockedComponentProps(TextField, getLastInstanceCalled(TextField) - 1).onChange({
              target: {
                value: updatedContactNme
              }
            });
          });
          act(() => {
            // External Num input update
            getMockedComponentProps(TextField, getLastInstanceCalled(TextField)).onChange({
              target: {
                value: updatedExternalNum
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
            expect(axiosMock.history.put[0].data).toBe(JSON.stringify({
              contact_nme: updatedContactNme,
              contact_num: updatedUnmaskedNumber,
              external_num: updatedExternalNum
            }));
            expectMockedComponent(rendered, { StatusOverlay });
            // First call of StatusOverlay displays pending status
            expectOnlyPassedProps(StatusOverlay, {
              message: "Updating dial list entry...",
              status: statusOverlayStatuses.SAVING
            }, getLastInstanceCalled(StatusOverlay) - 1);
            // Second call of StatusOverlay displays success message
            expectOnlyPassedProps(StatusOverlay, {
              message: "Successfully updated dial list entry",
              status: statusOverlayStatuses.SUCCESS
            }, getLastInstanceCalled(StatusOverlay));
            expect(refreshProfileData).toHaveBeenCalledTimes(1);
          });
          // Run timers so get rid of StatusOverlay
          act(() => {
            jest.advanceTimersByTime(statusOverlayTimeout);
          });
          await waitFor(() => {
            // Form is closed
            expect(setDialListTableState).toHaveBeenCalledWith({
              ...dialListTableState,
              isDialListEntryFormOpen: false
            });
          });
        });
      });

      describe("service call to update dial list entry fails", () => {

        beforeEach(() => {
          axiosMock.onPut(apiPaths.DIAL_LIST_ENTRY(dialListId)).reply(500, { who: "cares? but this is bad wahhhh" });
        });

        test("submit button should be disabled then entering valid values in all the required fields should enable the submit button and show failure overlay on click", async () => {
          const rendered = renderComponent(dialListTableState);
          // Check that Save button is disabled
          expectOnlyPassedProps(StyledButton, {
            disabled: true
          }, getLastInstanceCalled(StyledButton) - 1);

          const updatedMaskedNumber = "(603) 888 1234";
          const updatedUnmaskedNumber = "6038881234";
          const updatedContactNme = "New Name!!!";

          act(() => {
            // Transfer Number input update
            getMockedComponentProps(ModalPhoneNumber, getLastInstanceCalled(ModalPhoneNumber))
              .updateValue(updatedMaskedNumber, updatedUnmaskedNumber, true);
          });
          act(() => {
            // Friendly Name input update
            getMockedComponentProps(TextField, getLastInstanceCalled(TextField) - 1).onChange({
              target: {
                value: updatedContactNme
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
            expectMockedComponent(rendered, { StatusOverlay });
            // First call of StatusOverlay displays pending status
            expectOnlyPassedProps(StatusOverlay, {
              message: "Updating dial list entry...",
              status: statusOverlayStatuses.SAVING
            }, getLastInstanceCalled(StatusOverlay) - 1);
            // Second call of StatusOverlay displays failure message
            expectOnlyPassedProps(StatusOverlay, {
              message: "Failed to update dial list entry",
              status: statusOverlayStatuses.FAIL
            }, getLastInstanceCalled(StatusOverlay));
            expect(refreshProfileData).toHaveBeenCalledTimes(0);
          });
          // Run timers so get rid of StatusOverlay
          act(() => {
            jest.advanceTimersByTime(statusOverlayTimeout);
          });
          await waitFor(() => {
            // Overlay is hidden
            expectMockedComponent(rendered, { StatusOverlay }, 0);
          });
        });
      });
    });
  });
});