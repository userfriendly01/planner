import { terminateUser } from "../terminateUser";
import MockAdapter from "axios-mock-adapter";
import { myAxios } from "utils";

const axiosMock = new MockAdapter(myAxios);

describe("deleteUser", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    axiosMock.reset();
  });
  describe("service call to DELETE_WORKER succeeds", () => {
    beforeEach(() => {
      axiosMock.onPost("/service/terminateworker").reply(200, { wow: "Yay!" });
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
      terminateUser(workerPayload).then(resolvedVal => {
        expect(axiosMock.history.post[0].url).toBe("/service/terminateworker");
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
      axiosMock.onPost("/service/terminateworker").reply(status, badResponse);
    });
    test("should reject with error", done => {
      terminateUser(workerPayload).catch(rejectedVal => {
        expect(axiosMock.history.post[0].url).toBe("/service/terminateworker");
        expect(JSON.parse(axiosMock.history.post[0].data)).toEqual(workerPayload);
        expect(rejectedVal).toEqual(new Error("Request failed with status code 500"));
        done();
      });
    });
  });
});