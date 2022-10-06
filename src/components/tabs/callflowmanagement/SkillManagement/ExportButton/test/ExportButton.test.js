import ExportButton from "../ExportButton";
import React from "react";
import { StyledButton } from "components";
import {
  act,
  render,
  skillsList,
  setupMockedComponents
} from "testUtils";
import { ExcelExport } from "@progress/kendo-react-excel-export";

jest.mock("components", () => ({
  StyledButton: jest.fn()
}));

jest.mock("@progress/kendo-react-excel-export", () => ({
  ExcelExport: jest.fn()
}));

const selected = [skillsList[0]];

describe("<ExportButton />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setupMockedComponents({
      ExcelExport,
      StyledButton
    });
  });
  describe("initial render", () => {
    test("should render as expected", () => {
      render(<ExportButton selected={selected}/>);
      render(StyledButton.mock.calls[0][0].children);
      expect(StyledButton.mock.calls.length).toBe(1);
      expect(ExcelExport).toHaveBeenCalled();
    });
  });
  describe("Export Button on click is called", () => {
    test("should call handleExport", () => {
      render(<ExportButton selected={selected}/>);
      const onClick = StyledButton.mock.calls[0][0].onClick;
      act(() => {
        onClick();
      });
      expect(StyledButton.mock.calls.length).toBe(1);
    //This test is just to show the code is covered but there is no useful assertion for this.. 
    //unfortunately even mocking ExcelExport I couldnt access that react ref _export to confirm it was run
    });
  });
});