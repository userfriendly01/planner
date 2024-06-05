import MockAdapter from "axios-mock-adapter";
import { myAxios } from "utils/myAxios";
import {
  addSkillGroup, updateSkillGroup, deleteSkillGroup
} from "../skillgroup";
import { apiPaths } from "globals";

const axiosMock = new MockAdapter(myAxios);

beforeEach(() => {
  jest.clearAllMocks();
  axiosMock.reset();
});


describe("addSkillGroup", () => {
  describe("call succeeds", () => {
    const data = { cool: "beans" };
    beforeEach(() => axiosMock.onPost(apiPaths.SKILL_GROUPS).replyOnce(200, data));
    test("should resolve with successful response", done => {
      addSkillGroup({ skill_group_nme: "new skill group" })
        .then(resolvedValue => {
          expect(JSON.parse(axiosMock.history.post[0].data)).toEqual({ skill_group_nme: "new skill group" });
          expect(resolvedValue).toEqual(data);
          done();
        });
    });
  });
  describe("call fails", () => {
    const data = { no: "oops" };
    beforeEach(() => axiosMock.onPost(apiPaths.SKILL_GROUPS).replyOnce(500, data));
    test("should reject with error", done => {
      addSkillGroup({ skill_group_nme: "new skill group" })
        .catch(rejectVal => {
          expect(JSON.parse(axiosMock.history.post[0].data)).toEqual({ skill_group_nme: "new skill group" });
          expect(rejectVal).toEqual(new Error("Request failed with status code 500"));
          done();
        });
    });
  });
});

describe("deleteSkillGroup", () => {
  describe("call succeeds", () => {
    const data = { cool: "beans" };
    beforeEach(() => axiosMock.onDelete(`${apiPaths.SKILL_GROUPS}/2`).replyOnce(200, data));
    test("should resolve with successful response", done => {
      deleteSkillGroup(2)
        .then(resolvedValue => {
          expect(resolvedValue).toEqual(data);
          done();
        });
    });
  });
  describe("call fails", () => {
    const data = { no: "oops" };
    beforeEach(() => axiosMock.onDelete(`${apiPaths.SKILL_GROUPS}/2`).replyOnce(500, data));
    test("should reject with error", done => {
      deleteSkillGroup(2)
        .catch(rejectVal => {
          expect(rejectVal).toEqual(new Error("Request failed with status code 500"));
          done();
        });
    });
  });
});

describe("updateSkillGroup", () => {
  describe("call succeeds", () => {
    const data = { cool: "beans" };
    beforeEach(() => axiosMock.onPut(`${apiPaths.SKILL_GROUPS}/4`).replyOnce(200, data));
    test("should resolve with successful response", done => {
      updateSkillGroup(4, { skillGroupName: "new skill group1" })
        .then(resolvedValue => {
          expect(JSON.parse(axiosMock.history.put[0].data)).toEqual({ skillGroupName: "new skill group1" });
          expect(resolvedValue).toEqual(data);
          done();
        });
    });
  });
  describe("call fails", () => {
    const data = { no: "oops" };
    beforeEach(() => axiosMock.onPut(`${apiPaths.SKILL_GROUPS}/3`).replyOnce(500, data));
    test("should reject with error", done => {
      updateSkillGroup(3, { skillGroupName: "new skill group1" })
        .catch(rejectVal => {
          expect(JSON.parse(axiosMock.history.put[0].data)).toEqual({ skillGroupName: "new skill group1" });
          expect(rejectVal).toEqual(new Error("Request failed with status code 500"));
          done();
        });
    });
  });
});