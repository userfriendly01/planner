import { BulkCreateForm } from "../BulkCreateForm";
import { updateSelectedTemplates } from "usermanagement/validationUtils";
import { getCreateTemplates } from "usermanagement/templates";
import React from "react";
import {
  act,
  render
} from "testUtils";
import { Checkbox } from "@mui/material";

jest.mock("usermanagement/BusinessUnitModal", () => ({
  BusinessUnitModal: jest.fn()
}));

jest.mock("usermanagement/validationUtils", () => ({
  updateSelectedTemplates: jest.fn()
}));

jest.mock("context/appContext", () => ({
  useAdminState: jest.fn()
}));

jest.mock("@mui/material", () => ({
  Checkbox: jest.fn(),
  Paper: jest.fn(),
  Modal: jest.fn()
}));

jest.mock("@mui/x-data-grid", () => ({
  DataGrid: jest.fn(),
  GridToolbar: jest.fn()
}));

jest.mock("@mui/x-date-pickers/TimePicker", () => ({
  TimePicker: jest.fn()
}));

jest.mock("components/StyledButton", () => ({
  StyledButton: jest.fn()
}));

const mockSetSelectedTemplates = jest.fn();
const mockSetBusinessUnitId = jest.fn();

const createTemplates = getCreateTemplates();

