import React from "react";
import { WfmErrorBanner } from "../WfmErrorBanner";
import {
  useAdminState
} from "context/appContext";
import {
  AccordionSummary,
  AccordionDetails
} from "@mui/material";
import {
  render,
  setupMockedComponents
} from "testUtils";

jest.mock("context/appContext", () => ({
  useAdminState: jest.fn()
}));

jest.mock("@mui/material", () => ({
  Accordion: jest.requireActual("@mui/material").Accordion,
  AccordionSummary: jest.fn(),
  AccordionDetails: jest.fn()
}));

const errorMessage = "Oh noooo";

describe("WfmErrorBanner", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setupMockedComponents({
      AccordionSummary,
      AccordionDetails
    });
    useAdminState.mockReturnValue({
      calabrioContext: {
        wfmErrors: [{
          message: errorMessage
        }]
      }
    })
  });
  describe("initial render", () => {
    test("should render as expected", () => {
      render(<WfmErrorBanner/>);
      expect(AccordionSummary.mock.calls.length).toBe(1);
      expect(AccordionSummary.mock.calls[0][0].children).toBe("Some teams failed to load into the table. Expand to see details...");
      expect(AccordionSummary.mock.calls.length).toBe(1);
      expect(AccordionDetails.mock.calls[0][0].children).toContain("We are working with Calabrio for a a better solution to gather this data without failures. The following errors occured:");
      const rendered = render(AccordionDetails.mock.calls[0][0].children[1]);
      expect(rendered.container).toHaveTextContent(errorMessage);
    });
  });
  describe("wfmErrors length === 0", () => {
    test("should render as expected", () => {
      useAdminState.mockReturnValue({
        calabrioContext: {
          wfmErrors: []
        }
      })
      render(<WfmErrorBanner/>);
      expect(AccordionSummary.mock.calls.length).toBe(0);
      expect(AccordionSummary.mock.calls.length).toBe(0);
    });
  });
});