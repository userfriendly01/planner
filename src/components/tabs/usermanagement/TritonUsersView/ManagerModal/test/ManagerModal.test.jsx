import ManagerModal from "../ManagerModal";
import { CloseRounded } from "@mui/icons-material";
import {
  Dropdown,
  NNumberInput,
  ModalOverlay,
  PaperContainer,
  StyledButton,
  CalabrioTeamModal
} from "components";
import {
  useAdminState,
  useAdminDispatch
} from "context";
import React from "react";
import { act } from "react-dom/test-utils";
import { Modal } from "@mui/material";
import {
  addManager,
  editManager
} from "services";
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
  CloseRounded: jest.fn(),
  AccountBox: jest.fn(),
  Edit: jest.fn(),
  Close: jest.fn(),
  InfoOutlined: jest.fn()
}));

jest.mock("@mui/material", () => ({
  Modal: jest.fn(),
  Paper: jest.fn(),
  TextField: jest.fn(),
  Button: jest.fn(),
  Tab: jest.fn(),
  Tabs: jest.fn(),
  Divider: jest.fn(),
  Checkbox: jest.fn(),
  IconButton: jest.requireActual("@mui/material").IconButton
}));

jest.mock("@mui/x-date-pickers/DatePicker", () => ({
  DatePicker: jest.fn()
}));

jest.mock("@mui/x-data-grid", () => ({
  __esModule: true,
  DataGrid: jest.fn(),
  GridToolbar: jest.fn(),
  GridRenderCellParams: jest.fn()
}));

jest.mock("@mui/x-date-pickers/TimePicker", () => ({
  TimePicker: jest.fn()
}));

jest.mock("services", () => ({
  FetchUserResponse: jest.requireActual("services").FetchUserResponse,
  addManager: jest.fn(),
  editManager: jest.fn()
}));

jest.mock("context", () => ({
  useAdminState: jest.fn(),
  useAdminDispatch: jest.fn()
}));

jest.mock("components", () => ({
  __esModule: true,
  Dropdown: jest.fn(),
  NNumberInput: jest.fn(),
  ModalOverlay: jest.fn(),
  PaperContainer: jest.requireActual("components").PaperContainer,
  StyledButton: jest.fn(),
  CalabrioTeamModal: jest.fn(),
  ComponentControl: jest.fn(),
  ModalFetchingRing: jest.fn()
}));

