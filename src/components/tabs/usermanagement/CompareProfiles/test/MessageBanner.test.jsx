import React from "react";
import { MessageBanner } from "../MessageBanner";
import { Close } from "@mui/icons-material";
import { messageConsts } from "usermanagement/messages";
import {
  act, render, setupMockedComponents
} from "testUtils";
import { env } from "globals";

jest.mock("@mui/icons-material", () => ({
  Close: jest.fn()
}));

const mockUpdateMessages = jest.fn();

const existingMessages = [{
  id: 1,
  message: "Hey heads up here's a message"
}];

describe("MessageBanner", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setupMockedComponents({
      Close
    });
    delete env.APP_ENV;
  });
  describe("environment === development", () => {
    beforeEach(() => {
      env.APP_ENV = "development";
    });

    test("rendered the expected messages", () => {
      render(<MessageBanner environment="development" messages={existingMessages} updateMessages={mockUpdateMessages} />);
      expect(Close).toHaveBeenCalledTimes(1);
      expect(mockUpdateMessages).toHaveBeenCalledTimes(1);
      expect(mockUpdateMessages).toHaveBeenCalledWith("add", null, messageConsts.DEV_MESSAGE, "error");
    });
  });
  describe("environment === test", () => {
    beforeEach(() => {
      env.APP_ENV = "test";
    });

    test("rendered the expected messages", () => {
      render(<MessageBanner messages={existingMessages} updateMessages={mockUpdateMessages} />);
      expect(Close).toHaveBeenCalledTimes(1);
      expect(mockUpdateMessages).toHaveBeenCalledTimes(1);
      expect(mockUpdateMessages).toHaveBeenCalledWith("add", null, messageConsts.TEST_MESSAGE, "error");
    });
  });
  describe("environment === production", () => {
    beforeEach(() => {
      env.APP_ENV = "production";
    });

    test("rendered the expected messages", () => {
      render(<MessageBanner environment="production" messages={existingMessages} updateMessages={mockUpdateMessages} />);
      expect(Close).toHaveBeenCalledTimes(1);
      expect(mockUpdateMessages).toHaveBeenCalledTimes(0);
    });
  });
  describe("clear message", () => {
    test("calls mockUpdateMessages with delete", () => {
      render(<MessageBanner environment="production" messages={existingMessages} updateMessages={mockUpdateMessages} />);
      expect(Close).toHaveBeenCalledTimes(1);
      const onClear = Close.mock.calls[0][0].onClick;
      act(() => onClear());
      expect(mockUpdateMessages).toHaveBeenCalledTimes(1);
      expect(mockUpdateMessages).toHaveBeenCalledWith("delete", 1);
    });
  });
});