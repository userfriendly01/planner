import { getAccessGroup } from "../accessGroup";
import MockAdapter from "axios-mock-adapter";
import { myAxios } from "utils/myAxios";

const axiosMock = new MockAdapter(myAxios);
const getAccessGroupEndpoint = "http://localhost:8080/contact-manager/accessgroup";

beforeEach(() => {
  jest.clearAllMocks();
  axiosMock.reset();
});


describe("getAccessGroup", () => {
  describe("call succeeds", () => {
    const data = { huzzah: "you are winner" };
    beforeEach(() => axiosMock.onGet(getAccessGroupEndpoint).replyOnce(200, data));
    test("should resolve with any successful response", done => {
      getAccessGroup()
        .then(resolvedValue => {
          expect(resolvedValue).toEqual(data);
          done();
        });
    });
  });
});
