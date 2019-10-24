import ManagementFilter from "../ManagementFilter";
import {
  AddUser,
  ManagerFilter,
  SearchBox
} from "components";
import React from "react";
import {
  expectMockedComponent,
  render,
  setupMockedComponents
} from "testUtils";

jest.mock("components/usermanagement", () => ({
  __esModule: true,
  AddUser: jest.fn(),
  ManagerFilter: jest.fn(),
  SearchBox: jest.fn()
}));

const filterBy = "";
const searchBy = "";
const setFilter = jest.fn();
const setSearch = jest.fn();

const renderComponent = () => {
  return render(
    <ManagementFilter
      filterBy={filterBy}
      searchBy={searchBy}
      setFilter={setFilter}
      setSearch={setSearch}
    />);
};

describe("<ManagementFilter />", () => {
  beforeEach(() => {
    setupMockedComponents({
      AddUser,
      ManagerFilter,
      SearchBox
    });
  });

  test("upon initial render, should display Manager Filter, add manager & add user buttons, and all managers should be listed in the dropdown sorted by first name", () => {
    const rendered = renderComponent();
    expectMockedComponent(rendered, { AddUser });
    expectMockedComponent(rendered, { ManagerFilter });
    expectMockedComponent(rendered, { SearchBox });
  });
});
