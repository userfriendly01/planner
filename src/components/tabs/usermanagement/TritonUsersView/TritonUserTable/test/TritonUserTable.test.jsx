import { TritonUserTable } from "../TritonUserTable";
import { ModalOverlay } from "components/ModalOverlay";
import {
  useAdminDispatch,
  useAdminState,
  useFormDispatch
} from "context/appContext";
import { userFormActions } from "context/userFormReducer";
import React from "react";
import {
  act,
  fireEvent,
  initialTestState,
  render,
  setupMockedComponents
} from "testUtils";
import { formModes } from "globals";
import { theme } from "globals/theme";
import { useNavigate } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { formatWorkerAttributeSkillsToHTML } from "utils/skillsUtils";
import {
  Delete,
  Edit,
  ChangeHistoryRounded
} from "@mui/icons-material";
import { Switch } from "@mui/material";

jest.mock("components/ModalOverlay", () => ({
  ModalOverlay: jest.fn()
}));

jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn()
}));

jest.mock("context/appContext", () => ({
  useAdminDispatch: jest.fn(),
  useAdminState: jest.fn(),
  useFormDispatch: jest.fn()
}));

jest.mock("utils/skillsUtils", () => ({
  formatWorkerAttributeSkillsToHTML: jest.fn()
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
const mockDispatch = jest.fn();
const mockSetTableState = jest.fn();
const tableState = {
  selected: [],
  deltaFilter: false,
  filteredList: initialTestState.workerContext.workers
};
const renderComponent = (resettingSkills = false) => {
  return render(
    <ThemeProvider theme={theme}>
      <TritonUserTable resettingSkills={resettingSkills} tableState={tableState} setTableState={mockSetTableState} />
    </ThemeProvider>
  );
};

describe("<TritonUserTable />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useNavigate.mockReturnValue(mockNavigate);
    setupMockedComponents({
      ModalOverlay,
      Delete,
      Edit,
      ChangeHistoryRounded,
      Switch
    });
    formatWorkerAttributeSkillsToHTML.mockReturnValue("Skill1, Skill2");
    useAdminState.mockReturnValue(initialTestState);
    useFormDispatch.mockReturnValue(mockSetForm);
    useAdminDispatch.mockReturnValue(mockDispatch);
  });

  describe("Initial State", () => {
    test("Table Renders as expected", () => {
      const rendered = renderComponent();
      expect(rendered.container).toHaveTextContent("NAME");
      expect(rendered.container).toHaveTextContent("N NUMBER");
      expect(rendered.container).toHaveTextContent("EXTENSION");
      expect(rendered.container).toHaveTextContent("TEAM/PROFILE");
      expect(rendered.container).toHaveTextContent("OU");
      expect(rendered.container).toHaveTextContent("ROUTING TEAM");
      expect(rendered.container).toHaveTextContent("CURRENT SKILLS");
      expect(rendered.container).toHaveTextContent("DEFAULT SKILLS");
      expect(rendered.container).toHaveTextContent("DISABLED SKILLS");
      initialTestState.workerContext.workers.forEach(w => {
        expect(rendered.container).toHaveTextContent(w.attributes.emp_first_name);
        expect(rendered.container).toHaveTextContent(w.attributes.emp_last_name);
        expect(rendered.container).toHaveTextContent(w.attributes.n_number);
        expect(rendered.container).toHaveTextContent(w.attributes.extension);
        const profile = initialTestState.profileContext.profiles.find(p => p.profile_id === w.attributes.profile_id);
        if(profile){
          expect(rendered.container).toHaveTextContent(`${profile.profile_name} - ${profile.profile_id}`);
          expect(rendered.container).toHaveTextContent(profile.operating_unit_nme);
        }
        if(w.attributes.office_location_name){
          expect(rendered.container).toHaveTextContent(w.attributes.office_location_name);
        }
        if(w.attributes.routing){
          expect(rendered.container).toHaveTextContent(w.attributes.routing?.team);
        }
        if(w.attributes.default_skills){
          expect(rendered.container).toHaveTextContent(w.attributes.default_skills);
        }
        if(w.attributes.disabled_skills){
          expect(rendered.container).toHaveTextContent(w.attributes.disabled_skills);
        }
      });
      expect(Switch.mock.calls.length).toBe(1);
      expect(Switch.mock.calls[0][0].checked).toBe(false);
      expect(ChangeHistoryRounded.mock.calls.length).toBe(1);
      expect(Edit.mock.calls.length).toBe(initialTestState.workerContext.workers.length);
      expect(Delete.mock.calls.length).toBe(initialTestState.workerContext.workers.length);
    });
    describe("resettingSkills === true", () => {
      test.only("ModalOverlay is rendered", () => {
        renderComponent(true);
        expect(ModalOverlay.mock.calls.length).toBe(1);
        expect(ModalOverlay.mock.calls[0][0]).toStrictEqual({
          message: "Resetting Worker Skills",
          status: "saving"
        });
      });
    });
  });
  describe("Reset Skills Toggle is clicked", () => {
    test("setTableState is updated ", () => {
      renderComponent();
      const toggleWorkers = Switch.mock.calls[0][0].onChange;
      act(() => toggleWorkers());
      expect(mockSetTableState).toHaveBeenCalledTimes(1);
      expect(mockSetTableState).toHaveBeenCalledWith({
        ...tableState,
        deltaFilter: true
      });
    });
  });
  describe("Worker row is selected", () => {
    test("setDispatch is called for the worker", () => {
      const rendered = renderComponent();
      const rows = rendered.getAllByTestId("table-row");
      act(() => fireEvent.click(rows[1]));
      expect(mockSetTableState).toHaveBeenCalledTimes(1);
      expect(mockSetTableState).toHaveBeenCalledWith({
        ...tableState,
        selected: [{
          name: initialTestState.workerContext.workers[1].attributes.full_name,
          sid: initialTestState.workerContext.workers[1].sid
        }]
      });
    });
  });
  describe("Worker row is unselected", () => {
    test("setDispatch is called for the worker", () => {
      const selectedTableState = {
        ...tableState,
        selected: [{
          name: initialTestState.workerContext.workers[1].attributes.full_name,
          sid: initialTestState.workerContext.workers[1].sid
        }]
      };
      const rendered = render(
        <ThemeProvider theme={theme}>
          <TritonUserTable tableState={selectedTableState} setTableState={mockSetTableState} />
        </ThemeProvider>
      );
      const rows = rendered.getAllByTestId("table-row");
      act(() => fireEvent.click(rows[1]));
      expect(mockSetTableState).toHaveBeenCalledTimes(1);
      expect(mockSetTableState).toHaveBeenCalledWith({
        ...tableState,
        selected: []
      });
    });
  });
  describe("Edit Button is clicked on worker row", () => {
    test("setForm is called for the worker", () => {
      const rendered = renderComponent();
      const editButtons = rendered.getAllByTestId("edit-button");
      act(() => fireEvent.click(editButtons[0]));
      expect(mockSetForm).toHaveBeenCalledTimes(1);
      expect(mockSetForm).toHaveBeenCalledWith({
        type: userFormActions.SET_UPDATE_TRITON_FORM_STATE,
        payload: {
          formMode: formModes.UPDATE,
          managers: initialTestState.managerContext.managers,
          worker: initialTestState.workerContext.workers[0]
        }
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
          managers: initialTestState.managerContext.managers,
          worker: initialTestState.workerContext.workers[0]
        }
      });
      expect(mockNavigate).toHaveBeenCalledTimes(1);
      expect(mockNavigate).toHaveBeenCalledWith("/triton-admin/user");
    });
  });
});