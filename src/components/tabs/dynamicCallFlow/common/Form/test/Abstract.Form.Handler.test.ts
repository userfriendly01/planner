import {
  ControlEnum,
  FieldConfig,
  FieldConfigs,
  FieldDataType,
  FieldDataTypeEnum
} from "dynamicCallFlowCommon/Form/Form.Interfaces";
import {
  AbstractFormHandler, FormOnHandleResponse
} from "dynamicCallFlowCommon/Form/Abstract.Form.Handler";
import {
  AlertBarControllerRef,
  DataGridControllerRef,
  DataGridFilterRef,
  ReactGridApi,
  ReactStateAction
} from "dynamicCallFlowCommon/DynamicCallFlow.Interfaces";
import { DataGridController } from "dynamicCallFlowCommon/DataGrid/Abstract.DataGrid.Controller";
import { AlertBarController } from "dynamicCallFlowCommon/AlertBar.Controller";
import { ActionDataGridController } from "dynamicCallFlowAction/DataGrid/Action.DataGrid.Controller";
import { PHONE_NUMBER } from "dynamicCallFlowPhoneNumber/Form/Dynamic.PhoneNumber.Form.Fields";

describe("AbstractFormHandler", () => {
  let mockDataGridControllerRef: DataGridControllerRef<any>;
  let mockDataGridController: DataGridController<any>;
  let alertBarController: AlertBarController;

  beforeEach(() => {
    jest.clearAllMocks();
    const reactGridApi = {
    } as ReactGridApi;
    const dataGridFilter = {
    } as DataGridFilterRef<any>;

    alertBarController = new AlertBarController(jest.fn());
    const alertBarControllerRef = {
      current: alertBarController
    } as AlertBarControllerRef;

    mockDataGridController = new ActionDataGridController(reactGridApi, dataGridFilter, alertBarControllerRef);

    mockDataGridControllerRef = {
      current: mockDataGridController
    } as DataGridControllerRef<any>;
  });

  it("shouldInitializeWithGivenDataGridController", () => {
    const handler = new ConcreteFormHandler(mockDataGridControllerRef);
    expect(handler.dataGridController).toBe(mockDataGridControllerRef.current);
  });

  it("shouldConvertStringToArray", () => {
    const handler = new ConcreteFormHandler(mockDataGridControllerRef);
    const result = handler["convertValueToDataType"]("a,b,c", FieldDataTypeEnum.ARRAY);
    expect(result).toEqual(["a", "b", "c"]);
  });

  it("shouldConvertStringToBoolean", () => {
    const handler = new ConcreteFormHandler(mockDataGridControllerRef);
    const result = handler["convertValueToDataType"]("true", FieldDataTypeEnum.BOOLEAN);
    expect(result).toBe(true);
  });

  it("shouldConvertStringToNumber", () => {
    const handler = new ConcreteFormHandler(mockDataGridControllerRef);
    const result = handler["convertValueToDataType"]("123", FieldDataTypeEnum.NUMBER);
    expect(result).toBe(123);
  });

  it("shouldValidateFormSuccessfully", () => {
    const handler = new ConcreteFormHandler(mockDataGridControllerRef);
    const record = { phoneNumber: "1234567890" };
    const fieldConfigs: FieldConfigs = {
      phoneNumber: {
        fieldKey: PHONE_NUMBER,
        label: "Phone Number",
        originalControl: ControlEnum.Input,
        currentControl: ControlEnum.Input,
        isUserAbleToChangeControl: false,
        dataType: FieldDataTypeEnum.STRING
      } as FieldConfig
    };
    expect(() => handler.validateForm(record, fieldConfigs)).not.toThrow();
  });

  it("shouldThrowErrorForInvalidFields", () => {
    const handler = new ConcreteFormHandler(mockDataGridControllerRef);
    const record = { phoneNumber: "" };
    const fieldConfigs: FieldConfigs = {
      phoneNumber: {
        fieldKey: PHONE_NUMBER,
        label: "Phone Number",
        required: true,
        originalControl: ControlEnum.Input,
        currentControl: ControlEnum.Input,
        isUserAbleToChangeControl: false,
        dataType: FieldDataTypeEnum.STRING,
        fieldConditionCheck: (record: any) => true
      } as FieldConfig
    };
    expect(() => handler.validateForm(record, fieldConfigs)).toThrow("The following fields are invalid: phoneNumber");
  });

  it("shouldGetHtmlInputElementValue", () => {
    const handler = new ConcreteFormHandler(mockDataGridControllerRef);
    const event = {
      target: {
        name: "phoneNumber",
        value: "1234567890"
      }
    } as React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;
    const fieldConfigs: FieldConfigs = {
      phoneNumber: {
        fieldKey: PHONE_NUMBER,
        label: "Phone Number",
        originalControl: ControlEnum.Input,
        currentControl: ControlEnum.Input,
        isUserAbleToChangeControl: false,
        dataType: FieldDataTypeEnum.STRING
      } as FieldConfig
    };
    const fieldConfigsReactStateAction = {
      state: fieldConfigs,
      setState: jest.fn()
    } as ReactStateAction<FieldConfigs>;
    const result = handler.getHtmlInputElementValue(event, fieldConfigsReactStateAction, "phoneNumber");
    expect(result).toBe("1234567890");
  });
});

class ConcreteFormHandler extends AbstractFormHandler<any> {
  get modalName(): string {
    return "TestModal";
  }

  get modalLabel(): string {
    return "Test Modal";
  }

  get displayCloneButton(): boolean {
    return true;
  }

  get displayDeleteButton(): boolean {
    return true;
  }

  handleOnSave(accessToken: string, record: any, fieldConfigs: FieldConfigs): Promise<FormOnHandleResponse<any>> {
    return Promise.resolve({ record });
  }

  handleOnDelete(accessToken: string, record: any): Promise<FormOnHandleResponse<any>> {
    return Promise.resolve({ record });
  }

  protected getRecordPropertyValue(record: any, key: string): FieldDataType {
    return record[key];
  }
}