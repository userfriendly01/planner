import {
  readUploadFile,
  identifySuccessfulRecords,
  identifyProcessingDependencies,
  handleConcurrentCalls,
  getLowestConcurrencyLimit,
  initiateCalls
} from "../processingUtils";
import * as XLSX from "xlsx";

jest.mock("xlsx",() => ({
  read: jest.fn(),
  utils: {
    sheet_to_json: jest.fn()
  }
}));

describe("readUploadFile", () => {
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
    readUploadFile(event, mockSetUploadedForm);
    expect(event.preventDefault).toBeCalledTimes(1);
    expect(readAsArrayBufferMock).toBeCalledTimes(0);
    expect(mockSetUploadedForm).toBeCalledTimes(0);
  });
  test("if e.target.files, it reads the files and sets uploaded form", () => {
    const sheetData = { boo: "hi" };
    XLSX.read.mockReturnValue({
      SheetNames: ["thing1"],
      Sheets: {
        thing1: { boo: "hi" }
      }
    });
    XLSX.utils.sheet_to_json.mockReturnValue(JSON.stringify(sheetData));
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
    readUploadFile(event, mockSetUploadedForm);

    expect(event.preventDefault).toBeCalledTimes(1);
    expect(readAsArrayBufferMock).toBeCalledTimes(1);
    expect(readAsArrayBufferMock).toBeCalledWith(mockFile);
    expect(mockSetUploadedForm).toBeCalledTimes(1);
    expect(mockSetUploadedForm).toHaveBeenCalledWith(JSON.stringify(sheetData));
  });
});

describe("identifySuccessfulRecords", () => {
  test("No errors in form, returns all rows", () => {
    const form = [
      { stuff: "things" }
    ];
    const result = identifySuccessfulRecords(form, []);
    expect(result).toEqual(form);
  });
  test("Errors in form, returns only rows with no errors", () => {
    const form = [
      { stuff: "things" },
      { morestuff: "more things" },
      { nNumber: "yo" }
    ];
    const validationErrors = [{ row: 1 }, { row: 3 }];
    const result = identifySuccessfulRecords(form, validationErrors);
    expect(result).toEqual([{ morestuff: "more things" }]);
  });
  test("No values in form, returns back empty form rows", () => {
    const form = [];
    const result = identifySuccessfulRecords(form, []);
    expect(result).toEqual(form);
  });
});

describe("identifyProcessingDependencies", () => {
  const template1 = {
    name: "CREATE_TRITON_USER",
    multiRunDependencies: null
  };
  const template2 = {
    name: "CREATE_CALABRIO_QM_USER",
    multiRunDependencies: [
      {
        name: "CREATE_TRITON_USER"
      }
    ]
  };
  const template3 = {
    name: "SOME_OTHER_THING",
    multiRunDependencies: [
      {
        name: "CREATE_CALABRIO_QM_USER"
      }
    ]
  };
  const orderDoesNotMatterTemplate = {
    name: "HI",
    multiRunDependencies: null
  };

  test("0 selected templates, returns false", () => {
    const processingDependencyResults = identifyProcessingDependencies([]);
    expect(processingDependencyResults).toEqual(false);
  });
  test("Only 1 selected templates, returns false", () => {
    const processingDependencyResults = identifyProcessingDependencies([{ template: "yea" }]);
    expect(processingDependencyResults).toEqual(false);
  });
  test("Two selected templates, returns appropriate dependency order", () => {
    const processingDependencyResults = identifyProcessingDependencies([template2, template1]);
    expect(processingDependencyResults).toEqual([template1, template2]);
  });
  test("multiple selected templates, returns appropriate dependency order", () => {
    const processingDependencyResults = identifyProcessingDependencies([template2, template3, template1]);
    expect(processingDependencyResults).toEqual([template1, template2, template3]);
  });
  test("multiple selected templates, returns appropriate dependency order, where order doesn't matter it stays put", () => {
    const processingDependencyResults = identifyProcessingDependencies([template2, orderDoesNotMatterTemplate, template3, template1]);
    expect(processingDependencyResults).toEqual([template1, orderDoesNotMatterTemplate, template2, template3]);
  });
  test("one of the mulitRunDependencies not in selected templates list, returns in same order", () => {
    const processingDependencyResults = identifyProcessingDependencies([template2, orderDoesNotMatterTemplate]);
    expect(processingDependencyResults).toEqual([template2, orderDoesNotMatterTemplate]);
  });
});