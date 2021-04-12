import MockAdapter from "axios-mock-adapter";
import { myAxios } from "utils";
import { updateUser } from "../updateUser";

const axiosMock = new MockAdapter(myAxios);

const workerSid = "WK12345";
const updateWorkerServiceEndpoint = `/service/updateworker/${workerSid}`;
const attributes = "stuff";
const workerResponse = {
  workerSid,
  attributes
};

beforeEach(() => {
  jest.clearAllMocks();
  axiosMock.reset();
});

describe("call to UPDATE_WORKER succeeds", () => {
  beforeEach(() => axiosMock.onPost(updateWorkerServiceEndpoint).replyOnce(200, workerResponse));
  test("should resolve with worker data", done => {
    updateUser(workerSid, attributes)
      .then(resolvedValue => {
        expect(resolvedValue).toEqual(workerResponse);
        done();
      });
  });
});

describe("call to UPDATE_WORKER fails", () => {
  beforeEach(() => axiosMock.onPost(updateWorkerServiceEndpoint).replyOnce(500, "uh oh"));
  test("should reject with error", done => {
    updateUser(workerSid, attributes)
      .catch(rejectedValue => {
        expect(rejectedValue).toEqual(new Error("Request failed with status code 500"));
        done();
      });
  });
});
