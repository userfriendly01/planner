import * as utils from "../processingUtils";
import {
  getCalabrioUsers,
  getWfmOrg,
  getManagers,
  wfmActivateExternalLogon
} from "services";
import {
  act,
  waitFor,
  initialTestState
} from "testUtils";
import {
  formatManagersResponse,
  formatWorkerResponse,
  myAxios,
  getCalabrioWfmOrg
} from "utils";
import * as XLSX from "xlsx";


jest.mock("utils",() => ({
  formatManagersResponse: jest.fn(),
  formatWorkerResponse: jest.fn(),
  myAxios: {
    get: jest.fn()
  },
  getCalabrioWfmOrg: jest.fn()
}));

jest.mock("xlsx",() => ({
  read: jest.fn(),
  utils: {
    sheet_to_json: jest.fn()
  }
}));

describe("updateManagerUserState", () => {
  const mockDispatch = jest.fn();
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });
  describe("get managers succeeds", () => {
    const response = [{
      manager: "Bill"
    }];
    test("dispatch is called, promise resolves", async () => {
      getManagers.mockResolvedValue(response);
      formatManagersResponse.mockReturnValue(response);
      await utils.updateManagerUserState(mockDispatch);
      expect(getManagers).toHaveBeenCalledTimes(1);
      expect(mockDispatch).toHaveBeenCalledTimes(1);
      expect(mockDispatch).toHaveBeenCalledWith({
        type: "loadManagers",
        payload: response
      });
    });
  });
  describe("get managers fails", () => {
    test("dispatch is not called, promise resolves", async () => {
      getManagers.mockRejectedValue("Aww");
      await utils.updateManagerUserState(mockDispatch);
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error.mock.calls[0][0]).toContain("Failed to update manager state after bulk upload");
    });
  });
});

describe("updateTritonUserState", () => {
  const mockDispatch = jest.fn();
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });
  describe("get workers succeeds", () => {
    const response = {
      data: [{
        attributes: {
          yas: "girl"
        }
      }]
    };
    test("dispatch is called, promise resolves", async () => {
      myAxios.get.mockResolvedValue(response);
      formatWorkerResponse.mockReturnValue(response.data);
      await utils.updateTritonUserState(null, mockDispatch);
      expect(myAxios.get).toHaveBeenCalledTimes(1);
      expect(mockDispatch).toHaveBeenCalledTimes(1);
      expect(mockDispatch).toHaveBeenCalledWith({
        type: "loadWorkers",
        payload: response.data
      });
    });
  });
  describe("get workers fails", () => {
    myAxios.get.mockRejectedValue("Aww");
    test("dispatch is not called, promise resolves", async () => {
      await utils.updateTritonUserState(null, mockDispatch);
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error.mock.calls[0][0]).toContain("Failed to update triton user state after bulk upload");
    });
  });
});

describe("updateCalabrioUserState", () => {
  const mockDispatch = jest.fn();
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });
  describe("get users succeeds", () => {
    test("dispatch is called, promise resolves", async () => {
      const response = {
        data: [{
          attributes: {
            yas: "girl"
          }
        }]
      };
      getCalabrioUsers.mockResolvedValue(response);
      await utils.updateCalabrioUserState(null, mockDispatch);
      expect(mockDispatch).toHaveBeenCalledTimes(1);
      expect(mockDispatch).toHaveBeenCalledWith({
        type: "loadCalabrioUsers",
        payload: response.data
      });
    });
  });
  describe("get users fails", () => {
    test("dispatch is not called, promise resolves", async () => {
      getCalabrioUsers.mockRejectedValue("Aww");
      await utils.updateCalabrioUserState(null, mockDispatch);
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error.mock.calls[0][0]).toContain("Failed to update calabrio user state after bulk upload");
    });
  });
});

