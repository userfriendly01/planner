import { createProfile } from "../profile";
import MockAdapter from "axios-mock-adapter";
import { myAxios } from "utils";
import { apiPaths } from "globals";

const axiosMock = new MockAdapter(myAxios);

beforeEach(() => {
  jest.clearAllMocks();
  axiosMock.reset();
});

describe("call to CREATE_PROFILE succeeds", () => {
  const profileData = { profile_id: 52 };
  beforeEach(() => axiosMock.onPost(apiPaths.PROFILES).reply(200, profileData));
  test("should resolve with profile data", done => {
    createProfile({ attributes: "whatever" })
      .then(resolvedValue => {
        expect(resolvedValue.data).toEqual(profileData);
        done();
      });
  });
});

describe("call to CREATE_PROFILE fails", () => {
  beforeEach(() => axiosMock.onPost(apiPaths.PROFILES).replyOnce(500, "uh oh"));
  test("should reject with error", done => {
    createProfile({ attributes: "whatever" })
      .catch(rejectedValue => {
        expect(rejectedValue).toEqual(new Error("Request failed with status code 500"));
        done();
      });
  });
});
