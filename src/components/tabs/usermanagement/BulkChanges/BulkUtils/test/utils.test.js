import {
  readUploadFile,
  updateSelectedTemplates,
  consolidateTemplates,
  identifySuccessfulRecords,
  identifyProcessingDependencies,
  // initiateCalls,
  performValidations,
  checkConflictingUsers
  // handleConcurrentCalls
} from "../utils";
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

describe("updateSelectedTemplates", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });
  const mockSetSelectedTemplates = jest.fn();
  test("Checked is true and template is already in selected templates, do nothing", () => {
    const newTemplate = {
      name: "CREATE_TRITON_USER"
    };
    const selectedTemplates = [newTemplate];
    updateSelectedTemplates(true, newTemplate, selectedTemplates, mockSetSelectedTemplates);
    expect(mockSetSelectedTemplates).toBeCalledTimes(0);
  });
  test("Checked is true and template is not in selected templates, add the template and setSelectedTemplates", () => {
    const newTemplate = {
      name: "CREATE_TRITON_USER"
    };
    updateSelectedTemplates(true, newTemplate, [], mockSetSelectedTemplates);
    expect(mockSetSelectedTemplates).toBeCalledTimes(1);
    expect(mockSetSelectedTemplates).toBeCalledWith([newTemplate]);
  });
  test("Checked is false and template is not in selected templates, do nothing", () => {
    const newTemplate = {
      name: "CREATE_TRITON_USER"
    };
    updateSelectedTemplates(false, newTemplate, [], mockSetSelectedTemplates);
    expect(mockSetSelectedTemplates).toBeCalledTimes(0);
  });
  test("Checked is false and template is in selected templates, remove the template and setSelectedTemplates", () => {
    const newTemplate = {
      name: "CREATE_TRITON_USER"
    };
    const selectedTemplates = [newTemplate];
    updateSelectedTemplates(false, newTemplate, selectedTemplates, mockSetSelectedTemplates);
    expect(mockSetSelectedTemplates).toBeCalledTimes(1);
    expect(mockSetSelectedTemplates).toBeCalledWith([]);
  });
});

describe("consolidateTemplates", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });
  const mockSetConsolidatedTemplates = jest.fn();
  const template1 = {
    fields: [
      {
        field: "nNumber",
        type: "string"
      },
      {
        field: "profileId",
        type: "number"
      }
    ]
  };
  const template2 = {
    fields: [
      {
        field: "nNumber",
        type: "string"
      },
      {
        field: "what?",
        type: "string"
      },
      {
        field: "cool beans",
        type: "bean"
      }
    ]
  };
  test("Single template selected, all fields are added", () => {
    consolidateTemplates([template1], mockSetConsolidatedTemplates);
    expect(mockSetConsolidatedTemplates).toBeCalledTimes(1);
    expect(mockSetConsolidatedTemplates).toBeCalledWith(template1.fields);
  });
  test("Multiple templates selected, all fields are added, except for duplicate fields", () => {
    const expectedResult = [
      {
        field: "nNumber",
        type: "string"
      },
      {
        field: "profileId",
        type: "number"
      },
      {
        field: "what?",
        type: "string"
      },
      {
        field: "cool beans",
        type: "bean"
      }
    ];
    consolidateTemplates([template1, template2], mockSetConsolidatedTemplates);
    expect(mockSetConsolidatedTemplates).toBeCalledTimes(1);
    expect(mockSetConsolidatedTemplates).toBeCalledWith(expectedResult);
  });
  test("No template selected, no fields are added to setConsolidateFields", () => {
    consolidateTemplates([], mockSetConsolidatedTemplates);
    expect(mockSetConsolidatedTemplates).toBeCalledTimes(1);
    expect(mockSetConsolidatedTemplates).toBeCalledWith([]);
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

// TODO - this function is new... need some tests
// describe("handleConcurrentCalls", () => {
//   beforeEach(() => {
//     jest.clearAllMocks();
//     jest.resetAllMocks();
//   });
//   const mockProgressCallback = jest.fn();
//   const mockSetProcessedRows = jest.fn();
//   test("")

// });

// TODO- faith is still working on this function
describe("initiateCalls", () => {});

describe("performValidations", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });
  const mockSetProcessedRows = jest.fn();
  const form = [
    {
      nNumber: "something"
    },
    {
      nNumber: "something else"
    }
  ];

  // TODO: These need more beefing
  test("Performs validations of fields, resolves for no errors", async () => {
    const fieldListNoErrors = [    {
      field: "nNumber",
      validateFunction: () => true
    }];
    const template1 = {
      name: "CREATE_TRITON_USER"
    };
    const selectedTemplates = [template1];
    const validationResult = await performValidations(form, selectedTemplates, fieldListNoErrors, mockSetProcessedRows);
    expect(mockSetProcessedRows).toBeCalledTimes(2);
    expect(validationResult).toBe(undefined);
  });
  test("Performs validations of fields, validations fail, rejects with error", async () => {
    const fieldList = [    {
      field: "nNumber",
      validateFunction: () => Promise.reject("nNumber is too long")
    }];
    const template1 = {
      name: "CREATE_TRITON_USER"
    };
    try {
      await performValidations(form, [template1], fieldList, mockSetProcessedRows);
    } catch (e) {
      expect(e).toEqual([
        {
          "errors": [
            "nNumber is too long"
          ],
          "row": 2
        },
        {
          "errors": [
            "nNumber is too long"
          ],
          "row": 3
        }
      ]);
      expect(mockSetProcessedRows).toBeCalledTimes(2);
    }
  });
  test("Performs validations of fields, some validations fail, some pass, rejects with appropriate errors", async () => {
    const fieldList = [{
      field: "nNumber",
      validateFunction: jest.fn().mockRejectedValueOnce("Boo you stink!").mockResolvedValueOnce("yay").mockRejectedValueOnce("Boo you stink!")
    },
    {
      field: "someCoolField",
      validateFunction: jest.fn().mockResolvedValueOnce("yay").mockResolvedValueOnce("yay").mockRejectedValueOnce("nope!")
    }];
    const longerForm = [
      {
        nNumber: "something",
        someCoolField: "butts"
      },
      {
        nNumber: "something else",
        someCoolField: "hi mom"
      },
      {
        nNumber: "12345",
        someCoolField: "wahooooo"
      }
    ];
    const template1 = {
      name: "CREATE_TRITON_USER"
    };
    try {
      await performValidations(longerForm, [template1], fieldList, mockSetProcessedRows);
    } catch (e) {
      expect(e).toEqual([
        {
          "errors": [
            "Boo you stink!"
          ],
          "row": 2
        },
        {
          "errors": [
            "Boo you stink!",
            "nope!"
          ],
          "row": 4
        }
      ]);
      expect(mockSetProcessedRows).toBeCalledTimes(3);
    }
  });
});

