import * as xlsx from "xlsx";
import { ActionXlsxReader } from "../Action.Xlsx.Reader";
import { BrandTypeEnum } from "../../../phoneNumber/GraphQL/Dynamic.PhoneNumber.Interfaces";

describe("Action XLSX Reader", () => {
  test("happy path", () => {
    const workBook = xlsx.readFile("./src/components/tabs/dynamicCallFlow/action/Xlsx/test/AISGMain.xlsx");
    expect(workBook).toBeDefined();

    const actionXlsReader = new ActionXlsxReader();

    const xlsReaderResults = actionXlsReader.processWorkBook(workBook);

    expect(xlsReaderResults).toBeDefined();
    expect(xlsReaderResults.errors.length).toBe(0);
  });

  test("invalid REDIRECT url", () => {
    const workBook = xlsx.readFile("./src/components/tabs/dynamicCallFlow/action/Xlsx/test/AISGMain-redirect-url-invalid.xlsx");
    expect(workBook).toBeDefined();

    const actionXlsReader = new ActionXlsxReader();

    const xlsReaderResults = actionXlsReader.processWorkBook(workBook);

    expect(xlsReaderResults).toBeDefined();
    expect(xlsReaderResults.errors.length).toBe(2);
  });
});