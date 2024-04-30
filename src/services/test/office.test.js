import {
  addOffice,
  getOffices
} from "../office";
import MockAdapter from "axios-mock-adapter";
import { myAxios } from "utils";

const axiosMock = new MockAdapter(myAxios);

const officeEndpoint = "http://localhost:8080/contact-manager/offices";

beforeEach(() => {
  jest.clearAllMocks();
  axiosMock.reset();
});

describe("addOffice", () => {
  describe("call succeeds", () => {
    const data = { huzzah: "you are winner" };
    beforeEach(() => axiosMock.onPost(officeEndpoint).replyOnce(200, data));
    test("should resolve with any successful response", done => {
      const newOffice = {
        office_nme: "noob",
        office_num: "0xb"
      };
      addOffice(newOffice)
        .then(resolvedValue => {
          expect(JSON.parse(axiosMock.history.post[0].data)).toEqual(newOffice);
          expect(resolvedValue).toEqual(data);
          done();
        });
    });
  });
  describe("call fails", () => {
    const badResponse = { wahh: "boo" };
    beforeEach(() => axiosMock.onPost(officeEndpoint).replyOnce(500, badResponse));
    test("should reject with error", done => {
      const newOffice = {
        office_nme: "noob",
        office_num: "0xb"
      };
      addOffice(newOffice).catch(rejectedVal => {
        expect(JSON.parse(axiosMock.history.post[0].data)).toEqual(newOffice);
        expect(rejectedVal).toEqual(new Error("Request failed with status code 500"));
        done();
      });
    });
  });
});

describe("getOffices", () => {
  describe("call succeeds", () => {
    const data = { huzzah: "you are winner" };
    beforeEach(() => axiosMock.onGet(officeEndpoint).replyOnce(200, data));
    test("should resolve with any successful response", done => {
      getOffices()
        .then(resolvedValue => {
          expect(resolvedValue).toEqual(data);
          done();
        });
    });
  });
  describe("call fails", () => {
    const badResponse = { wahh: "boo" };
    beforeEach(() => axiosMock.onGet(officeEndpoint).replyOnce(500, badResponse));
    test("should reject with error", done => {
      getOffices().catch(rejectedVal => {
        expect(rejectedVal).toEqual(new Error("Request failed with status code 500"));
        done();
      });
    });
  });
});
