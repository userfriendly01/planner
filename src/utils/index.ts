export const wait = (callback: () => void, waitTimeMs: number) => setTimeout(callback, waitTimeMs);

export const escapeQuotes = (payload: string): string => {
  const replaceAll = (string: string, search: string, replace: string) => {
    return string.split(search).join(replace);
  };
  let finalPayload = payload;
  finalPayload = replaceAll(finalPayload, "'", "\\'");
  finalPayload = replaceAll(finalPayload, "\"", "\\\"");
  return finalPayload;
};

export const isErrorIn400s = (statusCode?: string) => {
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