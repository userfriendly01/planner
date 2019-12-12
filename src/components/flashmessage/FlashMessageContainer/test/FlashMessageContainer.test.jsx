import FlashMessageContainer from "../FlashMessageContainer";
import { CircularProgress } from "@material-ui/core";
import MockAdapter from "axios-mock-adapter";
import {
  AddFlashMessage,
  FlashMessageSidebar,
  ViewFlashMessage
} from "components";
import { apiPaths } from "globals";
import React from "react";
import {
  act,
  expectMockedComponent,
  getTestState,
  render,
  setupMockedComponents
} from "testUtils";
import { myAxios } from "utils";

const axiosMock = new MockAdapter(myAxios);

jest.mock("@material-ui/core", () => ({
  CircularProgress: jest.fn()
}));

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
      CircularProgress,
      FlashMessageSidebar,
      ViewFlashMessage
    });
  });

  describe("initial state - fetching message from DB", () => {
    const state = getTestState();
    test("should render loading screen", () => {
      const rendered = render(<FlashMessageContainer />, state);
      expect(rendered.container).toHaveTextContent("Loading...");
      expectMockedComponent(rendered, { CircularProgress });
      expectMockedComponent(rendered, { FlashMessageSidebar });
      expectMockedComponent(rendered, { AddFlashMessage }, 0);
      expectMockedComponent(rendered, { ViewFlashMessage }, 0);
    });
  });

  describe("fetch flash message is successful", () => {
    describe("flash message in DB is empty string", () => {
      beforeEach(() => axiosMock.onPost(apiPaths.GET_FLASH_MESSAGE).reply(200, ""));
      test("should render editable component; should not render 'loading'", done => {
        const state = getTestState();
        let rendered;
        act(() => {
          rendered = render(<FlashMessageContainer />, state);
          return Promise.resolve();
        })
          .then(() => {
            expectMockedComponent(rendered, { FlashMessageSidebar });
            expectMockedComponent(rendered, { AddFlashMessage });
            expectMockedComponent(rendered, { ViewFlashMessage }, 0);
            expectMockedComponent(rendered, { CircularProgress }, 0);
            expect(rendered.container).not.toHaveTextContent("Loading...");
            done();
          });
      });
    });
    describe("flash message in DB is not an empty string", () => {
      beforeEach(() => axiosMock.onPost(apiPaths.GET_FLASH_MESSAGE).reply(200, "flash message here"));
      test("should render locked component; should not render 'loading'", done => {
        const state = getTestState();
        let rendered;
        act(() => {
          rendered = render(<FlashMessageContainer />, state);
          return Promise.resolve();
        })
          .then(() => {
            expectMockedComponent(rendered, { FlashMessageSidebar });
            expectMockedComponent(rendered, { ViewFlashMessage });
            expectMockedComponent(rendered, { AddFlashMessage }, 0);
            expectMockedComponent(rendered, { CircularProgress }, 0);
            expect(rendered.container).not.toHaveTextContent("Loading...");
            done();
          });
      });
    });
  });

  describe("fetch flash message fails", () => {
    beforeEach(() => axiosMock.onPost(apiPaths.GET_FLASH_MESSAGE).reply(500, "something bad happened"));
    test("should display error message & locked component", done => {
      const state = getTestState();
      let rendered;
      act(() => {
        rendered = render(<FlashMessageContainer />, state);
        return Promise.resolve();
      })
        .then(() => {
          expect(rendered.getByTestId("service-call-error")).toBeInTheDocument();
          expectMockedComponent(rendered, { ViewFlashMessage }, 1);
          expectMockedComponent(rendered, { AddFlashMessage }, 0);
          done();
        });
    });
  });
});