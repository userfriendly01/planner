import { formatOfficesResponse } from "utils";

describe("formatOfficesResponse", () => {

  const unformattedResponse = [
    {
      office_nme: "test",
      office_num: "test"
    }, {
      office_nme: "test2",
      office_num: "test2"
    }
  ];

  test("if input is null, return empty Map", () => {
    expect(formatOfficesResponse(null)).toEqual(new Map());
  });

  test("if input is empty, return empty Map", () => {
    expect(formatOfficesResponse([])).toEqual(new Map());
  });

  test("should return a new Map with a key that is the office number, and a value of the office", () => {
    expect(formatOfficesResponse(unformattedResponse)).toEqual(new Map([
      [
        unformattedResponse[0].office_num, unformattedResponse[0]
      ],
      [
        unformattedResponse[1].office_num, unformattedResponse[1]
      ]
    ]));
  });
});
