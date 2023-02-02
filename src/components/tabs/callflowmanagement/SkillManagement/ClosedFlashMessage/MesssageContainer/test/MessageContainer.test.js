import MessageContainer from "../MessageContainer";
import { SaveButton } from "components";
import React from "react";
import {
  act,
  expectOnlyPassedProps,
  render,
  setupMockedComponents,
  skillsList
} from "testUtils";
import { TextField } from "../../ClosedFlashMessage.Styles";
import { messageTypes } from "../../ClosedFlashMessage.Interfaces";
import { ActionTypes } from "../../../Skills.Interfaces";

jest.mock("components", () => ({
  MessageBox: jest.fn(),
  SaveButton: jest.fn(),
  StyledButton: jest.fn()
}));


jest.mock("../../ClosedFlashMessage.Styles", () => ({
  MessageContainerWrapper: jest.requireActual("../../ClosedFlashMessage.Styles").MessageContainerWrapper,
  MessageBoxWrapper: jest.requireActual("../../ClosedFlashMessage.Styles").MessageBoxWrapper,
  TextField: jest.fn()
}));

const confirmationModalOpts = "opts";
const messageType = messageTypes.CLOSED;
const setConfirmationModalOpts = jest.fn();
const setSaveResult = jest.fn();
const setTableState = jest.fn();
const setAction = jest.fn();

const renderComponent = tableState => {
  render(<MessageContainer
    action={ActionTypes.EDIT}
    confirmationModalOpts={confirmationModalOpts}
    messageType={messageType}
    tableState={tableState}
    setAction={setAction}
    setTableState={setTableState}
    setConfirmationModalOpts={setConfirmationModalOpts}
    setSaveResult={setSaveResult}
  />);
};

describe("<MessageContainer/>", () => {
  beforeEach(() => {
    setupMockedComponents({
      TextField,
      SaveButton
    });
  });
  describe("initial render", () => {
    describe("selected length === 0", () => {
      const tableState = {
        selected: []
      };
      test("should render as expected, text should be empty string", () => {
        renderComponent(tableState);
        expectOnlyPassedProps(TextField, {
          value: ""
        });
        expectOnlyPassedProps(SaveButton, {
          action: ActionTypes.EDIT,
          confirmationModalOpts: confirmationModalOpts,
          setSaveResult: setSaveResult,
          setConfirmationModalOpts: setConfirmationModalOpts,
          messageType: messageType,
          text: ""
        });
      });
    });
    describe("selected length > 1", () => {
      const tableState = {
        selected: skillsList
      };
      test("should render as expected, text should be empty string", () => {
        renderComponent(tableState);
        expectOnlyPassedProps(TextField, {
          value: ""
        });
        expectOnlyPassedProps(SaveButton, {
          action: ActionTypes.EDIT,
          confirmationModalOpts: confirmationModalOpts,
          setSaveResult: setSaveResult,
          setConfirmationModalOpts: setConfirmationModalOpts,
          messageType: messageType,
          text: ""
        });
      });
    });
    describe("selected length === 1", () => {
      const tableState = {
        selected: [skillsList[1]]
      };
      test("should render as expected, text should be closedMessage", () => {
        renderComponent(tableState);
        expectOnlyPassedProps(TextField, {
          value: "Sorry, we're closed."
        });
        expectOnlyPassedProps(SaveButton, {
          action: ActionTypes.EDIT,
          confirmationModalOpts: confirmationModalOpts,
          setSaveResult: setSaveResult,
          setConfirmationModalOpts: setConfirmationModalOpts,
          messageType: messageType,
          text: "Sorry, we're closed."
        });
      });
      test("should render as expected, text should be empty string if variable is not defined", () => {
        delete tableState.selected[0].closedMessage;
        renderComponent(tableState);
        expectOnlyPassedProps(TextField, {
          value: ""
        });
        expectOnlyPassedProps(SaveButton, {
          action: ActionTypes.EDIT,
          confirmationModalOpts: confirmationModalOpts,
          setSaveResult: setSaveResult,
          setConfirmationModalOpts: setConfirmationModalOpts,
          messageType: messageType,
          text: ""
        });
      });
    });
  });
  describe("TextField onChange is called", () => {
    const tableState = {
      selected: []
    };
    test("should render as expected, text should be empty string", () => {
      renderComponent(tableState);
      const onChange = TextField.mock.calls[0][0].onChange;
      const newValue = "New Closed message!";
      act(() => {
        onChange({
          target: {
            value: newValue
          }
        });
      });
      expect(TextField.mock.calls.length).toBe(2);
      expect(TextField.mock.calls[1][0].value).toBe(newValue);
    });
  });
});