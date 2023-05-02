import ResetSkillsButton from "../ResetSkillsButton";
import MockAdapter from "axios-mock-adapter";
import {
  ResetSkillsResultsModal,
  StyledButton
} from "components";
import {
  initialState,
  useAdminState,
  useAdminDispatch
} from "context";
import { apiPaths } from "globals";
import React from "react";
import {
  act,
  expectMockedComponent,
  getMockedComponentProps,
  render,
  setupMockedComponents
} from "testUtils";
import {
  mapWorkerFromDbWorker,
  myAxios
} from "utils";

jest.mock("components", () => ({
  ResetSkillsResultsModal: jest.fn(),
  StyledButton: jest.fn()
}));

jest.mock("context", () => ({
  initialState: jest.requireActual("context").initialState,
  useAdminDispatch: jest.fn(),
  useAdminState: jest.fn()
}));

const setMockForm = jest.fn();
const axiosMock = new MockAdapter(myAxios);

const selectedWorkers = [
  {
    sid: "WK0",
    name: "Test1",
    attributes: "{\"routing\": {\"skills\": [\"asigl1\", \"aisgl2\"], \"levels\": {\"aisgl1\": 1,\"aisgl2\": 2}},\"default_skills\": {\"skills\": [\"asigl1\", \"aisgl2\"],\"levels\": {\"aisgl1\": 1,\"aisgl2\": 2}}}"
  },
  {
    sid: "WK1",
    name: "Test2",
    attributes: "{\"routing\": {\"skills\": [\"asigl1\", \"aisgl2\"], \"levels\": {\"aisgl1\": 1,\"aisgl2\": 2}},\"default_skills\": {\"skills\": [\"asigl1\", \"aisgl2\"],\"levels\": {\"aisgl1\": 1,\"aisgl2\": 2}}}"
  }
];

const convertedWorkers = [
  {
    workerSid: selectedWorkers[0].sid,
    name: selectedWorkers[0].name,
    attributes: JSON.parse(selectedWorkers[0].attributes)
  },
  {
    workerSid: selectedWorkers[1].sid,
    name: selectedWorkers[1].name,
    attributes: JSON.parse(selectedWorkers[1].attributes)
  }
];

describe("ResetSkillsButton", () => {

  const renderComponent = state => render(<ResetSkillsButton selected={selectedWorkers}/>, state);

  beforeEach(() => {
    jest.clearAllMocks();
    useAdminState.mockReturnValue(initialState);
    useAdminDispatch.mockReturnValue(setMockForm);
    setupMockedComponents({
      ResetSkillsResultsModal,
      StyledButton
    });
  });

  test("StyledButton is passed Reset Skills text", () => {
    renderComponent();
    const { children } = getMockedComponentProps(StyledButton);
    const rendered = render(children);
    expect(rendered.container).toHaveTextContent("Reset Skills");
  });

  describe("When the reset button is pressed, it should fire a call to reset the selected worker skills", () => {
    describe("when all those resets are successful", () => {
      beforeEach(() => {
        axiosMock.onPost(apiPaths.RESET_WORKER_SKILLS).reply(200, [
          {
            updated: true,
            workerSid: selectedWorkers[0].sid,
            worker: selectedWorkers[0]
          },
          {
            updated: true,
            workerSid: selectedWorkers[1].sid,
            worker: selectedWorkers[1]
          }
        ]);
      });
      test("we should dispatch the correct actions, results modal should recieve an empty array.", done => {
        const state = { ...initialState };
        state.workerContext.selectedWorkers = [ ...selectedWorkers ];
        renderComponent(state);
        act(() => {
          getMockedComponentProps(StyledButton).onClick();
          return Promise.resolve();
        }).then(() => {
          expect(setMockForm).toHaveBeenCalledTimes(4);
          expect(setMockForm).toHaveBeenCalledWith({
            type: "resettingSkills",
            payload: true
          });
          expect(setMockForm).toHaveBeenCalledWith({
            type: "updateWorker",
            payload: mapWorkerFromDbWorker(convertedWorkers[0])
          });
          expect(setMockForm).toHaveBeenCalledWith({
            type: "updateWorker",
            payload: mapWorkerFromDbWorker(convertedWorkers[1])
          });
          expect(setMockForm).toHaveBeenCalledWith({
            type: "resettingSkills",
            payload: false
          });
          expect(ResetSkillsResultsModal.mock.calls[0][0].unsuccessfulWorkers).toEqual([]);
          done();
        });
      });
    });
    describe("when some resets fail", () => {
      beforeEach(() => {
        axiosMock.onPost(apiPaths.RESET_WORKER_SKILLS).reply(200, [
          {
            updated: true,
            workerSid: selectedWorkers[0].sid,
            worker: selectedWorkers[0]
          },
          {
            reason: "bad stuff happened",
            updated: false,
            workerSid: selectedWorkers[1].sid,
            worker: selectedWorkers[1]
          }
        ]);
      });
      test("we should dispatch only dispatch actions on the passed worker resets. Results modal should recieve the failed worker reset.", done => {
        const state = { ...initialState };
        state.workerContext.selectedWorkers = [ ...selectedWorkers ];
        const rendered = renderComponent();
        act(() => {
          getMockedComponentProps(StyledButton).onClick();
          return Promise.resolve();
        }).then(() => {
          expectMockedComponent(rendered, { ResetSkillsResultsModal }, 1);
          expect(setMockForm).toHaveBeenCalledTimes(3);
          expect(setMockForm).toHaveBeenCalledWith({
            type: "resettingSkills",
            payload: true
          });
          expect(setMockForm).toHaveBeenCalledWith({
            type: "updateWorker",
            payload: mapWorkerFromDbWorker(convertedWorkers[0])
          });
          expect(setMockForm).toHaveBeenCalledWith({
            type: "resettingSkills",
            payload: false
          });
          expect(ResetSkillsResultsModal.mock.calls[0][0].unsuccessfulWorkers).toEqual([
            {
              name: selectedWorkers[1].sid,
              reason: "bad stuff happened"
            }
          ]);
          act(() => ResetSkillsResultsModal.mock.calls[0][0].handleClose());
          expectMockedComponent(rendered, { ResetSkillsResultsModal }, 0);
          done();
        });
      });
    });
    describe("when service throws an error", () => {
      beforeEach(() => {
        axiosMock.onPost(apiPaths.RESET_WORKER_SKILLS).reply(500, "wahhhhhh");
      });
      test("we should dispatch only resettingWorkers actions. Results modal should recieve the error message", done => {
        const state = { ...initialState };
        state.workerContext.selectedWorkers = [ ...selectedWorkers ];
        const rendered = renderComponent();
        act(() => {
          getMockedComponentProps(StyledButton).onClick();
          return Promise.resolve();
        }).then(() => {
          expectMockedComponent(rendered, { ResetSkillsResultsModal }, 1);
          expect(setMockForm).toHaveBeenCalledTimes(2);
          expect(setMockForm).toHaveBeenCalledWith({
            type: "resettingSkills",
            payload: true
          });
          expect(setMockForm).toHaveBeenCalledWith({
            type: "resettingSkills",
            payload: false
          });
          expect(ResetSkillsResultsModal.mock.calls[0][0].error).toBe("An unexpected error occurred when trying to reset worker skills");
          act(() => ResetSkillsResultsModal.mock.calls[0][0].handleClose());
          expectMockedComponent(rendered, { ResetSkillsResultsModal }, 0);
          done();
        });
      });
    });
  });
});