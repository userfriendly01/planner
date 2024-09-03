export function containsXml(value: string): boolean {
  if (!value || typeof value !== "string") {
    return false;
  }

  const xmlPattern = /<[^>]+>/;
  return xmlPattern.test(value);
}

export function isValidXml(value: string): boolean {
  if (typeof value !== "string" || !value.trim().startsWith("<")) {
    return false;
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(value, "application/xml");
  return !doc.querySelector("parsererror");
}

export function isNotValidXml(value: string): boolean {
  return !isValidXml(value);
}