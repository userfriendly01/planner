import { PhoneNumberRecordType } from "./Dynamic.PhoneNumber.Interfaces";
import { PhoneNumberRecordUtil } from "./PhoneNumber.Record.Util";
import { MatchFilter } from "../../action/GraphQL/Match.Records.Util";


/**
 * Filter to match phone number records by pkey
 * @param {PhoneNumberRecordType} record1
 * @param {PhoneNumberRecordType} record2
 */
export const pkeyFilter: MatchFilter<PhoneNumberRecordType> = (record1: PhoneNumberRecordType, record2: PhoneNumberRecordType): boolean =>
  PhoneNumberRecordUtil.getPkey(record1) === PhoneNumberRecordUtil.getPkey(record2);

/**
 * Filter to match phone number records by pkey and employeeId
 * @param {PhoneNumberRecordType} phoneNumberRecord1
 * @param {PhoneNumberRecordType} phoneNumberRecord2
 */
export const pkeyAndEmployeeIdFilter: MatchFilter<PhoneNumberRecordType> = (phoneNumberRecord1: PhoneNumberRecordType, phoneNumberRecord2: PhoneNumberRecordType): boolean => {
  return PhoneNumberRecordUtil.getPkey(phoneNumberRecord1) !== PhoneNumberRecordUtil.getPkey(phoneNumberRecord2)
    && phoneNumberRecord2.employeeId?.toLowerCase().startsWith("n")
    && phoneNumberRecord1.employeeId?.toLowerCase().startsWith("n")
    && phoneNumberRecord2.employeeId === phoneNumberRecord1.employeeId;
};

/**
 * Check if duplicate phone number record exist.
 * @param {Array<PhoneNumberRecordType>} searchList - List of phoneNumberRecords to search through to see if any records match the matchCandidate
 * @param {PhoneNumberRecordType} matchCandidate - phone number record candidate to match against
 * @param {MatchFilter} matchFilter - Filter to use to match records
 * @return {boolean} - True if duplicate record found, false otherwise
 */
export function hasDuplicatePhoneNumberRecord(searchList: Array<PhoneNumberRecordType>, matchCandidate: PhoneNumberRecordType, matchFilter: MatchFilter<PhoneNumberRecordType> = pkeyFilter): boolean {
  return hasDuplicatePhoneNumberRecords(searchList, [matchCandidate], matchFilter);
}

export function checkForDuplicatePhoneNumberRecord(searchList: Array<PhoneNumberRecordType>, matchCandidate: PhoneNumberRecordType, matchFilter: MatchFilter<PhoneNumberRecordType> = pkeyFilter): void {
  if (hasDuplicatePhoneNumberRecord(searchList, matchCandidate, matchFilter)) {
    throw new Error(`Duplicate phone number record found: ${generateMatchingRecordMessages(searchList, [matchCandidate], matchFilter).join("; ")}`);
  }
}

/**
 * Check if duplicate phone number records exist.
 * @param {Array<PhoneNumberRecordType>} searchList - List of phoneNumberRecords to search through to see if any records match the matchCandidate
 * @param {Array<PhoneNumberRecordType>} matchCandidateList - phone number record candidates to match against
 * @param {MatchFilter} matchFilter - Filter to use to match records
 * @return {boolean} - True if duplicate record(s) found, false otherwise
 */
export function hasDuplicatePhoneNumberRecords(searchList: Array<PhoneNumberRecordType>, matchCandidateList: Array<PhoneNumberRecordType>, matchFilter: MatchFilter<PhoneNumberRecordType> = pkeyFilter): boolean {
  const matchingRecordMessages = generateMatchingRecordMessages(searchList, matchCandidateList, matchFilter);

  return matchingRecordMessages.length > 0;
}

/**
 * Generate message for duplicate records
 * @param {Array<PhoneNumberRecordType>} searchList - List of phoneNumberRecords to search through to see if any records match the matchCandidate
 * @param {Array<PhoneNumberRecordType>} matchCandidateList - phone number record candidates to match against
 * @param {MatchFilter} matchFilter - Filter to use to match records
 * @return {Array<string>>} - Alert message for duplicate record(s), if no duplicates found will return an empty array
 */
export function generateMatchingRecordMessages(searchList: Array<PhoneNumberRecordType>, matchCandidateList: Array<PhoneNumberRecordType>, matchFilter: MatchFilter<PhoneNumberRecordType> = pkeyFilter): Array<string> {
  return findMatchingPhoneNumberRecords(searchList, matchCandidateList, matchFilter).map((matchCandidateRecord: PhoneNumberRecordType) =>
    `pkey: ${PhoneNumberRecordUtil.getPkey(matchCandidateRecord)}, employeeId: ${matchCandidateRecord.employeeId}`);
}

/**
 * Find matching phone number records
 * @param {Array<PhoneNumberRecordType>} searchList - List of phoneNumberRecords to search through to see if any records in recordsToMatch
 * @param {Array<PhoneNumberRecordType>} matchCandidateList - If passing single phoneNumberRecord, pass it as single length array i.e. "[newPhoneNumberRecord]"
 * @param {MatchFilter} matchFilter - Filter to use to match records
 *
 * @return {Array<PhoneNumberRecordType>} - List of matching phone number records
 */
export function findMatchingPhoneNumberRecords(searchList: Array<PhoneNumberRecordType>, matchCandidateList: Array<PhoneNumberRecordType>, matchFilter: MatchFilter<PhoneNumberRecordType>): Array<PhoneNumberRecordType> {
  return matchCandidateList.map((matchCandidateRecord: PhoneNumberRecordType) =>
    matchFound(searchList, matchCandidateRecord, matchFilter) ? matchCandidateRecord : undefined);
}

/**
 * Check if matching record found
 * @param {Array<PhoneNumberRecordType>} searchList - List of phoneNumberRecords to search through to see if any records match the matchCandidate
 * @param {PhoneNumberRecordType} matchCandidateRecord - phone number record candidate to match against
 * @param {MatchFilter} matchFilter - Filter to use to match records
 * @return {boolean} - True if matching record found, false otherwise
 */
function matchFound(searchList: Array<PhoneNumberRecordType>, matchCandidateRecord: PhoneNumberRecordType, matchFilter: MatchFilter<PhoneNumberRecordType>): boolean {
  return searchList.filter( searchListRecord =>  matchFilter(searchListRecord, matchCandidateRecord)? matchCandidateRecord : undefined).length > 0;
}