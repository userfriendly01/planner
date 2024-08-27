import {
  dataFromLocalStorageHasExpired,
  retrieveDataFromLocalStorage
} from "dynamicCallFlowCommon/Util/LocalStorage.Util";

import { MockLocalStorage } from "dynamicCallFlowCommon/test/DynamicCallFlow.Testing.Util";


describe("LocalStorage.Util", () => {
  Object.defineProperty(window, "localStorage", { value: MockLocalStorage });

  it("shouldReturnTrueIfDataHasExpired", () => {
    const key = "testKey";
    localStorage.setItem(key.concat("_lastCachedDate"), new Date(Date.now() - 90000000).toString());
    const result = dataFromLocalStorageHasExpired(key);
    expect(result).toBe(true);
  });

  it("shouldReturnFalseIfDataHasNotExpired", () => {
    const key = "testKey";
    localStorage.setItem(key.concat("_lastCachedDate"), new Date().toString());
    const result = dataFromLocalStorageHasExpired(key);
    expect(result).toBe(false);
  });

  it("shouldReturnTrueIfNoCachedDateExists", () => {
    const key = "testKey";
    localStorage.removeItem(key.concat("_lastCachedDate"));
    const result = dataFromLocalStorageHasExpired(key);
    expect(result).toBe(true);
  });

  it("shouldReturnUndefinedIfDataHasExpired", () => {
    const key = "testKey";
    localStorage.setItem(key, JSON.stringify({ data: "testData" }));
    localStorage.setItem(key.concat("_lastCachedDate"), new Date(Date.now() - 90000000).toString());
    const result = retrieveDataFromLocalStorage(key);
    expect(result).toBeUndefined();
  });

  it("shouldReturnDataIfDataHasNotExpired", () => {
    const key = "testKey";
    const testData = { data: "testData" };
    localStorage.setItem(key, JSON.stringify(testData));
    localStorage.setItem(key.concat("_lastCachedDate"), new Date().toString());
    const result = retrieveDataFromLocalStorage(key);
    expect(result).toEqual(testData);
  });

  it("shouldReturnEmptyObjectIfNoDataExists", () => {
    const key = "testKey";
    localStorage.removeItem(key);
    const result = retrieveDataFromLocalStorage(key);
    expect(result).toEqual({});
  });
});