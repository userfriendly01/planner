import {
  addManager,
  deleteManager,
  editManager,
  getManagers
} from "../manager";
import MockAdapter from "axios-mock-adapter";
import { myAxios } from "utils";

const axiosMock = new MockAdapter(myAxios);

const managerEndpoint = "/contact-manager/managers";

beforeEach(() => {
  jest.clearAllMocks();
  axiosMock.reset();
});

describe("addManager", () => {
  describe("call succeeds", () => {
    const data = { huzzah: "you are winner" };
    beforeEach(() => axiosMock.onPost(managerEndpoint).replyOnce(200, data));
    test("should resolve with any successful response", done => {
      const newManager = {
        manager_first_nme: "Noob",
        manager_last_nme: "Saibot",
        manager_n_num: "fatality"
      };
      addManager(newManager)
        .then(resolvedValue => {
          expect(JSON.parse(axiosMock.history.post[0].data)).toEqual(newManager);
          expect(resolvedValue).toEqual(data);
          done();
        });
    });
  });
  describe("call fails", () => {
    const badResponse = { wahh: "boo" };
    beforeEach(() => axiosMock.onPost(managerEndpoint).replyOnce(500, badResponse));
    test("should reject with error", done => {
      const newManager = {
        manager_first_nme: "Noob",
        manager_last_nme: "Saibot",
        manager_n_num: "fatality"
      };
      addManager(newManager).catch(rejectedVal => {
        expect(JSON.parse(axiosMock.history.post[0].data)).toEqual(newManager);
        expect(rejectedVal).toEqual(new Error("Request failed with status code 500"));
        done();
      });
    });
  });
});


describe("editManager", () => {
  const updatedManager = {
    manager_id: 10,
    manager_first_nme: "Noob",
    manager_last_nme: "Saibot",
    manager_n_num: "fatality",
    profile_id: 4,
    calabrio_team_ids: "[215]"
  };
  describe("call succeeds", () => {
    const data = { huzzah: "you are winner" };
    beforeEach(() => axiosMock.onPut(`${managerEndpoint}/${updatedManager.manager_id}`).replyOnce(200, data));
    test("should resolve with any successful response", done => {
      editManager(updatedManager.manager_id, updatedManager)
        .then(resolvedValue => {
          expect(JSON.parse(axiosMock.history.put[0].data)).toEqual(updatedManager);
          expect(resolvedValue).toEqual(data);
          done();
        });
    });
  });
  describe("call fails", () => {
    const badResponse = { wahh: "boo" };
    beforeEach(() => axiosMock.onPut(`${managerEndpoint}/${updatedManager.manager_id}`).replyOnce(500, badResponse));
    test("should reject with error", done => {
      editManager(updatedManager.manager_id, updatedManager).catch(rejectedVal => {
        expect(JSON.parse(axiosMock.history.put[0].data)).toEqual(updatedManager);
        expect(rejectedVal).toEqual(new Error("Request failed with status code 500"));
        done();
      });
    });
  });
});

describe("deleteManager", () => {
  const managerId = 10;
  describe("call succeeds", () => {
    const data = { huzzah: "you are winner" };
    beforeEach(() => axiosMock.onDelete(`${managerEndpoint}/${managerId}`).replyOnce(200, data));
    test("should resolve with any successful response", done => {
      deleteManager(managerId)
        .then(resolvedValue => {
          expect(resolvedValue).toEqual(data);
          done();
        });
    });
  });
  describe("call fails", () => {
    const badResponse = { wahh: "boo" };
    beforeEach(() => axiosMock.onDelete(`${managerEndpoint}/${managerId}`).replyOnce(500, badResponse));
    test("should reject with error", done => {
      deleteManager(managerId).catch(rejectedVal => {
        expect(rejectedVal).toEqual(new Error("Request failed with status code 500"));
        done();
      });
    });
  });
});

describe("getManagers", () => {
  describe("call succeeds", () => {
    const data = { huzzah: "you are winner" };
    beforeEach(() => axiosMock.onGet(managerEndpoint).replyOnce(200, data));
    test("should resolve with any successful response", done => {
      getManagers()
        .then(resolvedValue => {
          expect(resolvedValue).toEqual(data);
          done();
        });
    });
  });
  describe("call fails", () => {
    const badResponse = { wahh: "boo" };
    beforeEach(() => axiosMock.onGet(managerEndpoint).replyOnce(500, badResponse));
    test("should reject with error", done => {
      getManagers().catch(rejectedVal => {
        expect(rejectedVal).toEqual(new Error("Request failed with status code 500"));
        done();
      });
    });
  });
});
