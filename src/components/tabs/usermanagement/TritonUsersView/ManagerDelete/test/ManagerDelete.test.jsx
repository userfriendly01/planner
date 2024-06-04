import ManagerDelete from "../ManagerDelete";
import { CloseRounded } from "@mui/icons-material";
import {
  ModalOverlay,
  PaperContainer,
  StyledButton,
  ConfirmationForm,
  ErrorForm
} from "components";
import {
  useAdminDispatch,
  useAdminState
} from "context";
import React from "react";
import { act } from "react-dom/test-utils";
import { deleteManager } from "services";
import {
  expectOnlyPassedProps,
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
  ConfirmationForm: jest.fn(),
  ErrorForm: jest.fn(),
  ModalOverlay: jest.fn(),
  PaperContainer: jest.fn(),
  StyledButton: jest.fn()
}));

const mockDispatch = jest.fn();
const mockHandleClose = jest.fn();
const renderComponent = selectedManager => {
  let rendered;
  rendered = render(
    <ManagerDelete handleClose={mockHandleClose}
      selectedManager={selectedManager}
    />
  );
  if(selectedManager){
    rendered = render(PaperContainer.mock.calls[0][0].children);
  }
  return rendered;
};

const defaultAdminState = {
  profileContext: {
    profiles: [{
      profile_id: 4
    }]
  },
  managerContext: {
    managers: [
      {
        manager_n_num: "n0262226"
      },
      {
        manager_n_num: "n0263786"
      }
    ]
  },
  userContext: {
    nNumber: "n1234567"
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
      CloseRounded,
      ConfirmationForm,
      ErrorForm,
      ModalOverlay,
      PaperContainer,
      StyledButton
    });
    mockHandleClose.mockClear();
    useAdminDispatch.mockReturnValue(mockDispatch);
    useAdminState.mockReturnValue(defaultAdminState);
  });

  const managerObject = manager => {
    return { manager_n_num: manager };
  };

  describe("initial state of ManagerDelete", () => {
    describe("No manager is passed through", () => {
      test("should render empty div", () => {
        renderComponent(null);
        expect(PaperContainer.mock.calls.length).toBe(0);
      });
    });
    describe("No workers are in context", () => {
      beforeEach(() => {
        useAdminState.mockReturnValue({
          ...defaultAdminState,
          workerContext: {
            workers: []
          }
        });
      });
      test("should render Confirmation Form", () => {
        const rendered = renderComponent(managerObject("n0263786"));
        expect(rendered.container).toHaveTextContent("Delete Manager");
        expect(ConfirmationForm.mock.calls.length).toBe(1);
        expect(CloseRounded.mock.calls.length).toBe(1);
        expect(ErrorForm.mock.calls.length).toBe(0);
        expect(ModalOverlay.mock.calls.length).toBe(0);
        expectOnlyPassedProps(CloseRounded, {
          onClick: mockHandleClose
        });
        expectOnlyPassedProps(ConfirmationForm, {
          SelectedManager: {
            manager_n_num: "n0263786"
          }
        });
      });
    });
    describe("No workers are assigned to the manager", () => {
      test("should render Confirmation Form", () => {
        const rendered = renderComponent(managerObject("n0263786"));
        expect(rendered.container).toHaveTextContent("Delete Manager");
        expect(ConfirmationForm.mock.calls.length).toBe(1);
        expect(CloseRounded.mock.calls.length).toBe(1);
        expect(ErrorForm.mock.calls.length).toBe(0);
        expect(ModalOverlay.mock.calls.length).toBe(0);
        expectOnlyPassedProps(CloseRounded, {
          onClick: mockHandleClose
        });
        expectOnlyPassedProps(ConfirmationForm, {
          SelectedManager: {
            manager_n_num: "n0263786"
          }
        });
      });
    });
    describe("Workers are assigned to the manager", () => {
      test("should render Error Form", () => {
        const rendered = renderComponent(managerObject("n0262226"));
        expect(rendered.container).toHaveTextContent("Delete Manager");
        expect(ConfirmationForm.mock.calls.length).toBe(0);
        expect(ErrorForm.mock.calls.length).toBe(1);
        expectOnlyPassedProps(ErrorForm, {
          TeamMembers: "Warren Spencer, Calista Flockhart",
          HandleClose: mockHandleClose
        });
      });
    });
  });

  describe("'Delete Manager' button is clicked", () => {
    describe("call to delete the manager succeeds", () => {
      beforeEach(() => {
        deleteManager.mockResolvedValue({ good: "to go" });
      });
      test("modalOverlay should render with 'Manager deleted successfully' & modal should close after 2 seconds (handleClose should be called)", async () => {
        renderComponent(managerObject("n0263786"));
        const handleDeleteManager = ConfirmationForm.mock.calls[0][0].DeleteManagerClicked;
        act(() => handleDeleteManager());
        await waitFor(() => {
          expect(mockDispatch).toHaveBeenCalledTimes(2);
          expect(mockDispatch).toHaveBeenCalledWith({
            type: "editManager",
            payload: [ defaultAdminState.managerContext.managers[0] ]
          });
          expect(mockDispatch).toHaveBeenCalledWith({
            type: "updateManagerFilter",
            payload: null
          });
        });
        act(() => render(PaperContainer.mock.calls[1][0].children));
        await waitFor(() => {
          expect(ModalOverlay.mock.calls.length).toBe(1);
          expectOnlyPassedProps(ModalOverlay, {
            status: "saving",
            message: "Deleting..."
          });
        });
        act(() => render(PaperContainer.mock.calls[2][0].children));
        await waitFor(() => {
          expect(ModalOverlay.mock.calls.length).toBe(2);
          expectOnlyPassedProps(ModalOverlay, {
            status: "success",
            message: "Manager deleted successfully"
          });
        });
        act(() => jest.runAllTimers());
        await waitFor(() => {
          expect(mockHandleClose).toHaveBeenCalledTimes(1);
        });
      });
    });
    describe("call to delete the manager fails", () => {
      const errorResp = { nope: "2 minutes for elbowing!" };
      beforeEach(() => deleteManager.mockRejectedValue(errorResp));
      test("modalOverlay should render with 'Failed to delete Manager' & modal should close after 2 seconds (handleClose should be called)", async () => {
        renderComponent(managerObject("n0263786"));
        const handleDeleteManager = ConfirmationForm.mock.calls[0][0].DeleteManagerClicked;
        act(() => handleDeleteManager());
        act(() => render(PaperContainer.mock.calls[1][0].children));
        await waitFor(() => {
          expect(ModalOverlay.mock.calls.length).toBe(1);
          expectOnlyPassedProps(ModalOverlay, {
            status: "saving",
            message: "Deleting..."
          });
        });
        expect(PaperContainer.mock.calls.length).toBe(4);
        act(() => render(PaperContainer.mock.calls[3][0].children));
        await waitFor(() => {
          expect(ModalOverlay.mock.calls.length).toBe(2);
          expectOnlyPassedProps(ModalOverlay, {
            status: "fail",
            message: "Failed to delete Manager"
          });
        });
        act(() => jest.runAllTimers());
        await waitFor(() => {
          expect(PaperContainer.mock.calls.length).toBe(5);
          expect(ModalOverlay.mock.calls.length).toBe(2);
        });
      });
    });
  });
});