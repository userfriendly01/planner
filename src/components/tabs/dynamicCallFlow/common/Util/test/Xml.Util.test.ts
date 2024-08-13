import {
  containsXml, isNotValidXml, isValidXml
} from "dynamicCallFlowCommon/Util/Xml.Util";

describe("containsXml", () => {
  it("shouldReturnTrueForValidXmlString", () => {
    const value = "<tag>content</tag>";
    expect(containsXml(value)).toBe(true);
  });

  it("shouldReturnFalseForNonXmlString", () => {
    const value = "just a string";
    expect(containsXml(value)).toBe(false);
  });

  it("shouldReturnFalseForEmptyString", () => {
    const value = "";
    expect(containsXml(value)).toBe(false);
  });

  it("shouldReturnFalseForNonStringInput", () => {
    const value = 123;
    expect(containsXml(value as any)).toBe(false);
  });
});

describe("isValidXml", () => {
  it("shouldReturnTrueForValidXmlString", () => {
    const value = "<tag>content</tag>";
    expect(isValidXml(value)).toBe(true);
  });

  it("shouldReturnFalseForInvalidXmlString", () => {
    const value = "<tag>content";
    expect(isValidXml(value)).toBe(false);
  });

  it("shouldReturnFalseForNonXmlString", () => {
    const value = "just a string";
    expect(isValidXml(value)).toBe(false);
  });

  it("shouldReturnFalseForEmptyString", () => {
    const value = "";
    expect(isValidXml(value)).toBe(false);
  });

  it("shouldReturnFalseForNonStringInput", () => {
    const value = 123;
    expect(isValidXml(value as any)).toBe(false);
  });
});

describe("isNotValidXml", () => {
  it("shouldReturnFalseForValidXmlString", () => {
    const value = "<tag>content</tag>";
    expect(isNotValidXml(value)).toBe(false);
  });

  it("shouldReturnTrueForInvalidXmlString", () => {
    const value = "<tag>content";
    expect(isNotValidXml(value)).toBe(true);
  });

  it("shouldReturnTrueForNonXmlString", () => {
    const value = "just a string";
    expect(isNotValidXml(value)).toBe(true);
  });

  it("shouldReturnTrueForEmptyString", () => {
    const value = "";
    expect(isNotValidXml(value)).toBe(true);
  });

  it("shouldReturnTrueForNonStringInput", () => {
    const value = 123;
    expect(isNotValidXml(value as any)).toBe(true);
  });
});