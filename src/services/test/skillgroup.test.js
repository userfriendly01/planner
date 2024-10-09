import {
  addSkillGroup, updateSkillGroup, deleteSkillGroup
} from "../skillgroup";
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

xdescribe("addSkillGroup", () => {
  const entry = {
    skill_group_name: "skill group 1"
  };
  test("query is successful, returns profile data", () => {
    apolloClient.mutate.mockResolvedValueOnce({
      data: {
        skillGroup: {
          keys: [
            {
              pk: "SkillGroup#1",
              sk: "SkillGroup#1"
            }
          ]
        }
      }
    });
    addSkillGroup(entry).then(resolvedValue => {
      expect(apolloClient.mutate).toHaveBeenCalledTimes(1);
      expect(resolvedValue).toEqual({
        keys: [
          {
            pk: "SkillGroup#1",
            sk: "SkillGroup#1"
          }
        ]
      });
    });
  });
  test("query contains errors, throws error", () => {
    apolloClient.mutate.mockResolvedValueOnce({
      data: null,
      errors: [{ errorType: "BAD" }]
    });
    addSkillGroup(entry).catch(err => {
      expect(apolloClient.mutate).toHaveBeenCalledTimes(1);
      expect(err).toEqual([{ errorType: "BAD" }]);
    });
  });
  test("apolloClient query rejects, throws error", () => {
    apolloClient.mutate.mockRejectedValueOnce("OH NO!");
    addSkillGroup(entry).catch(err => {
      expect(apolloClient.mutate).toHaveBeenCalledTimes(1);
      expect(err).toEqual("OH NO!");
    });
  });
});

xdescribe("deleteSkillGroup", () => {
  test("query is successful, returns profile data", () => {
    apolloClient.mutate.mockResolvedValueOnce({
      data: {
        skillGroup: {
          keys: [
            {
              pk: "SkillGroup#1",
              sk: "SkillGroup#1"
            }
          ]
        }
      }
    });
    deleteSkillGroup("skillgroupid").then(resolvedValue => {
      expect(apolloClient.mutate).toHaveBeenCalledTimes(1);
      expect(resolvedValue).toEqual({
        keys: [
          {
            pk: "SkillGroup#1",
            sk: "SkillGroup#1"
          }
        ]
      });
    });
  });
  test("query contains errors, throws error", () => {
    apolloClient.mutate.mockResolvedValueOnce({
      data: null,
      errors: [{ errorType: "BAD" }]
    });
    deleteSkillGroup("skillgroupid").catch(err => {
      expect(apolloClient.mutate).toHaveBeenCalledTimes(1);
      expect(err).toEqual([{ errorType: "BAD" }]);
    });
  });
  test("apolloClient query rejects, throws error", () => {
    apolloClient.mutate.mockRejectedValueOnce("OH NO!");
    deleteSkillGroup("skillgroupid").catch(err => {
      expect(apolloClient.mutate).toHaveBeenCalledTimes(1);
      expect(err).toEqual("OH NO!");
    });
  });
});

xdescribe("updateSkillGroup", () => {
  const entry = {
    skill_group_name: "skill group 1",
    skill_ids: ["skill1"]
  };
  test("query is successful, returns profile data", () => {
    apolloClient.mutate.mockResolvedValueOnce({
      data: {
        skillGroup: {
          keys: [
            {
              pk: "SkillGroup#1",
              sk: "SkillGroup#1"
            },
            {
              pk: "SkillGroup#1",
              sk: "Skill#skill1"
            }
          ]
        }
      }
    });
    updateSkillGroup("skillgroupid", entry).then(resolvedValue => {
      expect(apolloClient.mutate).toHaveBeenCalledTimes(1);
      expect(resolvedValue).toEqual({
        keys: [
          {
            pk: "SkillGroup#1",
            sk: "SkillGroup#1"
          },
          {
            pk: "SkillGroup#1",
            sk: "Skill#skill1"
          }
        ]
      });
    });
  });
  test("query contains errors, throws error", () => {
    apolloClient.mutate.mockResolvedValueOnce({
      data: null,
      errors: [{ errorType: "BAD" }]
    });
    updateSkillGroup("skillgroupid", entry).catch(err => {
      expect(apolloClient.mutate).toHaveBeenCalledTimes(1);
      expect(err).toEqual([{ errorType: "BAD" }]);
    });
  });
  test("apolloClient query rejects, throws error", () => {
    apolloClient.mutate.mockRejectedValueOnce("OH NO!");
    updateSkillGroup("skillgroupid", entry).catch(err => {
      expect(apolloClient.mutate).toHaveBeenCalledTimes(1);
      expect(err).toEqual("OH NO!");
    });
  });
});

test("dummy", () => {
  expect(true).toBe(false);
});