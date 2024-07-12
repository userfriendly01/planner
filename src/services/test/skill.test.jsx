import MockAdapter from "axios-mock-adapter";
import { myAxios } from "utils/myAxios";
import { apiPaths } from "globals";
import {
  createSkill, loadConsolidatedSkills, loadSkillOptions, deleteSkill
} from "../skill";
import { getOperatingUnits } from "services/operatingUnits";
import { getTaskQueues } from "services/taskQueues";
import {
  mockApplications, mockOperatingUnits, mockSkillFormState, mockSkills, mockTaskQueues, mockTimeOfDays
} from "testUtils";
import { apolloClient } from "components/core/Auth/SharedGraphAPIProvider";
import { logger } from "utils/logger";
import { formatErrorMessage } from "utils/_formatUtils";

const axiosMock = new MockAdapter(myAxios);

jest.mock("components/core/Auth/SharedGraphAPIProvider", () => ({
  apolloClient: {
    mutate: jest.fn(),
    query: jest.fn()
  }
}));

jest.mock("services/operatingUnits", () => ({
  getOperatingUnits: jest.fn()
}));

jest.mock("services/taskQueues", () => ({
  getTaskQueues: jest.fn()
}));

jest.mock("utils/_formatUtils", () => ({
  formatErrorMessage: jest.fn()
}));

const mockDispatch = jest.fn();
const mockCallback = jest.fn();

const getGraphSkilllsResultNoTokens = {
  skills: {
    items: [{
      pk: "Skill#skillio",
      sk: "Skill#skillio",
      skill_id: "skillio"
    },
    {
      pk: "Skill#otherskill",
      sk: "Skill#otherskill",
      skill_id: "otherskill"
    }]
  },
  skillProfiles: {
    items: [{
      pk: "Profile#0",
      sk: "Skill#skillio",
      skill_id: "skillio"
    }]
  },
  skillGroups: {
    items: [{
      pk: "SkillGroup#123",
      sk: "SkillGroup#123",
      skill_id: "skillio"
    }]
  },
  skillGroupProfiles: {
    items: [{
      pk: "SkillGroup#123",
      sk: "Skill#skillio",
      skill_id: "skillio"
    }]
  }
};

beforeEach(() => {
  jest.clearAllMocks();
  axiosMock.reset();
});

