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
