import BulkUpdateForm from "../BulkUpdateForm";
import { updateSelectedTemplates } from "../../BulkUtils";
import {
  getUpdateTemplates,
  availableAttributes
} from "../../BulkTemplates";
import {
  CustomInput,
  Dropdown,
  PhoneNumberInput
} from "components";
import React from "react";
import {
  act,
  expectOnlyPassedProps,
  render,
  setupMockedComponents
} from "testUtils";
import { Checkbox } from "@mui/material";

jest.mock("../../BulkUtils", () => ({
  updateSelectedTemplates: jest.fn()
}));

jest.mock("components", () => ({
  CustomInput: jest.fn(),
  Dropdown: jest.fn(),
  PhoneNumberInput: jest.fn(),
  StyledButton: jest.fn()
}));

jest.mock("context", () => ({
  useAdminState: jest.fn()
}));

jest.mock("@mui/material", () => ({
  Paper: jest.fn()
}));

const mockSetSelectedTemplates = jest.fn();
const updateTemplates = getUpdateTemplates();

describe("<BulkUpdateForm />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setupMockedComponents({
      CustomInput,
      Dropdown,
      PhoneNumberInput
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
        expect(Dropdown.mock.calls.length).toBe(3);
        expect(PhoneNumberInput.mock.calls.length).toBe(0);
        expect(CustomInput.mock.calls.length).toBe(0);
        //Choose a Template Dropdown
        expect(Dropdown.mock.calls[0][0].label).toBe("Choose a field to update");
        expect(Dropdown.mock.calls[0][0].value.toString()).toBe({
          label: "Update Worker Attribute",
          value: updateTemplates.UPDATE_WORKER_ATTRIBUTE
        }.toString());
        expect(Dropdown.mock.calls[0][0].options.toString()).toBe([{
          label: "Update Worker Attribute",
          value: updateTemplates.UPDATE_WORKER_ATTRIBUTE
        }].toString());
        //Choose an attribute Dropdown
        expect(Dropdown.mock.calls[1][0].label).toBe("Attribute");
        expect(Dropdown.mock.calls[1][0].value.toString()).toBe(availableAttributes.SELF_SERVICE_INDICATOR.toString());
        expect(Dropdown.mock.calls[1][0].options.toString()).toBe([
          availableAttributes.ZERO_OUT_ENABLED,
          availableAttributes.SELF_SERVICE_INDICATOR,
          availableAttributes.MANAGER,
          availableAttributes.PROFILE,
          availableAttributes.DID
        ].toString());
        //Choose an value Dropdown
        expect(Dropdown.mock.calls[2][0].label).toBe("Boolean");
        expect(Dropdown.mock.calls[2][0].value.toString()).toBe("");
        expect(Dropdown.mock.calls[2][0].options.toString()).toBe([
          {
            label: "true",
            value: true
          },
          {
            label: "false",
            value: false
          }
        ].toString());
      });
    });
    describe("Template Dropdown is updated", () => {
      test.only("Should update dropdown with updated value", () => {
        renderComponent([]);
        expect(Dropdown.mock.calls.length).toBe(3);
        expect(Dropdown.mock.calls[0][0].value.toString()).toBe({
          label: "Update Worker Attribute",
          value: updateTemplates.UPDATE_WORKER_ATTRIBUTE
        }.toString());
        const onTemplateChange = Dropdown.mock.calls[0][0].updateValue;
        act(() => onTemplateChange(null, { value: updateTemplates.UPDATE_WORKER_ATTRIBUTE }));
        expect(Dropdown.mock.calls.length).toBe(6);
        expect(Dropdown.mock.calls[3][0].value.toString()).toBe({
          label: "Update Worker Attribute",
          value: updateTemplates.UPDATE_WORKER_ATTRIBUTE
        }.toString());
        //enhance this test in the future to update to a different option when we have them
      });
    });
    describe("UpdateWorker Attributes", () => {
      describe("Attribute Dropdown is updated to availableAttributes.ZERO_OUT_ENABLED", () => {
        test("Boolean Dropdown is rendered", () => {

        });
      });
      describe("Attribute Dropdown is updated to availableAttributes.SELF_SERVICE_INDICATOR", () => {
        test("Boolean Dropdown is rendered", () => {

        });
      });
      describe("Attribute Dropdown is updated to availableAttributes.MANAGER", () => {
        test("CustomInput is rendered is rendered", () => {

        });
      });
      describe("Attribute Dropdown is updated to availableAttributes.PROFILE", () => {
        test("CustomInput is rendered", () => {

        });
      });
      describe("Attribute Dropdown is updated to availableAttributes.DID", () => {
        test("PhoneNumberInput is rendered", () => {

        });
      });
    });
  });
});