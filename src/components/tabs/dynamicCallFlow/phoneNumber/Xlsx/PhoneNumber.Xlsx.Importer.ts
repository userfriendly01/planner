import { AbstractXlsxImporter } from "../../common/Xlsx/Abstract.Xlsx.Importer";
import { PhoneNumberRecordType } from "../GraphQL/Dynamic.PhoneNumber.Interfaces";
import { PhoneNumberXlsxRow } from "./PhoneNumber.Xlsx.Interfaces";
import { PhoneNumberXlsxRecordGenerator } from "./PhoneNumber.Xlsx.Record.Generator";
import { PhoneNumberXlsxValueInspector } from "./PhoneNumber.Xlsx.Value.Inspector";

export class PhoneNumberXlsxImporter extends AbstractXlsxImporter<PhoneNumberXlsxRow, PhoneNumberRecordType> {
  private readonly _phoneNumberValueInspector: PhoneNumberXlsxValueInspector = new PhoneNumberXlsxValueInspector();
  private readonly _phoneNumberRecordsXlsxGenerator: PhoneNumberXlsxRecordGenerator = new PhoneNumberXlsxRecordGenerator();

  static getInstance(): PhoneNumberXlsxImporter {
    return new PhoneNumberXlsxImporter();
  }
  protected inspectXlsxRows(phoneNumberXlsxRows: Array<PhoneNumberXlsxRow>): void {
    this._phoneNumberValueInspector.inspectValues(phoneNumberXlsxRows);
  }

  protected generateRecords(phoneNumberXlsxRows: Array<PhoneNumberXlsxRow>): Array<PhoneNumberRecordType> {
    return this._phoneNumberRecordsXlsxGenerator.generatePhoneNumberRecords(phoneNumberXlsxRows);
  }
}
