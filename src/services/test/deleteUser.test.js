import { deleteUser } from "../deleteUser";
import MockAdapter from "axios-mock-adapter";
import { apiPaths } from "globals";
import { myAxios } from "utils";

jest.mock("globals", () => ({
  __esModule: true,
  apiPaths: {
    DELETE_WORKER: jest.fn()
  }
}));

const axiosMock = new MockAdapter(myAxios);

describe("deleteUser", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    axiosMock.reset();
  });

  describe("service call to DELETE_WORKER succeeds", () => {
    beforeEach(() => {
      axiosMock.onDelete("/service/deleteworker/WK01234567").reply(200, { wow: "Yay!" });
      apiPaths.DELETE_WORKER.mockReturnValue("/service/deleteworker/WK01234567");
    });
    test("should resolve with string", done => {
      const workerSid = "WK01234567";
      deleteUser(workerSid).then(resolvedVal => {
        expect(axiosMock.history.delete[0].url).toBe("/service/deleteworker/WK01234567");
        expect(resolvedVal.data).toEqual({ wow: "Yay!" });
        done();
      });
    });
  });
  describe("service call to DELETE_WORKER fails", () => {
    const badResponse = { wahh: "boo" };
    const status = 500;
    const workerSid = "WK01234567";
    beforeEach(() => {
      axiosMock.onDelete("/service/deleteworker/WK01234567").reply(status, badResponse);
      apiPaths.DELETE_WORKER.mockReturnValue("/service/deleteworker/WK01234567");
    });
    test("should reject with error", done => {
      deleteUser(workerSid).catch(rejectedVal => {
        expect(axiosMock.history.delete[0].url).toBe("/service/deleteworker/WK01234567");
        expect(rejectedVal).toEqual(new Error("Request failed with status code 500"));
        done();
      });
    });
  });
});