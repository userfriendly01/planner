import ExportErrorsButton from "../ExportErrorsButton";
import { Button } from "../../BulkChanges.Styles";
import React from "react";
import { ExcelExport } from "@progress/kendo-react-excel-export";
import {
  act,
  render,
  setupMockedComponents
} from "testUtils";

jest.mock("../../BulkChanges.Styles", () => ({
  Button: jest.fn()
}));

jest.mock("@progress/kendo-react-excel-export", () => ({
  ExcelExport: jest.fn()
}));

jest.useFakeTimers();
const useRefSpy = jest.spyOn(React, "useRef");
const mockSave = jest.fn();

const errors = [{
  rowNumber: 1,
  errors: "oh no"
}];

const expectedColumns = [
  {
    field: "row",
    title: "Row",
    width: "50px"
  },
  {
    field: "errors",
    title: "Errors",
    width: "400px"
  }
];

describe("ExportErrorsButton", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    useRefSpy.mockReturnValue({ current: { save: mockSave }});
    setupMockedComponents({
      Button
    });
  });
  describe("initial render", () => {
    test("component renders as expected", () => {
      render(<ExportErrorsButton errors={errors}/>);
      render(Button.mock.calls[0][0].children[0]);
      expect(Button.mock.calls.length).toBe(1);
      expect(ExcelExport.mock.calls.length).toBe(2);
    });
    describe("onClick", () => {
      test("handleExport is called", () => {
        render(<ExportErrorsButton errors={errors}/>);
        render(Button.mock.calls[0][0].children);
        const onClick = Button.mock.calls[0][0].onClick;
        act(() => onClick());
        expect(mockSave).toHaveBeenCalledTimes(1);
        expect(mockSave).toHaveBeenCalledWith([{
          row: 1,
          errors: "oh no"
        }], expectedColumns);
      });
      describe("_export is null", () => {
        beforeEach(() => {
          useRefSpy.mockReturnValue(null);
        });
        test("handleExport is called", () => {
          render(<ExportErrorsButton errors={errors}/>);
          render(Button.mock.calls[0][0].children);
          const onClick = Button.mock.calls[0][0].onClick;
          act(() => onClick());
          expect(mockSave).toHaveBeenCalledTimes(0);
        });
      });
    });
  });
});