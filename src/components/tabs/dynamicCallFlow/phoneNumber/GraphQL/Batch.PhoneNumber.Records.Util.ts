import { PhoneNumberRecordType } from "components/tabs/dynamicCallFlow/phoneNumber/GraphQL/Dynamic.PhoneNumber.Interfaces";
import {
  batchCreateLegacyPhoneNumberRecords
} from "components/tabs/dynamicCallFlow/phoneNumber/GraphQL/Query/Batch.Create.Legacy.PhoneNumber.Records.Query";
import {
  BatchRecordQuery, BatchResults
} from "components/tabs/dynamicCallFlow/common/GraphQL/Abstract.BatchRecords.Query";
import {
  batchCreateDynamicPhoneNumberRecords
} from "components/tabs/dynamicCallFlow/phoneNumber/GraphQL/Query/Batch.Create.Dynamic.PhoneNumber.Records.Query";
import { PhoneNumberRecordUtil } from "components/tabs/dynamicCallFlow/phoneNumber/GraphQL/PhoneNumber.Record.Util";
import {
  batchDeleteLegacyPhoneNumberRecords
} from "components/tabs/dynamicCallFlow/phoneNumber/GraphQL/Query/Batch.Delete.Legacy.PhoneNumber.Records.Query";
import {
  batchDeleteDynamicPhoneNumberRecords
} from "dynamicCallFlowPhoneNumber/GraphQL/Query/Batch.Delete.Dynamic.PhoneNumber.Records.Query";

/**
 * This function separates the phone number record list into legacy and dynamic lists and executes the corresponding
 * batch function.  This will run batch create, update, and delete functions
 *
 * @param {string} accessTokenGraph token to use while calling graphql query
 * @param {Array<PhoneNumberRecordType>} phoneNumberRecords List of phone number records to be run in a batch query
 * @param {BatchRecordQuery<PhoneNumberRecordType>} batchLegacyPhoneNumberRecordQuery function to run legacy batch query
 * @param {BatchRecordQuery<PhoneNumberRecordType>} batchDynamicPhoneNumberRecordQuery function to run dynamic batch query
 *
 * @returns Promise<BatchResults<PhoneNumberRecordType>>
 */
async function batchPhoneNumberRecords(
  accessTokenGraph: string,
  phoneNumberRecords: Array<PhoneNumberRecordType>,
  batchLegacyPhoneNumberRecordQuery: BatchRecordQuery<PhoneNumberRecordType>,
  batchDynamicPhoneNumberRecordQuery: BatchRecordQuery<PhoneNumberRecordType>
): Promise<BatchResults<PhoneNumberRecordType>> {
  PhoneNumberRecordUtil.batchRemoveTransientProperties(phoneNumberRecords);

  // Process batch jobs concurrently
  const [legacyBatchResults, dynamicBatchResults] =
    await Promise.all([
      filterAndRunBatch(accessTokenGraph, phoneNumberRecords, batchLegacyPhoneNumberRecordQuery, true),
      filterAndRunBatch(accessTokenGraph, phoneNumberRecords, batchDynamicPhoneNumberRecordQuery)
    ]);

  return combineLegacyAndDynamicBatchResults(legacyBatchResults, dynamicBatchResults);
}

async function filterAndRunBatch(accessTokenGraph: string, phoneNumberRecords: Array<PhoneNumberRecordType>, batchPhoneNumberRecordQuery: BatchRecordQuery<PhoneNumberRecordType>, filterForLegacy = false): Promise<BatchResults<PhoneNumberRecordType>> {
  const filteredPhoneNumberRecords = filterPhoneNumberRecords(phoneNumberRecords, filterForLegacy);
  return await batchPhoneNumberRecordQuery(accessTokenGraph, filteredPhoneNumberRecords);
}

/**
 * This method takes an array of all phone number records (legacy and dynamic) and returns an array of either legacy phone number records
 * or dynamic phone number records.
 *
 * @param {Array<PhoneNumberRecordType>} phoneNumberRecords array of both legacy and dynamic phone number records.
 * @param {boolean} filterForLegacy if true, only legacy phone number records are returned, if false, only dynamic phone number records are returned
 *
 * @return {Array<PhoneNumberRecordType>} Filtered array of phone number records, returns either only legacy or only dynamic phone number records
 */
function filterPhoneNumberRecords(phoneNumberRecords: Array<PhoneNumberRecordType>, filterForLegacy: boolean): Array<PhoneNumberRecordType> {
  return phoneNumberRecords
    .filter( phoneNumberRecord => PhoneNumberRecordUtil.isLegacyPhoneNumberRecord(phoneNumberRecord) === filterForLegacy);
}

/**
 * Takes results from a legacy batch query and results from a dynamic batch query and combines them into one result
 * to be used to display to the user.
 *
 * @param {BatchResults<PhoneNumberRecordType>} legacyBatchResults results of legacy batch query
 * @param {BatchResults<PhoneNumberRecordType>} dynamicBatchResults results of dynamic batch query
 *
 * @return {BatchResults<PhoneNumberRecordType>} Returns combined batch results
 */
function combineLegacyAndDynamicBatchResults(legacyBatchResults: BatchResults<PhoneNumberRecordType>, dynamicBatchResults: BatchResults<PhoneNumberRecordType>): BatchResults<PhoneNumberRecordType> {
  // Throwing all results into legacyBatchResults rather than creating a new object to copy all results into.  Some
  legacyBatchResults.errors = legacyBatchResults.errors.concat(dynamicBatchResults.errors);
  legacyBatchResults.failure = legacyBatchResults.failure.concat(dynamicBatchResults.failure);
  legacyBatchResults.success = legacyBatchResults.success.concat(dynamicBatchResults.success);

  return legacyBatchResults;
}

/**
 * BatchPhoneNumberRecord class is used to create and delete phone number records in a batch query.  None of the functions above are exported.
 */
export class BatchPhoneNumberRecord {
  /**
   * There is no update as you cannot batch update records in DynamoDB on AWS.  Create will create or if the record already exists it will be replaced.
   *
   * @param {string} accessToken
   * @param {Array<PhoneNumberRecordType>} phoneNumberRecords
   */
  static async create(accessToken: string, phoneNumberRecords: Array<PhoneNumberRecordType>): Promise<BatchResults<PhoneNumberRecordType>> {
    phoneNumberRecords.forEach( (phoneNumberRecord: PhoneNumberRecordType) => PhoneNumberRecordUtil.removeNonNullableKeys(phoneNumberRecord));
    return await batchPhoneNumberRecords(accessToken, phoneNumberRecords, batchCreateLegacyPhoneNumberRecords, batchCreateDynamicPhoneNumberRecords);
  }

  static async delete(accessToken: string, phoneNumberRecords: Array<PhoneNumberRecordType>): Promise<BatchResults<PhoneNumberRecordType>> {
    return await batchPhoneNumberRecords(accessToken, phoneNumberRecords, batchDeleteLegacyPhoneNumberRecords, batchDeleteDynamicPhoneNumberRecords);
  }
}