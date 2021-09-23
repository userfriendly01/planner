import ManagementHeader from "../ManagementHeader";
import {
  ManagerFilter,
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

jest.mock("components/usermanagement", () => ({
  __esModule: true,
  ManagerFilter: jest.fn(),
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
      ManagerFilter,
      ResetSkillsButton,
      SearchBox
    });
  });

  test("upon initial render, should render ManagerFilter with correct props and SearchBox with correct props, and ResetSkillsButton", () => {
    const rendered = renderComponent();

    expectMockedComponent(rendered, { ManagerFilter });
    expectOnlyPassedProps(ManagerFilter, { filterBy });
    getMockedComponentProps(ManagerFilter).setFilter();
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
