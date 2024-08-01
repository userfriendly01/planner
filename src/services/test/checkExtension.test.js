import { checkExtension } from "../checkExtension";

const mockWorkers = [{
    attributes: {
      extension: "1234"
    }
  }]

describe("checkExtension", () => {

  test("returns true", () => {
    const res = checkExtension(mockWorkers, "8888")
    expect(res).toBe(true);
  })

  test("returns false", () => {
    const res = checkExtension(mockWorkers, "1234");
    expect(res).toBe(false);
  })
});