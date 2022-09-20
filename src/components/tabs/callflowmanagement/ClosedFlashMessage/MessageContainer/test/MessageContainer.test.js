import MessageContainer from "../MessageContainer";
import {
  ActionBar,
  MessageBox,
  SaveButton
} from "components";
import React from "react";
import {
  expectOnlyPassedProps,
  render,
  setupMockedComponents
} from "testUtils";
import { ActionTypes } from "../../ClosedFlashMessage.Interfaces";

jest.mock("components", () => ({
  ActionBar: jest.fn(),
  MessageBox: jest.fn(),
  SaveButton: jest.fn(),
  StyledButton: jest.fn()
}));

const props = {
  checked: "checked",
  confirmationModalOpts: "opts",
  messageType: {
    name: "closed"
  },
  tableState: "state",
  setChecked: jest.fn(),
  setConfirmationModalOpts: jest.fn(),
  setSaveResult: jest.fn()
};

describe("<MessageContainer/>", () => {
  beforeEach(() => {
    setupMockedComponents({
      ActionBar,
      MessageBox,
      SaveButton
    });
  });
  describe("initial render", () => {
    test("should render as expected", () => {
      const rendered = render(<MessageContainer
        checked={props.checked}
        confirmationModalOpts={props.confirmationModalOpts}
        messageType={props.messageType}
        tableState={props.tableState}
        setChecked={props.setChecked}
        setConfirmationModalOpts={props.setConfirmationModalOpts}
        setSaveResult={props.setSaveResult}
      />);
      expect(rendered.container).toHaveTextContent(props.messageType.name);
      expectOnlyPassedProps(ActionBar, {
        action: ActionTypes.VIEW
      });
      expectOnlyPassedProps(MessageBox, {
        action: ActionTypes.VIEW,
        checked: props.checked,
        messageType: props.messageType,
        tableState: props.tableState,
        text: ""
      });
      expectOnlyPassedProps(SaveButton, {
        action: ActionTypes.VIEW,
        confirmationModalOpts: props.confirmationModalOpts,
        setSaveResult: props.setSaveResult,
        setConfirmationModalOpts: props.setConfirmationModalOpts,
        checked: props.checked,
        setChecked: props.setChecked,
        messageType: props.messageType,
        text: ""
      });
    });
  });
});