import { PageLoadSpinner } from "../PageLoadSpinner";
import React from "react";
import { CircularProgress } from "@mui/material";
import {
  render, setupMockedComponents
} from "testUtils";

jest.mock("@mui/material", () => ({
  CircularProgress: jest.fn()
}));

const message = "I'm loading!";

describe("<PageLoadSpinner />", () => {
  beforeEach(() => {
    setupMockedComponents({
      CircularProgress
    });
  });
  describe("message is passed through", () => {
    test("should render as expected", () => {
      const rendered = render(<PageLoadSpinner message ={message}/>);
      expect(rendered.container).toHaveTextContent(message);
      expect(CircularProgress).toHaveBeenCalledTimes(1);
    });
  });
  describe("message is not passed through", () => {
    test("should render as expected", () => {
      const rendered = render(<PageLoadSpinner/>);
      expect(rendered.container).toHaveTextContent("Loading");
      expect(CircularProgress).toHaveBeenCalledTimes(1);
    });
  });
});
