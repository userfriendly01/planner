import ManagerDelete from "../ManagerDelete";
import { CloseRounded } from "@mui/icons-material";
import {
  Dropdown,
  ModalNNumber,
  ModalOverlay,
  PaperContainer,
  StyledButton,
  CustomToast
} from "components";
import {
  useAdminDispatch,
  useAdminState
} from "context";
import React from "react";
import { act } from "react-dom/test-utils";
import { deleteManager } from "services";
import {
  expectMockedComponent,
  expectOnlyPassedProps,
  getLastInstanceCalled,
  getMockedComponentProps,
  render,
  setupMockedComponents,
  waitFor
} from "testUtils";

jest.useFakeTimers();

jest.mock("@mui/icons-material", () => ({
  __esModule: true,
  CloseRounded: jest.fn()
}));

jest.mock("context", () => ({
  useAdminState: jest.fn(),
  useAdminDispatch: jest.fn()
}));

jest.mock("services", () => ({
  __esModule: true,
  addManager: jest.fn(),
  editManager: jest.fn(),
  deleteManager: jest.fn(),
  FetchUserResponse: jest.requireActual("services").FetchUserResponse
}));

jest.mock("components", () => ({
  __esModule: true,
  CustomToast: jest.fn(),
  Dropdown: jest.fn(),
  ModalNNumber: jest.fn(),
  ModalOverlay: jest.fn(),
  PaperContainer: jest.fn(),
  StyledButton: jest.fn()
}));

const mockDispatch = jest.fn();
const mockHandleClose = jest.fn();
const renderComponent = selectedManager => render(
  <ManagerDelete handleClose={mockHandleClose}
    selectedManager={selectedManager}
  />
);

const defaultAdminState = {
  profileContext: {
    profiles: [{
      profile_id: 4
    }]
  },
  managerContext: {
    managers: [
      {
        manager_id: 3,
        manager_n_number: "n0262226"
      },
      {
        manager_id: 10,
        manager_n_number: "n0263786"
      }
    ]
  },
  workerContext: {
    workers: [
      {
        attributes: {
          emp_first_name: "Warren",
          emp_last_name: "Spencer",
          manager_n_number: "n0262226"
        }
      },
      {
        attributes: {
          emp_first_name: "Calista",
          emp_last_name: "Flockhart",
          manager_n_number: "n0262226"
        }
      },
      {
        attributes: {
          emp_first_name: "Shania",
          emp_last_name: "Twain"
        }
      }
    ]
  }
};

describe("<ManagerDelete />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setupMockedComponents({
      Dropdown,
      CloseRounded,
      ModalNNumber,
      ModalOverlay,
      StyledButton
    });
    PaperContainer.mockClear();
    PaperContainer.mockImplementation(props => <div>{props.children}</div>);
    mockHandleClose.mockClear();
    useAdminDispatch.mockReturnValue(mockDispatch);
    useAdminState.mockReturnValue(defaultAdminState);
  });

  const managerObject = manager => {
    return { manager_n_number: manager };
  };

  describe("initial state of the confirmation modal", () => {
    test("should render StyledButton and CloseRounded once each, but not ModalOverlay", () => {
      const rendered = renderComponent(managerObject("n0263786"));
      expectMockedComponent(rendered, { StyledButton });
      expectMockedComponent(rendered, { CloseRounded });
      expect(rendered.queryAllByText("ModalOverlay").length).toBe(0);
    });
  });
  describe("should render with empty data sets", () => {
    test("should render empty divs when there's no manager", () => {
      renderComponent(null);
    });
    test("should render with no workers", () => {
      useAdminState.mockReturnValue({
        ...defaultAdminState,
        workerContext: {
          workers: []
        }
      });
      renderComponent(managerObject("n0262226"));
    });
  });
  describe("manager does not have any workers on their team", () => {
    test("confirmation dialog is displayed", () => {
      const rendered = renderComponent(managerObject("n0263786"));
      const textBox = rendered.getByTestId("delete-confirmation-textbox");
      expect(textBox).toHaveTextContent("Are you sure you want to delete this manager?");
    });
    describe("'Delete Manager' button is clicked", () => {
      describe("call to delete the manager succeeds", () => {
        beforeEach(() => {
          deleteManager.mockResolvedValue({ good: "to go" });
        });
        test("modalOverlay should render with 'Manager deleted successfully' & modal should close after 2 seconds (handleClose should be called)", async () => {
          const rendered = renderComponent(managerObject("n0263786"));
          const { onClick } = getMockedComponentProps(StyledButton, getLastInstanceCalled(StyledButton));
          act(() => onClick());
          act(() => jest.runAllTimers());
          await waitFor(() => {
            expectMockedComponent(rendered, { ModalOverlay });
            expectOnlyPassedProps(ModalOverlay, {
              status: "success",
              message: "Manager deleted successfully"
            });
            expect(mockHandleClose).toHaveBeenCalledTimes(1);
          });
        });
      });
      describe("call to delete the manager fails", () => {
        const errorResp = { nope: "2 minutes for elbowing!" };
        beforeEach(() => deleteManager.mockRejectedValue(errorResp));
        test("modalOverlay should render with 'Failed to delete Manager' & modal should close after 2 seconds (handleClose should be called)", async () => {
          const rendered = renderComponent(managerObject("n0263786"));
          const { onClick } = getMockedComponentProps(StyledButton, getLastInstanceCalled(StyledButton));
          act(() => onClick());
          act(() => jest.runAllTimers());
          await waitFor(() => {
            expectOnlyPassedProps(ModalOverlay, {
              status: "fail",
              message: "Failed to delete Manager"
            });
            expect(mockHandleClose).toHaveBeenCalledTimes(0);
            expectMockedComponent(rendered, { ModalOverlay }, 0);
          });
        });
      });
    });
  });
  describe("manager has existing workers on their team", () => {
    test("the error dialog is displayed", async () => {
      const rendered = renderComponent(managerObject("n0262226"));
      const textBox = rendered.getByTestId("team-members-error-textbox");
      expect(textBox).toHaveTextContent("Sorry, this manager cannot be deleted until these team members are re-assigned:");
      const penaltyBox = rendered.getByTestId("team-members-error-penaltybox");
      expect(penaltyBox).toHaveTextContent("Warren Spencer, Calista Flockhart");
    });
  });
});
