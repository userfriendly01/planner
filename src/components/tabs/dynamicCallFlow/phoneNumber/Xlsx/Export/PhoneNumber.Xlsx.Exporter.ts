import { AbstractXlsxExporter } from "components/tabs/dynamicCallFlow/common/Xlsx/Abstract.Xlsx.Exporter";
import { PhoneNumberXlsxRow } from "dynamicCallFlow/Xlsx/PhoneNumber.Xlsx.Interfaces";
import { PhoneNumberRecordType } from "dynamicCallFlow/GraphQL/Dynamic.PhoneNumber.Interfaces";
import { LegacyPhoneNumberXlsxRowGenerator } from "dynamicCallFlow/Xlsx/Export/Legacy.PhoneNumber.Xlsx.Row.Generator";
import { PhoneNumberRecordUtil } from "dynamicCallFlow/GraphQL/PhoneNumber.Record.Util";
import { DynamicPhoneNumberXlsxRowGenerator } from "dynamicCallFlow/Xlsx/Export/Dynamic.PhoneNumber.Xlsx.Row.Generator";

const DYNAMIC_PHONE_NUMBER_WORKBOOK_NAME = "Dynamic Phone Numbers";
const LEGACY_PHONE_NUMBER_WORKBOOK_NAME = "Legacy Phone Numbers";

export class PhoneNumberXlsxExporter extends AbstractXlsxExporter<PhoneNumberXlsxRow, PhoneNumberRecordType> {
  private readonly _dynamicPhoneNumberXlsxRowGenerator: DynamicPhoneNumberXlsxRowGenerator = new DynamicPhoneNumberXlsxRowGenerator();
  private readonly _legacyPhoneNumberXlsxRowGenerator: LegacyPhoneNumberXlsxRowGenerator = new LegacyPhoneNumberXlsxRowGenerator();

  static instance(): PhoneNumberXlsxExporter {
    return new PhoneNumberXlsxExporter();
  }

  protected convertRecordsToXlsxRows(records: Array<PhoneNumberRecordType>): Array<PhoneNumberXlsxRow> {
    if (PhoneNumberRecordUtil.isDynamicPhoneNumberRecord(records[0])) {
      return this._dynamicPhoneNumberXlsxRowGenerator.convertRecordsToXlsxRows(records);
    } else {
      return this._legacyPhoneNumberXlsxRowGenerator.convertRecordsToXlsxRows(records);
    }
  }

  protected groupRecordsByWorkBookNames(phoneNumberRecords: Array<PhoneNumberRecordType>): Map<string, Array<PhoneNumberRecordType>> {
    const groupedRecords: Map<string, Array<PhoneNumberRecordType>> = new Map<string, Array<PhoneNumberRecordType>>();
    groupedRecords.set(DYNAMIC_PHONE_NUMBER_WORKBOOK_NAME, []);
    groupedRecords.set(LEGACY_PHONE_NUMBER_WORKBOOK_NAME, []);

    phoneNumberRecords.forEach(actionRecord => {
      if (PhoneNumberRecordUtil.isDynamicPhoneNumberRecord(actionRecord)) {
        groupedRecords.get(DYNAMIC_PHONE_NUMBER_WORKBOOK_NAME).push(actionRecord);
      } else {
        groupedRecords.get(LEGACY_PHONE_NUMBER_WORKBOOK_NAME).push(actionRecord);
      }
    });

    return groupedRecords;
  }
}