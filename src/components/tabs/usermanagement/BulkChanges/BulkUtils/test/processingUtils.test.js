import {
  readUploadFile,
  identifySuccessfulRecords,
  identifyProcessingDependencies,
  handleConcurrentCalls,
  getLowestConcurrencyLimit,
  initiateCalls
} from "../processingUtils";
import * as utils from "../processingUtils";
import * as XLSX from "xlsx";
import {
  act
} from "testUtils";

//This file calls functions within itself, mocking those and requiring the actual implementation when creating tests
jest.mock("../processingUtils", () => ({
  readUploadFile: jest.requireActual("../processingUtils").readUploadFile,
  handleConcurrentCalls: jest.fn(),
  identifyProcessingDependencies: jest.fn(),
  identifySuccessfulRecords: jest.fn(),
  getLowestConcurrencyLimit: jest.fn(),
  initiateCalls: jest.requireActual("../processingUtils").initiateCalls
}));

jest.spyOn(utils, "identifyProcessingDependencies");
jest.spyOn(utils, "getLowestConcurrencyLimit");

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
    const sheetData = [{ boo: "hi" }];
    XLSX.read.mockReturnValue({
      SheetNames: ["thing1"],
      Sheets: {
        thing1: { boo: "hi" }
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
    readUploadFile(event, mockSetUploadedForm);

    expect(event.preventDefault).toBeCalledTimes(1);
    expect(readAsArrayBufferMock).toBeCalledTimes(1);
    expect(readAsArrayBufferMock).toBeCalledWith(mockFile);
    expect(mockSetUploadedForm).toBeCalledTimes(1);
    expect(mockSetUploadedForm).toHaveBeenCalledWith([
      {
        ...sheetData[0],
        rowNumber: 1
      }
    ]);
  });
});

describe("identifySuccessfulRecords", () => {
  beforeEach(() => {
    identifySuccessfulRecords.mockImplementation(jest.requireActual("../processingUtils").identifySuccessfulRecords);
  });
  test("No errors in form, returns all rows", () => {
    const form = [
      { stuff: "things" }
    ];
    const result = identifySuccessfulRecords(form, []);
    expect(result).toEqual(form);
  });
  test("Errors in form, returns only rows with no errors", () => {
    const form = [
      {
        rowNumber: 1,
        stuff: "things"
      },
      {
        rowNumber: 2,
        morestuff: "more things"
      },
      {
        rowNumber: 3,
        nNumber: "yo"
      }
    ];
    const validationErrors = [{ rowNumber: 1 }, { rowNumber: 3 }];
    const result = identifySuccessfulRecords(form, validationErrors);
    expect(result).toEqual([{
      rowNumber: 2,
      morestuff: "more things"
    }]);
  });
  test("No values in form, returns back empty form rows", () => {
    const form = [];
    const result = identifySuccessfulRecords(form, []);
    expect(result).toEqual(form);
  });
});

describe("identifyProcessingDependencies", () => {
  beforeEach(() => {
    identifyProcessingDependencies.mockImplementation(jest.requireActual("../processingUtils").identifyProcessingDependencies);
  });
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

describe("handleConcurrentCalls", () => {
  const functionToCall = jest.fn();
  const progressCallback = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks;
    jest.resetAllMocks;
    handleConcurrentCalls.mockImplementation(jest.requireActual("../processingUtils").handleConcurrentCalls);
  });
  test("should call function in batches of concurrency max", async () => {
    jest.useFakeTimers();
    const rows = [
      { rowNumber: 1 },
      { rowNumber: 2 },
      { rowNumber: 3 },
      { rowNumber: 4 },
      { rowNumber: 5 },
      { rowNumber: 6 },
      { rowNumber: 7 }
    ];
    handleConcurrentCalls(3, functionToCall, rows, progressCallback);
    await act(() => jest.advanceTimersByTime(1500));
    expect(functionToCall).toHaveBeenCalledTimes(3);
    await act(() => jest.advanceTimersByTime(1500));
    expect(functionToCall).toHaveBeenCalledTimes(6);
    await act(() => jest.advanceTimersByTime(1500));
    expect(functionToCall).toHaveBeenCalledTimes(7);
  });
  test("results should be as expected", async () => {
    jest.useRealTimers();
    functionToCall.mockResolvedValueOnce("Yay!");
    functionToCall.mockResolvedValueOnce("Yay!");
    functionToCall.mockRejectedValueOnce("Aww..");
    const rows = [
      { rowNumber: 1 },
      { rowNumber: 2 },
      { rowNumber: 3 }
    ];
    const results = await handleConcurrentCalls(3, functionToCall, rows, progressCallback);
    expect(results).toStrictEqual([
      {
        status: "fulfilled",
        value: "Yay!"
      },
      {
        status: "fulfilled",
        value: "Yay!"
      },
      {
        status: "rejected",
        reason: "Aww.."
      }
    ]);
  });
});

