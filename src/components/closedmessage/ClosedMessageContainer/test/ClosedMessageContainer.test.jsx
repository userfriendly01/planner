import ClosedMessageContainer from "../ClosedMessageContainer";
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
  render,
  setupMockedComponents
} from "testUtils";
import { myAxios } from "utils";
import { initialState } from "context";

const axiosMock = new MockAdapter(myAxios);

const dummyNNumber = "n0217643";

const validWorker = {
  attributes: {
    n_number: dummyNNumber,
    profile_id: 4
  }
};

const unauthorizedWorker = {
  attributes: {
    n_number: dummyNNumber,
    profile_id: 11
  }
};

const authorizedAdminState = {
  ...initialState,
  userContext: {
    pingIdentity: {
      sub: dummyNNumber
    }
  },
  workerContext: {
    workers: [validWorker]
  }
};

jest.mock("@material-ui/core", () => ({
  CircularProgress: jest.fn()
}));

jest.mock("components", () => ({
  __esModule: true,
  AddFlashMessage: jest.fn(),
  FlashMessageSidebar: jest.fn(),
  ViewFlashMessage: jest.fn()
}));

describe("<ClosedMessageContainer />", () => {

  beforeEach(() => {
    setupMockedComponents({
      AddFlashMessage,
      CircularProgress,
      FlashMessageSidebar,
      ViewFlashMessage
    });
  });

  describe("initial state - fetching message from DB", () => {
    test("should render loading screen", () => {
      const rendered = render(<ClosedMessageContainer />, authorizedAdminState);
      expect(rendered.container).toHaveTextContent("Loading...");
      expectMockedComponent(rendered, { CircularProgress });
      expectMockedComponent(rendered, { FlashMessageSidebar });
      expectMockedComponent(rendered, { AddFlashMessage }, 0);
      expectMockedComponent(rendered, { ViewFlashMessage }, 0);
    });
  });

  describe("fetch flash message is successful", () => {
    describe("flash message in DB is empty string", () => {
      beforeEach(() => axiosMock.onGet(apiPaths.FLASH_MESSAGE + "/aisgL1").reply(200, { flashMessage: "" }));
      test("should render editable component; should not render 'loading'", done => {
        let rendered;
        act(() => {
          rendered = render(<ClosedMessageContainer />, authorizedAdminState);
          return Promise.resolve();
        })
          .then(() => {
            expectMockedComponent(rendered, { FlashMessageSidebar });
            expectMockedComponent(rendered, { AddFlashMessage } );
            expectMockedComponent(rendered, { ViewFlashMessage }, 0);
            expectMockedComponent(rendered, { CircularProgress }, 0);
            expect(rendered.container).not.toHaveTextContent("Loading...");
            done();
          });
      });
    });
    describe("flash message in DB is not an empty string", () => {
      beforeEach(() => axiosMock.onGet(apiPaths.FLASH_MESSAGE + "/aisgL1").reply(200, { flashMessage: "flash message here" }));
      test("should render locked component; should not render 'loading'", done => {
        let rendered;
        act(() => {
          rendered = render(<ClosedMessageContainer />, authorizedAdminState);
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
    beforeEach(() => axiosMock.onGet(apiPaths.FLASH_MESSAGE + "/aisgL1").reply(500, "something bad happened"));
    test("should display error message & locked component", done => {
      let rendered;
      act(() => {
        rendered = render(<ClosedMessageContainer />, authorizedAdminState);
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

  describe("User not authorized", () => {
    describe("User in Profile that doesn't allow self service", () => {
      beforeEach(() => axiosMock.onGet(apiPaths.FLASH_MESSAGE + "/aisgL1").reply(500, "something bad happened"));
      test("should display error message & locked component", done => {
        const unauthorizedAdminState = {
          ...initialState,
          userContext: {
            pingIdentity: {
              sub: "n0345678"
            }
          },
          workerContext: {
            workers: [unauthorizedWorker]
          }
        };
        let rendered;
        act(() => {
          rendered = render(<ClosedMessageContainer />, unauthorizedAdminState );
          return Promise.resolve();
        })
          .then(() => {
            expect(rendered.getByTestId("service-call-error")).toBeInTheDocument();
            expectMockedComponent(rendered, { ViewFlashMessage }, 0);
            expectMockedComponent(rendered, { AddFlashMessage }, 0);
            done();
          });
      });
    });
    describe("User doesn't have twilio Worker", () => {
      beforeEach(() => axiosMock.onGet(apiPaths.FLASH_MESSAGE + "/aisgL1").reply(500, "something bad happened"));
      test("should display error message & locked component", done => {
        const noMatchingWorkerAdminState = {
          ...initialState,
          userContext: {
            pingIdentity: {
              sub: "n0345678"
            }
          },
          workerContext: {
            workers: []
          }
        };
        let rendered;
        act(() => {
          rendered = render(<ClosedMessageContainer />, noMatchingWorkerAdminState);
          return Promise.resolve();
        })
          .then(() => {
            expect(rendered.getByTestId("service-call-error")).toBeInTheDocument();
            expectMockedComponent(rendered, { ViewFlashMessage }, 0);
            expectMockedComponent(rendered, { AddFlashMessage }, 0);
            done();
          });
      });
    });
  });

});