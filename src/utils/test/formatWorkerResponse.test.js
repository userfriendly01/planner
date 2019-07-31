import { formatWorkerResponse } from "utils";

describe("formatWorkerResponse()", () => {

  const unformattedResponse = [
    {
      accountSid: "AC240dd0bc4d65ef2ab1c390f0fb9146da",
      activityName: "Offline",
      activitySid: "WA98fb57313627153d707a17f549566046",
      attributes:
        "{\"unique_id\":\"n00000000\",\"manager_n_number\":\"n1111111\",\"roles\":[\"supervisor\",\"agent\"],\"manager_last_name\":\"Doe\",\"n_number\":\"n1111111\",\"skills\":[\"466\"],\"primary_dept_name\":\"CI TECH APP SERVICES\",\"email_address\":\"Noone@libertymutual.com\",\"full_name\":\"Lemming\",\"profile_id\":1}",
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
    expect(formatWorkerResponse(null)).toEqual({});
  });

  test("should response with a simplified object in key/value pair format", () => {
    const formattedProfile = {
      auto_answd_i: false,
      email_txt: "CIIT_Contact_Center_Telephony@libertymutual.com",
      otbnd_recorded_i: false,
      phonetic_nme: "N I Billing and Collections",
      pmt_prcsg_i: false,
      profile_id: 1,
      profile_nme: "NI Billing & Collections",
      push_ntfctn_i: false,
      recorded_i: false,
      row_crtn_dtm: "2018-08-21T15:07:02.000Z",
      row_updt_dtm: "2018-11-05T16:38:20.000Z"
    };
    expect(formatWorkerResponse(unformattedResponse)).toEqual(formattedProfile);
  });
});