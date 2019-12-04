import ViewFlashMessage from "../ViewFlashMessage";
import { initialState } from "context";
import React from "react";
import {
  fireEvent,
  mockStore,
  render
} from "testUtils";

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
  describe("clicking the delete button should ask the user if they really want to", () => {
    test("if they select yes we should toggle the readonly state to false, as well as dispatch an action to update the flashmessage to empty.", () => {
      window.confirm = jest.fn(() => true);
      const state = initialState;
      state.flashMessage = "Stuff be down, enjoy the free time";
      const rendered = renderComponent(state);
      fireEvent.click(rendered.getByTitle("Delete"));
      expect(mockToggleReadOnly.mock.calls).toHaveLength(1);
      expect(mockToggleReadOnly.mock.calls[0][0]).toBe(false);
      const actions = mockStore.getActions();
      expect(actions).toHaveLength(1);
      expect(actions[0]).toEqual({
        type: "updateFlashMessage",
        payload: ""
      });
    });
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