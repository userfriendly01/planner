import MockAdapter from "axios-mock-adapter";
import { myAxios } from "utils/myAxios";
import React from "react";
import { apiPaths } from "globals";
import {
  createSkill, loadConsolidatedSkills, loadSkillOptions, deleteSkill
} from "../skill";
import { getOperatingUnits } from "services/operatingUnits";
import { getTaskQueues } from "services/taskQueues";
import {
  mockApplications, mockOperatingUnits, mockSkillFormState, skillsList, mockTaskQueues, mockTimeOfDays
} from "testUtils";

const axiosMock = new MockAdapter(myAxios);

jest.mock("services/operatingUnits", () => ({
  getOperatingUnits: jest.fn()
}));

jest.mock("services/taskQueues", () => ({
  getTaskQueues: jest.fn()
}));

const mockDispatch = jest.fn();
const mockCallback = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
  axiosMock.reset();
});

describe("createSkill", () => {
  describe("All successful", () => {
    describe("taskqueue is new", () => {
      it("calls axios to create taskqueue, returns 200 status", async () => {
        axiosMock.onPost(apiPaths.TASK_QUEUES).replyOnce(200, { data: { sid: "123" }});
        axiosMock.onPost(apiPaths.SKILLS_TASKROUTER).replyOnce(200, { data: "yay" });
        axiosMock.onPost(apiPaths.SKILLS_CALLFLOW).replyOnce(200, { data: "yay" });
        createSkill(mockSkillFormState, "Kaleigh").then(resolvedValue => {
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
          ...mockSkillFormState,
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
        axiosMock.onPost(apiPaths.TASK_QUEUES).replyOnce(500, { response: "boo" });
        axiosMock.onPost(apiPaths.SKILLS_TASKROUTER).replyOnce(200, { data: "yay" });
        axiosMock.onPost(apiPaths.SKILLS_CALLFLOW).replyOnce(200, { data: "yay" });
        createSkill(mockSkillFormState, "Kaleigh").then(resolvedValue => {
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
            timeOfDays: mockSkillFormState.timeOfDays
          });
          expect(resolvedValue).toEqual({
            status: 206,
            messages: ["Task Queue failed to create: boo"]
          });
        });
      });
    });
    describe("create flex skill fails, ", () => {
      it("still calls to create skill in callflow, returns 206", async () => {
        axiosMock.onPost(apiPaths.TASK_QUEUES).replyOnce(200, { data: { sid: "123" }});
        axiosMock.onPost(apiPaths.SKILLS_TASKROUTER).replyOnce(500, { response: "boo" });
        axiosMock.onPost(apiPaths.SKILLS_CALLFLOW).replyOnce(200, { data: "yay" });
        createSkill(mockSkillFormState, "Kaleigh").then(resolvedValue => {
          expect(axiosMock.history.post.length).toEqual(3);
          expect(resolvedValue).toEqual({
            status: 206,
            messages: ["Flex skill failed to create: boo"]
          });
        });
      });
    });
    describe("callflow skill fails, ", () => {
      it("returns 206 and messages", async () => {
        axiosMock.onPost(apiPaths.TASK_QUEUES).replyOnce(200, { data: { sid: "123" }});
        axiosMock.onPost(apiPaths.SKILLS_TASKROUTER).replyOnce(200, { data: "yay" });
        axiosMock.onPost(apiPaths.SKILLS_CALLFLOW).replyOnce(500, { response: "boo" });
        createSkill(mockSkillFormState, "Kaleigh").then(resolvedValue => {
          expect(axiosMock.history.post.length).toEqual(3);
          expect(resolvedValue).toEqual({
            status: 206,
            messages: ["Callflow database failed to create skill: boo"]
          });
        });
      });
    });
  });
  describe("full failure", () => {
    it("returns 500 and messages", async () => {
      axiosMock.onPost(apiPaths.TASK_QUEUES).replyOnce(500, { response: "boo1" });
      axiosMock.onPost(apiPaths.SKILLS_TASKROUTER).replyOnce(500, { response: "boo2" });
      axiosMock.onPost(apiPaths.SKILLS_CALLFLOW).replyOnce(500, { response: "boo3" });
      createSkill(mockSkillFormState, "Kaleigh").then(resolvedValue => {
        expect(axiosMock.history.post.length).toEqual(3);
        expect(resolvedValue).toEqual({
          status: 500,
          messages: [
            "Task Queue failed to create: boo1",
            "Flex skill failed to create: boo2",
            "Callflow database failed to create skill: boo3"
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
      axiosMock.onDelete(`${apiPaths.TASK_QUEUES}/sidysidsid`).replyOnce(500, { response: "notcool" });
      axiosMock.onDelete(`${apiPaths.SKILLS_TASKROUTER}/testskill`).replyOnce(500, { response: "notcool" });
      axiosMock.onDelete(`${apiPaths.SKILLS_CALLFLOW}/testskill`).replyOnce(500, { response: "notcool" });
      deleteSkill({
        matchingQueue: { sid: "sidysidsid" },
        name: "testskill"
      }, true)
        .then(() => {
        }).catch(err => {
          expect(axiosMock.history.delete.length).toEqual(3);
          expect(axiosMock.history.delete[0].url).toEqual("http://localhost:8080/taskqueues/sidysidsid");
          expect(axiosMock.history.delete[1].url).toEqual("http://localhost:8080/taskrouterskills/testskill");
          expect(axiosMock.history.delete[2].url).toEqual("http://localhost:8080/callflowskills/testskill");
          expect(JSON.stringify(err[0])).toContain("Task Queue Deletion Error");
          expect(JSON.stringify(err[1])).toContain("Flex Console Skill Deletion Error");
          expect(JSON.stringify(err[2])).toContain("Callflow Database Skill Deletion Error");
        });
    });
    test("error is taskQueueError", () => {
      const taskQueueError =  { details: "booo 400" };
      axiosMock.onDelete(`${apiPaths.TASK_QUEUES}/sidysidsid`).replyOnce(500, taskQueueError);
      axiosMock.onDelete(`${apiPaths.SKILLS_TASKROUTER}/testskill`).replyOnce(200, { data: "cool" });
      axiosMock.onDelete(`${apiPaths.SKILLS_CALLFLOW}/testskill`).replyOnce(200, { data: "cool" });
      deleteSkill({
        matchingQueue: { sid: "sidysidsid" },
        name: "testskill"
      }, true)
        .then(() => {
        }).catch(err => {
          expect(axiosMock.history.delete.length).toEqual(3);
          expect(axiosMock.history.delete[0].url).toEqual("http://localhost:8080/taskqueues/sidysidsid");
          expect(axiosMock.history.delete[1].url).toEqual("http://localhost:8080/taskrouterskills/testskill");
          expect(axiosMock.history.delete[2].url).toEqual("http://localhost:8080/callflowskills/testskill");
          expect(JSON.stringify(err)).toContain("Twilio was unable to delete the task queue.");
        });
    });
  });
});

describe("loadSkillOptions", () => {
  beforeEach(() => {
    axiosMock.onGet(apiPaths.GET_TIME_OF_DAYS).replyOnce(200,  mockTimeOfDays);
    axiosMock.onGet(apiPaths.GET_APPLICATIONS).replyOnce(200, mockApplications);
    getTaskQueues.mockResolvedValue({ data: mockTaskQueues });
    getOperatingUnits.mockResolvedValue(mockOperatingUnits);
  });
  describe("all options load successfully", () => {
    test("should call setDispatch to load skills and skill options", async () => {
      await loadSkillOptions(skillsList, mockDispatch, mockCallback);
      expect(mockDispatch).toHaveBeenCalledTimes(2);
      expect(mockDispatch).toHaveBeenCalledWith({
        type: "LOAD_SKILL_OPTIONS",
        payload: {
          applications: mockApplications,
          timeOfDays: mockTimeOfDays,
          taskQueues: mockTaskQueues,
          operatingUnits: mockOperatingUnits
        }
      });
      expect(mockDispatch).toHaveBeenCalledWith({
        type: "LOAD_SKILLS",
        payload: [
          {
            ...skillsList[0],
            discrepancies: [`Task Queue was not found with the expression routing.skills HAS "${skillsList[0].name}". (Case Sensitive)`]
          },
          {
            ...skillsList[1],
            discrepancies: [
              "I dont match!",
              `Task Queue was not found with the expression routing.skills HAS "${skillsList[1].name}". (Case Sensitive)`
            ]
          },
          {
            ...skillsList[2],
            discrepancies: [`Task Queue was not found with the expression routing.skills HAS "${skillsList[2].name}". (Case Sensitive)`]
          },
          skillsList[3],
          {
            ...skillsList[4],
            discrepancies: [`Task Queue was not found with the expression routing.skills HAS "${skillsList[4].name}". (Case Sensitive)`]
          }
        ]
      });

    });
  });
  describe("error thrown fetching options", () => {
    beforeEach(() => {
      getOperatingUnits.mockRejectedValue("booo");
    });
    test("error logged & thrown", async () => {
      try {
        await loadSkillOptions(skillsList, mockDispatch, mockCallback);
        expect(mockDispatch).toHaveBeenCalledTimes(2);
      } catch(err){
        expect(err).toBe("Skill Options Failed to Load - please refresh Triton and try again");
      }
    });
  });
});

describe("loadConsolidatedSkills", () => {
  //Bypassing tests until the graph is implemented to not die on the inside.. 
});