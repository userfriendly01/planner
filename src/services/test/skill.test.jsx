import MockAdapter from "axios-mock-adapter";
import { myAxios } from "utils/myAxios";
import { apiPaths } from "globals";
import {
  createSkill, loadSkillState, deleteSkills,
  updateSkill
} from "../skill";
import { skillActions } from "context/reducers/skillReducer";
import { getOperatingUnits } from "services/operatingUnits";

const axiosMock = new MockAdapter(myAxios);

jest.mock("services/operatingUnits", () => ({
  getOperatingUnits: jest.fn()
}));

const mockDispatch = jest.fn();
const tokens = {
  adminService: "pstpstpst"
};

beforeEach(() => {
  jest.clearAllMocks();
  axiosMock.reset();
});

describe("createSkill", () => {
  const payload = {
    skillForm: {
      taskQueue: {
        isNew: false
      }
    }
  };
  describe("All successful", () => {
    const response = {
      data: {
        taskQueue: {
          sid: "new task queue sid"
        }
      },
      status: 200
    };
    beforeEach(() => {
      axiosMock.reset();
      jest.clearAllMocks();
      axiosMock.onPost(apiPaths.SKILL).reply(200, response);
    });
    describe("taskqueue is new", () => {
      const payload = {
        skillForm: {
          taskQueue: {
            isNew: true
          }
        }
      };
      test("should return with new task queue and call dispatch", async () => {
        const res = await createSkill(tokens, payload, mockDispatch);
        expect(mockDispatch).toHaveBeenCalledWith({
          type: skillActions.ADD_SKILL,
          payload: {
            taskQueue: {
              isNew: true,
              taskQueue: response.data.taskQueue
            }
          }
        });
        expect(res).toStrictEqual({
          data: { taskQueue: { sid: "new task queue sid" }},
          status: 200
        });
      });
    });
    describe("taskqueue is NOT new", () => {
      test("should return with existing task queue and call dispatch", async () => {
        const res = await createSkill(tokens, payload, mockDispatch);
        expect(mockDispatch).toHaveBeenCalledWith({
          type: skillActions.ADD_SKILL,
          payload: payload.skillForm
        });
        expect(res).toStrictEqual({
          data: { taskQueue: { sid: "new task queue sid" }},
          status: 200
        });
      });
    });
  });
  describe("partial failure", () => {
    const response = {
      messages: ["aww"],
      status: 206
    };
    beforeEach(() => {
      axiosMock.onPost(apiPaths.SKILL).reply(200, response);
    });
    test("should return and not call dispatch", async () => {
      const res = await createSkill(tokens, payload, mockDispatch);
      expect(mockDispatch).not.toHaveBeenCalled();
      expect(res).toStrictEqual({
        messages: ["aww"],
        status: 206
      });
    });
  });
  describe("full failure", () => {
    beforeEach(() => {
      axiosMock.onPost(apiPaths.SKILL).reply(500, "AWWW");
    });
    test("should throw error and not call dispatch", async () => {
      try {
        await createSkill(tokens, payload, mockDispatch);
      }catch(err){
        expect(mockDispatch).not.toHaveBeenCalled();
        expect(err.response.data).toStrictEqual("AWWW");
      }
    });
  });
});

describe("updateSkill", () => {
  const payload = {
    skillName: "skill",
    skills: [{ name: "skill" }],
    changes: {},
    updatedBy: "n0263786"
  };
  describe("All successful", () => {
    const response = {
      data: {
        taskQueue: {
          sid: "new task queue sid"
        }
      },
      status: 200
    };
    beforeEach(() => {
      axiosMock.reset();
      jest.clearAllMocks();
      axiosMock.onPut(apiPaths.SKILL).reply(200, response);
    });
    describe("taskqueue is new", () => {
      const payload = {
        skillName: "skill",
        skills: [{ name: "skill" }],
        changes: {
          taskQueue: {
            isNew: true
          }
        },
        updatedBy: "n0263786"
      };
      test("should return and call dispatch with new task queue", async () => {
        const res = await updateSkill(tokens, payload, mockDispatch);
        expect(mockDispatch).toHaveBeenCalledWith({
          type: skillActions.UPDATE_SKILL,
          payload: {
            skillName: payload.skillName,
            changes: payload.changes,
            taskQueue: {
              sid: "new task queue sid"
            }
          }
        });
        expect(res).toStrictEqual({
          data: { taskQueue: { sid: "new task queue sid" }},
          status: 200
        });
      });
    });
    describe("taskqueue is NOT new", () => {
      test("should return and call dispatch with null", async () => {
        const res = await updateSkill(tokens, payload, mockDispatch);
        expect(mockDispatch).toHaveBeenCalledWith({
          type: skillActions.UPDATE_SKILL,
          payload: {
            skillName: payload.skillName,
            changes: payload.changes,
            taskQueue: null
          }
        });
        expect(res).toStrictEqual({
          data: { taskQueue: { sid: "new task queue sid" }},
          status: 200
        });
      });
    });
  });
  describe("partial failure", () => {
    const response = {
      messages: ["aww"],
      status: 206
    };
    beforeEach(() => {
      axiosMock.onPut(apiPaths.SKILL).reply(200, response);
    });
    test("should return and not call dispatch", async () => {
      const res = await updateSkill(tokens, payload, mockDispatch);
      expect(mockDispatch).not.toHaveBeenCalled();
      expect(res).toStrictEqual({
        messages: ["aww"],
        status: 206
      });
    });
  });
  describe("full failure", () => {
    beforeEach(() => {
      axiosMock.onPut(apiPaths.SKILL).reply(500, "AWWW");
    });
    test("should throw error and not call dispatch", async () => {
      try {
        await updateSkill(tokens, payload, mockDispatch);
      } catch(err) {
        expect(mockDispatch).not.toHaveBeenCalled();
        expect(err.response.data).toStrictEqual("AWWW");
      }
    });
  });
});

