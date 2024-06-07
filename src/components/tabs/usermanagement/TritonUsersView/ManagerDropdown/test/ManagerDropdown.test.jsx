import { ManagerDropdown } from "../ManagerDropdown";
import { ManagerModal } from "usermanagement/ManagerModal";
import { ManagerDelete } from "usermanagement/ManagerDelete";
import { Dropdown } from "components/Dropdown";
import { IconWrapper } from "usermanagement/ManagerDropdown.Styles";
import {
  useAdminState, useAdminDispatch
} from "context/appContext";
import { Modal } from "@mui/material";
import React from "react";
import { sortManagersByName } from "utils/_sortUtils";
import {
  act,
  render,
  setupMockedComponents,
  initialTestState as initialState,
  waitFor
} from "testUtils";
import { theme } from "globals/theme";
import { ThemeProvider } from "styled-components";

jest.mock("components/Dropdown", () => ({
  Dropdown: jest.fn()
}));

jest.mock("usermanagement/ManagerModal", () => ({
  ManagerModal: jest.fn()
}));

jest.mock("usermanagement/ManagerDelete", () => ({
  ManagerDelete: jest.fn()
}));

jest.mock("context/appContext", () => ({
  useAdminState: jest.fn(),
  useAdminDispatch: jest.fn()
}));

jest.mock("usermanagement/ManagerDropdown.Styles", () => ({
  Label: jest.requireActual("../ManagerDropdown.Styles").Label,
  IconWrapper: jest.fn(),
  Wrapper: jest.requireActual("../ManagerDropdown.Styles").Wrapper
}));

jest.mock("@mui/material", () => ({
  Modal: jest.fn()
}));

const mockManagerData = [
  {
    manager_n_num: "n0444444",
    manager_first_name: "Faith",
    manager_last_name: "Cuneo"
  },
  {
    manager_n_num: "n0333333",
    manager_first_name: "Christine",
    manager_last_name: "Haley"
  },
  {
    manager_n_num: "n0555555",
    manager_first_name: "Michael",
    manager_last_name: "Nieman"
  },
  {
    manager_n_num: "n0555555",
    manager_first_name: "Michael",
    manager_last_name: "Nieman"
  },
  {
    manager_n_num: "n0222222",
    manager_first_name: "Ben",
    manager_last_name: "Redman"
  }
];

const mockAdminDispatch = jest.fn();

const sortedManagers = [ ...mockManagerData ].sort(sortManagersByName);

const initialTestState  = {
  ...initialState,
  managerContext: { managers: mockManagerData }
};

const renderComponent = () => render(
  <ThemeProvider theme={theme}>
    <ManagerDropdown />
  </ThemeProvider>
);