describe("createSkill", () => {
  describe("All successful", () => {
    describe("taskqueue is new", () => {
      it("calls axios to create taskqueue, returns 200 status", done => {
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
          done();
        });
      });
    });
    describe("taskqueue is NOT new", () => {
      it("Does not call axios to create taskqueue, calls all other endpoints returns 200 status", done => {
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
            vhThreshold: null,
            vhCallTarget: null,
            updatedBy: "Kaleigh",
            timeOfDays: skillFormNonNewTaskQueue.timeOfDays
          });
          expect(resolvedValue).toEqual({ status: 200 });
          done();
        });
      });
      it("no min and max on the new skill, calls the flex taskrouter with appropriate payload", done => {
        axiosMock.onPost(apiPaths.SKILLS_TASKROUTER).replyOnce(200, { data: "yay" });
        axiosMock.onPost(apiPaths.SKILLS_CALLFLOW).replyOnce(200, { data: "yay" });
        const skillFormNonNewTaskQueue = {
          ...mockSkillFormState,
          levels: {},
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
            name: "testskill"
          });
          expect(JSON.parse(axiosMock.history.post[1].data)).toEqual({
            skillNme: "testskill",
            applicationId: 1,
            vhThreshold: null,
            vhCallTarget: null,
            updatedBy: "Kaleigh",
            timeOfDays: skillFormNonNewTaskQueue.timeOfDays
          });
          expect(resolvedValue).toEqual({ status: 200 });
          done();
        });
      });
    });
  });
  describe("partial failure", () => {
    describe("create task queue fails, ", () => {
      it("still calls to create skill in flex and callflow, returns 206", done => {
        axiosMock.onPost(apiPaths.TASK_QUEUES).replyOnce(500, "boo");
        axiosMock.onPost(apiPaths.SKILLS_TASKROUTER).replyOnce(200, { data: "yay" });
        axiosMock.onPost(apiPaths.SKILLS_CALLFLOW).replyOnce(200, { data: "yay" });
        formatErrorMessage.mockReturnValueOnce("boo");
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
            vhThreshold: null,
            vhCallTarget: null,
            updatedBy: "Kaleigh",
            timeOfDays: mockSkillFormState.timeOfDays
          });
          expect(resolvedValue).toEqual({
            status: 206,
            messages: ["Task Queue failed to create: boo"]
          });
          done();
        });
      });
    });
    describe("create flex skill fails, ", () => {
      it("still calls to create skill in callflow, returns 206", done => {
        axiosMock.onPost(apiPaths.TASK_QUEUES).replyOnce(200, { data: { sid: "123" }});
        axiosMock.onPost(apiPaths.SKILLS_TASKROUTER).replyOnce(500, { response: "boo" });
        axiosMock.onPost(apiPaths.SKILLS_CALLFLOW).replyOnce(200, { data: "yay" });
        formatErrorMessage.mockReturnValueOnce("boo");
        createSkill(mockSkillFormState, "Kaleigh").then(resolvedValue => {
          expect(axiosMock.history.post.length).toEqual(3);
          expect(axiosMock.history.post[1].data).toEqual(JSON.stringify({
            name: "testskill",
            multivalue: true,
            minimum: 1,
            maximum: 3
          }));
          expect(logger.error).toHaveBeenCalledWith("Flex skill failed to create: boo", Error("Request failed with status code 500"));
          expect(resolvedValue).toEqual({
            status: 206,
            messages: ["Flex skill failed to create: boo"]
          });
          done();
        });
      });
    });
    describe("callflow skill fails, ", () => {
      it("returns 206 and messages", done => {
        axiosMock.onPost(apiPaths.TASK_QUEUES).replyOnce(200, { data: { sid: "123" }});
        axiosMock.onPost(apiPaths.SKILLS_TASKROUTER).replyOnce(200, { data: "yay" });
        axiosMock.onPost(apiPaths.SKILLS_CALLFLOW).replyOnce(500, { response: "boo" });
        formatErrorMessage.mockReturnValueOnce("boo");
        createSkill(mockSkillFormState, "Kaleigh").then(resolvedValue => {
          expect(axiosMock.history.post.length).toEqual(3);
          expect(resolvedValue).toEqual({
            status: 206,
            messages: ["Callflow database failed to create skill: boo"]
          });
          done();
        });
      });
    });
  });
  describe("full failure", () => {
    it("returns 500 and messages", done => {
      axiosMock.onPost(apiPaths.TASK_QUEUES).replyOnce(500, { response: "boo1" });
      axiosMock.onPost(apiPaths.SKILLS_TASKROUTER).replyOnce(500, { response: "boo2" });
      axiosMock.onPost(apiPaths.SKILLS_CALLFLOW).replyOnce(500, { response: "boo3" });
      formatErrorMessage
        .mockReturnValueOnce("boo1")
        .mockReturnValueOnce("boo2")
        .mockReturnValueOnce("boo3");
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
        done();
      });
    });
  });
});

