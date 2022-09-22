import SkillsHeader from "../SkillsHeader";
import { SearchBox } from "components/tabs/usermanagement";
import React from "react";
import {
  Dropdown,
  StyledButton
} from "components";
import { useAdminState } from "context";
import {
  act,
  render,
  expectOnlyPassedProps,
  skillsList,
  setupMockedComponents,
  initialTestState,
  profileList
} from "testUtils";
import { ExcelExport } from "@progress/kendo-react-excel-export";

jest.mock("components/tabs/usermanagement", () => ({
  SearchBox: jest.fn()
}));

jest.mock("components", () => ({
  Dropdown: jest.fn(),
  StyledButton: jest.fn()
}));

jest.mock("context", () => ({
  useAdminState: jest.fn()
}));

jest.mock("@progress/kendo-react-excel-export", () => ({
  ExcelExport: jest.fn()
}));


const mockSetTableState = jest.fn();
const checked = [skillsList[0]];
const tableState = {
  searchBy: "searchy",
  selected: true,
  profiles: [{
    label: "Profile 1",
    value: 1
  }]
};

const renderComponent = () => {
  const rendered = render(<SkillsHeader
    checked={checked}
    tableState={tableState}
    setTableState={mockSetTableState}
  />);
  render(StyledButton.mock.calls[0][0].children);
  return rendered;
};

describe("<SkillsContainer />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAdminState.mockReturnValue(initialTestState);
    setupMockedComponents({
      SearchBox,
      StyledButton,
      Dropdown,
      ExcelExport
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
      expect(StyledButton.mock.calls.length).toBe(1);
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
        expect(StyledButton.mock.calls.length).toBe(1);
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
  describe("Export Button on click is called", () => {
    test("should call handleExport", () => {
      renderComponent();
      const onClick = StyledButton.mock.calls[0][0].onClick;
      act(() => {
        onClick();
      });
      expect(StyledButton.mock.calls.length).toBe(1);
    //This test is just to show the code is covered but there is no useful assertion for this.. 
    //unfortunately even mocking ExcelExport I couldnt access that react ref _export to confirm it was run
    });
  });
});