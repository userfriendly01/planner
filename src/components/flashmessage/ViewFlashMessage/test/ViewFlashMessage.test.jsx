import ViewFlashMessage from "../ViewFlashMessage";
import MockAdapter from "axios-mock-adapter";
import { initialState } from "context";
import { apiPaths } from "globals";
import React from "react";
import {
  act,
  fireEvent,
  mockStore,
  render
} from "testUtils";
import { myAxios } from "utils";

const axiosMock = new MockAdapter(myAxios);
const mockToggleReadOnly = jest.fn();

const renderComponent = state => {
  return render(<ViewFlashMessage toggleReadOnly={mockToggleReadOnly} />, state);
};

describe("<ViewFlashMessage />", () => {
  beforeEach(() => {
    mockToggleReadOnly.mockClear();
  });
  test("initialState ViewFlashMessage should render an empty textfield with two buttons.", () => {
    const rendered = renderComponent(initialState);
    expect(rendered.getByTitle("Edit")).toBeTruthy();
    expect(rendered.getByTitle("Delete")).toBeTruthy();
    expect(mockToggleReadOnly.mock.calls).toHaveLength(0);
  });
  test("with a valid message ViewFlashMessage should render that message.", () => {
    const state = initialState;
    state.flashMessage = "Stuff be down, enjoy the free time";
    const rendered = renderComponent(state);
    expect(rendered.getByText("Stuff be down, enjoy the free time")).toBeTruthy();
  });
  test("clicking the edit button should toggle the readonly state to false.", () => {
    const state = initialState;
    state.flashMessage = "Stuff be down, enjoy the free time";
    const rendered = renderComponent(state);
    fireEvent.click(rendered.getByTitle("Edit"));
    expect(mockToggleReadOnly.mock.calls).toHaveLength(1);
    expect(mockToggleReadOnly.mock.calls[0][0]).toBe(false);
  });

  describe("when view message is confirmed", () => {
    beforeEach(() => window.confirm = () => true);
    const state = {
      ...initialState,
      flashMessage: "Stuff be down, enjoy the free time"
    };
    describe("post to updateflashmessage is successful", () => {
      beforeEach(() => axiosMock.onPost(apiPaths.UPDATE_FLASH_MESSAGE).reply(200, { whatever: "delete successful" }));
      test("should return ... and toggle read only to true", done => {
        const rendered = renderComponent(state);
        const button = rendered.getByTitle("Delete");
        act(() => {
          fireEvent.click(button);
          return Promise.resolve();
        })
          .then(() => {
            expect(mockToggleReadOnly).toHaveBeenCalledTimes(1);
            expect(mockToggleReadOnly).toHaveBeenCalledWith(false);
            const actions = mockStore.getActions();
            expect(actions).toHaveLength(1);
            expect(actions[0]).toEqual({
              type: "updateFlashMessage",
              payload: ""
            });
            done();
          });
      });
    });
    describe("post to updateflashmessage fails", () => {
      beforeEach(() => axiosMock.onPost(apiPaths.UPDATE_FLASH_MESSAGE).reply(500, { ohNo: "it failed" }));
      test("should return ... and toggle read only should remain true", () => {
        const rendered = renderComponent(state);
        const button = rendered.getByTitle("Delete");
        act(() => fireEvent.click(button));
        expect(mockToggleReadOnly).not.toHaveBeenCalled();
      });
    });
  });

  describe("view message is not confirmed", () => {
    test("if they select no we should do nothing.", () => {
      window.confirm = jest.fn(() => false);
      const state = initialState;
      state.flashMessage = "Stuff be down, enjoy the free time";
      const rendered = renderComponent(state);
      fireEvent.click(rendered.getByTitle("Delete"));
      expect(mockToggleReadOnly.mock.calls).toHaveLength(0);
      const actions = mockStore.getActions();
      expect(actions).toHaveLength(0);
    });
  });
});