describe("<BulkCreateForm />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = selectedTemplates => {
    return render(
      <BulkCreateForm
        setBusinessUnitId={mockSetBusinessUnitId}
        selectedTemplates={selectedTemplates}
        setSelectedTemplates={mockSetSelectedTemplates}
      />
    );
  };

  describe("initial render", () => {
    describe("component is rendered with no selected templates", () => {
      test("should render options in default state", () => {
        const rendered = renderComponent([]);
        expect(rendered.container).toHaveTextContent("Step 1: Choose the applicable systems");
        expect(rendered.container).toHaveTextContent("Twilio");
        expect(rendered.container).toHaveTextContent("Calabrio QM");
        expect(rendered.container).toHaveTextContent("Calabrio WFM");
        expect(Checkbox.mock.calls.length).toBe(3);
        expect(Checkbox.mock.calls[0][0].checked).toBe(false);
        expect(Checkbox.mock.calls[1][0].checked).toBe(false);
        expect(Checkbox.mock.calls[2][0].checked).toBe(false);
      });
    });
    describe("component is rendered with 1 selected templates", () => {
      test("should render options in default state", () => {
        renderComponent([createTemplates.CREATE_TRITON_USER]);
        expect(Checkbox.mock.calls.length).toBe(3);
        expect(Checkbox.mock.calls[0][0].checked).toBe(true);
        expect(Checkbox.mock.calls[1][0].checked).toBe(false);
        expect(Checkbox.mock.calls[2][0].checked).toBe(false);
      });
    });
    describe("component is rendered with 2 selected templates", () => {
      test("should render options in default state", () => {
        renderComponent([createTemplates.CREATE_TRITON_USER, createTemplates.CREATE_CALABRIO_QM_USER]);
        expect(Checkbox.mock.calls.length).toBe(3);
        expect(Checkbox.mock.calls[0][0].checked).toBe(true);
        expect(Checkbox.mock.calls[1][0].checked).toBe(true);
        expect(Checkbox.mock.calls[2][0].checked).toBe(false);
      });
    });
    describe("component is rendered with multiple selected templates", () => {
      test("should render options in default state", () => {
        renderComponent([createTemplates.CREATE_TRITON_USER, createTemplates.CREATE_CALABRIO_QM_USER, createTemplates.CREATE_CALABRIO_WFM_PERSON]);
        expect(Checkbox.mock.calls.length).toBe(3);
        expect(Checkbox.mock.calls[0][0].checked).toBe(true);
        expect(Checkbox.mock.calls[1][0].checked).toBe(true);
        expect(Checkbox.mock.calls[2][0].checked).toBe(true);
      });
    });
  });
  describe("Twilio checkbox is clicked", () => {
    describe("checked === true", () => {
      test("setSelectedTemplates should be called with true and the correct template", () => {
        renderComponent([]);
        expect(Checkbox.mock.calls[0][0].checked).toBe(false);
        expect(Checkbox.mock.calls[1][0].checked).toBe(false);
        expect(Checkbox.mock.calls[2][0].checked).toBe(false);
        const onCheckTriton = Checkbox.mock.calls[0][0].onChange;
        act(() => onCheckTriton({
          target: {
            checked: true
          }
        }));
        expect(updateSelectedTemplates).toHaveBeenCalledTimes(1);
        expect(updateSelectedTemplates.mock.calls[0][0]).toBe(true);
        expect(updateSelectedTemplates.mock.calls[0][1].name).toBe("CREATE_TRITON_USER");
        expect(updateSelectedTemplates.mock.calls[0][2]).toStrictEqual([]);
        expect(updateSelectedTemplates.mock.calls[0][3]).toBe(mockSetSelectedTemplates);
      });
    });
    describe("checked === false", () => {
      test("setSelectedTemplates should be called with false and the correct template", () => {
        renderComponent([]);
        expect(Checkbox.mock.calls[0][0].checked).toBe(false);
        expect(Checkbox.mock.calls[1][0].checked).toBe(false);
        expect(Checkbox.mock.calls[2][0].checked).toBe(false);
        const onCheckTriton = Checkbox.mock.calls[0][0].onChange;
        act(() => onCheckTriton({
          target: {
            checked: false
          }
        }));
        expect(updateSelectedTemplates).toHaveBeenCalledTimes(1);
        expect(updateSelectedTemplates.mock.calls[0][0]).toBe(false);
        expect(updateSelectedTemplates.mock.calls[0][1].name).toBe("CREATE_TRITON_USER");
        expect(updateSelectedTemplates.mock.calls[0][2]).toStrictEqual([]);
        expect(updateSelectedTemplates.mock.calls[0][3]).toBe(mockSetSelectedTemplates);
      });
    });
  });
  describe("Calabrio checkbox is clicked", () => {
    describe("checked === true", () => {
      test("setSelectedTemplates should be called with true and the correct template", () => {
        renderComponent([]);
        expect(Checkbox.mock.calls[0][0].checked).toBe(false);
        expect(Checkbox.mock.calls[1][0].checked).toBe(false);
        expect(Checkbox.mock.calls[2][0].checked).toBe(false);
        const onCheckTriton = Checkbox.mock.calls[1][0].onChange;
        act(() => onCheckTriton({
          target: {
            checked: true
          }
        }));
        expect(updateSelectedTemplates).toHaveBeenCalledTimes(1);
        expect(updateSelectedTemplates.mock.calls[0][0]).toBe(true);
        expect(updateSelectedTemplates.mock.calls[0][1].name).toBe("CREATE_CALABRIO_QM_USER");
        expect(updateSelectedTemplates.mock.calls[0][2]).toStrictEqual([]);
        expect(updateSelectedTemplates.mock.calls[0][3]).toBe(mockSetSelectedTemplates);
      });
    });
    describe("checked === false", () => {
      test("setSelectedTemplates should be called with false and the correct template", () => {
        renderComponent([]);
        expect(Checkbox.mock.calls[0][0].checked).toBe(false);
        expect(Checkbox.mock.calls[1][0].checked).toBe(false);
        expect(Checkbox.mock.calls[2][0].checked).toBe(false);
        const onCheckTriton = Checkbox.mock.calls[1][0].onChange;
        act(() => onCheckTriton({
          target: {
            checked: false
          }
        }));
        expect(updateSelectedTemplates).toHaveBeenCalledTimes(1);
        expect(updateSelectedTemplates.mock.calls[0][0]).toBe(false);
        expect(updateSelectedTemplates.mock.calls[0][1].name).toBe("CREATE_CALABRIO_QM_USER");
        expect(updateSelectedTemplates.mock.calls[0][2]).toStrictEqual([]);
        expect(updateSelectedTemplates.mock.calls[0][3]).toBe(mockSetSelectedTemplates);
      });
    });
  });
  describe("Calabrio WFM checkbox is clicked", () => {
    describe("checked === true", () => {
      test("setSelectedTemplates should be called with true and the correct template", () => {
        renderComponent([]);
        expect(Checkbox.mock.calls[0][0].checked).toBe(false);
        expect(Checkbox.mock.calls[1][0].checked).toBe(false);
        expect(Checkbox.mock.calls[2][0].checked).toBe(false);
        const onCheckTriton = Checkbox.mock.calls[2][0].onChange;
        act(() => onCheckTriton({
          target: {
            checked: true
          }
        }));
        expect(updateSelectedTemplates).toHaveBeenCalledTimes(1);
        expect(updateSelectedTemplates.mock.calls[0][0]).toBe(true);
        expect(updateSelectedTemplates.mock.calls[0][1].name).toBe("CREATE_CALABRIO_WFM_PERSON");
        expect(updateSelectedTemplates.mock.calls[0][2]).toStrictEqual([]);
        expect(updateSelectedTemplates.mock.calls[0][3]).toBe(mockSetSelectedTemplates);
      });
    });
    describe("checked === false", () => {
      test("setSelectedTemplates should be called with false and the correct template", () => {
        renderComponent([]);
        expect(Checkbox.mock.calls[0][0].checked).toBe(false);
        expect(Checkbox.mock.calls[1][0].checked).toBe(false);
        expect(Checkbox.mock.calls[2][0].checked).toBe(false);
        const onCheckTriton = Checkbox.mock.calls[2][0].onChange;
        act(() => onCheckTriton({
          target: {
            checked: false
          }
        }));
        expect(updateSelectedTemplates).toHaveBeenCalledTimes(1);
        expect(updateSelectedTemplates.mock.calls[0][0]).toBe(false);
        expect(updateSelectedTemplates.mock.calls[0][1].name).toBe("CREATE_CALABRIO_WFM_PERSON");
        expect(updateSelectedTemplates.mock.calls[0][2]).toStrictEqual([]);
        expect(updateSelectedTemplates.mock.calls[0][3]).toBe(mockSetSelectedTemplates);
      });
    });
  });
});