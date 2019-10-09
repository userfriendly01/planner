import {
  sortManagersByName,
  sortSkillsByName
} from "../sortUtils";

describe("sortManagersByName", () => {
  const managerList = [
    {
      manager_n_number: "n0333333",
      manager_first_name: "Mike",
      manager_last_name: "Tyson"
    },
    {
      manager_n_number: "n0666666",
      manager_first_name: "Muhammad",
      manager_last_name: "Smith"
    },
    {
      manager_n_number: "n0555555",
      manager_first_name: "Muhammad",
      manager_last_name: "Jones"
    },
    {
      manager_n_number: "n0222222",
      manager_first_name: "Joe",
      manager_last_name: "Fraiser"
    },
    {
      manager_n_number: "n0444444",
      manager_first_name: "Muhammad",
      manager_last_name: "Ali"
    },
    {
      manager_n_number: "n0333333",
      manager_first_name: "Mike",
      manager_last_name: "Tyson"
    },
    {
      manager_n_number: "n0111111",
      manager_first_name: "George",
      manager_last_name: "Foreman"
    }
  ];

  test("should return managers sorted by name", () => {
    expect(managerList.sort(sortManagersByName)).toEqual([
      {
        manager_n_number: "n0111111",
        manager_first_name: "George",
        manager_last_name: "Foreman"
      },
      {
        manager_n_number: "n0222222",
        manager_first_name: "Joe",
        manager_last_name: "Fraiser"
      },
      {
        manager_n_number: "n0333333",
        manager_first_name: "Mike",
        manager_last_name: "Tyson"
      },
      {
        manager_n_number: "n0333333",
        manager_first_name: "Mike",
        manager_last_name: "Tyson"
      },
      {
        manager_n_number: "n0444444",
        manager_first_name: "Muhammad",
        manager_last_name: "Ali"
      },
      {
        manager_n_number: "n0555555",
        manager_first_name: "Muhammad",
        manager_last_name: "Jones"
      },
      {
        manager_n_number: "n0666666",
        manager_first_name: "Muhammad",
        manager_last_name: "Smith"
      }
    ]);
  });
});

describe("sortSkillsByName", () => {
  const arr = [
    { name: "bee" },
    { name: "dee" },
    { name: "cee" },
    { name: "ay" },
    { name: 42 },
    { name: "ay" }
  ];
  test("should return array in alphabetical order", () => {
    expect(arr.sort(sortSkillsByName)).toEqual([
      { name: 42 },
      { name: "ay" },
      { name: "ay" },
      { name: "bee" },
      { name: "cee" },
      { name: "dee" }
    ]);
  });
});
