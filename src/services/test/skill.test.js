import MockAdapter from "axios-mock-adapter";
import { myAxios } from "utils/myAxios";
import { apiPaths } from "globals";
import {
  createSkill, loadConsolidatedSkills, loadSkillOptions, deleteSkill
} from "../skill";

const axiosMock = new MockAdapter(myAxios);

beforeEach(() => {
  jest.clearAllMocks();
  axiosMock.reset();
});


const skillFormState = {
  name: "testskill",
  applicationId: 1,
  taskQueue: {
    sid: "",
    isNew: true,
    friendly_name: "test",
    target_workers: "",
    operating_unit_sid: "ou123"
  },
  profileIds: 0,
  levels: {
    min: {
      value: 1
    },
    max: {
      value: 3
    }
  },
  timeOfDays: [
    {
      dayOfWeekId: 1,
      timeOfDayId: 1
    },
    {
      dayOfWeekId: 2,
      timeOfDayId: 1
    },
    {
      dayOfWeekId: 3,
      timeOfDayId: 1
    },
    {
      dayOfWeekId: 4,
      timeOfDayId: 1
    },
    {
      dayOfWeekId: 5,
      timeOfDayId: 1
    },
    {
      dayOfWeekId: 6,
      timeOfDayId: 1
    },
    {
      dayOfWeekId: 7,
      timeOfDayId: 1
    }
  ],
  vhThreshold: "123",
  vhCallTarget: "hi"
};

