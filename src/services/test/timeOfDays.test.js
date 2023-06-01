import MockAdapter from "axios-mock-adapter";
import { myAxios } from "utils";
import { apiPaths } from "globals";
import { getTimeOfDays } from "../timeOfDays";

const axiosMock = new MockAdapter(myAxios);

beforeEach(() => {
  jest.clearAllMocks();
  axiosMock.reset();
});

describe("getTimeOfDays", () => {
  describe("call succeeds", () => {
    beforeEach(() => axiosMock.onGet(apiPaths.GET_TIME_OF_DAYS).replyOnce(200, { cool: "dude" }));
    test("should resolve with data", done => {
      getTimeOfDays()
        .then(res => {
          expect(axiosMock.history.get.length).toEqual(1);
          expect(res).toEqual({ cool: "dude" });
          done();
        });
    });
  });
  describe("call fails", () => {
    beforeEach(() => axiosMock.onGet(apiPaths.GET_TIME_OF_DAYS).replyOnce(500, { boo: "hoo" }));
    test("should reject with error", done => {
      getTimeOfDays()
        .catch(error => {
          expect(axiosMock.history.get.length).toEqual(1);
          expect(error).toEqual(new Error("Request failed with status code 500"));
          done();
        });
    });
  });
});