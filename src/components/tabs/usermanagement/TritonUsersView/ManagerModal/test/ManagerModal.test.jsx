import { ManagerModal } from "../ManagerModal";
import { CloseRounded } from "@mui/icons-material";
import { Dropdown } from "components/Dropdown";
import { NNumberInput } from "components/NNumberInput";
import { ModalOverlay } from "components/ModalOverlay";
import { StyledButton } from "components/StyledButton";
import { CalabrioTeamModal } from "orgmanagement/CalabrioTeamModal";
import { StyledExportButton } from "components/tabs/callflowmanagement/SkillManagement/Skills.Styles";
import {
  useAdminState,
  useAdminDispatch
} from "context/appContext";
import React from "react";
import { act } from "react-dom/test-utils";
import { Modal } from "@mui/material";
import { fetchUser } from "services/fetchUser";
import { updateUser } from "services/user";
import { updateCalabrioTeam } from "services/calabrio";

import {
  addManager, editManager
} from "services/manager";
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
const useRefSpy = jest.spyOn(React, "useRef");
const mockSave = jest.fn();

jest.mock("callflowmanagement/SkillManagement/Skills.Styles", () => ({
  StyledExportButton: jest.fn()
}));

jest.mock("@mui/icons-material", () => ({
  CloseRounded: jest.fn()
}));

jest.mock("@mui/material", () => ({
  Modal: jest.fn(),
  Paper: jest.requireActual("@mui/material").Paper,
  IconButton: jest.requireActual("@mui/material").IconButton
}));

jest.mock("@mui/x-date-pickers/DatePicker", () => ({
  DatePicker: jest.fn()
}));

jest.mock("@mui/x-data-grid", () => ({
  DataGrid: jest.fn(),
  GridToolbar: jest.fn(),
  GridRenderCellParams: jest.fn()
}));

jest.mock("@mui/x-date-pickers/TimePicker", () => ({
  TimePicker: jest.fn()
}));

jest.mock("services/user", () => ({
  updateUser: jest.fn()
}));

jest.mock("services/calabrio", () => ({
  updateCalabrioTeam: jest.fn()
}));

jest.mock("services/manager", () => ({
  addManager: jest.fn(),
  editManager: jest.fn()
}));

jest.mock("services/fetchUser", () => ({
  FetchUserResponse: jest.requireActual("services/fetchUser").FetchUserResponse,
  fetchUser: jest.fn()
}));
jest.mock("context/appContext", () => ({
  useAdminState: jest.fn(),
  useAdminDispatch: jest.fn()
}));

jest.mock("components/Dropdown", () => ({
  Dropdown: jest.fn()
}));

jest.mock("components/NNumberInput", () => ({
  NNumberInput: jest.fn()
}));

jest.mock("components/ModalOverlay", () => ({
  ModalOverlay: jest.fn()
}));

jest.mock("components/StyledButton", () => ({
  StyledButton: jest.fn()
}));

jest.mock("orgmanagement/CalabrioTeamModal", () => ({
  CalabrioTeamModal: jest.fn()
}));

jest.mock("components/ModalFetchingRing", () => ({
  ModalFetchingRing: jest.fn()
}));

