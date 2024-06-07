import { AbstractDataGridController } from "../../common/DataGrid/Abstract.DataGrid.Controller";
import { PhoneNumberRecordType } from "../GraphQL/Dynamic.PhoneNumber.Interfaces";
import { PKEY } from "../Form/Legacy.PhoneNumber.Form.Fields";

export class PhoneNumberDataGridController extends AbstractDataGridController<PhoneNumberRecordType> {
  protected recordKey(): string {
    return PKEY;
  }
}