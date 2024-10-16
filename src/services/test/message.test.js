import {
  updateFlashMessage,
  updateClosedMessage
} from "../message";
import MockAdapter from "axios-mock-adapter";
import { apiPaths } from "globals";
import { myAxios } from "utils/myAxios";
import { mockSkills } from "testUtils";
import { skillActions } from "context/reducers/skillReducer";

const axiosMock = new MockAdapter(myAxios);

beforeEach(() => {
  jest.clearAllMocks();
  axiosMock.reset();
});

const mockDispatch = jest.fn();
const skill = mockSkills[2];
const nNumber = "n0263786";
const tokens = {
  adminService: "pstpstpst"
};

describe("updateFlashMessage", () => {
  const endpoint = apiPaths.FLASH_MESSAGE;
  const message = "I'm a new flash message!";
  describe("call succeeds", () => {
    const data = { huzzah: "you are winner" };
    beforeEach(() => axiosMock.onPut(endpoint).replyOnce(200, data));
    test("should resolve with any successful response", async () => {
      await updateFlashMessage({
        skillName: skill.name,
        message,
        nNumber
      }, tokens, mockDispatch);
      expect(JSON.parse(axiosMock.history.put[0].data)).toEqual({
        skill: skill.name,
        flashMessage: "I\\'m a new flash message!",
        updatedBy: nNumber
      });
      expect(mockDispatch).toHaveBeenCalledWith({
        type: skillActions.UPDATE_SKILL,
        payload: {
          skillName: skill.name,
          changes: {
            flashMessage: message
          }
        }
      });
    });
  });
  describe("call fails", () => {
    const badResponse = { wahh: "boo" };
    beforeEach(() => axiosMock.onPut(endpoint).replyOnce(500, badResponse));
    test("should reject with error", async () => {
      try {
        await updateFlashMessage({
          skillName: skill.name,
          message,
          nNumber
        }, tokens, mockDispatch);
      } catch(err) {
        expect(JSON.parse(axiosMock.history.put[0].data)).toEqual({
          skill: skill.name,
          flashMessage: "I\\'m a new flash message!",
          updatedBy: nNumber
        });
        expect(mockDispatch).not.toHaveBeenCalled();
        expect(err).toEqual(new Error("Request failed with status code 500"));
      }
    });
  });
});

describe("updateClosedMessage", () => {
  const endpoint = apiPaths.CLOSED_MESSAGE;
  const message = "I'm a new closed message!";
  describe("call succeeds", () => {
    const data = { huzzah: "you are winner" };
    beforeEach(() => axiosMock.onPut(endpoint).replyOnce(200, data));
    test("should resolve with any successful response", async () => {
      await updateClosedMessage({
        skillName: skill.name,
        message,
        nNumber
      }, tokens, mockDispatch);
      expect(JSON.parse(axiosMock.history.put[0].data)).toEqual({
        skill: skill.name,
        closedMessage: "I\\'m a new closed message!",
        updatedBy: nNumber
      });
      expect(mockDispatch).toHaveBeenCalledWith({
        type: skillActions.UPDATE_SKILL,
        payload: {
          skillName: skill.name,
          changes: {
            closedMessage: message
          }
        }
      });
    });
  });
  describe("call fails", () => {
    const badResponse = { wahh: "boo" };
    beforeEach(() => axiosMock.onPut(endpoint).replyOnce(500, badResponse));
    test("should reject with error", async () => {
      try {
        await updateClosedMessage({
          skillName: skill.name,
          message,
          nNumber
        }, tokens, mockDispatch);
      } catch(err) {
        expect(JSON.parse(axiosMock.history.put[0].data)).toEqual({
          skill: skill.name,
          closedMessage: "I\\'m a new closed message!",
          updatedBy: nNumber
        });
        expect(mockDispatch).not.toHaveBeenCalled();
        expect(err).toEqual(new Error("Request failed with status code 500"));
      }
    });
  });
});