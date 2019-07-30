export const isErrorIn400s = statusCode => {
  if (statusCode) {
    const str = statusCode.toString();
    const firstDigit = str.slice(0, 1);
    if (typeof statusCode === "number" && str.length === 3 && firstDigit === "4") {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
};
