import ViewClosedMessage from "../ViewClosedMessage";
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
  return render(<ViewClosedMessage
    flashMessageState={flashMessageState}
    setFlashMessageState={mockSetFMState} />, initialAdminState);
};

describe("<ViewClosedMessage />", () => {
  beforeEach(() => mockSetFMState.mockClear());
  describe("initial state", () => {
    test("should render an empty textfield with two buttons.", () => {
      const rendered = renderComponent(initialMockedFMState);
      expect(rendered.getByTitle("Edit")).toBeTruthy();
      expect(rendered.getByTitle("Delete")).toBeTruthy();
    });
  });
  describe("valid message exists", () => {
    const validMessageState = {
      ...initialMockedFMState,
      flashMessage: "Stuff be down, enjoy the free time"
    };
    test("should render the message.", () => {
      const rendered = renderComponent(validMessageState);
      expect(rendered.getByText("Stuff be down, enjoy the free time")).toBeTruthy();
    });
    test("clicking the edit button should toggle the readonly state to false.", () => {
      const rendered = renderComponent(validMessageState);
      fireEvent.click(rendered.getByTitle("Edit"));
      expect(mockSetFMState).toHaveBeenCalledTimes(1);
      expect(mockSetFMState).toHaveBeenCalledWith({
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
              expect(mockSetFMState).toHaveBeenCalledTimes(2);
              expect(mockSetFMState).toHaveBeenCalledWith({
                fetching: false,
                flashMessage: "",
                readOnly: false
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
              expect(mockSetFMState).toHaveBeenCalledTimes(2);
              expect(mockSetFMState).toHaveBeenCalledWith({
                ...validMessageState,
                fetching: false,
                serviceCallError: "Failed to delete flash message. Please try again or submit a request via"
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
        expect(mockSetFMState).toHaveBeenCalledTimes(0);
      });
    });
  });
});