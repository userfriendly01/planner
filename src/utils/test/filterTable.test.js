import { filterByNameAndSkills } from "utils";

describe("filterByNameSkillsAndOffice()", () => {

  const goodWorkerData = {
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
      },
      office_location_name: "Office 4",
      unique_id: "N666"
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
    expect(filterByNameAndSkills(null, null)).toEqual(false);
  });

  test("if there are no attributes on the worker we should return false", () => {
    expect(filterByNameAndSkills(noAttributesData, "466")).toEqual(false);
  });

  test("if the worker is good, but null is the search, return false", () => {
    expect(filterByNameAndSkills(goodWorkerData, null)).toEqual(false);
  });

  test("if there is no default data, but the value is found elsewhere, we should return true", () => {
    expect(filterByNameAndSkills(noDefaultData, "Apache")).toEqual(true);
  });

  test("if there is no routing data, but the value is found elsewhere, we should return true", () => {
    expect(filterByNameAndSkills(noRoutingData, "466")).toEqual(true);
  });

  test("if there is no name data, but the value is found elsewhere, we should return true", () => {
    expect(filterByNameAndSkills(noNameData, "466")).toEqual(true);
  });

  test("if there is no office data, but the value is found elsewhere, we should return true", () => {
    expect(filterByNameAndSkills(noOfficeData, "466")).toEqual(true);
  });

  test("should find a skill in the routing skill list", () => {
    expect(filterByNameAndSkills(goodWorkerData, "466")).toEqual(true);
  });

  test("should find a skill in the default skill list", () => {
    expect(filterByNameAndSkills(goodWorkerData, "fake")).toEqual(true);
  });

  test("should find unique_id", () => {
    expect(filterByNameAndSkills(goodWorkerData, "N666")).toEqual(true);
  });

  test("should find unique_id, caps should not matter", () => {
    expect(filterByNameAndSkills(goodWorkerData, "n666")).toEqual(true);
  });

  test("should not find the ID", () => {
    expect(filterByNameAndSkills(goodWorkerData, "N5666")).toEqual(false);
  });

  test("should find the name", () => {
    expect(filterByNameAndSkills(goodWorkerData, "Apache")).toEqual(true);
  });

  test("should find the office", () => {
    expect(filterByNameAndSkills(goodWorkerData, "Office")).toEqual(true);
  });
});