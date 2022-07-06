import { getCalabrioOrg } from "../calabrio";
import MockAdapter from "axios-mock-adapter";
import { apiPaths }from "globals";
import { myAxios } from "utils";

const axiosMock = new MockAdapter(myAxios);

beforeEach(() => {
  jest.clearAllMocks();
  axiosMock.reset();
});

describe("getCalabrioOrg", () => {
  describe("call succeeds", () => {
    const data = { huzzah: "you are winner" };
    beforeEach(() => axiosMock.onGet(apiPaths.GET_CALABRIO_ORG).replyOnce(200, data));
    test("should resolve with any successful response", done => {
      getCalabrioOrg()
        .then(resolvedValue => {
          expect(axiosMock.history.get.length).toEqual(1);
          expect(resolvedValue.data).toEqual(data);
          done();
        });
    });
  });
  describe("call fails", () => {
    const badResponse = { wahh: "boo" };
    beforeEach(() => axiosMock.onGet(apiPaths.GET_CALABRIO_ORG).replyOnce(500, badResponse));
    test("should reject with error", done => {
      getCalabrioOrg().catch(rejectedVal => {
        expect(axiosMock.history.get.length).toEqual(1);
        expect(rejectedVal).toEqual(new Error("Request failed with status code 500"));
        done();
      });
    });
  });
});

