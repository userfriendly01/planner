import { AbstractXlsxImporter } from "../../../common/Xlsx/Abstract.Xlsx.Importer";
import { PhoneNumberRecordType } from "../../GraphQL/Dynamic.PhoneNumber.Interfaces";
import { LegacyPhoneNumberXlsxRecordGenerator } from "./Legacy.PhoneNumber.Xlsx.Record.Generator";
import { PhoneNumberXlsxValueInspector } from "./PhoneNumber.Xlsx.Value.Inspector";
import { DynamicPhoneNumberXlsxRecordGenerator } from "dynamicCallFlow/Xlsx/Import/Dynamic.PhoneNumber.Xlsx.Record.Generator";
import { PhoneNumberXlsxRow } from "dynamicCallFlow/Xlsx/PhoneNumber.Xlsx.Interfaces";

export class PhoneNumberXlsxImporter extends AbstractXlsxImporter<PhoneNumberXlsxRow, PhoneNumberRecordType> {
  private readonly _phoneNumberValueInspector: PhoneNumberXlsxValueInspector = new PhoneNumberXlsxValueInspector();
  private readonly _legacyPhoneNumberXlsxRecordGenerator: LegacyPhoneNumberXlsxRecordGenerator = new LegacyPhoneNumberXlsxRecordGenerator();
  private readonly _dynamicPhoneNumberXlsxRecordGenerator: DynamicPhoneNumberXlsxRecordGenerator = new DynamicPhoneNumberXlsxRecordGenerator();

  static getInstance(): PhoneNumberXlsxImporter {
    return new PhoneNumberXlsxImporter();
  }
  protected inspectXlsxRows(phoneNumberXlsxRows: Array<PhoneNumberXlsxRow>): void {
    this._phoneNumberValueInspector.inspectValues(phoneNumberXlsxRows);
  }

  protected generateRecords(phoneNumberXlsxRows: Array<PhoneNumberXlsxRow>): Array<PhoneNumberRecordType> {
    return [
      ...this._legacyPhoneNumberXlsxRecordGenerator.generatePhoneNumberRecords(this.filterLegacyPhoneNumberXlsRows(phoneNumberXlsxRows)),
      ...this._dynamicPhoneNumberXlsxRecordGenerator.generatePhoneNumberRecords(this.filterDynamicPhoneNumberXlsRows(phoneNumberXlsxRows))
    ];
  }

  private filterDynamicPhoneNumberXlsRows(phoneNumberXlsxRows: Array<PhoneNumberXlsxRow>): Array<PhoneNumberXlsxRow> {
    return phoneNumberXlsxRows.filter((phoneNumberXlsxRow: PhoneNumberXlsxRow) => this.isDynamicPhoneNumberXlsxRow(phoneNumberXlsxRow)) as Array<PhoneNumberXlsxRow>;
  }

  private filterLegacyPhoneNumberXlsRows(phoneNumberXlsxRows: Array<PhoneNumberXlsxRow>): Array<PhoneNumberXlsxRow> {
    return phoneNumberXlsxRows.filter((phoneNumberXlsxRow: PhoneNumberXlsxRow) => this.isLegacyPhoneNumberXlsxRow(phoneNumberXlsxRow)) as Array<PhoneNumberXlsxRow>;
  }

  private isDynamicPhoneNumberXlsxRow(phoneNumberXlsxRow: PhoneNumberXlsxRow): boolean {
    return phoneNumberXlsxRow && "nextActionId" in phoneNumberXlsxRow;
  }

  private isLegacyPhoneNumberXlsxRow(phoneNumberXlsxRow: PhoneNumberXlsxRow): boolean {
    return !this.isDynamicPhoneNumberXlsxRow(phoneNumberXlsxRow);
  }
}
