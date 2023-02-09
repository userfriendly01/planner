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
            await NNumberValidateFunction({ "boo": "ya" }, 1, initialTestState);
          } catch (e) {
            expect(e).toEqual("N Number is missing from row 1");
            expect(fetchUser).toHaveBeenCalledTimes(0);
          }
        });
        test("N Number is not a string, rejects with invalid n nubmer message", async () => {
          try {
            await NNumberValidateFunction({ "N Number": 12 }, 1, initialTestState);
          } catch (e) {
            expect(e).toEqual("N Number is not in the valid n number format for row 1");
            expect(fetchUser).toHaveBeenCalledTimes(0);
          }
        });
        test("N Number is not 8 characters, rejects with invalid n nubmer message", async () => {
          try {
            await NNumberValidateFunction({ "N Number": "superlongnnumber" }, 1, initialTestState);
          } catch (e) {
            expect(e).toEqual("N Number is not in the valid n number format for row 1");
            expect(fetchUser).toHaveBeenCalledTimes(0);
          }
        });
        test("Error while calling fetchUser, rejects with Error message", async () => {
          fetchUser.mockRejectedValue("nope");
          try {
            await NNumberValidateFunction({ "N Number": "n1234567" }, 4, initialTestState);
          } catch (e) {
            expect(e).toEqual("Error thrown fetching N Number from HR Database for row 4");
            expect(fetchUser).toHaveBeenCalledTimes(1);
          }
        });
        test("worker already exists, reject with error", async () => {
          try {
            await NNumberValidateFunction({ "N Number": "n0000000" }, 4, initialTestState);
          } catch (e) {
            expect(e).toEqual("n0000000 already has a record in Twilio/Worker Database row 4");
            expect(fetchUser).toHaveBeenCalledTimes(0);
          }
        });
        test("fetch returns successful response, resolves with field is valid message", async () => {
          fetchUser.mockResolvedValue({
            contact_uri: "client:asdf",
            department_id: "123",
            email: "hi@lmig.com",
            department_name: "grm",
            email_address: "hi@lmig.com"
          });
          const row = {
            "N Number": "n1234567"
          };
          const result = await NNumberValidateFunction(row, 1, initialTestState);
          expect(result).toEqual("N Number Valid for row 1");
        });
      });
    });
    describe("N_NUMBER_UPDATE", () => {
      describe("validateFunction", () => {
        const nNumUpdateValidation = FIELDS.N_NUMBER_UPDATE.validateFunction;
        test("field is missing from the row data, rejects with message", async () => {
          try {
            await nNumUpdateValidation({ "no n number field": "what?" }, 2, initialTestState);
          } catch (err) {
            expect(err).toEqual("N Number is missing from row 2");
          }
        });
        test("the field is not a string, reject with message", async () => {
          try {
            await nNumUpdateValidation({ "N Number": 16 }, 2, initialTestState);
          } catch (err) {
            expect(err).toEqual("N Number is not in the valid n number format for row 2");
          }
        });
        test("the field is not 8 characters long, reject with message", async () => {
          try {
            await nNumUpdateValidation({ "N Number": "long string" }, 2, initialTestState);
          } catch (err) {
            expect(err).toEqual("N Number is not in the valid n number format for row 2");
          }
        });
        test("the field is an 8 character string, but doesn't match a worker, reject with message", async () => {
          try {
            await nNumUpdateValidation({ "N Number": "n9999999" }, 2, initialTestState);
          } catch (err) {
            expect(err).toEqual("n9999999 is not an existing setup worker in Triton for row 2");
          }
        });
        test("the field is 8 character string, has a worker match, resolves", async () => {
          const result = await nNumUpdateValidation({ "N Number": "n0000000" }, 2, initialTestState);
          expect(result).toEqual("N Number Valid for row 2");
        });
      });

    });
    describe("PROFILE_ID", () => {
      describe("validateFunction", () => {
        const profileValidateFunction = FIELDS.PROFILE_ID.validateFunction;
        test("No matching profile id field, rejects with message", async () => {
          try {
            await profileValidateFunction({}, 3, initialTestState);
          } catch (e) {
            expect(e).toEqual("Profile Id is either missing or is not a number for row 3");
          }
        });
        test("profile id is not a number, rejects with message", async () => {
          try {
            await profileValidateFunction({ "Profile Id": "what" }, 3, initialTestState);
          } catch (e) {
            expect(e).toEqual("Profile Id is either missing or is not a number for row 3");
          }
        });
        test("profile id does not exist in the profiles, rejects with message", async () => {
          try {
            await profileValidateFunction({ "Profile Id": 100 }, 3, initialTestState);
          } catch (e) {
            expect(e).toEqual("Profile Id is not a valid option for row 3");
          }
        });
        test("Profile id is valid, resolves with message", async () => {
          const result = await profileValidateFunction({ "Profile Id": 1 }, 3, initialTestState);
          expect(result).toEqual("Profile Id Valid for row 3");
        });
      });

    });
    describe("MANAGER_N_NUMBER", () => {
      describe("validateFunction", () => {
        const managerValidateFunction = FIELDS.MANAGER_N_NUMBER.validateFunction;
        test("No matching manager n number field, rejects with message", async () => {
          try {
            await managerValidateFunction({ "boo": "no" }, 9, initialTestState);
          } catch (e) {
            expect(e).toEqual("Manager N Number is missing from row 9");
          }
        });
        test("No matching manager object, rejects with message", async () => {
          try {
            await managerValidateFunction({ "Manager N Number": "n1111111" }, 9, initialTestState);
          } catch (e) {
            expect(e).toEqual("Manager N Number is not a valid option for row 9");
          }
        });
        test("Good manager match, resolves with message", async () => {
          const results = await managerValidateFunction({ "Manager N Number": "n1234567" }, 7, initialTestState);
          expect(results).toEqual("Manager N Number Valid for row 7");
        });
      });

    });
    // TODO: THIS
    describe("DEFAULT_SKILLS", () => {
      describe("validateFunction", () => {});

    });
    describe("EXTENSION", () => {
      describe("validateFunction", () => {
        const exetensionValidateFunction = FIELDS.EXTENSION.validateFunction;
        test("No matching extension field, rejects with message", async () => {
          try {
            await exetensionValidateFunction({}, 6, initialTestState);
          } catch (e) {
            expect(e).toEqual("No extension is set for row 6");
          }
        });
        // 
        test("New extension is true, generate Extension fails, rejects with message", async () => {
          generateExtension.mockRejectedValueOnce("boo");
          try {
            await exetensionValidateFunction({ "Extension": "Y" }, 6, initialTestState);
          } catch (e) {
            expect(e).toEqual("Unable to generate Extension for row 6");
          }
        });
        test("New extension is true, generate Extension succeeds, resolves with message", async () => {
          generateExtension.mockResolvedValueOnce("123");
          const result = await exetensionValidateFunction({ "Extension": "Y" }, 6, initialTestState);
          expect(result).toEqual("Extension 123 set for row 6");
        });
        test("New extension is false, field is not string, rejects with message", async () => {
          try {
            await exetensionValidateFunction({ "Extension": 5 }, 6, initialTestState);
          } catch (e) {
            expect(e).toEqual("Extension must be a number or 'Y' for row 6. If you do not want an extension for this user, leave the field blank");
          }
        });
        test("New extension is false, field is n, resolves with skip message", async () => {
          const result = await exetensionValidateFunction({ "Extension": "n" }, 6, initialTestState);
          expect(result).toEqual("Extension skipped for row 6.");
        });
        test("New extension is false, field returns NaN on parseInt, resolves with skip message", async () => {
          try {
            await exetensionValidateFunction({ "Extension": "boo" }, 6, initialTestState);
          } catch (e) {
            expect(e).toEqual("Extension is in the wrong format for row 6.");
          }
        });
        test("New extension is false, extension is taken, rejects with message", async () => {
          try {
            await exetensionValidateFunction({ "Extension": 1234 }, 6, initialTestState);
          } catch (e) {
            expect(e).toEqual("Extension 1234 is already taken for row 6");
          }
        });
        test("New extension is false, extension is not taken, resolves with message", async () => {
          try {
            await exetensionValidateFunction({ "Extension": 876 }, 6, initialTestState);
          } catch (e) {
            expect(e).toEqual("Extension 876 set for row 6");
          }
        });
      });

    });
    describe("DID_USER", () => {
      describe("validateFunction", () => {
        const DIDUserValidateFunction = FIELDS.DID_USER.validateFunction;
        test("Did user field is 'Y', resolves", async () => {
          const result = await DIDUserValidateFunction({ "Did User": "Y" }, 7, initialTestState);
          expect(result).toEqual("Did User y set for row 7");
        });
        test("Did user field is 'N', resolves", async () => {
          const result = await DIDUserValidateFunction({ "Did User": "N" }, 7, initialTestState);
          expect(result).toEqual("Did User n set for row 7");
        });
        test("Field is not a valid string", async () => {
          try {
            await DIDUserValidateFunction({ "Did User": 56 }, 7, initialTestState);
          } catch (e) {
            expect(e).toEqual("Did User needs to be 'Y' or 'N' for row 7");
          }
        });
      });

    });
    describe("DIRECT_DIAL_NUMBER", () => {
      describe("validateFunction", () => {
        const DIDNumberValidateFunction = FIELDS.DIRECT_DIAL_NUMBER.validateFunction;
        test("No matching didField field, rejects with message", async () => {
          try {
            await DIDNumberValidateFunction({ "boo": "what" }, 4);
          } catch (e) {
            expect(e).toEqual("Did User needs to be 'Y' or 'N' for row 4");
          }
        });
        test("didField field is not a string, rejects with message", async () => {
          try {
            await DIDNumberValidateFunction({ "Did User": 12 }, 4);
          } catch (e) {
            expect(e).toEqual("Did User needs to be 'Y' or 'N' for row 4");
          }
        });
        test("didField field is not a Y or N, rejects with message", async () => {
          try {
            await DIDNumberValidateFunction({ "Did User": "boo" }, 4);
          } catch (e) {
            expect(e).toEqual("Did User needs to be 'Y' or 'N' for row 4");
          }
        });
        test("didField field is N, rejects with message", async () => {
          try {
            await DIDNumberValidateFunction({
              "Did User": "N",
              "Direct Dial Number": "1231231234"
            }, 4);
          } catch (e) {
            expect(e).toEqual("Did User field is 'N', Direct Dial Number is not applicable for row 4");
          }
        });
        test("didField field is N, No DID Number provided resolves with skip mesesage", async () => {
          const result = await DIDNumberValidateFunction({
            "Did User": "N"
          }, 4);
          expect(result).toEqual("Direct Dial Number skipped for Non DID user for row 4");
        });
        test("didField field is N, DID Number is empty resolves with skip mesesage", async () => {
          const result = await DIDNumberValidateFunction({
            "Did User": "N",
            "Direct Dial Number": ""
          }, 4);
          expect(result).toEqual("Direct Dial Number skipped for Non DID user for row 4");
        });
        test("didField field is Y but direct dial number not provided, rejects with message", async () => {
          try {
            await DIDNumberValidateFunction({
              "Did User": "Y"
            }, 4);
          } catch (e) {
            expect(e).toEqual("Direct Dial Number is required when DID user is 'Y' for row 4");
          }
        });
        test("didField field is Y but direct dial number in wrong format, rejects with message", async () => {
          try {
            await DIDNumberValidateFunction({
              "Did User": "Y",
              "Direct Dial Number": "31234"
            }, 4);
          } catch (e) {
            expect(e).toEqual("Direct Dial Number is not in the correct format for row 4");
          }
        });
        test("didField field is Y, direct dial number in correct format, resolves with message", async () => {
          const results = await DIDNumberValidateFunction({
            "Did User": "Y",
            "Direct Dial Number": "6035556565"
          }, 4);
          expect(results).toEqual("Direct Dial Number 6035556565 set for row 4");
        });
      });

    });
    describe("ZERO_OUT_ENABLED", () => {
      describe("validateFunction", () => {
        const ZeroOutEnabledValidateFunction = FIELDS.ZERO_OUT_ENABLED.validateFunction;
        test("No matching didField field, rejects with message", async () => {
          try {
            await ZeroOutEnabledValidateFunction({ "boo": "what" }, 4, initialTestState);
          } catch (e) {
            expect(e).toEqual("Did User needs to be 'Y' or 'N' for row 4");
          }
        });
        test("didField field is not a string, rejects with message", async () => {
          try {
            await ZeroOutEnabledValidateFunction({ "Did User": 12 }, 4, initialTestState);
          } catch (e) {
            expect(e).toEqual("Did User needs to be 'Y' or 'N' for row 4");
          }
        });
        test("didField field is not a Y or N, rejects with message", async () => {
          try {
            await ZeroOutEnabledValidateFunction({ "Did User": "boo" }, 4, initialTestState);
          } catch (e) {
            expect(e).toEqual("Did User needs to be 'Y' or 'N' for row 4");
          }
        });
        test("didField field is N, rejects with message", async () => {
          try {
            await ZeroOutEnabledValidateFunction({
              "Did User": "N",
              "Zero Out Enabled": "Y"
            }, 4, initialTestState);
          } catch (e) {
            expect(e).toEqual("Did User field is 'N', Zero Out Enabled is not applicable for row 4");
          }
        });
        test("didField field is Y, zero out enabled is not a string, rejects with message", async () => {
          try {
            await ZeroOutEnabledValidateFunction({
              "Did User": "Y",
              "Zero Out Enabled": 3
            }, 4, initialTestState);
          } catch (e) {
            expect(e).toEqual("Zero Out Enabled needs to be needs to be 'Y' or 'N' if DID user is 'Y' for 4");
          }
        });
        test("didField field is Y, zero out enabled is not a Y or N, rejects with message", async () => {
          try {
            await ZeroOutEnabledValidateFunction({
              "Did User": "Y",
              "Zero Out Enabled": "hi"
            }, 4, initialTestState);
          } catch (e) {
            expect(e).toEqual("Zero Out Enabled needs to be needs to be 'Y' or 'N' if DID user is 'Y' for 4");
          }
        });
        test("didField field is Y, zero out enabled is N, resolves with message", async () => {
          const result = await ZeroOutEnabledValidateFunction({
            "Did User": "Y",
            "Zero Out Enabled": "N"
          }, 4, initialTestState);
          expect(result).toEqual("Zero Out Enabled n set for row 4");
        });
        test("didField field is Y, zero out enabled is Y, profile id is wrong format, rejects with message", async () => {
          try {
            await ZeroOutEnabledValidateFunction({
              "Did User": "Y",
              "Zero Out Enabled": "Y",
              "Profile Id": "boo"
            }, 4, initialTestState);
          } catch (e) {
            expect(e).toEqual("Unable to set Zero Out Enabled. Incorrect format for Profile Id for row 4");
          }
        });
        test("didField field is Y, zero out enabled is Y, resolves with message", async () => {
          const result = await ZeroOutEnabledValidateFunction({
            "Did User": "Y",
            "Zero Out Enabled": "Y",
            "Profile Id": 2
          }, 4, initialTestState);
          expect(result).toEqual("Zero Out Enabled y set for row 4");
        });
      });

    });
    describe("OUTGOING_NUMBER", () => {
      describe("validateFunction", () => {
        const outgoingNumberValidateFunction = FIELDS.OUTGOING_NUMBER.validateFunction;
        test("Invalid value provided for Did User field, rejects with message", async () => {
          try {
            await outgoingNumberValidateFunction({
              "Did User": "booya",
              "Outgoing Number": "1231231234"
            }, 9, initialTestState);
          } catch (e) {
            expect(e).toEqual("Did User needs to be 'Y' or 'N' for row 9");
          }
        });
        test("DidUser is true, Outgoing number is provided, reject with message", async () => {
          try {
            await outgoingNumberValidateFunction({
              "Did User": "Y",
              "Outgoing Number": "1231231234"
            }, 9, initialTestState);
          } catch (e) {
            expect(e).toEqual("Did User field is 'Y', Outgoing Number is not applicable for row 9");
          }
        });
        test("DidUser is true, Outgoing number is not provided, resolve with message", async () => {
          const result = await outgoingNumberValidateFunction({
            "Did User": "Y",
            "Outgoing Number": ""
          }, 9, initialTestState);
          expect(result).toEqual("Outgoing Number skipped for DID user for row 9");
        });
        test("Did User is false, no Outgoing number provided, rejects with message", async () => {
          try {
            await outgoingNumberValidateFunction({
              "Did User": "N",
              "Outgoing Number": ""
            }, 9, initialTestState);
          } catch (e) {
            expect(e).toEqual("Outgoing Number is required when DID user is 'N' for row 9");
          }
        });
        test("DidUser is false, and Outgoing number is provided, getE164Number is successful, resolves with message", async () => {
          const result = await outgoingNumberValidateFunction({
            "Did User": "N",
            "Outgoing Number": "6035554545"
          }, 9, initialTestState);
          expect(result).toEqual("Outgoing Number 6035554545 set for row 9");
        });
        test("DidUser is false, Outgoing number is provided, but is not valid, rejects with message", async () => {
          try {
            await outgoingNumberValidateFunction({
              "Did User": "N",
              "Outgoing Number": "74"
            }, 9, initialTestState);
          } catch (e) {
            expect(e).toEqual("Outgoing Number is not in the correct format for row 9");
          }
        });
      });

    });
    describe("CALABRIO_SCOPE", () => {
      describe("validateFunction", () => {
        const calabrioScopeValidation = FIELDS.CALABRIO_SCOPE.validateFunction;
        test("No Calabrio Scope provided, resolve with skipped message", async () => {
          const result = await calabrioScopeValidation({}, 9, initialTestState);
          expect(result).toEqual("Calabrio Scope skipped for row 9");
        });
        test("Calabrio scope .split is empty array, resolve with skipped message", async () => {
          const result = await calabrioScopeValidation({ "Calabrio Scope": "" }, 9, initialTestState);
          expect(result).toEqual("Calabrio Scope skipped for row 9");
        });
        test("Calabrio scope has a value, no group or team found, rejects with message", async () => {
          try {
            await calabrioScopeValidation({
              "Calabrio Scope": "notReal"
            }, 9, initialTestState);
          } catch (e) {
            expect(e).toEqual("notreal is not a valid group or team for row 9");
          }
        });
        test("Calabrio scope has value, 1 group, resolves with message", async () => {
          const result = await calabrioScopeValidation({ "Calabrio Scope": "Hawaii 50 Group" }, 9, initialTestState);
          expect(result).toEqual("Calabrio Scope valid for row 9");
        });
        test("Calabrio scope has multiple good values, resolves with message", async () => {
          const result = await calabrioScopeValidation({ "Calabrio Scope": "Hawaii 50 Group, Hawaii Team 50" }, 9, initialTestState);
          expect(result).toEqual("Calabrio Scope valid for row 9");
        });
        test("Calabrio scope has multiple values, 1 bad value group, rejects with message", async () => {
          try {
            await calabrioScopeValidation({
              "Calabrio Scope": "Hawaii 50 Group,fakefake"
            }, 9, initialTestState);
          } catch (e) {
            expect(e).toEqual("fakefake is not a valid group or team for row 9");
          }
        });
        test("Bad value for Calabrio scope, rejects with message", async () => {
          try {
            await calabrioScopeValidation({
              "Calabrio Scope": 12
            }, 9, initialTestState);
          } catch (e) {
            expect(e).toEqual("12 is not a valid group or team for row 9");
          }
        });
      });

    });
    describe("CALABRIO_TEAM", () => {
      describe("validateFunction", () => {
        const calabrioTeamValidation = FIELDS.CALABRIO_TEAM.validateFunction;
        test("No Calabrio Team provided, reject with message", async () => {
          try {
            await calabrioTeamValidation({}, 9, initialTestState);
          } catch (e) {
            expect(e).toEqual("Calabrio Team is missing from row 9");
          }
        });
        test("Bad value for calabrio team, reject with message", async () => {
          try {
            await calabrioTeamValidation({ "Calabrio Team": "fake team" }, 9, initialTestState);
          } catch (e) {
            expect(e).toEqual("Calabrio Team is not a valid option for row 9");
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
            await calabrioTeamValidation({ "Calabrio Team": "fake team" }, 9, stateWithBadTeam);
          } catch (e) {
            expect(e).toEqual("Calabrio Team is not a valid option for row 9");
          }
        });
        test("Good Calabrio Team value, resolves with message", async () => {
          const result = await calabrioTeamValidation({ "Calabrio Team": "Hawaii Team 50" }, 9, initialTestState);
          expect(result).toEqual("Calabrio Team valid for row 9");
        });
      });

    });
    describe("CALABRIO_ROLES", () => {
      describe("validateFunction", () => {
        const calabrioRolesValidation = FIELDS.CALABRIO_ROLES.validateFunction;
        test("No Calabrio Role provided, rejects with message", async () => {
          try {
            await calabrioRolesValidation({}, 1, initialTestState);
          } catch (e) {
            expect(e).toEqual("Calabrio Role is missing from row 1");
          }
        });
        test("Value for Calabrio Role .split has 0 length, reject with message", async () => {
          try {
            await calabrioRolesValidation({ "Calabrio Role": "" }, 1, initialTestState);
          } catch (e) {
            expect(e).toEqual("Calabrio Role is missing from row 1");
          }
        });
        test("Multiple roles provided, all are good, resolve with message", async () => {
          const result = await calabrioRolesValidation({ "Calabrio Role": "Supervisor, QM Agent" }, 1, initialTestState);
          expect(result).toEqual("Calabrio Role valid for row 1");
        });
        test("Multiple roles provided, 1 is bad, reject with message", async () => {
          try {
            await calabrioRolesValidation({ "Calabrio Role": "Supervisor,fake" }, 1, initialTestState);
          } catch (e) {
            expect(e).toEqual("fake is not a valid role for row 1");
          }
        });
        test("1 good role provided, resolves with message", async () => {
          const result = await calabrioRolesValidation({ "Calabrio Role": "Supervisor" }, 1, initialTestState);
          expect(result).toEqual("Calabrio Role valid for row 1");
        });
        test("1 bad role provided, rejects with message", async () => {
          try {
            await calabrioRolesValidation({ "Calabrio Role": "fake" }, 1, initialTestState);
          } catch (e) {
            expect(e).toEqual("fake is not a valid role for row 1");
          }
        });
      });

    });
    describe("CALABRIO_TIME_ZONE", () => {
      describe("validateFunction", () => {
        const timezoneValidation = FIELDS.CALABRIO_TIME_ZONE.validateFunction;
        test("No timezone provided, reject with missing message", async () => {
          try {
            await timezoneValidation({}, 1, initialTestState);
          } catch (e) {
            expect(e).toEqual("Time Zone is missing from row 1");
          }
        });
        test("Timezone is not a valid timezone, reject with message", async () => {
          try {
            await timezoneValidation({ "Time Zone": "fake" }, 1, initialTestState);
          } catch (e) {
            expect(e).toEqual("Time Zone is not a valid option for row 1");
          }
        });
        test("Timezone is valid, resolve with message", async () => {
          const result = await timezoneValidation({ "Time Zone": "America/New_York (EST/EDT)" }, 1, initialTestState);
          expect(result).toEqual("Time Zone valid for row 1");
        });
      });

    });
  });
});