describe("deleteSkill", () => {
  test("deleteQueues is false, does not call to delete the task queue, only deletes from callflow and taskrouter", done => {
    axiosMock.onDelete(`${apiPaths.SKILLS_TASKROUTER}/testskill`).replyOnce(200, { data: "cool" });
    axiosMock.onDelete(`${apiPaths.SKILLS_CALLFLOW}/testskill`).replyOnce(200, { data: "cool" });
    deleteSkill({
      matchingQueue: { sid: null },
      name: "testskill"
    }, false).then(resolvedValue => {
      expect(axiosMock.history.delete.length).toEqual(2);
      expect(resolvedValue).toEqual(undefined);
      done();
    });
  });
  test("no matching queue sid", done => {
    axiosMock.onDelete(`${apiPaths.SKILLS_TASKROUTER}/testskill`).replyOnce(200, { data: "cool" });
    axiosMock.onDelete(`${apiPaths.SKILLS_CALLFLOW}/testskill`).replyOnce(200, { data: "cool" });
    deleteSkill({
      matchingQueue: { sid: null },
      name: "testskill"
    }, true).then(resolvedValue => {
      expect(axiosMock.history.delete.length).toEqual(2);
      expect(resolvedValue).toEqual(undefined);
      done();
    });
  });
  describe("deletequeues and matched queue sid are present", () => {
    test("all calls successful, returns", done => {
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
        done();
      });
    });
    test("axios calls fail, rejects with messages", done => {
      axiosMock.onDelete(`${apiPaths.TASK_QUEUES}/sidysidsid`).replyOnce(500, { response: "notcool" });
      axiosMock.onDelete(`${apiPaths.SKILLS_TASKROUTER}/testskill`).replyOnce(500, { response: { data: { error: "boo" }}});
      axiosMock.onDelete(`${apiPaths.SKILLS_CALLFLOW}/testskill`).replyOnce(500, { response: { data: "notcool" }});
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
          done();
        });
    });
    test("axios calls fail all with 404s, just returns", done => {
      axiosMock.onDelete(`${apiPaths.TASK_QUEUES}/sidysidsid`).replyOnce(500, { error: { error: "Not Found" }});
      axiosMock.onDelete(`${apiPaths.SKILLS_TASKROUTER}/testskill`).replyOnce(500, { error: { error: "Not Found" }});
      axiosMock.onDelete(`${apiPaths.SKILLS_CALLFLOW}/testskill`).replyOnce(500, { error: { error: "Not Found" }});
      deleteSkill({
        matchingQueue: { sid: "sidysidsid" },
        name: "testskill"
      }, true)
        .then(() => {
          expect(axiosMock.history.delete.length).toEqual(3);
          expect(axiosMock.history.delete[0].url).toEqual("http://localhost:8080/taskqueues/sidysidsid");
          expect(axiosMock.history.delete[1].url).toEqual("http://localhost:8080/taskrouterskills/testskill");
          expect(axiosMock.history.delete[2].url).toEqual("http://localhost:8080/callflowskills/testskill");
          done();
        });
    });
    test("error is taskQueueError", done => {
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
          done();
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
      await loadSkillOptions(mockSkills, mockDispatch, mockCallback);
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
            ...mockSkills[0],
            discrepancies: [`Task Queue was not found with the expression routing.skills HAS "${mockSkills[0].name}". (Case Sensitive)`]
          },
          {
            ...mockSkills[1],
            discrepancies: [
              "I dont match!",
              `Task Queue was not found with the expression routing.skills HAS "${mockSkills[1].name}". (Case Sensitive)`
            ]
          },
          {
            ...mockSkills[2],
            discrepancies: [`Task Queue was not found with the expression routing.skills HAS "${mockSkills[2].name}". (Case Sensitive)`]
          },
          mockSkills[3],
          {
            ...mockSkills[4],
            discrepancies: [`Task Queue was not found with the expression routing.skills HAS "${mockSkills[4].name}". (Case Sensitive)`]
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
        await loadSkillOptions(mockSkills, mockDispatch, mockCallback);
        expect(mockDispatch).toHaveBeenCalledTimes(2);
      } catch(err){
        expect(err).toBe("Skill Options Failed to Load - please refresh Triton and try again");
      }
    });
  });
});

