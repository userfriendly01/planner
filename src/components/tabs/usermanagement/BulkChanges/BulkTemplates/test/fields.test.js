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
      } catch(err) {
        expect(err).toEqual(new Error("Did User field needs to be 'Y' or 'N' for row 3"));
      }
    });
    test("didField is not y or n, reject with message", () => {
      try {
        isDidUser("hello", 1);
      } catch(err) {
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
            did: "16038518200"
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
            did: "16038518200"
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
            1, 2, 3, 396
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
          fetchUser.mockRejectedValue("Aww")
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
          })
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
          })
        });
        test("n# fetch succeeds, attributes are present", async () => {
          fetchUser.mockResolvedValue({
            lastName: "Shatz",
            firstName: "Carl"
          })
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
          })
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
            did: "16038518200"
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
            attributes: {}
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
              error: "Default Skills Errors found for row 5 aisgl1 does not support Level boo."
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
              error: "Default Skills Errors found for row 5 fakeskill is not an available skill "
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
              error: "Default Skills Errors found for row 5 aisgl1 does not support Level 3."
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
                levels: { lscobdialer1: 2 },
                skills: [
                  "aisgl1", "lscobdialer1"
                ]
              }
            }
          });
        });
        test("attributes is already on successful row, returns successful response, resolves with field is valid message", async () => {
          const existingAttributes = {
            did: "16038518200"
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
      });
      describe("options", () => {
        const optionsFunction = FIELDS.DEFAULT_SKILLS.options;
        test("returns the profile id options", () => {
          const options = optionsFunction(initialTestState);
          expect(options).toEqual([
            "lscOBDialer1 Available levels: 1,2,3",
            "aisgL1",
            "bscCommisssions Available levels: 1,2,3,4,5,6,7",
            "bscCbsL2",
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
            did: "16038518200"
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
            directDialNum: "+16035556565",
            activateEp: true,
            alternateDid: "+16035556565",
            attributes: {
              did: "+16035556565",
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
            directDialNum: "+16035556565",
            activateEp: true,
            alternateDid: "+16035556565",
            attributes: {
              did: "+16035556565"
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
              did: "+16035554545"
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
              did: "+16035554545",
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
            "Hawaii 50 Group",
            "FNOL Group",
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
          }
          await calabrioTeamValidation(row, initialTestState);
          expect(row).toEqual(row);
        });
        test("Calabrio Team already exists with no groupId, reject with message", async () => {
          const row = {
            rowNumber: 9,
            "Calabrio Team": "Hawaii Team 50"
          }
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
          } catch(e){
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
          }
          try {
            await calabrioTeamValidation(row, initialTestState);
          } catch(e){
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
          }
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
            "Hawaii Team 50",
            "Hawaii Specialty Team",
            "FNOL Team"
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
            "Hawaii Team 50",
            "Hawaii Specialty Team",
            "FNOL Team"
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
          }
          await calabrioGroupValidation(row, initialTestState);
          expect(row).toEqual(row);
        });
        test("Calabrio Team already exists with no groupId, reject with message", async () => {
          const row = {
            rowNumber: 9,
            "Calabrio Team": "Hawaii Team 50"
          }
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
          } catch(e){
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
          }
          try {
            await calabrioGroupValidation(row, initialTestState);
          } catch(e){
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
          }
          await calabrioGroupValidation(row, initialTestState);
          expect(row).toEqual(row);
        });
      });
      describe("options", () => {
        const optionsFunction = FIELDS.CALABRIO_GROUP.options;
        test("returns the profile id options", () => {
          const options = optionsFunction(initialTestState);
          expect(options).toEqual([
            "Hawaii 50 Group",
            "FNOL Group",
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
            "Calabrio Role": "Supervisor, QM Agent"
          };
          const result = await calabrioRolesValidation(row, initialTestState);
          expect(result).toEqual("Calabrio Role valid for row 1");
          expect(row).toEqual({
            ...row,
            roles: [
              {
                id: 1,
                name: "Supervisor"
              },
              {
                id: 2,
                name: "QM Agent"
              }
            ]
          });
        });
        test("Multiple roles provided, 1 is bad, reject with message", async () => {
          const row = {
            rowNumber: 1,
            "Calabrio Role": "Supervisor,fake"
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
                  id: 1,
                  name: "Supervisor"
                }
              ]
            });
          }
        });
        test("1 good role provided, resolves with message", async () => {
          const row = {
            rowNumber: 1,
            "Calabrio Role": "Supervisor"
          };
          const result = await calabrioRolesValidation(row, initialTestState);
          expect(result).toEqual("Calabrio Role valid for row 1");
          expect(row).toEqual({
            ...row,
            roles: [
              {
                id: 1,
                name: "Supervisor"
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
            "Supervisor",
            "Agent-Sync Only",
            "No Screen",
            "QM Agent",
            "WFM_Agent_TT_Dashboards",
            "WFM_Supervisor_TT_Dashboards",
            "WFM_Supervisor_NT_Dashboards",
            "WFM_Agent_NT_Dashboards",
            "Live Monitoring",
            "Recording Access",
            "EXL_Genpact",
            "QM Agent_No Live Monitoring"
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
            "America/New_York (EST/EDT)",
            "America/Los_Angeles (PST/PDT)",
            "America/Denver (MST/MDT)",
            "America/Chicago (CST/CDT)",
            "America/Phoenix (MST)",
            "Pacific/Honolulu (HST)",
            "America/Anchorage (AKST/AKDT)"
          ]);
        });
      });
    });
  });
});