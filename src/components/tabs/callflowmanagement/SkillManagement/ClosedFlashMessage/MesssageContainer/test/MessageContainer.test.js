import MessageContainer from "../MessageContainer";
import { SaveButton } from "components";
import React from "react";
import {
  expectOnlyPassedProps,
  render,
  setupMockedComponents
} from "testUtils";
import { TextField } from "../../";
import { ActionTypes } from "../../../";

jest.mock("components", () => ({
  MessageBox: jest.fn(),
  SaveButton: jest.fn(),
  StyledButton: jest.fn()
}));

jest.mock("../../", () => ({
  MessageContainerProps: jest.requireActual("../../").MessageContainerProps,
  MessageContainerWrapper: jest.requireActual("../../").MessageContainerWrapper,
  MessageBoxWrapper: jest.requireActual("../../").MessageBoxWrapper,
  TextField: jest.fn()
}));

const props = {
  confirmationModalOpts: "opts",
  messageType: {
    name: "closed"
  },
  tableState: {
    selected: []
  },
  setConfirmationModalOpts: jest.fn(),
  setSaveResult: jest.fn(),
  setTableState: jest.fn(),
  setAction: jest.fn()
};

describe("<ActionContainer/>", () => {
  beforeEach(() => {
    setupMockedComponents({
      TextField,
      SaveButton
    });
  });
  describe("initial render", () => {
    test("should render as expected", () => {
      render(<MessageContainer
        action={ActionTypes.EDIT}
        confirmationModalOpts={props.confirmationModalOpts}
        messageType={props.messageType}
        tableState={props.tableState}
        setAction={props.setAction}
        setTableState={props.setTableState}
        setConfirmationModalOpts={props.setConfirmationModalOpts}
        setSaveResult={props.setSaveResult}
      />);
      expectOnlyPassedProps(SaveButton, {
        action: ActionTypes.EDIT,
        confirmationModalOpts: props.confirmationModalOpts,
        setSaveResult: props.setSaveResult,
        setConfirmationModalOpts: props.setConfirmationModalOpts,
        messageType: props.messageType,
        text: ""
      });
    });
  });
});