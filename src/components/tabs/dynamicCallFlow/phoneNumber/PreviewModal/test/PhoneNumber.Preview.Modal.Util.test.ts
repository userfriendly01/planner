import {
  GridCellParams, GridColDef
} from "@mui/x-data-grid";
import { PhoneNumberModalTypeEnum } from "../../DynamicCallFlow.PhoneNumber.Interfaces";
import { reconstructTableColumnDef } from "../PhoneNumber.Preview.Modal.Util";
import { FieldOptions } from "components/tabs/dynamicCallFlow/common/Form/AbstractFormFieldOptionsManager";
import { RequiredPhoneNumberFormFields } from "../../Form/Legacy.PhoneNumber.Form.FieldConfigs";
import { OFFICE_NUMBERS } from "../../Form/Dynamic.PhoneNumber.Form.Fields";

describe("PhoneNumber.Preview.Modal.Util.test", () => {
  describe("reconstructTableColumnDef", () => {
    it("should return the same columnDef", () => {
      const columnDef: Array<GridColDef> = [{ field: "test" }];
      expect(reconstructTableColumnDef(PhoneNumberModalTypeEnum.BulkDelete, columnDef, null, null)).toEqual(columnDef);
    });
    it("should return a singleSelect field", () => {
      const columnDef: Array<GridColDef> = [{ field: "test" }];
      const fieldOptions: FieldOptions = { "test": ["test"]};
      const actual = reconstructTableColumnDef(PhoneNumberModalTypeEnum.BulkAdd, columnDef, null, fieldOptions);
      const expected = [{
        field: "test",
        editable: true,
        type: "singleSelect",
        valueOptions: ["test"],
        cellClassName: (params: GridCellParams<any, string>)=> {
          if (!fieldOptions["test"].includes(params.value) &&
            RequiredPhoneNumberFormFields.includes("test")) {
            return "MuiDataGrid-Custom-Cell-Format";
          }
          return "";
        }
      }];
      expect(JSON.stringify(actual)).toEqual(JSON.stringify(expected));
      //TODO, render the cellClassName with and without content for a required field
    });
    it("should return a default field", () => {
      const columnDef: Array<GridColDef> = [{ field: "test" }];
      const fieldOptions: FieldOptions = { something: ["test"]};
      const actual = reconstructTableColumnDef(PhoneNumberModalTypeEnum.BulkAdd, columnDef, null, fieldOptions);
      const expected = [{
        field: "test",
        editable: true,
        cellClassName: (params: GridCellParams<any, string>)=> {
          if (!fieldOptions["test"].includes(params.value) &&
            RequiredPhoneNumberFormFields.includes("test")) {
            return "MuiDataGrid-Custom-Cell-Format";
          }
          return "";
        }
      }];
      expect(JSON.stringify(actual)).toEqual(JSON.stringify(expected));
      //TODO, render the cellClassName with and without content for a required field
    });
    it("should return Office Numbers", () => {
      const columnDef: Array<GridColDef> = [{ field: OFFICE_NUMBERS }];
      const fieldOptions: FieldOptions = { something: ["test"]};
      const actual = reconstructTableColumnDef(PhoneNumberModalTypeEnum.BulkAdd, columnDef, null, fieldOptions);
      const expected = [{
        field: "officeNumbers",
        editable: true
      }];
      expect(JSON.stringify(actual)).toEqual(JSON.stringify(expected));
      //TODO, render the cellClassName with and without content for a required field
    });
  });
});