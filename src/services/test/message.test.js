import {
  updateFlashMessage,
  updateClosedMessage
} from "../message";
import MockAdapter from "axios-mock-adapter";
import { apiPaths } from "globals";
import { myAxios } from "utils/myAxios";
import { skillsList } from "testUtils";

const axiosMock = new MockAdapter(myAxios);

beforeEach(() => {
  jest.clearAllMocks();
  axiosMock.reset();
});

const skill = skillsList[2];
const nNumber = "n0263786";

describe("updateFlashMessage", () => {
  const endpoint = apiPaths.FLASH_MESSAGE;
  const message = "I'm a new flash message!";
  describe("call succeeds", () => {
    const data = { huzzah: "you are winner" };
    beforeEach(() => axiosMock.onPost(endpoint).replyOnce(200, data));
    test("should resolve with any successful response", done => {
      updateFlashMessage(skill, message, nNumber)
        .then(resolvedValue => {
          expect(JSON.parse(axiosMock.history.post[0].data)).toEqual({
            skill: skill.name,
            flashMessage: "I\\'m a new flash message!",
            updatedBy: nNumber
          });
          expect(resolvedValue.data).toEqual(data);
          done();
        });
    });
  });
  describe("call fails", () => {
    const badResponse = { wahh: "boo" };
    beforeEach(() => axiosMock.onPost(endpoint).replyOnce(500, badResponse));
    test("should reject with error", done => {
      updateFlashMessage(skill, message, nNumber).catch(rejectedVal => {
        expect(JSON.parse(axiosMock.history.post[0].data)).toEqual({
          skill: skill.name,
          flashMessage: "I\\'m a new flash message!",
          updatedBy: nNumber
        });
        expect(rejectedVal).toEqual(new Error("Request failed with status code 500"));
        done();
      });
    });
  });
});

describe("updateClosedMessage", () => {
  const endpoint = apiPaths.CLOSED_MESSAGE;
  const message = "I'm a new closed message!";
  describe("call succeeds", () => {
    const data = { huzzah: "you are winner" };
    beforeEach(() => axiosMock.onPost(endpoint).replyOnce(200, data));
    test("should resolve with any successful response", done => {
      updateClosedMessage(skill, message, nNumber)
        .then(resolvedValue => {
          expect(JSON.parse(axiosMock.history.post[0].data)).toEqual({
            skill: skill.name,
            closedMessage: "I\\'m a new closed message!",
            updatedBy: nNumber
          });
          expect(resolvedValue.data).toEqual(data);
          done();
        });
    });
  });
  describe("call fails", () => {
    const badResponse = { wahh: "boo" };
    beforeEach(() => axiosMock.onPost(endpoint).replyOnce(500, badResponse));
    test("should reject with error", done => {
      updateClosedMessage(skill, message, nNumber).catch(rejectedVal => {
        expect(JSON.parse(axiosMock.history.post[0].data)).toEqual({
          skill: skill.name,
          closedMessage: "I\\'m a new closed message!",
          updatedBy: nNumber
        });
        expect(rejectedVal).toEqual(new Error("Request failed with status code 500"));
        done();
      });
    });
  });
});

