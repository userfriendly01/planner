import ManagementFilter from "../ManagementFilter";
import React from "react";
import {
  act,
  fireEvent,
  render
} from "testUtils";
import { initialState } from "context";


jest.mock("components", () => ({
  __esModule: true,
  AddUserModal: jest.fn(),
  AddManagerModal: jest.fn()
}));

const filterBy = "";
const setFilter = jest.fn();
const mockManagerData = [
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
];

const initialTestState  = {
  ...initialState,
  managerContext: {
    managers: mockManagerData
  },
  isAddUserModalOpen: false,
  isAddManagerModalOpen: false
};

const renderComponent = () => {
  return render(
    <ManagementFilter
      filterBy={filterBy}
      setFilter={setFilter}
    />, initialTestState);
};


describe("<ManagementFilter />", () => {
  beforeEach(() => {
  });
  test("upon initial render, all managers should be listed in the dropdown", () => {
    const rendered = renderComponent();
    expect(rendered.container).toHaveTextContent("Manager Filter");
    expect(rendered.container).toHaveTextContent("Add Manager");
    expect(rendered.container).toHaveTextContent("Add User");
    expect(rendered.getByText("Show All", { selector: "option" })).toBeInTheDocument();
    expect(rendered.getByText("Ben Redman", { selector: "option" })).toBeInTheDocument();
    expect(rendered.getByText("Christine Haley", { selector: "option" })).toBeInTheDocument();
    expect(rendered.getByText("Faith Cuneo", { selector: "option" })).toBeInTheDocument();
    expect(rendered.getByText("Michael Nieman", { selector: "option" })).toBeInTheDocument();
    expect(rendered.getByText("Add Manager", { selector: "button" })).toBeInTheDocument();
    expect(rendered.getByText("Add User", { selector: "button" })).toBeInTheDocument();


  });
  test("when you click on the add manager button, the manager modal is opened", () => {
    const rendered = renderComponent();
    //expect(rendered.container).toBe({})
    const button = rendered.getByText("Add Manager", { selector: "button" });
    //expect(button).toBe({})
    act(() => {
      fireEvent.click(button);
    });
    expect(rendered.getAllByText("ModalNNumber").length).toBe(1);
    //expect("isAddManagerModalOpen").toBe(true);
  });
  test("when you click on the add user button, the user modal is opened", () => {
    // const rendered = doRender();
    // const addUserButton = rendered.getByText("Add User");
    // fireEvent.click(addUserButton);
  });
  test("when you click on the add user close button, the user modal is closed", () => {
  });
  test("when you click on a manager, the onChange action is dispatched and setFilter is activated", () => {
  });
});