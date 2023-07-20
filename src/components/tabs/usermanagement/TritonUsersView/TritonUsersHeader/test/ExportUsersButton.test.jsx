import ExportUsersButton from "../ExportUsersButton";
import { StyledExportButton } from "../TritonUsersHeader.Styles";
import { StyledButton } from "components";
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

const fullWorker = {
  ...initialTestState.workerContext.workers[1],
  attributes: {
    ...initialTestState.workerContext.workers[1].attributes,
    did: "6038518200",
    roles: ["agent"],
    routing: {
      team: "Kitties",
      skills: ["psul1", "466"],
      levels: { "466": 1 },
      callerStates: ["boo"]
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
}

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
        "emp_first_name": "Gloria",
        "emp_last_name": "Sake",
        "extension": "2345",
        "full_name": "Gloria Sake",
        "did": "6038518200",
        "outbound_number": "6038518200",
        "manager_n_number": "n0263786",
        "n_number": "n0000000",
        "profile_id": "12",
        "sid": "WK1234",
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
          callerStates: ["boo"]
        }
      }],
      [
        {
          field: "sid",
          title: "Worker Sid",
          width: "100px"
        },
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
          field: "department_name",
          title: "Department",
          width: "100px"
        },
        {
          field: "routing_team",
          title: "Routing Team",
          width: "100px"
        },
        {
          field: "routing_caller_states",
          title: "Routing Caller States",
          width: "100px"
        },
        {
          field: "roles",
          title: "Roles",
          width: "100px"
        },
        {
          field: "outbound_number",
          title: "Outbound Number",
          width: "100px"
        },
        {
          field: "directDialNum",
          title: "Direct Dial Number",
          width: "100px"
        },
        {
          field: "current_skills",
          title: "Current Skills",
          width: "100px"
        },
        {
          field: "default_skills",
          title: "Default Skills",
          width: "100px"
        },
        {
          field: "disabled_skills",
          title: "Disabled Skills",
          width: "100px"
        }
      ]);
    });
    test("did - renders with ExcelExport", () => {
      render(
        <ThemeProvider theme={theme}>
          <ExportUsersButton
            selected={[{
              ...fullWorker,
              directDialNum: "603242345"
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
        "emp_first_name": "Gloria",
        "emp_last_name": "Sake",
        "extension": "2345",
        "full_name": "Gloria Sake",
        "manager_n_number": "n0263786",
        "n_number": "n0000000",
        "profile_id": "12",
        "did": "6038518200",
        "directDialNum": "603242345",
        "sid": "WK1234",
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
          callerStates: ["boo"]
        }
      }],
      [
        {
          field: "sid",
          title: "Worker Sid",
          width: "100px"
        },
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
          field: "department_name",
          title: "Department",
          width: "100px"
        },
        {
          field: "routing_team",
          title: "Routing Team",
          width: "100px"
        },
        {
          field: "routing_caller_states",
          title: "Routing Caller States",
          width: "100px"
        },
        {
          field: "roles",
          title: "Roles",
          width: "100px"
        },
        {
          field: "outbound_number",
          title: "Outbound Number",
          width: "100px"
        },
        {
          field: "directDialNum",
          title: "Direct Dial Number",
          width: "100px"
        },
        {
          field: "current_skills",
          title: "Current Skills",
          width: "100px"
        },
        {
          field: "default_skills",
          title: "Default Skills",
          width: "100px"
        },
        {
          field: "disabled_skills",
          title: "Disabled Skills",
          width: "100px"
        }
      ]);
    });
  });
  describe("_export.current === null", () => {
    beforeEach(() => {
      useRefSpy.mockReturnValue({ current: null});
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