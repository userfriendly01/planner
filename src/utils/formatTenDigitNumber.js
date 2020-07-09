export const formatTenDigitNumber = rawNumber => {
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
