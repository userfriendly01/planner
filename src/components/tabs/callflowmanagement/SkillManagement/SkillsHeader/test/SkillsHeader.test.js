import { SkillsHeader } from "../SkillsHeader";
import { SearchBox } from "components/SearchBox";
import React from "react";
import { Dropdown } from "components/Dropdown";
import { ExportButton } from "callflowmanagement/ExportButton";
import {
  useAdminState, useSkillState
} from "context/appContext";
import {
  act,
  render,
  expectOnlyPassedProps,
  skillsList,
  setupMockedComponents,
  initialTestState,
  profileList,
  initialSkillState
} from "testUtils";

jest.mock("components/Dropdown", () => ({
  Dropdown: jest.fn()
}));

jest.mock("components/SearchBox", () => ({
  SearchBox: jest.fn()
}));

jest.mock("components/StyledButton", () => ({
  StyledButton: jest.fn()
}));

jest.mock("callflowmanagement/ExportButton", () => ({
  ExportButton: jest.fn()
}));

jest.mock("context/appContext", () => ({
  useAdminState: jest.fn(),
  useSkillState: jest.fn()
}));

const mockSetTableState = jest.fn();
const tableState = {
  searchBy: "searchy",
  selected: [skillsList[0].name],
  profiles: [{
    label: "Profile 1",
    value: 1
  }]
};

const renderComponent = () => {
  const rendered = render(<SkillsHeader
    tableState={tableState}
    setTableState={mockSetTableState}
    taskQueues={[]}
    applications={[]}
    timeOfDays={[]}
  />);
  return rendered;
};

describe("<SkillsHeader />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useSkillState.mockReturnValue(initialSkillState);
    useAdminState.mockReturnValue(initialTestState);
    setupMockedComponents({
      SearchBox,
      Dropdown,
      ExportButton
    });
  });
  describe("initial render", () => {
    test("component renders as expected", () => {
      renderComponent();
      expect(Dropdown.mock.calls.length).toBe(0);
      expect(SearchBox.mock.calls.length).toBe(1);
      expectOnlyPassedProps(SearchBox, {
        searchBy: tableState.searchBy
      });
      expect(ExportButton.mock.calls.length).toBe(1);
      expectOnlyPassedProps(ExportButton, {
        selected: [skillsList[0]]
      });
    });
    describe("user is admin", () => {
      beforeEach(() => {
        useAdminState.mockReturnValue({
          ...initialTestState,
          userContext: {
            ...initialTestState.userContext,
            isAdmin: true
          }
        });
      });
      test("should render Add Skill button", () => {
        renderComponent();
        expect(ExportButton.mock.calls.length).toBe(1);
        expectOnlyPassedProps(ExportButton, {
          selected: [skillsList[0]]
        });
      });
      test("should render profile dropdown", () => {
        renderComponent();
        expect(Dropdown.mock.calls.length).toBe(1);
        expectOnlyPassedProps(Dropdown, {
          multiple: true,
          value: tableState.profiles,
          options: initialTestState.profileContext.profiles.map(p => {
            return {
              ...p,
              label: p.profile_name,
              value: p.profile_id
            };
          })
        });
        expect(SearchBox.mock.calls.length).toBe(1);
        expectOnlyPassedProps(SearchBox, {
          searchBy: tableState.searchBy
        });
        expect(ExportButton.mock.calls.length).toBe(1);
        expectOnlyPassedProps(ExportButton, {
          selected: [skillsList[0]]
        });
      });
      describe("dropdown updateValue is called", () => {
        test("should call setTableState", () => {
          renderComponent();
          const updateValue = Dropdown.mock.calls[0][0].updateValue;
          act(() => {
            updateValue(null, [
              {
                ...profileList[1],
                label: profileList[1].profile_name,
                value: profileList[1].profile_id
              }
            ]);
          });
          expect(mockSetTableState).toHaveBeenCalledTimes(1);
          expect(mockSetTableState).toHaveBeenCalledWith({
            ...tableState,
            profiles: [
              {
                ...profileList[1],
                label: profileList[1].profile_name,
                value: profileList[1].profile_id
              }
            ]
          });
        });
      });
    });
    describe("user is not admin", () => {
      beforeEach(() => {
        useAdminState.mockReturnValue({
          ...initialTestState,
          userContext: {
            ...initialTestState.userContext,
            isAdmin: false
          }
        });
      });
      test("should render profile dropdown", () => {
        renderComponent();
        expect(Dropdown.mock.calls.length).toBe(0);
        expect(SearchBox.mock.calls.length).toBe(1);
        expectOnlyPassedProps(SearchBox, {
          searchBy: tableState.searchBy
        });
        expect(ExportButton.mock.calls.length).toBe(1);
        expectOnlyPassedProps(ExportButton, {
          selected: [skillsList[0]]
        });
      });
    });
  });
  describe("searchbox setSearch is called", () => {
    test("should call setTableState", () => {
      renderComponent();
      const setSearch = SearchBox.mock.calls[0][0].setSearch;
      act(() => {
        setSearch("new search");
      });
      expect(mockSetTableState).toHaveBeenCalledTimes(1);
      expect(mockSetTableState).toHaveBeenCalledWith({
        ...tableState,
        searchBy: "new search"
      });
    });
  });
});