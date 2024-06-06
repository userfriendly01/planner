import { ExportWfmUsersButton } from "../ExportWfmUsersButton";
import { StyledExportButton } from "usermanagement/WfmUsersHeader.Styles";
import React from "react";
import { ExcelExport } from "@progress/kendo-react-excel-export";
import { theme } from "globals/theme";
import {
  act,
  render,
  setupMockedComponents
} from "testUtils";
import { ThemeProvider } from "styled-components";

jest.mock("@progress/kendo-react-excel-export", () => ({
  ExcelExport: jest.fn()
}));

jest.mock("usermanagement/WfmUsersHeader.Styles", () => ({
  StyledExportButton: jest.fn()
}));

const useRefSpy = jest.spyOn(React, "useRef");
const mockSave = jest.fn();
const selected = [
  {
    Id: "989234-23406",
    FirstName: "Pam",
    LastName: "Beasley",
    EmploymentNumber: "n0093425",
    Email: "PBandJ@gmail.com",
    Identity: "PBandJ@gmail.com",
    BusinessUnitId: "123-321",
    TeamId: "Team Jim",
    FirstDayOfWeek: 3
  }
];

const renderComponent = () => {
  const rendered = render(
    <ThemeProvider theme={theme}>
      <ExportWfmUsersButton
        selected={selected}
        label="Export"
      />
    </ThemeProvider>
  );
  render(StyledExportButton.mock.calls[0][0].children);
  return rendered;
};

describe("ExportUsersButton", () => {
  beforeEach(() => {
    useRefSpy.mockReturnValue({ current: { save: mockSave }});
    jest.clearAllMocks();
    setupMockedComponents({
      StyledExportButton,
      ExcelExport
    });
  });
  describe("initial render", () => {
    test("renders with ExcelExport", () => {
      const rendered = renderComponent();
      expect(ExcelExport).toHaveBeenCalled();
      expect(rendered.container).toHaveTextContent("Export");
    });
  });
  describe("_export.current === null", () => {
    beforeEach(() => {
      useRefSpy.mockReturnValue({ current: null });
    });
    test("should not call _export.current.save", () => {
      render(
        <ThemeProvider theme={theme}>
          <ExportWfmUsersButton
            selected={selected}
            label="New Label"
          />
        </ThemeProvider>
      );
      const rendered = render(StyledExportButton.mock.calls[0][0].children);
      const onClick = StyledExportButton.mock.calls[0][0].onClick;
      act(() => onClick());
      expect(mockSave).toHaveBeenCalledTimes(0);
      expect(rendered.container).toHaveTextContent("New Label");
    });
  });
  describe("handleExport", () => {
    test("renders with ExcelExport", () => {
      renderComponent();
      const onClick = StyledExportButton.mock.calls[0][0].onClick;
      act(() => onClick());
      expect(mockSave).toHaveBeenCalledTimes(1);
      expect(mockSave).toHaveBeenCalledWith([{
        Id: "989234-23406",
        FirstName: "Pam",
        LastName: "Beasley",
        EmploymentNumber: "n0093425",
        Email: "PBandJ@gmail.com",
        Identity: "PBandJ@gmail.com",
        BusinessUnitId: "123-321",
        TeamId: "Team Jim",
        FirstDayOfWeek: 3
      }],
      [
        {
          field: "Id",
          title: "Id",
          width: "100px"
        },
        {
          field: "FirstName",
          title: "First Name",
          width: "100px"
        },
        {
          field: "LastName",
          title: "Last Name",
          width: "100px"
        },
        {
          field: "EmploymentNumber",
          title: "N Number",
          width: "100px"
        },
        {
          field: "Email",
          title: "Email",
          width: "100px"
        },
        {
          field: "Identity",
          title: "Identity",
          width: "100px"
        },
        {
          field: "BusinessUnitId",
          title: "Business Unit Id",
          width: "100px"
        },
        {
          field: "TeamId",
          title: "TeamId",
          width: "100px"
        },
        {
          field: "FirstDayOfWeek",
          title: "First Day Of Week",
          width: "100px"
        }
      ]);
    });

  });
});