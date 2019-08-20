import ManagementFilter from "../ManagementFilter";
import React from "react";
import { render } from "testUtils";
import { useAdminState } from "context";


const filterBy = "";
const setFilter = jest.fn();
const managers = {};

jest.mock("context", () => ({
  useAdminState: jest.fn()
}));

describe("<ManagementFilter />", () => {
  beforeEach(() => {
    useAdminState.mockReturnValue(managers);
  });
  test("upon initial render, all employees should be listed in the table", () => {
    const rendered = render(<ManagementFilter filterBy={filterBy} setFilter={setFilter}/>);
    expect(rendered.container).toHaveTextContent("Manager Filter");
  });
});