import {
  getCallTags,
  getCallTagOptions
} from "../callTags";
import MockAdapter from "axios-mock-adapter";
import { myAxios } from "utils";

const axiosMock = new MockAdapter(myAxios);
const getCallTagOptionsEndpoint = "/contact-manager/workertaskinfooptions";
const getCallTagEndpoint = "/contact-manager/workertaskinfo";

beforeEach(() => {
  jest.clearAllMocks();
  axiosMock.reset();
});

describe("getCallTagOptions", () => {
  describe("call succeeds", () => {
    const data = { huzzah: "you are winner" };
    beforeEach(() => axiosMock.onGet(getCallTagOptionsEndpoint).replyOnce(200, data));
    test("should resolve with any successful response", done => {
      getCallTagOptions()
        .then(resolvedValue => {
          expect(resolvedValue).toEqual(data);
          done();
        });
    });
  });
  describe("call fails", () => {
    const badResponse = { wahh: "boo" };
    beforeEach(() => axiosMock.onGet(getCallTagOptionsEndpoint).replyOnce(500, badResponse));
    test("should reject with error", done => {
      getCallTagOptions().catch(rejectedVal => {
        expect(rejectedVal).toEqual(new Error("Request failed with status code 500"));
        done();
      });
    });
  });
});

describe("getCallTags", () => {
  describe("call succeeds", () => {
    const data = { huzzah: "you are winner" };
    beforeEach(() => axiosMock.onGet(getCallTagEndpoint).replyOnce(200, data));
    test("should resolve with any successful response", done => {
      getCallTags()
        .then(resolvedValue => {
          expect(resolvedValue).toEqual(data);
          done();
        });
    });
  });
  describe("call fails", () => {
    const badResponse = { wahh: "boo" };
    beforeEach(() => axiosMock.onGet(getCallTagEndpoint).replyOnce(500, badResponse));
    test("should reject with error", done => {
      getCallTags().catch(rejectedVal => {
        expect(rejectedVal).toEqual(new Error("Request failed with status code 500"));
        done();
      });
    });
  });
});