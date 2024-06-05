import {
  updateTfn,
  getTfn
} from "../tfnActivation";
import MockAdapter from "axios-mock-adapter";
import { apiPaths } from "globals";
import { myAxios } from "utils/myAxios";

const axiosMock = new MockAdapter(myAxios);

beforeEach(() => {
  jest.clearAllMocks();
  axiosMock.reset();
});

const endpoint = apiPaths.TFN_DATA;
const nNumber = "n0263786";
const tfnState = {
  group: {
    callflowId: 3,
    voiceWebhookUrl: "webhookurl",
    defaultSkill: "defaultSkill"
  },
  entryMessage: "Thank you for calling my new TFN!",
  displayName: "Test TFN"
};
const phoneNumber = "+16038518200";


describe("getTfn", () => {
  describe("call succeeds", () => {
    const data = { huzzah: "you are winner" };
    beforeEach(() => axiosMock.onGet(`${endpoint}/${phoneNumber}`).replyOnce(200, data));
    test("should resolve with any successful response", done => {
      getTfn(phoneNumber)
        .then(resolvedValue => {
          expect(resolvedValue.data).toEqual(data);
          done();
        });
    });
  });
  describe("call fails", () => {
    const badResponse = { wahh: "boo" };
    beforeEach(() => axiosMock.onGet(`${endpoint}/${phoneNumber}`).replyOnce(500, badResponse));
    test("should reject with error", done => {
      getTfn(phoneNumber).catch(rejectedVal => {
        expect(rejectedVal).toEqual(new Error("Request failed with status code 500"));
        done();
      });
    });
  });
});

describe("updateTfn", () => {
  describe("call succeeds", () => {
    const data = { huzzah: "you are winner" };
    beforeEach(() => axiosMock.onPost(endpoint).replyOnce(200, data));
    test("should resolve with any successful response", done => {
      updateTfn(phoneNumber, tfnState, nNumber)
        .then(resolvedValue => {
          expect(JSON.parse(axiosMock.history.post[0].data)).toEqual({
            phone_number: phoneNumber,
            callflow_id: "3",
            voice_webhook_url: tfnState.group.voiceWebhookUrl,
            entry_msg: tfnState.entryMessage,
            display_nme: tfnState.displayName,
            default_skill: tfnState.group.defaultSkill,
            row_updt_by: nNumber
          });
          expect(resolvedValue.data).toEqual(data);
          done();
        });
    });
    describe("quotes are present in payload", () => {
      test("quotes should be escaped", done => {
        const quoteTfnState = {
          ...tfnState,
          entryMessage: "I'm an \"entry\" message. ",
          displayName: "Look at all these '''"
        };
        updateTfn(phoneNumber, quoteTfnState, nNumber)
          .then(resolvedValue => {
            expect(JSON.parse(axiosMock.history.post[0].data)).toEqual({
              phone_number: phoneNumber,
              callflow_id: "3",
              voice_webhook_url: tfnState.group.voiceWebhookUrl,
              entry_msg: "I\\'m an \\\"entry\\\" message. ",
              display_nme: "Look at all these \\'\\'\\'",
              default_skill: tfnState.group.defaultSkill,
              row_updt_by: nNumber
            });
            expect(resolvedValue.data).toEqual(data);
            done();
          });
      });
    });
  });
  describe("call fails", () => {
    const badResponse = { wahh: "boo" };
    beforeEach(() => axiosMock.onPost(endpoint).replyOnce(500, badResponse));
    test("should reject with error", done => {
      updateTfn(phoneNumber, tfnState, nNumber).catch(rejectedVal => {
        expect(JSON.parse(axiosMock.history.post[0].data)).toEqual({
          phone_number: phoneNumber,
          callflow_id: "3",
          voice_webhook_url: tfnState.group.voiceWebhookUrl,
          entry_msg: tfnState.entryMessage,
          display_nme: tfnState.displayName,
          default_skill: tfnState.group.defaultSkill,
          row_updt_by: nNumber
        });
        expect(rejectedVal).toEqual(new Error("Request failed with status code 500"));
        done();
      });
    });
  });
});