// describe("handleExportErrors", () => {
//   const _exportMock = {
//     current: {
//       save: jest.fn()
//     }
//   };
//   test("No validatation errors, export is saved with empty rows and the columns: row,  errors", () => {
//     handleExportErrors([], _exportMock);
//     expect(_exportMock.current.save).toBeCalledWith([], [
//       {
//         title: "Row",
//         field: "row",
//         width: "50px"
//       },
//       {
//         title: "Errors",
//         field: "errors",
//         width: "400px"
//       }
//     ]);
//   });
//   test("Validatation errors present, export is saved with appropriate rows and the columns: row,  errors", () => {
//     const validationErrors = [
//       {
//         row: 1,
//         errors: ["Boo"]
//       },
//       {
//         row: 13,
//         errors: ["Boo", "ewwww"]
//       },
//       {
//         row: 183,
//         errors: ["no way!"]
//       }
//     ];
//     handleExportErrors(validationErrors, _exportMock);
//     expect(_exportMock.current.save).toBeCalledWith([
//       {
//         row: 1,
//         errors: "Boo"
//       },
//       {
//         row: 13,
//         errors: "Boo,ewwww"
//       },
//       {
//         row: 183,
//         errors: "no way!"
//       }
//     ], [
//       {
//         title: "Row",
//         field: "row",
//         width: "50px"
//       },
//       {
//         title: "Errors",
//         field: "errors",
//         width: "400px"
//       }
//     ]);
//   });
// });

describe("checkConflictingUsers", () => {
  const cleanUser = {
    workerSid: "9876",
    email: "email@lm.com",
    adLogin: "lm/9876"
  };
  const userWithConflictingEmail = {
    workerSid: "7474",
    email: "dude@libertymutual.com",
    adLogin: "lm/7474"
  };
  const userWithConflictingAcdId = {
    workerSid: "123",
    email: "dudette@libertymutual.com",
    adLogin: "lm/123234"
  };
  const userWithConflictingAdLogin = {
    workerSid: "555",
    email: "person@libertymutual.com",
    adLogin: "lm/456"
  };
  const users = [
    {
      acdId: "123",
      email: "dude@libertymutual.com",
      adLogin: "lm/123"
    },
    {
      acdId: "456",
      email: "someone@libertymutual.com",
      adLogin: "lm/456"
    }
  ];
  test("No user is passed to function, promise rejects", async () => {
    try {
      await checkConflictingUsers({}, []);
    } catch (e) {
      expect(e).toEqual("No user passed to calabrio processing");
    }
  });
  test("User passed to function, has no matches in the users list, returns resolved", async () => {
    const result = await checkConflictingUsers(cleanUser, users);
    expect(result).toEqual([
      {
        status: "fulfilled",
        value: undefined
      },
      {
        status: "fulfilled",
        value: undefined
      }
    ]);
  });
  test("User passed to function, has acdId matches in the users list, returns resolved", async () => {
    const result = await checkConflictingUsers(userWithConflictingAcdId, users);
    expect(result).toEqual([
      {
        reason: "Calabrio Record already exists with this user's acdId.",
        status: "rejected"
      },
      {
        status: "fulfilled",
        value: undefined
      }
    ]);
  });
  test("User passed to function, has email matches in the users list, returns resolved", async () => {
    const result = await checkConflictingUsers(userWithConflictingEmail, users);
    expect(result).toEqual([
      {
        reason: "Calabrio Record already exists with this user's email.",
        status: "rejected"
      },
      {
        status: "fulfilled",
        value: undefined
      }
    ]);
  });
  test("User passed to function, has adlogin matches in the users list, returns resolved", async () => {
    const result = await checkConflictingUsers(userWithConflictingAdLogin, users);
    expect(result).toEqual([
      {
        status: "fulfilled",
        value: undefined
      },
      {
        reason: "Calabrio Record already exists with this user's nNumber in the AdLogin field.",
        status: "rejected"
      }
    ]);
  });
});