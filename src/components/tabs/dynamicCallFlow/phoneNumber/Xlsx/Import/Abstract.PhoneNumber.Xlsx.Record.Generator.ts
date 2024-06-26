import { PhoneNumberXlsxRow } from "../PhoneNumber.Xlsx.Interfaces";
import {
  BrandType, ChannelType, PhoneNumberRecordType
} from "../../GraphQL/Dynamic.PhoneNumber.Interfaces";

export abstract class AbstractPhoneNumberXlsxRecordGenerator {
  public generatePhoneNumberRecords(phoneNumberXlsxRows: Array<PhoneNumberXlsxRow>): Array<PhoneNumberRecordType> {
    const phoneNumberRecords: Array<PhoneNumberRecordType> = [];

    phoneNumberXlsxRows.forEach((phoneNumberXlsxRow: PhoneNumberXlsxRow) => {
      phoneNumberRecords.push({
        ...this.mapCommonPhoneNumberRecordFields(phoneNumberXlsxRow),
        ...this.mapPhoneNumberRecordTypeSpecificFields(phoneNumberXlsxRow)
      } as PhoneNumberRecordType);
    });

    return phoneNumberRecords;
  }

  private mapCommonPhoneNumberRecordFields(phoneNumberXlsxRow: PhoneNumberXlsxRow): PhoneNumberRecordType {
    return {
      brand: phoneNumberXlsxRow.brand as BrandType,
      callFlowTemplate: phoneNumberXlsxRow.callFlowTemplate,
      callTypeDescription: phoneNumberXlsxRow.callTypeDescription,
      channel: phoneNumberXlsxRow.channel as ChannelType,
      dialedDescription: phoneNumberXlsxRow.dialedDescription,
      employeeId: phoneNumberXlsxRow.employeeId,
      internetPlacement: phoneNumberXlsxRow.internetPlacement,
      lineOfBusiness: phoneNumberXlsxRow.lineOfBusiness,
      marketingChannel: phoneNumberXlsxRow.marketingChannel,
      predictiveCaller: phoneNumberXlsxRow.predictiveCaller === "TRUE",
      rangeIndicator: phoneNumberXlsxRow.rangeIndicator,
      requestID: phoneNumberXlsxRow.requestID,
      tfnRoutingGroup: phoneNumberXlsxRow.tfnRoutingGroup,
      tollFreeNumber: phoneNumberXlsxRow.tollFreeNumber,
      transferCode: phoneNumberXlsxRow.transferCode,
      whisper: phoneNumberXlsxRow.whisper
    } as PhoneNumberRecordType;
  }

  protected abstract mapPhoneNumberRecordTypeSpecificFields(phoneNumberXlsxRow: PhoneNumberXlsxRow): PhoneNumberRecordType;
}