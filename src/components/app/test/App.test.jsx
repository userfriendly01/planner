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
const skillsEndpoint = apiPaths.GET_TASKROUTER_SKILLS;

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
    beforeEach(() => axiosMock.onGet(authEndpoint).reply(200, { stuff: "whatever" }));
    beforeEach(() => axiosMock.onGet(workersEndpoint).reply(200, []));
    beforeEach(() => axiosMock.onGet(profilesEndpoint).reply(200, { stuff: "whatever" }));
    beforeEach(() => axiosMock.onGet(skillsEndpoint).reply(200, { congrats: "you have skillz" }));
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
      beforeEach(() => axiosMock.onGet(authEndpoint).reply(403, { error: "Forbidden" }));
      test("should return 'You are not authorized to view this page'", done => {
        const rendered = render(<App />);
        waitForElement(() => rendered.getByTestId("unauthorized"))
          .then(() => {
            expect(rendered.container).toHaveTextContent("You are not authorized to view this page");
            done();
          });
      });
    });
    describe("authentication service call returned an error not in the 400's", () => {
      beforeEach(() => axiosMock.onGet(authEndpoint).reply(500, { error: "Internal Server Error" }));
      test("should return 'An error occurred while logging in.'", done => {
        const rendered = render(<App />);
        waitForElement(() => rendered.getByTestId("unknownError"))
          .then(() => {
            expect(rendered.container).toHaveTextContent("An error occurred while logging in.");
            done();
          });
      });
    });
  });
  describe(profilesEndpoint, () => {
    describe("profiles service call returned an error", () => {
      beforeEach(() => axiosMock.onGet(profilesEndpoint).reply(500, { error: "Internal Server Error" }));
      test("should return 'You are not authorized to view this page'", () => {
        const rendered = render(<App />);
        expect(rendered.container).toHaveTextContent("Loading...");
      });
    });
  });
  describe(workersEndpoint, () => {
    describe("workers service call returned an error", () => {
      beforeEach(() => axiosMock.onGet(workersEndpoint).reply(500, { error: "Internal Server Error" }));
      test("should return 'An error occurred while logging in.'", done => {
        const rendered = render(<App />);
        waitForElement(() => rendered.getByTestId("unknownError"))
          .then(() => {
            expect(rendered.container).toHaveTextContent("An error occurred while logging in.");
            done();
          });
      });
    });
  });
  describe(skillsEndpoint, () => {
    describe("skills service call returned an error", () => {
      beforeEach(() => axiosMock.onGet(skillsEndpoint).reply(500, { error: "Internal Server Error" }));
      test("should return 'An error occurred while logging in.`", done => {
        const rendered = render(<App />);
        waitForElement(() => rendered.getByTestId("unknownError"))
          .then(() => {
            expect(rendered.container).toHaveTextContent("An error occurred while logging in.");
            done();
          });
      });
    });
  });
});
