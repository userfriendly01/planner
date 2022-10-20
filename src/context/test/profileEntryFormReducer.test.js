import {
  profileEntryFormReducer,
  initialProfileEntryFormState,
  profileEntryFormActions
} from "context";
import { formModes } from "globals";
import {
  managerList,
  mockWorkers,
  profileList,
  validFormOptions
} from "testUtils";

describe("userFormReducer", () => {

  describe("Default Case", () => {
    test("should return state", () => {
      const action = { type: "default" };
      const result = profileEntryFormReducer(initialProfileEntryFormState, action);
      expect(result).toStrictEqual(initialProfileEntryFormState);
    });
  });

});