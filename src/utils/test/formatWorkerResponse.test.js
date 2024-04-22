import {
  mapWorkerFromDbWorker,
  mapWorkerToDbWorker
} from "utils";

const sid = "WK123123123";

describe("mapWorkerFromDbWorker", () => {
  let attributes, dbWorker;

  beforeEach(() => {
    attributes = {
      attr1: "whatever",
      attr2: { hi: "I'm an object" }
    };
    dbWorker = {
      twilio_attributes_raw: JSON.stringify(attributes),
      sid
    };
  });

  test("should return TwilioWorker object with mapped caller id, sid & routing", () => {
    expect(mapWorkerFromDbWorker(dbWorker)).toEqual({
      attributes,
      sid,
      skillsDifferent: false
    });
  });

  test("should return TwilioWorker object with attributes, sid & skillsDifferent", () => {
    expect(mapWorkerFromDbWorker(dbWorker)).toEqual({
      attributes,
      sid,
      skillsDifferent: false
    });
  });

  test("should return TwilioWorker object with {} attributes, sid & skillsDifferent", () => {
    delete dbWorker.twilio_attributes_raw;

    expect(mapWorkerFromDbWorker(dbWorker)).toEqual({
      attributes: {},
      sid,
      skillsDifferent: false
    });
  });

  test("should lowercase manager_n_number and set full_name if it exists", () => {
    attributes.manager_n_number = "N1234567";
    attributes.emp_first_name = "Bob";
    attributes.emp_last_name = "Smith";
    attributes.full_name = "Blah blah blah";
    dbWorker.twilio_attributes_raw = JSON.stringify(attributes);

    expect(mapWorkerFromDbWorker(dbWorker)).toEqual({
      attributes: {
        full_name: "Bob Smith",
        emp_first_name: "Bob",
        emp_last_name: "Smith",
        manager_n_number: "n1234567",
        attr1: "whatever",
        attr2: { hi: "I'm an object" }
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
      caller_id: "+1123456789",
      operating_unit_sid: "OU1234",
      zero_out_enabled: false,
      self_service_ind: false,
      inactive_forward_to: "+1123456789"
    });
  });
});