describe("<ManagerDropdown />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAdminState.mockReturnValue(initialTestState);
    useAdminDispatch.mockReturnValue(mockAdminDispatch);
    setupMockedComponents({
      Dropdown,
      IconWrapper,
      ManagerDelete,
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
        label: `${manager.manager_first_name} ${manager.manager_last_name} | ${manager.manager_n_num}`,
        value: manager.manager_n_num
      }))
    ]);
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
    expect(mockAdminDispatch).toHaveBeenCalledTimes(1);
    expect(mockAdminDispatch).toHaveBeenCalledWith({
      type: "updateManagerFilter",
      payload: selection.value
    });
  });
  describe("Add Manger Modal", () => {
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
      render(
        <ThemeProvider theme={theme}>
          { Modal.mock.calls[2][0].children }
        </ThemeProvider>
      );
      act(() => {
        Modal.mock.calls[2][0].onClose();
        Modal.mock.calls[3][0].onClose();
        ManagerModal.mock.calls[0][0].handleClose();
      });
      expect(Modal.mock.calls[1][0].open).toBe(false);
    });
  });
  describe("Custom Render", () => {
    describe("Non Manager Option is passed through", () => {
      test("show-all renders as expected", () => {
        const option = {
          label: "Show All",
          value: "show-all"
        };
        renderComponent();
        act(() => Dropdown.mock.calls[0][0].updateValue(null, option));
        expect(mockAdminDispatch).toHaveBeenCalledTimes(1);
        expect(mockAdminDispatch).toHaveBeenCalledWith({
          type: "updateManagerFilter",
          payload: null
        });
        const rendered = render(Dropdown.mock.calls[0][0].CustomRender({ option }));
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
        const option = {
          label: "divider",
          value: "divider"
        };
        renderComponent();
        const rendered = render(Dropdown.mock.calls[0][0].CustomRender({ option }));
        act(() => Dropdown.mock.calls[0][0].updateValue(null, option));
        const button = rendered.queryByTestId("edit-button");
        expect(button).toBe(null);
        expect(rendered.container).toHaveTextContent("divider");
      });
    });
    describe("Delete Manger Modal", () => {
      test("When delete icon is clicked, delete Manager Modal Is opened", async () => {
        const managerOption = {
          value: "n0555555",
          label: "Michael Nieman"
        };
        renderComponent();
        const customRender = Dropdown.mock.calls[0][0].CustomRender({ option: managerOption });
        render(customRender);
        const deleteOnClick = IconWrapper.mock.calls[1][0].onClick;
        act(() => deleteOnClick(managerOption));
        act(() => render(Modal.mock.calls[3][0].children));
        await waitFor(() => {
          expect(ManagerDelete.mock.calls[0][0].selectedManager).toBe(initialTestState.managerContext.managers[2]);
        });
      });
      test("When delete manager handleClose is called, modal is closed", async () => {
        const managerOption = {
          value: "n0555555",
          label: "Michael Nieman"
        };
        renderComponent();
        const customRender = Dropdown.mock.calls[0][0].CustomRender({ option: managerOption });
        render(customRender);
        const deleteOnClick = IconWrapper.mock.calls[1][0].onClick;
        act(() => deleteOnClick(managerOption));
        act(() => render(Modal.mock.calls[3][0].children));
        await waitFor(() => {
          expect(ManagerDelete.mock.calls[0][0].selectedManager).toBe(initialTestState.managerContext.managers[2]);
        });
        act(() => ManagerDelete.mock.calls[0][0].handleClose());
        expect(Modal.mock.calls.length).toBe(6);
        expect(Modal.mock.calls[5][0].open).toBe(false);
      });
    });
    describe("Edit Manager Modal", () => {
      test("When edit icon is clicked, ManagerModal Is opened", async () => {
        const managerOption = {
          value: "n0555555",
          label: "Michael Nieman"
        };
        renderComponent();
        const customRender = Dropdown.mock.calls[0][0].CustomRender({ option: managerOption });
        render(customRender);
        const editOnClick = IconWrapper.mock.calls[0][0].onClick;
        act(() => editOnClick(managerOption));
        act(() => render(Modal.mock.calls[2][0].children));
        await waitFor(() => {
          expect(ManagerModal.mock.calls[0][0].selectedManager).toBe(initialTestState.managerContext.managers[2]);
        });
      });
      test("When edit manager handleClose is called, modal is closed", async () => {
        const managerOption = {
          value: "n0555555",
          label: "Michael Nieman"
        };
        renderComponent();
        const customRender = Dropdown.mock.calls[0][0].CustomRender({ option: managerOption });
        render(customRender);
        const editOnClick = IconWrapper.mock.calls[0][0].onClick;
        act(() => editOnClick(managerOption));
        act(() => render(Modal.mock.calls[2][0].children));
        await waitFor(() => {
          expect(ManagerModal.mock.calls[0][0].selectedManager).toBe(initialTestState.managerContext.managers[2]);
        });
        act(() => ManagerModal.mock.calls[0][0].handleClose());
        expect(Modal.mock.calls.length).toBe(6);
        expect(Modal.mock.calls[5][0].open).toBe(false);
      });
    });
  });
});
