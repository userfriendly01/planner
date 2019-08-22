import ManagementFilter from "../ManagementFilter";
import React from "react";
import { render } from "testUtils";
import { useAdminState } from "context";


const filterBy = "";
const setFilter = jest.fn();
//Need to figure out how to pass in this mocked data so that the component is rendered. Right now, I think it's being overridden with the test useAdminState method

jest.mock("context", () => ({
  useAdminState: jest.fn()
}));

const mockManagerData = {
  managers: [
    {
      manager_n_number: "n0222222",
      manager_first_name: "Ben",
      manager_last_name: "Redman"
    },
    {
      manager_n_number: "n0333333",
      manager_first_name: "Christine",
      manager_last_name: "Haley"
    },
    {
      manager_n_number: "n0444444",
      manager_first_name: "Faith",
      manager_last_name: "Cuneo"
    },
    {
      manager_n_number: "n0555555",
      manager_first_name: "Michael",
      manager_last_name: "Nieman"
    }
  ]
};

describe("<ManagementFilter />", () => {
  beforeEach(() => {
    useAdminState.mockClear();
    useAdminState.mockImplementation(() => mockManagerData);
  });
  test("upon initial render, all employees should be listed in the table", () => {
    const rendered = render(<ManagementFilter filterBy={filterBy} setFilter={setFilter}/>);
    expect(rendered.container).toHaveTextContent("Manager Filter");
    expect(rendered.container).toHaveTextContent("Add Manager");
    expect(rendered.container).toHaveTextContent("Add User");
    expect(rendered.getByText("Show All", { selector: "option" })).toBeInTheDocument();
    expect(rendered.getByText("Ben", { selector: "option" })).toBeInTheDocument();

  });
  test("when you click on the filter, the managers are displayed", () => {
  });
  test("when you click on a manager in the filter, only the managers employees are displayed", () => {
  });
  test("when you clear the filter, all employees return to the table", () => {
  });
});