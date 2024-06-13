import MockAdapter from "axios-mock-adapter";
import { myAxios } from "utils/myAxios";
import { apiPaths } from "globals";
import { getApplications } from "../applications";

const axiosMock = new MockAdapter(myAxios);

beforeEach(() => {
  jest.clearAllMocks();
  axiosMock.reset();
});

describe("getApplications", () => {
  describe("call succeeds", () => {
    beforeEach(() => axiosMock.onGet(apiPaths.GET_APPLICATIONS).replyOnce(200, { cool: "yay" }));
    test("should resolve with data", done => {
      getApplications()
        .then(res => {
          expect(axiosMock.history.get.length).toEqual(1);
          expect(res).toEqual({ cool: "yay" });
          done();
        });
    });
  });
  describe("call fails", () => {
    beforeEach(() => axiosMock.onGet(apiPaths.GET_APPLICATIONS).replyOnce(500, { boo: "nooo" }));
    test("should reject with error", done => {
      getApplications()
        .catch(error => {
          expect(axiosMock.history.get.length).toEqual(1);
          expect(error).toEqual(new Error("Request failed with status code 500"));
          done();
        });
    });
  });
});