import ManagementHeader from "../ManagementHeader";
import {
  ManagerDropdown,
  ResetSkillsButton,
  SearchBox
} from "components";
import React from "react";
import {
  expectMockedComponent,
  expectOnlyPassedProps,
  fireEvent,
  getMockedComponentProps,
  render,
  setupMockedComponents
} from "testUtils";
import { theme } from "globals";
import { ThemeProvider } from "styled-components";

jest.mock("components/tabs/usermanagement", () => ({
  __esModule: true,
  ManagerDropdown: jest.fn(),
  ResetSkillsButton: jest.fn(),
  SearchBox: jest.fn()
}));

const filterBy = "who cares";
const searchBy = "i don't care";
const setFilter = jest.fn();
const setSearch = jest.fn();
const setUserModalState = jest.fn();

const renderComponent = () => {
  return render(
    <ThemeProvider theme={theme}>
      <ManagementHeader
        filterBy={filterBy}
        searchBy={searchBy}
        setFilter={setFilter}
        setSearch={setSearch}
        setUserModalState={setUserModalState}
      />
    </ThemeProvider>
  );
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

  test("when Add User button is clicked setUserEntryFormState is called", () => {
    const rendered = renderComponent();
    const addUserButtonElement = rendered.getByText("Add User");
    fireEvent.click(addUserButtonElement);
    expect(setUserModalState).toHaveBeenCalledWith({
      open: true,
      worker: null
    });
  });
});