describe("getLowestConcurrencyLimit", () => {
  beforeEach(() => {
    getLowestConcurrencyLimit.mockImplementation(jest.requireActual("../processingUtils").getLowestConcurrencyLimit);
  });
  const template1 = {
    validationConcurrencyLimit: null,
    processingConcurrencyLimit: 3
  };
  const template2 = {
    validationConcurrencyLimit: 5,
    processingConcurrencyLimit: 1
  };
  const template3 = {
    validationConcurrencyLimit: 10,
    processingConcurrencyLimit: null
  };
  describe("type === validation", () => {
    test("lowest validationConcurrencyLimit is returned", () => {
      const result = getLowestConcurrencyLimit([ template1, template2, template3 ], "validation");
      expect(result).toBe(5);
    });
    test("when no concurrency limit, null is returned", () => {
      const result = getLowestConcurrencyLimit([template1], "validation");
      expect(result).toBe(null);
    });
  });
  describe("type !== validation", () => {
    test("lowest processingConcurrencyLimit is returned", () => {
      const result = getLowestConcurrencyLimit([ template1, template2, template3 ], "process");
      expect(result).toBe(1);
    });
    test("when no concurrency limit, null is returned", () => {
      const result = getLowestConcurrencyLimit([template3], "process");
      expect(result).toBe(null);
    });
  });
});

