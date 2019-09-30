import { sortByFirstName } from "../sortByFirstName";

describe("sortByFirstName", () => {
  const managerList = [
    {
      manager_n_number: "n0555555",
      manager_first_name: "Mike",
      manager_last_name: "Tyson"
    },
    {
      manager_n_number: "n0444444",
      manager_first_name: "Joe",
      manager_last_name: "Fraiser"
    },
    {
      manager_n_number: "n0333333",
      manager_first_name: "Muhammad",
      manager_last_name: "Ali"
    },
    {
      manager_n_number: "n0555555",
      manager_first_name: "Mike",
      manager_last_name: "Tyson"
    },
    {
      manager_n_number: "n0555555",
      manager_first_name: "George",
      manager_last_name: "Foreman"
    }
  ];

  test("should return managers sorted by first name", () => {
    expect(managerList.sort(sortByFirstName)).toEqual([
      {
        manager_n_number: "n0555555",
        manager_first_name: "George",
        manager_last_name: "Foreman"
      },
      {
        manager_n_number: "n0444444",
        manager_first_name: "Joe",
        manager_last_name: "Fraiser"
      },
      {
        manager_n_number: "n0555555",
        manager_first_name: "Mike",
        manager_last_name: "Tyson"
      },
      {
        manager_n_number: "n0555555",
        manager_first_name: "Mike",
        manager_last_name: "Tyson"
      },
      {
        manager_n_number: "n0333333",
        manager_first_name: "Muhammad",
        manager_last_name: "Ali"
      }
    ]);
  });
});