describe("loadConsolidatedSkills", () => {
  describe("GETGRAPHSKILLS test scenarios", () => {
    beforeEach(() => {
      axiosMock.onGet(apiPaths.SKILLS_TASKROUTER).replyOnce(200, [{
        name: "skillio",
        multivalue: true,
        minimum: 1,
        maximum: 3
      }, {
        name: "otherskill",
        multivalue: true,
        minimum: 1,
        maximum: 1
      }]);
      axiosMock.onGet(apiPaths.SKILLS_CALLFLOW).replyOnce(200, [{
        skillName: "skillio",
        closedMessage: null,
        flashMessage: "hi",
        applicationId: 2
      },
      {
        skillName: "otherskill",
        closedMessage: null,
        flashMessage: "hi",
        applicationId: 6
      }]);
    });
    test("successful queries, no nextTokens involved, queries all skill skillgroup and relationship items and dispatches reformatted skills", done => {
      apolloClient.query.mockResolvedValue({ data: getGraphSkilllsResultNoTokens });
      loadConsolidatedSkills(mockDispatch).then(() => {
        expect(apolloClient.query).toHaveBeenCalledTimes(1);
        expect(mockDispatch).toHaveBeenCalledTimes(2);
        expect(mockDispatch).toHaveBeenCalledWith({
          type: "LOAD_SKILL_GROUPS",
          payload: [{
            pk: "SkillGroup#123",
            sk: "SkillGroup#123",
            skill_id: "skillio"
          }]
        });
        expect(mockDispatch).toHaveBeenLastCalledWith({
          type: "LOAD_SKILLS",
          payload: [
            {
              name: "skillio",
              discrepancies: [],
              profileIds: [0],
              skillGroupIds: ["123"],
              taskQueueName: undefined,
              taskQueueSid: undefined,
              applicationId: 2,
              closedMessage: null,
              flashMessage: "hi",
              levels: [1,2,3],
              skillName: "skillio"
            },
            {
              discrepancies: ["Skill exists in the graph but has no relationship to a profile"],
              name: "otherskill",
              profileIds: [],
              skillGroupIds: [],
              taskQueueName: undefined,
              taskQueueSid: undefined,
              applicationId: 6,
              closedMessage: null,
              flashMessage: "hi",
              levels: [1],
              skillName: "otherskill"
            }
          ]
        });
        expect(logger.error).toHaveBeenCalledTimes(0);
        done();
      });
    });
    test("successful queries, no nextTokens involved, some relationship items returns with no skill, logger is called", done => {
      const skillsWithUnattachedItems = JSON.parse(JSON.stringify(getGraphSkilllsResultNoTokens));
      skillsWithUnattachedItems.skillGroupProfiles.items.push({
        pk: "SkillGroup#123",
        sk: "Skill#badskill",
        skill_id: "badskill"
      });
      skillsWithUnattachedItems.skillProfiles.items.push({
        pk: "Profile#1",
        sk: "Skill#badskill",
        skill_id: "badskill"
      });
      apolloClient.query.mockResolvedValue({ data: skillsWithUnattachedItems });
      loadConsolidatedSkills(mockDispatch).then(() => {
        expect(apolloClient.query).toHaveBeenCalledTimes(1);
        expect(mockDispatch).toHaveBeenCalledTimes(2);
        expect(mockDispatch).toHaveBeenCalledWith({
          type: "LOAD_SKILL_GROUPS",
          payload: [{
            pk: "SkillGroup#123",
            sk: "SkillGroup#123",
            skill_id: "skillio"
          }]
        });
        expect(mockDispatch).toHaveBeenLastCalledWith({
          type: "LOAD_SKILLS",
          payload: [
            {
              name: "skillio",
              discrepancies: [],
              profileIds: [0],
              skillGroupIds: ["123"],
              taskQueueName: undefined,
              taskQueueSid: undefined,
              applicationId: 2,
              closedMessage: null,
              flashMessage: "hi",
              levels: [1,2,3],
              skillName: "skillio"
            },
            {
              discrepancies: ["Skill exists in the graph but has no relationship to a profile"],
              name: "otherskill",
              profileIds: [],
              skillGroupIds: [],
              taskQueueName: undefined,
              taskQueueSid: undefined,
              applicationId: 6,
              closedMessage: null,
              flashMessage: "hi",
              levels: [1],
              skillName: "otherskill"
            }
          ]
        });
        expect(logger.warn).toHaveBeenCalledTimes(2);
        expect(logger.warn).toHaveBeenCalledWith("Graph returned a profile/skill relationship but the skill was not found", {
          record: {
            pk: "Profile#1",
            sk: "Skill#badskill",
            skill_id: "badskill"
          }
        }, true);
        expect(logger.warn).toHaveBeenCalledWith("Graph returned a profile/skill relationship but the skill was not found", {
          record: {
            pk: "SkillGroup#123",
            sk: "Skill#badskill",
            skill_id: "badskill"
          }
        }, true);
        done();
      });
    });
    test("successful queries, nextTokens present on skills, queries all skill skillgroup and relationship items and dispatches reformatted skills", done => {
      const graphRes = JSON.parse(JSON.stringify(getGraphSkilllsResultNoTokens));
      graphRes.skills.nextToken = "hi";
      apolloClient.query
        .mockResolvedValueOnce({ data: graphRes })
        .mockResolvedValueOnce({
          data: {
            skills: {
              items: [{
                pk: "Skill#anotherskill",
                sk: "Skill#anotherskill",
                skill_id: "anotherskill"
              }]
            }
          }
        });
      loadConsolidatedSkills(mockDispatch).then(() => {
        expect(apolloClient.query).toHaveBeenCalledTimes(2);
        expect(mockDispatch).toHaveBeenCalledTimes(2);
        expect(mockDispatch).toHaveBeenCalledWith({
          type: "LOAD_SKILL_GROUPS",
          payload: [{
            pk: "SkillGroup#123",
            sk: "SkillGroup#123",
            skill_id: "skillio"
          }]
        });
        expect(mockDispatch).toHaveBeenLastCalledWith({
          type: "LOAD_SKILLS",
          payload: [
            {
              name: "skillio",
              discrepancies: [],
              profileIds: [0],
              skillGroupIds: ["123"],
              taskQueueName: undefined,
              taskQueueSid: undefined,
              applicationId: 2,
              closedMessage: null,
              flashMessage: "hi",
              levels: [1,2,3],
              skillName: "skillio"
            },
            {
              discrepancies: ["Skill exists in the graph but has no relationship to a profile"],
              name: "otherskill",
              profileIds: [],
              skillGroupIds: [],
              taskQueueName: undefined,
              taskQueueSid: undefined,
              applicationId: 6,
              closedMessage: null,
              flashMessage: "hi",
              levels: [1],
              skillName: "otherskill"
            },
            {
              name: "anotherskill",
              discrepancies: [
                "Skill exists in the graph but has no relationship to a profile",
                "anotherskill is not in the Legacy Callflow Database",
                "anotherskill is not in the Flex Console"
              ],
              profileIds: [],
              skillGroupIds: [],
              taskQueueName: undefined,
              taskQueueSid: undefined
            }
          ]
        });
        expect(logger.warn).toHaveBeenCalledTimes(0);
        done();
      });
    });
    test("successful queries, nextTokens present on skillProfiles, queries all skill skillgroup and relationship items and dispatches reformatted skills", done => {
      const graphRes = JSON.parse(JSON.stringify(getGraphSkilllsResultNoTokens));
      graphRes.skills.nextToken = null;
      graphRes.skillProfiles.nextToken = "yo";
      apolloClient.query
        .mockResolvedValueOnce({ data: graphRes })
        .mockResolvedValueOnce({
          data: {
            skillProfiles: {
              items: [{
                pk: "Profile#2",
                sk: "Skill#skillio",
                skill_id: "skillio"
              }]
            }
          }
        });
      loadConsolidatedSkills(mockDispatch).then(() => {
        expect(apolloClient.query).toHaveBeenCalledTimes(2);
        expect(mockDispatch).toHaveBeenCalledTimes(2);
        expect(mockDispatch).toHaveBeenCalledWith({
          type: "LOAD_SKILL_GROUPS",
          payload: [{
            pk: "SkillGroup#123",
            sk: "SkillGroup#123",
            skill_id: "skillio"
          }]
        });
        expect(mockDispatch).toHaveBeenLastCalledWith({
          type: "LOAD_SKILLS",
          payload: [
            {
              name: "skillio",
              discrepancies: [],
              profileIds: [0, 2],
              skillGroupIds: ["123"],
              taskQueueName: undefined,
              taskQueueSid: undefined,
              applicationId: 2,
              closedMessage: null,
              flashMessage: "hi",
              levels: [1,2,3],
              skillName: "skillio"
            },
            {
              discrepancies: ["Skill exists in the graph but has no relationship to a profile"],
              name: "otherskill",
              profileIds: [],
              skillGroupIds: [],
              taskQueueName: undefined,
              taskQueueSid: undefined,
              applicationId: 6,
              closedMessage: null,
              flashMessage: "hi",
              levels: [1],
              skillName: "otherskill"
            }
          ]
        });
        expect(logger.warn).toHaveBeenCalledTimes(0);
        done();
      });
    });
    test("apolloclient errors, error is logged and thrown", done => {
      apolloClient.query.mockRejectedValueOnce("boo");
      loadConsolidatedSkills(mockDispatch).catch(err => {
        expect(mockDispatch).toHaveBeenCalledTimes(0);
        expect(apolloClient.query).toHaveBeenCalledTimes(1);
        expect(logger.error).toHaveBeenCalledTimes(2);
        expect(logger.error).toHaveBeenCalledWith("Error thrown getting skills from the graph", "boo");
        expect(logger.error).toHaveBeenCalledWith("Failed to populate skill state", { error: "boo" });
        expect(err).toEqual({
          error: "boo",
          message: "Failed to populate skill state"
        });
        done();
      });
    });
    test("errors present on query response, error is logged and thrown", done => {
      apolloClient.query.mockResolvedValueOnce({
        data: null,
        errors: [{ message: "oh no!" }]
      });
      loadConsolidatedSkills(mockDispatch).catch(err => {
        expect(mockDispatch).toHaveBeenCalledTimes(0);
        expect(apolloClient.query).toHaveBeenCalledTimes(1);
        expect(logger.error).toHaveBeenCalledTimes(2);
        expect(logger.error).toHaveBeenCalledWith("Error thrown getting skills from the graph", [{ message: "oh no!" }]);
        expect(logger.error).toHaveBeenCalledWith("Failed to populate skill state", { error: [{ message: "oh no!" }]});
        expect(err).toEqual({
          error: [{ message: "oh no!" }],
          message: "Failed to populate skill state"
        });
        done();
      });
    });
    test("error occurs matching skills to profiles, error is logged", done => {
      const badData = {
        ...getGraphSkilllsResultNoTokens,
        skillProfiles: {
          items: [{
            bad: "data"
          }]
        }
      };
      apolloClient.query.mockResolvedValueOnce({ data: badData });
      loadConsolidatedSkills(mockDispatch).then(() => {
        expect(apolloClient.query).toHaveBeenCalledTimes(1);
        expect(logger.error).toHaveBeenCalledTimes(1);
        expect(logger.error).toHaveBeenCalledWith("Failed to format skill profile to skill", TypeError("Cannot read properties of undefined (reading 'split')"));
        done();
      });
    });
    test("error occurs matching skillgroups to profiles, error is logged", done => {
      const badData = {
        ...getGraphSkilllsResultNoTokens,
        skillGroupProfiles: {
          items: [{
            bad: "data"
          }]
        }
      };
      apolloClient.query.mockResolvedValueOnce({ data: badData });
      loadConsolidatedSkills(mockDispatch).then(() => {
        expect(apolloClient.query).toHaveBeenCalledTimes(1);
        expect(logger.error).toHaveBeenCalledTimes(1);
        expect(logger.error).toHaveBeenCalledWith("Failed to format skill profile to skill", TypeError("Cannot read properties of undefined (reading 'split')"));
        done();
      });
    });
  });

  describe("getGraphSkills happypath, This tests the functionality of the rest of loadConsolidatedSkills", () => {
    test("all calls successful, skills are missing from taskrouter and callflow, discrepancies appear on the skill", done => {
      axiosMock.onGet(apiPaths.SKILLS_TASKROUTER).replyOnce(200, []);
      axiosMock.onGet(apiPaths.SKILLS_CALLFLOW).replyOnce(200, [{ skillName: "dumbskill" }]);

      apolloClient.query.mockResolvedValueOnce({ data: getGraphSkilllsResultNoTokens });
      loadConsolidatedSkills(mockDispatch).then(() => {
        expect(apolloClient.query).toHaveBeenCalledTimes(1);
        expect(axiosMock.history.get.length).toEqual(2);

        expect(mockDispatch).toHaveBeenLastCalledWith({
          type: "LOAD_SKILLS",
          payload: [
            {
              discrepancies: ["skillio is not in the Legacy Callflow Database", "skillio is not in the Flex Console"],
              name: "skillio",
              profileIds: [0],
              skillGroupIds: ["123"],
              taskQueueName: undefined,
              taskQueueSid: undefined
            },
            {
              discrepancies: ["Skill exists in the graph but has no relationship to a profile", "otherskill is not in the Legacy Callflow Database", "otherskill is not in the Flex Console"],
              name: "otherskill",
              profileIds: [],
              skillGroupIds: [],
              taskQueueName: undefined,
              taskQueueSid: undefined
            },
            {
              discrepancies: ["dumbskill is not in the User Management Database", "dumbskill is not in the Flex Console"],
              name: "dumbskill"
            }
          ]
        });
        expect(mockDispatch).toHaveBeenCalledTimes(2); // called first in getGraphSkills
        done();
      });
    });
    test("all calls successful, skills are present in flex, but not the user management db or callflowdb, discrepancies appear on the skill", done => {
      axiosMock.onGet(apiPaths.SKILLS_TASKROUTER).replyOnce(200, [{
        name: "flexskill",
        minimum: 1,
        maximum: 2
      }]);
      axiosMock.onGet(apiPaths.SKILLS_CALLFLOW).replyOnce(200, []);

      apolloClient.query.mockResolvedValueOnce({ data: getGraphSkilllsResultNoTokens });
      loadConsolidatedSkills(mockDispatch).then(() => {
        expect(apolloClient.query).toHaveBeenCalledTimes(1);
        expect(axiosMock.history.get.length).toEqual(2);

        expect(mockDispatch).toHaveBeenLastCalledWith({
          type: "LOAD_SKILLS",
          payload: [
            {
              discrepancies: ["skillio is not in the Legacy Callflow Database", "skillio is not in the Flex Console"],
              name: "skillio",
              profileIds: [0],
              skillGroupIds: ["123"],
              taskQueueName: undefined,
              taskQueueSid: undefined
            },
            {
              discrepancies: ["Skill exists in the graph but has no relationship to a profile", "otherskill is not in the Legacy Callflow Database", "otherskill is not in the Flex Console"],
              name: "otherskill",
              profileIds: [],
              skillGroupIds: [],
              taskQueueName: undefined,
              taskQueueSid: undefined
            },
            {
              discrepancies: ["flexskill is not in the User Management Database", "flexskill is not in the Legacy Callflow Database"],
              name: "flexskill",
              levels: [1,2]
            }
          ]
        });
        expect(mockDispatch).toHaveBeenCalledTimes(2); // called first in getGraphSkills
        done();
      });
    });
    test("all calls successful, skills are present in flex and callflow, but not the user management db, discrepancies appear on the skill", done => {
      axiosMock.onGet(apiPaths.SKILLS_TASKROUTER).replyOnce(200, [{
        name: "flexskill",
        minimum: 1,
        maximum: 2
      }]);
      axiosMock.onGet(apiPaths.SKILLS_CALLFLOW).replyOnce(200, [{
        skillName: "flexskill",
        closedMessage: "go away",
        flashMessage: "hi",
        applicationId: 6
      }]);

      apolloClient.query.mockResolvedValueOnce({ data: getGraphSkilllsResultNoTokens });
      loadConsolidatedSkills(mockDispatch).then(() => {
        expect(apolloClient.query).toHaveBeenCalledTimes(1);
        expect(axiosMock.history.get.length).toEqual(2);

        expect(mockDispatch).toHaveBeenLastCalledWith({
          type: "LOAD_SKILLS",
          payload: [
            {
              discrepancies: ["skillio is not in the Legacy Callflow Database", "skillio is not in the Flex Console"],
              name: "skillio",
              profileIds: [0],
              skillGroupIds: ["123"],
              taskQueueName: undefined,
              taskQueueSid: undefined
            },
            {
              discrepancies: ["Skill exists in the graph but has no relationship to a profile", "otherskill is not in the Legacy Callflow Database", "otherskill is not in the Flex Console"],
              name: "otherskill",
              profileIds: [],
              skillGroupIds: [],
              taskQueueName: undefined,
              taskQueueSid: undefined
            },
            {
              discrepancies: ["flexskill is not in the User Management Database"],
              name: "flexskill",
              levels: [1,2],
              closedMessage: "go away",
              flashMessage: "hi",
              applicationId: 6,
              skillName: "flexskill"
            }
          ]
        });
        expect(mockDispatch).toHaveBeenCalledTimes(2); // called first in getGraphSkills
        done();
      });
    });
  });
});