describe("createSkill", () => {
  describe("All successful", () => {
    describe("taskqueue is new", () => {
      it("calls axios to create taskqueue, returns 200 status", async () => {
        axiosMock.onPost(apiPaths.TASK_QUEUES).replyOnce(200, { data: { sid: "123" }});
        axiosMock.onPost(apiPaths.SKILLS_TASKROUTER).replyOnce(200, { data: "yay" });
        axiosMock.onPost(apiPaths.SKILLS_CALLFLOW).replyOnce(200, { data: "yay" });
        createSkill(skillFormState, "Kaleigh").then(resolvedValue => {
          expect(axiosMock.history.post.length).toEqual(3);
          expect(JSON.parse(axiosMock.history.post[0].data)).toEqual({
            targetWorkers: "routing.skills HAS \"testskill\"",
            operatingUnitSid: "ou123",
            friendlyName: "test"
          });
          expect(resolvedValue).toEqual({ status: 200 });
        });
      });
    });
    describe("taskqueue is NOT new", () => {
      it("Does not call axios to create taskqueue, calls all other endpoints returns 200 status", async () => {
        axiosMock.onPost(apiPaths.SKILLS_TASKROUTER).replyOnce(200, { data: "yay" });
        axiosMock.onPost(apiPaths.SKILLS_CALLFLOW).replyOnce(200, { data: "yay" });
        const skillFormNonNewTaskQueue = {
          ...skillFormState,
          taskQueue: {
            sid: "taskqueuesid1",
            isNew: false,
            friendly_name: "TEST SKILL",
            target_workers: "routing.skills HAS \"testskill\" ",
            operating_unit_sid: "ou123"
          }
        };
        createSkill(skillFormNonNewTaskQueue, "Kaleigh").then(resolvedValue => {
          expect(axiosMock.history.post.length).toEqual(2);
          expect(JSON.parse(axiosMock.history.post[0].data)).toEqual({
            name: "testskill",
            multivalue: true,
            minimum: 1,
            maximum: 3
          });
          expect(JSON.parse(axiosMock.history.post[1].data)).toEqual({
            skillNme: "testskill",
            applicationId: 1,
            vhThreshold: "123",
            vhCallTarget: "hi",
            updatedBy: "Kaleigh",
            timeOfDays: skillFormNonNewTaskQueue.timeOfDays
          });
          expect(resolvedValue).toEqual({ status: 200 });
        });
      });
    });
  });
  describe("partial failure", () => {
    describe("create task queue fails, ", () => {
      it("still calls to create skill in flex and callflow, returns 206", async () => {
        axiosMock.onPost(apiPaths.TASK_QUEUES).replyOnce(500, { data: "boo" });
        axiosMock.onPost(apiPaths.SKILLS_TASKROUTER).replyOnce(200, { data: "yay" });
        axiosMock.onPost(apiPaths.SKILLS_CALLFLOW).replyOnce(200, { data: "yay" });
        createSkill(skillFormState, "Kaleigh").then(resolvedValue => {
          expect(axiosMock.history.post.length).toEqual(3);
          expect(JSON.parse(axiosMock.history.post[0].data)).toEqual({
            targetWorkers: "routing.skills HAS \"testskill\"",
            operatingUnitSid: "ou123",
            friendlyName: "test"
          });
          expect(JSON.parse(axiosMock.history.post[1].data)).toEqual({
            name: "testskill",
            multivalue: true,
            minimum: 1,
            maximum: 3
          });
          expect(JSON.parse(axiosMock.history.post[2].data)).toEqual({
            skillNme: "testskill",
            applicationId: 1,
            vhThreshold: "123",
            vhCallTarget: "hi",
            updatedBy: "Kaleigh",
            timeOfDays: skillFormState.timeOfDays
          });
          expect(resolvedValue).toEqual({
            status: 206,
            messages: ["Task Queue failed to create: {\"data\":\"boo\"}"]
          });
        });
      });
    });
    describe("create flex skill fails, ", () => {
      it("still calls to create skill in callflow, returns 206", async () => {
        axiosMock.onPost(apiPaths.TASK_QUEUES).replyOnce(200, { data: { sid: "123" }});
        axiosMock.onPost(apiPaths.SKILLS_TASKROUTER).replyOnce(500, { data: "boo" });
        axiosMock.onPost(apiPaths.SKILLS_CALLFLOW).replyOnce(200, { data: "yay" });
        createSkill(skillFormState, "Kaleigh").then(resolvedValue => {
          expect(axiosMock.history.post.length).toEqual(3);
          expect(resolvedValue).toEqual({
            status: 206,
            messages: ["Flex skill failed to create: {\"data\":\"boo\"}"]
          });
        });
      });
    });
    describe("callflow skill fails, ", () => {
      it("returns 206 and messages", async () => {
        axiosMock.onPost(apiPaths.TASK_QUEUES).replyOnce(200, { data: { sid: "123" }});
        axiosMock.onPost(apiPaths.SKILLS_TASKROUTER).replyOnce(200, { data: "yay" });
        axiosMock.onPost(apiPaths.SKILLS_CALLFLOW).replyOnce(500, { data: "boo" });
        createSkill(skillFormState, "Kaleigh").then(resolvedValue => {
          expect(axiosMock.history.post.length).toEqual(3);
          expect(resolvedValue).toEqual({
            status: 206,
            messages: ["Callflow database failed to create skill: {\"data\":\"boo\"}"]
          });
        });
      });
    });
  });
  describe("full failure", () => {
    it("returns 500 and messages", async () => {
      axiosMock.onPost(apiPaths.TASK_QUEUES).replyOnce(500, { data: "boo1" });
      axiosMock.onPost(apiPaths.SKILLS_TASKROUTER).replyOnce(500, { data: "boo2" });
      axiosMock.onPost(apiPaths.SKILLS_CALLFLOW).replyOnce(500, { data: "boo3" });
      createSkill(skillFormState, "Kaleigh").then(resolvedValue => {
        expect(axiosMock.history.post.length).toEqual(3);
        expect(resolvedValue).toEqual({
          status: 500,
          messages: [
            "Task Queue failed to create: {\"data\":\"boo1\"}",
            "Flex skill failed to create: {\"data\":\"boo2\"}",
            "Callflow database failed to create skill: {\"data\":\"boo3\"}"
          ]
        });
      });
    });
  });
});

