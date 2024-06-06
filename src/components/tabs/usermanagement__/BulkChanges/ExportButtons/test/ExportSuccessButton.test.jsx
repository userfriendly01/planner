import { ExportSuccessButton } from "../ExportSuccessButton";
import { Button } from "usermanagement/BulkChanges.Styles";
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

const successfulRows = [
  {
    Row: 1,
    nNumber: "n0263786",
    attributes: {
      email: "e.mail"
    }
  },
  {
    Row: 2,
    nNumber: "n0260006"
  }
];

const expectedColumns = [
  {
    field: "Row",
    title: "Row",
    width: "50px"
  },
  {
    field: "nNumber",
    title: "nNumber",
    width: "50px"
  },
  {
    field: "attributes",
    title: "attributes",
    width: "50px"
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
      render(<ExportSuccessButton successfulRows={successfulRows}/>);
      render(Button.mock.calls[0][0].children[0]);
      expect(Button.mock.calls.length).toBe(1);
      expect(ExcelExport.mock.calls.length).toBe(2);
    });
    describe("onClick", () => {
      test("handleExport is called", () => {
        render(<ExportSuccessButton successfulRows={successfulRows}/>);
        render(Button.mock.calls[0][0].children);
        const onClick = Button.mock.calls[0][0].onClick;
        act(() => onClick());
        expect(mockSave).toHaveBeenCalledTimes(1);
        expect(mockSave).toHaveBeenCalledWith(successfulRows, expectedColumns);
      });
      describe("_export is null", () => {
        beforeEach(() => {
          useRefSpy.mockReturnValue(null);
        });
        test("handleExport is called", () => {
          render(<ExportSuccessButton successfulRows={successfulRows}/>);
          render(Button.mock.calls[0][0].children);
          const onClick = Button.mock.calls[0][0].onClick;
          act(() => onClick());
          expect(mockSave).toHaveBeenCalledTimes(0);
        });
      });
    });
  });
});