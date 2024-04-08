import { createUser } from "../createUser";
import MockAdapter from "axios-mock-adapter";
import { myAxios } from "utils";

const axiosMock = new MockAdapter(myAxios);

const createWorkerServiceEndpoint = "http://localhost:8080/createworker";

beforeEach(() => {
  jest.clearAllMocks();
  axiosMock.reset();
});

describe("call to CREATE_WORKER succeeds", () => {
  const workerData = { workerSid: "WK12345" };
  beforeEach(() => axiosMock.onPost(createWorkerServiceEndpoint).replyOnce(200, workerData));
  test("should resolve with worker data", done => {
    createUser({ attributes: "whatever" })
      .then(resolvedValue => {
        expect(resolvedValue).toEqual(workerData);
        done();
      });
  });
});

describe("call to CREATE_WORKER fails", () => {
  beforeEach(() => axiosMock.onPost(createWorkerServiceEndpoint).replyOnce(500, "uh oh"));
  test("should reject with error", done => {
    createUser({ attributes: "whatever" })
      .catch(rejectedValue => {
        expect(rejectedValue).toEqual(new Error("Request failed with status code 500"));
        done();
      });
  });
});