describe("deleteSkill", () => {
  test("deleteQueues is false, does not call to delete the task queue, only deletes from callflow and taskrouter", async () => {
    axiosMock.onDelete(`${apiPaths.SKILLS_TASKROUTER}/testskill`).replyOnce(200, { data: "cool" });
    axiosMock.onDelete(`${apiPaths.SKILLS_CALLFLOW}/testskill`).replyOnce(200, { data: "cool" });
    deleteSkill({
      matchingQueue: { sid: null },
      name: "testskill"
    }, false).then(resolvedValue => {
      expect(axiosMock.history.delete.length).toEqual(2);
      expect(resolvedValue).toEqual(undefined);
    });
  });
  test("no matching queue sid", async () => {
    axiosMock.onDelete(`${apiPaths.SKILLS_TASKROUTER}/testskill`).replyOnce(200, { data: "cool" });
    axiosMock.onDelete(`${apiPaths.SKILLS_CALLFLOW}/testskill`).replyOnce(200, { data: "cool" });
    deleteSkill({
      matchingQueue: { sid: null },
      name: "testskill"
    }, true).then(resolvedValue => {
      expect(axiosMock.history.delete.length).toEqual(2);
      expect(resolvedValue).toEqual(undefined);
    });
  });
  describe("deletequeues and matched queue sid are present", () => {
    test("all calls successful, returns", () => {
      axiosMock.onDelete(`${apiPaths.TASK_QUEUES}/sidysidsid`).replyOnce(200, { data: "cool" });
      axiosMock.onDelete(`${apiPaths.SKILLS_TASKROUTER}/testskill`).replyOnce(200, { data: "cool" });
      axiosMock.onDelete(`${apiPaths.SKILLS_CALLFLOW}/testskill`).replyOnce(200, { data: "cool" });
      deleteSkill({
        matchingQueue: { sid: "sidysidsid" },
        name: "testskill"
      }, true).then(resolvedValue => {
        expect(axiosMock.history.delete.length).toEqual(3);
        expect(axiosMock.history.delete[0].url).toEqual("http://localhost:8080/taskqueues/sidysidsid");
        expect(axiosMock.history.delete[1].url).toEqual("http://localhost:8080/taskrouterskills/testskill");
        expect(axiosMock.history.delete[2].url).toEqual("http://localhost:8080/callflowskills/testskill");
        expect(resolvedValue).toEqual(undefined);
      });
    });
    test("axios calls fail, rejects with messages", () => {
      axiosMock.onDelete(`${apiPaths.TASK_QUEUES}/sidysidsid`).replyOnce(500, { data: "notcool" });
      axiosMock.onDelete(`${apiPaths.SKILLS_TASKROUTER}/testskill`).replyOnce(500, { data: "notcool" });
      axiosMock.onDelete(`${apiPaths.SKILLS_CALLFLOW}/testskill`).replyOnce(500, { data: "notcool" });
      deleteSkill({
        matchingQueue: { sid: "sidysidsid" },
        name: "testskill"
      }, ["sidysidsid"])
        .then(() => {
        }).catch(err => {
          expect(axiosMock.history.delete.length).toEqual(3);
          expect(axiosMock.history.delete[0].url).toEqual("http://localhost:8080/taskqueues/sidysidsid");
          expect(axiosMock.history.delete[1].url).toEqual("http://localhost:8080/taskrouterskills/testskill");
          expect(axiosMock.history.delete[2].url).toEqual("http://localhost:8080/callflowskills/testskill");
          expect(err).toEqual("testskill - {\"data\":\"notcool\"},testskill - {\"data\":\"notcool\"},testskill - {\"data\":\"notcool\"}");
        });
    });
  });
});
describe("loadSkillOptions", () => {});
describe("loadConsolidatedSkills", () => {});