import { BulkUpdateAttributes } from "../BulkUpdateAttributes";
import { getUpdateTemplates } from "usermanagement/templates";
import { availableAttributes } from "usermanagement/consts";
import { CustomInput } from "components/CustomInput";
import { Dropdown } from "components/Dropdown";
import { PhoneNumberInput } from "components/PhoneNumberInput";
import React from "react";
import {
  act,
  render,
  setupMockedComponents
} from "testUtils";

jest.mock("components/CustomInput", () => ({
  CustomInput: jest.fn()
}));

jest.mock("components/Dropdown", () => ({
  Dropdown: jest.fn()
}));

jest.mock("components/PhoneNumberInput", () => ({
  PhoneNumberInput: jest.fn()
}));

jest.mock("components/StyledButton", () => ({
  StyledButton: jest.fn()
}));

jest.mock("context/appContext", () => ({
  useAdminState: jest.fn()
}));

const mockReplaceTemplates = jest.fn();
const mockUpdateTemplates = jest.fn();
const mockRemoveTemplates = jest.fn();

const updateTemplates = getUpdateTemplates();

describe("<BulkUpdateAttributes />", () => {
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
      <BulkUpdateAttributes
        template={updateTemplates.UPDATE_WORKER_ATTRIBUTE}
        selectedTemplates={selectedTemplates || []}
        replaceTemplate={mockReplaceTemplates}
        updateTemplate={mockUpdateTemplates}
        removeTemplate={mockRemoveTemplates}
      />
    );
  };

  describe("initial render", () => {
    describe("component is rendered as expected", () => {
      test("should render options in default state", () => {
        renderComponent([]);
        expect(Dropdown.mock.calls.length).toBe(2);
        expect(PhoneNumberInput.mock.calls.length).toBe(0);
        expect(CustomInput.mock.calls.length).toBe(0);
        //Choose an attribute Dropdown
        expect(Dropdown.mock.calls[0][0].label).toBe("Attribute");
        expect(Dropdown.mock.calls[0][0].value.toString()).toBe(availableAttributes.SELF_SERVICE_INDICATOR.toString());
        expect(Dropdown.mock.calls[0][0].options).toStrictEqual([
          availableAttributes.ZERO_OUT_ENABLED,
          availableAttributes.SELF_SERVICE_INDICATOR,
          availableAttributes.PROFILE,
          availableAttributes.CALLER_ID,
          availableAttributes.ROUTING_TEAM,
          availableAttributes.ROUTING_SALES_ASSOC_WORKERS
        ]);
        //Choose an value Dropdown
        expect(Dropdown.mock.calls[1][0].label).toBe("Boolean");
        expect(Dropdown.mock.calls[1][0].value.toString()).toBe("");
        expect(Dropdown.mock.calls[1][0].options.toString()).toBe([
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
    describe("UpdateWorker Attributes", () => {
      describe("Attribute Dropdown is updated to availableAttributes.ROUTING_SALES_ASSOC_WORKERS", () => {
        test("CustomInput is rendered", () => {
          renderComponent([]);
          expect(Dropdown.mock.calls.length).toBe(2);
          expect(Dropdown.mock.calls[0][0].value).toBe(availableAttributes.SELF_SERVICE_INDICATOR);
          const onAttributeChange = Dropdown.mock.calls[0][0].updateValue;
          act(() => onAttributeChange(null, availableAttributes.ROUTING_SALES_ASSOC_WORKERS));
          expect(Dropdown.mock.calls.length).toBe(3);
          expect(Dropdown.mock.calls[2][0].value).toBe(availableAttributes.ROUTING_SALES_ASSOC_WORKERS);
          expect(CustomInput.mock.calls.length).toBe(1);
          expect(CustomInput.mock.calls[0][0].value).toBe("");
        });
        describe("attribute value is updated to an invalid value", () => {
          describe("template is not already in the selected Templates list", () => {
            test("no template update function is called", () => {
              renderComponent([]);
              expect(Dropdown.mock.calls.length).toBe(2);
              expect(Dropdown.mock.calls[0][0].value).toBe(availableAttributes.SELF_SERVICE_INDICATOR);
              const onAttributeChange = Dropdown.mock.calls[0][0].updateValue;
              act(() => onAttributeChange(null, availableAttributes.ROUTING_SALES_ASSOC_WORKERS));
              const onValueChange = CustomInput.mock.calls[0][0].updateValue;
              act(() => onValueChange(null, ""));
              expect(mockReplaceTemplates).toHaveBeenCalledTimes(0);
              expect(mockUpdateTemplates).toHaveBeenCalledTimes(0);
              expect(mockRemoveTemplates).toHaveBeenCalledTimes(0);
            });
          });
          describe("template is already in the selected Templates list", () => {
            test("removeTemplate function is called", () => {
              const template = { ...updateTemplates.UPDATE_WORKER_ATTRIBUTE };
              renderComponent([template]);
              expect(mockRemoveTemplates).toHaveBeenCalledTimes(1);
              expect(Dropdown.mock.calls.length).toBe(2);
              expect(Dropdown.mock.calls[0][0].value).toBe(availableAttributes.SELF_SERVICE_INDICATOR);
              const onAttributeChange = Dropdown.mock.calls[0][0].updateValue;
              act(() => onAttributeChange(null, availableAttributes.ROUTING_SALES_ASSOC_WORKERS));
              const onValueChange = CustomInput.mock.calls[0][0].updateValue;
              act(() => onValueChange(""));
              expect(mockReplaceTemplates).toHaveBeenCalledTimes(0);
              expect(mockUpdateTemplates).toHaveBeenCalledTimes(0);
              expect(mockRemoveTemplates).toHaveBeenCalledTimes(1);
              expect(mockRemoveTemplates).toHaveBeenCalledWith(updateTemplates.UPDATE_WORKER_ATTRIBUTE);
            });
          });
        });
        describe("attribute value is updated to a valid value", () => {
          describe("template is not already in the selected Templates list", () => {
            test("replaceTemplate is called", () => {
              renderComponent([]);
              expect(Dropdown.mock.calls.length).toBe(2);
              expect(Dropdown.mock.calls[0][0].value).toBe(availableAttributes.SELF_SERVICE_INDICATOR);
              const onAttributeChange = Dropdown.mock.calls[0][0].updateValue;
              act(() => onAttributeChange(null, availableAttributes.ROUTING_SALES_ASSOC_WORKERS));
              const onValueChange = CustomInput.mock.calls[0][0].updateValue;
              act(() => onValueChange("Snowball, n1234567, weeeeee"));
              expect(mockReplaceTemplates).toHaveBeenCalledTimes(1);
              expect(mockReplaceTemplates).toHaveBeenCalledWith({
                ...updateTemplates.UPDATE_WORKER_ATTRIBUTE,
                data: {
                  key: "sales_assoc_workers",
                  value: "Snowball, n1234567, weeeeee",
                  location: ["attributes","routing"]
                }
              });
              expect(mockUpdateTemplates).toHaveBeenCalledTimes(0);
              expect(mockRemoveTemplates).toHaveBeenCalledTimes(0);
            });
          });
          describe("template is already in the selected Templates list", () => {
            test("updateTemplate function is called", () => {
              const selectedTemplate = { ...updateTemplates.UPDATE_WORKER_ATTRIBUTE };
              renderComponent([selectedTemplate]);
              expect(Dropdown.mock.calls.length).toBe(2);
              expect(Dropdown.mock.calls[0][0].value).toBe(availableAttributes.SELF_SERVICE_INDICATOR);
              const onAttributeChange = Dropdown.mock.calls[0][0].updateValue;
              act(() => onAttributeChange(null, availableAttributes.ROUTING_SALES_ASSOC_WORKERS));
              const onValueChange = CustomInput.mock.calls[0][0].updateValue;
              act(() => onValueChange("Comet, n12Ellen, wow"));
              expect(mockReplaceTemplates).toHaveBeenCalledTimes(0);
              expect(mockUpdateTemplates).toHaveBeenCalledTimes(1);
              expect(mockUpdateTemplates).toHaveBeenCalledWith(selectedTemplate, {
                key: "sales_assoc_workers",
                value: "Comet, n12Ellen, wow",
                location: ["attributes","routing"]
              });
              //remove is run upon first render since the initial value is not valid
              expect(mockRemoveTemplates).toHaveBeenCalledTimes(1);
            });
          });
        });
      });
      describe("Attribute Dropdown is updated to availableAttributes.ZERO_OUT_ENABLED", () => {
        test("Boolean Dropdown is rendered", () => {
          renderComponent([]);
          expect(Dropdown.mock.calls.length).toBe(2);
          expect(Dropdown.mock.calls[0][0].value).toBe(availableAttributes.SELF_SERVICE_INDICATOR);
          const onAttributeChange = Dropdown.mock.calls[0][0].updateValue;
          act(() => onAttributeChange(null, availableAttributes.ZERO_OUT_ENABLED));
          expect(Dropdown.mock.calls.length).toBe(4);
          expect(Dropdown.mock.calls[2][0].value).toBe(availableAttributes.ZERO_OUT_ENABLED);
          expect(Dropdown.mock.calls[3][0].value).toBe("");
        });
        describe("attribute value is updated to an invalid value", () => {
          describe("template is not already in the selected Templates list", () => {
            test("no template update function is called", () => {
              renderComponent([]);
              expect(Dropdown.mock.calls.length).toBe(2);
              expect(Dropdown.mock.calls[0][0].value).toBe(availableAttributes.SELF_SERVICE_INDICATOR);
              const onAttributeChange = Dropdown.mock.calls[0][0].updateValue;
              act(() => onAttributeChange(null, availableAttributes.ZERO_OUT_ENABLED));
              const onValueChange = Dropdown.mock.calls[3][0].updateValue;
              act(() => onValueChange(null, ""));
              expect(mockReplaceTemplates).toHaveBeenCalledTimes(0);
              expect(mockUpdateTemplates).toHaveBeenCalledTimes(0);
              expect(mockRemoveTemplates).toHaveBeenCalledTimes(0);
            });
          });
          describe("template is already in the selected Templates list", () => {
            test("removeTemplate function is called", () => {
              const template = { ...updateTemplates.UPDATE_WORKER_ATTRIBUTE };
              renderComponent([template]);
              expect(mockRemoveTemplates).toHaveBeenCalledTimes(1);
              expect(Dropdown.mock.calls.length).toBe(2);
              expect(Dropdown.mock.calls[0][0].value).toBe(availableAttributes.SELF_SERVICE_INDICATOR);
              const onAttributeChange = Dropdown.mock.calls[0][0].updateValue;
              act(() => onAttributeChange(null, availableAttributes.ZERO_OUT_ENABLED));
              const onValueChange = Dropdown.mock.calls[3][0].updateValue;
              act(() => onValueChange(null, ""));
              expect(mockReplaceTemplates).toHaveBeenCalledTimes(0);
              expect(mockUpdateTemplates).toHaveBeenCalledTimes(0);
              expect(mockRemoveTemplates).toHaveBeenCalledTimes(2);
              expect(mockRemoveTemplates).toHaveBeenCalledWith(updateTemplates.UPDATE_WORKER_ATTRIBUTE);
            });
          });
        });
        describe("attribute value is updated to a valid value", () => {
          describe("template is not already in the selected Templates list", () => {
            test("replaceTemplate is called", () => {
              renderComponent([]);
              expect(Dropdown.mock.calls.length).toBe(2);
              expect(Dropdown.mock.calls[0][0].value).toBe(availableAttributes.SELF_SERVICE_INDICATOR);
              const onAttributeChange = Dropdown.mock.calls[0][0].updateValue;
              act(() => onAttributeChange(null, availableAttributes.ZERO_OUT_ENABLED));
              const onValueChange = Dropdown.mock.calls[3][0].updateValue;
              act(() => onValueChange(null, { value: false }));
              expect(mockReplaceTemplates).toHaveBeenCalledTimes(1);
              expect(mockReplaceTemplates).toHaveBeenCalledWith({
                ...updateTemplates.UPDATE_WORKER_ATTRIBUTE,
                data: {
                  key: "zeroOutEnabled",
                  value: false,
                  location: null
                }
              });
              expect(mockUpdateTemplates).toHaveBeenCalledTimes(0);
              expect(mockRemoveTemplates).toHaveBeenCalledTimes(0);
            });
          });
          describe("template is already in the selected Templates list", () => {
            test("updateTemplate function is called", () => {
              const selectedTemplate = { ...updateTemplates.UPDATE_WORKER_ATTRIBUTE };
              renderComponent([selectedTemplate]);
              expect(Dropdown.mock.calls.length).toBe(2);
              expect(Dropdown.mock.calls[0][0].value).toBe(availableAttributes.SELF_SERVICE_INDICATOR);
              const onAttributeChange = Dropdown.mock.calls[0][0].updateValue;
              act(() => onAttributeChange(null, availableAttributes.ZERO_OUT_ENABLED));
              const onValueChange = Dropdown.mock.calls[3][0].updateValue;
              act(() => onValueChange(null, { value: true }));
              expect(mockReplaceTemplates).toHaveBeenCalledTimes(0);
              expect(mockUpdateTemplates).toHaveBeenCalledTimes(1);
              expect(mockUpdateTemplates).toHaveBeenCalledWith(selectedTemplate, {
                key: "zeroOutEnabled",
                value: true,
                location: null
              });
              //remove is run upon first render since the initial value is not valid
              expect(mockRemoveTemplates).toHaveBeenCalledTimes(1);
            });
          });
        });
      });
      describe("Attribute Dropdown is updated to availableAttributes.SELF_SERVICE_INDICATOR", () => {
        test("Boolean Dropdown is rendered", () => {
          renderComponent([]);
          expect(Dropdown.mock.calls.length).toBe(2);
          expect(Dropdown.mock.calls[0][0].value).toBe(availableAttributes.SELF_SERVICE_INDICATOR);
          const onAttributeChange = Dropdown.mock.calls[0][0].updateValue;
          act(() => onAttributeChange(null, availableAttributes.ZERO_OUT_ENABLED));
          expect(Dropdown.mock.calls.length).toBe(4);
          const onAttributeRevert = Dropdown.mock.calls[2][0].updateValue;
          act(() => onAttributeRevert(null, availableAttributes.SELF_SERVICE_INDICATOR));
          expect(Dropdown.mock.calls.length).toBe(6);
          expect(Dropdown.mock.calls[4][0].value).toBe(availableAttributes.SELF_SERVICE_INDICATOR);
          expect(Dropdown.mock.calls[5][0].value).toBe("");
        });
        describe("attribute value is updated to an invalid value", () => {
          describe("template is not already in the selected Templates list", () => {
            test("no template update function is called", () => {
              renderComponent([]);
              expect(Dropdown.mock.calls.length).toBe(2);
              expect(Dropdown.mock.calls[0][0].value).toBe(availableAttributes.SELF_SERVICE_INDICATOR);
              const onValueChange = Dropdown.mock.calls[1][0].updateValue;
              act(() => onValueChange(null, ""));
              expect(mockReplaceTemplates).toHaveBeenCalledTimes(0);
              expect(mockUpdateTemplates).toHaveBeenCalledTimes(0);
              expect(mockRemoveTemplates).toHaveBeenCalledTimes(0);
            });
          });
          describe("template is already in the selected Templates list", () => {
            test("removeTemplate function is called", () => {
              const template = { ...updateTemplates.UPDATE_WORKER_ATTRIBUTE };
              renderComponent([template]);
              expect(mockRemoveTemplates).toHaveBeenCalledTimes(1);
              expect(Dropdown.mock.calls.length).toBe(2);
              expect(Dropdown.mock.calls[0][0].value).toBe(availableAttributes.SELF_SERVICE_INDICATOR);
              const onValueChange = Dropdown.mock.calls[1][0].updateValue;
              act(() => onValueChange(null, ""));
              expect(mockReplaceTemplates).toHaveBeenCalledTimes(0);
              expect(mockUpdateTemplates).toHaveBeenCalledTimes(0);
              expect(mockRemoveTemplates).toHaveBeenCalledTimes(2);
              expect(mockRemoveTemplates).toHaveBeenCalledWith(updateTemplates.UPDATE_WORKER_ATTRIBUTE);
            });
          });
        });
        describe("attribute value is updated to a valid value", () => {
          describe("template is not already in the selected Templates list", () => {
            test("replaceTemplate is called", () => {
              renderComponent([]);
              expect(Dropdown.mock.calls.length).toBe(2);
              expect(Dropdown.mock.calls[0][0].value).toBe(availableAttributes.SELF_SERVICE_INDICATOR);
              const onValueChange = Dropdown.mock.calls[1][0].updateValue;
              act(() => onValueChange(null, { value: false }));
              expect(mockReplaceTemplates).toHaveBeenCalledTimes(1);
              expect(mockReplaceTemplates).toHaveBeenCalledWith({
                ...updateTemplates.UPDATE_WORKER_ATTRIBUTE,
                data: {
                  key: "selfServiceInd",
                  value: false,
                  location: null
                }
              });
              expect(mockUpdateTemplates).toHaveBeenCalledTimes(0);
              expect(mockRemoveTemplates).toHaveBeenCalledTimes(0);
            });
          });
          describe("template is already in the selected Templates list", () => {
            test("updateTemplate function is called", () => {
              const selectedTemplate = { ...updateTemplates.UPDATE_WORKER_ATTRIBUTE };
              renderComponent([selectedTemplate]);
              expect(Dropdown.mock.calls.length).toBe(2);
              expect(Dropdown.mock.calls[0][0].value).toBe(availableAttributes.SELF_SERVICE_INDICATOR);
              const onValueChange = Dropdown.mock.calls[1][0].updateValue;
              act(() => onValueChange(null, { value: true }));
              expect(mockReplaceTemplates).toHaveBeenCalledTimes(0);
              expect(mockUpdateTemplates).toHaveBeenCalledTimes(1);
              expect(mockUpdateTemplates).toHaveBeenCalledWith(selectedTemplate, {
                key: "selfServiceInd",
                value: true,
                location: null
              });
              //remove is run upon first render since the initial value is not valid
              expect(mockRemoveTemplates).toHaveBeenCalledTimes(1);
            });
          });
        });
      });
      describe("Attribute Dropdown is updated to availableAttributes.PROFILE", () => {
        test("CustomInput is rendered", () => {
          renderComponent([]);
          expect(Dropdown.mock.calls.length).toBe(2);
          expect(Dropdown.mock.calls[0][0].value).toBe(availableAttributes.SELF_SERVICE_INDICATOR);
          const onAttributeChange = Dropdown.mock.calls[0][0].updateValue;
          act(() => onAttributeChange(null, availableAttributes.PROFILE));
          expect(Dropdown.mock.calls.length).toBe(3);
          expect(Dropdown.mock.calls[2][0].value).toBe(availableAttributes.PROFILE);
          expect(CustomInput.mock.calls.length).toBe(1);
          expect(CustomInput.mock.calls[0][0].value).toBe("");
        });
        describe("attribute value is updated to an invalid value", () => {
          describe("template is not already in the selected Templates list", () => {
            test("no template update function is called", () => {
              renderComponent([]);
              expect(Dropdown.mock.calls.length).toBe(2);
              expect(Dropdown.mock.calls[0][0].value).toBe(availableAttributes.SELF_SERVICE_INDICATOR);
              const onAttributeChange = Dropdown.mock.calls[0][0].updateValue;
              act(() => onAttributeChange(null, availableAttributes.PROFILE));
              const onValueChange = CustomInput.mock.calls[0][0].updateValue;
              act(() => onValueChange(null, "B3"));
              expect(mockReplaceTemplates).toHaveBeenCalledTimes(0);
              expect(mockUpdateTemplates).toHaveBeenCalledTimes(0);
              expect(mockRemoveTemplates).toHaveBeenCalledTimes(0);
            });
          });
          describe("template is already in the selected Templates list", () => {
            test("removeTemplate function is called", () => {
              const template = { ...updateTemplates.UPDATE_WORKER_ATTRIBUTE };
              renderComponent([template]);
              expect(mockRemoveTemplates).toHaveBeenCalledTimes(1);
              expect(Dropdown.mock.calls.length).toBe(2);
              expect(Dropdown.mock.calls[0][0].value).toBe(availableAttributes.SELF_SERVICE_INDICATOR);
              const onAttributeChange = Dropdown.mock.calls[0][0].updateValue;
              act(() => onAttributeChange(null, availableAttributes.PROFILE));
              const onValueChange = CustomInput.mock.calls[0][0].updateValue;
              act(() => onValueChange("B4"));
              expect(mockReplaceTemplates).toHaveBeenCalledTimes(0);
              expect(mockUpdateTemplates).toHaveBeenCalledTimes(0);
              expect(mockRemoveTemplates).toHaveBeenCalledTimes(2);
              expect(mockRemoveTemplates).toHaveBeenCalledWith(updateTemplates.UPDATE_WORKER_ATTRIBUTE);
            });
          });
        });
        describe("attribute value is updated to a valid value", () => {
          describe("template is not already in the selected Templates list", () => {
            test("replaceTemplate is called", () => {
              renderComponent([]);
              expect(Dropdown.mock.calls.length).toBe(2);
              expect(Dropdown.mock.calls[0][0].value).toBe(availableAttributes.SELF_SERVICE_INDICATOR);
              const onAttributeChange = Dropdown.mock.calls[0][0].updateValue;
              act(() => onAttributeChange(null, availableAttributes.PROFILE));
              const onValueChange = CustomInput.mock.calls[0][0].updateValue;
              act(() => onValueChange("32"));
              expect(mockReplaceTemplates).toHaveBeenCalledTimes(1);
              expect(mockReplaceTemplates).toHaveBeenCalledWith({
                ...updateTemplates.UPDATE_WORKER_ATTRIBUTE,
                data: {
                  key: "profile_id",
                  value: "32",
                  location: "attributes"
                }
              });
              expect(mockUpdateTemplates).toHaveBeenCalledTimes(0);
              expect(mockRemoveTemplates).toHaveBeenCalledTimes(0);
            });
          });
          describe("template is already in the selected Templates list", () => {
            test("updateTemplate function is called", () => {
              const selectedTemplate = { ...updateTemplates.UPDATE_WORKER_ATTRIBUTE };
              renderComponent([selectedTemplate]);
              expect(Dropdown.mock.calls.length).toBe(2);
              expect(Dropdown.mock.calls[0][0].value).toBe(availableAttributes.SELF_SERVICE_INDICATOR);
              const onAttributeChange = Dropdown.mock.calls[0][0].updateValue;
              act(() => onAttributeChange(null, availableAttributes.PROFILE));
              const onValueChange = CustomInput.mock.calls[0][0].updateValue;
              act(() => onValueChange("3"));
              expect(mockReplaceTemplates).toHaveBeenCalledTimes(0);
              expect(mockUpdateTemplates).toHaveBeenCalledTimes(1);
              expect(mockUpdateTemplates).toHaveBeenCalledWith(selectedTemplate, {
                key: "profile_id",
                value: "3",
                location: "attributes"
              });
              //remove is run upon first render since the initial value is not valid
              expect(mockRemoveTemplates).toHaveBeenCalledTimes(1);
            });
          });
        });
      });
      describe("Attribute Dropdown is updated to availableAttributes.CALLER_ID", () => {
        test("PhoneNumberInput is rendered", () => {
          renderComponent([]);
          expect(Dropdown.mock.calls.length).toBe(2);
          expect(Dropdown.mock.calls[0][0].value).toBe(availableAttributes.SELF_SERVICE_INDICATOR);
          const onAttributeChange = Dropdown.mock.calls[0][0].updateValue;
          act(() => onAttributeChange(null, availableAttributes.CALLER_ID));
          expect(Dropdown.mock.calls.length).toBe(3);
          expect(Dropdown.mock.calls[2][0].value).toBe(availableAttributes.CALLER_ID);
          expect(PhoneNumberInput.mock.calls.length).toBe(1);
          expect(PhoneNumberInput.mock.calls[0][0].number).toBe("");
        });
        describe("attribute value is updated to an invalid value", () => {
          describe("template is not already in the selected Templates list", () => {
            test("no template update function is called", () => {
              renderComponent([]);
              expect(Dropdown.mock.calls.length).toBe(2);
              expect(Dropdown.mock.calls[0][0].value).toBe(availableAttributes.SELF_SERVICE_INDICATOR);
              const onAttributeChange = Dropdown.mock.calls[0][0].updateValue;
              act(() => onAttributeChange(null, availableAttributes.CALLER_ID));
              const onValueChange = PhoneNumberInput.mock.calls[0][0].updateValue;
              act(() => onValueChange(null, "60385182"));
              expect(mockReplaceTemplates).toHaveBeenCalledTimes(0);
              expect(mockUpdateTemplates).toHaveBeenCalledTimes(0);
              expect(mockRemoveTemplates).toHaveBeenCalledTimes(0);
            });
          });
          describe("template is already in the selected Templates list", () => {
            test("removeTemplate function is called", () => {
              const template = { ...updateTemplates.UPDATE_WORKER_ATTRIBUTE };
              renderComponent([template]);
              expect(mockRemoveTemplates).toHaveBeenCalledTimes(1);
              expect(Dropdown.mock.calls.length).toBe(2);
              expect(Dropdown.mock.calls[0][0].value).toBe(availableAttributes.SELF_SERVICE_INDICATOR);
              const onAttributeChange = Dropdown.mock.calls[0][0].updateValue;
              act(() => onAttributeChange(null, availableAttributes.CALLER_ID));
              const onValueChange = PhoneNumberInput.mock.calls[0][0].updateValue;
              act(() => onValueChange(null, "60385182"));
              expect(mockReplaceTemplates).toHaveBeenCalledTimes(0);
              expect(mockUpdateTemplates).toHaveBeenCalledTimes(0);
              expect(mockRemoveTemplates).toHaveBeenCalledTimes(2);
              expect(mockRemoveTemplates).toHaveBeenCalledWith(updateTemplates.UPDATE_WORKER_ATTRIBUTE);
            });
          });
        });
        describe("attribute value is updated to a valid value", () => {
          describe("template is not already in the selected Templates list", () => {
            test("replaceTemplate is called", () => {
              renderComponent([]);
              expect(Dropdown.mock.calls.length).toBe(2);
              expect(Dropdown.mock.calls[0][0].value).toBe(availableAttributes.SELF_SERVICE_INDICATOR);
              const onAttributeChange = Dropdown.mock.calls[0][0].updateValue;
              act(() => onAttributeChange(null, availableAttributes.CALLER_ID));
              const onValueChange = PhoneNumberInput.mock.calls[0][0].updateValue;
              act(() => onValueChange(null, "6038518200"));
              expect(mockReplaceTemplates).toHaveBeenCalledTimes(1);
              expect(mockReplaceTemplates).toHaveBeenCalledWith({
                ...updateTemplates.UPDATE_WORKER_ATTRIBUTE,
                data: {
                  key: "caller_id",
                  value: "+16038518200",
                  location: "attributes"
                }
              });
              expect(mockUpdateTemplates).toHaveBeenCalledTimes(0);
              expect(mockRemoveTemplates).toHaveBeenCalledTimes(0);
            });
          });
          describe("template is already in the selected Templates list", () => {
            test("updateTemplate function is called", () => {
              const selectedTemplate = { ...updateTemplates.UPDATE_WORKER_ATTRIBUTE };
              renderComponent([selectedTemplate]);
              expect(Dropdown.mock.calls.length).toBe(2);
              expect(Dropdown.mock.calls[0][0].value).toBe(availableAttributes.SELF_SERVICE_INDICATOR);
              const onAttributeChange = Dropdown.mock.calls[0][0].updateValue;
              act(() => onAttributeChange(null, availableAttributes.CALLER_ID));
              const onValueChange = PhoneNumberInput.mock.calls[0][0].updateValue;
              act(() => onValueChange(null, "6038518200"));
              expect(mockReplaceTemplates).toHaveBeenCalledTimes(0);
              expect(mockUpdateTemplates).toHaveBeenCalledTimes(1);
              expect(mockUpdateTemplates).toHaveBeenCalledWith(selectedTemplate, {
                key: "caller_id",
                value: "+16038518200",
                location: "attributes"
              });
              //remove is run upon first render since the initial value is not valid
              expect(mockRemoveTemplates).toHaveBeenCalledTimes(1);
            });
          });
        });
      });
      describe("Attribute Dropdown is updated to availableAttributes.ROUTING_TEAM", () => {
        test("Routing Team Dropdown is rendered", () => {
          renderComponent([]);
          expect(Dropdown.mock.calls.length).toBe(2);
          expect(Dropdown.mock.calls[0][0].value).toBe(availableAttributes.SELF_SERVICE_INDICATOR);
          const onAttributeChange = Dropdown.mock.calls[0][0].updateValue;
          act(() => onAttributeChange(null, availableAttributes.ROUTING_TEAM));
          expect(Dropdown.mock.calls.length).toBe(4);
          expect(Dropdown.mock.calls[2][0].value).toBe(availableAttributes.ROUTING_TEAM);
          expect(Dropdown.mock.calls[3][0].value).toBe("");
          expect(Dropdown.mock.calls[3][0].label).toBe("team");
        });
        describe("attribute value is updated to an invalid value", () => {
          describe("template is not already in the selected Templates list", () => {
            test("no template update function is called", () => {
              renderComponent([]);
              expect(Dropdown.mock.calls.length).toBe(2);
              expect(Dropdown.mock.calls[0][0].value).toBe(availableAttributes.SELF_SERVICE_INDICATOR);
              const onAttributeChange = Dropdown.mock.calls[0][0].updateValue;
              act(() => onAttributeChange(null, availableAttributes.ROUTING_TEAM));
              const onValueChange = Dropdown.mock.calls[3][0].updateValue;
              act(() => onValueChange(null, ""));
              expect(mockReplaceTemplates).toHaveBeenCalledTimes(0);
              expect(mockUpdateTemplates).toHaveBeenCalledTimes(0);
              expect(mockRemoveTemplates).toHaveBeenCalledTimes(0);
            });
          });
          describe("template is already in the selected Templates list", () => {
            test("removeTemplate function is called", () => {
              const template = { ...updateTemplates.UPDATE_WORKER_ATTRIBUTE };
              renderComponent([template]);
              expect(mockRemoveTemplates).toHaveBeenCalledTimes(1);
              expect(Dropdown.mock.calls.length).toBe(2);
              expect(Dropdown.mock.calls[0][0].value).toBe(availableAttributes.SELF_SERVICE_INDICATOR);
              const onAttributeChange = Dropdown.mock.calls[0][0].updateValue;
              act(() => onAttributeChange(null, availableAttributes.ROUTING_TEAM));
              const onValueChange = Dropdown.mock.calls[3][0].updateValue;
              act(() => onValueChange(null, ""));
              expect(mockReplaceTemplates).toHaveBeenCalledTimes(0);
              expect(mockUpdateTemplates).toHaveBeenCalledTimes(0);
              expect(mockRemoveTemplates).toHaveBeenCalledTimes(2);
              expect(mockRemoveTemplates).toHaveBeenCalledWith(updateTemplates.UPDATE_WORKER_ATTRIBUTE);
            });
          });
        });
        describe("attribute value is updated to a valid value", () => {
          describe("template is not already in the selected Templates list", () => {
            test("replaceTemplate is called", () => {
              renderComponent([]);
              expect(Dropdown.mock.calls.length).toBe(2);
              expect(Dropdown.mock.calls[0][0].value).toBe(availableAttributes.SELF_SERVICE_INDICATOR);
              const onAttributeChange = Dropdown.mock.calls[0][0].updateValue;
              act(() => onAttributeChange(null, availableAttributes.ROUTING_TEAM));
              const onValueChange = Dropdown.mock.calls[3][0].updateValue;
              act(() => onValueChange(null, { value: "Property" }));
              expect(mockReplaceTemplates).toHaveBeenCalledTimes(1);
              expect(mockReplaceTemplates).toHaveBeenCalledWith({
                ...updateTemplates.UPDATE_WORKER_ATTRIBUTE,
                data: {
                  key: "team",
                  value: "Property",
                  location: [
                    "attributes",
                    "routing"
                  ]
                }
              });
              expect(mockUpdateTemplates).toHaveBeenCalledTimes(0);
              expect(mockRemoveTemplates).toHaveBeenCalledTimes(0);
            });
          });
          describe("template is already in the selected Templates list", () => {
            test("updateTemplate function is called", () => {
              const selectedTemplate = { ...updateTemplates.UPDATE_WORKER_ATTRIBUTE };
              renderComponent([selectedTemplate]);
              expect(Dropdown.mock.calls.length).toBe(2);
              expect(Dropdown.mock.calls[0][0].value).toBe(availableAttributes.SELF_SERVICE_INDICATOR);
              const onAttributeChange = Dropdown.mock.calls[0][0].updateValue;
              act(() => onAttributeChange(null, availableAttributes.ROUTING_TEAM));
              const onValueChange = Dropdown.mock.calls[3][0].updateValue;
              act(() => onValueChange(null, { value: "Property" }));
              expect(mockReplaceTemplates).toHaveBeenCalledTimes(0);
              expect(mockUpdateTemplates).toHaveBeenCalledTimes(1);
              expect(mockUpdateTemplates).toHaveBeenCalledWith(selectedTemplate, {
                key: "team",
                value: "Property",
                location: [
                  "attributes",
                  "routing"
                ]
              });
              //remove is run upon first render since the initial value is not valid
              expect(mockRemoveTemplates).toHaveBeenCalledTimes(1);
            });
          });
        });
      });
    });
  });
});