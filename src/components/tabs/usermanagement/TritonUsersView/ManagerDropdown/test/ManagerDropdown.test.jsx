import ManagerDropdown from "../ManagerDropdown";
import {
  Dropdown,
  ManagerModal
} from "components";
import { useAdminState } from "context";
import { Modal } from "@mui/material";
import React from "react";
import { sortManagersByName } from "utils";
import {
  act,
  fireEvent,
  render,
  setupMockedComponents,
  initialTestState as initialState
} from "testUtils";
import { theme } from "globals";
import { ThemeProvider } from "styled-components";

jest.mock("components", () => ({
  Dropdown: jest.fn(),
  ManagerModal: jest.fn()
}));

jest.mock("context", () => ({
  useAdminState: jest.fn()
}));

jest.mock("@mui/material", () => ({
  Modal: jest.fn()
}));

const filterBy = "show-all";
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

const sortedManagers = [ ...mockManagerData ].sort(sortManagersByName);

const initialTestState  = {
  ...initialState,
  managerContext: { managers: mockManagerData }
};

const renderComponent = () => render(
  <ThemeProvider theme={theme}>
    <ManagerDropdown filterBy={filterBy} setFilter={setFilter} />
  </ThemeProvider>
);

describe("<ManagerDropdown />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAdminState.mockReturnValue(initialTestState);
    setupMockedComponents({
      Dropdown,
      ManagerModal,
      Modal
    });
    jest.clearAllMocks();
  });
  test("upon initial render, should display Manager Filter,  add user button, and all managers should be listed in the dropdown sorted by first name", () => {
    renderComponent();
    expect(Dropdown.mock.calls[0][0].label).toBe("Manager Dropdown");
    expect(Dropdown.mock.calls[0][0].options).toStrictEqual([
      {
        label: "Show All",
        value: "show-all"
      },
      {
        label: "Add Manager",
        value: "add-manager"
      },
      {
        label: "divider",
        value: "divider"
      },
      ...sortedManagers.map(manager => ({
        label: `${manager.manager_first_name} ${manager.manager_last_name} | ${manager.manager_n_number}`,
        value: manager.manager_n_number
      }))
    ]);
    expect(Dropdown.mock.calls[0][0].value).toStrictEqual({
      value: "show-all",
      label: "Show All"
    });
  });

  test("When an option is clicked in the filter, the setFilter method is fired with the correct parameters", () => {
    const selection = {
      label: "Faith Cuneo | n0444444",
      value: "n0444444"
    };
    renderComponent();
    act(() => {
      Dropdown.mock.calls[0][0].updateValue(null, selection);
    });
    expect(setFilter).toHaveBeenCalledWith(selection.value);
  });

  test("When filterBy is add-manager, the Add Manager Modal is set to open", () => {
    const selection = {
      label: "Add Manager",
      value: "add-manager"
    };
    renderComponent();
    act(() => {
      Dropdown.mock.calls[0][0].updateValue(null, selection);
    });
    expect(Modal.mock.calls[2][0].open).toBe(true);
  });

  test("When the Modal is closed, the handle close function is called", () => {
    const selection = {
      label: "Add Manager",
      value: "add-manager"
    };
    renderComponent();
    act(() => {
      Dropdown.mock.calls[0][0].updateValue(null, selection);
    });
    expect(setFilter).toHaveBeenCalledWith(selection.value);
    render(
      <ThemeProvider theme={theme}>
        { Modal.mock.calls[2][0].children }
      </ThemeProvider>
    );
    act(() => {
      ManagerModal.mock.calls[0][0].handleClose();
    });
    expect(setFilter.mock.calls[1][0]).toBe("show-all");
    expect(Modal.mock.calls[1][0].open).toBe(false);
  });

  describe("Custom Render", () => {
    describe("Non Manager Option is passed through", () => {
      test("show-all renders as expected", () => {
        renderComponent();
        const rendered = render(Dropdown.mock.calls[0][0].CustomRender({
          option: {
            label: "Show All",
            value: "show-all"
          }
        }));
        const button = rendered.queryByTestId("edit-button");
        expect(button).toBe(null);
        expect(rendered.container).toHaveTextContent("Show All");
      });
      test("add-manager renders as expected", () => {
        renderComponent();
        const rendered = render(Dropdown.mock.calls[0][0].CustomRender({
          option: {
            label: "Add Manager",
            value: "add-manager"
          }
        }));
        const button = rendered.queryByTestId("edit-button");
        expect(button).toBe(null);
        expect(rendered.container).toHaveTextContent("Add Manager");
      });
      test("divider renders as expected", () => {
        renderComponent();
        const rendered = render(Dropdown.mock.calls[0][0].CustomRender({
          option: {
            label: "divider",
            value: "divider"
          }
        }));
        const button = rendered.queryByTestId("edit-button");
        expect(button).toBe(null);
        expect(rendered.container).toHaveTextContent("divider");
      });
    });
    describe("Manager Option is passed through", () => {
      test("The Custom Render Options is rendered as expected", () => {
        renderComponent();
        const rendered = render(
          <ThemeProvider theme={theme}>{
            Dropdown.mock.calls[0][0].CustomRender({
              option: {
                label: `${mockManagerData[0].manager_first_name} ${mockManagerData[0].manager_last_name}`,
                value: mockManagerData[0].manager_n_number
              }
            })}
          </ThemeProvider>
        );
        const button = rendered.getByTestId("edit-button");
        expect(button);
        expect(rendered.container).toHaveTextContent("Faith Cuneo");
      });
      test("Clicking the edit Icon on the custom render will open the manager Modal", () => {
        renderComponent();
        const rendered = render(
          <ThemeProvider theme={theme}>{
            Dropdown.mock.calls[0][0].CustomRender({
              option: {
                label: `${mockManagerData[0].manager_first_name} ${mockManagerData[0].manager_last_name}`,
                value: mockManagerData[0].manager_n_number
              }
            })}
          </ThemeProvider>
        );
        const button = rendered.getByTestId("edit-button");
        expect(button);
        fireEvent.click(button);
        expect(Modal.mock.calls[2][0].open).toBe(true);
      });
    });
  });
});
