import {
  sortDialListEntriesByName,
  sortManagersByName,
  sortTaskRouterSkillByName
} from "../sortUtils";

describe("sortDialListEntriesByName", () => {
  const arr = [
    { contact_nme: "cee" },
    { contact_nme: "bee" },
    { contact_nme: "ay" },
    { contact_nme: "dee" },
    { contact_nme: "ay" },
    { contact_nme: "Cee again" },
    { contact_nme: "B again" },
    { contact_nme: "A caps" }
  ];
  test("should return array in alphabetical order", () => {
    expect(arr.sort(sortDialListEntriesByName)).toEqual([
      { contact_nme: "A caps" },
      { contact_nme: "ay" },
      { contact_nme: "ay" },
      { contact_nme: "B again" },
      { contact_nme: "bee" },
      { contact_nme: "cee" },
      { contact_nme: "Cee again" },
      { contact_nme: "dee" }
    ]);
  });
});

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
    { skill: "bee" },
    { skill: "dee" },
    { skill: "cee" },
    { skill: "ay" },
    { skill: "ay" }
  ];
  test("should return array in alphabetical order", () => {
    expect(arr.sort(sortTaskRouterSkillByName)).toEqual([
      { skill: "ay" },
      { skill: "ay" },
      { skill: "bee" },
      { skill: "cee" },
      { skill: "dee" }
    ]);
  });
});