describe("<ManagerModal />", () => {
  const mockHandleClose = jest.fn();
  const mockSetForm = jest.fn();
  const renderComponent = () => render(<ManagerModal handleClose={mockHandleClose} selectedManager={null} />);
  beforeEach(() => {
    jest.clearAllMocks();
    setupMockedComponents({
      Dropdown,
      CloseRounded,
      NNumberInput,
      ModalOverlay,
      StyledButton,
      CalabrioTeamModal,
      Modal
    });
    useAdminDispatch.mockReturnValue(mockSetForm);
    PaperContainer.mockClear();
    PaperContainer.mockImplementation(props => <div>{props.children}</div>);
    mockHandleClose.mockClear();
    useAdminState.mockReturnValue({
      profileContext: {
        profiles: [{
          profile_id: 4
        }]
      },
      calabrioContext: {
        teams: [{
          groupId: 215,
          name: "Calabrio Group One"
        }]
      },
      managerContext: {
        managers: [
          {
            manager_id: 10,
            manager_n_number: "n0263786"
          },
          {
            manager_id: 3,
            manager_n_number: "n0262226"
          }
        ]
      },
      userContext: {
        pingIdentity: {
          sub: "n0138110"
        }
      }
    });
  });

  describe("initial state of the modal", () => {
    test("should render StyledButton, CloseRounded & NNumberInput once each", () => {
      const rendered = renderComponent();
      expectMockedComponent(rendered, { StyledButton });
      expectMockedComponent(rendered, { CloseRounded });
      expectMockedComponent(rendered, { NNumberInput });
    });
    test("should not render ModalOverlay", () => {
      const rendered = renderComponent();
      expect(rendered.queryAllByText("ModalOverlay").length).toBe(0);
    });
  });

  const updateFormSoValid = (fetchedManager, nNumber) => {
    act(() => {
      getMockedComponentProps(NNumberInput, getLastInstanceCalled(NNumberInput)).onUpdate("n02");
    });
    act(() => {
      getMockedComponentProps(NNumberInput, getLastInstanceCalled(NNumberInput)).onClear();
    });
    act(() => {
      getMockedComponentProps(NNumberInput, getLastInstanceCalled(NNumberInput)).onComplete(fetchedManager, nNumber);
    });
    act(() => {
      Dropdown.mock.calls[6][0].updateValue(null, {
        profile_id: 4
      });
      Dropdown.mock.calls[7][0].updateValue(null, [{
        value: 215
      }]);
    });
    expect(getMockedComponentProps(StyledButton, getLastInstanceCalled(StyledButton)).disabled).toBe(false);
  };

  describe("Add Manager", () => {
    describe("initial state", () => {
      test("should be disabled", () => {
        const rendered = renderComponent();
        expectMockedComponent(rendered, { StyledButton }, 1);
        const { disabled } = getMockedComponentProps(StyledButton);
        expect(disabled).toBe(true);
      });
    });
    describe("Add Manager button is clicked", () => {
      describe("manager is not in list of managers", () => {
        describe("call to add the manager succeeds", () => {
          beforeEach(() => addManager.mockResolvedValue({ good: "to go" }));
          test("ModalOverlay should render with 'Manager added successfully' & modal should close after 2 seconds (handleClose should be called)", async () => {
            const rendered = renderComponent();
            const fetchedManager = {
              firstName: "Bob",
              lastName: "Bobson"
            };
            updateFormSoValid(fetchedManager, "n0000000");
            const { onClick } = getMockedComponentProps(StyledButton, getLastInstanceCalled(StyledButton));
            act(() => onClick());
            act(() => jest.runAllTimers());
            await waitFor(() => {
              expectMockedComponent(rendered, { ModalOverlay });
              expectOnlyPassedProps(ModalOverlay, {
                status: "success",
                message: "Manager saved successfully"
              });
              expect(mockHandleClose).toHaveBeenCalledTimes(1);
            });
          });
          describe("Manager name has an ' ", () => {
            const fetchedManager = {
              firstName: "B'ob",
              lastName: "Bob'son"
            };
            test("should be formatted and saved successfully", async () => {
              const rendered = renderComponent();
              updateFormSoValid(fetchedManager, "n0000000");
              const { onClick } = getMockedComponentProps(StyledButton, getLastInstanceCalled(StyledButton));
              act(() => onClick());
              act(() => jest.runAllTimers());
              await waitFor(() => {
                expectMockedComponent(rendered, { ModalOverlay });
                expectOnlyPassedProps(ModalOverlay, {
                  status: "success",
                  message: "Manager saved successfully"
                });
                expect(mockSetForm).toHaveBeenCalledTimes(2);
                expect(mockSetForm).toHaveBeenCalledWith({
                  type: "addManager",
                  payload: {
                    calabrio_team_ids: [215],
                    manager_id: undefined,
                    manager_first_name: "B'ob",
                    manager_last_name: "Bob'son",
                    manager_n_number: "n0000000",
                    profile_id: 4
                  }
                });
                expect(mockSetForm).toHaveBeenCalledWith({
                  type: "updateManagerFilter",
                  payload: "n0000000"
                });
                expect(mockHandleClose).toHaveBeenCalledTimes(1);
              });
            });
          });
        });
        describe("call to add the manager fails", () => {
          const errorResp = { nope: "HOSED!" };
          beforeEach(() => addManager.mockRejectedValue(errorResp));
          test("ModalOverlay should render with 'Manager added successfully' & modal should close after 2 seconds (handleClose should be called)", async () => {
            const rendered = renderComponent();
            const fetchedManager = {
              firstName: "Bob",
              lastName: "Bobson"
            };
            updateFormSoValid(fetchedManager, "n0000000");
            const { onClick } = getMockedComponentProps(StyledButton, getLastInstanceCalled(StyledButton));
            act(() => onClick());
            act(() => jest.runAllTimers());
            await waitFor(() => {
              expectOnlyPassedProps(ModalOverlay, {
                status: "fail",
                message: "Failed to Create Manager"
              });
              expect(mockHandleClose).toHaveBeenCalledTimes(0);
              expectMockedComponent(rendered, { ModalOverlay }, 0);
            });
          });
        });
      });
    });
    describe("manager is already in the list of managers", () => {
      const managerNNumber = "n1234567";
      const fetchedManager = {
        firstName: "Bob",
        lastName: "Bobson"
      };
      beforeEach(() => {
        useAdminState.mockReturnValue({
          profileContext: {
            profiles: [{
              profile_id: 4
            }]
          },
          calabrioContext: {
            teams: [{
              groupId: 215,
              name: "Calabrio Group One"
            }]
          },
          managerContext: {
            managers: [{
              manager_first_name: "Ialready",
              manager_last_name: "Exist",
              manager_n_number: managerNNumber
            }]
          },
          userContext: {
            pingIdentity: {
              sub: "n0138110"
            }
          }
        });
      });
      test("ModalOverlay should render 'Failed to Create Manager' & modal should remain open (handleClose should not be called)", async () => {
        const rendered = render(<ManagerModal handleClose={mockHandleClose} editManager={null} />);
        updateFormSoValid(fetchedManager, managerNNumber);
        const { onClick } = getMockedComponentProps(StyledButton, getLastInstanceCalled(StyledButton));
        act(() => onClick());
        act(() => jest.runAllTimers());
        await waitFor(() => {
          expectOnlyPassedProps(ModalOverlay, {
            status: "fail",
            message: "Manager already exists"
          });
          expect(mockHandleClose).toHaveBeenCalledTimes(0);
          expectMockedComponent(rendered, { ModalOverlay }, 0);
        });
      });
    });
    describe("add Calabrio team is selected", () => {
      test("CalabrioTeamModal should render when add-team is selected", async () => {
        const selection = {
          label: "Add Calabrio Team",
          value: "add-team"
        };
        renderComponent();
        act(() => {
          Dropdown.mock.calls[1][0].updateValue(null, [selection]);
          const grandchild = Modal.mock.calls[0][0].children;
          render(grandchild);
          Modal.mock.calls[1][0].onClose();
        });
        expect(Modal.mock.calls[1][0].open).toBe(true);
      });
    });
    describe("the calabrio team modal closes when expected", () => {
      test("changing the open attribute to false closes the modal", async () => {
        const selection = {
          label: "Add Calabrio Team",
          value: "add-team"
        };
        renderComponent();
        act(() => {
          Dropdown.mock.calls[1][0].updateValue(null, [selection]);
          const grandchild = Modal.mock.calls[0][0].children;
          render(grandchild);
          CalabrioTeamModal.mock.calls[0][0].handleClose({ groupId: 300 });
        });
        expect(Modal.mock.calls[2][0].open).toBe(false);
      });
    });
    describe("the calabrio team modal closes with no new team", () => {
      test("changing the open attribute to false closes the modal", async () => {
        const selection = {
          label: "Add Calabrio Team",
          value: "add-team"
        };
        renderComponent();
        act(() => {
          Dropdown.mock.calls[1][0].updateValue(null, [selection]);
          const grandchild = Modal.mock.calls[0][0].children;
          render(grandchild);
          CalabrioTeamModal.mock.calls[0][0].handleClose(null);
        });
        expect(Modal.mock.calls[2][0].open).toBe(false);
      });
    });
  });

  describe("Update Manager", () => {
    const renderComponent = manager => render(<ManagerModal handleClose={mockHandleClose} selectedManager={manager} />);
    beforeEach(() => {

    });
    describe("Initial State", () => {
      const selectedManager = {
        manager_first_name: "Faith",
        manager_last_name: "Cuneo",
        manager_n_number: "n0263786",
        profile_id: null,
        calabrio_team_ids: [215, 225]
      };
      test("Should show edit form with edit button", () => {
        const rendered = renderComponent(selectedManager);
        expect(rendered.container).toHaveTextContent("Edit Faith Cuneo");
        expect(StyledButton.mock.calls[0][0].children).toBe("Save");
        expect(StyledButton.mock.calls[0][0].disabled).toBe(true);
      });
    });
    describe("Update Manager Button", () => {
      const selectedManager = {
        manager_id: 10,
        manager_first_name: "Faith",
        manager_last_name: "Cuneo",
        manager_n_number: "n0263786",
        profile_id: null,
        calabrio_team_ids: [215, 225]
      };
      describe("Manager and Profile are selected and selectedCalabrioTeam Length !== 0", () => {
        test("Save Button should be enabled", () => {
          renderComponent(selectedManager);
          act(() => {
            Dropdown.mock.calls[0][0].updateValue(null, { profile_id: 4 });
          });
          expect(StyledButton.mock.calls[0][0].children).toBe("Save");
          expect(StyledButton.mock.calls[0][0].disabled).toBe(true);
          expect(StyledButton.mock.calls[1][0].disabled).toBe(false);
        });
      });
      describe("Update Manager Button is clicked", () => {
        describe("editManager service call is successful", () => {
          beforeEach(() => {
            editManager.mockResolvedValue({ yay: "woo!" });
          });
          test("Should dispatch editManager and update Modal", async () => {
            renderComponent(selectedManager);
            act(() => {
              Dropdown.mock.calls[0][0].updateValue(null, { profile_id: 4 });
            });
            act(() => {
              StyledButton.mock.calls[1][0].onClick();
            });
            await waitFor(() => {
              expect(editManager).toHaveBeenCalledTimes(1);
              expect(editManager).toHaveBeenCalledWith(10, {
                calabrio_team_ids: "[215,225]",
                profile_id: 4
              });
              expect(mockHandleClose).toHaveBeenCalledTimes(1);
              expect(mockSetForm).toHaveBeenCalledTimes(1);
              expect(mockSetForm).toHaveBeenCalledWith({
                type: "editManager",
                payload: [
                  {
                    calabrio_team_ids: [215, 225],
                    manager_id: 10,
                    manager_first_name: "Faith",
                    manager_last_name: "Cuneo",
                    manager_n_number: "n0263786",
                    profile_id: 4
                  },
                  {
                    manager_id: 3,
                    manager_n_number: "n0262226"
                  }
                ]
              });
              expect(ModalOverlay.mock.calls[1][0]).toStrictEqual({
                message: "Manager saved successfully",
                status: "success"
              });
            });
          });
        });
        describe("editManager service call fails", () => {
          beforeEach(() => {
            editManager.mockRejectedValue({ aww: "boo!" });
          });
          test("Should not dispatch editManager and update Modal with fail status", async () => {
            renderComponent(selectedManager);
            act(() => {
              Dropdown.mock.calls[0][0].updateValue(null, { profile_id: 4 });
            });
            act(() => {
              StyledButton.mock.calls[1][0].onClick();
            });
            await waitFor(() => {
              expect(editManager).toHaveBeenCalledTimes(1);
              expect(editManager).toHaveBeenCalledWith(10, {
                calabrio_team_ids: "[215,225]",
                profile_id: 4
              });
              expect(mockHandleClose).toHaveBeenCalledTimes(0);
              expect(mockSetForm).toHaveBeenCalledTimes(0);
              expect(ModalOverlay.mock.calls[2][0]).toStrictEqual({
                message: "Failed to update Manager",
                status: "fail"
              });
            });
          });
        });
      });
    });
  });

  describe("close button", () => {
    test("should render whenever modal is open", () => {
      const rendered = renderComponent();
      expectMockedComponent(rendered, { CloseRounded }, 1);
    });
    describe("when clicked", () => {
      test("should close the modal", () => {
        renderComponent();
        const { onClick } = getMockedComponentProps(CloseRounded);
        act(() => onClick());
        expect(mockHandleClose).toBeCalled();
      });
    });
  });
});