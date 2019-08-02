import { CircularProgress } from "@material-ui/core";
import MockAdapter from "axios-mock-adapter";
import {
  Header,
  NavTabs
} from "components";
import { apiPaths } from "globals";
import React from "react";
import {
  expectMockedComponent,
  render,
  setupMockedComponents,
  waitForElement
} from "testUtils";
import { myAxios } from "utils";
import App from "../App";

const endpoint = apiPaths.AUTH;
const axiosMock = new MockAdapter(myAxios);

jest.mock("@material-ui/core", () => ({
  CircularProgress: jest.fn()
}));

jest.mock("components", () => ({
  __esModule: true,
  Header: jest.fn(),
  NavTabs: jest.fn()
}));

describe("<App />", () => {
  beforeEach(() => {
    setupMockedComponents({
      CircularProgress,
      Header,
      NavTabs
    });
  });
  describe("service call successful, res.data was returned", () => {
    beforeEach(() => axiosMock.onGet(endpoint).reply(200, { data: "whatever" }));
    describe("initial state, page is loading", () => {
      test("should render LoadingMessage", () => {
        const rendered = render(<App />);
        expect(rendered.container).toHaveTextContent("Connecting...");
        expectMockedComponent(rendered, { CircularProgress });
      });
    });
    describe("once service call is completed renders Header and NavTabs components", () => {
      test("should render Header & NavTabs", done => {
        const rendered = render(<App />);
        waitForElement(() => rendered.getByTestId("app-wrapper"))
          .then(() => {
            expectMockedComponent(rendered, { Header });
            expectMockedComponent(rendered, { NavTabs });
            expect(rendered.container).not.toHaveTextContent("Connecting...");
            done();
          });
      });
    });
  });
  describe("service call returned an error in the 400's", () => {
    beforeEach(() => axiosMock.onGet(endpoint).reply(403, { error: "Forbidden" }));
    test("should return 'You are not authorized to view this page'", done => {
      const rendered = render(<App />);
      waitForElement(() => rendered.getByTestId("unauthorized"))
        .then(() => {
          expect(rendered.container).toHaveTextContent("You are not authorized to view this page");
          done();
        });
    });
  });
  describe("service call returned an error not in the 400's", () => {
    beforeEach(() => axiosMock.onGet(endpoint).reply(500, { error: "Internal Server Error" }));
    test("should return 'An unknown error has occurred'", done => {
      const rendered = render(<App />);
      waitForElement(() => rendered.getByTestId("unknownError"))
        .then(() => {
          expect(rendered.container).toHaveTextContent("An unknown error has occurred");
          done();
        });
    });
  });
});
