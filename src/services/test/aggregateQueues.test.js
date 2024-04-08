import { getAggregateQueuesType } from "../aggregateQueues";
import MockAdapter from "axios-mock-adapter";
import { myAxios } from "utils";

const axiosMock = new MockAdapter(myAxios);
const getAggregateQueuesTypeEndpoint = "http://localhost:8080/contact-manager/aggregatequeuestype/aggregate";

beforeEach(() => {
  jest.clearAllMocks();
  axiosMock.reset();
});

describe("getAggregateQueuesType", () => {
  describe("call succeeds", () => {
    const data = { huzzah: "you are winner" };
    beforeEach(() => axiosMock.onGet(getAggregateQueuesTypeEndpoint).replyOnce(200, data));
    test("should resolve with any successful response", done => {
      getAggregateQueuesType("aggregate")
        .then(resolvedValue => {
          expect(resolvedValue).toEqual(data);
          done();
        });
    });
  });
  describe("call fails", () => {
    const badResponse = { wahh: "boo" };
    beforeEach(() => axiosMock.onGet(getAggregateQueuesTypeEndpoint).replyOnce(500, badResponse));
    test("should reject with error", done => {
      getAggregateQueuesType("aggregate")
        .catch(rejectedVal => {
          expect(rejectedVal).toEqual(new Error("Request failed with status code 500"));
          done();
        });
    });
  });
});