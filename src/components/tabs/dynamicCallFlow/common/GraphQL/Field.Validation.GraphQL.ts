const EMPLOYEE_ID_REG_EXP = /^n\d{7}$/;

export function employeeIdIsValid(value: string): boolean {
  return EMPLOYEE_ID_REG_EXP.test(value);
}

export function employeeIdIsNotValid(value: string): boolean {
  return !employeeIdIsValid(value);
}

const PHONE_NUMBER_WITH_COUNTRY_CODE_REG_EXP = /^\+1\d{10}$/;

export function phoneNumberIsValid(value: string): boolean {
  return PHONE_NUMBER_WITH_COUNTRY_CODE_REG_EXP.test(value);
}

export function phoneNumberIsNotValid(value: string): boolean {
  return !phoneNumberIsValid(value);
}

const IS_ONLY_LETTERS_NUMBERS_ACCENTS_COMMA_PERIOD_REG_EXP = /^[a-zA-Z0-9ñáéíóú ,.]+$/;
const IS_NOT_JUST_NUMBERS_REG_EXP = /^(?!\d+$).+$/;

export function greetingMessageIsValid(value: string): boolean {
  return IS_ONLY_LETTERS_NUMBERS_ACCENTS_COMMA_PERIOD_REG_EXP.test(value)
    && IS_NOT_JUST_NUMBERS_REG_EXP.test(value);
}

export function greetingMessageIsNotValid(value: string): boolean {
  return !greetingMessageIsValid(value);
}