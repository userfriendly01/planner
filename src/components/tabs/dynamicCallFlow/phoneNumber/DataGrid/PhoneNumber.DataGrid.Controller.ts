import { AbstractDataGridController } from "dynamicCallFlowCommon/DataGrid/Abstract.DataGrid.Controller";
import { PhoneNumberRecordType } from "dynamicCallFlowPhoneNumber/GraphQL/Dynamic.PhoneNumber.Interfaces";
import { PKEY } from "dynamicCallFlowPhoneNumber/Form/Legacy.PhoneNumber.Form.Fields";

export class PhoneNumberDataGridController extends AbstractDataGridController<PhoneNumberRecordType> {
  protected recordKey(): string {
    return PKEY;
  }
}