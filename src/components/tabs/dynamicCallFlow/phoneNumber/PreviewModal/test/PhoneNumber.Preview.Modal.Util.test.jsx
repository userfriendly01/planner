import {
  CALLER_TYPE,
  DIALED_DESCRIPTION,
  OFFICE_NUMBERS, PREDICTIVE_CALLER
} from "../../Form/Dynamic.PhoneNumber.Form.Fields";
import { ComponentControl } from "components/ComponentControl";
import { PhoneNumberModalTypeEnum } from "../../DynamicCallFlow.PhoneNumber.Interfaces";
import { RequiredPhoneNumberFormFields } from "../../Form/Legacy.PhoneNumber.Form.FieldConfigs";
import { reconstructTableColumnDef } from "../PhoneNumber.Preview.Modal.Util";
import {
  render, setupMockedComponents
} from "testUtils";

jest.mock("components/ComponentControl", () => ({
  ComponentControl: jest.fn()
}));

describe("PhoneNumber.Preview.Modal.Util.test", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setupMockedComponents({
      ComponentControl
    });
  });  describe("reconstructTableColumnDef", () => {
    it("should return the same columnDef", () => {
      const columnDef = [{ field: "test" }];
      expect(reconstructTableColumnDef(PhoneNumberModalTypeEnum.BulkDelete, columnDef, null, null)).toEqual(columnDef);
    });
    it("should return a singleSelect field", () => {
      const columnDef = [{ field: "test" }];
      const fieldOptions = { "test": ["test"]};
      const actual = reconstructTableColumnDef(PhoneNumberModalTypeEnum.BulkAdd, columnDef, null, fieldOptions);
      const expected = [{
        field: "test",
        editable: true,
        type: "singleSelect",
        valueOptions: ["test"],
        cellClassName: params=> {
          if (!fieldOptions["test"].includes(params.value) &&
            RequiredPhoneNumberFormFields.includes("test")) {
            return "MuiDataGrid-Custom-Cell-Format";
          }
          return "";
        }
      }];
      expect(JSON.stringify(actual)).toEqual(JSON.stringify(expected));
    });
    it("should return a singleSelect field that's missing required value", () => {
      const columnDef = [{
        field: CALLER_TYPE
      }];
      const fieldOptions = { [CALLER_TYPE]: ["a", "b", "c"]};
      const actual = reconstructTableColumnDef(PhoneNumberModalTypeEnum.BulkAdd, columnDef, null, fieldOptions);
      if(typeof actual[0].cellClassName === "function") {
        const cellClassName = actual[0].cellClassName({
          id: 1,
          row: undefined,
          rowNode: undefined,
          colDef: undefined,
          cellMode: "view",
          hasFocus: false,
          tabIndex: 0,
          field: CALLER_TYPE,
          value: ""
        });
        expect(cellClassName).toEqual("MuiDataGrid-Custom-Cell-Format");

      }

    });
    it("should return a singleSelect field that contains required value", () => {
      const columnDef = [{
        field: CALLER_TYPE
      }];
      const fieldOptions = { [CALLER_TYPE]: ["a", "b", "c"]};
      const actual = reconstructTableColumnDef(PhoneNumberModalTypeEnum.BulkAdd, columnDef, null, fieldOptions);
      if(typeof actual[0].cellClassName === "function") {
        const cellClassName = actual[0].cellClassName({
          id: 1,
          row: undefined,
          rowNode: undefined,
          colDef: undefined,
          cellMode: "view",
          hasFocus: false,
          tabIndex: 0,
          field: CALLER_TYPE,
          value: "a"
        });
        expect(cellClassName).toEqual("");

      }

    });
    it("should return a multiTextField field", () => {
      const columnDef = [{ field: OFFICE_NUMBERS }];
      const fieldOptions = { something: ["test"]};
      const mockGridApi = { current: { setEditCellValue: jest.fn() }};
      const actual = reconstructTableColumnDef(PhoneNumberModalTypeEnum.BulkAdd, columnDef, mockGridApi, fieldOptions);
      const expected = [{
        field: OFFICE_NUMBERS,
        editable: true
      }];
      const actualJson = JSON.stringify(actual);
      const expectedJson = JSON.stringify(expected);
      expect(actualJson).toEqual(expectedJson);
      const renderParam = {
        api: undefined,
        id: "1",
        field: "",
        row: { id: "1" },
        rowNode: undefined,
        colDef: undefined,
        cellMode: "edit",
        hasFocus: false,
        tabIndex: 0,
        value: []
      };
      render(actual[0].renderEditCell(renderParam));
      ComponentControl.mock.calls[0][0].onChange({ target: { value: "0160" }});
      expect(mockGridApi.current.setEditCellValue).toHaveBeenCalledWith({
        id: "1",
        field: OFFICE_NUMBERS,
        value: "0160"
      });
    });

    it("should return a switch field", () => {
      const columnDef = [{ field: PREDICTIVE_CALLER }];
      const fieldOptions = { something: ["test"]};
      const mockGridApi = { current: { setEditCellValue: jest.fn() }};
      const actual = reconstructTableColumnDef(PhoneNumberModalTypeEnum.BulkAdd, columnDef, mockGridApi, fieldOptions);
      const expected = [{
        field: "predictiveCaller",
        editable: true
      }];

      expect(JSON.stringify(actual)).toEqual(JSON.stringify(expected));
      const renderParam = {
        api: undefined,
        id: "1",
        field: "",
        row: { id: "1" },
        rowNode: undefined,
        colDef: undefined,
        cellMode: "edit",
        hasFocus: false,
        tabIndex: 0,
        value: []
      };
      render(actual[0].renderEditCell(renderParam));
      ComponentControl.mock.calls[0][0].onChange({ target: { value: "true" }});
      expect(mockGridApi.current.setEditCellValue).toHaveBeenCalledWith({
        id: "1",
        field: PREDICTIVE_CALLER,
        value: "true"
      });
      expect(typeof actual[0].cellClassName).toEqual("function");
      if(typeof actual[0].cellClassName === "function") {
        expect(actual[0].cellClassName({
          id: 1,
          row: undefined,
          rowNode: undefined,
          colDef: undefined,
          cellMode: "view",
          hasFocus: false,
          tabIndex: 0,
          field: PREDICTIVE_CALLER,
          value: "0123"
        })).toEqual("");
        expect(actual[0].cellClassName({
          id: 1,
          row: undefined,
          rowNode: undefined,
          colDef: undefined,
          cellMode: "view",
          hasFocus: false,
          tabIndex: 0,
          field: PREDICTIVE_CALLER,
          value: ""
        })).toEqual("");//this is because in fieldConfigs, predictiveCaller is not required
      }
    });
    it("should return a default field", () => {
      const columnDef = [{ field: DIALED_DESCRIPTION }];
      const fieldOptions = { something: ["test"]};
      const actual = reconstructTableColumnDef(PhoneNumberModalTypeEnum.BulkAdd, columnDef, null, fieldOptions);
      const expected = [{
        field: DIALED_DESCRIPTION,
        editable: true,
        cellClassName: params=> {
          if (!fieldOptions["test"].includes(params.value) &&
              RequiredPhoneNumberFormFields.includes("test")) {
            return "MuiDataGrid-Custom-Cell-Format";
          }
          return "";
        }
      }];
      expect(JSON.stringify(actual)).toEqual(JSON.stringify(expected));

      expect(typeof actual[0].cellClassName).toEqual("function");
      if(typeof actual[0].cellClassName === "function") {
        expect(actual[0].cellClassName({
          id: 1,
          row: undefined,
          rowNode: undefined,
          colDef: undefined,
          cellMode: "view",
          hasFocus: false,
          tabIndex: 0,
          field: DIALED_DESCRIPTION,
          value: "Claims FNOL"
        })).toEqual("");
        expect(actual[0].cellClassName({
          id: 1,
          row: undefined,
          rowNode: undefined,
          colDef: undefined,
          cellMode: "view",
          hasFocus: false,
          tabIndex: 0,
          field: DIALED_DESCRIPTION,
          value: ""
        })).toEqual("MuiDataGrid-Custom-Cell-Format");
      }
    });
  });
});