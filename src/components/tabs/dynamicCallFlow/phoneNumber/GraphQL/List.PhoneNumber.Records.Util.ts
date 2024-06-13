import { PhoneNumberRecordType } from "./Dynamic.PhoneNumber.Interfaces";
import { dynamicPhoneNumberListRecords } from "./Query/List.Dynamic.PhoneNumber.Records.Query";
import { legacyPhoneNumberListRecords } from "./Query/List.Legacy.PhoneNumber.Records.Query";

/**
 * This function is a single place to obtain both legacy and dynamic phone number records.  For the dynamic phone number, this simply
 * obtains the dynamic phone number configurations and not the phone number template actions associated with this phone number.
 *
 * This function exists due to maintaining two phone number databases, legacy and dynamic.  Eventually legacy phone number db will not be needed
 * and a refactor can be performed to change the ui to run solely to the specs of dynamic phone number and the functions
 * in this should no longer be needed.
 * @param {string} accessToken
 *
 * @return Promise<Array<PhoneNumberRecordType>>
 */
export async function listPhoneNumberRecords(accessToken: string): Promise<Array<PhoneNumberRecordType>> {
  // const [dynamicPhoneNumberRecords, legacyPhoneNumberRecords] =
  //   await Promise.all([
  //     listDynamicPhoneNumberRecords(accessToken),
  //     listLegacyPhoneNumberRecords(accessToken)
  //   ]);

  const phoneNumberRecords: Array<PhoneNumberRecordType> = await dynamicPhoneNumberListRecords(accessToken);
  // phoneNumberRecords = phoneNumberRecords.concat(legacyPhoneNumberRecords);

  phoneNumberRecords.forEach((phoneNumberRecord, index) => {
    phoneNumberRecord.id = index + 1;
  });

  // console.log(`dynamicPhoneNumberRecords: ${dynamicPhoneNumberRecords.length}, legacyPhoneNumberRecords: ${legacyPhoneNumberRecords.length}, phoneNumberRecords: ${phoneNumberRecords.length}`);
  return phoneNumberRecords;
}
