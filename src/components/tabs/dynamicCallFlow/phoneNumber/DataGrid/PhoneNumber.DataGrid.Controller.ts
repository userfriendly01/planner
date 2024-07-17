import { AbstractDataGridController } from "components/tabs/dynamicCallFlow/common/DataGrid/Abstract.DataGrid.Controller";
import { PhoneNumberRecordType } from "components/tabs/dynamicCallFlow/phoneNumber/GraphQL/Dynamic.PhoneNumber.Interfaces";
import { PKEY } from "components/tabs/dynamicCallFlow/phoneNumber/Form/Legacy.PhoneNumber.Form.Fields";

export class PhoneNumberDataGridController extends AbstractDataGridController<PhoneNumberRecordType> {
  protected recordKey(): string {
    return PKEY;
  }
}