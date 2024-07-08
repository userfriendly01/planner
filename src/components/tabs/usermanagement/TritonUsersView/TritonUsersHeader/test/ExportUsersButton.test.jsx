import { ExportUsersButton } from "../ExportUsersButton";
import { StyledExportButton } from "usermanagement/TritonUsersHeader.Styles";
import React from "react";
import { ExcelExport } from "@progress/kendo-react-excel-export";
import { exportColumns } from "globals";
import { theme } from "globals/theme";
import {
  act,
  render,
  initialTestState,
  setupMockedComponents
} from "testUtils";
import { ThemeProvider } from "styled-components";
import { useAdminState } from "context/appContext";

jest.mock("@progress/kendo-react-excel-export", () => ({
  ExcelExport: jest.fn()
}));

jest.mock("context/appContext", () => ({
  useAdminState: jest.fn()
}));

jest.mock("usermanagement/TritonUsersHeader.Styles", () => ({
  StyledExportButton: jest.fn()
}));

const useRefSpy = jest.spyOn(React, "useRef");
const mockSave = jest.fn();

const fullWorker = {
  ...initialTestState.workerContext.workers[3],
  attributes: {
    ...initialTestState.workerContext.workers[3].attributes,
    caller_id: "6038518200",
    roles: ["agent"],
    routing: {
      team: "Kitties",
      skills: ["psul1", "466"],
      levels: { "466": 1 },
      caller_states: ["boo"],
      sales_assoc_workers: ["hi", "there"],
      backup_workers: ["n2222222", "n1212121"]
    },
    default_skills: {
      skills: ["dsul1", "4d66"],
      levels: { "4d66": 1 }
    },
    disabled_skills: {
      skills: ["disul1", "4di66"],
      levels: { "4di66": 1 }
    }
  }
};

const renderComponent = () => {
  const rendered = render(
    <ThemeProvider theme={theme}>
      <ExportUsersButton
        selected={[fullWorker]}
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
    useAdminState.mockReturnValue(initialTestState);
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
  describe("handleExport", () => {
    test("renders with ExcelExport", () => {
      renderComponent();
      const onClick = StyledExportButton.mock.calls[0][0].onClick;
      act(() => onClick());
      expect(mockSave).toHaveBeenCalledTimes(1);
      expect(mockSave).toHaveBeenCalledWith([{
        "emp_first_name": "Andrew",
        "emp_last_name": "VandeKamp",
        "extension": "7891",
        "full_name": "Andrew VandeKamp",
        "caller_id": "6038518200",
        "outbound_number": "6038518200",
        "manager_n_number": "n0260000",
        "n_number": "n2222222",
        "ou": "Claims",
        "profile_id": 0,
        "sales_assoc_workers": "hi, there",
        "backup_workers": "n2222222, n1212121",
        "sid": "WK66654654",
        "current_skills": "psul1,466 - 1",
        "default_skills": "dsul1,4d66 - 1",
        "disabled_skills": "disul1,4di66 - 1",
        "routing_caller_states": "boo",
        "routing_team": "Kitties",
        "roles": "agent",
        routing: {
          team: "Kitties",
          skills: ["psul1", "466"],
          levels: { "466": 1 },
          caller_states: ["boo"],
          sales_assoc_workers: ["hi", "there"],
          backup_workers: ["n2222222", "n1212121"]
        }
      }], exportColumns);
    });
    test("did - renders with ExcelExport", () => {
      render(
        <ThemeProvider theme={theme}>
          <ExportUsersButton
            selected={[{
              ...fullWorker,
              did: "603242345"
            }]}
            label="Export"
          />
        </ThemeProvider>
      );
      render(StyledExportButton.mock.calls[0][0].children);
      const onClick = StyledExportButton.mock.calls[0][0].onClick;
      act(() => onClick());
      expect(mockSave).toHaveBeenCalledTimes(1);
      expect(mockSave).toHaveBeenCalledWith([{
        "emp_first_name": "Andrew",
        "emp_last_name": "VandeKamp",
        "extension": "7891",
        "full_name": "Andrew VandeKamp",
        "manager_n_number": "n0260000",
        "n_number": "n2222222",
        "ou": "Claims",
        "outbound_number": "6038518200",
        "profile_id": 0,
        "sales_assoc_workers": "hi, there",
        "backup_workers": "n2222222, n1212121",
        "caller_id": "6038518200",
        "did": "603242345",
        "sid": "WK66654654",
        "current_skills": "psul1,466 - 1",
        "default_skills": "dsul1,4d66 - 1",
        "disabled_skills": "disul1,4di66 - 1",
        "routing_caller_states": "boo",
        "routing_team": "Kitties",
        "roles": "agent",
        routing: {
          team: "Kitties",
          skills: ["psul1", "466"],
          levels: { "466": 1 },
          caller_states: ["boo"],
          sales_assoc_workers: ["hi", "there"],
          backup_workers: ["n2222222", "n1212121"]
        }
      }], exportColumns);
    });
  });
  describe("_export.current === null", () => {
    beforeEach(() => {
      useRefSpy.mockReturnValue({ current: null });
    });
    test("should not call _export.current.save", () => {
      render(
        <ThemeProvider theme={theme}>
          <ExportUsersButton
            selected={[initialTestState.workerContext.workers[1]]}
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
});