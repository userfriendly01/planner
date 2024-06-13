import * as xlsx from "xlsx";

describe("Abstract XLSX Reader", () => {
  test("test upload", () => {
    const file = xlsx.readFile("./src/components/tabs/dynamicCallFlow/common/XlsxReader/test/test-upload.xlsx");
    expect(file).toBeDefined();
  });
});