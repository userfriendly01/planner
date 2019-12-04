import AddFlashMessage from "../AddFlashMessage";
import { initialState } from "context";
import React from "react";
import {
  fireEvent,
  render
} from "testUtils";

describe("<AddFlashMessage />", () => {

  const initialTestState = {
    ...initialState,
    charCount: 0,
    validMessage: false
  };

  const mockToggleReadOnly = jest.fn();

  beforeEach(() => {
    mockToggleReadOnly.mockClear();
  });

  describe("initial state", () => {
    const state = initialTestState;
    test("Should render input with value of empty string & charCount of 0; should NOT render special character warning; button should be disabled", () => {
      const rendered = render(<AddFlashMessage />, state);
      const button = rendered.getByText(/Add Message/);
      const input = rendered.getByTestId("add-message-input");
      expect(input.value).toBe("");
      expect(rendered.container).toHaveTextContent("Characters: 0 / 1024");
      expect(rendered.container).not.toHaveTextContent("Special characters are not allowed");
      expect(button).toBeDisabled();
    });
  });

  describe("invalid character is entered into the form", () => {
    test("should display special character warning and button should be disabled", () => {
      const rendered = render(<AddFlashMessage />, initialTestState);
      const input = rendered.getByTestId("add-message-input");
      const button = rendered.getByText(/Add Message/);
      fireEvent.change(input, { target: { value: "I contain special characters such as < ' > &" }});
      expect(rendered.container).toHaveTextContent("Characters: 44 / 1024");
      expect(rendered.container).toHaveTextContent("Special characters are not allowed");
      expect(button).toBeDisabled();
    });
  });

  describe("valid message is entered", () => {
    const validMessage = "Hello! My name is Valid Message.";
    test("button should be enabled; when submit button is clicked should display confirmation alert", () => {
      window.confirm = jest.fn();
      const rendered = render(<AddFlashMessage />, initialTestState);
      const input = rendered.getByTestId("add-message-input");
      const button = rendered.getByText(/Add Message/);
      fireEvent.change(input, { target: { value: validMessage }});
      expect(rendered.container).not.toHaveTextContent("Special characters are not allowed");
      expect(button).not.toBeDisabled();
      fireEvent.click(button);
      expect(window.confirm).toHaveBeenCalledTimes(1);
      expect(window.confirm).toHaveBeenCalledWith("Are you sure you want to create this flash message?");
    });
    describe("when add message is confirmed", () => {
      test("should toggle read only to true", () => {
        window.confirm = jest.fn(() => true);
        const rendered = render(<AddFlashMessage toggleReadOnly={mockToggleReadOnly} />, initialTestState);
        const input = rendered.getByTestId("add-message-input");
        const button = rendered.getByText(/Add Message/);
        fireEvent.change(input, { target: { value: validMessage }});
        fireEvent.click(button);
        expect(mockToggleReadOnly).toHaveBeenCalledTimes(1);
        expect(mockToggleReadOnly).toHaveBeenCalledWith(true);
      });
    });
    describe("when add message is not confirmed", () => {
      test("should not toggle read only", () => {
        window.confirm = jest.fn(() => false);
        const rendered = render(<AddFlashMessage toggleReadOnly={mockToggleReadOnly} />, initialTestState);
        const input = rendered.getByTestId("add-message-input");
        const button = rendered.getByText(/Add Message/);
        fireEvent.change(input, { target: { value: validMessage }});
        fireEvent.click(button);
        expect(mockToggleReadOnly).not.toHaveBeenCalled();
      });
    });
  });
});