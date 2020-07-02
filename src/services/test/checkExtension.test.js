import { checkExtension } from "../checkExtension";
import { myAxios } from "../myAxios";
import MockAdapter from "axios-mock-adapter";
import { apiPaths } from "globals";

jest.mock("globals", () => ({
  __esModule: true,
  apiPaths: {
    CHECK_EXTENSION: jest.fn()
  }
}));

const axiosMock = new MockAdapter(myAxios);

describe("checkExtension", () => {

  beforeEach(() => {
    jest.clearAllMocks();
    axiosMock.reset();
  });

  describe("service call to CHECK_EXTENSION succeeds", () => {
    const checkExtensionRes = { isValid: true };
    beforeEach(() => {
      axiosMock.onGet("/service/checkextension/1234").reply(200, checkExtensionRes);
      apiPaths.CHECK_EXTENSION.mockReturnValue("/service/checkextension/1234");
    });
    test("should resolve with formatted data", done => {
      const extension = "1234";
      checkExtension(extension).then(resolvedVal => {
        expect(axiosMock.history.get[0].url).toBe("/service/checkextension/1234");
        expect(resolvedVal).toEqual(true);
        done();
      });
    });
  });

  describe("service call to CHECK_EXTENSION returns noting", () => {
    const checkExtensionRes = [];
    beforeEach(() => {
      axiosMock.onGet("/service/checkextension/1234").reply(200, checkExtensionRes);
      apiPaths.CHECK_EXTENSION.mockReturnValue("/service/checkextension/1234");
    });
    test("should resolve with null", done => {
      const extension = "1234";
      checkExtension(extension).then(resolvedVal => {
        expect(axiosMock.history.get[0].url).toBe("/service/checkextension/1234");
        expect(resolvedVal).toEqual(false);
        done();
      });
    });
  });

  // describe("postToTransferApi fails", () => {
  //   const badResponse = { wahh: "Failed transfer to VDN" };
  //   const status = 500;
  //   beforeEach(() => ( axiosMock.onPost(postToTransferApiUrl).reply(status, badResponse)));
  //   test("should reject with error", done => {
  //     postToTransferApi(vdn, fromNumber).catch(rejectedVal => {
  //       expect(axiosMock.history.post[0].url).toBe(postToTransferApiUrl);
  //       expect(JSON.parse(axiosMock.history.post[0].data)).toEqual(postToTransferApiRequest);
  //       expect(rejectedVal).toEqual({
  //         data: badResponse,
  //         status
  //       });
  //       expect(getElevenDigitNumber).toHaveBeenCalledWith(fromNumber);
  //       done();
  //     });
  //   });
  // });
});