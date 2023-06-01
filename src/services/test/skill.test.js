import MockAdapter from "axios-mock-adapter";
import { myAxios } from "utils";
import { apiPaths } from "globals";
import { createSkill } from "../skill";

const axiosMock = new MockAdapter(myAxios);

beforeEach(() => {
  jest.clearAllMocks();
  axiosMock.reset();
});

describe("createSkill", () => {
  describe("call succeeds", () => {
    beforeEach(() => axiosMock.onPost(apiPaths.CREATE_SKILL).replyOnce(200, { cool: "dude" }));
    test("should resolve with data", done => {
      createSkill({ skillNum: "new skill" })
        .then(res => {
          expect(axiosMock.history.post.length).toEqual(1);
          expect(JSON.parse(axiosMock.history.post[0].data)).toEqual({ skillNum: "new skill" });
          expect(res.data).toEqual({ cool: "dude" });
          done();
        });
    });
  });
  describe("call fails", () => {
    beforeEach(() => axiosMock.onPost(apiPaths.CREATE_SKILL).replyOnce(500, { boo: "hoo" }));
    test("should reject with error", done => {
      createSkill({})
        .catch(error => {
          expect(axiosMock.history.post.length).toEqual(1);
          expect(error).toEqual(new Error("Request failed with status code 500"));
          done();
        });
    });
  });
});