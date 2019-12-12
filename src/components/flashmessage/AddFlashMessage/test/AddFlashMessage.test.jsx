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

const mockSetFMState = jest.fn();

const initialMockedFMState = {
  fetching: false,
  flashMessage: "",
  readOnly: false
};

const initialAdminState = {
  ...initialState,
  userContext: {
    pingIdentity: {
      sub: "n0345678"
    }
  }
};

const renderComponent = flashMessageState => {
  return render(<AddFlashMessage
    flashMessageState={flashMessageState}
    setFlashMessageState={mockSetFMState} />, initialAdminState);
};

describe("<AddFlashMessage />", () => {

  beforeEach(() => {
    axiosMock.reset();
    mockSetFMState.mockClear();
  });

  describe("initial state", () => {
    test("Should render input with value of empty string & charCount of 0; should NOT render special character warning; button should be disabled", () => {
      const rendered = renderComponent(initialMockedFMState);
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
      const rendered = renderComponent(initialMockedFMState);
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
    const validMessageState = {
      ...initialMockedFMState,
      flashMessage: validMessage
    };
    test("should call mockSetFMState with valid flash message", () => {
      window.confirm = jest.fn();
      const rendered = renderComponent(initialMockedFMState);
      const input = rendered.getByTestId("add-message-input");
      act(() => fireEvent.change(input, { target: { value: validMessage }}));
      expect(rendered.container).not.toHaveTextContent("Special characters are not allowed");
      expect(mockSetFMState).toHaveBeenCalledWith(validMessageState);
    });
    test("button should be enabled; when submit button is clicked should display confirmation alert", () => {
      const rendered = renderComponent(validMessageState);
      const button = rendered.getByText(/Add Message/);
      expect(button).not.toBeDisabled();
      act(() => fireEvent.click(button));
      expect(window.confirm).toHaveBeenCalledTimes(1);
      expect(window.confirm).toHaveBeenCalledWith("Are you sure you want to create this flash message?");
    });

    describe("when add message is confirmed", () => {
      beforeEach(() => window.confirm = () => true);
      describe("post to updateflashmessage is successful", () => {
        beforeEach(() => axiosMock.onPost(apiPaths.UPDATE_FLASH_MESSAGE).reply(200, "it worked"));
        test("should call mockSetFMState with fetching = false and readOnly = true", done => {
          const rendered = renderComponent(validMessageState);
          const button = rendered.getByText(/Add Message/);
          act(() => {
            fireEvent.click(button);
            return Promise.resolve();
          })
            .then(() => {
              expect(mockSetFMState).toHaveBeenCalledTimes(2);
              expect(mockSetFMState).toHaveBeenCalledWith({
                ...validMessageState,
                fetching: false,
                readOnly: true
              });
              done();
            });
        });
      });
      describe("post to updateflashmessage fails", () => {
        beforeEach(() => axiosMock.onPost(apiPaths.UPDATE_FLASH_MESSAGE).reply(500, "oh no! it failed"));
        test("should call mockSetFMState with fetching = false and service call error", done => {
          const rendered = renderComponent(validMessageState);
          const button = rendered.getByText(/Add Message/);
          act(() => {
            fireEvent.click(button);
            return Promise.resolve();
          })
            .then(() => {
              expect(mockSetFMState).toHaveBeenCalledTimes(2);
              expect(mockSetFMState).toHaveBeenCalledWith({
                ...validMessageState,
                fetching: false,
                serviceCallError: "Failed to upload flash message. Please try again or submit a request via"
              });
              done();
            });
        });
      });
    });

    describe("when add message is not confirmed", () => {
      beforeEach(() => window.confirm = () => false);
      test("should remain on editable component", done => {
        const rendered = renderComponent(validMessageState);
        const button = rendered.getByText(/Add Message/);
        act(() => {
          fireEvent.click(button);
          return Promise.resolve();
        })
          .then(() => {
            expect(mockSetFMState).not.toHaveBeenCalled();
            done();
          });
      });
    });
  });
});