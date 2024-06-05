import {
  filterSkillsByName,
  filterWorkerSearch,
  filterWfmUserTable
} from "../filterTable";
import { initialTestState } from "testUtils";

describe("filterWorkerSearch", () => {

  const goodWorkerData = {
    attributes: {
      default_skills: {
        skills: ["466", "psuUm"],
        levels: {
          "466": 3
        }
      },
      profile_id: 396,
      full_name: "Aldo the Apache",
      routing: {
        skills: ["test", "fake"],
        levels: {
          "466": 3
        },
        team: "Kitties"
      },
      office_location_name: "Office 4",
      n_number: "N666"
    }
  };

  const noRoutingData = {
    attributes: {
      default_skills: {
        skills: ["466", "psuUm"],
        levels: {
          "466": 3
        }
      },
      full_name: "Aldo the Apache",
      office_location_name: "Office 4"
    }
  };

  const noDefaultData = {
    attributes: {
      full_name: "Aldo the Apache",
      routing: {
        skills: ["test", "fake"],
        levels: {
          "466": 3
        }
      },
      office_location_name: "Office 4"
    }
  };

  const noNameData = {
    attributes: {
      default_skills: {
        skills: ["466", "psuUm"],
        levels: {
          "466": 3
        }
      },
      routing: {
        skills: ["test", "fake"],
        levels: {
          "466": 3
        }
      },
      office_location_name: "Office 4"
    }
  };

  const noOfficeData = {
    attributes: {
      default_skills: {
        skills: ["466", "psuUm"],
        levels: {
          "466": 3
        }
      },
      full_name: "Aldo the Apache",
      routing: {
        skills: ["test", "fake"],
        levels: {
          "466": 3
        }
      }
    },
    id: "N666"
  };

  const noAttributesData = {};

  test("if worker and search are null, should return false", () => {
    expect(filterWorkerSearch(null, null)).toEqual(false);
  });

  test("if there are no attributes on the worker we should return false", () => {
    expect(filterWorkerSearch(noAttributesData, "466", initialTestState)).toEqual(false);
  });

  test("if the worker is good, but null is the search, return false", () => {
    expect(filterWorkerSearch(goodWorkerData, null, initialTestState)).toEqual(true);
  });

  test("if there is no default data, but the value is found elsewhere, we should return true", () => {
    expect(filterWorkerSearch(noDefaultData, "Apache", initialTestState )).toEqual(true);
  });

  test("if there is no routing data, but the value is found elsewhere, we should return true", () => {
    expect(filterWorkerSearch(noRoutingData, "466", initialTestState)).toEqual(true);
  });

  test("if there is no name data, but the value is found elsewhere, we should return true", () => {
    expect(filterWorkerSearch(noNameData, "466", initialTestState)).toEqual(true);
  });

  test("if there is no office data, but the value is found elsewhere, we should return true", () => {
    expect(filterWorkerSearch(noOfficeData, "466", initialTestState)).toEqual(true);
  });

  test("should find a skill in the routing skill list", () => {
    expect(filterWorkerSearch(goodWorkerData, "466", initialTestState)).toEqual(true);
  });

  test("should find a skill in the default skill list", () => {
    expect(filterWorkerSearch(goodWorkerData, "fake", initialTestState)).toEqual(true);
  });

  test("should find n_number", () => {
    expect(filterWorkerSearch(goodWorkerData, "N666", initialTestState)).toEqual(true);
  });

  test("should find n_number, caps should not matter", () => {
    expect(filterWorkerSearch(goodWorkerData, "n666", initialTestState)).toEqual(true);
  });

  test("should not find the ID", () => {
    expect(filterWorkerSearch(goodWorkerData, "N5666", initialTestState)).toEqual(false);
  });

  test("should find the name", () => {
    expect(filterWorkerSearch(goodWorkerData, "Apache", initialTestState)).toEqual(true);
  });

  test("should find the office", () => {
    expect(filterWorkerSearch(goodWorkerData, "Office", initialTestState)).toEqual(true);
  });

  test("should find the profile id", () => {
    expect(filterWorkerSearch(goodWorkerData, "396", initialTestState)).toEqual(false);
  });

  test("should find the profile name", () => {
    expect(filterWorkerSearch(goodWorkerData, "test4", initialTestState)).toEqual(false);
  });

  test("should find the ou name", () => {
    expect(filterWorkerSearch(goodWorkerData, "operatingUnitName", initialTestState)).toEqual(false);
  });

  test("should find the routing team", () => {
    expect(filterWorkerSearch(goodWorkerData, "kitt", initialTestState)).toEqual(true);
  });
});

describe("filterSkillsByName", () => {
  const skill = {
    name: "skill1"
  };
  test("Skill is null", () => {
    expect(filterSkillsByName(null, "search")).toEqual(false);
  });
  test("Search value is null", () => {
    expect(filterSkillsByName(skill, null)).toEqual(true);
  });
  test("Search value is found", () => {
    expect(filterSkillsByName(skill, "skil")).toEqual(true);
  });
  test("Search value is not found", () => {
    expect(filterSkillsByName(skill, "butter")).toEqual(false);
  });
  test("Skill has no name", () => {
    expect(filterSkillsByName({}, "butter")).toEqual(false);
  });
});

describe("filterWfmUserTable", () => {
  const user = {
    FirstName: "faith",
    LastName: "cuneo",
    Identity: "faith.cuneo@gmail.com",
    Email: "faith.cuneo@yahoo.com",
    EmploymentNumber: "n0263786",
    Id: "88372-0098"
  };
  test("wfm user is null - should return false", () => {
    const result = filterWfmUserTable(null, "chip");
    expect(result).toBe(false);
  });
  test("wfm user is null - should return false", () => {
    const result = filterWfmUserTable({}, null);
    expect(result).toBe(true);
  });
  test("wfm user is has empty values - should return false", () => {
    const result = filterWfmUserTable({}, "none");
    expect(result).toBe(false);
  });
  describe("search value is found", () => {
    test("firstName contains search value - should return true", () => {
      const result = filterWfmUserTable(user, "Ait");
      expect(result).toBe(true);
    });
    test("lastName contains search value - should return true", () => {
      const result = filterWfmUserTable(user, "EO");
      expect(result).toBe(true);
    });
    test("identity contains search value - should return true", () => {
      const result = filterWfmUserTable(user, "gmail");
      expect(result).toBe(true);
    });
    test("email contains search value - should return true", () => {
      const result = filterWfmUserTable(user, "yahoo");
      expect(result).toBe(true);
    });
    test("id contains search value - should return true", () => {
      const result = filterWfmUserTable(user, "0098");
      expect(result).toBe(true);
    });
    test("nNumber contains search value - should return true", () => {
      const result = filterWfmUserTable(user, "637");
      expect(result).toBe(true);
    });
  });
  describe("search value is not found", () => {
    test("should return false", () => {
      const result = filterWfmUserTable(user, "snap");
      expect(result).toBe(false);
    });
  });
});