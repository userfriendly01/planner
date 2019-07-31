import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import constants from "constants";
import React from "react";
import { render } from "react-testing-library";
import Hello from "../Hello";

const axiosMock = new MockAdapter(axios);
// const endpoint = constants.AUTH;

jest.mock("constants", () => ({
  default: {
    
  }
}))

describe("<Hello />", () => {
  
  describe("call to /admin-login is successful", () => {
    test("should call setAuthorized & parsePingToken,...", () => {
      //
    });


    describe("page is loading (authorized is not yes, no, or unknown)", () => {
      const authorized = null;
      const pingToken = { whatever: "pingToken" };
      test("should render LoadingMessage", () => {
        const rendered = render(<Hello />);
        expect(rendered.container).toHaveTextContent("Connecting...");
      });
    });
    describe("authorized = 'yes'", () => {
      test("should render div with correct content", () => {
        //
      });
    });
    //
    describe("authorized = 'no'", () => {
      test("should render div with 'You're not authorized to view this page'", () => {
        //
      });
    });
    //
    describe("authorized = 'unknown'", () => {
      test("should render div with 'An unknown error occurred'", () => {
        //
      });
    });
    //
  });

  describe("call to endpoint fails", () => {
    test("", () => {
      //
    });
  });
});