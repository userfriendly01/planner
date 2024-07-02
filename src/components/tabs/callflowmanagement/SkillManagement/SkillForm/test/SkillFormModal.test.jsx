import React from "react";
import { SkillFormModal }from "../SkillFormModal";
import {
  act,
  render,
  setupMockedComponents
} from "testUtils";
import { AddEditForm } from "callflowmanagement/AddEditForm";
import { DeleteForm } from "callflowmanagement/DeleteForm";
import { ActionTypes } from "callflowmanagement/Skills.Interfaces";
import { Modal } from "@mui/material";

jest.mock("@mui/material", () => ({
  Modal: jest.fn()
}));

jest.mock("callflowmanagement/AddEditForm", () => ({
  AddEditForm: jest.fn()
}));

jest.mock("callflowmanagement/DeleteForm", () => ({
  DeleteForm: jest.fn()
}));

const tableState = "boos";
const mockTableState = jest.fn();
const mockSetAction = jest.fn();
const mockSetSaveResult = jest.fn();

const renderComponent = action => {
  render(<SkillFormModal
    action={action}
    tableState={tableState}
    setTableState={mockTableState}
    setAction={mockSetAction}
    setSaveResult={mockSetSaveResult}
  />);
  render(Modal.mock.calls[0][0].children);
};

describe("<SkillFormModal />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setupMockedComponents({
      AddEditForm,
      DeleteForm
    });
  });
  describe("Action is Add", () => {
    test("should render add/edit form", () => {
      renderComponent(ActionTypes.ADD);
      expect(AddEditForm).toHaveBeenCalledTimes(1);
      expect(DeleteForm).toHaveBeenCalledTimes(0);
    });
    describe("closeModal is called", () => {
      test("should call mock functions", async () => {
        renderComponent(ActionTypes.ADD);
        const closeModal = AddEditForm.mock.calls[0][0].closeModal;
        act(() => closeModal());
        expect(mockSetSaveResult).toHaveBeenCalledTimes(1);
        expect(mockSetSaveResult).toHaveBeenCalledWith({
          message: "",
          status: null
        });
        expect(Modal.mock.calls[1][0].open).toBe(false);
      });
    });
  });
  describe("Action is Delete", () => {
    test("should render delete form", () => {
      renderComponent(ActionTypes.DELETE);
      expect(AddEditForm).toHaveBeenCalledTimes(0);
      expect(DeleteForm).toHaveBeenCalledTimes(1);
    });
    describe("closeModal is called", () => {
      test("should call mock functions", async () => {
        renderComponent(ActionTypes.DELETE);
        const closeModal = DeleteForm.mock.calls[0][0].closeModal;
        act(() => closeModal());
        expect(mockSetSaveResult).toHaveBeenCalledTimes(1);
        expect(mockSetSaveResult).toHaveBeenCalledWith({
          message: "",
          status: null
        });
        expect(Modal.mock.calls[1][0].open).toBe(false);
      });
    });
  });
});