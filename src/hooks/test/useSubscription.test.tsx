import React from "react";
import {
  mockWorkers,
  render,
  waitFor
} from "testUtils";
import { useSubscription } from "../useSubscription";
import { useAdminState } from "context/appContext";
import { UMUser } from "globals/interfaces";
import { Server } from "mock-socket";
import { env } from "globals/index";
import { v4 } from "uuid";

jest.mock("context/appContext", () => ({
  useAdminState: jest.fn(),
  useAdminDispatch: jest.fn()
}));

jest.mock("utils/graphUtils", () => ({
  mapWorkerFromDbWorker: jest.fn()
}));

jest.mock("globals/graphql", () => ({
  SUBSCRIBE_CREATE_USER: "SUBSCRIBE_CREATE_USER",
  SUBSCRIBE_UPDATE_USER: "SUBSCRIBE_UPDATE_USER",
  SUBSCRIBE_DELETE_USER: "SUBSCRIBE_DELETE_USER"
}));

interface fakeProps {
  query: string;
  handlerFunc: (data: { item: UMUser }) => void;
}

const FakeComponent = ({
  query,
  handlerFunc
}: fakeProps) => {
  useSubscription(query, handlerFunc);

  return (
    <div>
      Fake component
    </div>
  );
};

describe("useSubscription", () => {
  let handlerFunc: jest.Mock;
  let wsServer: Server;

  beforeEach(() => {
    (useAdminState as jest.Mock).mockReturnValue({
      userContext: {
        permissions: [],
        tokens: {
        }
      },
      workerContext: {
        workers: []
      }
    });
    (v4 as jest.Mock).mockReturnValue("1234");
    handlerFunc = jest.fn();
    wsServer = new Server(env.GRAPH_API_WSS);

    jest.clearAllMocks();
  });

  afterEach(() => {
    wsServer.stop();
  });

  it("should not open a WS connection unless we have a token", () => {
    render(<FakeComponent query="FAKE QUERY" handlerFunc={handlerFunc} />);

    expect(wsServer.clients()).toHaveLength(0);
  });

  it("should open a WS connection when we have a token", async () => {
    const query = "FAKE QUERY";
    (useAdminState as jest.Mock).mockReturnValue({
      userContext: {
        permissions: [],
        tokens: {
          sharedGraph: "Access Token"
        }
      },
      workerContext: {
        workers: []
      }
    });

    const events = [
      {
        message: JSON.stringify({
          type: "connection_init"
        }),
        response: JSON.stringify({ type: "connection_ack" })
      },
      {
        message: JSON.stringify({
          id: v4(),
          type: "start",
          payload: {
            data: JSON.stringify({
              query,
              variables: null
            }),
            extensions: {
              authorization: {
                Authorization: "Bearer Access Token",
                host: env.GRAPH_API_HOST
              }
            }
          }
        }),
        response: JSON.stringify({
          type: "data",
          payload: {
            data: {
              item: mockWorkers[0]
            }
          }
        })
      }
    ];

    let messageNum = 0;

    wsServer.on("connection", socket => {
      socket.on("message", async data => {
        expect(data).toEqual(events[messageNum].message);

        socket.send(events[messageNum].response);
        messageNum++;
      });
    });

    render(<FakeComponent query={query} handlerFunc={handlerFunc} />);

    await waitFor(() => {
      expect(wsServer.clients()).toHaveLength(1);
    });

    await waitFor(() => {
      expect(handlerFunc).toHaveBeenCalled();
      expect(handlerFunc).toHaveBeenCalledWith({ item: mockWorkers[0] });
    });
  });
});
