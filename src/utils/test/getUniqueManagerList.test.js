import { getUniqueManagerList } from "utils";

describe("formatWorkerResponse()", () => {

  const unformattedResponse = [
    {
      attributes: {
        manager_first_name: "John",
        manager_last_name: "Wick",
        manager_n_number: "n6666666",
        otherStuff: "2018-05-16T17:19:24.000Z",
        doesntmatter: "2019-06-03T21:46:19.000Z"
      }
    },
    {
      attributes: {
        manager_first_name: "John",
        manager_last_name: "Wick",
        manager_n_number: "n6666666",
        otherStuff: "2018-05-16T17:19:24.000Z",
        doesntmatter: "2019-06-03T21:46:19.000Z"
      }
    },
    {
      attributes: {
        manager_first_name: "DifferentFirst",
        manager_last_name: "SameNnum",
        manager_n_number: "n6666666",
        otherStuff: "2018-05-16T17:19:24.000Z",
        doesntmatter: "2019-06-03T21:46:19.000Z"
      }
    },
    {
      attributes: {
        manager_first_name: "John",
        manager_last_name: "Wick",
        manager_n_number: "n1234455",
        otherStuff: "2018-05-16T17:19:24.000Z",
        doesntmatter: "2019-06-03T21:46:19.000Z"
      }
    },
    {
      attributes: {
        manager_first_name: "Shawn",
        manager_last_name: "Michaels",
        manager_n_number: "n1234567",
        otherStuff: "2018-05-16T17:19:24.000Z",
        doesntmatter: "2019-06-03T21:46:19.000Z"
      }
    },
    {
      attributes: {
        otherStuff: "2018-05-16T17:19:24.000Z",
        doesntmatter: "2019-06-03T21:46:19.000Z"
      }
    }
  ];

  test("if input is empty, return empty object", () => {
    expect(getUniqueManagerList([])).toEqual([]);
  });

  test("if input is null, return empty object", () => {
    expect(getUniqueManagerList(null)).toEqual([]);
  });

  test("should response with a simplified object in key/value pair format", () => {
    const uniqueList = [
      {
        manager_first_name: "John",
        manager_last_name: "Wick",
        manager_n_number: "n6666666"
      },
      {
        manager_first_name: "John",
        manager_last_name: "Wick",
        manager_n_number: "n1234455"
      },
      {
        manager_first_name: "Shawn",
        manager_last_name: "Michaels",
        manager_n_number: "n1234567"
      }
    ];
    expect(getUniqueManagerList(unformattedResponse)).toEqual(uniqueList);
  });
});