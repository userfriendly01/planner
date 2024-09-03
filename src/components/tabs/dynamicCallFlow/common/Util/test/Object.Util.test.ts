import {
  keyDoesNotExist, keyExists
} from "dynamicCallFlowCommon/Util/Object.Util";

describe("Object.Util", () => {
  describe("keyExists", () => {
    it("shouldReturnTrueWhenKeyExistsInObject", () => {
      const obj: any = {
        key1: "value1",
        key2: "value2"
      };
      expect(keyExists(obj, "key1")).toBe(true);
    });

    it("shouldReturnFalseWhenKeyDoesNotExistInObject", () => {
      const obj: any = {
        key1: "value1",
        key2: "value2"
      };
      expect(keyExists(obj, "key3")).toBe(false);
    });

    it("shouldReturnFalseWhenObjectIsNull", () => {
      const obj: any =null;
      expect(keyExists(obj, "key1")).toBe(false);
    });

    it("shouldReturnFalseWhenObjectIsUndefined", () => {
      const obj: any =undefined;
      expect(keyExists(obj, "key1")).toBe(false);
    });

    it("shouldReturnFalseWhenObjectIsNotAnObject", () => {
      const obj: any ="not an object";
      expect(keyExists(obj, "key1")).toBe(false);
    });
  });

  describe("keyDoesNotExist", () => {
    it("shouldReturnFalseWhenKeyExistsInObject", () => {
      const obj: any = {
        key1: "value1",
        key2: "value2"
      };
      expect(keyDoesNotExist(obj, "key1")).toBe(false);
    });

    it("shouldReturnTrueWhenKeyDoesNotExistInObject", () => {
      const obj: any = {
        key1: "value1",
        key2: "value2"
      };
      expect(keyDoesNotExist(obj, "key3")).toBe(true);
    });

    it("shouldReturnTrueWhenObjectIsNull", () => {
      const obj: any =null;
      expect(keyDoesNotExist(obj, "key1")).toBe(true);
    });

    it("shouldReturnTrueWhenObjectIsUndefined", () => {
      const obj: any =undefined;
      expect(keyDoesNotExist(obj, "key1")).toBe(true);
    });

    it("shouldReturnTrueWhenObjectIsNotAnObject", () => {
      const obj: any ="not an object";
      expect(keyDoesNotExist(obj, "key1")).toBe(true);
    });
  });
});