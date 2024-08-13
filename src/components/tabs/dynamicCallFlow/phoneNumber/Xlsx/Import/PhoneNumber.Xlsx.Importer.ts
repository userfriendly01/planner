import { AbstractXlsxImporter } from "components/tabs/dynamicCallFlow/common/Xlsx/Abstract.Xlsx.Importer";
import {
  PhoneNumberRecordType
} from "components/tabs/dynamicCallFlow/phoneNumber/GraphQL/Dynamic.PhoneNumber.Interfaces";
import {
  PhoneNumberXlsxImportLegacyRecordGenerator
} from "dynamicCallFlowPhoneNumber/Xlsx/Import/PhoneNumber.Xlsx.Import.Legacy.Record.Generator";
import {
  PhoneNumberXlsxImportDynamicRecordGenerator
} from "dynamicCallFlowPhoneNumber/Xlsx/Import/PhoneNumber.Xlsx.Import.Dynamic.Record.Generator";
import {
  DynamicPhoneNumberXlsxHeaders,
  LegacyPhoneNumberXlsxHeaders,
  PhoneNumberXlsxRow
} from "components/tabs/dynamicCallFlow/phoneNumber/Xlsx/PhoneNumber.Xlsx.Interfaces";
import {
  CALL_FLOW_NAME,
  NEXT_ACTION_ID,
  NEXT_ACTION_TYPE
} from "dynamicCallFlowPhoneNumber/Form/Dynamic.PhoneNumber.Form.Fields";
import {
  PhoneNumberXlsxImportDynamicValidator
} from "dynamicCallFlowPhoneNumber/Xlsx/Import/PhoneNumber.Xlsx.Import.Dynamic.Validator";
import {
  PhoneNumberXlsxImportLegacyValidator
} from "dynamicCallFlowPhoneNumber/Xlsx/Import/PhoneNumber.Xlsx.Import.Legacy.Validator";

export function isDynamicPhoneNumberXlsxRow(phoneNumberXlsxRow: PhoneNumberXlsxRow): boolean {
  const rowKeys = Object.keys(phoneNumberXlsxRow);
  return phoneNumberXlsxRow && rowKeys.includes(CALL_FLOW_NAME) && rowKeys.includes(NEXT_ACTION_ID) && rowKeys.includes(NEXT_ACTION_TYPE);
}

export function isDynamicPhoneNumberXlsxHeaders(headers: Array<string>): boolean {
  return headers && (
    headers.includes(CALL_FLOW_NAME)
    && headers.includes(NEXT_ACTION_ID)
    && headers.includes(NEXT_ACTION_TYPE));
}

export function isLegacyPhoneNumberXlsxRow(phoneNumberXlsxRow: PhoneNumberXlsxRow): boolean {
  return !isDynamicPhoneNumberXlsxRow(phoneNumberXlsxRow);
}

export function filterDynamicPhoneNumberXlsRows(phoneNumberXlsxRows: Array<PhoneNumberXlsxRow>): Array<PhoneNumberXlsxRow> {
  return phoneNumberXlsxRows.filter((phoneNumberXlsxRow: PhoneNumberXlsxRow) => isDynamicPhoneNumberXlsxRow(phoneNumberXlsxRow)) as Array<PhoneNumberXlsxRow>;
}

export function filterLegacyPhoneNumberXlsRows(phoneNumberXlsxRows: Array<PhoneNumberXlsxRow>): Array<PhoneNumberXlsxRow> {
  return phoneNumberXlsxRows.filter((phoneNumberXlsxRow: PhoneNumberXlsxRow) => isLegacyPhoneNumberXlsxRow(phoneNumberXlsxRow)) as Array<PhoneNumberXlsxRow>;
}

export class PhoneNumberXlsxImporter extends AbstractXlsxImporter<PhoneNumberXlsxRow, PhoneNumberRecordType> {
  private readonly _dynamicPhoneNumberXlsxImportValidator: PhoneNumberXlsxImportDynamicValidator = new PhoneNumberXlsxImportDynamicValidator();
  private readonly _legacyPhoneNumberXlsxImportValidator: PhoneNumberXlsxImportLegacyValidator = new PhoneNumberXlsxImportLegacyValidator();
  private readonly _legacyPhoneNumberXlsxRecordGenerator: PhoneNumberXlsxImportLegacyRecordGenerator = new PhoneNumberXlsxImportLegacyRecordGenerator();
  private readonly _dynamicPhoneNumberXlsxRecordGenerator: PhoneNumberXlsxImportDynamicRecordGenerator = new PhoneNumberXlsxImportDynamicRecordGenerator();

  static getInstance(): PhoneNumberXlsxImporter {
    return new PhoneNumberXlsxImporter();
  }

  protected inspectXlsx(headers: Array<string>, phoneNumberXlsxRows: Array<PhoneNumberXlsxRow>): void {
    const expectedHeaders = isDynamicPhoneNumberXlsxHeaders(headers) ? DynamicPhoneNumberXlsxHeaders : LegacyPhoneNumberXlsxHeaders;

    if (this.hasValidXlsxHeaders(headers, expectedHeaders)) {
      this._xlsxImporterResults.errors.push(...this._dynamicPhoneNumberXlsxImportValidator.validate(filterDynamicPhoneNumberXlsRows(phoneNumberXlsxRows)));
      this._xlsxImporterResults.errors.push(...this._legacyPhoneNumberXlsxImportValidator.validate(filterLegacyPhoneNumberXlsRows(phoneNumberXlsxRows)));
    }
  }

  protected generateRecords(phoneNumberXlsxRows: Array<PhoneNumberXlsxRow>): Array<PhoneNumberRecordType> {
    return [
      ...this._dynamicPhoneNumberXlsxRecordGenerator.generatePhoneNumberRecords(filterDynamicPhoneNumberXlsRows(phoneNumberXlsxRows)),
      ...this._legacyPhoneNumberXlsxRecordGenerator.generatePhoneNumberRecords(filterLegacyPhoneNumberXlsRows(phoneNumberXlsxRows))
    ];
  }
}
