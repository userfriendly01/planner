import {
  PhoneNumberFormat,
  PhoneNumberUtil,
  PhoneNumberType
} from "google-libphonenumber";

const phoneNumberUtil = PhoneNumberUtil.getInstance();
const PHONE_NUMBER_COUNTRY_CODE = "US";

// eslint-disable-next-line max-len
const getPhoneNumber = (number: string) => phoneNumberUtil.parseAndKeepRawInput(number, PHONE_NUMBER_COUNTRY_CODE);

/**
 * Converts a string representing a phone number to E164 format. Throws error if unable convert.
 * @param number Number to convert
 */
export const getE164Number = (number: string) => {
  const phoneNumber = getPhoneNumber(number);
  if (!phoneNumberUtil.isValidNumber(phoneNumber)) {
    throw new Error("number failed validation by phoneNumberUtil.isValidNumber()");
  }
  return phoneNumberUtil.format(phoneNumber, PhoneNumberFormat.E164);
};

/**
 * Converts a string representing a phone number 11 digits (E164 stripped of the +
 * at the beginning like: 16038887777).Throws error if unable convert number to E164 format.
 * @param number Number to convert
 */
export const getElevenDigitNumber = (number: string) => getE164Number(number).replace(/^\+/, ""); // remove '+' from start of string

/**
 * Returns `true` or `false` whether the number is ten digits
 * @param number Number to check
 */
export const isNumberTenDigits = (number: string) => /^\d{10}$/.test(number);

/**
 * Returns `true` or `false` whether the number is Toll Free Number.
 * If number is not a valid phone number, error is caught and returns `false`.
 * @param number Number to check
 */
export const isNumberTfn = (number: string) => {
  try {
    const phoneNumber = getPhoneNumber(number);
    if (phoneNumberUtil.isValidNumber(phoneNumber)) {
      const numberType = phoneNumberUtil.getNumberType(phoneNumber);
      return numberType === PhoneNumberType.TOLL_FREE;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
};

/**
 * Checks if a number is a seven digit VDN
 * @param number Number to check
 */
export const isNumberVdn = (number: string) => /^\d{7}$/.test(number);

/**
 * Checks if number is a valid phone number. Many formats of phone numbers are accepted as input.
 * Uses the raw underlying `isValidNumber` method from `lib-googlephonenumber`
 * and catches any errors thrown in the conversion process.
 * If it fails to convert number to a phone number will simply return `false`
 * @param {*} number Number to check
 */
export const isValidPhoneNumber = (number: string) => {
  try {
    const phoneNumber = getPhoneNumber(number);
    return phoneNumberUtil.isValidNumber(phoneNumber);
  } catch (error) {
    return false;
  }
};

/**
 * Checks if a number is a valid ten digit phone number.
 * Intended to be used to validate form entries where ten digit numbers
 * are to be entered in order to ensure the number entered is valid
 * @param number Number to check
 * @param allowSevenDigitVdn When `true` will check consider seven digit numbers as
 * valid in addition to ten digit numbers
 */
// when true user is able to perform transfers using this number
export const isNumberValid = (number: string, allowSevenDigitVdn: boolean) => {
  console.log("wtf validator", number, typeof number);
  if (allowSevenDigitVdn && isNumberVdn(number)) {
    return true;
  } else if (isNumberTenDigits(number) && isValidPhoneNumber(number)) {
    return true;
  } else {
    return false;
  }
};

/**
 * Unmasks a phone number to remove any non-digit characters and the leading `+1`
 * if number is in E164 format.
 * Intended to unmask ten digit phone numbers or seven digit VDNs entered into input boxes by users.
 * @param number Number to unmask
 */
export const unMaskPhoneNumber = (number: string) => number.replace(/\+1|\D/g, ""); // remove '+1' or any non-digit

export const formatTenDigitNumber = (rawNumber: string | number): string => {
  const num = rawNumber.toString();
  if (num.length === 10) {
    const areaCode = num.substring(0, 3);
    const middle = num.substring(3, 6);
    const end = num.substring(6);
    return `(${areaCode}) ${middle}-${end}`;
  } else {
    return num;
  }
};

export const removeNonNumericCharacters = (str: string): string => str.replace(/\D/g, "");

export const formatE164PhoneNumber = (number: string): string => {
  return number.replace(/^\+1/, "").replace(/^1/, "");
};
