import MessageBox from "../MessageBox";
import {
  ActionTypes,
  messageTypes
} from "../../ClosedFlashMessage.Interfaces";
import { TextField } from "../../ClosedFlashMessage.Styles";
import React from "react";
import {
  act,
  render,
  setupMockedComponents
} from "testUtils";

jest.mock("../../ClosedFlashMessage.Styles", () => ({
  MessageBoxWrapper: jest.requireActual("../../ClosedFlashMessage.Styles").ActionBarWrapper,
  TextField: jest.fn()
}));

const mockSetText = jest.fn();

const renderComponent = (tableState, action, checked, messageType) => {
  render(<MessageBox
    text={"Render Text"}
    setText={mockSetText}
    tableState = {tableState ? tableState : { selected: null }}
    action={action ? action : ActionTypes.VIEW}
    checked={checked ? checked : []}
    messageType={messageType ? messageType : messageTypes.CLOSED}
  />);
};

describe("<MessageBox />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setupMockedComponents({
      TextField
    });
  });

  describe("initial render", () => {
    describe("action does not equal view && isMultiChecked === true", () => {
      test("text should be set to empty string", () => {
        renderComponent(null, ActionTypes.EDIT, ["anything", "another"]);
        expect(mockSetText).toHaveBeenCalledTimes(1);
        expect(mockSetText).toHaveBeenCalledWith("");
      });
    });
    describe("tableState.selected === true", () => {
      const tableState = {
        selected: {
          closedMessage: "I'm closed!",
          flashMessage: "FLASH DANCE"
        }
      };
      describe("variable === closedMessage", () => {
        test("text is set to closed message on tablestate.selected", () => {
          renderComponent(tableState);
          expect(mockSetText).toHaveBeenCalledTimes(1);
          expect(mockSetText).toHaveBeenCalledWith("I'm closed!");
        });
      });
      describe("variable === flashMessage", () => {
        test("text is set to flash message on tablestate.selected", () => {
          renderComponent(tableState, null, null, messageTypes.FLASH);
          expect(mockSetText).toHaveBeenCalledTimes(1);
          expect(mockSetText).toHaveBeenCalledWith("FLASH DANCE");
        });
      });
      describe("variable is not defined", () => {
        test("text is set to empty string", () => {
          renderComponent({ selected: {}}, null, null, messageTypes.FLASH);
          expect(mockSetText).toHaveBeenCalledTimes(1);
          expect(mockSetText).toHaveBeenCalledWith("");
        });
      });
    });
    describe("tableState.selected === false && action === view", () => {
      test("text is set to an empty string", () => {
        renderComponent();
        expect(mockSetText).toHaveBeenCalledTimes(1);
        expect(mockSetText).toHaveBeenCalledWith("");
      });
    });
    describe("onChange is called", () => {
      test("setText is called with new value", () => {
        renderComponent();
        const onChange = TextField.mock.calls[0][0].onChange;
        act(() => {
          onChange({
            target: {
              value: "new text"
            }
          });
        });
        expect(mockSetText).toHaveBeenCalledTimes(2);
        expect(mockSetText).toHaveBeenCalledWith("new text");
      });
    });
  });
});