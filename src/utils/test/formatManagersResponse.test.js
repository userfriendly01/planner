import { formatManagersResponse } from "utils";

describe("formatManagersResponse", () => {

  const unformattedResponse = [
    {
      manager_first_nme: "test",
      manager_last_nme: "test",
      manager_n_num: "test"
    },
    {
      manager_first_nme: "test2",
      manager_last_nme: "test2",
      manager_n_num: "test2"
    }
  ];

  test("if input is null, return empty array", () => {
    expect(formatManagersResponse(null)).toEqual([]);
  });

  test("if input is empty, return empty array", () => {
    expect(formatManagersResponse([])).toEqual([]);
  });

  test("should return array of formatted managers", () => {
    const formattedManagers = [
      {
        manager_first_name: "test",
        manager_last_name: "test",
        manager_n_number: "test"
      }, {
        manager_first_name: "test2",
        manager_last_name: "test2",
        manager_n_number: "test2"
      }
    ];
    expect(formatManagersResponse(unformattedResponse)).toEqual(formattedManagers);
  });
});
