import ViewMessage from "../ViewMessage";
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

const renderComponent = messageState => {
  return render(<ViewMessage
    messageState={messageState}
    setMessageState={mockSetMessageState} />, initialAdminState);
};

describe("<ViewMessage />", () => {
  beforeEach(() => mockSetMessageState.mockClear());
  describe("Flash Message", () => {
    const initialMockedFlashMessageState = {
      ...initialMockedState,
      messageType: "flash"
    };
    describe("initial state", () => {
      test("should render an empty textfield with two buttons.", () => {
        const rendered = renderComponent(initialMockedFlashMessageState);
        expect(rendered.getByTitle("Edit")).toBeTruthy();
        expect(rendered.getByTitle("Delete")).toBeTruthy();
      });
    });
    describe("valid message exists", () => {
      const validMessageState = {
        ...initialMockedFlashMessageState,
        message: "Sample Flash Message"
      };
      test("should render the message.", () => {
        const rendered = renderComponent(validMessageState);
        expect(rendered.getByText("Sample Flash Message")).toBeTruthy();
      });
      test("clicking the edit button should toggle the readonly state to false.", () => {
        const rendered = renderComponent(validMessageState);
        fireEvent.click(rendered.getByTitle("Edit"));
        expect(mockSetMessageState).toHaveBeenCalledTimes(1);
        expect(mockSetMessageState).toHaveBeenCalledWith({
          ...validMessageState,
          readOnly: false
        });
      });
      describe("view message is confirmed", () => {
        beforeEach(() => window.confirm = () => true);
        describe("post to updateflashmessage is successful", () => {
          beforeEach(() => axiosMock.onPost(apiPaths.FLASH_MESSAGE).reply(200, "delete successful"));
          test("should set flash message to empty string and toggl read only to false", done => {
            const rendered = renderComponent(validMessageState);
            const button = rendered.getByTitle("Delete");
            act(() => {
              fireEvent.click(button);
              return Promise.resolve();
            })
              .then(() => {
                expect(mockSetMessageState).toHaveBeenCalledTimes(2);
                expect(mockSetMessageState).toHaveBeenCalledWith({
                  fetching: false,
                  message: "",
                  messageType: "flash",
                  readOnly: false,
                  skillData: { "allSkills": null }
                });
                done();
              });
          });
        });
        describe("post to updateflashmessage fails", () => {
          beforeEach(() => axiosMock.onPost(apiPaths.FLASH_MESSAGE).reply(500, "awww, delete failed"));
          test("should display error", done => {
            const rendered = renderComponent(validMessageState);
            const button = rendered.getByTitle("Delete");
            act(() => {
              fireEvent.click(button);
              return Promise.resolve();
            })
              .then(() => {
                expect(mockSetMessageState).toHaveBeenCalledTimes(2);
                expect(mockSetMessageState).toHaveBeenCalledWith({
                  ...validMessageState,
                  fetching: false,
                  serviceCallError: "Failed to delete message. Please try again or submit a request via"
                });
                done();
              });
          });
        });
      });
      describe("view message is not confirmed", () => {
        test("if they select no we should do nothing.", () => {
          window.confirm = jest.fn(() => false);
          const rendered = renderComponent(validMessageState);
          act(() => fireEvent.click(rendered.getByTitle("Delete")));
          expect(mockSetMessageState).toHaveBeenCalledTimes(0);
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
      test("should render an empty textfield with two buttons.", () => {
        const rendered = renderComponent(initialMockedClosedMessageState);
        expect(rendered.getByTitle("Edit")).toBeTruthy();
        expect(rendered.getByTitle("Delete")).toBeTruthy();
      });
    });
    describe("valid message exists", () => {
      const validMessageState = {
        ...initialMockedClosedMessageState,
        message: "Stuff be down, enjoy the free time",
        messageType: "closed"
      };
      test("should render the message.", () => {
        const rendered = renderComponent(validMessageState);
        expect(rendered.getByText("Stuff be down, enjoy the free time")).toBeTruthy();
      });
      test("clicking the edit button should toggle the readonly state to false.", () => {
        const rendered = renderComponent(validMessageState);
        fireEvent.click(rendered.getByTitle("Edit"));
        expect(mockSetMessageState).toHaveBeenCalledTimes(1);
        expect(mockSetMessageState).toHaveBeenCalledWith({
          ...validMessageState,
          readOnly: false
        });
      });
      describe("view message is confirmed", () => {
        beforeEach(() => window.confirm = () => true);
        describe("post to updateclosedmessage is successful", () => {
          beforeEach(() => axiosMock.onPost(apiPaths.CLOSED_MESSAGE).reply(200, "delete successful"));
          test("should set closed message to empty string and toggl read only to false", done => {
            const rendered = renderComponent(validMessageState);
            const button = rendered.getByTitle("Delete");
            act(() => {
              fireEvent.click(button);
              return Promise.resolve();
            })
              .then(() => {
                expect(mockSetMessageState).toHaveBeenCalledTimes(2);
                expect(mockSetMessageState).toHaveBeenCalledWith(            {
                  fetching: false,
                  message: "",
                  messageType: "closed",
                  readOnly: false,
                  skillData: { "allSkills": null }
                });
                done();
              });
          });
        });
        describe("post to updateclosedmessage fails", () => {
          beforeEach(() => axiosMock.onPost(apiPaths.CLOSED_MESSAGE).reply(500, "awww, delete failed"));
          test("should display error", done => {
            const rendered = renderComponent(validMessageState);
            const button = rendered.getByTitle("Delete");
            act(() => {
              fireEvent.click(button);
              return Promise.resolve();
            })
              .then(() => {
                expect(mockSetMessageState).toHaveBeenCalledTimes(2);
                expect(mockSetMessageState).toHaveBeenCalledWith({
                  ...validMessageState,
                  fetching: false,
                  serviceCallError: "Failed to delete message. Please try again or submit a request via"
                });
                done();
              });
          });
        });
      });
      describe("view message is not confirmed", () => {
        test("if they select no we should do nothing.", () => {
          window.confirm = jest.fn(() => false);
          const rendered = renderComponent(validMessageState);
          act(() => fireEvent.click(rendered.getByTitle("Delete")));
          expect(mockSetMessageState).toHaveBeenCalledTimes(0);
        });
      });
    });
  });
});