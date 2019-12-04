import FlashMessageContainer from "../FlashMessageContainer";
import {
  AddFlashMessage,
  FlashMessageSidebar,
  ViewFlashMessage
} from "components";
import React from "react";
import {
  act,
  expectMockedComponent,
  getTestState,
  render,
  setupMockedComponents
} from "testUtils";

jest.mock("components", () => ({
  __esModule: true,
  AddFlashMessage: jest.fn(),
  FlashMessageSidebar: jest.fn(),
  ViewFlashMessage: jest.fn()
}));

describe("<FlashMessageContainer />", () => {

  beforeEach(() => {
    setupMockedComponents({
      AddFlashMessage,
      FlashMessageSidebar,
      ViewFlashMessage
    });
  });

  describe("readOnly is false", () => {
    const state = getTestState();
    test("should render Sidebar & AddFlashMessage; should NOT render ViewFlashMessage", () => {
      const rendered = render(<FlashMessageContainer />, state);
      expectMockedComponent(rendered, { FlashMessageSidebar });
      expectMockedComponent(rendered, { AddFlashMessage });
      expectMockedComponent(rendered, { ViewFlashMessage }, 0);
    });
  });

  describe("readOnly is true", () => {
    const state = getTestState();
    test("should render Sidebar & ViewFlashMessage; should NOT render AddFlashMessage", () => {
      const rendered = render(<FlashMessageContainer />, state);
      const toggleReadOnly = AddFlashMessage.mock.calls[0][0].toggleReadOnly;
      act(() => {
        toggleReadOnly();
      });
      expectMockedComponent(rendered, { FlashMessageSidebar });
      expectMockedComponent(rendered, { ViewFlashMessage });
      expectMockedComponent(rendered, { AddFlashMessage }, 0);
    });
  });

});