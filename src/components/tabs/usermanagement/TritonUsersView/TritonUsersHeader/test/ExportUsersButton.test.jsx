import ExportUsersButton from "../ExportUsersButton";
import { StyledExportButton } from "../TritonUsersHeader.Styles";
import React from "react";
import { ExcelExport } from "@progress/kendo-react-excel-export";
import { theme } from "globals";
import {
  act,
  render,
  initialTestState,
  setupMockedComponents
} from "testUtils";
import { ThemeProvider } from "styled-components";

jest.mock("@progress/kendo-react-excel-export", () => ({
  ExcelExport: jest.fn(),
}));

jest.mock("../TritonUsersHeader.Styles", () => ({
  StyledExportButton: jest.fn()
}));

const useRefSpy = jest.spyOn(React, "useRef");
const mockSave = jest.fn();

const renderComponent = () => {
  const rendered = render(
    <ThemeProvider theme={theme}>
      <ExportUsersButton
        selected={[initialTestState.workerContext.workers[1]]}
        label="Export"
      />
    </ThemeProvider>
  );
  render(StyledExportButton.mock.calls[0][0].children);
  return rendered;
}

describe("ExportUsersButton", () => {
  beforeEach(() => {
    useRefSpy.mockReturnValue({ current: { save: mockSave }});
    jest.clearAllMocks();
    setupMockedComponents({
      StyledExportButton,
      ExcelExport
    })
  });
  describe("initial render", () => {
    test("renders with ExcelExport", () => {
      const rendered = renderComponent();
      expect(ExcelExport).toHaveBeenCalled();
      expect(rendered.container).toHaveTextContent("Export");
    });
  });
  describe("handleExport", () => {
    test("renders with ExcelExport", () => {
      renderComponent();
      const onClick = StyledExportButton.mock.calls[0][0].onClick;
      act(() => onClick());
      expect(mockSave).toHaveBeenCalledTimes(1);
      expect(mockSave).toHaveBeenCalledWith([{
        ...initialTestState.workerContext.workers[1],
        "emp_first_name": "Gloria",
        "emp_last_name": "Sake",
        "extension": "2345",
        "full_name": "Gloria Sake",
        "manager_n_number": "n0263786",
        "n_number": "n0000000",
        "profile_id": "12",
        "sid": "WK1234"}
      ], 
      [
        {
          field: "emp_first_name",
          title: "First Name",
          width: "100px"
        },
        {
          field: "emp_last_name",
          title: "Last Name",
          width: "100px"
        },
        {
          field: "n_number",
          title: "N Number",
          width: "100px"
        },
        {
          field: "email",
          title: "Email",
          width: "100px"
        },
        {
          field: "extension",
          title: "Extension",
          width: "100px"
        },
        {
          field: "profile_id",
          title: "Profile Id",
          width: "100px"
        },
        {
          field: "manager_n_number",
          title: "Manager N Number",
          width: "100px"
        },
        {
          field: "manager",
          title: "Manager",
          width: "100px"
        },
        {
          field: "directDialNum",
          title: "Direct Dial Number",
          width: "100px"
        },
        {
          field: "sid",
          title: "Worker Sid",
          width: "100px"
        }
      ]);
    });
  });
});