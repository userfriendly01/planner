import {
  updateFlashMessage,
  updateClosedMessage
} from "../message";
import AxMockAdapter from "axios-mock-adapter";
import { apiPaths } from "globals";
import { myAxios } from "utils/myAxios";
import { mockSkills } from "testUtils";
import { skillActions } from "context/reducers/skillReducer";
import { apolloClient } from "../../components/core/Auth/SharedGraphAPIProvider";

jest.mock("../../components/core/Auth/SharedGraphAPIProvider", () => ({
  apolloClient: {
    mutate: jest.fn(),
    query: jest.fn()
  }
}));

const axiosMock = new AxMockAdapter(myAxios);

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

describe("UpdateFlashMessage", () => {
  const endpoint = apiPaths.FLASH_MESSAGE;
  const message = "I'm a new flash message!";
  describe("Calls succeed", () => {
    const data = { huzzah: "you are winner" };
    beforeEach(() => axiosMock.onPut(endpoint).replyOnce(200, data));
    beforeEach(() => apolloClient.mutate.mockResolvedValue({}));
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
      expect(apolloClient.mutate).toHaveBeenCalledTimes(1);
      // expect(apolloClient.mutate).toHaveBeenCalledWith("a"); wsx
    });
  });
  describe("Calls fail", () => {
    const badResponse = { wahh: "boo" };
    const endpoint = apiPaths.FLASH_MESSAGE;
    const data = { huzzah: "you are winner" };
  
    test("Axios call should fail", async () => {
      axiosMock.onPut(endpoint).replyOnce(500, badResponse)
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
        expect(apolloClient.mutate).not.toHaveBeenCalled();
        expect(err).toEqual(new Error("Request failed with status code 500"));
      }
    });
    test("Shared Graph call should fail", async () => {
      axiosMock.onPut(endpoint).replyOnce(200, data);
      const errMessages = [{ message: "This operation failed miserably"}];
      apolloClient.mutate.mockResolvedValueOnce({ errors: errMessages });
      let errResult = null;
      try {
        await updateFlashMessage({
          skillName: skill.name,
          message,
          nNumber
        }, tokens, mockDispatch);
      } catch (err) {
        errResult = err;
      }
      expect(errResult).toEqual(errMessages.map(er => er.message));
      expect(mockDispatch).not.toHaveBeenCalled();
      expect(apolloClient.mutate).toHaveBeenCalled();
    })
  });
});

describe("updateClosedMessage", () => {
  const endpoint = apiPaths.CLOSED_MESSAGE;
  const message = "I'm a new closed message!";
  describe("calls succeed", () => {
    const data = { huzzah: "you are winner" };
    test("Should resolve with any successful response", async () => {
      axiosMock.onPut(endpoint).replyOnce(200, data);
      apolloClient.mutate.mockResolvedValue({});
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
      expect(apolloClient.mutate).toHaveBeenCalledTimes(1);
    });
  });
  describe("Calls fail", () => {
    const data = { huzzah: "you are winner" };
    const badResponse = { wahh: "boo" };
    test("should reject with error", async () => {
      axiosMock.onPut(endpoint).replyOnce(500, badResponse);
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
        expect(apolloClient.mutate).not.toHaveBeenCalled();
        expect(err).toEqual(new Error("Request failed with status code 500"));
      }
    });
    test("Shared Graph call should fail", async () => {
      axiosMock.onPut(endpoint).replyOnce(200, data);
      const errMessages = [{ message: "This operation failed miserably"}];
      apolloClient.mutate.mockResolvedValueOnce({ errors: errMessages });
      let errResult = null;
      try {
        await updateClosedMessage({
          skillName: skill.name,
          message,
          nNumber
        }, tokens, mockDispatch);
      } catch (err) {
        errResult = err;
      }
      expect(errResult).toEqual(errMessages.map(er => er.message));
      expect(mockDispatch).not.toHaveBeenCalled();
      expect(apolloClient.mutate).toHaveBeenCalled();
    })
  });
});