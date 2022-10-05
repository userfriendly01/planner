import ActionContainer from "../ActionContainer";
import {
  Dropdown,
  MessageContainer
} from "components";
import React from "react";
import {
  act,
  expectOnlyPassedProps,
  render,
  setupMockedComponents,
  waitfor
} from "testUtils";
import { propertyOptions } from "../../Skills.Interfaces";
import {
  ActionTypes,
  messageTypes
} from "../../../";

jest.mock("components", () => ({
  Dropdown: jest.fn(),
  MessageContainer: jest.fn(),
  StyledButton: jest.fn()
}));

const confirmationModalOpts = "opts";
const messageType = {
  name: "Closed"
};
const tableState = "state";
const setConfirmationModalOpts = jest.fn();
const setSaveResult = jest.fn();

const renderComponent = () => {
  render(<ActionContainer
    confirmationModalOpts={confirmationModalOpts}
    messageType={messageType}
    tableState={tableState}
    setConfirmationModalOpts={setConfirmationModalOpts}
    setSaveResult={setSaveResult}
  />);
};

describe("<ActionContainer/>", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setupMockedComponents({
      Dropdown,
      MessageContainer
    });
  });
  describe("initial render", () => {
    describe("propertySelection.label === propertyOptions.CLOSED_MESSAGE.label", () => {
      test("should render Closed Message View", () => {
        renderComponent();
        expect(Dropdown.mock.calls.length).toBe(2);
        expectOnlyPassedProps(Dropdown, {
          label: "What are you changing?",
          value: propertyOptions.CLOSED_MESSAGE,
          options: [
            propertyOptions.CLOSED_MESSAGE,
            propertyOptions.FLASH_MESSAGE
          ]
        }, 0);
        expectOnlyPassedProps(MessageContainer, {
          messageType: messageTypes.CLOSED
        }, 0);
      });
    });
  });
  describe("Property Dropdown Value is updated", () => {
    describe("propertySelection.label === propertyOptions.FLASH_MESSAGE.label", () => {
      test("should render Flash Message View", () => {
        renderComponent();
        const updateProperty = Dropdown.mock.calls[0][0].updateValue;
        act(() => {
          updateProperty(null, propertyOptions.FLASH_MESSAGE);
        });
        expect(Dropdown.mock.calls.length).toBe(4);
        expect(Dropdown.mock.calls[2][0].value).toBe(propertyOptions.FLASH_MESSAGE);
        expect(Dropdown.mock.calls[3][0].options).toBe(propertyOptions.FLASH_MESSAGE.actions);
        expect(MessageContainer.mock.calls.length).toBe(2);
        expectOnlyPassedProps(MessageContainer, {
          messageType: messageTypes.FLASH
        }, 1);
      });
    });
    describe("propertySelection.label === undefined option", () => {
      test("should render no view", () => {
        renderComponent();
        const updateProperty = Dropdown.mock.calls[0][0].updateValue;
        act(() => {
          updateProperty(null, { label: "Unknown Value" });
        });
        expect(Dropdown.mock.calls.length).toBe(4);
        expect(MessageContainer.mock.calls.length).toBe(1);
      });
    });
    describe("Action is defined", () => {
      test.only("action should be reset", () => {
        renderComponent();
        const updateAction = Dropdown.mock.calls[1][0].updateValue;
        const updateProperty = Dropdown.mock.calls[0][0].updateValue;
        act(() => {
          updateAction(null, ActionTypes.EDIT);
          updateProperty(null, propertyOptions.FLASH_MESSAGE);
        });
        // act(() => {
        //   updateProperty(null, propertyOptions.FLASH_MESSAGE);
        // });
        // expect(Dropdown.mock.calls.length).toBe(4);
        // expect(Dropdown.mock.calls[3][0]).toBe("butts");
        // expect(Dropdown.mock.calls[4][0].value).toBe(propertyOptions.FLASH_MESSAGE);
        // expect(Dropdown.mock.calls[5][0].value).toBe(null);
        // expect(Dropdown.mock.calls[5][0].options).toBe(propertyOptions.FLASH_MESSAGE.actions);
      });
    });
  });
});