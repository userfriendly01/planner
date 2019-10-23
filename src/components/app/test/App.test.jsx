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

const authEndpoint = apiPaths.AUTH;
const axiosMock = new MockAdapter(myAxios);
const profilesEndpoint = apiPaths.GET_PROFILES;
const workersEndpoint = apiPaths.GET_WORKERS;

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
  describe("all service calls successful", () => {
    beforeEach(() => {
      axiosMock.onGet(authEndpoint).reply(200, { stuff: "whatever" });
      axiosMock.onGet(workersEndpoint).reply(200, []);
      axiosMock.onGet(profilesEndpoint).reply(200, { stuff: "whatever" });
    });
    describe("initial state, page is loading", () => {
      test("should render LoadingMessage", () => {
        const rendered = render(<App />);
        expect(rendered.container).toHaveTextContent("Loading...");
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
            expect(rendered.container).not.toHaveTextContent("Loading...");
            done();
          });
      });
    });
  });
  describe(authEndpoint, () => {
    describe("authentication service call returned an error in the 400's", () => {
      const statusCode = 403;
      beforeEach(() => {
        axiosMock.onGet(authEndpoint).reply(statusCode, { stuff: "whatever" });
        axiosMock.onGet(workersEndpoint).reply(200, []);
        axiosMock.onGet(profilesEndpoint).reply(200, { stuff: "whatever" });
      });
      test("should return 'You are not authorized to view this page'", done => {
        const rendered = render(<App />);
        waitForElement(() => rendered.getByTestId("error-overlay"))
          .then(() => {
            expect(rendered.container).toHaveTextContent(statusCode);
            expect(rendered.container).toHaveTextContent("You are not authorized to view this page");
            done();
          });
      });
    });
    describe("authentication service call returned an error not in the 400's", () => {
      const statusCode = 500;
      beforeEach(() => {
        axiosMock.onGet(authEndpoint).reply(statusCode, { stuff: "whatever" });
        axiosMock.onGet(workersEndpoint).reply(200, []);
        axiosMock.onGet(profilesEndpoint).reply(200, { stuff: "whatever" });
      });
      test("should return 'An error occurred while logging in.'", done => {
        const rendered = render(<App />);
        waitForElement(() => rendered.getByTestId("error-overlay"))
          .then(() => {
            expect(rendered.container).toHaveTextContent(statusCode);
            expect(rendered.container).toHaveTextContent("An error occurred when trying to authenticate");
            done();
          });
      });
    });
  });
  describe(profilesEndpoint, () => {
    describe("profiles service call returned an error", () => {
      const statusCode = 500;
      beforeEach(() => {
        axiosMock.onGet(authEndpoint).reply(200, { stuff: "whatever" });
        axiosMock.onGet(workersEndpoint).reply(200, []);
        axiosMock.onGet(profilesEndpoint).reply(statusCode, { stuff: "whatever" });
      });
      test("should return 'An error occurred while logging in.'", done => {
        const rendered = render(<App />);
        waitForElement(() => rendered.getByTestId("error-overlay"))
          .then(() => {
            expect(rendered.container).toHaveTextContent(statusCode);
            expect(rendered.container).toHaveTextContent("Failed to fetch profiles from service");
            done();
          });
      });
    });
  });
  describe(workersEndpoint, () => {
    describe("workers service call returned an error", () => {
      const statusCode = 500;
      beforeEach(() => {
        axiosMock.onGet(authEndpoint).reply(200, { stuff: "whatever" });
        axiosMock.onGet(workersEndpoint).reply(statusCode, []);
        axiosMock.onGet(profilesEndpoint).reply(200, { stuff: "whatever" });
      });
      test("should return 'An error occurred while logging in.'", done => {
        const rendered = render(<App />);
        waitForElement(() => rendered.getByTestId("error-overlay"))
          .then(() => {
            expect(rendered.container).toHaveTextContent(statusCode);
            expect(rendered.container).toHaveTextContent("Failed to fetch workers from service");
            done();
          });
      });
    });
  });
});
