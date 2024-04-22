import {
  FIELDS,
  isDidUser
} from "../fields";
import {
  fetchUser,
  generateExtension
} from "services";
import {
  initialTestState
} from "testUtils";

jest.mock("services", () => ({
  fetchUser: jest.fn(),
  generateExtension: jest.fn()
}));

describe("fields.js", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe("isDidUser", () => {
    test("didField is not a string, reject with message", () => {
      try {
        isDidUser(12, 3);
      } catch (err) {
        expect(err).toEqual(new Error("Did User field needs to be 'Y' or 'N' for row 3"));
      }
    });
    test("didField is not y or n, reject with message", () => {
      try {
        isDidUser("hello", 1);
      } catch (err) {
        expect(err).toEqual(new Error("Did User field needs to be 'Y' or 'N' for row 1"));
      }
    });
    test("didField is y, returns true", () => {
      const result = isDidUser("y", 5);
      expect(result).toEqual(true);
    });
    test("didField is n, returns false", () => {
      const result = isDidUser("n", 5);
      expect(result).toEqual(false);
    });
  });

  describe("FIELDS", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    describe("N_NUMBER_CREATE", () => {
      describe("validateFunction", () => {
        const NNumberValidateFunction = FIELDS.N_NUMBER_CREATE.validateFunction;
        test("No matching N number field, rejects with N Number is missing from row message", async () => {
          try {
            await NNumberValidateFunction({
              boo: "ya",
              rowNumber: 1
            }, initialTestState);
          } catch (e) {
            expect(e).toEqual(JSON.stringify({
              rowNumber: 1,
              error: "N Number is missing from row 1"
            }));
            expect(fetchUser).toHaveBeenCalledTimes(0);
          }
        });
        test("N Number is not a string, rejects with invalid n nubmer message", async () => {
          try {
            await NNumberValidateFunction({
              rowNumber: 1,
              "N Number": 12
            }, initialTestState);
          } catch (e) {
            expect(e).toEqual(JSON.stringify({
              rowNumber: 1,
              error: "N Number is not in the valid n number format for row 1"
            }));
            expect(fetchUser).toHaveBeenCalledTimes(0);
          }
        });
        test("N Number is not 8 characters, rejects with invalid n nubmer message", async () => {
          try {
            await NNumberValidateFunction({
              rowNumber: 1,
              "N Number": "superlongnnumber"
            }, initialTestState);
          } catch (e) {
            expect(e).toEqual(JSON.stringify({
              rowNumber: 1,
              error: "N Number is not in the valid n number format for row 1"
            }));
            expect(fetchUser).toHaveBeenCalledTimes(0);
          }
        });
        test("Error while calling fetchUser, rejects with Error message", async () => {
          fetchUser.mockRejectedValue("nope");
          try {
            await NNumberValidateFunction({
              rowNumber: 4,
              "N Number": "n1234567"
            }, initialTestState);
          } catch (e) {
            expect(e).toEqual(JSON.stringify({
              rowNumber: 4,
              error: "Error thrown fetching N Number from HR Database for row 4"
            }));
            expect(fetchUser).toHaveBeenCalledTimes(1);
          }
        });
        test("worker already exists, reject with error", async () => {
          try {
            await NNumberValidateFunction({
              rowNumber: 4,
              "N Number": "n0000000"
            }, initialTestState);
          } catch (e) {
            expect(e).toEqual(JSON.stringify({
              rowNumber: 4,
              error: "n0000000 already has a record in Twilio/Worker Database row 4"
            }));
            expect(fetchUser).toHaveBeenCalledTimes(0);
          }
        });
        test("fetch returns successful response, resolves with field is valid message", async () => {
          fetchUser.mockResolvedValue({
            departmentNumber: "123",
            email: "hi@lmig.com",
            departmentName: "grm",
            full_name: "Bob Smith",
            n_number: "n1234567",
            officeName: "hi",
            officeNumber: 12,
            unique_id: "n1234567",
            adLogin: "LM\\n1234567",
            firstName: "Bob",
            lastName: "Smith"
          });
          const row = {
            rowNumber: 1,
            "N Number": "n1234567"
          };
          const result = await NNumberValidateFunction(row, initialTestState);
          expect(result).toEqual("N Number Valid for row 1");
          expect(row).toEqual({
            ...row,
            attributes: {
              contact_uri: "client:n1234567",
              department_id: "123",
              email: "hi@lmig.com",
              department_name: "grm",
              email_address: "hi@lmig.com",
              emp_first_name: "Bob",
              emp_last_name: "Smith",
              full_name: "Bob Smith",
              firstName: "Bob",
              lastName: "Smith",
              location: "hi",
              n_number: "n1234567",
              office_location_name: "hi",
              office_location_number: 12,
              primary_dept_name: "grm",
              primary_dept_number: "123",
              unique_id: "n1234567",
              adLogin: "LM\\n1234567"
            }
          });
        });
        test("attributes is already on successful row, returns successful response, resolves with field is valid message", async () => {
          const existingAttributes = {
            caller_id: "16038518200"
          };
          fetchUser.mockResolvedValue({
            departmentNumber: "123"
          });
          const row = {
            rowNumber: 1,
            "N Number": "n1234567",
            attributes: existingAttributes
          };
          const result = await NNumberValidateFunction(row, initialTestState);
          expect(result).toEqual("N Number Valid for row 1");
          expect(row).toEqual({
            ...row,
            attributes: {
              department_id: "123",
              ...existingAttributes
            }
          });
        });
      });
    });
    describe("N_NUMBER_UPDATE", () => {
      describe("validateFunction", () => {
        const nNumUpdateValidation = FIELDS.N_NUMBER_UPDATE.validateFunction;
        test("field is missing from the row data, rejects with message", async () => {
          try {
            await nNumUpdateValidation({
              rowNumber: 2,
              "no n number field": "what?"
            }, initialTestState);
          } catch (err) {
            expect(err).toEqual(JSON.stringify({
              rowNumber: 2,
              error: "N Number is missing from row 2"
            }));
          }
        });
        test("the field is not a string, reject with message", async () => {
          try {
            await nNumUpdateValidation({
              rowNumber: 2,
              "N Number": 16
            }, initialTestState);
          } catch (err) {
            expect(err).toEqual(JSON.stringify({
              rowNumber: 2,
              error: "N Number is not in the valid n number format for row 2"
            }));
          }
        });
        test("the field is not 8 characters long, reject with message", async () => {
          try {
            await nNumUpdateValidation({
              rowNumber: 2,
              "N Number": "long string"
            }, 2, initialTestState);
          } catch (err) {
            expect(err).toEqual(JSON.stringify({
              rowNumber: 2,
              error: "N Number is not in the valid n number format for row 2"
            }));
          }
        });
        test("the field is an 8 character string, but doesn't match a worker, reject with message", async () => {
          const row = {
            rowNumber: 2,
            "N Number": "n9999999"
          };
          try {
            await nNumUpdateValidation(row, initialTestState);
          } catch (err) {
            expect(err).toEqual(JSON.stringify({
              rowNumber: 2,
              error: "n9999999 is not an existing setup worker in Triton for row 2"
            }));
          }
        });
        test("error thrown fetching from state, reject with message", async () => {
          const row = {
            rowNumber: 2,
            "N Number": "n9999999"
          };
          try {
            await nNumUpdateValidation(row, { workerContext: null });
          } catch (err) {
            expect(err).toEqual(JSON.stringify({
              rowNumber: 2,
              error: "Error thrown fetching N Number from state for row 2"
            }));
          }
        });
        test("the field is 8 character string, has a worker match, resolves", async () => {
          const row = {
            rowNumber: 2,
            "N Number": "n0000000"
          };
          const result = await nNumUpdateValidation(row, initialTestState);
          expect(result).toEqual("N Number Valid for row 2");
          expect(row).toEqual({
            ...row,
            workerSid: "WK1234",
            attributes: {
              extension: "2345",
              full_name: "Gloria Sake",
              emp_first_name: "Gloria",
              emp_last_name: "Sake",
              manager_n_number: "n0263786",
              profile_id: "12",
              n_number: "n0000000"
            }
          });
        });
      });

    });
    describe("N_NUMBER_SYNC", () => {
      describe("validateFunction", () => {
        const NNumberValidateFunction = FIELDS.N_NUMBER_SYNC.validateFunction;
        test("No matching N number field, rejects with N Number is missing from row message", async () => {
          try {
            await NNumberValidateFunction({
              boo: "ya",
              rowNumber: 1,
              workerSid: "WK12345"
            }, initialTestState);
          } catch (e) {
            expect(e).toEqual(JSON.stringify({
              rowNumber: "NA",
              error: "N Number is missing from Triton Worker WK12345"
            }));
            expect(fetchUser).toHaveBeenCalledTimes(0);
          }
        });
        test("N Number is not a string, rejects with invalid n nubmer message", async () => {
          try {
            await NNumberValidateFunction({
              rowNumber: 1,
              "N Number": 12,
              workerSid: "WK12345"
            }, initialTestState);
          } catch (e) {
            expect(e).toEqual(JSON.stringify({
              rowNumber: "NA",
              error: "N Number is not in the valid n number format on Triton worker WK12345"
            }));
            expect(fetchUser).toHaveBeenCalledTimes(0);
          }
        });
        test("N Number is not 8 characters, rejects with invalid n nubmer message", async () => {
          try {
            await NNumberValidateFunction({
              rowNumber: 1,
              workerSid: "WK12345",
              "N Number": "superlongnnumber"
            }, initialTestState);
          } catch (e) {
            expect(e).toEqual(JSON.stringify({
              rowNumber: "NA",
              error: "N Number is not in the valid n number format on Triton worker WK12345"
            }));
            expect(fetchUser).toHaveBeenCalledTimes(0);
          }
        });
        test("Error while calling fetchUser, rejects with Error message", async () => {
          fetchUser.mockRejectedValue("nope");
          try {
            await NNumberValidateFunction({
              rowNumber: 4,
              workerSid: "WK12345",
              "N Number": "n1234568"
            }, initialTestState);
          } catch (e) {
            expect(e).toEqual(JSON.stringify({
              rowNumber: "NA",
              error: "Error thrown fetching N Number from HR Database for n1234568"
            }));
            expect(fetchUser).toHaveBeenCalledTimes(1);
          }
        });
        test("fetch returns successful response, resolves with field is valid message", async () => {
          fetchUser.mockResolvedValue({
            departmentNumber: "123",
            email: "hi@lmig.com",
            departmentName: "grm",
            full_name: "Bob Smith",
            n_number: "n1234568",
            officeName: "hi",
            officeNumber: 12,
            unique_id: "n1234568",
            adLogin: "LM\\n1234568",
            firstName: "Bob",
            lastName: "Smith"
          });
          const row = {
            rowNumber: 1,
            workerSid: "WK12345",
            "N Number": "n1234568"
          };
          const result = await NNumberValidateFunction(row, initialTestState);
          expect(result).toEqual("N Number Valid for WK12345");
          expect(row).toEqual({
            ...row,
            attributes: {
              contact_uri: "client:n1234568",
              department_id: "123",
              email: "hi@lmig.com",
              department_name: "grm",
              email_address: "hi@lmig.com",
              emp_first_name: "Bob",
              emp_last_name: "Smith",
              full_name: "Bob Smith",
              firstName: "Bob",
              lastName: "Smith",
              location: "hi",
              n_number: "n1234568",
              office_location_name: "hi",
              office_location_number: 12,
              primary_dept_name: "grm",
              primary_dept_number: "grm",
              unique_id: "n1234568",
              adLogin: "LM\\n1234568"
            }
          });
        });
        test("attributes is already on successful row, returns successful response, resolves with field is valid message", async () => {
          const existingAttributes = {
            caller_id: "16038518200"
          };
          fetchUser.mockResolvedValue({
            departmentNumber: "123"
          });
          const row = {
            rowNumber: 1,
            "N Number": "n1234568",
            workerSid: "WK12345",
            attributes: existingAttributes
          };
          const result = await NNumberValidateFunction(row, initialTestState);
          expect(result).toEqual("N Number Valid for WK12345");
          expect(row).toEqual({
            ...row,
            attributes: {
              department_id: "123",
              ...existingAttributes
            }
          });
        });
      });
    });
    describe("PROFILE_ID", () => {
      describe("validateFunction", () => {
        const profileValidateFunction = FIELDS.PROFILE_ID.validateFunction;
        test("No matching profile id field, rejects with message", async () => {
          try {
            await profileValidateFunction({ rowNumber: 3 }, initialTestState);
          } catch (e) {
            expect(e).toEqual(JSON.stringify({
              rowNumber: 3,
              error: "Profile Id is missing for row 3"
            }));
          }
        });
        test("profile id is not a number, rejects with message", async () => {
          const row = {
            rowNumber: 3,
            "Profile Id": "what"
          };
          try {
            await profileValidateFunction(row, initialTestState);
          } catch (e) {
            expect(e).toEqual(JSON.stringify({
              rowNumber: 3,
              error: "Profile Id is not a valid option or is not a number for row 3"
            }));
            expect(row).toEqual({
              ...row,
              attributes: {}
            });
          }
        });
        test("profile id does not exist in the profiles, rejects with message", async () => {
          const row = {
            rowNumber: 3,
            "Profile Id": 100
          };
          try {
            await profileValidateFunction(row, initialTestState);
          } catch (e) {
            expect(e).toEqual(JSON.stringify({
              rowNumber: 3,
              error: "Profile Id is not a valid option or is not a number for row 3"
            }));
            expect(row).toEqual({
              ...row,
              attributes: {}
            });
          }
        });
        test("Profile id is valid, resolves with message", async () => {
          const row = {
            rowNumber: 3,
            "Profile Id": 1
          };
          const result = await profileValidateFunction(row, initialTestState);
          expect(result).toEqual("Profile Id Valid for row 3");
          expect(row).toEqual({
            ...row,
            attributes: {
              profile_id: 1
            }
          });
        });
        test("attributes is already on successful row, returns successful response, resolves with field is valid message", async () => {
          const existingAttributes = {
            caller_id: "16038518200"
          };
          const row = {
            rowNumber: 3,
            "Profile Id": 1,
            attributes: existingAttributes
          };
          const result = await profileValidateFunction(row, initialTestState);
          expect(result).toEqual("Profile Id Valid for row 3");
          expect(row).toEqual({
            ...row,
            attributes: {
              profile_id: 1,
              ...existingAttributes
            }
          });
        });
      });
      describe("options", () => {
        const optionsFunction = FIELDS.PROFILE_ID.options;
        test("returns the profile id options", () => {
          const options = optionsFunction(initialTestState);
          expect(options).toEqual([
            1, 2, 3, 12, 396
          ]);
        });
      });

    });
    describe("MANAGER_N_NUMBER_CREATE", () => {
      describe("validateFunction", () => {
        const managerValidateFunction = FIELDS.MANAGER_N_NUMBER_CREATE.validateFunction;
        test("Field is null", async () => {
          try {
            await managerValidateFunction({
              rowNumber: 9,
              "boo": "no"
            }, initialTestState);
          } catch (e) {
            expect(e).toEqual(JSON.stringify({
              rowNumber: 9,
              error: "Manager N Number is missing from row 9"
            }));
          }
        });
        test("Manager already exists", async () => {
          try {
            await managerValidateFunction({
              rowNumber: 9,
              "Manager N Number": initialTestState.managerContext.managers[0].manager_n_number
            }, initialTestState);
          } catch (e) {
            expect(e).toEqual(JSON.stringify({
              rowNumber: 9,
              error: "Manager N Number is already present for row 9"
            }));
          }
        });
        test("n# fetch fails", async () => {
          fetchUser.mockRejectedValue("Aww");
          try {
            await managerValidateFunction({
              rowNumber: 9,
              "Manager N Number": "n0002221"
            }, initialTestState);
          } catch (e) {
            expect(e).toEqual(JSON.stringify({
              rowNumber: 9,
              error: "Error thrown fetching Manager N Number from HR Database for row 9"
            }));
          }
        });
        test("n# fetch succeeds", async () => {
          fetchUser.mockResolvedValue({
            lastName: "Shatz",
            firstName: "Carl"
          });
          const row = {
            rowNumber: 9,
            "Manager N Number": "n0002221"
          };
          await managerValidateFunction(row, initialTestState);
          expect(row).toEqual({
            ...row,
            attributes: {
              ...row.attributes,
              manager_first_name: "Carl",
              manager_last_name: "Shatz"
            }
          });
        });
        test("n# fetch succeeds, attributes are present", async () => {
          fetchUser.mockResolvedValue({
            lastName: "Shatz",
            firstName: "Carl"
          });
          const row = {
            rowNumber: 9,
            "Manager N Number": "n0002221",
            attributes: {}
          };
          await managerValidateFunction(row, initialTestState);
          expect(row).toEqual({
            ...row,
            attributes: {
              ...row.attributes,
              manager_first_name: "Carl",
              manager_last_name: "Shatz"
            }
          });
        });
      });
    });
    describe("MANAGER_N_NUMBER", () => {
      describe("validateFunction", () => {
        const managerValidateFunction = FIELDS.MANAGER_N_NUMBER.validateFunction;
        test("No matching manager n number field, rejects with message", async () => {
          try {
            await managerValidateFunction({
              rowNumber: 9,
              "boo": "no"
            }, initialTestState);
          } catch (e) {
            expect(e).toEqual(JSON.stringify({
              rowNumber: 9,
              error: "Manager N Number is missing from row 9"
            }));
          }
        });
        test("No matching manager object, rejects with message", async () => {
          const row = {
            rowNumber: 9,
            "Manager N Number": "n1111111"
          };
          try {
            await managerValidateFunction(row, initialTestState);
          } catch (e) {
            expect(e).toEqual(JSON.stringify({
              rowNumber: 9,
              error: "Manager N Number is not a valid option for row 9"
            }));
            expect(row).toEqual({
              ...row,
              attributes: {}
            });
          }
        });
        test("Good manager match, resolves with message", async () => {
          const row = {
            rowNumber: 7,
            "Manager N Number": "n1234567"
          };
          const results = await managerValidateFunction(row, initialTestState);
          expect(results).toEqual("Manager N Number Valid for row 7");
          expect(row).toEqual({
            ...row,
            attributes: {
              manager_first_name: "John",
              manager_last_name: "Wick",
              manager_n_number: "n1234567",
              manager: "John Wick"
            }
          });
        });
        test("attributes is already on successful row, returns successful response, resolves with field is valid message", async () => {
          const existingAttributes = {
            caller_id: "16038518200"
          };
          const row = {
            rowNumber: 3,
            "Manager N Number": "n1234567",
            attributes: existingAttributes
          };
          const result = await managerValidateFunction(row, initialTestState);
          expect(result).toEqual("Manager N Number Valid for row 3");
          expect(row).toEqual({
            ...row,
            attributes: {
              manager_first_name: "John",
              manager_last_name: "Wick",
              manager_n_number: "n1234567",
              manager: "John Wick",
              ...existingAttributes
            }
          });
        });
      });
      describe("options", () => {
        const optionsFunction = FIELDS.MANAGER_N_NUMBER.options;
        test("returns the profile id options", () => {
          const options = optionsFunction(initialTestState);
          expect(options).toEqual([
            "n1234567",
            "n7454853"
          ]);
        });
      });
    });
    describe("DEFAULT_SKILLS", () => {
      describe("validateFunction", () => {
        const defaultSkillValidation = FIELDS.DEFAULT_SKILLS.validateFunction;
        test("No default skill field provided, resolve with skipping message", async () => {
          const result = await defaultSkillValidation({ rowNumber: 5 }, initialTestState);
          expect(result).toEqual("Default Skills is empty but not required. Skipping validation for row 5");
        });
        test("No default skills provided, resolve with skipping message", async () => {
          const row = {
            rowNumber: 5,
            "Default Skills": ""
          };
          const result = await defaultSkillValidation(row, initialTestState);
          expect(result).toEqual("Default Skills is empty but not required. Skipping validation for row 5");
          expect(row).toEqual({
            ...row,
            attributes: {
              default_skills: {
                levels: {},
                skills: []
              }
            }
          });
        });
        test("Default skills provided, but contain skill in wrong format with level not a number, reject with message", async () => {
          try {
            await defaultSkillValidation({
              rowNumber: 5,
              "Default Skills": "aisgL1:boo, lscOBDialer1:1"
            }, initialTestState);
          } catch (e) {
            expect(e).toEqual(JSON.stringify({
              rowNumber: 5,
              error: "Default Skills Errors found for row 5 aisgL1 does not support Level boo."
            }));
          }
        });
        test("Default skills provided, but contain skills that don't exist, reject with message", async () => {
          try {
            await defaultSkillValidation({
              rowNumber: 5,
              "Default Skills": "aisgL1, fakeSkill"
            }, initialTestState);
          } catch (e) {
            expect(e).toEqual(JSON.stringify({
              rowNumber: 5,
              error: "Default Skills Errors found for row 5 fakeSkill is not an available skill "
            }));
          }
        });
        test("Default skills provided, but contain skills with levels that don't exist, reject with message", async () => {
          try {
            await defaultSkillValidation({
              rowNumber: 5,
              "Default Skills": "aisgL1:3, lscOBDialer1:2"
            }, initialTestState);
          } catch (e) {
            expect(e).toEqual(JSON.stringify({
              rowNumber: 5,
              error: "Default Skills Errors found for row 5 aisgL1 does not support Level 3."
            }));
          }
        });
        test("Default skills provided, all skills look good, resolve with message", async () => {
          const row = {
            rowNumber: 5,
            "Default Skills": "aisgL1, lscOBDialer1:2"
          };
          const result = await defaultSkillValidation(row, initialTestState);
          expect(result).toEqual("Default Skills valid for row 5");
          expect(row).toEqual({
            ...row,
            attributes: {
              default_skills: {
                levels: { lscOBDialer1: 2 },
                skills: [
                  "aisgL1", "lscOBDialer1"
                ]
              }
            }
          });
        });
        test("attributes is already on successful row, returns successful response, resolves with field is valid message", async () => {
          const existingAttributes = {
            caller_id: "16038518200"
          };
          const row = {
            rowNumber: 3,
            "Default Skills": "aisgL1, lscOBDialer1:2",
            attributes: existingAttributes
          };
          const result = await defaultSkillValidation(row, initialTestState);
          expect(result).toEqual("Default Skills valid for row 3");
          expect(row).toEqual({
            ...row,
            attributes: {
              default_skills: {
                levels: { lscobdialer1: 2 },
                skills: [
                  "aisgl1", "lscobdialer1"
                ]
              },
              ...existingAttributes
            }
          });
        });
        test("throws an exception when an invalid state is provided", async () => {
          const row = {
            rowNumber: 5,
            "Default Skills": "aisgL1, lscOBDialer1:2"
          };
          const corruptedState = Object.assign({}, initialTestState);
          delete corruptedState.skillContext;
          try {
            await defaultSkillValidation(row, corruptedState);
          } catch (err) {
            expect(err).toBe(JSON.stringify({
              rowNumber: 5,
              error: "Default Skills Errors found for row 5 Cannot read properties of undefined (reading 'skills')"
            }));
          }
        });
      });
      describe("options", () => {
        const optionsFunction = FIELDS.DEFAULT_SKILLS.options;
        test("returns the profile id options", () => {
          const options = optionsFunction(initialTestState);
          expect(options).toEqual([
            "aisgL1",
            "bscCbsL2",
            "bscCommisssions Available levels: 1,2,3,4,5,6,7",
            "lscOBDialer1 Available levels: 1,2,3",
            "lscUSAA"
          ]);
        });
      });
    });
    describe("EXTENSION", () => {
      describe("validateFunction", () => {
        const exetensionValidateFunction = FIELDS.EXTENSION.validateFunction;
        test("No matching extension field, rejects with message", async () => {
          const row = { rowNumber: 6 };
          const result = await exetensionValidateFunction(row, initialTestState);
          expect(result).toEqual("No Extension set for row 6");
          expect(row).toEqual({
            ...row,
            attributes: {}
          });
        });
        test("New extension is true, generate Extension fails, rejects with message", async () => {
          generateExtension.mockRejectedValueOnce("boo");
          try {
            await exetensionValidateFunction({
              rowNumber: 6,
              "Extension": "Y"
            }, initialTestState);
          } catch (e) {
            expect(e).toEqual(JSON.stringify({
              rowNumber: 6,
              error: "Unable to generate Extension for row 6"
            }));
          }
        });
        test("New extension is true, generate Extension succeeds, resolves with message", async () => {
          generateExtension.mockResolvedValueOnce("123");
          const row = {
            rowNumber: 6,
            "Extension": "Y"
          };
          const result = await exetensionValidateFunction(row, initialTestState);
          expect(result).toEqual("Extension 123 set for row 6");
          expect(row).toEqual({
            ...row,
            attributes: {
              extension: 123
            }
          });
        });
        test("attributes is already on successful row, returns successful response, resolves with field is valid message", async () => {
          generateExtension.mockResolvedValueOnce("123");
          const existingAttributes = {
            caller_id: "16038518200"
          };
          const row = {
            rowNumber: 6,
            "Extension": "Y",
            attributes: existingAttributes
          };
          const result = await exetensionValidateFunction(row, initialTestState);
          expect(result).toEqual("Extension 123 set for row 6");
          expect(row).toEqual({
            ...row,
            attributes: {
              extension: 123,
              ...existingAttributes
            }
          });
        });
        test("New extension is false, field is n, resolves with skip message", async () => {
          const row = {
            rowNumber: 6,
            "Extension": "n"
          };
          const result = await exetensionValidateFunction(row, initialTestState);
          expect(result).toEqual("Extension skipped for row 6.");
          expect(row).toEqual({
            ...row,
            attributes: {}
          });
        });
        test("New extension is false, field returns NaN on parseInt, rejects with format message", async () => {
          try {
            await exetensionValidateFunction({
              rowNumber: 6,
              "Extension": "345H"
            }, initialTestState);
          } catch (e) {
            expect(e).toEqual(JSON.stringify({
              rowNumber: 6,
              error: "Extension 345h is in the wrong format for row 6"
            }));
          }
        });
        test("New extension is false, extension is taken, rejects with message", async () => {
          try {
            await exetensionValidateFunction({
              rowNumber: 6,
              "Extension": 1234
            }, initialTestState);
          } catch (e) {
            expect(e).toEqual(JSON.stringify({
              rowNumber: 6,
              error: "Extension 1234 is already taken for row 6"
            }));
          }
        });
        test("New extension is false, error is thrown searching state, rejects with message", async () => {
          try {
            await exetensionValidateFunction({
              rowNumber: 6,
              "Extension": 1234
            }, { workerContext: { workers: null }});
          } catch (e) {
            expect(e).toEqual(JSON.stringify({
              rowNumber: 6,
              error: "Extension 1234 error thrown validating extention for row 6"
            }));
          }
        });
        test("New extension is false, extension is not taken, resolves with message", async () => {
          const result = await exetensionValidateFunction({
            rowNumber: 6,
            "Extension": 876
          }, initialTestState);
          expect(result).toEqual("Extension 876 set for row 6");
        });
      });
    });
    describe("DID_USER", () => {
      describe("validateFunction", () => {
        const DIDUserValidateFunction = FIELDS.DID_USER.validateFunction;
        test("Did user field is 'Y', resolves", async () => {
          const row = {
            rowNumber: 7,
            "Did User": "Y"
          };
          const result = await DIDUserValidateFunction(row, initialTestState);
          expect(result).toEqual("Did User y set for row 7");
        });
        test("Did user field is 'N', resolves", async () => {
          const result = await DIDUserValidateFunction({
            rowNumber: 7,
            "Did User": "N"
          }, initialTestState);
          expect(result).toEqual("Did User n set for row 7");
        });
        test("Field is not a valid string", async () => {
          try {
            await DIDUserValidateFunction({
              rowNumber: 7,
              "Did User": 56
            }, initialTestState);
          } catch (e) {
            expect(e).toEqual(JSON.stringify({
              rowNumber: 7,
              error: "Did User needs to be 'Y' or 'N' for row 7"
            }));
          }
        });
      });

    });
    describe("DIRECT_DIAL_NUMBER", () => {
      describe("validateFunction", () => {
        const DIDNumberValidateFunction = FIELDS.DIRECT_DIAL_NUMBER.validateFunction;
        test("No matching didField field, rejects with message", async () => {
          try {
            await DIDNumberValidateFunction({
              rowNumber: 4,
              "boo": "what"
            });
          } catch (e) {
            expect(e).toEqual(JSON.stringify({
              rowNumber: 4,
              error: "Did User needs to be 'Y' or 'N' for row 4"
            }));
          }
        });
        test("didField field is not a string, rejects with message", async () => {
          try {
            await DIDNumberValidateFunction({
              rowNumber: 4,
              "Did User": 12
            });
          } catch (e) {
            expect(e).toEqual(JSON.stringify({
              rowNumber: 4,
              error: "Did User needs to be 'Y' or 'N' for row 4"
            }));
          }
        });
        test("didField field is not a Y or N, rejects with message", async () => {
          try {
            await DIDNumberValidateFunction({
              rowNumber: 4,
              "Did User": "boo"
            });
          } catch (e) {
            expect(e).toEqual(JSON.stringify({
              rowNumber: 4,
              error: "Did User needs to be 'Y' or 'N' for row 4"
            }));
          }
        });
        test("didField field is N, rejects with message", async () => {
          try {
            await DIDNumberValidateFunction({
              rowNumber: 4,
              "Did User": "N",
              "Direct Dial Number": "1231231234"
            });
          } catch (e) {
            expect(e).toEqual(JSON.stringify({
              rowNumber: 4,
              error: "Did User field is 'N', Direct Dial Number is not applicable for row 4"
            }));
          }
        });
        test("didField field is N, No DID Number provided resolves with skip mesesage", async () => {
          const result = await DIDNumberValidateFunction({
            rowNumber: 4,
            "Did User": "N"
          });
          expect(result).toEqual("Direct Dial Number skipped for Non DID user for row 4");
        });
        test("didField field is N, DID Number is empty resolves with skip mesesage", async () => {
          const row = {
            rowNumber: 4,
            "Did User": "N",
            "Direct Dial Number": ""
          };
          const result = await DIDNumberValidateFunction(row);
          expect(result).toEqual("Direct Dial Number skipped for Non DID user for row 4");
          expect(row).toEqual({
            ...row,
            attributes: {}
          });
        });
        test("didField field is Y but direct dial number not provided, rejects with message", async () => {
          const row = {
            rowNumber: 4,
            "Did User": "Y"
          };
          try {
            await DIDNumberValidateFunction(row);
          } catch (e) {
            expect(e).toEqual(JSON.stringify({
              rowNumber: 4,
              error: "Direct Dial Number is required when DID user is 'Y' for row 4"
            }));
            expect(row).toEqual({
              ...row,
              attributes: {}
            });
          }
        });
        test("didField field is Y but direct dial number in wrong format, rejects with message", async () => {
          const row = {
            rowNumber: 4,
            "Did User": "Y",
            "Direct Dial Number": "31234"
          };
          try {
            await DIDNumberValidateFunction(row);
          } catch (e) {
            expect(e).toEqual(JSON.stringify({
              rowNumber: 4,
              error: "Direct Dial Number is not in the correct format for row 4"
            }));
            expect(row).toEqual({
              ...row,
              attributes: {}
            });
          }
        });
        test("attributes is already on successful row, returns successful response, resolves with field is valid message", async () => {
          const existingAttributes = {
            manager: "bob hill"
          };
          const row = {
            rowNumber: 6,
            "Did User": "Y",
            "Direct Dial Number": "6035556565",
            attributes: existingAttributes
          };
          const result = await DIDNumberValidateFunction(row, initialTestState);
          expect(result).toEqual("Direct Dial Number 6035556565 set for row 6");
          expect(row).toEqual({
            ...row,
            did: "+16035556565",
            attributes: {
              caller_id: "+16035556565",
              ...existingAttributes
            }
          });
        });
        test("didField field is Y, direct dial number in correct format, resolves with message", async () => {
          const row = {
            rowNumber: 4,
            "Did User": "Y",
            "Direct Dial Number": "6035556565"
          };
          const results = await DIDNumberValidateFunction(row);
          expect(results).toEqual("Direct Dial Number 6035556565 set for row 4");
          expect(row).toEqual({
            ...row,
            did: "+16035556565",
            attributes: {
              caller_id: "+16035556565"
            }
          });
        });
      });

    });
    describe("ZERO_OUT_ENABLED", () => {
      describe("validateFunction", () => {
        const ZeroOutEnabledValidateFunction = FIELDS.ZERO_OUT_ENABLED.validateFunction;
        test("No matching didField field, rejects with message", async () => {
          try {
            await ZeroOutEnabledValidateFunction({
              rowNumber: 4,
              "boo": "what"
            }, initialTestState);
          } catch (e) {
            expect(e).toEqual(JSON.stringify({
              rowNumber: 4,
              error: "Did User needs to be 'Y' or 'N' for row 4"
            }));
          }
        });
        test("didField field is not a string, rejects with message", async () => {
          try {
            await ZeroOutEnabledValidateFunction({
              rowNumber: 4,
              "Did User": 12
            }, initialTestState);
          } catch (e) {
            expect(e).toEqual(JSON.stringify({
              rowNumber: 4,
              error: "Did User needs to be 'Y' or 'N' for row 4"
            }));
          }
        });
        test("didField field is not a Y or N, rejects with message", async () => {
          try {
            await ZeroOutEnabledValidateFunction({
              rowNumber: 4,
              "Did User": "boo"
            }, initialTestState);
          } catch (e) {
            expect(e).toEqual(JSON.stringify({
              rowNumber: 4,
              error: "Did User needs to be 'Y' or 'N' for row 4"
            }));
          }
        });
        test("didField field is N, rejects with message", async () => {
          try {
            await ZeroOutEnabledValidateFunction({
              rowNumber: 4,
              "Did User": "N",
              "Zero Out Enabled": "Y"
            }, initialTestState);
          } catch (e) {
            expect(e).toEqual(JSON.stringify({
              rowNumber: 4,
              error: "Did User field is 'N', Zero Out Enabled is not applicable for row 4"
            }));
          }
        });
        test("didField field is Y, zero out enabled is not a string, rejects with message", async () => {
          try {
            await ZeroOutEnabledValidateFunction({
              rowNumber: 4,
              "Did User": "Y",
              "Zero Out Enabled": 3
            }, initialTestState);
          } catch (e) {
            expect(e).toEqual(JSON.stringify({
              rowNumber: 4,
              error: "Zero Out Enabled needs to be needs to be 'Y' or 'N' if DID user is 'Y' for 4"
            }));
          }
        });
        test("didField field is Y, zero out enabled is not provided, rejects with required message", async () => {
          try {
            await ZeroOutEnabledValidateFunction({
              rowNumber: 4,
              "Did User": "Y",
              "Zero Out Enabled": ""
            }, initialTestState);
          } catch (e) {
            expect(e).toEqual(JSON.stringify({
              rowNumber: 4,
              error: "Zero Out Enabled is required when DID user is 'Y' for row 4"
            }));
          }
        });
        test("didField field is Y, zero out enabled is not a Y or N, rejects with message", async () => {
          const row = {
            rowNumber: 4,
            "Did User": "Y",
            "Zero Out Enabled": "hi"
          };
          try {
            await ZeroOutEnabledValidateFunction(row, initialTestState);
          } catch (e) {
            expect(e).toEqual(JSON.stringify({
              rowNumber: 4,
              error: "Zero Out Enabled needs to be needs to be 'Y' or 'N' if DID user is 'Y' for 4"
            }));
          }
        });
        test("didField field is Y, zero out enabled is N, resolves with message", async () => {
          const row = {
            rowNumber: 4,
            "Did User": "Y",
            "Zero Out Enabled": "N"
          };
          const result = await ZeroOutEnabledValidateFunction(row, initialTestState);
          expect(result).toEqual("Zero Out Enabled n set for row 4");
          expect(row).toEqual({
            ...row,
            zeroOutEnabled: false
          });
        });
        test("didField field is Y, zero out enabled is Y, profile id is wrong format, rejects with message", async () => {
          try {
            await ZeroOutEnabledValidateFunction({
              rowNumber: 4,
              "Did User": "Y",
              "Zero Out Enabled": "Y",
              "Profile Id": "boo"
            }, initialTestState);
          } catch (e) {
            expect(e).toEqual(JSON.stringify({
              rowNumber: 4,
              error: "Unable to set Zero Out Enabled. Incorrect format for Profile Id for row 4"
            }));
          }
        });
        test("didField field is Y, zero out enabled is Y, profile id is null, rejects with message", async () => {
          try {
            await ZeroOutEnabledValidateFunction({
              rowNumber: 4,
              "Did User": "Y",
              "Zero Out Enabled": "Y",
              "Profile Id": null
            }, initialTestState);
          } catch (e) {
            expect(JSON.parse(e).rowNumber).toEqual(4);
            expect(JSON.parse(e).error).toContain("Unable to set Zero Out Enabled. Incorrect format for Profile Id for row 4");
          }
        });
        test("didField field is Y, zero out enabled is Y, error is thrown, rejects with message", async () => {
          try {
            await ZeroOutEnabledValidateFunction({
              rowNumber: 4,
              "Did User": "Y",
              "Zero Out Enabled": "Y",
              "Profile Id": "boo"
            }, { profileContext: null });
          } catch (e) {
            expect(JSON.parse(e).rowNumber).toEqual(4);
            expect(JSON.parse(e).error).toContain("Error thrown setting Zero Out Enabled for row 4.");
          }
        });
        test("didField field is Y, zero out enabled is Y, resolves with message", async () => {
          const row = {
            rowNumber: 4,
            "Did User": "Y",
            "Zero Out Enabled": "Y",
            "Profile Id": 2
          };
          const result = await ZeroOutEnabledValidateFunction(row, initialTestState);
          expect(result).toEqual("Zero Out Enabled whateverOverflowSkill set for row 4");
          expect(row).toEqual({
            ...row,
            zeroOutEnabled: true,
            attributes: {
              routing: {
                skills: ["whateveroverflowskill"],
                levels: {}
              }
            }
          });
        });
        test("didField field is Y, zero out enabled is Y, profile has no overflow skill, resolves with message", async () => {
          const row = {
            rowNumber: 4,
            "Did User": "Y",
            "Zero Out Enabled": "Y",
            "Profile Id": 1
          };
          const result = await ZeroOutEnabledValidateFunction(row, initialTestState);
          expect(result).toEqual("Zero Out Enabled set to true but no overflow skill found on profile for row 4");
          expect(row).toEqual({
            ...row,
            zeroOutEnabled: true
          });
        });
        test("attributes is already on successful row, returns successful response, resolves with field is valid message", async () => {
          const existingAttributes = {
            manager: "bob hill"
          };
          const row = {
            rowNumber: 6,
            "Did User": "Y",
            "Zero Out Enabled": "Y",
            "Profile Id": 2,
            attributes: existingAttributes
          };
          const result = await ZeroOutEnabledValidateFunction(row, initialTestState);
          expect(result).toEqual("Zero Out Enabled whateverOverflowSkill set for row 6");
          expect(row).toEqual({
            ...row,
            zeroOutEnabled: true,
            attributes: {
              routing: {
                skills: ["whateveroverflowskill"],
                levels: {}
              },
              ...existingAttributes
            }
          });
        });
        test("didField field is N, zero out enabled is not provided, resolves with skip message", async () => {
          const row = {
            rowNumber: 4,
            "Did User": "N",
            "Zero Out Enabled": "",
            "Profile Id": 2
          };
          const result = await ZeroOutEnabledValidateFunction(row, initialTestState);
          expect(result).toEqual("Zero Out Enabled skipped for Non DID user for row 4");
          expect(row).toEqual({
            rowNumber: 4,
            "Did User": "N",
            "Zero Out Enabled": "",
            "Profile Id": 2
          });
        });
        test("didField field is N, zero out enabled is N, resolves with skip message", async () => {
          const row = {
            rowNumber: 4,
            "Did User": "N",
            "Zero Out Enabled": "N",
            "Profile Id": 2
          };
          const result = await ZeroOutEnabledValidateFunction(row, initialTestState);
          expect(result).toEqual("Zero Out Enabled skipped for Non DID user for row 4");
          expect(row).toEqual({
            rowNumber: 4,
            "Did User": "N",
            "Zero Out Enabled": "N",
            "Profile Id": 2
          });
        });
      });

    });
    describe("SELF_SERVICE_IND", () => {
      describe("validateFunction", () => {
        const selfServiceIndValidateFunction = FIELDS.SELF_SERVICE_IND.validateFunction;
        test("No matching didField field, rejects with message", async () => {
          try {
            await selfServiceIndValidateFunction({
              rowNumber: 4,
              "boo": "what"
            }, initialTestState);
          } catch (e) {
            expect(e).toEqual(JSON.stringify({
              rowNumber: 4,
              error: "Did User needs to be 'Y' or 'N' for row 4"
            }));
          }
        });
        test("didField field is not a string, rejects with message", async () => {
          try {
            await selfServiceIndValidateFunction({
              rowNumber: 4,
              "Did User": 12
            }, initialTestState);
          } catch (e) {
            expect(e).toEqual(JSON.stringify({
              rowNumber: 4,
              error: "Did User needs to be 'Y' or 'N' for row 4"
            }));
          }
        });
        test("didField field is not a Y or N, rejects with message", async () => {
          try {
            await selfServiceIndValidateFunction({
              rowNumber: 4,
              "Did User": "boo"
            }, initialTestState);
          } catch (e) {
            expect(e).toEqual(JSON.stringify({
              rowNumber: 4,
              error: "Did User needs to be 'Y' or 'N' for row 4"
            }));
          }
        });
        test("didField field is N, rejects with message", async () => {
          try {
            await selfServiceIndValidateFunction({
              rowNumber: 4,
              "Did User": "N",
              "Self Service Indicator": "Y"
            }, initialTestState);
          } catch (e) {
            expect(e).toEqual(JSON.stringify({
              rowNumber: 4,
              error: "Did User field is 'N', Self Service Indicator is not applicable for row 4"
            }));
          }
        });
        test("didField field is Y, self service indicator is not a string, rejects with message", async () => {
          try {
            await selfServiceIndValidateFunction({
              rowNumber: 4,
              "Did User": "Y",
              "Self Service Indicator": 3
            }, initialTestState);
          } catch (e) {
            expect(e).toEqual(JSON.stringify({
              rowNumber: 4,
              error: "Self Service Indicator needs to be needs to be 'Y' or 'N' if DID user is 'Y' for 4"
            }));
          }
        });
        test("didField field is Y, self service indicator is not provided, rejects with required message", async () => {
          try {
            await selfServiceIndValidateFunction({
              rowNumber: 4,
              "Did User": "Y",
              "Self Service Indicator": ""
            }, initialTestState);
          } catch (e) {
            expect(e).toEqual(JSON.stringify({
              rowNumber: 4,
              error: "Self Service Indicator is required when DID user is 'Y' for row 4"
            }));
          }
        });
        test("didField field is Y, self service indicator is not a Y or N, rejects with message", async () => {
          const row = {
            rowNumber: 4,
            "Did User": "Y",
            "Self Service Indicator": "hi"
          };
          try {
            await selfServiceIndValidateFunction(row, initialTestState);
          } catch (e) {
            expect(e).toEqual(JSON.stringify({
              rowNumber: 4,
              error: "Self Service Indicator needs to be needs to be 'Y' or 'N' if DID user is 'Y' for 4"
            }));
          }
        });
        test("didField field is Y, self service indicator is N, resolves with message", async () => {
          const row = {
            rowNumber: 4,
            "Did User": "Y",
            "Self Service Indicator": "N"
          };
          const result = await selfServiceIndValidateFunction(row, initialTestState);
          expect(result).toEqual("Self Service Indicator n set for row 4");
          expect(row).toEqual({
            ...row,
            selfServiceInd: false
          });
        });
        test("didField field is Y,self service indicator is Y, profile id is valid format/value, error is thrown, rejects with message", async () => {
          try {
            await selfServiceIndValidateFunction({
              rowNumber: 4,
              "Did User": "Y",
              "Self Service Indicator": "Y",
              "Profile Id": 40
            }, initialTestState);
          } catch (e) {
            expect(JSON.parse(e).rowNumber).toEqual(4);
            expect(JSON.parse(e).error).toContain("Error thrown setting Self Service Indicator for row 4.");
          }
        });
        test("didField field is Y,self service indicator is Y, Profile Id is invalid format, rejects with message", async () => {
          try {
            await selfServiceIndValidateFunction({
              rowNumber: 4,
              "Did User": "Y",
              "Self Service Indicator": "Y",
              "Profile Id": "thirty nine"
            }, initialTestState);
          } catch (e) {
            expect(JSON.parse(e).rowNumber).toEqual(4);
            expect(JSON.parse(e).error).toContain("Unable to set Self Service Indicator. Incorrect format for Profile Id for row 4");
          }
        });
        test("didField field is Y,self service indicator is Y, Profile Id is invalid value, rejects with message", async () => {
          try {
            await selfServiceIndValidateFunction({
              rowNumber: 4,
              "Did User": "Y",
              "Self Service Indicator": "Y",
              "Profile Id": 38
            }, initialTestState);
          } catch (e) {
            expect(JSON.parse(e).rowNumber).toEqual(4);
            expect(JSON.parse(e).error).toContain("Unable to set Self Service Indicator. Incorrect value for Profile Id for row 4 - need Profile Id to be 39 or above");
          }
        });
        test("didField field is Y, self service Indicator is Y, profile id is valid format/value resolves with message", async () => {
          const row = {
            rowNumber: 4,
            "Did User": "Y",
            "Self Service Indicator": "Y",
            "Profile Id": 39
          };
          const result = await selfServiceIndValidateFunction(row, initialTestState);
          expect(result).toEqual("Self Service Indicator y set for row 4");
          expect(row).toEqual({
            ...row,
            selfServiceInd: true
          });
        });
        test("didField field is N, self service indicator is not provided, resolves with skip message", async () => {
          const row = {
            rowNumber: 4,
            "Did User": "N",
            "Self Service Indicator": ""
          };
          const result = await selfServiceIndValidateFunction(row, initialTestState);
          expect(result).toEqual("Self Service Indicator skipped for Non DID user for row 4");
          expect(row).toEqual({
            rowNumber: 4,
            "Did User": "N",
            "Self Service Indicator": ""
          });
        });
        test("didField field is N, self service indicator is N, resolves with skip message", async () => {
          const row = {
            rowNumber: 4,
            "Did User": "N",
            "Self Service Indicator": "N"
          };
          const result = await selfServiceIndValidateFunction(row, initialTestState);
          expect(result).toEqual("Self Service Indicator skipped for Non DID user for row 4");
          expect(row).toEqual({
            rowNumber: 4,
            "Did User": "N",
            "Self Service Indicator": "N"
          });
        });
      });
    });
    describe("OUTGOING_NUMBER", () => {
      describe("validateFunction", () => {
        const outgoingNumberValidateFunction = FIELDS.OUTGOING_NUMBER.validateFunction;
        test("Invalid value provided for Did User field, rejects with message", async () => {
          const row = {
            rowNumber: 9,
            "Did User": "booya",
            "Outgoing Number": "1231231234"
          };
          try {
            await outgoingNumberValidateFunction(row, initialTestState);
          } catch (e) {
            expect(e).toEqual(JSON.stringify({
              rowNumber: 9,
              error: "Did User needs to be 'Y' or 'N' for row 9"
            }));
            expect(row).toEqual({
              ...row,
              attributes: {}
            });
          }
        });
        test("DidUser is true, Outgoing number is provided, reject with message", async () => {
          try {
            await outgoingNumberValidateFunction({
              rowNumber: 9,
              "Did User": "Y",
              "Outgoing Number": "1231231234"
            }, initialTestState);
          } catch (e) {
            expect(e).toEqual(JSON.stringify({
              rowNumber: 9,
              error: "Did User field is 'Y', Outgoing Number is not applicable for row 9"
            }));
          }
        });
        test("DidUser is true, Outgoing number is not provided, resolve with message", async () => {
          const row = {
            rowNumber: 9,
            "Did User": "Y",
            "Outgoing Number": ""
          };
          const result = await outgoingNumberValidateFunction(row, initialTestState);
          expect(result).toEqual("Outgoing Number skipped for DID user for row 9");
          expect(row).toEqual({
            ...row,
            attributes: {}
          });
        });
        test("Did User is false, no Outgoing number provided, rejects with message", async () => {
          try {
            await outgoingNumberValidateFunction({
              rowNumber: 9,
              "Did User": "N",
              "Outgoing Number": ""
            }, initialTestState);
          } catch (e) {
            expect(e).toEqual(JSON.stringify({
              rowNumber: 9,
              error: "Outgoing Number is required when DID user is 'N' for row 9"
            }));
          }
        });
        test("DidUser is false, and Outgoing number is provided, getE164Number is successful, resolves with message", async () => {
          const row = {
            rowNumber: 9,
            "Did User": "N",
            "Outgoing Number": "6035554545"
          };
          const result = await outgoingNumberValidateFunction(row, initialTestState);
          expect(result).toEqual("Outgoing Number 6035554545 set for row 9");
          expect(row).toEqual({
            ...row,
            attributes: {
              caller_id: "+16035554545"
            }
          });
        });
        test("attributes is already on successful row, returns successful response, resolves with field is valid message", async () => {
          const existingAttributes = {
            manager: "bob hill"
          };
          const row = {
            rowNumber: 6,
            "Did User": "N",
            "Outgoing Number": "6035554545",
            attributes: existingAttributes
          };
          const result = await outgoingNumberValidateFunction(row, initialTestState);
          expect(result).toEqual("Outgoing Number 6035554545 set for row 6");
          expect(row).toEqual({
            ...row,
            attributes: {
              caller_id: "+16035554545",
              ...existingAttributes
            }
          });
        });
        test("DidUser is false, Outgoing number is provided, but is not valid, rejects with message", async () => {
          try {
            await outgoingNumberValidateFunction({
              rowNumber: 9,
              "Did User": "N",
              "Outgoing Number": "74"
            }, initialTestState);
          } catch (e) {
            expect(e).toEqual(JSON.stringify({
              rowNumber: 9,
              error: "Outgoing Number is not in the correct format for row 9"
            }));
          }
        });
      });
    });
    describe("ROUTING_TEAM", () => {
      describe("validate function", () => {
        const routingTeamValidateFunction = FIELDS.ROUTING_TEAM.validateFunction;
        describe("profile is found in matching profiles", () => {
          describe("field is null", () => {
            const row = {
              rowNumber: 2,
              "Routing Team": null,
              "Profile Id": 2
            };
            test("return rejected promise", async () => {
              try {
                await routingTeamValidateFunction(row, initialTestState);
              } catch (err) {
                expect(err).toBe(JSON.stringify({
                  rowNumber: 2,
                  error: "Routing Team is missing for row 2"
                }));
              }
            });
          });
          describe("field is not valid for profile", () => {
            const row = {
              rowNumber: 2,
              "Routing Team": "Butts",
              "Profile Id": 2
            };
            test("return rejected promise", async () => {
              try {
                await routingTeamValidateFunction(row, initialTestState);
              } catch (err) {
                expect(err).toBe(JSON.stringify({
                  rowNumber: 2,
                  error: "Routing Team is not a valid option for profile for row 2"
                }));
              }
            });
          });
          describe("field is valid", () => {
            const row = {
              rowNumber: 2,
              "Routing Team": "licencedCsC",
              "Profile Id": 2
            };
            test("return resolved promise & update row", async () => {
              const res = await routingTeamValidateFunction(row, initialTestState);
              expect(res).toBe("Routing Team Valid for row 2");
              expect(row).toEqual({
                ...row,
                attributes: {
                  routing_team: "licencedCsC"
                }
              });
            });
          });
        });
        describe("profile not found and field is populated", () => {
          const row = {
            rowNumber: 2,
            "Routing Team": "Hi Im Here",
            "Profile Id": 800
          };
          test("return rejected promise", async () => {
            try {
              await routingTeamValidateFunction(row, initialTestState);
            } catch (err) {
              expect(err).toBe(JSON.stringify({
                rowNumber: 2,
                error: "Routing Team is not applicable to profile id 800 for row 2"
              }));
            }
          });
        });
        describe("profile not found and field is null", () => {
          const row = {
            rowNumber: 2,
            "Routing Team": "",
            "Profile Id": 1
          };
          test("return resolved promise", async () => {
            const res = await routingTeamValidateFunction(row, initialTestState);
            expect(res).toBe("Bypassing Routing Team. Unapplicable for profile id 1 for row 2");
            expect(row).toEqual(row);
          });
        });
        describe("attributes is already on successful row", () => {
          const existingAttributes = {
            caller_id: "16038518200"
          };
          const row = {
            rowNumber: 1,
            "Routing Team": "licencedCSC",
            "Profile Id": 2,
            attributes: existingAttributes
          };
          test("resolves with field is valid message", async () => {
            const result = await routingTeamValidateFunction(row, initialTestState);
            expect(result).toEqual("Routing Team Valid for row 1");
            expect(row).toEqual({
              ...row,
              attributes: existingAttributes
            });
          });
        });
      });
      describe("options", () => {
        const optionsFunction = FIELDS.ROUTING_TEAM.options;
        test("returns the profiles with available Routing Teams", () => {
          const options = optionsFunction(initialTestState);
          expect(options).toEqual([
            "Profile 2: licencedCSC"
          ]);
        });
      });
    });
    describe("WFM_ACTIVATE_EXTERNAL_LOGON", () => {
      describe("validate function", () => {
        const wfmActivateExternalLogonValidateFunction = FIELDS.WFM_ACTIVATE_EXTERNAL_LOGON.validateFunction;
        test("WFM Activate External Logon is missing, rejects with message", async () => {
          try {
            await wfmActivateExternalLogonValidateFunction({
              rowNumber: 4,
              "boo": "what"
            }, initialTestState);
          } catch (e) {
            expect(e).toEqual(JSON.stringify({
              rowNumber: 4,
              error: "WFM Activate External Logon must be Y or N for row 4"
            }));
          }
        });
        test("WFM Activate External Logon is not a string, rejects with message", async () => {
          try {
            await wfmActivateExternalLogonValidateFunction({
              rowNumber: 4,
              "WFM Activate External Logon": 13
            });
          } catch (e) {
            expect(e).toEqual(JSON.stringify({
              rowNumber: 4,
              error: "WFM Activate External Logon must be Y or N for row 4"
            }));
          }
        });
        test("WFM Activate External Logon is not Y or N, rejects with message", async () => {
          try {
            await wfmActivateExternalLogonValidateFunction({
              rowNumber: 4,
              "WFM Activate External Logon": "blep"
            });
          } catch (e) {
            expect(e).toEqual(JSON.stringify({
              rowNumber: 4,
              error: "WFM Activate External Logon must be Y or N for row 4"
            }));
          }
        });
        test("WFM Activate External Logon is Y, resolves with message", async () => {
          const row = {
            rowNumber: 4,
            "WFM Activate External Logon": "Y"
          };
          const result = await wfmActivateExternalLogonValidateFunction(row, initialTestState);
          expect(result).toEqual("WFM Activate External Logon y set for row 4");
          expect(row).toEqual({
            ...row,
            rowNumber: 4,
            "WFM Activate External Logon": "Y",
            wfmActivateExternalLogon: true
          });
        });
        test("WFM Activate External Logon is N, resolves with message", async () => {
          const row = {
            rowNumber: 4,
            "WFM Activate External Logon": "N"
          };
          const result = await wfmActivateExternalLogonValidateFunction(row, initialTestState);
          expect(result).toEqual("WFM Activate External Logon n set for row 4");
          expect(row).toEqual({
            ...row,
            rowNumber: 4,
            "WFM Activate External Logon": "N",
            wfmActivateExternalLogon: false
          });
        });
      });
    });
    describe("CALABRIO_SCOPE", () => {
      describe("validateFunction", () => {
        const calabrioScopeValidation = FIELDS.CALABRIO_SCOPE.validateFunction;
        test("No Calabrio Scope provided, resolve with skipped message", async () => {
          const row = {
            rowNumber: 9,
            "stuff": "boo"
          };
          const result = await calabrioScopeValidation(row, initialTestState);
          expect(result).toEqual("Calabrio Scope skipped for row 9");
          expect(row).toEqual({
            ...row,
            scope: {
              groups: [],
              teams: []
            }
          });
        });
        test("Calabrio scope .split is empty array, resolve with skipped message", async () => {
          const row = {
            rowNumber: 9,
            "Calabrio Scope": ""
          };
          const result = await calabrioScopeValidation(row, initialTestState);
          expect(result).toEqual("Calabrio Scope skipped for row 9");
          expect(row).toEqual({
            ...row,
            scope: {
              groups: [],
              teams: []
            }
          });
        });
        test("Calabrio scope has a value, no group or team found, rejects with message", async () => {
          const row = {
            rowNumber: 9,
            "Calabrio Scope": "notReal"
          };
          try {
            await calabrioScopeValidation(row, initialTestState);
          } catch (e) {
            expect(e).toEqual(JSON.stringify({
              rowNumber: 9,
              error: "notreal is not a valid group or team for row 9"
            }));
            expect(row).toEqual({
              ...row,
              scope: {
                groups: [],
                teams: []
              }
            });
          }
        });
        test("Calabrio scope has value, 1 group, resolves with message", async () => {
          const row = {
            rowNumber: 9,
            "Calabrio Scope": "Hawaii 50 Group"
          };
          const result = await calabrioScopeValidation(row, initialTestState);
          expect(result).toEqual("Calabrio Scope valid for row 9");
          expect(row).toEqual({
            ...row,
            scope: {
              groups: [100],
              teams: []
            }
          });
        });
        test("Calabrio scope has multiple good values, resolves with message", async () => {
          const row = {
            rowNumber: 9,
            "Calabrio Scope": "Hawaii 50 Group, Hawaii Team 50"
          };
          const result = await calabrioScopeValidation(row, initialTestState);
          expect(result).toEqual("Calabrio Scope valid for row 9");
          expect(row).toEqual({
            ...row,
            scope: {
              groups: [100],
              teams: [101]
            }
          });
        });
        test("Calabrio scope has multiple values, 1 bad value group, rejects with message", async () => {
          const row = {
            rowNumber: 9,
            "Calabrio Scope": "Hawaii 50 Group,fakefake"
          };
          try {
            await calabrioScopeValidation(row, initialTestState);
          } catch (e) {
            expect(e).toEqual(JSON.stringify({
              rowNumber: 9,
              error: "fakefake is not a valid group or team for row 9"
            }));
            expect(row).toEqual({
              ...row,
              scope: {
                groups: [100],
                teams: []
              }
            });
          }
        });
        test("Bad value for Calabrio scope, rejects with message", async () => {
          const row = {
            rowNumber: 9,
            "Calabrio Scope": 12
          };
          try {
            await calabrioScopeValidation(row, initialTestState);
          } catch (e) {
            expect(e).toEqual(JSON.stringify({
              rowNumber: 9,
              error: "12 is not a valid group or team for row 9"
            }));
            expect(row).toEqual({
              ...row,
              scope: {
                groups: [],
                teams: []
              }
            });
          }
        });
      });
      describe("options", () => {
        const optionsFunction = FIELDS.CALABRIO_SCOPE.options;
        test("returns the profile id options", () => {
          const options = optionsFunction(initialTestState);
          expect(options).toEqual([
            "FNOL Group",
            "Hawaii 50 Group",
            "No Teams Group"
          ]);
        });
      });
    });
    describe("CALABRIO_TEAM_CREATE", () => {
      describe("validateFunction", () => {
        const calabrioTeamValidation = FIELDS.CALABRIO_TEAM_CREATE.validateFunction;
        test("No Calabrio Team provided, reject with message", async () => {
          try {
            await calabrioTeamValidation({ rowNumber: 9 }, initialTestState);
          } catch (e) {
            expect(e).toEqual(JSON.stringify({
              rowNumber: 9,
              error: "Calabrio Team is missing from row 9"
            }));
          }
        });
        test("Calabrio Team already exists with groupId, reject with message", async () => {
          const row = {
            rowNumber: 9,
            "Calabrio Team": "Hawaii Team 50"
          };
          await calabrioTeamValidation(row, initialTestState);
          expect(row).toEqual(row);
        });
        test("Calabrio Team already exists with no groupId, reject with message", async () => {
          const row = {
            rowNumber: 9,
            "Calabrio Team": "Hawaii Team 50"
          };
          try {
            await calabrioTeamValidation(row, {
              ...initialTestState,
              calabrioContext: {
                groups: initialTestState.calabrioContext.groups,
                teams: [{
                  name: "Hawaii Team 50"
                }]
              }
            });
          } catch (e) {
            expect(e).toEqual(JSON.stringify({
              rowNumber: 9,
              error: "New Teams require a valid Calabrio Group for row 9"
            }));
          }
        });
        test("Calabrio Group is not a valid option", async () => {
          const row = {
            rowNumber: 9,
            "Calabrio Team": "New Team",
            "Calabrio Group": "Unknown Group"
          };
          try {
            await calabrioTeamValidation(row, initialTestState);
          } catch (e) {
            expect(e).toEqual(JSON.stringify({
              rowNumber: 9,
              error: "New Teams require a valid Calabrio Group for row 9"
            }));
          }
        });
        test("Calabrio Group is a valid option", async () => {
          const row = {
            rowNumber: 9,
            "Calabrio Team": "new TEam",
            "Calabrio Group": "FNOL Group"
          };
          await calabrioTeamValidation(row, initialTestState);
          expect(row).toEqual({
            rowNumber: 9,
            parentGroupId: 200,
            newTeam: true,
            "Calabrio Team": "New Team",
            "Calabrio Group": "FNOL Group"
          });
        });
      });
      describe("options", () => {
        const optionsFunction = FIELDS.CALABRIO_TEAM_CREATE.options;
        test("returns the profile id options", () => {
          const options = optionsFunction(initialTestState);
          expect(options).toEqual([
            "FNOL Team",
            "Hawaii Specialty Team",
            "Hawaii Team 50"
          ]);
        });
      });
    });
    describe("CALABRIO_TEAM", () => {
      describe("validateFunction", () => {
        const calabrioTeamValidation = FIELDS.CALABRIO_TEAM.validateFunction;
        test("No Calabrio Team provided, reject with message", async () => {
          try {
            await calabrioTeamValidation({ rowNumber: 9 }, initialTestState);
          } catch (e) {
            expect(e).toEqual(JSON.stringify({
              rowNumber: 9,
              error: "Calabrio Team is missing from row 9"
            }));
          }
        });
        test("Bad value for calabrio team, reject with message", async () => {
          try {
            await calabrioTeamValidation({
              rowNumber: 9,
              "Calabrio Team": "fake team"
            }, initialTestState);
          } catch (e) {
            expect(e).toEqual(JSON.stringify({
              rowNumber: 9,
              error: "Calabrio Team is not a valid option for row 9"
            }));
          }
        });
        test("No teamGroupId is found on the team, reject with message", async () => {
          const stateWithBadTeam = {
            calabrioContext: {
              teams: [
                {
                  parentGroupId: 100,
                  name: "Bad team"
                }
              ]
            }
          };
          try {
            await calabrioTeamValidation({
              rowNumber: 9,
              "Calabrio Team": "fake team"
            }, stateWithBadTeam);
          } catch (e) {
            expect(e).toEqual(JSON.stringify({
              rowNumber: 9,
              error: "Calabrio Team is not a valid option for row 9"
            }));
          }
        });
        test("Good Calabrio Team value, resolves with message", async () => {
          const row = {
            rowNumber: 9,
            "Calabrio Team": "Hawaii Team 50"
          };
          const result = await calabrioTeamValidation(row, initialTestState);
          expect(result).toEqual("Calabrio Team valid for row 9");
          expect(row).toEqual({
            ...row,
            groupId: 101
          });
        });
      });
      describe("options", () => {
        const optionsFunction = FIELDS.CALABRIO_TEAM.options;
        test("returns the profile id options", () => {
          const options = optionsFunction(initialTestState);
          expect(options).toEqual([
            "FNOL Team",
            "Hawaii Specialty Team",
            "Hawaii Team 50"
          ]);
        });
      });
    });
    describe("CALABRIO_GROUP", () => {
      describe("validateFunction", () => {
        const calabrioGroupValidation = FIELDS.CALABRIO_GROUP.validateFunction;
        test("No Calabrio Team provided, reject with message", async () => {
          try {
            await calabrioGroupValidation({ rowNumber: 9 }, initialTestState);
          } catch (e) {
            expect(e).toEqual(JSON.stringify({
              rowNumber: 9,
              error: "Calabrio Team is missing from row 9"
            }));
          }
        });
        test("Calabrio Team already exists with groupId, reject with message", async () => {
          const row = {
            rowNumber: 9,
            "Calabrio Team": "Hawaii Team 50"
          };
          await calabrioGroupValidation(row, initialTestState);
          expect(row).toEqual(row);
        });
        test("Calabrio Team already exists with no groupId, reject with message", async () => {
          const row = {
            rowNumber: 9,
            "Calabrio Team": "Hawaii Team 50"
          };
          try {
            await calabrioGroupValidation(row, {
              ...initialTestState,
              calabrioContext: {
                groups: initialTestState.calabrioContext.groups,
                teams: [{
                  name: "Hawaii Team 50"
                }]
              }
            });
          } catch (e) {
            expect(e).toEqual(JSON.stringify({
              rowNumber: 9,
              error: "New Teams require a valid Calabrio Group for row 9"
            }));
          }
        });
        test("Calabrio Group is not a valid option", async () => {
          const row = {
            rowNumber: 9,
            "Calabrio Team": "New Team",
            "Calabrio Group": "Unknown Group"
          };
          try {
            await calabrioGroupValidation(row, initialTestState);
          } catch (e) {
            expect(e).toEqual(JSON.stringify({
              rowNumber: 9,
              error: "New Teams require a valid Calabrio Group for row 9"
            }));
          }
        });
        test("Calabrio Group is a valid option", async () => {
          const row = {
            rowNumber: 9,
            "Calabrio Team": "New Team",
            "Calabrio Group": "FNOL Group"
          };
          await calabrioGroupValidation(row, initialTestState);
          expect(row).toEqual(row);
        });
      });
      describe("options", () => {
        const optionsFunction = FIELDS.CALABRIO_GROUP.options;
        test("returns the profile id options", () => {
          const options = optionsFunction(initialTestState);
          expect(options).toEqual([
            "FNOL Group",
            "Hawaii 50 Group",
            "No Teams Group"
          ]);
        });
      });
    });
    describe("CALABRIO_ROLES", () => {
      describe("validateFunction", () => {
        const calabrioRolesValidation = FIELDS.CALABRIO_ROLES.validateFunction;
        test("No Calabrio Role provided, rejects with message", async () => {
          try {
            await calabrioRolesValidation({ rowNumber: 1 }, initialTestState);
          } catch (e) {
            expect(e).toEqual(JSON.stringify({
              rowNumber: 1,
              error: "Calabrio Role is missing from row 1"
            }));
          }
        });
        test("Value for Calabrio Role .split has 0 length, reject with message", async () => {
          const row = {
            rowNumber: 1,
            "Calabrio Role": ""
          };
          try {
            await calabrioRolesValidation(row, initialTestState);
          } catch (e) {
            expect(e).toEqual(JSON.stringify({
              rowNumber: 1,
              error: "Calabrio Role is missing from row 1"
            }));
          }
        });
        test("Multiple roles provided, all are good, resolve with message", async () => {
          const row = {
            rowNumber: 1,
            "Calabrio Role": "QM Supervisor, QM Agent"
          };
          const result = await calabrioRolesValidation(row, initialTestState);
          expect(result).toEqual("Calabrio Role valid for row 1");
          expect(row).toEqual({
            ...row,
            roles: [
              {
                id: 1,
                name: "QM Supervisor",
                permissions: [{ name: "permission 1" }]
              },
              {
                id: 2,
                name: "QM Agent",
                permissions: [{ name: "permission 2" }, { name: "permission 3" }]
              }
            ]
          });
        });
        test("Multiple roles provided, 1 is bad, reject with message", async () => {
          const row = {
            rowNumber: 1,
            "Calabrio Role": "Supervisor-Sync Only, fake"
          };
          try {
            await calabrioRolesValidation(row, initialTestState);
          } catch (e) {
            expect(e).toEqual(JSON.stringify({
              rowNumber: 1,
              error: "fake is not a valid role for row 1"
            }));
            expect(row).toEqual({
              ...row,
              roles: [
                {
                  id: 5,
                  name: "Supervisor-Sync Only"
                }
              ]
            });
          }
        });
        test("1 good role provided, resolves with message", async () => {
          const row = {
            rowNumber: 1,
            "Calabrio Role": "Supervisor-Sync Only"
          };
          const result = await calabrioRolesValidation(row, initialTestState);
          expect(result).toEqual("Calabrio Role valid for row 1");
          expect(row).toEqual({
            ...row,
            roles: [
              {
                id: 5,
                name: "Supervisor-Sync Only"
              }
            ]
          });
        });
        test("1 bad role provided, rejects with message", async () => {
          const row = {
            rowNumber: 1,
            "Calabrio Role": "fake"
          };
          try {
            await calabrioRolesValidation(row, initialTestState);
          } catch (e) {
            expect(e).toEqual(JSON.stringify({
              rowNumber: 1,
              error: "fake is not a valid role for row 1"
            }));
            expect(row).toEqual({
              ...row,
              roles: []
            });
          }
        });
      });
      describe("options", () => {
        const optionsFunction = FIELDS.CALABRIO_ROLES.options;
        test("returns the profile id options", () => {
          const options = optionsFunction();
          expect(options).toEqual([
            "Agent-Sync Only",
            "EXL_Genpact",
            "No Screen",
            "QM Agent",
            "QM Agent_No Live Monitoring",
            "QM Supervisor",
            "Recording Access",
            "Supervisor-Sync Only",
            "WFM_Agent_NT_Dashboards",
            "WFM_Agent_TT_Dashboards",
            "WFM_Supervisor_NT_Dashboards",
            "WFM_Supervisor_TT_Dashboards"
          ]);
        });
      });
    });
    describe("CALABRIO_TIME_ZONE", () => {
      describe("validateFunction", () => {
        const timezoneValidation = FIELDS.CALABRIO_TIME_ZONE.validateFunction;
        test("No timezone provided, reject with missing message", async () => {
          const row = { rowNumber: 1 };
          try {
            await timezoneValidation(row, initialTestState);
          } catch (e) {
            expect(e).toEqual(JSON.stringify({
              rowNumber: 1,
              error: "Time Zone is missing from row 1"
            }));
          }
        });
        test("Timezone is not a valid timezone, reject with message", async () => {
          const row = {
            rowNumber: 1,
            "Time Zone": "fake"
          };
          try {
            await timezoneValidation(row, initialTestState);
          } catch (e) {
            expect(e).toEqual(JSON.stringify({
              rowNumber: 1,
              error: "Time Zone is not a valid option for row 1"
            }));
          }
        });
        test("Timezone is valid, resolve with message", async () => {
          const row = {
            rowNumber: 1,
            "Time Zone": "America/New_York (EST/EDT)"
          };
          const result = await timezoneValidation(row, initialTestState);
          expect(result).toEqual("Time Zone valid for row 1");
          expect(row).toEqual({
            ...row,
            timeZone: "America/New_York"
          });
        });
      });
      describe("options", () => {
        const optionsFunction = FIELDS.CALABRIO_TIME_ZONE.options;
        test("returns the profile id options", () => {
          const options = optionsFunction();
          expect(options).toEqual([
            "America/Anchorage (AKST/AKDT)",
            "America/Chicago (CST/CDT)",
            "America/Denver (MST/MDT)",
            "America/Los_Angeles (PST/PDT)",
            "America/New_York (EST/EDT)",
            "America/Phoenix (MST)",
            "Pacific/Honolulu (HST)"
          ]);
        });
      });
    });
    describe("CALABRIO_WFM_IDENTITY", () => {
      describe("validateFunction", () => {
        const identityValidation = FIELDS.CALABRIO_WFM_IDENTITY.validateFunction;
        test("field is empty, resolve with skipping message", async () => {
          const row = {
            rowNumber: 1,
            "WFM Identity": ""
          };
          const result = await identityValidation(row, initialTestState);
          expect(result).toEqual("WFM Identity is missing but not required. Skipping validation for row 1");
        });
        test("WFM Identity does not match hr email, reject with invalid message", async () => {
          const row = {
            rowNumber: 1,
            "WFM Identity": "wrongemail@lm.com",
            attributes: {
              email: "person@lm.com"
            }
          };
          try {
            await identityValidation(row, initialTestState);
          } catch (e) {
            expect(e).toEqual(JSON.stringify({
              rowNumber: 1,
              error: "Invalid WFM Identity.  The email provided does NOT match the email address in this user's HR data. This user needs to update their email so they match prior to being loaded into WFM for row 1"
            }));
          }
        });
        test("WFM Identity is provided, matches hr email, is added to row, resolve with successful message", async () => {
          const row = {
            rowNumber: 1,
            "WFM Identity": "person@lm.com",
            attributes: {
              email: "person@lm.com"
            }
          };
          const result = await identityValidation(row, initialTestState);
          expect(result).toEqual("WFM Identity valid for row 1");
          expect(row).toEqual(
            {
              rowNumber: 1,
              "WFM Identity": "person@lm.com",
              attributes: {
                email: "person@lm.com"
              },
              wfmIdentity: "person@lm.com"
            }
          );
        });
      });
    });
    describe("CALABRIO_WFM_BUSINESS_UNIT", () => {
      describe("validateFunction", () => {
        const BUValidation = FIELDS.CALABRIO_WFM_BUSINESS_UNIT.validateFunction;
        test("field is empty, reject with missing message", async () => {
          const row = { rowNumber: 1 };
          try {
            await BUValidation(row, initialTestState);
          } catch (e) {
            expect(e).toEqual(JSON.stringify({
              rowNumber: 1,
              error: "WFM Business Unit is missing from row 1"
            }));
          }
        });
        test("There is no Business unit match in the options, reject with invalid message", async () => {
          const row = {
            rowNumber: 1,
            "WFM Business Unit": "Fake BU"
          };
          try {
            await BUValidation(row, initialTestState);
          } catch (e) {
            expect(e).toEqual(JSON.stringify({
              rowNumber: 1,
              error: "WFM Business Unit is invalid for row 1"
            }));
          }
        });
        test("Business unit option found, id is added to row, resolve with successful message", async () => {
          const row = {
            rowNumber: 1,
            "WFM Business Unit": "WFM Business Unit1"
          };
          const result = await BUValidation(row, initialTestState);
          expect(result).toEqual("WFM Business Unit valid for row 1");
          expect(row).toEqual({
            ...row,
            businessUnitId: "123-321"
          });
        });
      });
      describe("options", () => {
        const optionsFunction = FIELDS.CALABRIO_WFM_BUSINESS_UNIT.options;
        test("returns the BU name options", () => {
          const options = optionsFunction(initialTestState);
          expect(options).toEqual([
            "Other WFM Business Unit",
            "WFM Business Unit1"
          ]);
        });
      });
    });
    describe("CALABRIO_WFM_ROLES", () => {
      describe("validateFunction", () => {
        const wfmRoleValidation = FIELDS.CALABRIO_WFM_ROLES.validateFunction;
        test("Field is empty, resolves with empty but not required message", async () => {
          const row = {
            rowNumber: 2,
            "WFM Role": ""
          };
          const result = await wfmRoleValidation(row, initialTestState);
          expect(result).toEqual("WFM Role is empty but not required. Skipping validation for row 2");
        });
        test("Field is not empty, but original BU was incorrect, reject with invalid BU message", async () => {
          const row = {
            rowNumber: 2,
            businessUnitId: "0000fakeId",
            "WFM Role": "Role1"
          };
          try {
            await wfmRoleValidation(row, initialTestState);
          } catch (e) {
            expect(e).toEqual(JSON.stringify({
              rowNumber: 2,
              error: "Unable to validate WFM Role due to invalid Business Unit for row 2"
            }));
          }
        });
        test("Field is not empty, bu is found, no matching role is found, reject with invalid role message", async () => {
          const row = {
            rowNumber: 2,
            businessUnitId: "123-321",
            "WFM Role": "fakeRole"
          };
          try {
            await wfmRoleValidation(row, initialTestState);
          } catch (e) {
            expect(e).toEqual(JSON.stringify({
              rowNumber: 2,
              error: "fakerole is not a valid WFM Role for row 2"
            }));
          }
        });
        test("Field contains 2 roles, bu is found, 1 matching role, 1 invalid role, reject with error message", async () => {
          const row = {
            rowNumber: 2,
            businessUnitId: "123-321",
            "WFM Role": "Role1, fakeRole"
          };
          try {
            await wfmRoleValidation(row, initialTestState);
          } catch (e) {
            expect(e).toEqual(JSON.stringify({
              rowNumber: 2,
              error: "fakerole is not a valid WFM Role for row 2"
            }));
          }
        });
        test("Field contains 1 role, bu is found, 1 matching role, role added to role id array, resolves", async () => {
          const row = {
            rowNumber: 2,
            businessUnitId: "123-321",
            "WFM Role": "Role1"
          };
          const result = await wfmRoleValidation(row, initialTestState);
          expect(result).toEqual("WFM Role valid for row 2");
          expect(row).toEqual({
            ...row,
            wfmRoleIds: ["111"]
          });
        });
        test("Field contains 2 roles, bu is found, 2 matching roles, both added to role id array, resolves", async () => {
          const row = {
            rowNumber: 2,
            businessUnitId: "123-321",
            "WFM Role": "Role1, Role2"
          };
          const result = await wfmRoleValidation(row, initialTestState);
          expect(result).toEqual("WFM Role valid for row 2");
          expect(row).toEqual({
            ...row,
            wfmRoleIds: ["111", "222"]
          });
        });
      });
      describe("options", () => {
        const optionsFunction = FIELDS.CALABRIO_WFM_ROLES.options;
        test("State and BU Id are passed into function, returns options", () => {
          const options = optionsFunction(initialTestState, "123-321");
          expect(options).toEqual(["Role1", "Role2"]);
        });
        test("No Business unit id is passed into options function, returns unable to generate message", () => {
          const options = optionsFunction(initialTestState);
          expect(options).toEqual(["unable to generate options"]);
        });
      });
    });
    describe("CALABRIO_WFM_FIRST_DAY_OF_WEEK", () => {
      describe("validateFunction", () => {
        const firstDayValidation = FIELDS.CALABRIO_WFM_FIRST_DAY_OF_WEEK.validateFunction;
        test("Field is empty, rejects with missing message", async () => {
          const row = {
            rowNumber: 2,
            "First Day of Week": ""
          };
          try {
            await firstDayValidation(row, initialTestState);
          } catch (e) {
            expect(e).toEqual(JSON.stringify({
              rowNumber: 2,
              error: "First Day of Week is missing from row 2"
            }));
          }
        });
        test("Field not a number between 0-6, rejects with missing message", async () => {
          const row = {
            rowNumber: 2,
            "First Day of Week": "boo"
          };
          try {
            await firstDayValidation(row, initialTestState);
          } catch (e) {
            expect(e).toEqual(JSON.stringify({
              rowNumber: 2,
              error: "First Day of Week is invalid for row 2"
            }));
          }
        });
        test("Field is valid, resolves with message", async () => {
          const row = {
            "First Day of Week": "3",
            rowNumber: 3
          };
          const result = await firstDayValidation(row, initialTestState);
          expect(result).toEqual("First Day of Week valid for row 3");
          expect(row).toEqual({
            ...row,
            wfmFirstDayOfWeek: 3
          });
        });
      });
      describe("options", () => {
        const optionsFunction = FIELDS.CALABRIO_WFM_FIRST_DAY_OF_WEEK.options;
        test("returns integers 0-6", () => {
          const options = optionsFunction();
          expect(options).toEqual([0, 1, 2, 3, 4, 5, 6]);
        });
      });
    });
    describe("CALABRIO_WFM_WORKFLOW_CONTROL_SET", () => {
      describe("validateFunction", () => {
        const wfcSetValidation = FIELDS.CALABRIO_WFM_WORKFLOW_CONTROL_SET.validateFunction;
        test("Field is empty, resolves with missing but not required message", async () => {
          const row = {
            rowNumber: 6,
            "Workflow Control Set": "",
            businessUnitId: "123-321"
          };
          const result = await wfcSetValidation(row, initialTestState);
          expect(result).toEqual("Workflow Control Set is empty but not required. Skipping validation for row 6");
        });
        test("No BU was provided for the row, rejects with unable to validate message", async () => {
          const row = {
            rowNumber: 6,
            "Workflow Control Set": "WFCSet1",
            businessUnitId: ""
          };
          try {
            await wfcSetValidation(row, initialTestState);
          } catch (e) {
            expect(e).toEqual(JSON.stringify({
              rowNumber: 6,
              error: "Unable to validate Workflow Control Set due to invalid Business Unit for row 6"
            }));
          }
        });
        test("invalid WFC Set name was provided, rejects with invalid value message", async () => {
          const row = {
            rowNumber: 6,
            "Workflow Control Set": "fakeWFCSet",
            businessUnitId: "123-321"
          };
          try {
            await wfcSetValidation(row, initialTestState);
          } catch (e) {
            expect(e).toEqual(JSON.stringify({
              rowNumber: 6,
              error: "Workflow Control Set is invalid for row 6"
            }));
          }
        });
        test("If somehow Workflow_Control_Sets does not exist in the BU option, reject with error message", async () => {
          const row = {
            rowNumber: 6,
            "Workflow Control Set": "wfcSet1",
            businessUnitId: "123-321"
          };
          try {
            await wfcSetValidation(row, {
              calabrioContext: {
                wfmOptions: [
                  { Id: "123-321" }
                ]
              }
            });
          } catch (e) {
            expect(JSON.parse(e).rowNumber).toBe(6);
            expect(JSON.parse(e).error).toContain("Error encountered validating Workflow Control Set for row 6:");
          }
        });
        test("Workflow_Control_Sets is valid, resolve and add id to row", async () => {
          const row = {
            rowNumber: 6,
            "Workflow Control Set": "WFCSet1",
            businessUnitId: "123-321"
          };
          const result = await wfcSetValidation(row, initialTestState);
          expect(result).toEqual("Workflow Control Set valid for row 6");
          expect(row).toEqual({
            ...row,
            wfmWorkflowControlSetId: "111"
          });
        });
      });
      describe("options", () => {
        const optionsFunction = FIELDS.CALABRIO_WFM_WORKFLOW_CONTROL_SET.options;
        test("State and BU Id are passed into function, returns options", () => {
          const options = optionsFunction(initialTestState, "123-321");
          expect(options).toEqual(["WFCSet1"]);
        });
        test("No Business unit id is passed into options function, returns unable to generate message", () => {
          const options = optionsFunction(initialTestState);
          expect(options).toEqual(["unable to generate options"]);
        });
      });
    });
    describe("CALABRIO_WFM_TEAM", () => {
      describe("validateFunction", () => {
        const teamValidation = FIELDS.CALABRIO_WFM_TEAM.validateFunction;
        test("No field provided, all other scheduling fields are also empty, resolve with empty but not required message", async () => {
          const row = {
            rowNumber: 3
          };
          const result = await teamValidation(row, initialTestState);
          expect(result).toEqual("WFM Team is empty but not required. Skipping validation for row 3");
        });
        test("No field provided, other scheduling fields have values, reject with missing message", async () => {
          const row = {
            rowNumber: 3,
            "WFM Team": "",
            "WFM Contract": "contract"
          };
          try {
            await teamValidation(row, initialTestState);
          } catch (e) {
            expect(e).toEqual(JSON.stringify({
              rowNumber: 3,
              error: "WFM Team is missing from row 3"
            }));
          }
        });
        test("Field has a value, bad BU is on the row, reject with invalid BU message", async () => {
          const row = {
            rowNumber: 3,
            "WFM Team": "Team1",
            businessUnitId: "boo fake"
          };
          try {
            await teamValidation(row, initialTestState);
          } catch (e) {
            expect(e).toEqual(JSON.stringify({
              rowNumber: 3,
              error: "Unable to validate WFM Team due to invalid Business Unit for row 3"
            }));
          }
        });
        test("Field has value and good bu on row, No team match is found in options, reject with invalid message", async () => {
          const row = {
            rowNumber: 3,
            "WFM Team": "FAKE TEAM",
            businessUnitId: "123-321"
          };
          try {
            await teamValidation(row, initialTestState);
          } catch (e) {
            expect(e).toEqual(JSON.stringify({
              rowNumber: 3,
              error: "WFM Team is invalid for row 3"
            }));
          }
        });
        test("Field has value, good bu on row, team value is good, resolve and add the team id to the row", async () => {
          const row = {
            rowNumber: 3,
            "WFM Team": "Team1",
            businessUnitId: "123-321"
          };
          const result = await teamValidation(row, initialTestState);
          expect(result).toEqual("WFM Team valid for row 3");
          expect(row).toEqual({
            ...row,
            wfmTeamId: "111"
          });
        });
        test("Teams is somehow absent within wfmOrg, reject with error message", async () => {
          const row = {
            rowNumber: 3,
            "WFM Team": "FAKE TEAM",
            businessUnitId: "123-321"
          };
          try {
            await teamValidation(row, {
              calabrioContext: {
                wfmOrg: [
                  { Id: "123-321" }
                ]
              }
            });
          } catch (e) {
            expect(JSON.parse(e).rowNumber).toBe(3);
            expect(JSON.parse(e).error).toContain("Error encountered validating WFM Team for row 3:");
          }
        });
      });
      describe("options", () => {
        const optionsFunction = FIELDS.CALABRIO_WFM_TEAM.options;
        test("State and BU Id are passed into function, returns options", () => {
          const options = optionsFunction(initialTestState, "123-321");
          expect(options).toEqual(["Team1", "Team2", "Team3 No ID"]);
        });
        test("No Business unit id is passed into options function, returns unable to generate message", () => {
          const options = optionsFunction(initialTestState);
          expect(options).toEqual(["unable to generate options"]);
        });
      });
    });
    describe("CALABRIO_WFM_CONTRACT", () => {
      describe("validateFunction", () => {
        const contractValidation = FIELDS.CALABRIO_WFM_CONTRACT.validateFunction;
        test("No field provided, all other scheduling fields are also empty, resolve with empty but not required message", async () => {
          const row = {
            rowNumber: 3,
            "WFM Contract": ""
          };
          const result = await contractValidation(row, initialTestState);
          expect(result).toEqual("WFM Contract is empty but not required. Skipping validation for row 3");
        });
        test("No field provided, other scheduling fields have values, reject with missing message", async () => {
          const row = {
            rowNumber: 3,
            "WFM Team": "Team2",
            "WFM Contract": ""
          };
          try {
            await contractValidation(row, initialTestState);
          } catch (e) {
            expect(e).toEqual(JSON.stringify({
              rowNumber: 3,
              error: "WFM Contract is missing from row 3"
            }));
          }
        });
        test("Field has a value, bad BU is on the row, reject with invalid BU message", async () => {
          const row = {
            rowNumber: 3,
            "WFM Contract": "Contract1",
            businessUnitId: "boo fake"
          };
          try {
            await contractValidation(row, initialTestState);
          } catch (e) {
            expect(e).toEqual(JSON.stringify({
              rowNumber: 3,
              error: "Unable to validate WFM Contract due to invalid Business Unit for row 3"
            }));
          }
        });
        test("Field has value and good bu on row, No team match is found in options, reject with invalid message", async () => {
          const row = {
            rowNumber: 3,
            "WFM Contract": "FAKE CONTRACT",
            businessUnitId: "123-321"
          };
          try {
            await contractValidation(row, initialTestState);
          } catch (e) {
            expect(e).toEqual(JSON.stringify({
              rowNumber: 3,
              error: "WFM Contract is invalid for row 3"
            }));
          }
        });
        test("Field has value, good bu on row, team value is good, resolve and add the team id to the row", async () => {
          const row = {
            rowNumber: 3,
            "WFM Contract": "Contract1",
            businessUnitId: "123-321"
          };
          const result = await contractValidation(row, initialTestState);
          expect(result).toEqual("WFM Contract valid for row 3");
          expect(row).toEqual({
            ...row,
            wfmContractId: "111"
          });
        });
        test("Contracts is somehow absent within wfmOptions, reject with error message", async () => {
          const row = {
            rowNumber: 3,
            "WFM Contract": "Contract1",
            businessUnitId: "123-321"
          };
          try {
            await contractValidation(row, {
              calabrioContext: {
                wfmOptions: [
                  { Id: "123-321" }
                ]
              }
            });
          } catch (e) {
            expect(JSON.parse(e).rowNumber).toBe(3);
            expect(JSON.parse(e).error).toContain("Error encountered validating WFM Contract for row 3:");
          }
        });
      });
      describe("options", () => {
        const optionsFunction = FIELDS.CALABRIO_WFM_CONTRACT.options;
        test("State and BU Id are passed into function, returns options", () => {
          const options = optionsFunction(initialTestState, "123-321");
          expect(options).toEqual(["Contract1"]);
        });
        test("No Business unit id is passed into options function, returns unable to generate message", () => {
          const options = optionsFunction(initialTestState);
          expect(options).toEqual(["unable to generate options"]);
        });
      });
    });
    describe("CALABRIO_WFM_CONTRACT_SCHEDULE", () => {
      describe("validateFunction", () => {
        const contractSchedValidation = FIELDS.CALABRIO_WFM_CONTRACT_SCHEDULE.validateFunction;
        test("No field provided, all other scheduling fields are also empty, resolve with empty but not required message", async () => {
          const row = {
            rowNumber: 3,
            "WFM Contract Schedule": ""
          };
          const result = await contractSchedValidation(row, initialTestState);
          expect(result).toEqual("WFM Contract Schedule is empty but not required. Skipping validation for row 3");
        });
        test("No field provided, other scheduling fields have values, reject with missing message", async () => {
          const row = {
            rowNumber: 3,
            "WFM Contract": "Contract1",
            "WFM Contract Schedule": ""
          };
          try {
            await contractSchedValidation(row, initialTestState);
          } catch (e) {
            expect(e).toEqual(JSON.stringify({
              rowNumber: 3,
              error: "WFM Contract Schedule is missing from row 3"
            }));
          }
        });
        test("Field has a value, bad BU is on the row, reject with invalid BU message", async () => {
          const row = {
            rowNumber: 3,
            "WFM Contract Schedule": "ContractSchdule1",
            businessUnitId: "boo fake"
          };
          try {
            await contractSchedValidation(row, initialTestState);
          } catch (e) {
            expect(e).toEqual(JSON.stringify({
              rowNumber: 3,
              error: "Unable to validate WFM Contract Schedule due to invalid Business Unit for row 3"
            }));
          }
        });
        test("Field has value and good bu on row, No contract schedule match is found in options, reject with invalid message", async () => {
          const row = {
            rowNumber: 3,
            "WFM Contract Schedule": "FAKE C Schedule",
            businessUnitId: "123-321"
          };
          try {
            await contractSchedValidation(row, initialTestState);
          } catch (e) {
            expect(e).toEqual(JSON.stringify({
              rowNumber: 3,
              error: "WFM Contract Schedule is invalid for row 3"
            }));
          }
        });
        test("Field has value, good bu on row, team value is good, resolve and add the team id to the row", async () => {
          const row = {
            rowNumber: 3,
            "WFM Contract Schedule": "ContractSchedule1",
            businessUnitId: "123-321"
          };
          const result = await contractSchedValidation(row, initialTestState);
          expect(result).toEqual("WFM Contract Schedule valid for row 3");
          expect(row).toEqual({
            ...row,
            wfmContractScheduleId: "111"
          });
        });
        test("Contract Schedules is somehow absent within wfmOptions, reject with error message", async () => {
          const row = {
            rowNumber: 3,
            "WFM Contract Schedule": "ContractSchedule1",
            businessUnitId: "123-321"
          };
          try {
            await contractSchedValidation(row, {
              calabrioContext: {
                wfmOptions: [
                  { Id: "123-321" }
                ]
              }
            });
          } catch (e) {
            expect(JSON.parse(e).rowNumber).toBe(3);
            expect(JSON.parse(e).error).toContain("Error encountered validating WFM Contract Schedule for row 3:");
          }
        });
      });
      describe("options", () => {
        const optionsFunction = FIELDS.CALABRIO_WFM_CONTRACT_SCHEDULE.options;
        test("State and BU Id are passed into function, returns options", () => {
          const options = optionsFunction(initialTestState, "123-321");
          expect(options).toEqual(["ContractSchedule1"]);
        });
        test("No Business unit id is passed into options function, returns unable to generate message", () => {
          const options = optionsFunction(initialTestState);
          expect(options).toEqual(["unable to generate options"]);
        });
      });
    });
    describe("CALABRIO_WFM_PARTTIME_PERCENTAGE", () => {
      describe("validateFunction", () => {
        const partTimeValidation = FIELDS.CALABRIO_WFM_PARTTIME_PERCENTAGE.validateFunction;
        test("No field provided, all other scheduling fields are also empty, resolve with empty but not required message", async () => {
          const row = {
            rowNumber: 3,
            "WFM Part Time Percentage": ""
          };
          const result = await partTimeValidation(row, initialTestState);
          expect(result).toEqual("WFM Part Time Percentage is empty but not required. Skipping validation for row 3");
        });
        test("No field provided, other scheduling fields have values, reject with missing message", async () => {
          const row = {
            rowNumber: 3,
            "WFM Contract": "Contract1",
            "WFM Part Time Percentage": ""
          };
          try {
            await partTimeValidation(row, initialTestState);
          } catch (e) {
            expect(e).toEqual(JSON.stringify({
              rowNumber: 3,
              error: "WFM Part Time Percentage is missing from row 3"
            }));
          }
        });
        test("Field has a value, bad BU is on the row, reject with invalid BU message", async () => {
          const row = {
            rowNumber: 3,
            "WFM Part Time Percentage": "ParttimePercent1",
            businessUnitId: "boo fake"
          };
          try {
            await partTimeValidation(row, initialTestState);
          } catch (e) {
            expect(e).toEqual(JSON.stringify({
              rowNumber: 3,
              error: "Unable to validate WFM Part Time Percentage due to invalid Business Unit for row 3"
            }));
          }
        });
        test("Field has value and good bu on row, No part time percent match is found in options, reject with invalid message", async () => {
          const row = {
            rowNumber: 3,
            "WFM Part Time Percentage": "FAKE PTP",
            businessUnitId: "123-321"
          };
          try {
            await partTimeValidation(row, initialTestState);
          } catch (e) {
            expect(e).toEqual(JSON.stringify({
              rowNumber: 3,
              error: "WFM Part Time Percentage is invalid for row 3"
            }));
          }
        });
        test("Field has value, good bu on row, parttime value is good, resolve and add the team id to the row", async () => {
          const row = {
            rowNumber: 3,
            "WFM Part Time Percentage": "ParttimePercent1",
            businessUnitId: "123-321"
          };
          const result = await partTimeValidation(row, initialTestState);
          expect(result).toEqual("WFM Part Time Percentage valid for row 3");
          expect(row).toEqual({
            ...row,
            wfmPartTimePercentageId: "111"
          });
        });
        test("Part_Time_Percentages is somehow absent within wfmOptions, reject with error message", async () => {
          const row = {
            rowNumber: 3,
            "WFM Part Time Percentage": "ParttimePercent1",
            businessUnitId: "123-321"
          };
          try {
            await partTimeValidation(row, {
              calabrioContext: {
                wfmOptions: [
                  { Id: "123-321" }
                ]
              }
            });
          } catch (e) {
            expect(JSON.parse(e).rowNumber).toBe(3);
            expect(JSON.parse(e).error).toContain("Error encountered validating WFM Part Time Percentage for row 3:");
          }
        });
      });
      describe("options", () => {
        const optionsFunction = FIELDS.CALABRIO_WFM_PARTTIME_PERCENTAGE.options;
        test("State and BU Id are passed into function, returns options", () => {
          const options = optionsFunction(initialTestState, "123-321");
          expect(options).toEqual(["ParttimePercent1"]);
        });
        test("No Business unit id is passed into options function, returns unable to generate message", () => {
          const options = optionsFunction(initialTestState);
          expect(options).toEqual(["unable to generate options"]);
        });
      });
    });
    describe("CALABRIO_WFM_SHIFTBAG", () => {
      describe("validateFunction", () => {
        const shiftBagValidation = FIELDS.CALABRIO_WFM_SHIFTBAG.validateFunction;
        test("No Shiftbag value is provided, resolves with empty but not required message", async () => {
          const row = {
            rowNumber: 3,
            "WFM Shift Bag": "",
            businessUnitId: "123-321"
          };
          const result = await shiftBagValidation(row, initialTestState);
          expect(result).toEqual("WFM Shift Bag is empty but not required. Skipping validation for row 3");
          expect(row).toEqual({
            rowNumber: 3,
            "WFM Shift Bag": "",
            businessUnitId: "123-321"
          });
        });
        test("Shiftbag provided, but no other scheduling fields have values on the row, rejects with message", async () => {
          const row = {
            rowNumber: 3,
            "WFM Shift Bag": "ShiftBag1",
            businessUnitId: "123-321"
          };
          try {
            await shiftBagValidation(row, initialTestState);
          } catch (e) {
            expect(e).toEqual(JSON.stringify({
              rowNumber: 3,
              error: "WFM Shift Bag is invalid.  WFM Shift Bag should only be provided when the following fields are also provided: WFM Person Start Date, WFM Team, WFM Team Start Date, WFM Contract, WFM Contract Schedule, WFM Part Time Percentage"
            }));
          }
        });
        test("Shiftbag has value, bad BU on the row, reject with invalid BU message", async () => {
          const row = {
            rowNumber: 3,
            "WFM Shift Bag": "ShiftBag1",
            "WFM Team": "Team1",
            "WFM Team Start Date": "3/24/2023",
            "WFM Contract": "Contract1",
            "WFM Contract Schedule": "ContractSchedule1",
            "WFM Part Time Percentage": "PartTimePercent1",
            "WFM Person Start Date": "3/24/2023",
            businessUnitId: "fake-boooooo"
          };
          try {
            await shiftBagValidation(row, initialTestState);
          } catch (e) {
            expect(e).toEqual(JSON.stringify({
              rowNumber: 3,
              error: "Unable to validate WFM Shift Bag due to invalid Business Unit for row 3"
            }));
          }
        });
        test("Shiftbag has value, no matching shiftbag in the options, rejects with invalid message", async () => {
          const row = {
            rowNumber: 3,
            "WFM Shift Bag": "fake-shift-bag-arooney",
            "WFM Team": "Team1",
            "WFM Team Start Date": "3/24/2023",
            "WFM Contract": "Contract1",
            "WFM Contract Schedule": "ContractSchedule1",
            "WFM Part Time Percentage": "PartTimePercent1",
            "WFM Person Start Date": "3/24/2023",
            businessUnitId: "123-321"
          };
          try {
            await shiftBagValidation(row, initialTestState);
          } catch (e) {
            expect(e).toEqual(JSON.stringify({
              rowNumber: 3,
              error: "WFM Shift Bag is invalid for row 3"
            }));
          }
        });
        test("Shiftbag has value, has a match in shiftbag options, resolves", async () => {
          const row = {
            rowNumber: 3,
            "WFM Shift Bag": "ShiftBag1",
            "WFM Team": "Team1",
            "WFM Team Start Date": "3/24/2023",
            "WFM Contract": "Contract1",
            "WFM Contract Schedule": "ContractSchedule1",
            "WFM Part Time Percentage": "PartTimePercent1",
            "WFM Person Start Date": "3/24/2023",
            businessUnitId: "123-321"
          };
          const result = await shiftBagValidation(row, initialTestState);
          expect(result).toEqual("WFM Shift Bag valid for row 3");
          expect(row).toEqual({
            ...row,
            wfmShiftBagId: "111"
          });
        });
        test("Error from no shiftbag options, rejects with error message", async () => {
          const row = {
            rowNumber: 3,
            "WFM Shift Bag": "ShiftBag1",
            "WFM Team": "Team1",
            "WFM Team Start Date": "3/24/2023",
            "WFM Contract": "Contract1",
            "WFM Contract Schedule": "ContractSchedule1",
            "WFM Part Time Percentage": "PartTimePercent1",
            "WFM Person Start Date": "3/24/2023",
            businessUnitId: "123-321"
          };
          try {
            await shiftBagValidation(row, {
              calabrioContext: {
                wfmOptions: [{
                  Id: "123-321"
                }]
              }
            });
          } catch (e) {
            expect(JSON.parse(e).rowNumber).toBe(3);
            expect(JSON.parse(e).error).toContain("Error encountered validating WFM Shift Bag for row 3:");
          }
        });
      });
      describe("options", () => {
        const optionsFunction = FIELDS.CALABRIO_WFM_SHIFTBAG.options;
        test("State and BU Id are passed into function, returns options", () => {
          const options = optionsFunction(initialTestState, "123-321");
          expect(options).toEqual(["ShiftBag1"]);
        });
        test("No Business unit id is passed into options function, returns unable to generate message", () => {
          const options = optionsFunction(initialTestState);
          expect(options).toEqual(["unable to generate options"]);
        });
      });
    });
    describe("CALABRIO_WFM_BUDGET_GROUP", () => {
      describe("validateFunction", () => {
        const budgetGroupValidation = FIELDS.CALABRIO_WFM_BUDGET_GROUP.validateFunction;
        test("No budget group value is provided, resolves with empty but not required message", async () => {
          const row = {
            rowNumber: 3,
            "WFM Budget Group": "",
            businessUnitId: "123-321"
          };
          const result = await budgetGroupValidation(row, initialTestState);
          expect(result).toEqual("WFM Budget Group is empty but not required. Skipping validation for row 3");
          expect(row).toEqual({
            rowNumber: 3,
            "WFM Budget Group": "",
            businessUnitId: "123-321"
          });
        });
        test("budget group provided, but no other scheduling fields have values on the row, rejects with message", async () => {
          const row = {
            rowNumber: 3,
            "WFM Budget Group": "BudgetGroup1",
            businessUnitId: "123-321"
          };
          try {
            await budgetGroupValidation(row, initialTestState);
          } catch (e) {
            expect(e).toEqual(JSON.stringify({
              rowNumber: 3,
              error: "WFM Budget Group is invalid.  WFM Budget Group should only be provided when the following fields are also provided: WFM Person Start Date, WFM Team, WFM Team Start Date, WFM Contract, WFM Contract Schedule, WFM Part Time Percentage"
            }));
          }
        });
        test("BudgetGroup has value, bad BU on the row, reject with invalid BU message", async () => {
          const row = {
            rowNumber: 3,
            "WFM Budget Group": "BudgetGroup1",
            "WFM Team": "Team1",
            "WFM Team Start Date": "3/24/2023",
            "WFM Contract": "Contract1",
            "WFM Contract Schedule": "ContractSchedule1",
            "WFM Part Time Percentage": "PartTimePercent1",
            "WFM Person Start Date": "3/24/2023",
            businessUnitId: "fake-boooooo"
          };
          try {
            await budgetGroupValidation(row, initialTestState);
          } catch (e) {
            expect(e).toEqual(JSON.stringify({
              rowNumber: 3,
              error: "Unable to validate WFM Budget Group due to invalid Business Unit for row 3"
            }));
          }
        });
        test("Budget Group has value, no matching budget group in the options, rejects with invalid message", async () => {
          const row = {
            rowNumber: 3,
            "WFM Budget Group": "fake-budget-group",
            "WFM Team": "Team1",
            "WFM Team Start Date": "3/24/2023",
            "WFM Contract": "Contract1",
            "WFM Contract Schedule": "ContractSchedule1",
            "WFM Part Time Percentage": "PartTimePercent1",
            "WFM Person Start Date": "3/24/2023",
            businessUnitId: "123-321"
          };
          try {
            await budgetGroupValidation(row, initialTestState);
          } catch (e) {
            expect(e).toEqual(JSON.stringify({
              rowNumber: 3,
              error: "WFM Budget Group is invalid for row 3"
            }));
          }
        });
        test("Budget Group has value, has a match in options, resolves", async () => {
          const row = {
            rowNumber: 3,
            "WFM Budget Group": "BudgetGroup1",
            "WFM Team": "Team1",
            "WFM Team Start Date": "3/24/2023",
            "WFM Contract": "Contract1",
            "WFM Contract Schedule": "ContractSchedule1",
            "WFM Part Time Percentage": "PartTimePercent1",
            "WFM Person Start Date": "3/24/2023",
            businessUnitId: "123-321"
          };
          const result = await budgetGroupValidation(row, initialTestState);
          expect(result).toEqual("WFM Budget Group valid for row 3");
          expect(row).toEqual({
            ...row,
            wfmBudgetGroupId: "000"
          });
        });
        test("Error from no shiftbag options, rejects with error message", async () => {
          const row = {
            rowNumber: 3,
            "WFM Budget Group": "BudgetGroup1",
            "WFM Team": "Team1",
            "WFM Team Start Date": "3/24/2023",
            "WFM Contract": "Contract1",
            "WFM Contract Schedule": "ContractSchedule1",
            "WFM Part Time Percentage": "PartTimePercent1",
            "WFM Person Start Date": "3/24/2023",
            businessUnitId: "123-321"
          };
          try {
            await budgetGroupValidation(row, {
              calabrioContext: {
                wfmOptions: [{
                  Id: "123-321"
                }]
              }
            });
          } catch (e) {
            expect(JSON.parse(e).rowNumber).toBe(3);
            expect(JSON.parse(e).error).toContain("Error encountered validating WFM Budget Group for row 3:");
          }
        });
      });
      describe("options", () => {
        const optionsFunction = FIELDS.CALABRIO_WFM_BUDGET_GROUP.options;
        test("State and BU Id are passed into function, returns options", () => {
          const options = optionsFunction(initialTestState, "123-321");
          expect(options).toEqual(["BudgetGroup1"]);
        });
        test("No Business unit id is passed into options function, returns unable to generate message", () => {
          const options = optionsFunction(initialTestState);
          expect(options).toEqual(["unable to generate options"]);
        });
      });
    });
    describe("CALABRIO_WFM_PERSON_START_DATE", () => {
      describe("validateFunction", () => {
        const personStartDateValidation = FIELDS.CALABRIO_WFM_PERSON_START_DATE.validateFunction;
        test("No field provided, all other scheduling fields are also empty, resolve with empty but not required message", async () => {
          const row = {
            rowNumber: 3,
            "WFM Person Start Date": ""
          };
          const result = await personStartDateValidation(row, initialTestState);
          expect(result).toEqual("WFM Person Start Date is empty but not required. Skipping validation for row 3");
        });
        test("No field provided, other scheduling fields have values, reject with missing message", async () => {
          const row = {
            rowNumber: 3,
            "WFM Contract": "Contract1",
            "WFM Person Start Date": ""
          };
          try {
            await personStartDateValidation(row, initialTestState);
          } catch (e) {
            expect(e).toEqual(JSON.stringify({
              rowNumber: 3,
              error: "WFM Person Start Date is missing from row 3"
            }));
          }
        });
        test("start date field provided but is not a number, other scheduling fields have values, reject with missing message", async () => {
          const row = {
            rowNumber: 3,
            "WFM Contract": "Contract1",
            "WFM Person Start Date": "boo"
          };
          try {
            await personStartDateValidation(row, initialTestState);
          } catch (e) {
            expect(e).toEqual(JSON.stringify({
              rowNumber: 3,
              error: "Error encountered validating WFM Person Start Date for row 3: Invalid date"
            }));
          }
        });
        test("Field has value, resolve and add the formatted date to the row", async () => {
          const row = {
            rowNumber: 3,
            "WFM Person Start Date": 44073
          };
          const result = await personStartDateValidation(row, initialTestState);
          expect(result).toEqual("WFM Person Start Date valid for row 3");
          expect(row).toEqual({
            ...row,
            wfmPersonStartDate: "2020-08-30"
          });
        });
      });
    });
    describe("CALABRIO_WFM_TEAM_START_DATE", () => {
      describe("validateFunction", () => {
        const teamStartDateValidation = FIELDS.CALABRIO_WFM_TEAM_START_DATE.validateFunction;
        test("No field provided, all other scheduling fields are also empty, resolve with empty but not required message", async () => {
          const row = {
            rowNumber: 3,
            "WFM Team Start Date": ""
          };
          const result = await teamStartDateValidation(row, initialTestState);
          expect(result).toEqual("WFM Team Start Date is empty but not required. Skipping validation for row 3");
        });
        test("No field provided, other scheduling fields have values, reject with missing message", async () => {
          const row = {
            rowNumber: 3,
            "WFM Contract": "Contract1",
            "WFM Team Start Date": ""
          };
          try {
            await teamStartDateValidation(row, initialTestState);
          } catch (e) {
            expect(e).toEqual(JSON.stringify({
              rowNumber: 3,
              error: "WFM Team Start Date is missing from row 3"
            }));
          }
        });
        test("Team start date field provided but is not a number, other scheduling fields have values, reject with missing message", async () => {
          const row = {
            rowNumber: 3,
            "WFM Contract": "Contract1",
            "WFM Team Start Date": "boo"
          };
          try {
            await teamStartDateValidation(row, initialTestState);
          } catch (e) {
            expect(e).toEqual(JSON.stringify({
              rowNumber: 3,
              error: "Error encountered validating WFM Team Start Date for row 3: Invalid date"
            }));
          }
        });
        test("Field has value, resolve and add the formatted date to the row", async () => {
          const row = {
            rowNumber: 3,
            "WFM Team Start Date": 45073
          };
          const result = await teamStartDateValidation(row, initialTestState);
          expect(result).toEqual("WFM Team Start Date valid for row 3");
          expect(row).toEqual({
            ...row,
            wfmTeamStartDate: "2023-05-27"
          });
        });
      });
    });
    describe("CALABRIO_WFM_SKILLS_START_DATE", () => {
      describe("validateFunction", () => {
        const skillsStartDateValidation = FIELDS.CALABRIO_WFM_SKILLS_START_DATE.validateFunction;
        test("Skill start date and skill fields both empty, resolve with empty but not required message", async () => {
          const row = {
            rowNumber: 7,
            "WFM Skills Start Date": "",
            "WFM Skills": ""
          };
          const result = await skillsStartDateValidation(row, initialTestState);
          expect(result).toEqual("WFM Skills Start Date is empty but not required. Skipping validation for row 7");
        });
        test("Skill start date empty, but skills are not, reject with missing message", async () => {
          const row = {
            rowNumber: 7,
            "WFM Skills Start Date": "",
            "WFM Skills": "Skill1"
          };
          try {
            await skillsStartDateValidation(row, initialTestState);
          } catch (e) {
            expect(e).toEqual(JSON.stringify({
              rowNumber: 7,
              error: "WFM Skills Start Date is missing from row 7"
            }));
          }
        });
        test("Both Skill start date and skills are present, but start date is invalid format, reject with error message", async () => {
          const row = {
            rowNumber: 7,
            "WFM Skills Start Date": "BOO",
            "WFM Skills": "Skill1"
          };
          try {
            await skillsStartDateValidation(row, initialTestState);
          } catch (e) {
            expect(e).toEqual(JSON.stringify({
              rowNumber: 7,
              error: "Error encountered validating WFM Skills Start Date for row 7: Invalid date"
            }));
          }
        });
        test("Both Skill start date and skills are present, date is good, resolve with message and add skill start date to row", async () => {
          const row = {
            rowNumber: 7,
            "WFM Skills Start Date": 45073,
            "WFM Skills": "Skill1"
          };
          const result = await skillsStartDateValidation(row, initialTestState);
          expect(result).toEqual("WFM Skills Start Date valid for row 7");
          expect(row).toEqual({
            ...row,
            wfmSkillsStartDate: "2023-05-27"
          });
        });
        test("Start date was provided, but no skills, reject with message", async () => {
          const row = {
            rowNumber: 7,
            "WFM Skills Start Date": 45073,
            "WFM Skills": ""
          };
          try {
            await skillsStartDateValidation(row, initialTestState);
          } catch (e) {
            expect(e).toEqual(JSON.stringify({
              rowNumber: 7,
              error: "WFM Skills Start Date was provided but WFM Skills is empty."
            }));
          }
        });
      });
    });
    describe("CALABRIO_WFM_SKILLS", () => {
      describe("validateFunction", () => {
        const skillsValidation = FIELDS.CALABRIO_WFM_SKILLS.validateFunction;
        test("Skills is empty, resolve with not required message", async () => {
          const row = {
            rowNumber: 7,
            "WFM Skills": ""
          };
          const result = await skillsValidation(row, initialTestState);
          expect(result).toEqual("WFM Skills is empty but not required. Skipping validation for row 7");
        });
        test("Skills are not empty, BU is invalid on the row, reject with invalid BU message", async () => {
          const row = {
            rowNumber: 7,
            "WFM Skills": "Skill1",
            businessUnitId: "boo fake"
          };
          try {
            await skillsValidation(row, initialTestState);
          } catch (e) {
            expect(e).toEqual(JSON.stringify({
              rowNumber: 7,
              error: "Unable to validate WFM Skills due to invalid Business Unit for row 7"
            }));
          }
        });
        test("Skills are not empty, BU is good, no matching skill, reject with invalid skill message", async () => {
          const row = {
            rowNumber: 7,
            "WFM Skills": "fakeskill",
            businessUnitId: "123-321"
          };
          try {
            await skillsValidation(row, initialTestState);
          } catch (e) {
            expect(e).toEqual(JSON.stringify({
              rowNumber: 7,
              error: "fakeskill is not a valid wfm skill for row 7"
            }));
          }
        });
        test("1 skill provided, BU and skill are valid, resolve with message, skill id added to row", async () => {
          const row = {
            rowNumber: 7,
            "WFM Skills": "Skill1",
            businessUnitId: "123-321"
          };
          const result = await skillsValidation(row, initialTestState);
          expect(result).toEqual("WFM Skills valid for row 7");
          expect(row).toEqual({
            ...row,
            wfmSkillIds: ["111"]
          });
        });
        test("multiple skills provided, 1 skill is invalid, reject with message", async () => {
          const row = {
            rowNumber: 7,
            "WFM Skills": "Skill1, fakeskill",
            businessUnitId: "123-321"
          };
          try {
            await skillsValidation(row, initialTestState);
          } catch (e) {
            expect(e).toEqual(JSON.stringify({
              rowNumber: 7,
              error: "fakeskill is not a valid wfm skill for row 7"
            }));
          }
        });
        test("multiple skills provided, BU and skills are valid, resolve with message, skill id added to row", async () => {
          const row = {
            rowNumber: 7,
            "WFM Skills": "Skill1, Skill2",
            businessUnitId: "123-321"
          };
          const result = await skillsValidation(row, initialTestState);
          expect(result).toEqual("WFM Skills valid for row 7");
          expect(row).toEqual({
            ...row,
            wfmSkillIds: ["111", "222"]
          });
        });
      });
      describe("options", () => {
        const optionsFunction = FIELDS.CALABRIO_WFM_SKILLS.options;
        test("State and BU Id are passed into function, returns options", () => {
          const options = optionsFunction(initialTestState, "123-321");
          expect(options).toEqual(["Skill1", "Skill2"]);
        });
        test("No Business unit id is passed into options function, returns unable to generate message", () => {
          const options = optionsFunction(initialTestState);
          expect(options).toEqual(["unable to generate options"]);
        });
      });
    });
    describe("CALABRIO_WFM_ROTATION_START_DATE", () => {
      describe("validateFunction", () => {
        const rotationStartDateValidation = FIELDS.CALABRIO_WFM_ROTATION_START_DATE.validateFunction;
        test("Rotation start date and Rotation fields both empty, resolve with empty but not required message", async () => {
          const row = {
            rowNumber: 7,
            "WFM Rotation Start Date": "",
            "WFM Rotation": ""
          };
          const result = await rotationStartDateValidation(row, initialTestState);
          expect(result).toEqual("WFM Rotation Start Date is empty but not required. Skipping validation for row 7");
        });
        test("Rotation start date is empty, but Rotation is not, reject with missing message", async () => {
          const row = {
            rowNumber: 7,
            "WFM Rotation Start Date": "",
            "WFM Rotation": "Rotation1"
          };
          try {
            await rotationStartDateValidation(row, initialTestState);
          } catch (e) {
            expect(e).toEqual(JSON.stringify({
              rowNumber: 7,
              error: "WFM Rotation Start Date is missing from row 7"
            }));
          }
        });
        test("Both Rotation start date and Rotation are present, but start date is invalid format, reject with error message", async () => {
          const row = {
            rowNumber: 7,
            "WFM Rotation Start Date": "BOO",
            "WFM Rotation": "Rotation1"
          };
          try {
            await rotationStartDateValidation(row, initialTestState);
          } catch (e) {
            expect(e).toEqual(JSON.stringify({
              rowNumber: 7,
              error: "Error encountered validating WFM Rotation Start Date for row 7: Invalid date"
            }));
          }
        });
        test("Both Rotation start date and Rotation are present, date is good, resolve with message and add Rotation start date to row", async () => {
          const row = {
            rowNumber: 7,
            "WFM Rotation Start Date": 45073,
            "WFM Rotation": "Skill1"
          };
          const result = await rotationStartDateValidation(row, initialTestState);
          expect(result).toEqual("WFM Rotation Start Date valid for row 7");
          expect(row).toEqual({
            ...row,
            wfmRotationStartDate: "2023-05-27"
          });
        });
        test("Start date was provided, but no rotation, resolve with skipping message", async () => {
          const row = {
            rowNumber: 7,
            "WFM Rotation Start Date": 45073,
            "WFM Rotation": ""
          };
          try {
            await rotationStartDateValidation(row, initialTestState);
          } catch (e) {
            expect(e).toEqual(JSON.stringify({
              rowNumber: 7,
              error: "WFM Rotation Start Date was provided but WFM Rotation is empty."
            }));
          }
        });
      });
    });
    describe("CALABRIO_WFM_ROTATION", () => {
      describe("validateFunction", () => {
        const rotationValidation = FIELDS.CALABRIO_WFM_ROTATION.validateFunction;
        test("No Rotation provided, resolve with empty but not required message", async () => {
          const row = {
            rowNumber: 7,
            "WFM Rotation": ""
          };
          const result = await rotationValidation(row, initialTestState);
          expect(result).toEqual("WFM Rotation is empty but not required. Skipping validation for row 7");
          expect(row).toEqual({
            rowNumber: 7,
            "WFM Rotation": ""
          });
        });
        test("Rotation provided, but BU is invalid on row, reject with BU error message", async () => {
          const row = {
            rowNumber: 7,
            "WFM Rotation": "Rotation1",
            businessUnitId: "bad id"
          };
          try {
            await rotationValidation(row, initialTestState);
          } catch (e) {
            expect(e).toEqual(JSON.stringify({
              rowNumber: 7,
              error: "Unable to validate WFM Rotation due to invalid Business Unit for row 7"
            }));
          }
        });
        test("Rotation provided but is invalid, reject with invalid message", async () => {
          const row = {
            rowNumber: 7,
            "WFM Rotation": "fake rotation",
            businessUnitId: "123-321"
          };
          try {
            await rotationValidation(row, initialTestState);
          } catch (e) {
            expect(e).toEqual(JSON.stringify({
              rowNumber: 7,
              error: "WFM Rotation is invalid for row 7"
            }));
          }
        });
        test("Error thrown due to missing rotations in wfm options, reject with error message", async () => {
          const row = {
            rowNumber: 7,
            "WFM Rotation": "Rotation1",
            businessUnitId: "123-321"
          };
          try {
            await rotationValidation(row, {
              calabrioContext: {
                wfmOptions: [
                  {
                    Id: "123-321"
                  }
                ]
              }
            });
          } catch (e) {
            expect(JSON.parse(e).rowNumber).toBe(7);
            expect(JSON.parse(e).error).toContain("Error encountered validating WFM Rotation for row 7:");
          }
        });
        test("Rotation and BU are valid, resolve with message, rotation id added to row", async () => {
          const row = {
            rowNumber: 7,
            "WFM Rotation": "Rotation1",
            businessUnitId: "123-321"
          };
          const result = await rotationValidation(row, initialTestState);
          expect(result).toEqual("WFM Rotation valid for row 7");
          expect(row).toEqual({
            ...row,
            wfmRotationId: "111"
          });
        });
      });
      describe("options", () => {
        const optionsFunction = FIELDS.CALABRIO_WFM_ROTATION.options;
        test("State and BU Id are passed into function, returns options", () => {
          const options = optionsFunction(initialTestState, "123-321");
          expect(options).toEqual(["Rotation1"]);
        });
        test("No Business unit id is passed into options function, returns unable to generate message", () => {
          const options = optionsFunction(initialTestState);
          expect(options).toEqual(["unable to generate options"]);
        });
      });
    });
    describe("CALABRIO_WFM_ROTATION_START_WEEK", () => {
      describe("validateFunction", () => {
        const rotationStartWkValidation = FIELDS.CALABRIO_WFM_ROTATION_START_WEEK.validateFunction;
        test("Rotation start week and Rotation fields both empty, resolve with empty but not required message", async () => {
          const row = {
            rowNumber: 5,
            "WFM Rotation Start Week": "",
            "WFM Rotation": ""
          };
          const result = await rotationStartWkValidation(row, initialTestState);
          expect(result).toEqual("WFM Rotation Start Week is empty but not required. Skipping validation for row 5");
        });
        test("Rotation start week empty, but Rotation are not, reject with missing message", async () => {
          const row = {
            rowNumber: 5,
            "WFM Rotation Start Week": "",
            "WFM Rotation": "Rotation1",
            businessUnitId: "123-321"
          };
          try {
            await rotationStartWkValidation(row, initialTestState);
          } catch (e) {
            expect(e).toEqual(JSON.stringify({
              rowNumber: 5,
              error: "WFM Rotation Start Week is missing from row 5"
            }));
          }
        });
        test("Both Rotation start week and Rotation are present, but week is invalid, reject with error message", async () => {
          const row = {
            rowNumber: 5,
            "WFM Rotation Start Week": "20",
            "WFM Rotation": "Rotation1",
            businessUnitId: "123-321"
          };
          try {
            await rotationStartWkValidation(row, initialTestState);
          } catch (e) {
            expect(e).toEqual(JSON.stringify({
              rowNumber: 5,
              error: "WFM Rotation Start Week is invalid for row 5"
            }));
          }
        });
        test("Both Rotation start week and Rotation are present, week is good, resolve with message and add Rotation start date to row", async () => {
          const row = {
            rowNumber: 5,
            "WFM Rotation Start Week": "3",
            "WFM Rotation": "Rotation1",
            businessUnitId: "123-321"
          };
          const result = await rotationStartWkValidation(row, initialTestState);
          expect(result).toEqual("WFM Rotation Start Week valid for row 5");
          expect(row).toEqual({
            ...row,
            wfmRotationStartWk: 3
          });
        });
        test("Start week was provided, but no rotation, resolve with skipping message", async () => {
          const row = {
            rowNumber: 5,
            "WFM Rotation Start Week": "3",
            "WFM Rotation": "",
            businessUnitId: "123-321"
          };
          try {
            await rotationStartWkValidation(row, initialTestState);
          } catch (e) {
            expect(e).toEqual(JSON.stringify({
              rowNumber: 5,
              error: "WFM Rotation Start Week was provided but WFM Rotation is empty."
            }));
          }
        });
      });
    });
    describe("CALABRIO_WFM_AVAILABILITY_START_DATE", () => {
      describe("validateFunction", () => {
        const availabilityStartDateValidation = FIELDS.CALABRIO_WFM_AVAILABILITY_START_DATE.validateFunction;
        test("Availability and availability start date are empty, resolve with not required message", async () => {
          const row = {
            "WFM Availability Start Date": "",
            "WFM Availability": "",
            rowNumber: 2
          };
          const result = await availabilityStartDateValidation(row, initialTestState);
          expect(result).toEqual("WFM Availability Start Date is empty but not required. Skipping validation for row 2");
        });
        test("Availability start date is empty, availability is not, reject with missing value message", async () => {
          const row = {
            "WFM Availability Start Date": null,
            "WFM Availability": "Availability1",
            rowNumber: 2
          };
          try {
            await availabilityStartDateValidation(row, initialTestState);
          } catch (e) {
            expect(e).toEqual(JSON.stringify({
              rowNumber: 2,
              error: "WFM Availability Start Date is missing from row 2"
            }));
          }
        });
        test("Both Availability start date and Availability are provided, start date is bad format, reject with invalid message", async () => {
          const row = {
            "WFM Availability Start Date": "nope",
            "WFM Availability": "Availability1",
            rowNumber: 2
          };
          try {
            await availabilityStartDateValidation(row, initialTestState);
          } catch (e) {
            expect(e).toEqual(JSON.stringify({
              rowNumber: 2,
              error: "Error encountered validating WFM Availability Start Date for row 2: Invalid date"
            }));
          }
        });
        test("Both Availability start date and Availability are provided, format is valid, resolve with message and add formatted availability start date to row ", async () => {
          const row = {
            "WFM Availability Start Date": 43321,
            "WFM Availability": "Availability1",
            rowNumber: 2
          };
          const result = await availabilityStartDateValidation(row, initialTestState);
          expect(result).toEqual("WFM Availability Start Date valid for row 2");
          expect(row).toEqual({
            ...row,
            wfmAvailabilityStartDate: "2018-08-09"
          });
        });
        test("Start date was provided, but not availability, resolve with skipping message", async () => {
          const row = {
            "WFM Availability Start Date": 43321,
            "WFM Availability": "",
            rowNumber: 2
          };
          try {

            await availabilityStartDateValidation(row, initialTestState);
          } catch (e) {
            expect(e).toEqual(JSON.stringify({
              rowNumber: 2,
              error: "WFM Availability Start Date was provided but WFM Availability is empty."
            }));
          }
        });
      });
    });
    describe("CALABRIO_WFM_AVAILABILITY", () => {
      describe("validateFunction", () => {
        const availabilityValidation = FIELDS.CALABRIO_WFM_AVAILABILITY.validateFunction;
        test("No availability provided, resolve with the empty but not required message", async () => {
          const row = {
            "WFM Availability": "",
            businessUnitId: "123-321",
            rowNumber: 2
          };
          const result = await availabilityValidation(row, initialTestState);
          expect(result).toEqual("WFM Availability is empty but not required. Skipping validation for row 2");
        });
        test("Availability provided, but BU for the row is invalid, reject with unable to validate message", async () => {
          const row = {
            "WFM Availability": "Availability1",
            businessUnitId: "fake bu",
            rowNumber: 2
          };
          try {
            await availabilityValidation(row, initialTestState);
          } catch (e) {
            expect(e).toEqual(JSON.stringify({
              rowNumber: 2,
              error: "Unable to validate WFM Availability due to invalid Business Unit for row 2"
            }));
          }
        });
        test("Availability provided but invalid, reject with invalid message ", async () => {
          const row = {
            "WFM Availability": "fake availability",
            businessUnitId: "123-321",
            rowNumber: 2
          };
          try {
            await availabilityValidation(row, initialTestState);
          } catch (e) {
            expect(e).toEqual(JSON.stringify({
              rowNumber: 2,
              error: "WFM Availability is invalid for row 2"
            }));
          }
        });
        test("Availability and BU are both valid, resolve and add availability id to row", async () => {
          const row = {
            "WFM Availability": "Availability1",
            businessUnitId: "123-321",
            rowNumber: 2
          };
          const result = await availabilityValidation(row, initialTestState);
          expect(result).toEqual("WFM Availability valid for row 2");
          expect(row).toEqual({
            ...row,
            wfmAvailabilityId: "123123"
          });
        });
        test("Error thrown for missing BU availibilities, reject", async () => {
          const row = {
            "WFM Availability": "Availability1",
            businessUnitId: "123-321",
            rowNumber: 2
          };
          try {
            await availabilityValidation(row, {
              calabrioContext: {
                wfmOptions: [
                  {
                    Id: "123-321"
                  }
                ]
              }
            });
          } catch (e) {
            expect(JSON.parse(e).rowNumber).toBe(2);
            expect(JSON.parse(e).error).toContain("Error encountered validating WFM Availability for row 2:");
          }
        });
      });
      describe("options", () => {
        const optionsFunction = FIELDS.CALABRIO_WFM_AVAILABILITY.options;
        test("State and BU Id are passed into function, returns options", () => {
          const options = optionsFunction(initialTestState, "123-321");
          expect(options).toEqual(["Availability1"]);
        });
        test("No Business unit id is passed into options function, returns unable to generate message", () => {
          const options = optionsFunction(initialTestState);
          expect(options).toEqual(["unable to generate options"]);
        });
      });
    });
    describe("CALABRIO_WFM_OPTIONAL_COLUMNS", () => {
      describe("validateFunction", () => {
        const optionalColsValidation = FIELDS.CALABRIO_WFM_OPTIONAL_COLUMNS.validateFunction;
        test("No Optional Columns provided, resolve with empty but not required message", async () => {
          const row = {
            "WFM Optional Columns": "",
            businessUnitId: "123-321",
            rowNumber: 4
          };
          const result = await optionalColsValidation(row, initialTestState);
          expect(result).toEqual("WFM Optional Columns is empty but not required. Skipping validation for row 4");
        });
        test("Optional columns provided, but BU is invalid for the row, reject with invalid bu message", async () => {
          const row = {
            "WFM Optional Columns": "OptionalCol1:OptionalColValue1",
            businessUnitId: "fake bu",
            rowNumber: 4
          };
          try {
            await optionalColsValidation(row, initialTestState);
          } catch (e) {
            expect(e).toEqual(JSON.stringify({
              rowNumber: 4,
              error: "Unable to validate WFM Optional Columns due to invalid Business Unit for row 4"
            }));
          }
        });
        test("One optional column provided, is valid, resolve and add id to row", async () => {
          const row = {
            "WFM Optional Columns": "OptionalCol1:OptionalColValue1",
            businessUnitId: "123-321",
            rowNumber: 4
          };
          const result = await optionalColsValidation(row, initialTestState);
          expect(result).toEqual("WFM Optional Columns valid for row 4");
          expect(row).toEqual({
            ...row,
            wfmOptionalColumns: [{
              Id: "111",
              Value: "OptionalColValue1"
            }]
          });
        });
        test("Multiple op columns provided, one is bad, reject with invalid message", async () => {
          const row = {
            "WFM Optional Columns": "OptionalCol1:OptionalColValue1, fakeCol:fakeColValue",
            businessUnitId: "123-321",
            rowNumber: 4
          };
          try {
            await optionalColsValidation(row, initialTestState);
          } catch (e) {
            expect(e).toEqual(JSON.stringify({
              rowNumber: 4,
              error: "fakecol is not valid for the selected business unit for row 4"
            }));
          }
        });
        test("Duplicate op columns provided, reject with invalid message", async () => {
          const row = {
            "WFM Optional Columns": "OptionalCol1:OptionalColValue1, OptionalCol1:OptionalColValue1",
            businessUnitId: "123-321",
            rowNumber: 4
          };
          try {
            await optionalColsValidation(row, initialTestState);
          } catch (e) {
            expect(e).toEqual(JSON.stringify({
              rowNumber: 4,
              error: "Duplicate WFM Optional Column optionalcol1 for row 4"
            }));
          }
        });
        test("Lots of problems, reject with invalid message", async () => {
          const row = {
            "WFM Optional Columns": "  OptionalCol1   , OptionalCol2:OptionalColValue2, OptionalCol3   :   , fakeCol:fakeColValue          ,OptionalCol1:OptionalColValue1",
            businessUnitId: "123-321",
            rowNumber: 4
          };
          try {
            await optionalColsValidation(row, initialTestState);
          } catch (e) {
            expect(e).toEqual(JSON.stringify({
              rowNumber: 4,
              error: "No value given for WFM Optional Column optionalcol1 for row 4,"
                + "No value given for WFM Optional Column optionalcol3 for row 4,"
                + "fakecol is not valid for the selected business unit for row 4,"
                + "Duplicate WFM Optional Column optionalcol1 for row 4"
            }));
          }
        });
        test("Multiple op columns provided, all are valid, resolve with message and add ids to the row", async () => {
          const row = {
            "WFM Optional Columns": "OptionalCol1:OptionalColValue1, OptionalCol2:OptionalColValue2",
            businessUnitId: "123-321",
            rowNumber: 4
          };
          const result = await optionalColsValidation(row, initialTestState);
          expect(result).toEqual("WFM Optional Columns valid for row 4");
          expect(row).toEqual({
            ...row,
            wfmOptionalColumns: [{
              Id: "111",
              Value: "OptionalColValue1"
            },
            {
              Id: "222",
              Value: "OptionalColValue2"
            }]
          });
        });
      });
      describe("options", () => {
        const optionsFunction = FIELDS.CALABRIO_WFM_OPTIONAL_COLUMNS.options;
        test("State and BU Id are passed into function, returns options", () => {
          const options = optionsFunction(initialTestState, "123-321");
          expect(options).toEqual(["OptionalCol1", "OptionalCol2", "OptionalCol3"]);
        });
        test("No Business unit id is passed into options function, returns unable to generate message", () => {
          const options = optionsFunction(initialTestState);
          expect(options).toEqual(["unable to generate options"]);
        });
      });
    });
    describe("CALABRIO_WFM_NOTES", () => {
      describe("validateFunction", () => {
        const notesValidation = FIELDS.CALABRIO_WFM_NOTE.validateFunction;
        test("No availability provided, resolve with the empty but not required message", async () => {
          const row = {
            "Note": "",
            rowNumber: 2
          };
          const result = await notesValidation(row, initialTestState);
          expect(result).toEqual("Note is empty but not required. Skipping validation for row 2");
        });
        test("Error thrown for missing BU availibilities, reject", async () => {
          const row = {
            "Note": undefined,
            rowNumber: 2
          };
          try {
            await notesValidation(row, initialTestState);
          } catch (e) {
            expect(JSON.parse(e).rowNumber).toBe(2);
            expect(JSON.parse(e).error).toContain("Cannot read properties of undefined (reading 'trim')");
          }
        });
        test("Notes are valid, resolve and add availability id to row", async () => {
          const row = {
            "Note": "Yay Cats!",
            rowNumber: 2
          };
          const result = await notesValidation(row, initialTestState);
          expect(result).toEqual("Note valid for row 2");
          expect(row).toEqual({
            ...row,
            wfmNote: "Yay Cats!"
          });
        });
      });
    });
  });
});
