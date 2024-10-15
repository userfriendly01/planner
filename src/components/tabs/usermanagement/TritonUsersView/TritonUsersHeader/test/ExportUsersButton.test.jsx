import { ExportUsersButton } from "../ExportUsersButton";
import {
  ModalWrapper, StyledExportButton, ButtonWrapper
} from "usermanagement/TritonUsersHeader.Styles";
import React from "react";
import { ExcelExport } from "@progress/kendo-react-excel-export";
import {
  exportColumns, termedUserExportColumns
} from "globals";
import { theme } from "globals/theme";
import {
  act,
  render,
  initialTestState,
  setupMockedComponents,
  waitFor
} from "testUtils";
import { ThemeProvider } from "styled-components";
import { StyledButton } from "components/StyledButton";
import {
  useAdminState, useAdminDispatch
} from "context/appContext";
import {
  CircularProgress, Modal
} from "@mui/material";
import { listInactiveUMUsers } from "services/user";

jest.mock("services/user", () => ({
  listInactiveUMUsers: jest.fn()
}));

jest.mock("@progress/kendo-react-excel-export", () => ({
  ExcelExport: jest.fn()
}));

jest.mock("context/appContext", () => ({
  useAdminState: jest.fn(),
  useAdminDispatch: jest.fn()
}));

jest.mock("usermanagement/TritonUsersHeader.Styles", () => ({
  StyledExportButton: jest.fn(),
  ModalWrapper: jest.fn(),
  ButtonWrapper: jest.fn()
}));

jest.mock("components/StyledButton", () => ({
  StyledButton: jest.fn()
}));

jest.mock("@mui/material", () => ({
  Modal: jest.fn(),
  CircularProgress: jest.fn(),
  Paper: jest.fn()
}));

const useRefSpy = jest.spyOn(React, "useRef");
const mockSave = jest.fn();
const mockDispatch = jest.fn();

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

const inactiveWorkerRes = [{
  ...initialTestState.workerContext.workers[5],
  attributes: {
    ...initialTestState.workerContext.workers[5].attributes,
    roles: ["agent"],
    caller_id: "1234567890"
  },
  inactive_date: "10-10-2024",
  inactive_forward_to: "+1231231234"
}];

const renderComponent = () => {
  const rendered = render(
    <ThemeProvider theme={theme}>
      <ExportUsersButton
        selected={[fullWorker]}
        label="Export"
      />
    </ThemeProvider>
  );

  return rendered;
};

