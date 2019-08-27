import ManagementFilter from "../ManagementFilter";
import React from "react";
import {
  act,
  expectMockedComponent,
  fireEvent,
  render,
  setupMockedComponents
} from "testUtils";
import {
  AddUserModal,
  AddManagerModal
} from "components";
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
    setupMockedComponents({
      AddManagerModal,
      AddUserModal
    });
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

  test("when you click on the add manager button, the manager modal is rendered. When you call handleClose, the modal is no longer rendered", () => {
    const rendered = renderComponent();
    const button = rendered.getByText("Add Manager", { selector: "button" });
    expectMockedComponent(rendered, { AddManagerModal }, 0);
    act(() => {
      fireEvent.click(button);
    });
    expectMockedComponent(rendered, { AddManagerModal }, 1);
    const handleClose = AddManagerModal.mock.calls[0][0].handleClose;
    act(() => {
      handleClose();
    });
    expectMockedComponent(rendered, { AddManagerModal }, 0);
  });
  test("when you click on the add user button, the user modal is rendered. When you call handleClose, the modal is no longer rendered", () => {
    const rendered = renderComponent();
    const button = rendered.getByText("Add User", { selector: "button" });
    expectMockedComponent(rendered, { AddUserModal }, 0);
    act(() => {
      fireEvent.click(button);
    });
    expectMockedComponent(rendered, { AddUserModal }, 1);
    const handleClose = AddUserModal.mock.calls[0][0].handleClose;
    act(() => {
      handleClose();
    });
    expectMockedComponent(rendered, { AddUserModal }, 0);
  });
  test("When an option is clicked in the filter, the setFilter method is fired with the correct parameters", () => {
    const rendered = renderComponent();
    const select = rendered.getByTestId("select");
    const expectedTarget = "n0222222";
    act(() => {
      fireEvent.change(select, { target: { value: expectedTarget }});
    });
    expect(setFilter).toHaveBeenCalledWith(expectedTarget);
  });
});