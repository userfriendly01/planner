import { wfmActivateExternalLogon } from "../wfmActivateExternalLogon";
import MockAdapter from "axios-mock-adapter";
import { myAxios } from "utils";

const axiosMock = new MockAdapter(myAxios);

const externalLogonServiceEndpoint = "http://localhost:8080/wfmexternallogon";

beforeEach(() => {
  jest.clearAllMocks();
  axiosMock.reset();
});

describe("Call to activate external logon succeeds", () => {
  const payload = { workerNNumbers: "n1234567" };
  const goodResponse = {
    successfulActivations: {
      message: "Some workers were successfully activated",
      workersSuccessfullyActivated: ["n1234567"]
    },
    failedActivations: {}
  };
  beforeEach(() => axiosMock.onPost(externalLogonServiceEndpoint).replyOnce(200, goodResponse));

  test("should resolve with successful activation", done => {
    wfmActivateExternalLogon(payload).then(resolvedValue => {
      expect(resolvedValue.data).toEqual({
        successfulActivations: {
          message: "Some workers were successfully activated",
          workersSuccessfullyActivated: ["n1234567"]
        },
        failedActivations: {}
      });
      done();
    });
  });
});

describe("Call to activate external logon fails", () => {
  const payload = { workerNNumbers: "n1234567" };
  beforeEach(() => axiosMock.onPost(externalLogonServiceEndpoint).replyOnce(500, "wuh oh"));

  test("should reject with error", done => {
    wfmActivateExternalLogon(payload).catch(rejectedValue => {
      expect(rejectedValue).toEqual(new Error("Request failed with status code 500"));
      done();
    });
  });
});