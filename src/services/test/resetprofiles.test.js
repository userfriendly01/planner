import {
  fetchResetProfileDatadogLogs,
  resetProfiles
} from "../resetprofiles";
import MockAdapter from "axios-mock-adapter";
import { apiPaths } from "globals";
import { myAxios } from "utils";

const axiosMock = new MockAdapter(myAxios);
const nNumber = "n0263786";

beforeEach(() => {
  jest.clearAllMocks();
  axiosMock.reset();
});

describe("fetchResetProfileDatadogLogs", () => {
  describe("call succeeds", () => {
    const data = { huzzah: "you are winner" };
    beforeEach(() => axiosMock.onGet(apiPaths.GET_RESET_PROFILE_DATADOG_LOGS(nNumber)).replyOnce(200, data));
    test("should resolve with any successful response", done => {
      fetchResetProfileDatadogLogs(nNumber)
        .then(resolvedValue => {
          expect(axiosMock.history.get.length).toEqual(1);
          expect(resolvedValue.data).toEqual(data);
          done();
        });
    });
  });
  describe("call fails", () => {
    const badResponse = { wahh: "boo" };
    beforeEach(() => axiosMock.onGet(apiPaths.GET_RESET_PROFILE_DATADOG_LOGS(nNumber)).replyOnce(500, badResponse));
    test("should reject with error", done => {
      fetchResetProfileDatadogLogs(nNumber).catch(rejectedVal => {
        expect(axiosMock.history.get.length).toEqual(1);
        expect(rejectedVal).toEqual(new Error("Request failed with status code 500"));
        done();
      });
    });
  });
});

describe("resetProfiles", () => {
  const nNumber = "n0263786";
  const body = {
    workerSid: "WK2342",
    email: "faith.cuneo@libertymutual.com"
  }

  describe("call succeeds", () => {
    const data = { huzzah: "you are winner" };
    beforeEach(() => axiosMock.onPost(apiPaths.RESET_PROFILES(nNumber)).replyOnce(200, data));
    test("should resolve with any successful response", done => {
      resetProfiles(nNumber, body)
        .then(resolvedValue => {
          expect(axiosMock.history.post.length).toEqual(1);
          expect(resolvedValue.data).toEqual(data);
          expect(JSON.parse(axiosMock.history.post[0].data)).toEqual(body);
          done();
        });
    });
  });
  describe("call fails", () => {
    const badResponse = { wahh: "boo" };
    beforeEach(() => axiosMock.onPost(apiPaths.RESET_PROFILES(nNumber)).replyOnce(500, badResponse));
    test("should reject with error", done => {
      resetProfiles(nNumber, body)
        .catch(rejectedVal => {
          expect(axiosMock.history.post.length).toEqual(1);
          expect(rejectedVal).toEqual(new Error("Request failed with status code 500"));
          done();
        });
    });
  });
});

