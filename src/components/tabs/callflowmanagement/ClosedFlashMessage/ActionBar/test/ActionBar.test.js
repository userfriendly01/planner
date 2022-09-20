import ActionBar from "../ActionBar";
import { ActionTypes } from "../../ClosedFlashMessage.Interfaces";
import { IconWrapper } from "../../ClosedFlashMessage.Styles";
import React from "react";
import  {
  render,
  act,
  setupMockedComponents
} from "testUtils";
import {
  Edit,
  Delete
} from "@mui/icons-material";

jest.mock("@mui/icons-material", () => ({
  Edit: jest.fn(),
  Delete: jest.fn()
}));

jest.mock("components", () => ({
  StyledButton: jest.fn()
}));

jest.mock("../../ClosedFlashMessage.Styles", () => ({
  ActionBarWrapper: jest.requireActual("../../ClosedFlashMessage.Styles").ActionBarWrapper,
  IconWrapper: jest.fn()
}));

const mockSetAction = jest.fn();

describe("<ActionBar />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setupMockedComponents({
      Edit,
      Delete,
      IconWrapper
    });
  });

  const renderComponent = action => {
    render(<ActionBar action={action} setAction={mockSetAction}/>);
    render(IconWrapper.mock.calls[0][0].children);
    render(IconWrapper.mock.calls[1][0].children);
  };
  describe("initial render", () => {
    test("form is rendered as expected", () => {
      renderComponent(ActionTypes.VIEW);
      expect(IconWrapper.mock.calls.length).toBe(2);
      expect(IconWrapper.mock.calls[0][0].active).toBe(false);
      expect(IconWrapper.mock.calls[1][0].active).toBe(false);
      expect(Edit.mock.calls.length).toBe(1);
      expect(Delete.mock.calls.length).toBe(1);
    });
  });
  describe("Edit button is clicked", () => {
    test("handleIconClick is called with Edit", () => {
      renderComponent(ActionTypes.VIEW);
      const clickEdit = IconWrapper.mock.calls[0][0].onClick;
      act(() => {
        clickEdit();
      });
      expect(mockSetAction).toHaveBeenCalledTimes(1);
      expect(mockSetAction).toHaveBeenCalledWith(ActionTypes.EDIT);
    });
    describe("Edit action is already the selected action", () => {
      test("should unselect edit and update the view to View", () => {
        renderComponent(ActionTypes.EDIT);
        const clickEdit = IconWrapper.mock.calls[0][0].onClick;
        act(() => {
          clickEdit();
        });
        expect(mockSetAction).toHaveBeenCalledTimes(1);
        expect(mockSetAction).toHaveBeenCalledWith(ActionTypes.VIEW);
      });
    });
  });
  describe("Delete button is clicked", () => {
    test("handleIconClick is called with Delete", () => {
      renderComponent(ActionTypes.VIEW);
      const clickDelete = IconWrapper.mock.calls[1][0].onClick;
      act(() => {
        clickDelete();
      });
      expect(mockSetAction).toHaveBeenCalledTimes(1);
      expect(mockSetAction).toHaveBeenCalledWith(ActionTypes.DELETE);
    });
    describe("Delete action is already the selected action", () => {
      test("should unselect delete and update the view to View", () => {
        renderComponent(ActionTypes.DELETE);
        const clickDelete = IconWrapper.mock.calls[1][0].onClick;
        act(() => {
          clickDelete();
        });
        expect(mockSetAction).toHaveBeenCalledTimes(1);
        expect(mockSetAction).toHaveBeenCalledWith(ActionTypes.VIEW);
      });
    });
  });
});

