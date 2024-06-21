import { PhoneNumberRecordType } from "./Dynamic.PhoneNumber.Interfaces";
import { listDynamicPhoneNumberRecords } from "./Query/List.Dynamic.PhoneNumber.Records.Query";
import { listLegacyPhoneNumberRecords } from "./Query/List.Legacy.PhoneNumber.Records.Query";
import { LoadDataGridMonitorRef } from "components/tabs/dynamicCallFlow/common/DynamicCallFlow.Interfaces";

/**
 * This function is a single place to obtain both legacy and dynamic phone number records.  For the dynamic phone number, this simply
 * obtains the dynamic phone number configurations and not the phone number template actions associated with this phone number.
 *
 * This function exists due to maintaining two phone number databases, legacy and dynamic.  Eventually legacy phone number db will not be needed
 * and a refactor can be performed to change the ui to run solely to the specs of dynamic phone number and the functions
 * in this should no longer be needed.
 * @param {string} accessToken
 * @param {LoadDataGridMonitorRef} loadDataGridMonitor
 * @return Promise<Array<PhoneNumberRecordType>>
 */
export async function listPhoneNumberRecords(accessToken: string, loadDataGridMonitor?: LoadDataGridMonitorRef): Promise<Array<PhoneNumberRecordType>> {
  const [dynamicPhoneNumberRecords, legacyPhoneNumberRecords] =
    await Promise.all([
      listDynamicPhoneNumberRecords(accessToken, loadDataGridMonitor),
      listLegacyPhoneNumberRecords(accessToken, loadDataGridMonitor)
    ]);

  // return = await listDynamicPhoneNumberRecords(accessToken, loadDataGridMonitor);
  return [ ...dynamicPhoneNumberRecords, ...legacyPhoneNumberRecords ];
}
