import { checkExtension } from "../checkExtension";
import MockAdapter from "axios-mock-adapter";
import { myAxios } from "utils";

const axiosMock = new MockAdapter(myAxios);

describe("checkExtension", () => {

  beforeEach(() => {
    jest.clearAllMocks();
    axiosMock.reset();
  });

  describe("service call to CHECK_EXTENSION succeeds", () => {
    const checkExtensionRes = { isValid: true };
    beforeEach(() => {
      axiosMock.onPost("http://localhost:8080/checkextension").reply(200, checkExtensionRes);
    });
    test("should resolve with formatted data", done => {
      const extension = "1234";
      checkExtension(extension).then(resolvedVal => {
        expect(axiosMock.history.post[0].url).toBe("http://localhost:8080/checkextension");
        expect(resolvedVal).toEqual(true);
        done();
      });
    });
  });

  describe("service call to CHECK_EXTENSION returns noting", () => {
    const checkExtensionRes = [];
    beforeEach(() => {
      axiosMock.onPost("http://localhost:8080/checkextension").reply(200, checkExtensionRes);
    });
    test("should resolve with null", done => {
      const extension = "1234";
      checkExtension(extension).then(resolvedVal => {
        expect(axiosMock.history.post[0].url).toBe("http://localhost:8080/checkextension");
        expect(resolvedVal).toEqual(false);
        done();
      });
    });
  });
});