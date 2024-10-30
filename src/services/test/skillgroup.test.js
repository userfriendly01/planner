import {
  createSkillGroup, updateSkillGroup, deleteSkillGroup
} from "../skillgroup";
import { skillActions } from "context/reducers/skillReducer";
import { apolloClient } from "components/core/Auth/SharedGraphAPIProvider";

jest.mock("components/core/Auth/SharedGraphAPIProvider", () => ({
  apolloClient: {
    mutate: jest.fn(),
    query: jest.fn()
  }
}));

beforeEach(() => {
  jest.clearAllMocks();
});

const mockDispatch = jest.fn();

describe("skillGroup", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe("createSkillGroup", () => {
    const response = {
      data: {
        skillGroup: {
          keys: [
            {
              pk: "SkillGroup#2j0ldLD2Zwa0PhNniY5GJXqKYr9",
              sk: "Skill#466"
            },
            {
              pk: "SkillGroup#2j0ldLD2Zwa0PhNniY5GJXqKYr9",
              sk: "SkillGroup#2j0ldLD2Zwa0PhNniY5GJXqKYr9"
            }
          ]
        }
      }
    };
    const payload = {
      id: "2j0ldLD2Zwa0PhNniY5GJXqKYr9",
      skill_group_name: "skillGroup",
      skill_ids: ["skill"]
    };
    describe("All successful", () => {
      beforeEach(() => {
        apolloClient.mutate.mockResolvedValue(response);
      });
      describe("taskqueue is new", () => {
        test("should return with new task queue and call dispatch", async () => {
          const res = await createSkillGroup(payload, mockDispatch);
          expect(mockDispatch).toHaveBeenCalledWith({
            type: skillActions.ADD_SKILL_GROUP,
            payload: {
              skill_group_name: payload.skill_group_name,
              skills: payload.skill_ids,
              id: payload.id,
              pk: "SkillGroup#2j0ldLD2Zwa0PhNniY5GJXqKYr9",
              sk: "SkillGroup#2j0ldLD2Zwa0PhNniY5GJXqKYr9"
            }
          });
          expect(res).toStrictEqual(response.data.skillGroup);
        });
      });
    });
    describe("errors.length", () => {
      const errors = {
        errors: [ { message: "aww" }]
      };
      beforeEach(() => {
        apolloClient.mutate.mockResolvedValue(errors);
      });
      test("should return and not call dispatch", async () => {
        try {
          await createSkillGroup(payload, mockDispatch);
        } catch(err) {
          expect(mockDispatch).not.toHaveBeenCalled();
          expect(err).toStrictEqual(["aww"]);
        }
      });
    });
    describe("full failure", () => {
      beforeEach(() => {
        apolloClient.mutate.mockRejectedValue("AWWW");
      });
      test("should throw error and not call dispatch", async () => {
        try {
          await createSkillGroup(payload, mockDispatch);
        } catch(err) {
          expect(mockDispatch).not.toHaveBeenCalled();
          expect(err).toStrictEqual("AWWW");
        }
      });
    });
  });
  describe("updateSkillGroup", () => {
    const response = {
      data: {
        skillGroup: {
          keys: [
            {
              pk: "SkillGroup#2j0ldLD2Zwa0PhNniY5GJXqKYr9",
              sk: "Skill#466"
            },
            {
              pk: "SkillGroup#2j0ldLD2Zwa0PhNniY5GJXqKYr9",
              sk: "SkillGroup#2j0ldLD2Zwa0PhNniY5GJXqKYr9"
            }
          ]
        }
      }
    };
    const payload = {
      id: "2j0ldLD2Zwa0PhNniY5GJXqKYr9",
      skill_group_name: "skillGroup",
      skill_ids: ["skill"]
    };
    describe("All successful", () => {
      beforeEach(() => {
        apolloClient.mutate.mockResolvedValue(response);
      });
      describe("taskqueue is new", () => {
        test("should return with new task queue and call dispatch", async () => {
          const res = await updateSkillGroup(payload.id, payload, mockDispatch);
          expect(mockDispatch).toHaveBeenCalledWith({
            type: skillActions.UPDATE_SKILL_GROUP,
            payload: {
              skillGroup: {
                skill_group_name: payload.skill_group_name,
                skills: payload.skill_ids,
                id: payload.id,
                pk: "SkillGroup#2j0ldLD2Zwa0PhNniY5GJXqKYr9",
                sk: "SkillGroup#2j0ldLD2Zwa0PhNniY5GJXqKYr9"
              },
              id: payload.id
            }
          });
          expect(res).toStrictEqual(response.data.skillGroup);
        });
      });
    });
    describe("errors.length", () => {
      const errors = {
        errors: [ { message: "aww" }]
      };
      beforeEach(() => {
        apolloClient.mutate.mockResolvedValue(errors);
      });
      test("should return and not call dispatch", async () => {
        try {
          await updateSkillGroup(payload.id, payload, mockDispatch);
        } catch(err) {
          expect(mockDispatch).not.toHaveBeenCalled();
          expect(err).toStrictEqual(["aww"]);
        }
      });
    });
    describe("full failure", () => {
      beforeEach(() => {
        apolloClient.mutate.mockRejectedValue("AWWW");
      });
      test("should throw error and not call dispatch", async () => {
        try {
          await updateSkillGroup(payload.id, payload, mockDispatch);
        } catch(err) {
          expect(mockDispatch).not.toHaveBeenCalled();
          expect(err).toStrictEqual("AWWW");
        }
      });
    });
  });
  describe("updateSkillGroup", () => {
    const response = {
      data: {
        skillGroup: {
          keys: [
            {
              pk: "SkillGroup#2j0ldLD2Zwa0PhNniY5GJXqKYr9",
              sk: "Skill#466"
            },
            {
              pk: "SkillGroup#2j0ldLD2Zwa0PhNniY5GJXqKYr9",
              sk: "SkillGroup#2j0ldLD2Zwa0PhNniY5GJXqKYr9"
            }
          ]
        }
      }
    };
    const payload = {
      id: "2j0ldLD2Zwa0PhNniY5GJXqKYr9",
      skill_group_name: "skillGroup",
      skill_ids: ["skill"]
    };
    describe("All successful", () => {
      beforeEach(() => {
        apolloClient.mutate.mockResolvedValue(response);
      });
      describe("taskqueue is new", () => {
        test("should return with new task queue and call dispatch", async () => {
          const res = await deleteSkillGroup(payload.id, mockDispatch);
          expect(mockDispatch).toHaveBeenCalledWith({
            type: skillActions.DELETE_SKILL_GROUP,
            payload: payload.id
          });
          expect(res).toStrictEqual(response.data.skillGroup);
        });
      });
    });
    describe("errors.length", () => {
      const errors = {
        errors: [ { message: "aww" }]
      };
      beforeEach(() => {
        apolloClient.mutate.mockResolvedValue(errors);
      });
      test("should return and not call dispatch", async () => {
        try {
          await deleteSkillGroup(payload.id, mockDispatch);
        } catch(err) {
          expect(mockDispatch).not.toHaveBeenCalled();
          expect(err).toStrictEqual(["aww"]);
        }
      });
    });
    describe("full failure", () => {
      beforeEach(() => {
        apolloClient.mutate.mockRejectedValue("AWWW");
      });
      test("should throw error and not call dispatch", async () => {
        try {
          await deleteSkillGroup(payload.id, mockDispatch);
        } catch(err) {
          expect(mockDispatch).not.toHaveBeenCalled();
          expect(err).toStrictEqual("AWWW");
        }
      });
    });
  });
});