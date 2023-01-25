// TODO - WRITE ME
import MockAdapter from "axios-mock-adapter";
import { myAxios } from "utils";
import {
  addSkillGroup, addSkillGroupsSkill
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
      addSkillGroup("new skill group")
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
      addSkillGroup("new skill group")
        .catch(rejectVal => {
          expect(JSON.parse(axiosMock.history.post[0].data)).toEqual({ skill_group_nme: "new skill group" });
          expect(rejectVal).toEqual(new Error("Request failed with status code 500"));
          done();
        });
    });
  });
});

describe("addSkillGroupsSkill", () => {
  describe("call succeeds", () => {
    const data = { cool: "beans" };
    beforeEach(() => axiosMock.onPost(`${apiPaths.SKILL_GROUPS}/1/skills`).replyOnce(200, data));
    test("should resolve with successful response", done => {
      addSkillGroupsSkill(1, 5)
        .then(resolvedValue => {
          expect(JSON.parse(axiosMock.history.post[0].data)).toEqual({ skill_id: 5 });
          expect(resolvedValue).toEqual(data);
          done();
        });
    });
  });
  describe("call fails", () => {
    const data = { no: "oops" };
    beforeEach(() => axiosMock.onPost(`${apiPaths.SKILL_GROUPS}/1/skills`).replyOnce(500, data));
    test("should reject with error", done => {
      addSkillGroupsSkill(1, 5)
        .catch(rejectVal => {
          expect(JSON.parse(axiosMock.history.post[0].data)).toEqual({ skill_id: 5 });
          expect(rejectVal).toEqual(new Error("Request failed with status code 500"));
          done();
        });
    });
  });
});