describe("deleteSkills", () => {
  const payload = [
    {
      skill: "deleteMe",
      deleteQueues: false,
      updatedBy: "n0263786"
    }
  ];
  describe("All successful", () => {
    const response = {
      status: 200
    };
    beforeEach(() => {
      axiosMock.reset();
      jest.clearAllMocks();
      axiosMock.onDelete(apiPaths.SKILL).reply(200, response);
    });
    describe("deleteQueues is true", () => {
      const payload = [
        {
          skill: "deleteMe1",
          taskQueueSid: "deleteMeQueueSid1",
          taskQueueName: "deleteMeQueue1",
          deleteQueues: true,
          updatedBy: "n0263786"
        },
        {
          skill: "deleteMe2",
          taskQueueSid: "deleteMeQueueSid2",
          taskQueueName: "deleteMeQueue2",
          deleteQueues: true,
          updatedBy: "n0263786"
        }
      ];
      test("should return and call dispatch with new task queue", async () => {
        const res = await deleteSkills(tokens, payload, mockDispatch);
        expect(mockDispatch).toHaveBeenCalledWith({
          type: skillActions.DELETE_SKILL,
          payload: {
            skillName: payload[0].skill,
            taskQueue: payload[0].taskQueueSid
          }
        });
        expect(mockDispatch).toHaveBeenCalledWith({
          type: skillActions.DELETE_SKILL,
          payload: {
            skillName: payload[1].skill,
            taskQueue: payload[1].taskQueueSid
          }
        });
        expect(res).toStrictEqual([{
          status: "fulfilled",
          value: { "status": 200 }
        }, {
          status: "fulfilled",
          value: { "status": 200 }
        }]);
      });
    });
    describe("taskqueue is NOT new", () => {
      test("should return and call dispatch with null", async () => {
        const res = await deleteSkills(tokens, payload, mockDispatch);
        expect(mockDispatch).toHaveBeenCalledWith({
          type: skillActions.DELETE_SKILL,
          payload: {
            skillName: payload[0].skill,
            taskQueue: false
          }
        });
        expect(res).toStrictEqual([{
          status: "fulfilled",
          value: { "status": 200 }
        }]);
      });
    });
  });
  describe("partial failure", () => {
    const response = {
      messages: ["aww"],
      status: 206
    };
    beforeEach(() => {
      axiosMock.onDelete(apiPaths.SKILL).reply(200, response);
    });
    test("should return and not call dispatch", async () => {
      const res = await deleteSkills(tokens, payload, mockDispatch);
      expect(mockDispatch).not.toHaveBeenCalled();
      expect(res).toStrictEqual([ {
        status: "fulfilled",
        value: {
          messages: ["aww"],
          status: 206
        }
      } ]);
    });
  });
  describe("full failure", () => {
    beforeEach(() => {
      axiosMock.onDelete(apiPaths.SKILL).reply(500, "AWWW");
    });
    test("should throw error and not call dispatch", async () => {
      try {
        await deleteSkills(tokens, payload, mockDispatch);
      }catch(err){
        expect(mockDispatch).not.toHaveBeenCalled();
        expect(err.response.data).toStrictEqual("AWWW");
      }
    });
  });
});

describe("loadSkillState", () => {
  describe("All successful", () => {
    const skills = [{ name: "skill" }];
    const skillGroups = [{ name: "skillGroups" }];
    const applications = [{ name: "applications" }];
    const timeOfDays = [{ name: "timeOfDays" }];
    const taskQueues = [{ name: "taskQueues" }];
    const operatingUnits = [{ name: "operatingUnits" }];

    beforeEach(() => {
      axiosMock.onGet(apiPaths.SKILL).reply(200, {
        consolidatedSkills: skills,
        skillGroups,
        taskQueues
      });
      axiosMock.onGet(apiPaths.APPLICATIONS).reply(200, applications);
      axiosMock.onGet(apiPaths.TIME_OF_DAYS).reply(200, timeOfDays);
      getOperatingUnits.mockResolvedValue(operatingUnits);
    });
    test("should return and call dispatch", async () => {
      await loadSkillState(tokens, mockDispatch);
      expect(mockDispatch).toHaveBeenCalledWith({
        type: skillActions.LOAD_SKILL_STATE,
        payload: {
          skills,
          skillGroups,
          applications,
          timeOfDays,
          taskQueues,
          operatingUnits
        }
      });
    });
  });
  describe("full failure", () => {
    beforeEach(() => {
      axiosMock.onGet(apiPaths.SKILL).reply(500, "AWWW");
    });
    test("should throw error and not call dispatch", async () => {
      try {
        await loadSkillState(tokens, mockDispatch);
      }catch(err){
        expect(mockDispatch).not.toHaveBeenCalled();
        expect(err.response.data).toStrictEqual("AWWW");
      }
    });
  });
});