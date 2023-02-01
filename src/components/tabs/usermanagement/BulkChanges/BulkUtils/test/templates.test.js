import {
  getCreateTemplates
} from "../templates";
import {
  fetchUser,
  generateExtension
} from "services";
import { initialTestState } from "testUtils";

jest.mock("services", () => ({
  fetchUser: jest.fn(),
  generateExtension: jest.fn()
}));

describe("templates", () => {
  describe("TritonFields Validations", () => {
    const templates = getCreateTemplates(initialTestState);

    const tritonFields = templates.CREATE_TRITON_USER.fields;

    describe("Field: N Number", () => {
      const NNumberValidateFunction = tritonFields.find(f => f.field === "nNumber").validateFunction;
      test.only("No matching N number field, rejects with N Number is missing from row message", async () => {
        try {
          await NNumberValidateFunction({ "boo": "ya" }, 1);
        } catch (e) {
          expect(e).toEqual("N Number is missing from row 1");
          expect(fetchUser).toHaveBeenCalledTimes(0);
        }
      });
      test("N Number is not a string, rejects with invalid n nubmer message", async () => {
        try {
          await NNumberValidateFunction({ "N Number": 12 }, 1);
        } catch (e) {
          expect(e).toEqual("N Number is not in the valid n number format for row 1");
          expect(fetchUser).toHaveBeenCalledTimes(0);
        }
      });
      test("N Number is not 8 characters, rejects with invalid n nubmer message", async () => {
        try {
          await NNumberValidateFunction({ "N Number": "superlongnnumber" }, 1);
        } catch (e) {
          expect(e).toEqual("N Number is not in the valid n number format for row 1");
          expect(fetchUser).toHaveBeenCalledTimes(0);
        }
      });
      test("Error while calling fetchUser, rejects with Error message", async () => {
        fetchUser.mockRejectedValue("nope");
        try {
          await NNumberValidateFunction({ "N Number": "n1234567" }, 4);
        } catch (e) {
          expect(e).toEqual("Error thrown fetching N Number from HR Database for row 4");
          expect(fetchUser).toHaveBeenCalledTimes(1);
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
        const result = await NNumberValidateFunction(row, 1);
        expect(result).toEqual("N Number Valid for row 1");
      });

    });
    describe("profileId", () => {
      const validateFunction = tritonFields.find(f => f.field === "profileId").validateFunction;
      test("No matching profile id field, rejects with message", async () => {
        try {
          await validateFunction({}, 3);
        } catch (e) {
          expect(e).toEqual("Profile Id is missing from row 3");
        }
      });
      test("profile id is not a number, rejects with message", async () => {
        try {
          await validateFunction({ "Profile Id": "what" }, 3);
        } catch (e) {
          // expect(e).toEqual("Profile Id must be a number for row 3");
        }
      });
      test("profile id does not exist in the profiles, rejects with message", async () => {
        try {
          await validateFunction({ "Profile Id": 100 }, 3);
        } catch (e) {
          expect(e).toEqual("Profile Id is not a valid option for row 3");
        }
      });
      test("Profile id is valid, resolves with message", async () => {
        const result = await validateFunction({ "Profile Id": 1 }, 3);
        expect(result).toEqual("Profile Id Valid for row 3");
      });
    });
    describe("managerNNumber", () => {
      const validateFunction = tritonFields.find(f => f.field === "managerNNumber").validateFunction;
      // test("No matching manager n number field, rejects with message", async () => {
      //   try {
      //     await validateFunction({ "boo": "no" }, 9);
      //   } catch (e) {
      //     expect(e).toEqual("Manager N Number is missing from row 9");
      //   }
      // });
      test("No matching manager object, rejects with message", async () => {
        try {
          await validateFunction({ "Manager N Number": "n1111111" }, 9);
        } catch (e) {
          expect(e).toEqual("Manager N Number is not a valid option for row 9");
        }
      });
      test("Good manager match, resolves with message", async () => {
        const results = await validateFunction({ "Manager N Number": "n1234567" }, 7);
        expect(results).toEqual("Manager N Number Valid for row 7");
      });
    });
    // TODO- STILL NEED TO DO THIS ONE
    describe("defaultSkills", () => {
      // const validateFunction = tritonFields.find(f => f.field === "defaultSkills").validateFunction;
      // test("", async () => {});
      // test("", async () => {});
    });
    describe("extension", () => {
      const validateFunction = tritonFields.find(f => f.field === "extension").validateFunction;
      test("No matching exetension field, rejects with message", async () => {
        try {
          await validateFunction({}, 6);
        } catch (e) {
          expect(e).toEqual("No extension is set for row 6");
        }
      });
      // 
      test("New extension is true, generate Extension fails, rejects with message", async () => {
        generateExtension.mockRejectedValueOnce("boo");
        try {
          await validateFunction({ "Extension": "Y" }, 6);
        } catch (e) {
          expect(e).toEqual("Unable to generate Extension for row 6");
        }
      });
      test("New extension is true, generate Extension succeeds, resolves with message", async () => {
        generateExtension.mockResolvedValueOnce("123");
        const result = await validateFunction({ "Extension": "Y" }, 6);
        expect(result).toEqual("Extension 123 set for row 6");
      });
      test("New extension is false, field is not a number or string, rejects with message", async () => {
        try {
          await validateFunction({ "Extension": ["boo"]}, 6);
        } catch (e) {
          expect(e).toEqual("Extension must be a number or 'Y' for row 6. If you do not want an extension for this user, leave the field blank");
        }
      });
      test("New extension is false, extension is taken rejects with message", async () => {
        try {
          await validateFunction({ "Extension": 1234 }, 6);
        } catch (e) {
          expect(e).toEqual("Extension 1234 is already taken for row 6");
        }
      });
      test("New extension is false, extension is not taken resolves with message", async () => {
        try {
          await validateFunction({ "Extension": 876 }, 6);
        } catch (e) {
          expect(e).toEqual("Extension 876 set for row 6");
        }
      });
      // test("", async () => {});
    });
    describe("didUser", () => {});
    describe("directDialNumber", () => {});
    describe("zeroOutEnabled", () => {});
    describe("outgoingNumber", () => {});
  });
});