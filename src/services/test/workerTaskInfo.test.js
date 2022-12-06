import { getWorkerTaskInfo, getProfileWorkerTaskInfo } from "../workerTaskInfo";
import MockAdapter from "axios-mock-adapter";
import { myAxios } from "utils";

const axiosMock = new MockAdapter(myAxios);
const profileWorkerTaskInfoEndpoint = "/contact-manager/profileworkertaskinfo";
const workerTaskInfoEndpoint = "/contact-manager/workertaskinfo";

beforeEach(() => {
  jest.clearAllMocks();
  axiosMock.reset();
});

describe("getProfileWorkerTaskInfo", () => {
  describe("call succeeds", () => {
    const data = { huzzah: "you are winner" };
    beforeEach(() => axiosMock.onGet(profileWorkerTaskInfoEndpoint).replyOnce(200, data));
    test("should resolve with any successful response", done => {
      getProfileWorkerTaskInfo()
        .then(resolvedValue => {
          expect(resolvedValue).toEqual(data);
          done();
        });
    });
  });
  describe("call fails", () => {
    const badResponse = { wahh: "boo" };
    beforeEach(() => axiosMock.onGet(profileWorkerTaskInfoEndpoint).replyOnce(500, badResponse));
    test("should reject with error", done => {
      getProfileWorkerTaskInfo().catch(rejectedVal => {
        expect(rejectedVal).toEqual(new Error("Request failed with status code 500"));
        done();
      });
    });
  });
});

describe("getWorkerTaskInfo", () => {
  describe("call succeeds", () => {
    const data = { huzzah: "you are winner" };
    beforeEach(() => axiosMock.onGet(workerTaskInfoEndpoint).replyOnce(200, data));
    test("should resolve with any successful response", done => {
      getWorkerTaskInfo()
        .then(resolvedValue => {
          expect(resolvedValue).toEqual(data);
          done();
        });
    });
  });
  // rz add test back in
  // describe("call fails", () => {
  //   const badResponse = { wahh: "boo" };
  //   beforeEach(() => axiosMock.onGet(workerTaskInfoEndpoint).replyOnce(500, badResponse));
  //   test("should reject with error", done => {
  //     getWorkerTaskInfo().catch(rejectedVal => {
  //       expect(rejectedVal).toEqual(new Error("Request failed with status code 500"));
  //       done();
  //     });
  //   });
  // });
});
