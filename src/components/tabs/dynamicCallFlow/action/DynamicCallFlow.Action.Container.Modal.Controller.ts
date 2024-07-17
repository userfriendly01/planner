import { NotInUseModalType } from "components/tabs/dynamicCallFlow/common/Modal.Controller";

export type ActionModalType =
  "Add Action"
  | "Edit Action"
  | "Bulk Delete"
  | "Bulk Add"
  | "Bulk Edit"
  | "Filter"
  | NotInUseModalType;

export enum ActionModalTypeEnum {
    AddAction = "Add Action",
    EditAction = "Edit Action",
    BulkDelete = "Bulk Delete",
    BulkAdd = "Bulk Add",
    BulkEdit = "Bulk Edit",
    Filter = "Filter"
}
