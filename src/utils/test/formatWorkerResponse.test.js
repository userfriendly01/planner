import {
  formatWorkerResponse,
  mapWorkerFromDbWorker
} from "utils";

describe("formatWorkerResponse", () => {

  const unformattedResponse = [
    {
      attributes: {
        email_address: "Noone@libertymutual.com",
        full_name: "Lemming",
        manager_last_name: "Doe",
        manager_n_number: "n1111111",
        n_number: "n1111111",
        primary_dept_name: "CI TECH APP SERVICES",
        profile_id: 1,
        roles: ["supervisor", "agent"],
        skills: ["466"],
        unique_id: "n0123456"
      },
      workerSid: "WK8b0da13d2eca675babceedb76d7a15eb"
    }
  ];

  const unformattedResponseNoAttr = [
    {
      workerSid: "WK8b0da13d2eca675babceedb76d7a15eb"
    }
  ];

  test("if input is null, return empty object", () => {
    expect(formatWorkerResponse(null)).toEqual([]);
  });

  test("if input is empty, return empty object", () => {
    expect(formatWorkerResponse([])).toEqual([]);
  });

  test("should respond skillsDifferent false", () => {
    const formattedWorker = [
      {
        attributes: {
          email_address: "Noone@libertymutual.com",
          full_name: "Lemming",
          manager_last_name: "Doe",
          manager_n_number: "n1111111",
          n_number: "n1111111",
          primary_dept_name: "CI TECH APP SERVICES",
          profile_id: 1,
          roles: ["supervisor", "agent"],
          skills: ["466"],
          unique_id: "n0123456"
        },
        sid: "WK8b0da13d2eca675babceedb76d7a15eb",
        skillsDifferent: false
      }
    ];
    expect(formatWorkerResponse(unformattedResponse)).toEqual(formattedWorker);
  });

  test("should respond skillsDifferent false when no attributes exist", () => {
    const formattedWorker = [
      {
        sid: "WK8b0da13d2eca675babceedb76d7a15eb",
        skillsDifferent: false
      }
    ];
    expect(formatWorkerResponse(unformattedResponseNoAttr)).toEqual(formattedWorker);
  });
});

const workerSid = "WK123123123";

describe("mapWorkerFromDbWorker", () => {
  const attributes = {
    attr1: "whatever",
    attr2: { hi: "I'm an object" }
  };
  const dbWorker = {
    attributes,
    workerSid
  };
  test("should return TwilioWorker object with attributes, sid & skillsDifferent; NOT workerSid", () => {
    expect(mapWorkerFromDbWorker(dbWorker)).toEqual({
      attributes,
      sid: workerSid,
      skillsDifferent: false
    });
  });
});
