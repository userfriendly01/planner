import AddFlashMessage from "../AddFlashMessage";
import { StyledButton } from "components";
import { initialState } from "context";
import React from "react";
import {
  // act,
  expectMockedComponent,
  expectOnlyPassedProps,
  // getTestState,
  render,
  setupMockedComponents
} from "testUtils";

jest.mock("components", () => ({
  __esModule: true,
  StyledButton: jest.fn()
}));

describe("<AddFlashMessage />", () => {

  const initialTestState = {
    ...initialState,
    charCount: 0,
    validMessage: false
  };

  beforeEach(() => {
    setupMockedComponents({ StyledButton });
  });

  describe("initial state", () => {
    const state = initialTestState;
    test("Should render input with value of empty string & charCount should be 0; should not render special character warning; button should be disabled", () => {
      const rendered = render(<AddFlashMessage />, state);
      expect(state.flashMessage).toBe("");
      expect(state.charCount).toBe(0);
      expect(rendered.container).not.toHaveTextContent("Special characters are not allowed");
      expectMockedComponent(rendered, { StyledButton });
      expectOnlyPassedProps(StyledButton, { disabled: true });
    });
  });

  describe("invalid character is entered into the form", () => {
    const state = {
      ...initialTestState,
      flashMessage: "I contain special characters such as < ' > &"
    };
    test("should display special character warning and button should be disabled", () => {
      const rendered = render(<AddFlashMessage />, state);
      expect(state.validMessage).toBe(false);
      expect(rendered.container).toHaveTextContent("Special characters are not allowed");
    });
  });

  describe("valid message is entered", () => {
    test("button should be enabled", () => {
      //
    });
    test("when submit button is clicked, should display confirmation alert", () => {
      //
    });
  });

});