import { checkExtension } from "../checkExtension";
import { myAxios } from "../myAxios";
import MockAdapter from "axios-mock-adapter";
// import { apiPaths } from "globals";

// jest.mock("globals", () => ({
//   __esModule: true,
//   apiPaths: {
//     CHECK_EXTENSION: jest.fn()
//   }
// }));

const axiosMock = new MockAdapter(myAxios);

describe("checkExtension", () => {

  beforeEach(() => {
    jest.clearAllMocks();
    axiosMock.reset();
  });

  describe("service call to CHECK_EXTENSION succeeds", () => {
    const checkExtensionRes = { isValid: true };
    beforeEach(() => {
      axiosMock.onPost("/service/checkextension").reply(200, checkExtensionRes);
      // apiPaths.CHECK_EXTENSION.mockReturnValue("/service/checkextension");
    });
    test("should resolve with formatted data", done => {
      const extension = "1234";
      checkExtension(extension).then(resolvedVal => {
        expect(axiosMock.history.post[0].url).toBe("/service/checkextension");
        expect(resolvedVal).toEqual(true);
        done();
      });
    });
  });

  describe("service call to CHECK_EXTENSION returns noting", () => {
    const checkExtensionRes = [];
    beforeEach(() => {
      axiosMock.onPost("/service/checkextension").reply(200, checkExtensionRes);
      // apiPaths.CHECK_EXTENSION.mockReturnValue("/service/checkextension");
    });
    test("should resolve with null", done => {
      const extension = "1234";
      checkExtension(extension).then(resolvedVal => {
        expect(axiosMock.history.post[0].url).toBe("/service/checkextension");
        expect(resolvedVal).toEqual(false);
        done();
      });
    });
  });
});