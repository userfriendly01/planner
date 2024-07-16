import { NotInUseModalType } from "dynamicCallFlowCommon//Modal.Controller";

export type PhoneNumberModalType =
  "Add Dynamic Phone Number"
  | "Edit Dynamic Phone Number"
  | "Add Legacy Phone Number"
  | "Edit Legacy Phone Number"
  | "Bulk Delete"
  | "Bulk Add"
  | "Bulk Edit"
  | "Filter"
  | NotInUseModalType;

export enum PhoneNumberModalTypeEnum {
  AddDynamicPhoneNumber = "Add Dynamic Phone Number",
  EditDynamicPhoneNumber = "Edit Dynamic Phone Number",
  AddLegacyPhoneNumber = "Add Legacy Phone Number",
  EditLegacyPhoneNumber = "Edit Legacy Phone Number",
  BulkDelete = "Bulk Delete",
  BulkAdd = "Bulk Add",
  BulkEdit = "Bulk Edit",
  Filter = "Filter"
}