describe("updateWFMPersonState", () => {
  const mockDispatch = jest.fn();
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });
  test("getCalabrioWfmOrg is called, promise resolves", async () => {
    getCalabrioWfmOrg.mockResolvedValue(true);
    await utils.updateWFMPersonState(initialTestState, mockDispatch, [{ BusinessUnitId: "123-321" }]);
  });
});

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
    utils.readUploadFile(event, mockSetUploadedForm);
    expect(event.preventDefault).toBeCalledTimes(1);
    expect(readAsArrayBufferMock).toBeCalledTimes(0);
    expect(mockSetUploadedForm).toBeCalledTimes(0);
  });
  test("json is not an object - form is not set", () => {
    const sheetData = "boo";
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
    utils.readUploadFile(event, mockSetUploadedForm);

    expect(event.preventDefault).toBeCalledTimes(1);
    expect(readAsArrayBufferMock).toBeCalledTimes(1);
    expect(readAsArrayBufferMock).toBeCalledWith(mockFile);
    expect(mockSetUploadedForm).toBeCalledTimes(0);
  });
  test("if e.target.files, it reads the files and sets uploaded form", () => {
    const sheetData = [{
      boo: "hi",
      "__rowNum__": 1
    }];
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
    utils.readUploadFile(event, mockSetUploadedForm);

    expect(event.preventDefault).toBeCalledTimes(1);
    expect(readAsArrayBufferMock).toBeCalledTimes(1);
    expect(readAsArrayBufferMock).toBeCalledWith(mockFile);
    expect(mockSetUploadedForm).toBeCalledTimes(1);
    expect(mockSetUploadedForm).toHaveBeenCalledWith([
      {
        ...sheetData[0],
        rowNumber: 2
      }
    ]);
  });
});

describe("identifySuccessfulRecords", () => {
  test("No errors in form, returns all rows", () => {
    const form = [
      { stuff: "things" }
    ];
    const result = utils.identifySuccessfulRecords(form, []);
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
    const result = utils.identifySuccessfulRecords(form, validationErrors);
    expect(result).toEqual([{
      rowNumber: 2,
      morestuff: "more things"
    }]);
  });
  test("No values in form, returns back empty form rows", () => {
    const form = [];
    const result = utils.identifySuccessfulRecords(form, []);
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
    const processingDependencyResults = utils.identifyProcessingDependencies([]);
    expect(processingDependencyResults).toEqual(false);
  });
  test("Only 1 selected templates, returns false", () => {
    const processingDependencyResults = utils.identifyProcessingDependencies([{ template: "yea" }]);
    expect(processingDependencyResults).toEqual(false);
  });
  test("Two selected templates, returns appropriate dependency order", () => {
    const processingDependencyResults = utils.identifyProcessingDependencies([template2, template1]);
    expect(processingDependencyResults).toEqual([template1, template2]);
  });
  test("Two selected templates, already in order, returns appropriate dependency order", () => {
    const processingDependencyResults = utils.identifyProcessingDependencies([template1, template2]);
    expect(processingDependencyResults).toEqual([template1, template2]);
  });
  test("multiple selected templates, returns appropriate dependency order", () => {
    const processingDependencyResults = utils.identifyProcessingDependencies([template2, template3, template1]);
    expect(processingDependencyResults).toEqual([template1, template2, template3]);
  });
  test("multiple selected templates, returns appropriate dependency order, where no multidependencies are first", () => {
    const processingDependencyResults = utils.identifyProcessingDependencies([template2, orderDoesNotMatterTemplate, template3, template1]);
    expect(processingDependencyResults).toEqual([orderDoesNotMatterTemplate, template1, template2, template3]);
  });
  test("one of the mulitRunDependencies not in selected templates list, returns templates without dependencies first", () => {
    const processingDependencyResults = utils.identifyProcessingDependencies([template2, orderDoesNotMatterTemplate]);
    expect(processingDependencyResults).toEqual([orderDoesNotMatterTemplate, template2]);
  });
  test("So many templates, including one with multiple dependencies, returns in correct dependency order", () => {
    const soManyDependencies = {
      name: "CREATE_CALABRIO_WFM_PERSON",
      multiRunDependencies: [{
        name: "CREATE_TRITON_USER"
      }, {
        name: "CREATE_CALABRIO_QM_USER"
      }]
    };
    const processingDependencyResults = utils.identifyProcessingDependencies([soManyDependencies, template2, orderDoesNotMatterTemplate, template1, template3]);
    expect(processingDependencyResults).toEqual([orderDoesNotMatterTemplate, template1, template2, template3, soManyDependencies]);
  });
});

