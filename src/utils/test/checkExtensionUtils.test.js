import { checkExtension, generateExtension } from "../checkExtensionUtils";

const mockWorkers = [{
    attributes: {
      extension: "1234"
    }
}]

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
