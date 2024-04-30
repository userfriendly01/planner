import {
  mapWorkerFromDbWorker,
  mapWorkerToDbWorker
} from "utils";

const sid = "WK123123123";

describe("mapWorkerFromDbWorker", () => {
  let attributes, dbWorker;

  beforeEach(() => {
    attributes = {
      n_number: "n1234567",
      contact_uri: "client:n1234567"
    };
    dbWorker = {
      attributes,
      sid
    };
  });

  test("should return TwilioWorker object with attributes, sid & skillsDifferent", () => {
    expect(mapWorkerFromDbWorker(dbWorker)).toEqual({
      attributes,
      sid,
      skillsDifferent: false
    });
  });

  test("should return TwilioWorker object with {} attributes, sid & skillsDifferent", () => {
    delete dbWorker.attributes;

    expect(mapWorkerFromDbWorker(dbWorker)).toEqual({
      attributes: undefined,
      sid,
      skillsDifferent: false
    });
  });

  test("should lowercase manager_n_number and set full_name if it exists", () => {
    dbWorker.attributes.manager_n_number = "N1234567";
    dbWorker.attributes.emp_first_name = "Bob";
    dbWorker.attributes.emp_last_name = "Smith";
    dbWorker.attributes.full_name = "Blah blah blah";

    expect(mapWorkerFromDbWorker(dbWorker)).toEqual({
      attributes: {
        ...attributes,
        full_name: "Bob Smith",
        emp_first_name: "Bob",
        emp_last_name: "Smith",
        manager_n_number: "n1234567"
      },
      sid,
      skillsDifferent: false
    });
  });

  test("should parse levels when they exist on the user", () => {
    dbWorker.attributes.routing = {
      levels: "{}"
    };
    dbWorker.attributes.default_skills = {
      levels: "{}"
    };
    dbWorker.attributes.disabled_skills = {
      levels: "{}"
    };

    expect(mapWorkerFromDbWorker(dbWorker)).toEqual({
      attributes: {
        ...attributes,
        routing: {
          levels: {}
        },
        default_skills: {
          levels: {}
        },
        disabled_skills: {
          levels: {}
        }
      },
      sid,
      skillsDifferent: false
    });
  });
});

describe("mapWorkerToDbWorker", () => {
  test("should map things to the new expression", () => {
    const user = {
      attributes: {
        routing: {
          caller_states: ["CA", "AK", "WA"]
        },
        caller_id: "+1123456789",
        profile_id: 0
      },
      did: "+1123456789",
      operatingUnitSid: "OU1234",
      zeroOutEnabled: false,
      selfServiceInd: false,
      inactiveForwardTo: "+1123456789"
    };


    expect(mapWorkerToDbWorker(user)).toEqual({
      twilio_attributes: JSON.stringify({
        routing: {
          caller_states: ["CA", "AK", "WA"]
        },
        caller_id: "+1123456789",
        profile_id: 0,
        agent_attribute_1: 0
      }),
      did: "+1123456789",
      operating_unit_sid: "OU1234",
      zero_out_enabled: false,
      self_service_ind: false,
      inactive_forward_to: "+1123456789"
    });
  });
});