describe("handleConcurrentCalls", () => {
  const functionToCall = jest.fn();
  const progressCallback = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks;
    jest.resetAllMocks;
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
    utils.handleConcurrentCalls(3, functionToCall, rows, progressCallback);
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
    const results = await utils.handleConcurrentCalls(3, functionToCall, rows, progressCallback);
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
      const result = utils.getLowestConcurrencyLimit([ template1, template2, template3 ], "validation");
      expect(result).toBe(5);
    });
    test("when no concurrency limit, null is returned", () => {
      const result = utils.getLowestConcurrencyLimit([template1], "validation");
      expect(result).toBe(null);
    });
  });
  describe("type !== validation", () => {
    test("lowest processingConcurrencyLimit is returned", () => {
      const result = utils.getLowestConcurrencyLimit([ template1, template2, template3 ], "process");
      expect(result).toBe(1);
    });
    test("when no concurrency limit, null is returned", () => {
      const result = utils.getLowestConcurrencyLimit([template3], "process");
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
      stateUpdateFunctions: [jest.fn()],
      multiRunDependencies: null
    },
    {
      name: "CREATE_CALABRIO_USER",
      stateUpdateFunctions: [jest.fn()],
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
        jest.spyOn(utils, "identifyProcessingDependencies").mockReturnValue(null);
        jest.spyOn(utils, "getLowestConcurrencyLimit").mockReturnValue(null);
        const result = await utils.initiateCalls(rows, [templates[1]], setProcessedRows);
        expect(result).toStrictEqual(rows);
        expect(setProcessedRows).toHaveBeenCalledTimes(3);
        expect(templates[0].processFunction).toHaveBeenCalledTimes(0);
        expect(templates[1].processFunction).toHaveBeenCalledTimes(3);
        expect(templates[1].processFunction).toHaveBeenCalledWith(rows[0], templates[1]);
        expect(templates[1].processFunction).toHaveBeenCalledWith(rows[1], templates[1]);
        expect(templates[1].processFunction).toHaveBeenCalledWith(rows[2], templates[1]);
      });
    });
    describe("template tree is not null", () => {
      beforeEach(() => {
        jest.spyOn(utils, "identifyProcessingDependencies").mockReturnValue(templates);
        jest.spyOn(utils, "getLowestConcurrencyLimit").mockReturnValue(null);
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
          const result = await utils.initiateCalls(rows, templates, setProcessedRows);
          expect(result).toStrictEqual(rows);
          expect(setProcessedRows).toHaveBeenCalledTimes(3);
          expect(templates[0].processFunction).toHaveBeenCalledTimes(3);
          expect(templates[0].processFunction).toHaveBeenCalledWith(rows[0], templates[0]);
          expect(templates[0].processFunction).toHaveBeenCalledWith(rows[1], templates[0]);
          expect(templates[0].processFunction).toHaveBeenCalledWith(rows[2], templates[0]);
          expect(templates[1].processFunction).toHaveBeenCalledTimes(3);
          expect(templates[1].processFunction).toHaveBeenCalledWith(rows[0], templates[1]);
          expect(templates[1].processFunction).toHaveBeenCalledWith(rows[1], templates[1]);
          expect(templates[1].processFunction).toHaveBeenCalledWith(rows[2], templates[1]);
        });
      });
      describe("dependency tree fails to fully processes", () => {
        beforeEach(() => {
          templates[0].processFunction.mockResolvedValue("Yay");
          templates[1].processFunction.mockResolvedValue("Yay");
        });
        test("should call process function for each successful dependency row", async () => {
          const handleWfmExternalLogon = jest.fn();
          templates[0].stateUpdateFunctions = [jest.fn(), handleWfmExternalLogon];
          console.log("template", templates[0]);
          handleWfmExternalLogon
            .mockResolvedValueOnce({
              failedActivations: {
                message: "blep",
                nNumbersWithoutTwilioWorkers: [],
                workersFailedToActivate: ["n1234563"],
                workersFailedToReturnToOffline: ["n1234564"]
              }
            });
          const rows = [
            {
              rowNumber: 1,
              workerSid: "WK1324",
              wfmActivateExternalLogon: true,
              attributes: {
                n_number: "n1234564"
              }
            },
            {
              rowNumber: 2,
              workerSid: "WK2345",
              wfmActivateExternalLogon: true,
              attributes: {
                n_number: "n1234563"
              }
            },
            {
              rowNumber: 3,
              wfmActivateExternalLogon: true
            }
          ];
          try {
            await utils.initiateCalls(rows, templates, setProcessedRows);
          } catch(err) {
            expect(setProcessedRows).toHaveBeenCalledTimes(3);
            expect(templates[0].processFunction).toHaveBeenCalledTimes(3);
            expect(templates[0].processFunction).toHaveBeenCalledWith(rows[0], templates[0]);
            expect(templates[0].processFunction).toHaveBeenCalledWith(rows[1], templates[0]);
            expect(templates[0].processFunction).toHaveBeenCalledWith(rows[2], templates[0]);
            expect(templates[1].processFunction).toHaveBeenCalledTimes(2);
            expect(templates[1].processFunction).toHaveBeenCalledWith(rows[0], templates[1]);
            expect(templates[1].processFunction).toHaveBeenCalledWith(rows[1], templates[1]);
            expect(err).toStrictEqual({
              errors: [
                {
                  errors: ["CREATE_CALABRIO_USER failed due to missing workerSid from CREATE_TRITON_USER. If CREATE_TRITON_USER was successful it could have just taken too long and should be reprocessed."],
                  rowNumber: 3
                },
                {
                  errors: "An error occurred and we were unable to activate these workers: blep",
                  rowNumber: "multiple",
                  wfmErrors: "n1234563"
                },
                {
                  errors: "There was an error returning these workers to offline state",
                  rowNumber: "multiple",
                  wfmErrors: "n1234564"
                }
              ],
              success: [
                {
                  rowNumber: 1,
                  workerSid: "WK1324",
                  wfmActivateExternalLogon: true,
                  attributes: {
                    n_number: "n1234564"
                  }
                },
                {
                  rowNumber: 2,
                  workerSid: "WK2345",
                  wfmActivateExternalLogon: true,
                  attributes: {
                    n_number: "n1234563"
                  }
                }
              ]
            });
          }
        });
      });
    });
  });
  describe("concurrency limit is not null", () => {
    const setProcessedRows = jest.fn();
    const updateStateFunction = jest.fn();
    const rows = [
      { rowNumber: 1 },
      { rowNumber: 2 },
      { rowNumber: 3 }
    ];
    const templates = [
      {
        name: "CREATE_TRITON_USER",
        processFunction: jest.fn(),
        stateUpdateFunctions: [updateStateFunction]
      }
    ];
    beforeEach(() => {
      updateStateFunction.mockResolvedValue();
      jest.spyOn(utils, "identifyProcessingDependencies").mockReturnValue(templates);
      jest.spyOn(utils, "identifySuccessfulRecords").mockReturnValue([]);
      jest.spyOn(utils, "getLowestConcurrencyLimit").mockReturnValue(1);
      jest.spyOn(utils, "handleConcurrentCalls").mockResolvedValue([]);
    });
    test("should call handleConcurrentCalls", async () => {
      await utils.initiateCalls(rows, templates, setProcessedRows);
      // expect(utils.handleConcurrentCalls).toHaveBeenCalledTimes(1);
      expect(updateStateFunction).toHaveBeenCalledTimes(1);
    });
  });
});

