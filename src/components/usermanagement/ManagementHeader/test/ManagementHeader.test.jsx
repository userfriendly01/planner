import ManagementHeader from "../ManagementHeader";
import {
  AddUser,
  ManagerFilter,
  ResetSkillsButton,
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
  ResetSkillsButton: jest.fn(),
  SearchBox: jest.fn()
}));

const filterBy = "";
const searchBy = "";
const setFilter = jest.fn();
const setSearch = jest.fn();

const renderComponent = () => {
  return render(
    <ManagementHeader
      filterBy={filterBy}
      searchBy={searchBy}
      setFilter={setFilter}
      setSearch={setSearch}
    />);
};

describe("<ManagementHeader />", () => {
  beforeEach(() => {
    setupMockedComponents({
      AddUser,
      ManagerFilter,
      ResetSkillsButton,
      SearchBox
    });
  });

  test("upon initial render, should display Manager Filter & add user buttons, and all managers should be listed in the dropdown sorted by first name", () => {
    const rendered = renderComponent();
    expectMockedComponent(rendered, { AddUser });
    expectMockedComponent(rendered, { ManagerFilter });
    expectMockedComponent(rendered, { ResetSkillsButton });
    expectMockedComponent(rendered, { SearchBox });
  });
});
