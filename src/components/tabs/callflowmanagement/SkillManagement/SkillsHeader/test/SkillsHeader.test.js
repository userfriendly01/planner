import SkillsHeader from "../SkillsHeader";
import { getAuthenticationProfileTemplates } from "authentication";
import { SearchBox } from "components/tabs/usermanagement";
import React from "react";
import {
  Dropdown,
  ExportButton
} from "components";
import { useAdminState } from "context";
import {
  act,
  authenticationProfileTemplates,
  render,
  expectOnlyPassedProps,
  skillsList,
  setupMockedComponents,
  initialTestState,
  profileList
} from "testUtils";

jest.mock("components/tabs/usermanagement", () => ({
  SearchBox: jest.fn()
}));

jest.mock("components", () => ({
  Dropdown: jest.fn(),
  ExportButton: jest.fn(),
  StyledButton: jest.fn()
}));

jest.mock("context", () => ({
  useAdminState: jest.fn()
}));

const mockSetTableState = jest.fn();
const tableState = {
  searchBy: "searchy",
  selected: [skillsList[0]],
  profiles: [{
    label: "Profile 1",
    value: 1
  }]
};

const renderComponent = () => {
  const rendered = render(<SkillsHeader
    tableState={tableState}
    setTableState={mockSetTableState}
  />);
  return rendered;
};

describe("<SkillsHeader />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getAuthenticationProfileTemplates.mockReturnValue(authenticationProfileTemplates);
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
        selected: tableState.selected
      });
    });
    describe("user is admin", () => {
      beforeEach(() => {
        useAdminState.mockReturnValue({
          ...initialTestState,
          userContext: {
            ...initialTestState.userContext,
            authenticationProfiles: [
              {
                ...initialTestState.userContext.authenticationProfiles[0],
                isAdmin: true
              }
            ]
          }
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
              label: p.profile_nme,
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
          selected: tableState.selected
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
                label: profileList[1].profile_nme,
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
                label: profileList[1].profile_nme,
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
            authenticationProfiles: [
              {
                ...initialTestState.userContext.authenticationProfiles[0],
                isAdmin: false
              }
            ]
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
          selected: tableState.selected
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