describe("handleWfmExternalLogon", () => {
  const mockDispatch = jest.fn();

  const selectedTemplates1 = [
    {
      name: "CREATE_TRITON_USER"
    }
  ];
  const selectedTemplates2 = [
    {
      name: "SOME_OTHER_THING"
    }
  ];

  const successfulRowsWithActivation = [{
    rowNumber: 4,
    "WFM Activate External Logon": "Y",
    wfmActivateExternalLogon: true,
    attributes: {
      n_number: "n1234567"
    }
  }];
  const successfulRowsNoActivation = [{
    rowNumber: 4,
    "WFM Activate External Logon": "N",
    wfmActivateExternalLogon: false
  }];

  const lotsOfSuccessfulRows = [
    successfulRowsWithActivation[0], successfulRowsWithActivation[0], successfulRowsWithActivation[0], successfulRowsWithActivation[0], successfulRowsWithActivation[0],
    successfulRowsWithActivation[0], successfulRowsWithActivation[0], successfulRowsWithActivation[0], successfulRowsWithActivation[0], successfulRowsWithActivation[0],
    successfulRowsWithActivation[0], successfulRowsWithActivation[0], successfulRowsWithActivation[0], successfulRowsWithActivation[0], successfulRowsWithActivation[0],
    successfulRowsWithActivation[0], successfulRowsWithActivation[0], successfulRowsWithActivation[0], successfulRowsWithActivation[0], successfulRowsWithActivation[0],
    successfulRowsWithActivation[0], successfulRowsWithActivation[0], successfulRowsWithActivation[0], successfulRowsWithActivation[0], successfulRowsWithActivation[0],
    successfulRowsWithActivation[0], successfulRowsWithActivation[0], successfulRowsNoActivation[0], successfulRowsNoActivation[0], successfulRowsNoActivation[0]
  ];

  const someFailures = [{
    rowNumber: 4,
    "WFM Activate External Logon": "Y",
    wfmActivateExternalLogon: true,
    attributes: {
      n_number: "n1234567"
    }
  },
  {
    rowNumber: 4,
    "WFM Activate External Logon": "Y",
    wfmActivateExternalLogon: true,
    attributes: {
      n_number: "n1234568"
    }
  },
  {
    rowNumber: 4,
    "WFM Activate External Logon": "Y",
    wfmActivateExternalLogon: true,
    attributes: {
      n_number: "n1234569"
    }
  },
  {
    rowNumber: 4,
    "WFM Activate External Logon": "Y",
    wfmActivateExternalLogon: true,
    attributes: {
      n_number: "n1234563"
    }
  },
  {
    rowNumber: 4,
    "WFM Activate External Logon": "Y",
    wfmActivateExternalLogon: true,
    attributes: {
      n_number: "n1234564"
    }
  }];

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });
  describe("CREATE_TRITON_USER template is not selected", () => {
    test("promise resolves with message", async () => {
      const results = await utils.handleWfmExternalLogon({}, mockDispatch, successfulRowsNoActivation, selectedTemplates2);
      expect(results).toBe("Selected template not CREATE_TRITON_USER, skipping handleWfmExternalLogon");
    });
  });
  describe("CREATE_TRITON_USER template is selected", () => {
    const mockWfmExternalLogonResultsSuccess = {
      data: {
        failedActivations: {
          message: "blep",
          nNumbersWithoutTwilioWorkers: [],
          workersFailedToActivate: [],
          workersFailedToReturnToOffline: []
        }
      }
    };
    describe("all activations were successful", () => {
      test("batch is less than 25 users", async () => {
        wfmActivateExternalLogon.mockResolvedValue(mockWfmExternalLogonResultsSuccess);
        const results = await utils.handleWfmExternalLogon({}, mockDispatch, successfulRowsWithActivation, selectedTemplates1);
        expect(wfmActivateExternalLogon).toHaveBeenCalledTimes(1);
        expect(results).toEqual({
          failedActivations: {
            message: "blep",
            nNumbersWithoutTwilioWorkers: [],
            workersFailedToActivate: [],
            workersFailedToReturnToOffline: []
          }
        });
      });
      test("batch is more than 25", async () => {
        const mockWfmExternalLogonResultsSuccess2 = {
          data: {
            successfulActivations: [
              "n1234567", "n1234567", "n1234567", "n1234567", "n1234567",
              "n1234567", "n1234567", "n1234567", "n1234567", "n1234567",
              "n1234567", "n1234567", "n1234567", "n1234567", "n1234567",
              "n1234567", "n1234567", "n1234567", "n1234567", "n1234567",
              "n1234567", "n1234567", "n1234567", "n1234567", "n1234567"
            ],
            failedActivations: {
              message: "blep",
              nNumbersWithoutTwilioWorkers: [],
              workersFailedToActivate: [],
              workersFailedToReturnToOffline: []
            }
          }
        };
        const mockWfmExternalLogonResultsSuccess3 = {
          data: {
            failedActivations: {
              message: "blep",
              nNumbersWithoutTwilioWorkers: [],
              workersFailedToActivate: [],
              workersFailedToReturnToOffline: []
            }
          }
        };
        wfmActivateExternalLogon
          .mockResolvedValueOnce(mockWfmExternalLogonResultsSuccess2)
          .mockResolvedValueOnce(mockWfmExternalLogonResultsSuccess3);
        const results = await utils.handleWfmExternalLogon({}, mockDispatch, lotsOfSuccessfulRows, selectedTemplates1);
        await waitFor(() => {
          expect(wfmActivateExternalLogon).toHaveBeenCalledTimes(2);
          expect(results).toEqual({
            failedActivations: {
              message: "blep",
              nNumbersWithoutTwilioWorkers: [],
              workersFailedToActivate: [],
              workersFailedToReturnToOffline: []
            }
          });
        });
      });
    });
    describe("some activations failed", () => {
      test("batch is less than 25 users, function returns the nNumbers that failed to activate ", async () => {
        const mockWfmExternalLogonResultsSomeFailures = {
          data: {
            failedActivations: {
              message: "blep",
              nNumbersWithoutTwilioWorkers: ["n1234567", "n1234568", "n1234569"],
              workersFailedToActivate: ["n1234563"],
              workersFailedToReturnToOffline: ["n1234564"]
            }
          }
        };
        wfmActivateExternalLogon.mockResolvedValue(mockWfmExternalLogonResultsSomeFailures);
        const results = await utils.handleWfmExternalLogon({}, mockDispatch, someFailures, selectedTemplates1);
        expect(wfmActivateExternalLogon).toHaveBeenCalledTimes(1);
        expect(results).toEqual({
          failedActivations: {
            message: "blep",
            nNumbersWithoutTwilioWorkers: ["n1234567", "n1234568", "n1234569"],
            workersFailedToActivate: ["n1234563"],
            workersFailedToReturnToOffline: ["n1234564"]
          }
        });
      });
    });
    test("big batch with more than 25 users, results are returned in a single array separated by error", async () => {
      const mockWfmExternalLogonResultsSomeFailures = {
        data: {
          failedActivations: {
            message: "blep",
            nNumbersWithoutTwilioWorkers: ["n1234567", "n1234568", "n1234569", "n1234567", "n1234568", "n1234569", "n1234567", "n1234568", "n1234569", "n1234567", "n1234568", "n1234569", "n1234567", "n1234568", "n1234569"],
            workersFailedToActivate: ["n1234563", "n1234563","n1234563", "n1234563", "n1234563"],
            workersFailedToReturnToOffline: ["n1234564", "n1234564", "n1234564", "n1234564", "n1234564"]
          }
        }
      };
      const mockWfmExternalLogonResultsSomeFailures2 = {
        data: {
          failedActivations: {
            message: "blep",
            nNumbersWithoutTwilioWorkers: ["n1234567", "n1234568", "n1234569"],
            workersFailedToActivate: ["n1234563"],
            workersFailedToReturnToOffline: ["n1234564"]
          }
        }
      };
      const bigBatchFailures = [...someFailures, ...someFailures, ...someFailures, ...someFailures, ...someFailures, ...someFailures];
      wfmActivateExternalLogon
        .mockResolvedValueOnce(mockWfmExternalLogonResultsSomeFailures)
        .mockResolvedValue(mockWfmExternalLogonResultsSomeFailures2);
      const results = await utils.handleWfmExternalLogon({}, mockDispatch, bigBatchFailures, selectedTemplates1);
      expect(wfmActivateExternalLogon).toHaveBeenCalledTimes(2);
      expect(results).toEqual({
        failedActivations: {
          message: "blep",
          nNumbersWithoutTwilioWorkers: ["n1234567", "n1234568", "n1234569", "n1234567", "n1234568", "n1234569", "n1234567", "n1234568", "n1234569", "n1234567", "n1234568", "n1234569", "n1234567", "n1234568", "n1234569", "n1234567", "n1234568", "n1234569"],
          workersFailedToActivate: ["n1234563", "n1234563","n1234563", "n1234563", "n1234563", "n1234563"],
          workersFailedToReturnToOffline: ["n1234564", "n1234564", "n1234564", "n1234564", "n1234564", "n1234564"]
        }
      });
    });
  });
});

