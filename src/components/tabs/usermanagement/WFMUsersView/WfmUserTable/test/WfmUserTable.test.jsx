import WfmUserTable from "../WfmUserTable";
import {
  useAdminState,
  useFormDispatch,
  userFormActions
} from "context";
import React from "react";
import {
  act,
  fireEvent,
  initialTestState,
  render,
  setupMockedComponents
} from "testUtils";
import { theme } from "globals";
import { useNavigate } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import {
  Delete,
  Edit
} from "@mui/icons-material";

jest.mock("components", () => ({
  ModalOverlay: jest.fn()
}));

jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn()
}));

jest.mock("context", () => ({
  useAdminState: jest.fn(),
  useFormDispatch: jest.fn(),
  userFormActions: jest.requireActual("context").userFormActions
}));

jest.mock("@mui/icons-material", () => ({
  Delete: jest.fn(),
  Edit: jest.fn(),
  ChangeHistoryRounded: jest.fn()
}));

jest.mock("@mui/material", () => ({
  Switch: jest.fn()
}));

const mockNavigate = jest.fn();
const mockSetForm = jest.fn();
const mockSetTableState = jest.fn();

const testWFMPeople = [
  {
    Id: "1",
    Identity: "email@mail.com",
    FirstName: "Michael",
    LastName: "Scott",
    EmploymentNumber: "n1234567",
    Email: "michael.scott@dundermifflin.com",
    DisplayName: "Michael Scott",
    EmploymentStartDate: "1-1-2000",
    TimeZoneId: "EST",
    BusinessUnitId: "123-321",
    ParentTeam: "111"
  },
  {
    Id: "2",
    Identity: "Jim.Halpert@dundermifflin.com",
    FirstName: "Jim",
    LastName: "Halpert",
    EmploymentNumber: "n1234567",
    Email: "Jim.Halpert@dundermifflin.com",
    DisplayName: "Michael Scott",
    EmploymentStartDate: "1-1-2000",
    TimeZoneId: "EST",
    BusinessUnitId: "boo",
    ParentTeam: "fake"
  }
];

const tableState = {
  deltaFilter: false,
  filteredList: testWFMPeople
};
const renderComponent = () => {
  return render(
    <ThemeProvider theme={theme}>
      <WfmUserTable tableState={tableState} setTableState={mockSetTableState} />
    </ThemeProvider>
  );
};

describe("<WfmUserTable />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useNavigate.mockReturnValue(mockNavigate);
    setupMockedComponents({
      Delete,
      Edit
    });
    useAdminState.mockReturnValue(initialTestState);
    useFormDispatch.mockReturnValue(mockSetForm);
  });

  describe("Initial State", () => {
    test("Table Renders as expected", () => {
      const rendered = renderComponent();
      expect(rendered.container).toHaveTextContent("NAME");
      expect(rendered.container).toHaveTextContent("ID");
      expect(rendered.container).toHaveTextContent("EMAIL");
      expect(rendered.container).toHaveTextContent("IDENTITY");
      expect(rendered.container).toHaveTextContent("NNumber");
      expect(rendered.container).toHaveTextContent("BUSINESS UNIT");
      expect(rendered.container).toHaveTextContent("TEAM");
      testWFMPeople.forEach(p => {
        expect(rendered.container).toHaveTextContent(p.DisplayName);
        expect(rendered.container).toHaveTextContent(p.Id);
        expect(rendered.container).toHaveTextContent(p.Email);
        expect(rendered.container).toHaveTextContent(p.Identity);
        expect(rendered.container).toHaveTextContent(p.EmploymentNumber);
        expect(rendered.container).toHaveTextContent("Cool WFM Business Unit");
        expect(rendered.container).toHaveTextContent("Team1");
      });

      expect(Edit.mock.calls.length).toBe(testWFMPeople.length);
      expect(Delete.mock.calls.length).toBe(testWFMPeople.length);
    });
  });
  describe("Edit Button is clicked on worker row", () => {
    test("setForm is called for the worker", () => {
      const rendered = renderComponent();
      const editButtons = rendered.getAllByTestId("edit-button");
      act(() => fireEvent.click(editButtons[0]));
      expect(mockSetForm).toHaveBeenCalledTimes(1);
      expect(mockSetForm).toHaveBeenCalledWith({
        type: userFormActions.SET_UPDATE_WFM_FORM_STATE,
        payload: testWFMPeople[0]
      });
      expect(mockNavigate).toHaveBeenCalledTimes(1);
      expect(mockNavigate).toHaveBeenCalledWith("/triton-admin/user");
    });
  });
  describe("Delete Button is clicked on worker row", () => {
    test("setForm is called for the worker", () => {
      const rendered = renderComponent();
      const deleteButtons = rendered.getAllByTestId("delete-button");
      act(() => fireEvent.click(deleteButtons[0]));
      expect(mockSetForm).toHaveBeenCalledTimes(1);
      expect(mockSetForm).toHaveBeenCalledWith({
        type: userFormActions.SET_DELETE_FORM_STATE,
        payload: {
          formMode: "delete",
          managers: initialTestState.managerContext.managers,
          worker: {
            calabrioWfmUser: {
              updated: false,
              ...testWFMPeople[0]
            }
          }
        }
      });
      expect(mockNavigate).toHaveBeenCalledTimes(1);
      expect(mockNavigate).toHaveBeenCalledWith("/triton-admin/user");
    });
  });
});