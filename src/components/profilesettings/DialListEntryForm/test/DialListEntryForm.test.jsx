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
  ModalOverlay,
  StyledButton
} from "components";
import {
  apiPaths,
  formModes,
  modalOverlayStatuses,
  modalOverlayTimeout
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
  ModalOverlay: jest.fn(),
  StyledButton: jest.fn()
}));

const axiosMock = new MockAdapter(myAxios);

const dialListId = 892;
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

  describe("form is in UPDATE mode", () => {
    const dialListEntryFormMode = formModes.UPDATE;

    describe("dialListTableState.dialListEntryFormInitialValues includes initial values for all fields", () => {
      const contact_nme = "Some Contact";
      const contact_num = "8006665555";
      const external_num = "1-800-whatever";
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
            expectMockedComponent(rendered, { ModalOverlay });
            // First call of ModalOverlay displays pending status
            expectOnlyPassedProps(ModalOverlay, {
              message: "Updating dial list entry...",
              status: modalOverlayStatuses.SAVING
            }, getLastInstanceCalled(ModalOverlay) - 1);
            // Second call of ModalOverlay displays success message
            expectOnlyPassedProps(ModalOverlay, {
              message: "Successfully updated dial list entry",
              status: modalOverlayStatuses.SUCCESS
            }, getLastInstanceCalled(ModalOverlay));
            expect(refreshProfileData).toHaveBeenCalledTimes(1);
          });
          // Run timers so get rid of ModalOverlay
          act(() => {
            jest.advanceTimersByTime(modalOverlayTimeout);
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
            expectMockedComponent(rendered, { ModalOverlay });
            // First call of ModalOverlay displays pending status
            expectOnlyPassedProps(ModalOverlay, {
              message: "Updating dial list entry...",
              status: modalOverlayStatuses.SAVING
            }, getLastInstanceCalled(ModalOverlay) - 1);
            // Second call of ModalOverlay displays failure message
            expectOnlyPassedProps(ModalOverlay, {
              message: "Failed to update dial list entry",
              status: modalOverlayStatuses.FAIL
            }, getLastInstanceCalled(ModalOverlay));
            expect(refreshProfileData).toHaveBeenCalledTimes(0);
          });
          // Run timers so get rid of ModalOverlay
          act(() => {
            jest.advanceTimersByTime(modalOverlayTimeout);
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