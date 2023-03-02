import ProgressBar from "../ProgressBar";
import React from "react";
import {
  ProgressBarFiller,
  TextWrapper
} from "../../BulkChanges.Styles";
import { jokes } from "../../BulkTemplates";
import {
  render,
  setupMockedComponents
} from "testUtils";

jest.mock("../../BulkChanges.Styles", () => ({
  TextWrapper: jest.fn(),
  ProgressBarFiller: jest.fn(),
  ProgressBarWrapper: jest.requireActual("../../BulkChanges.Styles").ProgressBarFiller,
  ProgressBarContainer: jest.requireActual("../../BulkChanges.Styles").ProgressBarFiller
}));

jest.useFakeTimers();
const totalRowCount = 14;
const completedRows = 10;

describe("Progress Bar", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setupMockedComponents({
      ProgressBarFiller,
      TextWrapper
    });
  });
  describe("initial render", () => {
    test("component renders as expected", () => {
      render(<ProgressBar totalRowCount={totalRowCount} completedRows={completedRows}/>);
      expect(TextWrapper.mock.calls.length).toBe(1);
      expect(jokes.includes(TextWrapper.mock.calls[0][0].children)).toBe(true);
      expect(ProgressBarFiller.mock.calls.length).toBe(1);
      expect(ProgressBarFiller.mock.calls[0][0].progress).toBe("71%");
    });
    describe("jokes are updated on an interval", () => {
      test("wrapper should be re-rendered with new joke", () => {
        render(<ProgressBar totalRowCount={totalRowCount} completeRows={completedRows}/>);
        expect(TextWrapper.mock.calls.length).toBe(1);
        expect(jokes.includes(TextWrapper.mock.calls[0][0].children)).toBe(true);
        jest.advanceTimersByTime(20000);
        expect(TextWrapper.mock.calls.length).toBe(2);
        expect(jokes.includes(TextWrapper.mock.calls[1][0].children)).toBe(true);
      });
    });
  });
});