describe("ExportUsersButton", () => {
  beforeEach(() => {
    useRefSpy.mockReturnValue({ current: { save: mockSave }});
    useAdminState.mockReturnValue(initialTestState);
    useAdminDispatch.mockReturnValue(mockDispatch);
    jest.clearAllMocks();
    setupMockedComponents({
      StyledExportButton,
      ExcelExport,
      Modal,
      StyledButton,
      CircularProgress,
      ModalWrapper,
      ButtonWrapper
    });
  });
  describe("initial render", () => {
    test("renders with ExcelExport", () => {
      const rendered = renderComponent();
      expect(StyledExportButton).toHaveBeenCalled();
      expect(rendered.container).toHaveTextContent("Export");
      expect(Modal.mock.calls[0][0].open).toBe(false);
      expect(Modal.mock.calls.length).toEqual(1);
    });
  });
  describe("handleActiveUserExport", () => {
    test("renders modal and exports with appropriate user info", () => {
      const rendered = renderComponent();
      expect(StyledExportButton).toHaveBeenCalled();
      expect(rendered.container).toHaveTextContent("Export");
      const onClick = StyledExportButton.mock.calls[0][0].onClick;
      act(() => onClick());
      expect(Modal.mock.calls.length).toEqual(2);
      expect(Modal.mock.calls[1][0].open).toEqual(true);
      render(Modal.mock.calls[1][0].children);

      render(ModalWrapper.mock.calls[0][0].children);
      render(ButtonWrapper.mock.calls[0][0].children);

      expect(StyledButton).toHaveBeenCalledTimes(2);
      const activeExportButton = StyledButton.mock.calls[0][0];
      render(activeExportButton.children);
      const onExportActiveClick = activeExportButton.onClick;
      act(() => onExportActiveClick());
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

      expect(Modal.mock.calls[2][0].open).toEqual(false);
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
        const rendered = renderComponent();
        expect(StyledExportButton).toHaveBeenCalled();
        expect(rendered.container).toHaveTextContent("Export");
        const onClick = StyledExportButton.mock.calls[0][0].onClick;
        act(() => onClick());
        expect(Modal.mock.calls[2][0].open).toEqual(true);
        render(Modal.mock.calls[2][0].children);

        render(ModalWrapper.mock.calls[0][0].children);
        render(ButtonWrapper.mock.calls[0][0].children);

        expect(StyledButton).toHaveBeenCalledTimes(2);
        const activeExportButton = StyledButton.mock.calls[0][0];
        render(activeExportButton.children);
        const onExportActiveClick = activeExportButton.onClick;
        act(() => onExportActiveClick());
        expect(mockSave).toHaveBeenCalledTimes(0);
        expect(StyledExportButton.mock.calls[0][0].children).toBe("New Label");
      });
    });
  });
  describe("handleTermedUserExport", () => {
    test("renders modal, fetches termed users, and exports with appropriate user info", async () => {
      listInactiveUMUsers.mockResolvedValue(inactiveWorkerRes);
      const rendered = renderComponent();
      expect(StyledExportButton).toHaveBeenCalled();
      expect(rendered.container).toHaveTextContent("Export");
      const onClick = StyledExportButton.mock.calls[0][0].onClick;
      act(() => onClick());
      expect(Modal.mock.calls.length).toEqual(2);
      expect(Modal.mock.calls[1][0].open).toEqual(true);
      render(Modal.mock.calls[1][0].children);

      render(ModalWrapper.mock.calls[0][0].children);
      render(ButtonWrapper.mock.calls[0][0].children);

      expect(StyledButton).toHaveBeenCalledTimes(2);
      const termedUserFetchButton = StyledButton.mock.calls[1][0];
      render(termedUserFetchButton.children);
      const fetchActiveClick = termedUserFetchButton.onClick;
      act(() => fetchActiveClick());
      expect(listInactiveUMUsers).toHaveBeenCalledTimes(1);
      await waitFor(() => {
        // modal rerenders with the loading message
        render(Modal.mock.calls[3][0].children);
        render(ModalWrapper.mock.calls[2][0].children);
        expect(CircularProgress).toHaveBeenCalledTimes(1);
      });
      expect(Modal.mock.calls.length).toBe(5);

      render(Modal.mock.calls[4][0].children);
      render(ModalWrapper.mock.calls[3][0].children);
      render(StyledButton.mock.calls[2][0].children); // render the ExcelExport
      const clickExportTermed = StyledButton.mock.calls[2][0].onClick;
      act(() => clickExportTermed());

      expect(mockSave).toHaveBeenCalledTimes(1);
      expect(mockSave).toHaveBeenCalledWith([{
        inactive_date: "10-10-2024",
        inactive_forward_to: "+1231231234",
        full_name: "Snowball Jones",
        emp_first_name: "Snowball",
        emp_last_name: "Jones",
        extension: "7891",
        n_number: "n2223333",
        email: "snowball.jones@libertymutual.com",
        profile_id: 2,
        manager_n_number: "n0260000",
        roles: "agent",
        routing_team: undefined,
        routing_caller_states: "",
        current_skills: "",
        default_skills: "",
        disabled_skills: "",
        ou: "Service",
        backup_workers: "",
        sales_assoc_workers: "",
        outbound_number: "1234567890",
        caller_id: "1234567890"
      }], termedUserExportColumns);

      expect(Modal.mock.calls[5][0].open).toEqual(false);
    });
  });
});