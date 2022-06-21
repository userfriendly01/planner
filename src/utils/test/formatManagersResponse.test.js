import { formatManagersResponse } from "utils";

describe("formatManagersResponse", () => {

  const unformattedResponse = [
    {
      manager_id: 1,
      manager_first_nme: "test",
      manager_last_nme: "test",
      manager_n_num: "test",
      profile_id: 1,
      calabrio_team_ids: "210, 215"
    },
    {
      manager_id: 2,
      manager_first_nme: "test2",
      manager_last_nme: "test2",
      manager_n_num: "test2",
      profile_id: 1,
      calabrio_team_ids: null
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
        manager_id: 1,
        manager_first_name: "test",
        manager_last_name: "test",
        manager_n_number: "test",
        profile_id: 1,
        calabrio_team_ids: [210, 215]
      }, {
        manager_id: 2,
        manager_first_name: "test2",
        manager_last_name: "test2",
        manager_n_number: "test2",
        profile_id: 1,
        calabrio_team_ids: []
      }
    ];
    expect(formatManagersResponse(unformattedResponse)).toEqual(formattedManagers);
  });
});
