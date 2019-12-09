import AddFlashMessage from "../AddFlashMessage";
import MockAdapter from "axios-mock-adapter";
import { initialState } from "context";
import { apiPaths } from "globals";
import React from "react";
import {
  act,
  fireEvent,
  render
} from "testUtils";
import { myAxios } from "utils";

const axiosMock = new MockAdapter(myAxios);
const mockToggleReadOnly = jest.fn();

const initialTestState = {
  ...initialState,
  charCount: 0,
  validMessage: false,
  userContext: {
    pingIdentity: {
      sub: "n0345678"
    }
  }
};

describe("<AddFlashMessage />", () => {

  beforeEach(() => {
    axiosMock.reset();
    mockToggleReadOnly.mockClear();
  });

  describe("initial state", () => {
    const state = initialTestState;
    test("Should render input with value of empty string & charCount of 0; should NOT render special character warning; button should be disabled", () => {
      const rendered = render(<AddFlashMessage />, state);
      const input = rendered.getByTestId("add-message-input");
      const button = rendered.getByText(/Add Message/);
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
      act(() => fireEvent.change(input, { target: { value: "I contain special characters such as < ' > &" }}));
      expect(rendered.container).toHaveTextContent("Characters: 44 / 1024");
      expect(rendered.container).toHaveTextContent("Special characters are not allowed");
      const button = rendered.getByText(/Add Message/);
      expect(button).toBeDisabled();
    });
  });

  describe("valid message is entered", () => {
    const validMessage = "Hello! My name is Valid Message.";
    test("button should be enabled; when submit button is clicked should display confirmation alert", () => {
      window.confirm = jest.fn();
      const rendered = render(<AddFlashMessage />, initialTestState);
      const input = rendered.getByTestId("add-message-input");
      act(() => fireEvent.change(input, { target: { value: validMessage }}));
      expect(rendered.container).not.toHaveTextContent("Special characters are not allowed");
      const button = rendered.getByText(/Add Message/);
      expect(button).not.toBeDisabled();
      act(() => fireEvent.click(button));
      expect(window.confirm).toHaveBeenCalledTimes(1);
      expect(window.confirm).toHaveBeenCalledWith("Are you sure you want to create this flash message?");
    });

    describe("when add message is confirmed", () => {
      beforeEach(() => window.confirm = () => true);

      describe("post to updateflashmessage is successful", () => {
        beforeEach(() => axiosMock.onPost(apiPaths.UPDATE_FLASH_MESSAGE).reply(200, { horaay: "it worked" }));
        test("should return ... and toggle read only to true", done => {
          const rendered = render(<AddFlashMessage toggleReadOnly={mockToggleReadOnly} />, initialTestState);
          const input = rendered.getByTestId("add-message-input");
          act(() => fireEvent.change(input, { target: { value: validMessage }}));
          const button = rendered.getByText(/Add Message/);
          act(() => {
            fireEvent.click(button);
            return Promise.resolve();
          })
            .then(() => {
              expect(mockToggleReadOnly).toHaveBeenCalledTimes(1);
              expect(mockToggleReadOnly).toHaveBeenCalledWith(true);
              // expect axios stuff
              done();
            });
        });
      });

      describe("post to updateflashmessage fails", () => {
        beforeEach(() => axiosMock.onPost(apiPaths.UPDATE_FLASH_MESSAGE).reply(500, { ohNo: "it failed" }));
        test("should return ... and toggle read only should remain false", () => {
          const rendered = render(<AddFlashMessage toggleReadOnly={mockToggleReadOnly} />, initialTestState);
          const input = rendered.getByTestId("add-message-input");
          act(() => fireEvent.change(input, { target: { value: validMessage }}));
          const button = rendered.getByText(/Add Message/);
          act(() => fireEvent.click(button));
          expect(mockToggleReadOnly).not.toHaveBeenCalled();
          // expect axios stuff
        });
      });

    });
    describe("when add message is not confirmed", () => {
      beforeEach(() => window.confirm = () => false);
      test("should not toggle read only", () => {
        const rendered = render(<AddFlashMessage toggleReadOnly={mockToggleReadOnly} />, initialTestState);
        const input = rendered.getByTestId("add-message-input");
        act(() => fireEvent.change(input, { target: { value: validMessage }}));
        const button = rendered.getByText(/Add Message/);
        act(() => fireEvent.click(button));
        expect(mockToggleReadOnly).not.toHaveBeenCalled();
      });
    });
  });
});