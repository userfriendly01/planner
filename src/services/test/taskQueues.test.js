import MockAdapter from "axios-mock-adapter";
import { myAxios } from "utils/myAxios";
import { apiPaths } from "globals";
import { getTaskQueues } from "../taskQueues";

const axiosMock = new MockAdapter(myAxios);

beforeEach(() => {
  jest.clearAllMocks();
  axiosMock.reset();
});

describe("getTaskQueues", () => {
  describe("call succeeds", () => {
    beforeEach(() => axiosMock.onGet(apiPaths.GET_TASK_QUEUES).replyOnce(200, { cool: "beans" }));
    test("should resolve with data", done => {
      getTaskQueues()
        .then(res => {
          expect(axiosMock.history.get.length).toEqual(1);
          expect(res).toEqual({ cool: "beans" });
          done();
        });
    });
  });
  describe("call fails", () => {
    beforeEach(() => axiosMock.onGet(apiPaths.GET_TASK_QUEUES).replyOnce(500, { boo: "nooo" }));
    test("should reject with error", done => {
      getTaskQueues()
        .catch(error => {
          expect(axiosMock.history.get.length).toEqual(1);
          expect(error).toEqual(new Error("Request failed with status code 500"));
          done();
        });
    });
  });
});