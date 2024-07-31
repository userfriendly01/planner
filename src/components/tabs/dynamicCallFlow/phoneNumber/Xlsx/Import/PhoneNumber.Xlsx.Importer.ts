import { AbstractXlsxImporter } from "components/tabs/dynamicCallFlow/common/Xlsx/Abstract.Xlsx.Importer";
import { PhoneNumberRecordType } from "components/tabs/dynamicCallFlow/phoneNumber/GraphQL/Dynamic.PhoneNumber.Interfaces";
import { LegacyPhoneNumberXlsxRecordGenerator } from "components/tabs/dynamicCallFlow/phoneNumber/Xlsx/Import/Legacy.PhoneNumber.Xlsx.Record.Generator";
import { PhoneNumberXlsxValueInspector } from "components/tabs/dynamicCallFlow/phoneNumber/Xlsx/Import/PhoneNumber.Xlsx.Value.Inspector";
import { DynamicPhoneNumberXlsxRecordGenerator } from "components/tabs/dynamicCallFlow/phoneNumber/Xlsx/Import/Dynamic.PhoneNumber.Xlsx.Record.Generator";
import { PhoneNumberXlsxRow } from "components/tabs/dynamicCallFlow/phoneNumber/Xlsx/PhoneNumber.Xlsx.Interfaces";

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
    return phoneNumberXlsxRow && ("nextActionId" in phoneNumberXlsxRow || phoneNumberXlsxRow.migrateSelfServiceNumberToDynamic?.toLowerCase() === "true");
  }

  private isLegacyPhoneNumberXlsxRow(phoneNumberXlsxRow: PhoneNumberXlsxRow): boolean {
    return !this.isDynamicPhoneNumberXlsxRow(phoneNumberXlsxRow);
  }
}
