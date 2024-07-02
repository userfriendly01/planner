import { ResetSkillsButton } from "../ResetSkillsButton";
import MockAdapter from "axios-mock-adapter";
import { ResetSkillsResultsModal } from "usermanagement/ResetSkillsResultsModal";
import { StyledButton } from "components/StyledButton";
import { useAdminState } from "context/appContext";
import { initialState } from "context/reducer";
import { apiPaths } from "globals";
import React from "react";
import {
  act,
  expectMockedComponent,
  getMockedComponentProps,
  render,
  setupMockedComponents
} from "testUtils";
import { myAxios } from "utils/myAxios";

jest.mock("usermanagement/ResetSkillsResultsModal", () => ({
  ResetSkillsResultsModal: jest.fn()
}));

jest.mock("components/StyledButton", () => ({
  StyledButton: jest.fn()
}));

jest.mock("context/appContext", () => ({
  useAdminState: jest.fn()
}));

const axiosMock = new MockAdapter(myAxios);
const mockResettingSkills = jest.fn();

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

describe("ResetSkillsButton", () => {

  const renderComponent = state => render(<ResetSkillsButton selected={selectedWorkers} setResettingSkills={mockResettingSkills}/>, state);

  beforeEach(() => {
    jest.clearAllMocks();
    useAdminState.mockReturnValue(initialState);
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
          expect(ResetSkillsResultsModal.mock.calls[0][0].error).toBe("An unexpected error occurred when trying to reset worker skills");
          act(() => ResetSkillsResultsModal.mock.calls[0][0].handleClose());
          expectMockedComponent(rendered, { ResetSkillsResultsModal }, 0);
          done();
        });
      });
    });
  });
});