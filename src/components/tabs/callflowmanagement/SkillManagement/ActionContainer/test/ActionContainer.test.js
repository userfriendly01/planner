import ActionContainer from "../ActionContainer";
import {
  Dropdown,
  MessageContainer
} from "components";
import React from "react";
import {
  expectOnlyPassedProps,
  render,
  setupMockedComponents
} from "testUtils";
import { ActionTypes } from "../../../";

jest.mock("components", () => ({
  Dropdown: jest.fn(),
  MessageContainer: jest.fn(),
  StyledButton: jest.fn()
}));

const props = {
  confirmationModalOpts: "opts",
  messageType: {
    name: "Closed"
  },
  tableState: "state",
  setConfirmationModalOpts: jest.fn(),
  setSaveResult: jest.fn()
};

describe("<ActionContainer/>", () => {
  beforeEach(() => {
    setupMockedComponents({
      Dropdown,
      MessageContainer
    });
  });
  describe("initial render", () => {
    test("should render as expected", () => {
      render(<ActionContainer
        confirmationModalOpts={props.confirmationModalOpts}
        messageType={props.messageType}
        tableState={props.tableState}
        setConfirmationModalOpts={props.setConfirmationModalOpts}
        setSaveResult={props.setSaveResult}
      />);
    });
  });
});