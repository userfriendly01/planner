import ExportOptionsButton from "../ExportOptionsButton";
import { StyledExportButton } from "../../BulkChanges.Styles";
import { StyledButton } from "components";
import React from "react";
import {
  act,
  render,
  setupMockedComponents
} from "testUtils";
import {
  ExcelExport
} from "@progress/kendo-react-excel-export";

jest.mock("@progress/kendo-react-excel-export", () => ({
  ExcelExport: jest.fn()
}));

jest.mock("components", () => ({
  StyledButton: jest.fn()
}));

const template = [
  {
    options: ["blop"],
    field: "field",
    name: "name",
    width: "width"
  },
  {
    options: ["blip"],
    field: "field",
    name: "name",
    width: "width"
  }
];

describe("ExportOptionsButton", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setupMockedComponents({
      ExcelExport,
      StyledButton
    });
  });
  describe("initial render", () => {
    test.only("should render as expected", () => {
      render(<ExportOptionsButton />);
      render(StyledExportButton.mock.calls[0][0].children);
      expect(StyledExportButton.mock.calls.length).toBe(1);
      expect(ExcelExport).toHaveBeenCalled();
    });
  });
  describe("ExportOptionsButton is clicked", () => {
    test("should call handleExport", () => {
      render(<ExportOptionsButton template={template} />);
      const onClick = StyledButton.mock.calls[0][0].onClick;
      act(() => {
        onClick();
      });
      expect(StyledButton.mock.calls.length).toBe(1);
    });
  });
});