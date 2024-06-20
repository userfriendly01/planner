import * as xlsx from "xlsx";
import { DYNAMIC_CALL_FLOW_COMMON_XLSX_TEST_PATH } from "components/tabs/dynamicCallFlow/common/Xlsx/test/Xlsx.Testing.Util";

describe("Abstract XLSX Importer", () => {
  test("test upload", () => {
    const file = xlsx.readFile(DYNAMIC_CALL_FLOW_COMMON_XLSX_TEST_PATH.concat("test-upload.xlsx"));
    expect(file).toBeDefined();
  });
});