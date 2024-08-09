import { checkExtension, generateExtension, pickANumber } from "../checkExtensionUtils";
import { SearchParams } from "usermanagement/ExtensionSearchParams";

const mockWorkers = [{
    attributes: {
      extension: "1234"
    },
}, {
  attributes: {
    extension: "99995"
  },
}]

const searchParams = SearchParams.getValues();

describe("checkExtension", () => {

  test("should return true if extension is unused", () => {
    const res = checkExtension(mockWorkers, "8888")
    expect(res).toBe(true);
  })

  test("should return false if extension is used", () => {
    const res = checkExtension(mockWorkers, "1234");
    expect(res).toBe(false);
  })
});

describe("generateExtension", () => {
  test("should generate an extesion between 10000 and 99995", async () => {
    try {
      let extension = await generateExtension(mockWorkers);
      expect(Number(extension)).toBeGreaterThanOrEqual(searchParams.MinExtensionNum);
      expect(Number(extension)).toBeLessThanOrEqual(searchParams.MinExtensionNum + searchParams.ExtensionNumRange);
    } catch(error) {
      expect(error).toBeCalledTimes(0);
    }
  })
  test("errors when max attempts reached", async () => {
    jest.spyOn(global.Math, 'random').mockReturnValue(1);
    try {
      await generateExtension(mockWorkers);
    } catch (error) {
      expect(error).toBe("Unable to generate extension");
    }
  })
})
