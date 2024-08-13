export function employeeIdIsValid(value: string): boolean {
  return value?.startsWith("n") && value?.length === 8;
}

export function employeeIdIsNotValid(value: string): boolean {
  return !employeeIdIsValid(value);
}

// Field with a phone number value.
const PHONE_NUMBER_WITH_COUNTRY_CODE_REG_EXP = /^\+\d{11}$/;
const PHONE_NUMBER_WITH_COUNTRY_CODE_MISSING_LEADING_PLUS_REG_EXP = /^\+\d{10}$/;

export function phoneNumberIsValid(value: string): boolean {
  return PHONE_NUMBER_WITH_COUNTRY_CODE_REG_EXP.test(value);
}

export function phoneNumberIsValidButMissingLeadingPlus(value: string): boolean {
  return PHONE_NUMBER_WITH_COUNTRY_CODE_MISSING_LEADING_PLUS_REG_EXP.test(value);
}

export function phoneNumberIsNotValid(value: string): boolean {
  return !phoneNumberIsValid(value);
}