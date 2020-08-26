import ManagerFilter from "../ManagerFilter";
import { AddManagerModal } from "components";
import { initialState } from "context";
import React from "react";
import {
  act,
  expectMockedComponent,
  fireEvent,
  render,
  setupMockedComponents
} from "testUtils";

jest.mock("components/usermanagement", () => ({
  __esModule: true,
  AddManagerModal: jest.fn()
}));

const filterBy = "";
const setFilter = jest.fn();
const mockManagerData = [
  {
    manager_n_number: "n0444444",
    manager_first_name: "Faith",
    manager_last_name: "Cuneo"
  },
  {
    manager_n_number: "n0333333",
    manager_first_name: "Christine",
    manager_last_name: "Haley"
  },
  {
    manager_n_number: "n0555555",
    manager_first_name: "Michael",
    manager_last_name: "Nieman"
  },
  {
    manager_n_number: "n0555555",
    manager_first_name: "Michael",
    manager_last_name: "Nieman"
  },
  {
    manager_n_number: "n0222222",
    manager_first_name: "Ben",
    manager_last_name: "Redman"
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
    <ManagerFilter
      filterBy={filterBy}
      setFilter={setFilter}
    />, initialTestState);
};

describe("<ManagementHeader />", () => {
  beforeEach(() => {
    setupMockedComponents({
      AddManagerModal
    });
  });

  test("upon initial render, should display Manager Filter, add manager & add user buttons, and all managers should be listed in the dropdown sorted by first name", () => {
    const rendered = renderComponent();
    expect(rendered.container).toHaveTextContent("Manager Filter");
    expect(rendered.queryAllByTestId("manager-list")[0]).toHaveTextContent("Show All");
    expect(rendered.queryAllByTestId("manager-list")[1]).toHaveTextContent("Ben Redman");
    expect(rendered.queryAllByTestId("manager-list")[2]).toHaveTextContent("Christine Haley");
    expect(rendered.queryAllByTestId("manager-list")[3]).toHaveTextContent("Faith Cuneo");
    expect(rendered.queryAllByTestId("manager-list")[4]).toHaveTextContent("Michael Nieman");
    expect(rendered.queryAllByTestId("manager-list")[5]).toHaveTextContent("Michael Nieman");
  });

  test("when you click on the add manager button, the manager modal is rendered. When you call handleClose, the modal is no longer rendered", () => {
    const rendered = renderComponent();
    const button = rendered.getByTestId("add-manager-button", { selector: "button" });
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