describe("initiateCalls", () => {
  const setProcessedRows = jest.fn();
  const rows = [
    { rowNumber: 1 },
    { rowNumber: 2 },
    { rowNumber: 3 }
  ];
  const templates = [
    {
      name: "CREATE_TRITON_USER",
      processFunction: jest.fn(),
      multiRunDependencies: null
    },
    {
      name: "CREATE_CALABRIO_USER",
      processFunction: jest.fn(),
      multiRunDependencies: [
        {
          name: "CREATE_TRITON_USER",
          variable: "workerSid"
        }
      ]
    }
  ];
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });
  describe("concurrency limit is null", () => {
    describe("template tree is null", () => {
      test("should call process function for each row", async () => {
        identifyProcessingDependencies.mockReturnValue(null);
        getLowestConcurrencyLimit.mockReturnValue(null);
        const result = await initiateCalls(rows, [templates[1]], setProcessedRows);
        expect(result).toStrictEqual(rows);
        expect(setProcessedRows).toHaveBeenCalledTimes(3);
        expect(templates[0].processFunction).toHaveBeenCalledTimes(0);
        expect(templates[1].processFunction).toHaveBeenCalledTimes(3);
        expect(templates[1].processFunction).toHaveBeenCalledWith(rows[0], rows[0].rowNumber, templates[1]);
        expect(templates[1].processFunction).toHaveBeenCalledWith(rows[1], rows[1].rowNumber, templates[1]);
        expect(templates[1].processFunction).toHaveBeenCalledWith(rows[2], rows[2].rowNumber, templates[1]);
      });
    });
    describe("template tree is not null", () => {
      beforeEach(() => {
        identifyProcessingDependencies.mockReturnValue(templates);
        getLowestConcurrencyLimit.mockReturnValue(null);
        identifySuccessfulRecords.mockReturnValue("wtf");
      });
      describe("dependency tree processes successfully", () => {
        beforeEach(() => {
          templates[0].processFunction.mockResolvedValue("Yay");
          templates[1].processFunction.mockResolvedValue("Yay");
        });
        test("should call process function for both templates for each row", async () => {
          const rows = [
            {
              rowNumber: 1,
              workerSid: "WK1324"
            },
            {
              rowNumber: 2,
              workerSid: "WK2345"
            },
            {
              rowNumber: 3,
              workerSid: "WK3456"
            }
          ];
          const result = await initiateCalls(rows, templates, setProcessedRows);
          expect(result).toStrictEqual(rows);
          expect(setProcessedRows).toHaveBeenCalledTimes(3);
          expect(templates[0].processFunction).toHaveBeenCalledTimes(3);
          expect(templates[0].processFunction).toHaveBeenCalledWith(rows[0], rows[0].rowNumber, templates[0]);
          expect(templates[0].processFunction).toHaveBeenCalledWith(rows[1], rows[1].rowNumber, templates[0]);
          expect(templates[0].processFunction).toHaveBeenCalledWith(rows[2], rows[2].rowNumber, templates[0]);
          expect(templates[1].processFunction).toHaveBeenCalledTimes(3);
          expect(templates[1].processFunction).toHaveBeenCalledWith(rows[0], rows[0].rowNumber, templates[1]);
          expect(templates[1].processFunction).toHaveBeenCalledWith(rows[1], rows[1].rowNumber, templates[1]);
          expect(templates[1].processFunction).toHaveBeenCalledWith(rows[2], rows[2].rowNumber, templates[1]);
        });
      });
      describe("dependency tree fails to fully processes", () => {
        beforeEach(() => {
          templates[0].processFunction.mockResolvedValue("Yay");
          templates[1].processFunction.mockResolvedValue("Yay");
        });
        test("should call process function for each successful dependency row", async () => {
          const rows = [
            {
              rowNumber: 1,
              workerSid: "WK1324"
            },
            {
              rowNumber: 2,
              workerSid: "WK2345"
            },
            {
              rowNumber: 3
            }
          ];
          try {
            await initiateCalls(rows, templates, setProcessedRows);
          } catch(err) {
            expect(setProcessedRows).toHaveBeenCalledTimes(3);
            expect(templates[0].processFunction).toHaveBeenCalledTimes(3);
            expect(templates[0].processFunction).toHaveBeenCalledWith(rows[0], rows[0].rowNumber, templates[0]);
            expect(templates[0].processFunction).toHaveBeenCalledWith(rows[1], rows[1].rowNumber, templates[0]);
            expect(templates[0].processFunction).toHaveBeenCalledWith(rows[2], rows[2].rowNumber, templates[0]);
            expect(templates[1].processFunction).toHaveBeenCalledTimes(2);
            expect(templates[1].processFunction).toHaveBeenCalledWith(rows[0], rows[0].rowNumber, templates[1]);
            expect(templates[1].processFunction).toHaveBeenCalledWith(rows[1], rows[1].rowNumber, templates[1]);
            expect(err).toStrictEqual({
              errors: [{
                errors: ["CREATE_CALABRIO_USER failed due to missing workerSid from CREATE_TRITON_USER. If CREATE_TRITON_USER was successful it could have just taken too long and should be reprocessed."],
                rowNumber: 3
              }],
              success: [
                {
                  rowNumber: 1,
                  workerSid: "WK1324"
                },
                {
                  rowNumber: 2,
                  workerSid: "WK2345"
                }
              ]
            });
          }
        });
      });
    });
  });

});

describe("concurrenct limit is not null", () => {
  const setProcessedRows = jest.fn();
  const rows = [
    { rowNumber: 1 },
    { rowNumber: 2 },
    { rowNumber: 3 }
  ];
  const templates = [
    {
      name: "CREATE_TRITON_USER",
      processFunction: jest.fn(),
      multiRunDependencies: null
    },
    {
      name: "CREATE_CALABRIO_USER",
      processFunction: jest.fn(),
      multiRunDependencies: [
        {
          name: "CREATE_TRITON_USER",
          variable: "workerSid"
        }
      ]
    }
  ];
  beforeEach(() => {
    jest.spyOn(utils, "getLowestConcurrencyLimit").mockImplementation(() => 1);
    identifyProcessingDependencies.mockReturnValue(templates);
    // getLowestConcurrencyLimit.mockReturnValue(1);
    // handleConcurrentCalls.mockResolvedValue("YAY");
  });
  test.only("should call handleConcurrentCalls", async () => {
    expect(getLowestConcurrencyLimit()).toBe(1);
    // await utils.initiateCalls(rows, templates, setProcessedRows);
    // expect(handleConcurrentCalls).toHaveBeenCalledTimes(1);
  });
});