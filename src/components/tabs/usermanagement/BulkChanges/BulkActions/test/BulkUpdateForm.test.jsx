import BulkUpdateForm from "../BulkUpdateForm";
import { updateSelectedTemplates } from "../../BulkUtils";
import {
  BulkUpdateAttributes,
  BulkUpdateManager
} from "../";
import { getUpdateTemplates } from "../../BulkTemplates";
import { Dropdown } from "components";
import React from "react";
import {
  act,
  render,
  setupMockedComponents
} from "testUtils";

jest.mock("../../BulkUtils", () => ({
  updateSelectedTemplates: jest.fn()
}));

jest.mock("../", () => ({
  BulkUpdateAttributes: jest.fn(),
  BulkUpdateManager: jest.fn()
}));

jest.mock("components", () => ({
  Dropdown: jest.fn(),
  StyledButton: jest.fn()
}));

jest.mock("context", () => ({
  useAdminState: jest.fn()
}));

jest.mock("@mui/material", () => ({
  Paper: jest.fn()
}));

const mockTemplate = { name: "active template" };
const mockSetSelectedTemplates = jest.fn();
const updateTemplates = getUpdateTemplates();

describe("<BulkUpdateForm />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setupMockedComponents({
      Dropdown,
      BulkUpdateAttributes,
      BulkUpdateManager
    });
  });

  const renderComponent = selectedTemplates => {
    return render(
      <BulkUpdateForm
        selectedTemplates={selectedTemplates}
        setSelectedTemplates={mockSetSelectedTemplates}
      />
    );
  };

  describe("initial render", () => {
    describe("component is rendered as expected", () => {
      test("should render options in default state", () => {
        renderComponent([]);
        expect(Dropdown.mock.calls.length).toBe(1);
        expect(Dropdown.mock.calls[0][0].label).toBe("Choose a field to update");
        expect(Dropdown.mock.calls[0][0].value).toBe("");
        expect(JSON.stringify(Dropdown.mock.calls[0][0].options)).toBe(JSON.stringify([
          {
            label: "Update Worker Attribute",
            value: updateTemplates.UPDATE_WORKER_ATTRIBUTE
          },
          {
            label: "Update Users Manager",
            value: updateTemplates.UPDATE_USERS_MANAGER
          },
          {
            label: "Update Default Skills",
            value: updateTemplates.UPDATE_DEFAULT_SKILLS
          }
        ]));
      });
    });
  });
  describe("Template Dropdown is updated to UPDATE_WORKER_ATTRIBTUES", () => {
    test("Should update dropdown with updated value", () => {
      renderComponent([]);
      expect(Dropdown.mock.calls.length).toBe(1);
      expect(Dropdown.mock.calls[0][0].value).toBe("");
      const onTemplateChange = Dropdown.mock.calls[0][0].updateValue;
      act(() => onTemplateChange(null, { value: updateTemplates.UPDATE_WORKER_ATTRIBUTE }));
      expect(Dropdown.mock.calls.length).toBe(2);
      expect(JSON.stringify(Dropdown.mock.calls[1][0].value)).toBe(JSON.stringify({
        label: "Update Worker Attribute",
        value: updateTemplates.UPDATE_WORKER_ATTRIBUTE
      }));
      expect(BulkUpdateManager).toHaveBeenCalledTimes(0);
      expect(BulkUpdateAttributes).toHaveBeenCalledTimes(1);
      expect(JSON.stringify(BulkUpdateAttributes.mock.calls[0][0].template)).toBe(JSON.stringify(updateTemplates.UPDATE_WORKER_ATTRIBUTE));
      expect(BulkUpdateAttributes.mock.calls[0][0].selectedTemplates).toStrictEqual([]);
    });
    describe("replaceTemplate is called", () => {
      test("should call updateSetTemplates with expected parameters", () => {
        renderComponent([]);
        expect(Dropdown.mock.calls.length).toBe(1);
        expect(Dropdown.mock.calls[0][0].value).toBe("");
        const onTemplateChange = Dropdown.mock.calls[0][0].updateValue;
        act(() => onTemplateChange(null, { value: updateTemplates.UPDATE_WORKER_ATTRIBUTE }));
        const replaceTemplate = BulkUpdateAttributes.mock.calls[0][0].replaceTemplate;
        act(() => replaceTemplate(mockTemplate));
        expect(updateSelectedTemplates).toHaveBeenCalledTimes(1);
        expect(updateSelectedTemplates).toHaveBeenCalledWith(true, mockTemplate, [], mockSetSelectedTemplates);
      });
    });
    describe("updateTemplate is called", () => {
      test("should update passed template", () => {
        const updatedTemplate = {
          ...mockTemplate
        };
        const data = {
          custom: "info"
        };
        renderComponent([]);
        expect(Dropdown.mock.calls.length).toBe(1);
        expect(Dropdown.mock.calls[0][0].value).toBe("");
        const onTemplateChange = Dropdown.mock.calls[0][0].updateValue;
        act(() => onTemplateChange(null, { value: updateTemplates.UPDATE_WORKER_ATTRIBUTE }));
        const updateTemplate = BulkUpdateAttributes.mock.calls[0][0].updateTemplate;
        act(() => updateTemplate(updatedTemplate, data));
        expect(updatedTemplate).toStrictEqual({
          ...updatedTemplate,
          data
        });
      });
    });
    describe("removeTemplate is called", () => {
      test("should call updateSetTemplates with expected parameters", () => {
        renderComponent([]);
        expect(Dropdown.mock.calls.length).toBe(1);
        expect(Dropdown.mock.calls[0][0].value).toBe("");
        const onTemplateChange = Dropdown.mock.calls[0][0].updateValue;
        act(() => onTemplateChange(null, { value: updateTemplates.UPDATE_WORKER_ATTRIBUTE }));
        const removeTemplate = BulkUpdateAttributes.mock.calls[0][0].removeTemplate;
        act(() => removeTemplate(mockTemplate));
        expect(updateSelectedTemplates).toHaveBeenCalledTimes(1);
        expect(updateSelectedTemplates).toHaveBeenCalledWith(false, mockTemplate, [], mockSetSelectedTemplates);
      });
    });
  });
  describe("Template Dropdown is updated to UPDATE_USERS_MANAGER", () => {
    test("Should update dropdown with updated value", () => {
      renderComponent([]);
      expect(Dropdown.mock.calls.length).toBe(1);
      expect(Dropdown.mock.calls[0][0].value).toBe("");
      const onTemplateChange = Dropdown.mock.calls[0][0].updateValue;
      act(() => onTemplateChange(null, { value: updateTemplates.UPDATE_USERS_MANAGER }));
      expect(Dropdown.mock.calls.length).toBe(2);
      expect(JSON.stringify(Dropdown.mock.calls[1][0].value)).toBe(JSON.stringify({
        label: "Update Users Manager",
        value: updateTemplates.UPDATE_USERS_MANAGER
      }));
      expect(BulkUpdateAttributes).toHaveBeenCalledTimes(0);
      expect(BulkUpdateManager).toHaveBeenCalledTimes(1);
      expect(JSON.stringify(BulkUpdateManager.mock.calls[0][0].template)).toBe(JSON.stringify(updateTemplates.UPDATE_USERS_MANAGER));
      expect(BulkUpdateManager.mock.calls[0][0].selectedTemplates).toStrictEqual([]);
    });
    describe("replaceTemplate is called", () => {
      test("should call updateSetTemplates with expected parameters", () => {
        renderComponent([]);
        expect(Dropdown.mock.calls.length).toBe(1);
        expect(Dropdown.mock.calls[0][0].value).toBe("");
        const onTemplateChange = Dropdown.mock.calls[0][0].updateValue;
        act(() => onTemplateChange(null, { value: updateTemplates.UPDATE_USERS_MANAGER }));
        const replaceTemplate = BulkUpdateManager.mock.calls[0][0].replaceTemplate;
        act(() => replaceTemplate(mockTemplate));
        expect(updateSelectedTemplates).toHaveBeenCalledTimes(1);
        expect(updateSelectedTemplates).toHaveBeenCalledWith(true, mockTemplate, [], mockSetSelectedTemplates);
      });
    });
    describe("updateTemplate is called", () => {
      test("should update passed template", () => {
        const updatedTemplate = {
          ...mockTemplate
        };
        const data = {
          custom: "info"
        };
        renderComponent([]);
        expect(Dropdown.mock.calls.length).toBe(1);
        expect(Dropdown.mock.calls[0][0].value).toBe("");
        const onTemplateChange = Dropdown.mock.calls[0][0].updateValue;
        act(() => onTemplateChange(null, { value: updateTemplates.UPDATE_USERS_MANAGER }));
        const updateTemplate = BulkUpdateManager.mock.calls[0][0].updateTemplate;
        act(() => updateTemplate(updatedTemplate, data));
        expect(updatedTemplate).toStrictEqual({
          ...updatedTemplate,
          data
        });
      });
    });
    describe("removeTemplate is called", () => {
      test("should call updateSetTemplates with expected parameters", () => {
        renderComponent([updateTemplates.UPDATE_WORKER_ATTRIBUTE]);
        expect(Dropdown.mock.calls.length).toBe(1);
        expect(JSON.stringify(Dropdown.mock.calls[0][0].value)).toBe(JSON.stringify({
          label: "Update Worker Attribute",
          value: updateTemplates.UPDATE_WORKER_ATTRIBUTE
        }));
        const onTemplateChange = Dropdown.mock.calls[0][0].updateValue;
        act(() => onTemplateChange(null, { value: updateTemplates.UPDATE_USERS_MANAGER }));
        const removeTemplate = BulkUpdateManager.mock.calls[0][0].removeTemplate;
        act(() => removeTemplate(mockTemplate));
        expect(updateSelectedTemplates).toHaveBeenCalledTimes(1);
        expect(updateSelectedTemplates).toHaveBeenCalledWith(false, mockTemplate, [updateTemplates.UPDATE_WORKER_ATTRIBUTE], mockSetSelectedTemplates);
      });
    });
  });
});