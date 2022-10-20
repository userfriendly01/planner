import React from "react";
import CalabrioTeamModal from "../CalabrioTeamModal";
import { CloseButton } from "../CalabrioTeamModal.Styles";
import { TextField } from "@mui/material";
import {
  Dropdown,
  ModalOverlay,
  PaperContainer,
  StyledButton
} from "components";
import {
  useAdminState,
  useAdminDispatch
} from "context";
import { createCalabrioTeam } from "services";
import {
  act,
  initialTestState,
  expectOnlyPassedProps,
  render,
  setupMockedComponents,
  waitFor
} from "testUtils";

jest.mock("components", () => ({
  __esModule: true,
  Dropdown: jest.fn(),
  PaperContainer: jest.fn(),
  StyledButton: jest.fn(),
  ModalOverlay: jest.fn()
}));

jest.mock("context", () => ({
  useAdminState: jest.fn(),
  useAdminDispatch: jest.fn()
}));

jest.mock("@mui/material", () => ({
  __esModule: true,
  TextField: jest.fn()
}));

jest.mock("../CalabrioTeamModal.Styles", () => ({
  __esModule: true,
  CloseButton: jest.fn(),
  ButtonWrapper: jest.requireActual("../CalabrioTeamModal.Styles").ButtonWrapper,
  HeaderAndCloseButtonWrapper: jest.requireActual("../CalabrioTeamModal.Styles").HeaderAndCloseButtonWrapper,
  ModalContainer: jest.requireActual("../CalabrioTeamModal.Styles").ModalContainer
}));

jest.useFakeTimers();
const mockHandleClose = jest.fn();
const mockAdminDispatch = jest.fn();

