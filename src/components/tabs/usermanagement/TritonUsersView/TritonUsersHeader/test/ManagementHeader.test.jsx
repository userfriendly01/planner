import ManagementHeader from "../TritonUsersHeader";
import {
  ManagerDropdown,
  ResetSkillsButton,
  SearchBox
} from "components";
import React from "react";
import {
  expectMockedComponent,
  expectOnlyPassedProps,
  getMockedComponentProps,
  render,
  setupMockedComponents
} from "testUtils";

jest.mock("components", () => ({
  __esModule: true,
  ManagerDropdown: jest.fn(),
  ResetSkillsButton: jest.fn(),
  SearchBox: jest.fn(),
  StyledButton: jest.fn()
}));

const filterBy = "who cares";
const searchBy = "i don't care";
const setFilter = jest.fn();
const setSearch = jest.fn();
const setUserModalState = jest.fn();

const renderComponent = () => {
  return render(
    <ManagementHeader
      filterBy={filterBy}
      searchBy={searchBy}
      setFilter={setFilter}
      setSearch={setSearch}
      setUserModalState={setUserModalState}
    />);
};

describe("<ManagementHeader />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setupMockedComponents({
      ManagerDropdown,
      ResetSkillsButton,
      SearchBox
    });
  });

  test("upon initial render, should render ManagerDropdown with correct props and SearchBox with correct props, and ResetSkillsButton", () => {
    const rendered = renderComponent();

    expectMockedComponent(rendered, { ManagerDropdown });
    expectOnlyPassedProps(ManagerDropdown, { filterBy });
    getMockedComponentProps(ManagerDropdown).setFilter();
    expect(setFilter).toHaveBeenCalledTimes(1);

    expectMockedComponent(rendered, { ResetSkillsButton });

    expectMockedComponent(rendered, { SearchBox });
    expectOnlyPassedProps(SearchBox, { searchBy });
    getMockedComponentProps(SearchBox).setSearch();
    expect(setSearch).toHaveBeenCalledTimes(1);
  });
});
