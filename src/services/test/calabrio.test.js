import {
  createCalabrioUser,
  getCalabrioOrg,
  getCalabrioRoles,
  getCalabrioUser
} from "../calabrio";
import MockAdapter from "axios-mock-adapter";
import { apiPaths }from "globals";
import { myAxios } from "utils";

const axiosMock = new MockAdapter(myAxios);
const user = {
  acdID: "noob",
  groupId: 215
};

beforeEach(() => {
  jest.clearAllMocks();
  axiosMock.reset();
});

describe("createCalabrioUser", () => {
  describe("call succeeds", () => {
    const data = { huzzah: "you are winner" };
    beforeEach(() => axiosMock.onPost(apiPaths.CREATE_CALABRIO_USER).replyOnce(200, data));
    test("should resolve with any successful response", done => {
      createCalabrioUser(user)
        .then(resolvedValue => {
          expect(JSON.parse(axiosMock.history.post[0].data)).toEqual(user);
          expect(resolvedValue.data).toEqual(data);
          done();
        });
    });
  });
  describe("call fails", () => {
    const badResponse = { wahh: "boo" };
    beforeEach(() => axiosMock.onPost(apiPaths.CREATE_CALABRIO_USER).replyOnce(500, badResponse));
    test("should reject with error", done => {
      createCalabrioUser(user).catch(rejectedVal => {
        expect(JSON.parse(axiosMock.history.post[0].data)).toEqual(user);
        expect(rejectedVal).toEqual(new Error("Request failed with status code 500"));
        done();
      });
    });
  });
});

describe("getCalabrioOrg", () => {
  describe("call succeeds", () => {
    const data = { huzzah: "you are winner" };
    beforeEach(() => axiosMock.onGet(apiPaths.GET_CALABRIO_ORG).replyOnce(200, data));
    test("should resolve with any successful response", done => {
      getCalabrioOrg()
        .then(resolvedValue => {
          expect(axiosMock.history.get.length).toEqual(1);
          expect(resolvedValue.data).toEqual(data);
          done();
        });
    });
  });
  describe("call fails", () => {
    const badResponse = { wahh: "boo" };
    beforeEach(() => axiosMock.onGet(apiPaths.GET_CALABRIO_ORG).replyOnce(500, badResponse));
    test("should reject with error", done => {
      getCalabrioOrg().catch(rejectedVal => {
        expect(axiosMock.history.get.length).toEqual(1);
        expect(rejectedVal).toEqual(new Error("Request failed with status code 500"));
        done();
      });
    });
  });
});

describe("getCalabrioRoles", () => {
  describe("call succeeds", () => {
    const data = { huzzah: "you are winner" };
    beforeEach(() => axiosMock.onGet(apiPaths.GET_CALABRIO_ROLES).replyOnce(200, data));
    test("should resolve with any successful response", done => {
      getCalabrioRoles()
        .then(resolvedValue => {
          expect(axiosMock.history.get.length).toEqual(1);
          expect(resolvedValue.data).toEqual(data);
          done();
        });
    });
  });
  describe("call fails", () => {
    const badResponse = { wahh: "boo" };
    beforeEach(() => axiosMock.onGet(apiPaths.GET_CALABRIO_ROLES).replyOnce(500, badResponse));
    test("should reject with error", done => {
      getCalabrioRoles().catch(rejectedVal => {
        expect(axiosMock.history.get.length).toEqual(1);
        expect(rejectedVal).toEqual(new Error("Request failed with status code 500"));
        done();
      });
    });
  });
});

describe("getCalabrioUser", () => {
  describe("call succeeds", () => {
    const data = { huzzah: "you are winner" };
    beforeEach(() => axiosMock.onGet(apiPaths.GET_CALABRIO_USER(67)).replyOnce(200, data));
    test("should resolve with any successful response", done => {
      getCalabrioUser(67)
        .then(resolvedValue => {
          expect(axiosMock.history.get.length).toEqual(1);
          expect(resolvedValue.data).toEqual(data);
          done();
        });
    });
  });
  describe("call fails", () => {
    const badResponse = { wahh: "boo" };
    beforeEach(() => axiosMock.onGet(apiPaths.GET_CALABRIO_USER(67)).replyOnce(500, badResponse));
    test("should reject with error", done => {
      getCalabrioUser(67).catch(rejectedVal => {
        expect(axiosMock.history.get.length).toEqual(1);
        expect(rejectedVal).toEqual(new Error("Request failed with status code 500"));
        done();
      });
    });
  });
});