describe("<CalabrioTeamModal />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAdminDispatch.mockReturnValue(mockAdminDispatch);
    useAdminState.mockReturnValue(initialTestState);
    setupMockedComponents({
      CloseButton,
      Dropdown,
      ModalOverlay,
      PaperContainer,
      StyledButton,
      TextField
    });
  });
  describe("Initial Render", () => {
    test("CalabrioTeamModal Renders as expected", () => {
      render(<CalabrioTeamModal handleClose={mockHandleClose}/>);
      render(PaperContainer.mock.calls[0][0].children);
      expect(CloseButton.mock.calls.length).toBe(1);
      expectOnlyPassedProps(CloseButton, {
        onClick: mockHandleClose
      });

      expect(TextField.mock.calls.length).toBe(1);
      expectOnlyPassedProps(TextField, {
        label: "New Team Name",
        value: ""
      });

      expect(Dropdown.mock.calls.length).toBe(1);
      expectOnlyPassedProps(Dropdown, {
        label: "Parent Group ID",
        options: initialTestState.calabrioContext.groups.map(g => ({
          label: g.name,
          value: g.groupId,
          ...g
        })),
        value: ""
      });
      expect(StyledButton.mock.calls.length).toBe(1);
      expectOnlyPassedProps(StyledButton, {
        disabled: true
      });
    });
  });
  describe("Name Text Field is updated", () => {
    test("Text field value === newName", () => {
      render(<CalabrioTeamModal handleClose={mockHandleClose}/>);
      render(PaperContainer.mock.calls[0][0].children);
      expect(TextField.mock.calls.length).toBe(1);
      expect(TextField.mock.calls[0][0].value).toBe("");
      const onChange = TextField.mock.calls[0][0].onChange;
      const newName = "I'm a new team!";
      act(() => {
        onChange({
          target: {
            value: newName
          }
        });
      });
      render(PaperContainer.mock.calls[1][0].children);
      expect(TextField.mock.calls.length).toBe(2);
      expect(TextField.mock.calls[1][0].value).toBe("I'm a new team!");
    });
  });
  describe("Parent Group Dropdown is updated", () => {
    test("Dropdown value === selection", () => {
      render(<CalabrioTeamModal handleClose={mockHandleClose}/>);
      render(PaperContainer.mock.calls[0][0].children);
      expect(Dropdown.mock.calls.length).toBe(1);
      expect(Dropdown.mock.calls[0][0].value).toBe("");
      const updateValue = Dropdown.mock.calls[0][0].updateValue;
      const selection = {
        ...initialTestState.calabrioContext.groups[0]
      };
      act(() => {
        updateValue(null, selection);
      });
      render(PaperContainer.mock.calls[1][0].children);
      expect(Dropdown.mock.calls.length).toBe(2);
      expect(Dropdown.mock.calls[1][0].value).toBe(selection);
    });
  });
  describe("Submit button is clicked", () => {
    describe("team name already exists", () => {
      test("should update modal overlay to fail and message to Team Already Exists", async () => {
        render(<CalabrioTeamModal handleClose={mockHandleClose}/>);
        render(PaperContainer.mock.calls[0][0].children);

        const updateNameField = TextField.mock.calls[0][0].onChange;
        const newName = initialTestState.calabrioContext.teams[0].name;

        act(() => {
          updateNameField({
            target: {
              value: newName
            }
          });
        });

        render(PaperContainer.mock.calls[1][0].children);
        const updateParentTeamDropdown = Dropdown.mock.calls[1][0].updateValue;
        const selection = {
          ...initialTestState.calabrioContext.groups[0]
        };
        act(() => {
          updateParentTeamDropdown(null, selection);
        });
        render(PaperContainer.mock.calls[2][0].children);
        expect(StyledButton.mock.calls[2][0].disabled).toBe(false);

        const onSubmit = StyledButton.mock.calls[2][0].onClick;
        act(() => {
          onSubmit();
        });
        const rendered = render(PaperContainer.mock.calls[3][0].children);
        expect(rendered.container).toHaveTextContent("ModalOverlay");
        expect(ModalOverlay).toHaveBeenCalledTimes(1);
        expectOnlyPassedProps(ModalOverlay, {
          message: "Team Already Exists",
          status: "fail"
        });
        const closeOverlay = ModalOverlay.mock.calls[0][0].handleClose;
        act(() => {
          closeOverlay(null);
        });
        const lastrender = render(PaperContainer.mock.calls[4][0].children);
        expect(lastrender.container).not.toHaveTextContent("ModalOverlay");
      });
    });
    describe("createCalabrioTeam is successful", () => {
      beforeEach(() => {
        createCalabrioTeam.mockResolvedValue({
          data: "yay!"
        });
      });
      test("Dispatch and handleClose are called ", async () => {
        render(<CalabrioTeamModal handleClose={mockHandleClose}/>);
        render(PaperContainer.mock.calls[0][0].children);

        const updateNameField = TextField.mock.calls[0][0].onChange;
        const newName = "I'm a new team!";

        act(() => {
          updateNameField({
            target: {
              value: newName
            }
          });
        });

        render(PaperContainer.mock.calls[1][0].children);
        const updateParentTeamDropdown = Dropdown.mock.calls[1][0].updateValue;
        const selection = {
          ...initialTestState.calabrioContext.groups[0]
        };
        act(() => {
          updateParentTeamDropdown(null, selection);
        });
        render(PaperContainer.mock.calls[2][0].children);
        expect(StyledButton.mock.calls[2][0].disabled).toBe(false);

        const onSubmit = StyledButton.mock.calls[2][0].onClick;
        act(() => {
          onSubmit();
        });
        await waitFor(() => {
          expect(mockAdminDispatch).toHaveBeenCalledTimes(1);
          expect(mockAdminDispatch).toHaveBeenCalledWith({
            type: "addCalabrioTeam",
            payload: "yay!"
          });
          jest.runAllTimers();
          expect(mockHandleClose).toHaveBeenCalledTimes(1);
        });
      });
    });
    describe("createCalabrioTeam fails", () => {
      beforeEach(() => {
        createCalabrioTeam.mockRejectedValue("aww!");
      });
      test("Dispatch and handleClose are called ", async () => {
        render(<CalabrioTeamModal handleClose={mockHandleClose}/>);
        render(PaperContainer.mock.calls[0][0].children);

        const updateNameField = TextField.mock.calls[0][0].onChange;
        const newName = "I'm a new team!";

        act(() => {
          updateNameField({
            target: {
              value: newName
            }
          });
        });

        render(PaperContainer.mock.calls[1][0].children);
        const updateParentTeamDropdown = Dropdown.mock.calls[1][0].updateValue;
        const selection = {
          ...initialTestState.calabrioContext.groups[0]
        };

        act(() => {
          updateParentTeamDropdown(null, selection);
        });
        render(PaperContainer.mock.calls[2][0].children);
        expect(StyledButton.mock.calls[2][0].disabled).toBe(false);

        const onSubmit = StyledButton.mock.calls[2][0].onClick;
        act(() => {
          onSubmit();
        });
        await waitFor(() => {
          expect(mockAdminDispatch).toHaveBeenCalledTimes(0);
          expect(mockHandleClose).toHaveBeenCalledTimes(0);
        });
      });
    });
  });
  describe("Close button is clicked", () => {
    test("handleClose is called but dispatch is not ", () => {
      render(<CalabrioTeamModal handleClose={mockHandleClose}/>);
      render(PaperContainer.mock.calls[0][0].children);
      expect(CloseButton.mock.calls.length).toBe(1);
      const handleClose = CloseButton.mock.calls[0][0].onClick;
      act(() => {
        handleClose();
      });
      expect(mockHandleClose).toHaveBeenCalledTimes(1);
    });
  });
});