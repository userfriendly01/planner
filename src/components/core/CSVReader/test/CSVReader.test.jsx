import * as XLSX from "xlsx";
import { CsvReader } from "../CsvReader";

jest.mock("xlsx",() => ({
  read: jest.fn(),
  utils: {
    sheet_to_json: jest.fn()
  }
}));

describe("CSV reader component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });
  const mockSetUploadedForm = jest.fn();
  const readAsArrayBufferMock = jest.fn();
  test("if no e.target.files, does nothing", () => {
    const event = {
      target: {
        nope: "no"
      },
      preventDefault: jest.fn()
    };
    jest.spyOn(window, "FileReader").mockImplementation(function () {
      const self = this;
      this.readAsArrayBuffer = readAsArrayBufferMock.mockImplementation(() => {
        self.onload(event);
      });
    });
    CsvReader(event, mockSetUploadedForm);
    expect(event.preventDefault).toBeCalledTimes(1);
    expect(readAsArrayBufferMock).toBeCalledTimes(0);
    expect(mockSetUploadedForm).toBeCalledTimes(0);
  });
  test("if e.target.files, it reads the ROUTING file and sets uploaded form", () => {
    const sheetData = [{
      boo: "hi",
      "__rowNum__": 1,
      occupancyCheck: "",
      routingSteps: ""
    }];
    XLSX.read.mockReturnValue({
      SheetNames: ["thing1"],
      Sheets: {
        thing1: {
          boo: "hi",
          occupancyCheck: [],
          routingSteps: []
        }
      }
    });
    XLSX.utils.sheet_to_json.mockReturnValue(sheetData);
    const mockFile = new File(["yo"], "yo.xlsx");

    const event = {
      target: {
        files: [mockFile],
        result: {
          SheetNames: ["stuff"],
          Sheets: {
            stuff: sheetData
          }
        }
      },
      preventDefault: jest.fn()
    };
    jest.spyOn(window, "FileReader").mockImplementation(function () {
      const self = this;
      this.readAsArrayBuffer = readAsArrayBufferMock.mockImplementation(() => {
        self.onload(event);
      });
    });
    CsvReader(event, mockSetUploadedForm, "ROUTING");
    expect(event.preventDefault).toBeCalledTimes(1);
    expect(readAsArrayBufferMock).toBeCalledTimes(1);
    expect(readAsArrayBufferMock).toBeCalledWith(mockFile);
    expect(mockSetUploadedForm).toBeCalledTimes(1);

  });
});