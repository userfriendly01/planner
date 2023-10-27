import { terminateWorker } from "../deleteUser";
import MockAdapter from "axios-mock-adapter";
import { apiPaths } from "globals";
import { myAxios } from "utils";

jest.mock("globals", () => ({
  __esModule: true,
  apiPaths: {
    TERMINATE_WORKER: jest.fn()
  },
  formModes: jest.requireActual("globals").formModes
}));

const axiosMock = new MockAdapter(myAxios);

describe("deleteUser", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    axiosMock.reset();
  });
  //todo: fix params and mocks for new endpoint
  describe("service call to DELETE_WORKER succeeds", () => {
    beforeEach(() => {
      axiosMock.onPost("/service/terminateWorker/n1234567").reply(200, { wow: "Yay!" });
      apiPaths.TERMINATE_WORKER.mockReturnValue("/service/terminateWorker/n1234567");
    });
    test("should resolve with string", done => {
      const workerPayload = {
        nNumber: "n1234567",
        workerSid: "WK01234567",
        email: "workerMcGee@libertymutual.com",
        firstName: "worker",
        lastName: "McGee",
        systems: ["TRITON", "QM"],
        termationDate: "2023-01-01",
        inactiveForwardTo: "+1603882224"
      };
      terminateWorker(workerPayload).then(resolvedVal => {
        expect(axiosMock.history.post[0].url).toBe("/service/terminateWorker/n1234567");
        expect(JSON.parse(axiosMock.history.post[0].data)).toEqual(workerPayload);
        expect(resolvedVal.data).toEqual({ wow: "Yay!" });
        done();
      });
    });
  });
  describe("service call to DELETE_WORKER fails", () => {
    const badResponse = { wahh: "boo" };
    const status = 500;
    const workerPayload = {
      nNumber: "n1234567",
      workerSid: "WK01234567",
      email: "workerMcGee@libertymutual.com",
      firstName: "worker",
      lastName: "McGee",
      systems: ["TRITON", "QM"],
      termationDate: "2023-01-01",
      inactiveForwardTo: "+1603882224"
    };
    beforeEach(() => {
      axiosMock.onPost("/service/terminateWorker/n1234567").reply(status, badResponse);
      apiPaths.TERMINATE_WORKER.mockReturnValue("/service/terminateWorker/n1234567");
    });
    test("should reject with error", done => {
      terminateWorker(workerPayload).catch(rejectedVal => {
        expect(axiosMock.history.post[0].url).toBe("/service/terminateWorker/n1234567");
        expect(JSON.parse(axiosMock.history.post[0].data)).toEqual(workerPayload);
        expect(rejectedVal).toEqual(new Error("Request failed with status code 500"));
        done();
      });
    });
  });
});