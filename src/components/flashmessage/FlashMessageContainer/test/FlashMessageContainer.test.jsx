import FlashMessageContainer from "../FlashMessageContainer";
import {
  AddFlashMessage,
  ViewFlashMessage
} from "components";
import React from "react";
import {
  act,
  expectMockedComponent,
  // expectOnlyPassedProps,
  getTestState,
  render,
  setupMockedComponents
} from "testUtils";

jest.mock("components", () => ({
  __esModule: true,
  AddFlashMessage: jest.fn(),
  ViewFlashMessage: jest.fn()
}));

describe("<FlashMessageContainer />", () => {

  beforeEach(() => {
    setupMockedComponents({
      AddFlashMessage,
      ViewFlashMessage
    });
  });

  describe("readOnly is false", () => {
    const state = getTestState();
    test("should render AddFlashMessage with correct props; should NOT render ViewFlashMessage", () => {
      const rendered = render(<FlashMessageContainer />, state);
      // const toggleReadOnly = AddFlashMessage.mock.calls[0][0].toggleReadOnly;
      // act(() => {
      //   toggleReadOnly();
      // });
      // console.log("mock calls:", AddFlashMessage.mock.calls);
      // console.log("readOnly:", readOnly);
      expectMockedComponent(rendered, { AddFlashMessage });
      expectMockedComponent(rendered, { ViewFlashMessage }, 0);
    });
  });

  describe("readOnly is true", () => {
    const state = getTestState();
    test("should render ViewFlashMessage with correct props; should NOT render AddFlashMessage", () => {
      const rendered = render(<FlashMessageContainer />, state);
      const toggleReadOnly = AddFlashMessage.mock.calls[0][0].toggleReadOnly;
      act(() => {
        toggleReadOnly();
      });
      expectMockedComponent(rendered, { ViewFlashMessage });
      expectMockedComponent(rendered, { AddFlashMessage }, 0);
    });
  });

});