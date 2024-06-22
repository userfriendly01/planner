import MockAdapter from "axios-mock-adapter";
import { myAxios } from "utils/myAxios";
import { apiPaths } from "globals";
import {
  getTaskQueues,
  createTaskQueue,
  updateTaskQueue,
  deleteTaskQueue
} from "../taskQueues";

const axiosMock = new MockAdapter(myAxios);

beforeEach(() => {
  jest.clearAllMocks();
  axiosMock.reset();
});

const taskQueueSid = "TQ32159";

describe("getTaskQueues", () => {
  describe("call succeeds", () => {
    beforeEach(() => axiosMock.onGet(apiPaths.TASK_QUEUES).replyOnce(200, { cool: "beans" }));
    test("should resolve with data", done => {
      getTaskQueues()
        .then(res => {
          expect(axiosMock.history.get.length).toEqual(1);
          expect(res.data).toEqual({ cool: "beans" });
          done();
        });
    });
  });
  describe("call fails", () => {
    beforeEach(() => axiosMock.onGet(apiPaths.TASK_QUEUES).replyOnce(500, { boo: "nooo" }));
    test("should reject with error", done => {
      getTaskQueues()
        .catch(error => {
          expect(axiosMock.history.get.length).toEqual(1);
          expect(error).toEqual(new Error("Request failed with status code 500"));
          done();
        });
    });
  });
});

describe("createTaskQueue", () => {
  describe("call succeeds", () => {
    beforeEach(() => axiosMock.onPost(apiPaths.TASK_QUEUES).replyOnce(200, { cool: "beans" }));
    test("should resolve with data", done => {
      createTaskQueue()
        .then(res => {
          expect(axiosMock.history.post.length).toEqual(1);
          expect(res.data).toEqual({ cool: "beans" });
          done();
        });
    });
  });
  describe("call fails", () => {
    beforeEach(() => axiosMock.onPost(apiPaths.TASK_QUEUES).replyOnce(500, { boo: "nooo" }));
    test("should reject with error", done => {
      createTaskQueue()
        .catch(error => {
          expect(axiosMock.history.post.length).toEqual(1);
          expect(error).toEqual(new Error("Request failed with status code 500"));
          done();
        });
    });
  });
});

describe("updateTaskQueue", () => {
  describe("call succeeds", () => {
    beforeEach(() => axiosMock.onPut(`${apiPaths.TASK_QUEUES}/${taskQueueSid}`).replyOnce(200, { cool: "beans" }));
    test("should resolve with data", done => {
      updateTaskQueue(taskQueueSid)
        .then(res => {
          expect(axiosMock.history.put.length).toEqual(1);
          expect(res.data).toEqual({ cool: "beans" });
          done();
        });
    });
  });
  describe("call fails", () => {
    beforeEach(() => axiosMock.onPut(`${apiPaths.TASK_QUEUES}/${taskQueueSid}`).replyOnce(500, { boo: "nooo" }));
    test("should reject with error", done => {
      updateTaskQueue(taskQueueSid)
        .catch(error => {
          expect(axiosMock.history.put.length).toEqual(1);
          expect(error).toEqual(new Error("Request failed with status code 500"));
          done();
        });
    });
  });
});

describe("deleteTaskQueue", () => {
  describe("call succeeds", () => {
    beforeEach(() => axiosMock.onDelete(`${apiPaths.TASK_QUEUES}/${taskQueueSid}`).replyOnce(200, { cool: "beans" }));
    test("should resolve with data", done => {
      deleteTaskQueue(taskQueueSid)
        .then(res => {
          expect(axiosMock.history.delete.length).toEqual(1);
          expect(res.data).toEqual({ cool: "beans" });
          done();
        });
    });
  });
  describe("call fails", () => {
    beforeEach(() => axiosMock.onDelete(`${apiPaths.TASK_QUEUES}/${taskQueueSid}`).replyOnce(500, { boo: "nooo" }));
    test("should reject with error", done => {
      deleteTaskQueue(taskQueueSid)
        .catch(error => {
          expect(axiosMock.history.delete.length).toEqual(1);
          expect(error).toEqual(new Error("Request failed with status code 500"));
          done();
        });
    });
  });
});