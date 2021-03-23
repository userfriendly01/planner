import {
  formatWorkerResponse,
  mapTwilioWorkerFromDbWorker,
  mapWorkerFromTwilioWorker
} from "utils";

describe("formatWorkerResponse", () => {

  const unformattedResponse = [
    {
      accountSid: "AC240dd0bc4d65ef2ab1c390f0fb9146da",
      activityName: "Offline",
      activitySid: "WA98fb57313627153d707a17f549566046",
      attributes:
        "{\"unique_id\":\"n0123456\",\"manager_n_number\":\"n1111111\",\"roles\":[\"supervisor\",\"agent\"],\"manager_last_name\":\"Doe\",\"n_number\":\"n1111111\",\"skills\":[\"466\"],\"primary_dept_name\":\"CI TECH APP SERVICES\",\"email_address\":\"Noone@libertymutual.com\",\"full_name\":\"Lemming\",\"profile_id\":1}",
      available: false,
      dateCreated: "2018-05-16T17:19:24.000Z",
      dateStatusChanged: "2019-06-03T21:46:19.000Z",
      dateUpdated: "2019-05-22T18:47:47.000Z",
      friendlyName: "n0317496",
      sid: "WK8b0da13d2eca675babceedb76d7a15eb",
      workspaceSid: "WSde21cfcdde7bcb69cd82f1c060e5dba0",
      url:
        "https://taskrouter.twilio.com/v1/Workspaces/WSde21cfcdde7bcb69cd82f1c060e5dba0/Workers/WK8b0da13d2eca675babceedb76d7a15eb",
      links: {
        cumulative_statistics:
          "https://taskrouter.twilio.com/v1/Workspaces/WSde21cfcdde7bcb69cd82f1c060e5dba0/Workers/CumulativeStatistics",
        reservations:
          "https://taskrouter.twilio.com/v1/Workspaces/WSde21cfcdde7bcb69cd82f1c060e5dba0/Workers/WK8b0da13d2eca675babceedb76d7a15eb/Reservations",
        real_time_statistics:
          "https://taskrouter.twilio.com/v1/Workspaces/WSde21cfcdde7bcb69cd82f1c060e5dba0/Workers/RealTimeStatistics",
        statistics:
          "https://taskrouter.twilio.com/v1/Workspaces/WSde21cfcdde7bcb69cd82f1c060e5dba0/Workers/Statistics",
        worker_channels:
          "https://taskrouter.twilio.com/v1/Workspaces/WSde21cfcdde7bcb69cd82f1c060e5dba0/Workers/WK8b0da13d2eca675babceedb76d7a15eb/Channels",
        channels:
          "https://taskrouter.twilio.com/v1/Workspaces/WSde21cfcdde7bcb69cd82f1c060e5dba0/Workers/WK8b0da13d2eca675babceedb76d7a15eb/Channels",
        worker_statistics:
          "https://taskrouter.twilio.com/v1/Workspaces/WSde21cfcdde7bcb69cd82f1c060e5dba0/Workers/WK8b0da13d2eca675babceedb76d7a15eb/Statistics",
        workspace:
          "https://taskrouter.twilio.com/v1/Workspaces/WSde21cfcdde7bcb69cd82f1c060e5dba0",
        activity:
          "https://taskrouter.twilio.com/v1/Workspaces/WSde21cfcdde7bcb69cd82f1c060e5dba0/Activities/WA98fb57313627153d707a17f549566046"
      }
    }
  ];

  test("if input is null, return empty object", () => {
    expect(formatWorkerResponse(null)).toEqual([]);
  });

  test("if input is empty, return empty object", () => {
    expect(formatWorkerResponse([])).toEqual([]);
  });

  test("should response with a simplified object in key/value pair format", () => {
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
});

const workerSid = "WK123123123";

describe("mapTwilioWorkerFromDbWorker", () => {
  const attributes = {
    attr1: "whatever",
    attr2: { hi: "I'm an object" }
  };
  const dbWorker = {
    attributes,
    workerSid
  };
  test("should return TwilioWorker object with attributes, sid & skillsDifferent; NOT workerSid", () => {
    expect(mapTwilioWorkerFromDbWorker(dbWorker)).toEqual({
      attributes,
      sid: workerSid,
      skillsDifferent: false
    });
  });
});

describe("mapWorkerFromTwilioWorker", () => {
  describe("twilio worker attributes is a json string", () => {
    const twilioWorker = {
      friendlyName: "n0269913",
      sid: "WK123123123",
      attributes: "{\"whatever\":12345}"
    };
    test("should return object with parsed attributes object and sid", () => {
      expect(mapWorkerFromTwilioWorker(twilioWorker)).toEqual({
        sid: "WK123123123",
        attributes: { whatever: 12345 },
        skillsDifferent: false
      });
    });
  });
  describe("twilio worker attributes is undefined", () => {
    const twilioWorker = {
      friendlyName: "n0269913",
      sid: "WK123123123"
    };
    test("should return object where attributes is empty object", () => {
      expect(mapWorkerFromTwilioWorker(twilioWorker)).toEqual({
        sid: "WK123123123",
        attributes: {},
        skillsDifferent: false
      });
    });
  });
  describe("twilio worker attributes is not valid JSON", () => {
    const twilioWorker = {
      friendlyName: "n0269913",
      sid: "WK123123123",
      attributes: "{\"invalid\":\"uh oh\", \"nooooo\"}"
    };
    test("should return object where attributes is empty object", () => {
      expect(mapWorkerFromTwilioWorker(twilioWorker)).toEqual({
        sid: "WK123123123",
        attributes: {},
        skillsDifferent: false
      });
    });
  });
  describe("twilio worker is empty object", () => {
    const twilioWorker = {};
    test("should return object where attributes is empty object and sid is undefined", () => {
      expect(mapWorkerFromTwilioWorker(twilioWorker)).toEqual({
        attributes: {},
        skillsDifferent: false
      });
    });
  });
});