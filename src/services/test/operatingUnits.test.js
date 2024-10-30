import { getOperatingUnits } from "../operatingUnits";
import MockAdapter from "axios-mock-adapter";
import { myAxios } from "utils/myAxios";
import { apiPaths } from "globals";

const axiosMock = new MockAdapter(myAxios);

beforeEach(() => {
  jest.clearAllMocks();
  axiosMock.reset();
});

const tokens = {
  adminService: "pstpstpst"
};

describe("call to GET_OU succeeds", () => {
  const data = [{
    sid: "abc",
    friendly_name: "test"
  }];
  beforeEach(() => axiosMock.onGet(apiPaths.OPERATING_UNITS).reply(200, data));
  test("should resolve with ou data", done => {
    getOperatingUnits(tokens)
      .then(resolvedValue => {
        expect(resolvedValue).toEqual([{
          ou_sid: "abc",
          ou_name: "test"
        }]);
        done();
      });
  });
});

describe("call to GET_OU fails", () => {
  beforeEach(() => axiosMock.onGet(apiPaths.OPERATING_UNITS).replyOnce(500, "uh oh"));
  test("should reject with error", done => {
    getOperatingUnits(tokens)
      .catch(rejectedValue => {
        expect(rejectedValue).toEqual(new Error("Request failed with status code 500"));
        done();
      });
  });
});