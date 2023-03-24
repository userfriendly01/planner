import {
  updateSelectedTemplates,
  consolidateTemplates,
  performValidations,
  checkConflictingCalabrioUsers
} from "../validationUtils";
import {
  getLowestConcurrencyLimit,
  handleConcurrentCalls
} from "../processingUtils";

jest.mock("../processingUtils",() => ({
  handleConcurrentCalls: jest.fn(),
  getLowestConcurrencyLimit: jest.fn(),
  identifyProcessingDependencies: jest.requireActual("../processingUtils").identifyProcessingDependencies
}));

describe("updateSelectedTemplates", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    jest.mock("../validationUtils",() => ({
      consolidateTemplates: jest.fn(),
      performValidations: jest.fn(),
      checkConflictingCalabrioUsers: jest.fn(),
      updateSelectedTemplates: jest.requireActual("validationUtils").updateSelectedTemplates
    }));
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
    jest.mock("../validationUtils",() => ({
      consolidateTemplates: jest.requireActual("validationUtils").consolidateTemplates,
      performValidations: jest.fn(),
      checkConflictingCalabrioUsers: jest.fn(),
      updateSelectedTemplates: jest.fn()
    }));
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

describe("performValidations", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    jest.mock("../validationUtils",() => ({
      consolidateTemplates: jest.fn(),
      performValidations: jest.requireActual("validationUtils").performValidations,
      checkConflictingCalabrioUsers: jest.fn(),
      updateSelectedTemplates: jest.fn()
    }));
    getLowestConcurrencyLimit.mockReturnValue(null);
  });
  const mockSetProcessedRows = jest.fn();
  const form = [
    {
      rowNumber: 1,
      nNumber: "something"
    },
    {
      rowNumber: 2,
      nNumber: "something else"
    }
  ];

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
  test("Performs validations of fields with concurrency limit, resolves for no errors", async () => {
    const validationResults = [{
      status: "fulfilled",
      value: [
        {
          status: "fulfilled",
          value: "we did it!!"
        }
      ]
    }];
    getLowestConcurrencyLimit.mockReturnValue(2);
    handleConcurrentCalls.mockResolvedValue(validationResults);
    const fieldListNoErrors = [    {
      field: "nNumber",
      validateFunction: () => true
    }];
    const template1 = {
      name: "CREATE_TRITON_USER"
    };
    const selectedTemplates = [template1];
    const validationResult = await performValidations(form, selectedTemplates, fieldListNoErrors, mockSetProcessedRows);
    expect(mockSetProcessedRows).toBeCalledTimes(0);
    expect(validationResult).toBe(undefined);
  });
  test("Performs validations of fields, validations fail, rejects with error", async () => {
    const validateFunction = jest.fn();
    validateFunction.mockRejectedValueOnce(JSON.stringify({
      rowNumber: 1,
      error: "nNumber is too long"
    }));
    validateFunction.mockRejectedValueOnce(JSON.stringify({
      rowNumber: 2,
      error: "nNumber is too long"
    }));
    const fieldList = [
      {
        field: "nNumber",
        validateFunction
      }
    ];
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
          "rowNumber": 1
        },
        {
          "errors": [
            "nNumber is too long"
          ],
          "rowNumber": 2
        }
      ]);
      expect(mockSetProcessedRows).toBeCalledTimes(2);
    }
  });
  test("Performs validations of fields, some validations fail, some pass, rejects with appropriate errors", async () => {
    const nNumberValidateFunction = jest.fn();
    nNumberValidateFunction.mockRejectedValueOnce(JSON.stringify({
      rowNumber: 1,
      error: "Boo you stink!"
    }));
    nNumberValidateFunction.mockResolvedValueOnce("yay");
    nNumberValidateFunction.mockRejectedValueOnce(JSON.stringify({
      rowNumber: 3,
      error: "Boo you stink!"
    }));
    const otherValidateFunction = jest.fn();
    otherValidateFunction.mockResolvedValueOnce("yay");
    otherValidateFunction.mockResolvedValueOnce("yay");
    otherValidateFunction.mockRejectedValueOnce(JSON.stringify({
      rowNumber: 3,
      error: "nope!"
    }));
    const fieldList = [{
      field: "nNumber",
      validateFunction: nNumberValidateFunction
    },
    {
      field: "someCoolField",
      validateFunction: otherValidateFunction
    }];
    const longerForm = [
      {
        rowNumber: 1,
        nNumber: "something",
        someCoolField: "butts"
      },
      {
        rowNumber: 2,
        nNumber: "something else",
        someCoolField: "hi mom"
      },
      {
        rowNumber: 3,
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
          "rowNumber": 1
        },
        {
          "errors": [
            "Boo you stink!",
            "nope!"
          ],
          "rowNumber": 3
        }
      ]);
      expect(mockSetProcessedRows).toBeCalledTimes(3);
    }
  });
});

describe("checkConflictingCalabrioUsers", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    jest.mock("../validationUtils",() => ({
      consolidateTemplates: jest.fn(),
      performValidations: jest.fn(),
      checkConflictingCalabrioUsers: jest.requireActual("validationUtils").checkConflictingCalabrioUsers,
      updateSelectedTemplates: jest.fn()
    }));
  });
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
      await checkConflictingCalabrioUsers(null, 1, []);
    } catch (err) {
      expect(err).toEqual(JSON.stringify({
        rowNumber: 1,
        error: "No user passed to calabrio processing"
      }));
    }
  });
  test("User passed to function, has no matches in the users list, returns resolved", async () => {
    const result = await checkConflictingCalabrioUsers(cleanUser, 1, users);
    expect(result).toEqual("Calabrio Checks passed for 1");
  });
  test("User passed to function, has acdId matches in the users list, returns resolved", async () => {
    try {
      await checkConflictingCalabrioUsers(userWithConflictingAcdId, 1, users);
    } catch(err){
      expect(err).toEqual(JSON.stringify({
        rowNumber: 1,
        error: "Calabrio Record already exists with this user's acdId for row 1."
      }));
    }
  });
  test("User passed to function, has email matches in the users list, returns resolved", async () => {
    try {
      await checkConflictingCalabrioUsers(userWithConflictingEmail, 1, users);
    } catch(err){
      expect(err).toEqual(JSON.stringify({
        rowNumber: 1,
        error: "Calabrio Record already exists with this user's email for row 1."
      }));
    }
  });
  test("User passed to function, has adlogin matches in the users list, returns resolved", async () => {
    try {
      await checkConflictingCalabrioUsers(userWithConflictingAdLogin, 1, users);
    } catch(err){
      expect(err).toEqual(JSON.stringify({
        rowNumber: 1,
        error: "Calabrio Record already exists with this user's nNumber in the AdLogin field for row 1."
      }));
    }
  });
});

// TODO: Write tests for allowedEmpty function