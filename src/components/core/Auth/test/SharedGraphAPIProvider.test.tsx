import React from "react";
import {
  expectMockedComponent,
  mockWorkers,
  render,
  setupMockedComponents,
  waitFor
} from "testUtils";
import { SharedGraphAPIProvider } from "../SharedGraphAPIProvider";
import { ApolloProvider } from "@apollo/client";
import {
  useAdminDispatch, useAdminState
} from "context/appContext";
import { setContext } from "@apollo/client/link/context";
import { LoadStatuses } from "globals/interfaces";
import { useSubscription } from "hooks/useSubscription";
import { mapWorkerFromDbWorker } from "utils/graphUtils";

jest.mock("@apollo/client/link/context", () => ({
  setContext: jest.fn()
}));

jest.mock("@apollo/client", () => ({
  ApolloClient: jest.fn(),
  ApolloProvider: jest.fn(),
  InMemoryCache: jest.fn(),
  createHttpLink: jest.fn()
}));

jest.mock("context/appContext", () => ({
  useAdminState: jest.fn(),
  useAdminDispatch: jest.fn()
}));

jest.mock("hooks/useSubscription", () => ({
  useSubscription: jest.fn()
}));

jest.mock("utils/graphUtils", () => ({
  mapWorkerFromDbWorker: jest.fn()
}));

jest.mock("globals/graphql", () => ({
  SUBSCRIBE_CREATE_USER: "SUBSCRIBE_CREATE_USER",
  SUBSCRIBE_UPDATE_USER: "SUBSCRIBE_UPDATE_USER",
  SUBSCRIBE_DELETE_USER: "SUBSCRIBE_DELETE_USER"
}));

describe("SharedGraphAPIProvider", () => {
  let mockDispatch: jest.Mock;

  beforeEach(() => {
    mockDispatch = jest.fn();
    (useAdminDispatch as jest.Mock).mockReturnValue(mockDispatch);
    (useAdminState as jest.Mock).mockReturnValue({
      userContext: {
        permissions: [],
        tokens: {}
      },
      workerContext: {
        workers: []
      }
    });
    (setContext as jest.Mock).mockReturnValue({
      concat: jest.fn()
    });
    (mapWorkerFromDbWorker as jest.Mock).mockReturnValue(mockWorkers[0]);

    setupMockedComponents({
      ApolloProvider
    });
    jest.clearAllMocks();
  });


  it("should render an ApolloProvider", () => {
    const rendered = render(
      <SharedGraphAPIProvider>
        <h1>hi</h1>
      </SharedGraphAPIProvider>
    );

    expectMockedComponent(rendered, { ApolloProvider });
  });

  it("should call the dispatch function when items have been added to the state and workers are not loading", async () => {
    (useAdminState as jest.Mock).mockReturnValue({
      userContext: {
        permissions: [],
        tokens: {}
      },
      workerContext: {
        workers: [],
        loadStatus: LoadStatuses.SUCCESS
      }
    });

    render(
      <SharedGraphAPIProvider>
        <h1>hi</h1>
      </SharedGraphAPIProvider>
    );

    await waitFor(() => {
      expect(useSubscription).toHaveBeenCalledWith("SUBSCRIBE_CREATE_USER", expect.any(Function));
      expect(useSubscription).toHaveBeenCalledWith("SUBSCRIBE_UPDATE_USER", expect.any(Function));
      expect(useSubscription).toHaveBeenCalledWith("SUBSCRIBE_DELETE_USER", expect.any(Function));
    });

    (useSubscription as jest.Mock).mock.calls[0][1]({
      item: mockWorkers[0]
    });

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith({
        type: "updateWorker",
        payload: mockWorkers[0]
      });
    });
  });
});
