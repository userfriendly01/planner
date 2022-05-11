import AddMessage from "../AddMessage";
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

const mockSetMessageState = jest.fn();

const initialMockedState = {
  fetching: false,
  message: "",
  readOnly: false,
  skillData: {
    fetchInProgress: false,
    allSkills: null,
    retries: 3
  }
};

const initialAdminState = {
  ...initialState,
  userContext: {
    pingIdentity: {
      sub: "n0345678"
    }
  }
};

const renderComponent = messageState => {
  return render(<AddMessage
    messageState={messageState}
    setMessageState={mockSetMessageState} />, initialAdminState);
};

describe("<AddMessage />", () => {
  beforeEach(() => {
    axiosMock.reset();
    mockSetMessageState.mockClear();
  });
  describe("Flash Message", () => {
    const initialMockedFlashMessageState = {
      ...initialMockedState,
      messageType: "flash"
    };
    describe("initial state", () => {
      test("Should render input with value of empty string & charCount of 0; should NOT render special character warning; button should be disabled", () => {
        const rendered = renderComponent(initialMockedFlashMessageState);
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
        const rendered = renderComponent(initialMockedFlashMessageState);
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
        ...initialMockedFlashMessageState,
        message: validMessage
      };
      test("should not display special character warning", () => {
        window.confirm = jest.fn();
        const rendered = renderComponent(initialMockedFlashMessageState);
        const input = rendered.getByTestId("add-message-input");
        act(() => fireEvent.change(input, { target: { value: validMessage }}));
        expect(rendered.container).not.toHaveTextContent("Special characters are not allowed");
      });
      test("button should be enabled; when submit button is clicked should display confirmation alert", () => {
        const rendered = renderComponent(validMessageState);
        const button = rendered.getByText(/Add Message/);
        expect(button).not.toBeDisabled();
        act(() => fireEvent.click(button));
        expect(window.confirm).toHaveBeenCalledTimes(1);
        expect(window.confirm).toHaveBeenCalledWith("Are you sure you want to create this message?");
      });

      describe("when add message is confirmed", () => {
        beforeEach(() => window.confirm = () => true);
        describe("post to flashmessage is successful", () => {
          beforeEach(() => axiosMock.onPost(apiPaths.FLASH_MESSAGE).reply(200, "it worked"));
          test("should call mockSetFMState with fetching = false and readOnly = true", done => {
            const rendered = renderComponent(validMessageState);
            const button = rendered.getByText(/Add Message/);
            act(() => {
              fireEvent.click(button);
              return Promise.resolve();
            })
              .then(() => {
                expect(mockSetMessageState).toHaveBeenCalledTimes(2);
                expect(mockSetMessageState).toHaveBeenCalledWith({
                  ...validMessageState,
                  fetching: false,
                  readOnly: true
                });
                done();
              });
          });
        });
        describe("post to flashmessage fails", () => {
          beforeEach(() => axiosMock.onPost(apiPaths.FLASH_MESSAGE).reply(500, "oh no! it failed"));
          test("should call mockSetFMState with fetching = false and service call error", done => {
            const rendered = renderComponent(validMessageState);
            const button = rendered.getByText(/Add Message/);
            act(() => {
              fireEvent.click(button);
              return Promise.resolve();
            })
              .then(() => {
                expect(mockSetMessageState).toHaveBeenCalledTimes(2);
                expect(mockSetMessageState).toHaveBeenCalledWith({
                  ...validMessageState,
                  fetching: false,
                  serviceCallError: "Failed to upload message. Please try again or submit a request via"
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
              expect(mockSetMessageState).not.toHaveBeenCalled();
              done();
            });
        });
      });
    });
  });
  describe("Closed Message", () => {
    const initialMockedClosedMessageState = {
      ...initialMockedState,
      messageType: "closed"
    };
    describe("initial state", () => {
      test("Should render input with value of empty string & charCount of 0; should NOT render special character warning; button should be disabled", () => {
        const rendered = renderComponent(initialMockedClosedMessageState);
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
        const rendered = renderComponent(initialMockedClosedMessageState);
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
        ...initialMockedClosedMessageState,
        message: validMessage
      };
      test("should not display special character warning", () => {
        window.confirm = jest.fn();
        const rendered = renderComponent(initialMockedClosedMessageState);
        const input = rendered.getByTestId("add-message-input");
        act(() => fireEvent.change(input, { target: { value: validMessage }}));
        expect(rendered.container).not.toHaveTextContent("Special characters are not allowed");
      });
      test("button should be enabled; when submit button is clicked should display confirmation alert", () => {
        const rendered = renderComponent(validMessageState);
        const button = rendered.getByText(/Add Message/);
        expect(button).not.toBeDisabled();
        act(() => fireEvent.click(button));
        expect(window.confirm).toHaveBeenCalledTimes(1);
        expect(window.confirm).toHaveBeenCalledWith("Are you sure you want to create this message?");
      });

      describe("when add message is confirmed", () => {
        beforeEach(() => window.confirm = () => true);
        describe("post to closedmessage is successful", () => {
          beforeEach(() => axiosMock.onPost(apiPaths.CLOSED_MESSAGE).reply(200, "it worked"));
          test("should call mockSetFMState with fetching = false and readOnly = true", done => {
            const rendered = renderComponent(validMessageState);
            const button = rendered.getByText(/Add Message/);
            act(() => {
              fireEvent.click(button);
              return Promise.resolve();
            })
              .then(() => {
                expect(mockSetMessageState).toHaveBeenCalledTimes(2);
                expect(mockSetMessageState).toHaveBeenCalledWith({
                  ...validMessageState,
                  fetching: false,
                  readOnly: true
                });
                done();
              });
          });
        });
        describe("post to closedmessage fails", () => {
          beforeEach(() => axiosMock.onPost(apiPaths.CLOSED_MESSAGE).reply(500, "oh no! it failed"));
          test("should call mockSetMessageState with fetching = false and service call error", done => {
            const rendered = renderComponent(validMessageState);
            const button = rendered.getByText(/Add Message/);
            act(() => {
              fireEvent.click(button);
              return Promise.resolve();
            })
              .then(() => {
                expect(mockSetMessageState).toHaveBeenCalledTimes(2);
                expect(mockSetMessageState).toHaveBeenCalledWith({
                  ...validMessageState,
                  fetching: false,
                  serviceCallError: "Failed to upload message. Please try again or submit a request via"
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
              expect(mockSetMessageState).not.toHaveBeenCalled();
              done();
            });
        });
      });
    });
  });
});