jest.mock("callflowmanagement/SkillManagement/Skills.Styles", () => ({
  StyledExportButton: jest.fn()
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
      Modal,
      StyledExportButton
    });
    useAdminDispatch.mockReturnValue(mockSetForm);
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
        },
        {
          groupId: 216,
          name: "Faith Cuneo - N0263786"
        },
        {
          groupId: 123,
          name: "Smith, Mary - N7654321"
        },
        {
          groupId: 456,
          name: "Joe Schmoe - N1234567"
        },
        {
          groupId: 789,
          name: "Schmoe, Joe - N1234567"
        }]
      },
      managerContext: {
        managers: [
          {
            manager_n_num: "n0263786"
          },
          {
            manager_n_num: "n1511886"
          },
          {
            manager_n_num: "n0262226"
          },
          {
            manager_n_num: "n7654321"
          }
        ]
      },
      userContext: {
        nNumber: "n0138110",
        tokens: {
          msGraph: "Access Token"
        }

      },
      workerContext: {
        workers: [
          {
            attributes: {
              emp_first_name: "Michael",
              emp_last_name: "Scott",
              manager_n_number: "n0263786",
              manager_first_name: "Faith",
              manager_last_name: "Cuneo",
              n_number: "n0000000"
            },
            sid: "sid123"
          },
          {
            attributes: {
              emp_first_name: "Kaleigh",
              emp_last_name: "Spurio",
              manager_n_number: "n0263786",
              manager_first_name: "Faith",
              manager_last_name: "Cuneo",
              n_number: "n1541381"
            },
            sid: "sid456"
          },
          {
            attributes: {
              emp_first_name: "Joe",
              emp_last_name: "Schmoe",
              manager_n_number: "n1511886",
              manager_first_name: "Eric",
              manager_last_name: "Doblosky",
              n_number: "n1234567"
            },
            sid: "sid789"
          }
        ]
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
                    manager_first_name: "B'ob",
                    manager_last_name: "Bob'son",
                    manager_n_num: "n0000000",
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
              manager_n_num: managerNNumber
            }]
          },
          userContext: {
            nNumber: "n0138110"
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
      useRefSpy.mockReturnValue({ current: { save: mockSave }});

    });
    describe("Initial State", () => {
      const selectedManager = {
        manager_first_name: "Faith",
        manager_last_name: "Cuneo",
        manager_n_num: "n0263786",
        profile_id: null,
        calabrio_team_ids: [215, 225]
      };
      test("Should show edit form with edit button", () => {
        fetchUser.mockResolvedValue({
          firstName: "Faith",
          lastName: "Cuneo"
        });
        const rendered = renderComponent(selectedManager);
        expect(rendered.container).toHaveTextContent("Edit Faith Cuneo");
        expect(fetchUser).toHaveBeenCalledWith("Access Token", "n0263786");
        expect(StyledButton.mock.calls[0][0].children).toBe("Save");
        expect(StyledButton.mock.calls[0][0].disabled).toBe(true);
      });
      test("Should show name discrepancy if there is one", async () => {
        fetchUser.mockResolvedValue({
          firstName: "Michael",
          lastName: "Scott"
        });
        const rendered = renderComponent(selectedManager);
        expect(rendered.container).toHaveTextContent("Edit Faith Cuneo");
        expect(fetchUser).toHaveBeenCalledWith("Access Token", "n0263786");
        expect(StyledButton.mock.calls[0][0].children).toBe("Save");
        expect(StyledButton.mock.calls[0][0].disabled).toBe(true);
        await waitFor(() => {
          expect(rendered.container).toHaveTextContent("A name change was detected for this manager.");
        });
      });
    });
    describe("Update Manager Button", () => {
      const selectedManager = {
        manager_first_name: "Faith",
        manager_last_name: "Cuneo",
        manager_n_num: "n0263786",
        profile_id: null,
        calabrio_team_ids: [215, 225]
      };
      describe("fetchUser with manager n number fails", () => {
        test("Should show name discrepancy if there is one", async () => {
          fetchUser.mockRejectedValueOnce("boo");
          const rendered = renderComponent(selectedManager);
          expect(rendered.container).toHaveTextContent("Edit Faith Cuneo");
          expect(fetchUser).toHaveBeenCalledWith("Access Token", "n0263786");
          expect(StyledButton.mock.calls[0][0].children).toBe("Save");
          expect(StyledButton.mock.calls[0][0].disabled).toBe(true);
          await waitFor(() => {
            expect(rendered.container).not.toHaveTextContent("A name change was detected for this manager.");
          });
        });
      });
      describe("Manager name change detected", () => {
        test("Save button should be enabled", async () => {
          const selectedManagerWithProfile = {
            ...selectedManager,
            profile_id: 4
          };
          fetchUser.mockResolvedValue({
            firstName: "blah",
            lastName: "blah"
          });
          renderComponent(selectedManagerWithProfile);
          expect(fetchUser).toHaveBeenCalledWith("Access Token", "n0263786");
          expect(StyledButton.mock.calls[0][0].children).toBe("Save");
          expect(StyledButton.mock.calls[0][0].disabled).toBe(false);
          await waitFor(() => {
            expect(StyledButton.mock.calls.length).toBe(3);
          });
          expect(StyledButton.mock.calls[2][0].disabled).toBe(false);
        });
        describe("Update manager button is clicked for a detected name change", () => {
          const selectedManagerWithProfile = {
            ...selectedManager,
            profile_id: 4
          };
          describe("edit Manager with name change is completely successful", () => {
            test("It should call to update workers' attributes, update state and set the modal overlay to success", async () => {
              fetchUser.mockResolvedValue({
                firstName: "Faith updated Name",
                lastName: "Cuneo"
              });
              updateUser.mockResolvedValue("yay");
              renderComponent(selectedManagerWithProfile);
              expect(fetchUser).toHaveBeenCalledWith("Access Token", "n0263786");
              expect(StyledButton.mock.calls[0][0].children).toBe("Save");
              expect(StyledButton.mock.calls[0][0].disabled).toBe(false);
              await waitFor(() => {
                expect(StyledButton.mock.calls.length).toBe(3);
              });
              expect(StyledButton.mock.calls[2][0].disabled).toBe(false);
              act(() => {
                StyledButton.mock.calls[2][0].onClick();
              });
              await waitFor(() => {
                expect(editManager).toHaveBeenCalledTimes(1);
                expect(editManager).toHaveBeenCalledWith("n0263786", {
                  manager_first_name: "Faith updated Name",
                  manager_last_name: "Cuneo",
                  calabrio_team_ids: [215,225],
                  profile_id: 4
                });
              });
              await waitFor(() => {
                expect(updateUser).toHaveBeenCalledTimes(2);
                expect(mockSetForm).toHaveBeenCalledTimes(2);
                expect(mockSetForm).toHaveBeenCalledWith({
                  type: "editManager",
                  payload: [
                    {
                      calabrio_team_ids: [215, 225],
                      manager_first_name: "Faith updated Name",
                      manager_last_name: "Cuneo",
                      manager_n_num: "n0263786",
                      profile_id: 4
                    },
                    {
                      manager_n_num: "n1511886"
                    },
                    {
                      manager_n_num: "n0262226"
                    },
                    {
                      manager_n_num: "n7654321"
                    }
                  ]
                });
                expect(mockSetForm).toHaveBeenCalledWith({
                  type: "loadWorkers",
                  payload: [
                    {
                      attributes: {
                        emp_first_name: "Michael",
                        emp_last_name: "Scott",
                        manager_n_number: "n0263786",
                        manager_first_name: "Faith updated Name",
                        manager_last_name: "Cuneo",
                        manager: "Faith updated Name Cuneo",
                        n_number: "n0000000"
                      },
                      sid: "sid123"
                    },
                    {
                      attributes: {
                        emp_first_name: "Kaleigh",
                        emp_last_name: "Spurio",
                        manager_n_number: "n0263786",
                        manager_first_name: "Faith updated Name",
                        manager_last_name: "Cuneo",
                        manager: "Faith updated Name Cuneo",
                        n_number: "n1541381"
                      },
                      sid: "sid456"
                    },
                    {
                      attributes: {
                        emp_first_name: "Joe",
                        emp_last_name: "Schmoe",
                        manager_n_number: "n1511886",
                        manager_first_name: "Eric",
                        manager_last_name: "Doblosky",
                        n_number: "n1234567"
                      },
                      sid: "sid789"
                    }
                  ]
                });
                expect(ModalOverlay.mock.calls[1][0]).toStrictEqual({
                  message: "Manager saved successfully",
                  status: "success",
                  handleClose: mockHandleClose
                });
              });
            });
          });
          describe("edit Manager with name change is successfull but updates to their workers' attributes fails", () => {
            const exportRows = [
              {
                emp_first_name: "Michael",
                emp_last_name: "Scott",
                n_number: "n0000000",
                message: "Failed to update manager name in agent's worker attributes"
              },
              {
                emp_first_name: "Kaleigh",
                emp_last_name: "Spurio",
                n_number: "n1541381",
                message: "Failed to update manager name in agent's worker attributes"
              }
            ];
            const exportColumns = [
              {
                field: "n_number",
                title: "N-Number",
                width: "50px"
              },
              {
                field: "emp_first_name",
                title: "First Name",
                width: "200px"
              },
              {
                field: "emp_last_name",
                title: "Last Name",
                width: "200px"
              },
              {
                field: "message",
                title: "Failure message",
                width: "400px"
              }
            ];
            test("It should display a partial fail with export button, updates the manager context", async () => {
              fetchUser.mockResolvedValue({
                firstName: "Faith updated Name",
                lastName: "Cuneo"
              });
              editManager.mockResolvedValue("yay");
              updateUser.mockRejectedValue("boo");

              renderComponent(selectedManagerWithProfile);
              expect(fetchUser).toHaveBeenCalledWith("Access Token", "n0263786");
              expect(StyledButton.mock.calls[0][0].children).toBe("Save");
              expect(StyledButton.mock.calls[0][0].disabled).toBe(false);
              await waitFor(() => {
                expect(StyledButton.mock.calls.length).toBe(3);
              });
              expect(StyledButton.mock.calls[2][0].disabled).toBe(false);
              act(() => {
                StyledButton.mock.calls[2][0].onClick();
              });
              await waitFor(() => {
                expect(editManager).toHaveBeenCalledTimes(1);
                expect(editManager).toHaveBeenCalledWith("n0263786", {
                  manager_first_name: "Faith updated Name",
                  manager_last_name: "Cuneo",
                  calabrio_team_ids: [215,225],
                  profile_id: 4
                });
              });
              await waitFor(() => {
                expect(updateUser).toHaveBeenCalledTimes(2);
                expect(mockSetForm).toHaveBeenCalledTimes(1);
                expect(mockSetForm).toHaveBeenCalledWith({
                  type: "editManager",
                  payload: [
                    {
                      calabrio_team_ids: [215, 225],
                      manager_first_name: "Faith updated Name",
                      manager_last_name: "Cuneo",
                      manager_n_num: "n0263786",
                      profile_id: 4
                    },
                    {
                      manager_n_num: "n1511886"
                    },
                    {
                      manager_n_num: "n0262226"
                    },
                    {
                      manager_n_num: "n7654321"
                    }
                  ]
                });
                expect(ModalOverlay.mock.calls[2][0].status).toEqual("partial fail");
                expect(ModalOverlay.mock.calls[2][0].handleClose).toEqual(mockHandleClose);

                render(ModalOverlay.mock.calls[2][0].message.props.children);
                expect(StyledExportButton).toHaveBeenCalled();
              });
              const clickExport = StyledExportButton.mock.calls[0][0].onClick;
              act(() => {
                clickExport();
              });
              await  waitFor(() => {
                expect(mockSave).toHaveBeenCalledTimes(1);
                expect(mockSave).toHaveBeenCalledWith(exportRows, exportColumns);
              });
            });
          });
          describe("edit Manager with name change completely fails", () => {
            test("It does not call to update any workers' attributes with new manager name, displays failure overlay, does not update manager or worker context", async () => {
              fetchUser.mockResolvedValue({
                firstName: "Faith updated Name",
                lastName: "Cuneo"
              });
              editManager.mockRejectedValueOnce("boo");
              renderComponent(selectedManagerWithProfile);
              expect(fetchUser).toHaveBeenCalledWith("Access Token", "n0263786");
              expect(StyledButton.mock.calls[0][0].children).toBe("Save");
              expect(StyledButton.mock.calls[0][0].disabled).toBe(false);
              await waitFor(() => {
                expect(StyledButton.mock.calls.length).toBe(3);
              });
              expect(StyledButton.mock.calls[2][0].disabled).toBe(false);
              act(() => {
                StyledButton.mock.calls[2][0].onClick();
              });
              await waitFor(() => {
                expect(editManager).toHaveBeenCalledTimes(1);
                expect(editManager).toHaveBeenCalledWith("n0263786", {
                  manager_first_name: "Faith updated Name",
                  manager_last_name: "Cuneo",
                  calabrio_team_ids: [215,225],
                  profile_id: 4
                });
              });
              await waitFor(() => {
                expect(updateUser).toHaveBeenCalledTimes(0);
                expect(mockSetForm).toHaveBeenCalledTimes(0);
                expect(ModalOverlay.mock.calls[2][0]).toStrictEqual({
                  message: "Failed to update Manager",
                  status: "fail",
                  handleClose: mockHandleClose
                });
              });
            });
          });
        });
      });
      describe("Calabrio Team Test Scenarios", () => {
        describe("there are no Calabrio teams containing manager nNumber", () => {
          test("no Calabrio teams containing manager nNumber", () => {
            const selectedManager = {
              manager_first_name: "Eric",
              manager_last_name: "Doblosky",
              manager_n_num: "n1511886",
              profile_id: null,
              calabrio_team_ids: []
            };
            fetchUser.mockResolvedValue({
              firstName: "Joe",
              lastName: "Schmoe"
            });
            const rendered = renderComponent(selectedManager);
            expect(rendered.container).toHaveTextContent("Edit Eric Doblosky");
            expect(fetchUser).toHaveBeenCalledWith("Access Token", "n1511886");
            expect(StyledButton.mock.calls[0][0].children).toBe("Save");
            expect(StyledButton.mock.calls[0][0].disabled).toBe(true);
          });
        });
        describe("there is one Calabrio team containing manager nNumber", () => {
          test("team format is correct", async() => {
            const selectedManager = {
              manager_first_name: "Faith",
              manager_last_name: "Cuneo",
              manager_n_num: "n0263786",
              profile_id: null,
              calabrio_team_ids: [215, 225]
            };
            fetchUser.mockResolvedValue({
              firstName: "Faith",
              lastName: "Cuneo"
            });
            const rendered = renderComponent(selectedManager);
            expect(rendered.container).toHaveTextContent("Edit Faith Cuneo");
            expect(fetchUser).toHaveBeenCalledWith("Access Token", "n0263786");
            expect(StyledButton.mock.calls[0][0].children).toBe("Save");
            expect(StyledButton.mock.calls[0][0].disabled).toBe(true);
          });
          test("team format is incorrect - update successful", () => {
            const selectedManager = {
              manager_first_name: "Mary",
              manager_last_name: "Smith",
              manager_n_num: "n7654321",
              profile_id: null,
              calabrio_team_ids: []
            };

            fetchUser.mockResolvedValue({
              firstName: "Mary",
              lastName: "Smith"
            });

            updateCalabrioTeam.mockResolvedValue({
              groupId: 123,
              name: "Mary Smith - N7654321",
              displayId: null,
              parentGroupId: 111,
              parentGroupName: "Default Group",
              groupLevel: ""
            });

            const rendered = renderComponent(selectedManager);
            expect(rendered.container).toHaveTextContent("Edit Mary Smith");
            expect(fetchUser).toHaveBeenCalledWith("Access Token", "n7654321");
            expect(updateCalabrioTeam).toHaveBeenCalledTimes(1);
            expect(StyledButton.mock.calls[0][0].children).toBe("Save");
            expect(StyledButton.mock.calls[0][0].disabled).toBe(true);
          });
          test("team format is incorrect - update successful, team in selected calabrio teams list", () => {
            const selectedManager = {
              manager_first_name: "Mary",
              manager_last_name: "Smith",
              manager_n_num: "n7654321",
              profile_id: null,
              calabrio_team_ids: [123]
            };

            fetchUser.mockResolvedValue({
              firstName: "Mary",
              lastName: "Smith"
            });

            updateCalabrioTeam.mockResolvedValue({
              groupId: 123,
              name: "Mary Smith - N7654321",
              displayId: null,
              parentGroupId: 111,
              parentGroupName: "Default Group",
              groupLevel: ""
            });

            const rendered = renderComponent(selectedManager);
            expect(rendered.container).toHaveTextContent("Edit Mary Smith");
            expect(fetchUser).toHaveBeenCalledWith("Access Token", "n7654321");
            expect(updateCalabrioTeam).toHaveBeenCalledTimes(1);
            expect(StyledButton.mock.calls[0][0].children).toBe("Save");
            expect(StyledButton.mock.calls[0][0].disabled).toBe(true);
          });

          test("team format is incorrect - update fails", () => {
            const selectedManager = {
              manager_first_name: "Mary",
              manager_last_name: "Smith",
              manager_n_num: "n7654321",
              profile_id: null,
              calabrio_team_ids: []
            };

            fetchUser.mockResolvedValue({
              firstName: "Mary",
              lastName: "Smith"
            });

            updateCalabrioTeam.mockRejectedValueOnce("doh!");

            const rendered = renderComponent(selectedManager);
            expect(rendered.container).toHaveTextContent("Edit Mary Smith");
            expect(fetchUser).toHaveBeenCalledWith("Access Token", "n7654321");
            expect(updateCalabrioTeam).toHaveBeenCalledTimes(1);
            expect(StyledButton.mock.calls[0][0].children).toBe("Save");
            expect(StyledButton.mock.calls[0][0].disabled).toBe(true);
          });

        });
        describe("there are multiple Calabrio teams containing manager nNumber", () => {
          test("mutliple Calabrio teams containing manager nNumber", () => {
            const selectedManager = {
              manager_first_name: "Joe",
              manager_last_name: "Schmoe",
              manager_n_num: "n1234567",
              profile_id: null,
              calabrio_team_ids: []
            };
            fetchUser.mockResolvedValue({
              firstName: "Joe",
              lastName: "Schmoe"
            });
            const rendered = renderComponent(selectedManager);
            expect(rendered.container).toHaveTextContent("Edit Joe Schmoe");
            expect(fetchUser).toHaveBeenCalledWith("Access Token", "n1234567");
            expect(StyledButton.mock.calls[0][0].children).toBe("Save");
            expect(StyledButton.mock.calls[0][0].disabled).toBe(true);
          });
        });

      });
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
            fetchUser.mockResolvedValue({
              firstName: "Faith",
              lastName: "Cuneo"
            });
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
              expect(editManager).toHaveBeenCalledWith("n0263786", {
                manager_first_name: "Faith",
                manager_last_name: "Cuneo",
                calabrio_team_ids: [215,225],
                profile_id: 4
              });
              expect(mockHandleClose).toHaveBeenCalledTimes(1);
              expect(mockSetForm).toHaveBeenCalledTimes(1);
              expect(mockSetForm).toHaveBeenCalledWith({
                type: "editManager",
                payload: [
                  {
                    calabrio_team_ids: [215, 225],
                    manager_first_name: "Faith",
                    manager_last_name: "Cuneo",
                    manager_n_num: "n0263786",
                    profile_id: 4
                  },
                  {
                    manager_n_num: "n1511886"
                  },
                  {
                    manager_n_num: "n0262226"
                  },
                  {
                    manager_n_num: "n7654321"
                  }
                ]
              });
              expect(ModalOverlay.mock.calls[1][0]).toStrictEqual({
                message: "Manager saved successfully",
                status: "success",
                handleClose: mockHandleClose
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
              expect(editManager).toHaveBeenCalledWith("n0263786", {
                manager_first_name: "Faith",
                manager_last_name: "Cuneo",
                calabrio_team_ids: [215,225],
                profile_id: 4
              });
              expect(mockHandleClose).toHaveBeenCalledTimes(0);
              expect(mockSetForm).toHaveBeenCalledTimes(0);
              expect(ModalOverlay.mock.calls[2][0]).toStrictEqual({
                message: "Failed to update Manager",
                status: "fail",
                handleClose: mockHandleClose
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
