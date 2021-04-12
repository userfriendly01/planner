import ResetSkillsButton from "../ResetSkillsButton";
import MockAdapter from "axios-mock-adapter";
import {
  ResultsModal,
  StyledButton
} from "components";
import { apiPaths } from "globals";
import React from "react";
import {
  act,
  expectMockedComponent,
  getMockedComponentProps,
  getTestState,
  mockStore,
  render,
  setupMockedComponents
} from "testUtils";
import {
  mapWorkerFromDbWorker,
  myAxios
} from "utils";

jest.mock("components", () => ({
  __esModule: true,
  ResultsModal: jest.fn(),
  StyledButton: jest.fn()
}));

const axiosMock = new MockAdapter(myAxios);

const selectedWorkers = [
  {
    sid: "WK0",
    name: "Test0"
  },
  {
    sid: "WK1",
    name: "Test1"
  },
  {
    sid: "WK2",
    name: "Test2"
  }
];

describe("ResetSkillsButton", () => {

  const renderComponent = state => render(<ResetSkillsButton/>, state);

  beforeEach(() => {
    mockStore.reset();
    setupMockedComponents({
      ResultsModal,
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
            workerSid: selectedWorkers[2].sid,
            worker: selectedWorkers[2]
          }
        ]);
      });
      test("we should dispatch the correct actions, results modal should recieve an empty array.", done => {
        const state = getTestState();
        state.workerContext.selectedWorkers = [ ...selectedWorkers ];
        renderComponent(state);
        act(() => {
          getMockedComponentProps(StyledButton).onClick();
          return Promise.resolve();
        }).then(() => {
          expect(mockStore.getActions()).toEqual([
            {
              type: "resettingSkills",
              payload: true
            },
            {
              type: "toggleWorkerSelected",
              payload: {
                sid: selectedWorkers[0].sid
              }
            },
            {
              type: "updateWorker",
              payload: mapWorkerFromDbWorker(selectedWorkers[0])
            },
            {
              type: "toggleWorkerSelected",
              payload: {
                sid: selectedWorkers[2].sid
              }
            },
            {
              type: "updateWorker",
              payload: mapWorkerFromDbWorker(selectedWorkers[2])
            },
            {
              type: "resettingSkills",
              payload: false
            }
          ]);
          expect(ResultsModal.mock.calls[0][0].unsuccessfulWorkers).toEqual([]);
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
            workerSid: selectedWorkers[2].sid,
            worker: selectedWorkers[2]
          }
        ]);
      });
      test("we should dispatch only dispatch actions on the passed worker resets. Results modal should recieve the failed worker reset.", done => {
        const state = getTestState();
        state.workerContext.selectedWorkers = [ ...selectedWorkers ];
        const rendered = renderComponent();
        act(() => {
          getMockedComponentProps(StyledButton).onClick();
          return Promise.resolve();
        }).then(() => {
          expectMockedComponent(rendered, { ResultsModal }, 1);
          expect(mockStore.getActions()).toEqual([
            {
              type: "resettingSkills",
              payload: true
            },
            {
              type: "toggleWorkerSelected",
              payload: {
                sid: selectedWorkers[0].sid
              }
            },
            {
              type: "updateWorker",
              payload: mapWorkerFromDbWorker(selectedWorkers[0])
            },
            {
              type: "resettingSkills",
              payload: false
            }
          ]);
          expect(ResultsModal.mock.calls[0][0].unsuccessfulWorkers).toEqual([
            {
              name: "Test2",
              reason: "bad stuff happened"
            }
          ]);
          act(() => ResultsModal.mock.calls[0][0].handleClose());
          expectMockedComponent(rendered, { ResultsModal }, 0);
          done();
        });
      });
    });
    describe("when service throws an error", () => {
      beforeEach(() => {
        axiosMock.onPost(apiPaths.RESET_WORKER_SKILLS).reply(500, "wahhhhhh");
      });
      test("we should dispatch only resettingWorkers actions. Results modal should recieve the error message", done => {
        const state = getTestState();
        state.workerContext.selectedWorkers = [ ...selectedWorkers ];
        const rendered = renderComponent();
        act(() => {
          getMockedComponentProps(StyledButton).onClick();
          return Promise.resolve();
        }).then(() => {
          expectMockedComponent(rendered, { ResultsModal }, 1);
          expect(mockStore.getActions()).toEqual([
            {
              type: "resettingSkills",
              payload: true
            },
            {
              type: "resettingSkills",
              payload: false
            }
          ]);
          expect(ResultsModal.mock.calls[0][0].error).toBe("An unexpected error occurred when trying to reset worker skills");
          act(() => ResultsModal.mock.calls[0][0].handleClose());
          expectMockedComponent(rendered, { ResultsModal }, 0);
          done();
        });
      });
    });
  });
});