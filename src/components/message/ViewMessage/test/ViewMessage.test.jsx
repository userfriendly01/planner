import ViewMessage from "../ViewMessage";
import { initialState } from "context";
import React from "react";
import { render } from "testUtils";

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
    describe("valid message exists", () => {
      const validMessageState = {
        ...initialMockedFlashMessageState,
        message: "Sample Flash Message"
      };
      test("should render the message.", () => {
        const rendered = renderComponent(validMessageState);
        expect(rendered.getByText("Sample Flash Message")).toBeTruthy();
      });
    });
  });
});