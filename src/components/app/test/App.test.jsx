import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import {
  Header,
  NavTabs
} from "components";
import { apiPaths } from "globals";
import React from "react";
import { render } from "@testing-library/react";
import { expectMockedComponent } from "testUtils";
import App from "../App";

const axiosMock = new MockAdapter(axios);
const endpoint = apiPaths.AUTH;

describe("<App />", () => {

  beforeEach(() => axiosMock.reset());

  describe("initial state, page is loading", () => {
    afterEach(() => axiosMock.onGet(endpoint).reply(200, {} ));
    test("should render LoadingMessage", () => {
      axios.get(endpoint).then(() => {
        const rendered = render(<App />);
        expect(rendered.container).toHaveTextContent("Connecting...");
      });
    });
  });

  describe(`call to ${endpoint} is successful`, () => {
    // describe("authorized = 'yes' & pingToken is not null", () => {
    //   beforeEach(() => {
    //     axiosMock.onGet(endpoint).reply(200, {
    //       data: { whatever: "res.data exists" }
    //     });
    //   });
    //   test("should render Header & NavTabs", done => {
    //     axios.get(endpoint).then(() => {
    //       const rendered = render(<App />);
    //       expect(rendered.container).not.toHaveTextContent("Connecting...");
    //       expectMockedComponent(rendered, <Header />);
    //       expectMockedComponent(rendered, <NavTabs />);
    //       done();
    //     });
    //   });
    // });

    describe("authorized = 'yes' but pingToken is null", () => {
      test("should render div with correct content", () => {
        //
      });
    });

    describe("authorized = 'no'", () => {
      test("should render div with 'You're not authorized to view this page'", () => {
        //
      });
    });

    describe("authorized = 'unknown'", () => {
      test("should render div with 'An unknown error occurred'", () => {
        //
      });
    });
  });

  describe("call to endpoint fails", () => {
    test("", () => {
      //
    });
  });
});