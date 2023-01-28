import ExportTemplateButton from "../ExportTemplateButton";
import React from "react";
import { ExcelExport } from "@progress/kendo-react-excel-export";
import { StyledButton } from "components";
import { StyledExportButton } from "../../BulkChanges.Styles";
import {
  act,
  render,
  setupMockedComponents
} from "testUtils";

jest.mock("@progress/kendo-react-excel-export", () => ({
  ExcelExport: jest.fn()
}));

jest.mock("components", () => ({
  StyledButton: jest.fn()
}));

describe("ExportTemplateButton", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setupMockedComponents({
      ExcelExport,
      StyledButton
    });
  });
  describe("initial render", () => {
    test("should render as expected", () => {
      render(<ExportTemplateButton template={[]} />);
      render(StyledExportButton.mock.calls[0][0].children);
      expect(StyledExportButton.mock.calls.length).toBe(1);
      expect(ExcelExport).toHaveBeenCalled();
    });
  });
  describe("ExportTemplateButton is clicked", () => {
    test("should call handleExport", () => {
      render(<ExportTemplateButton template={[]} />);
      const onClick = StyledExportButton.mock.calls[0][0].onClick;
      act(() => {
        onClick();
      });
      expect(StyledExportButton.mock.calls.length).toBe(1);
    });
  });
});