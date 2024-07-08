import { useAdminState } from "context/appContext";
import { env } from "globals/index";
import {
  useEffect, useState
} from "react";
import { v4 as uuid } from "uuid";

interface Message {
  type: "connection_ack" | "ka" | "start_ack";
}

interface DataMessage {
  type: "data"
  payload: {
    data: unknown;
  }
}

export const useSubscription = <T>(query: string, handlerFunc: (data: { item: T }) => void, variables: unknown = null): void => {
  const { userContext } = useAdminState();
  const [websocket, setWebsocket] = useState<WebSocket>();

  useEffect(() => {
    if (userContext.tokens.sharedGraph && !websocket) {
      const authorization = {
        Authorization: `Bearer ${userContext.tokens.sharedGraph}`,
        host: env.GRAPH_API_HOST
      };

      const header = btoa(JSON.stringify(authorization));
      const payload = btoa(JSON.stringify({}));
      const url = `${env.GRAPH_API_WSS}?header=${header}&payload=${payload}`;
      const newWebSocket = new WebSocket(url, "graphql-ws");

      const messageHandler = ({ data }: MessageEvent<string>) => {
        const message = JSON.parse(data) as Message | DataMessage;

        switch(message.type) {
          case "data":
            handlerFunc(message.payload.data as { item: T });
            break;
          case "connection_ack":
            newWebSocket.send(
              JSON.stringify({
                id: uuid(),
                type: "start",
                payload: {
                  data: JSON.stringify({
                    query,
                    variables
                  }),
                  extensions: {
                    authorization
                  }
                }
              })
            );
            break;
          default:
            break;
        }
      };

      const openHandler = () => {
        newWebSocket.send(
          JSON.stringify({
            type: "connection_init"
          })
        );
      };

      newWebSocket.addEventListener("open", openHandler);
      newWebSocket.addEventListener("message", messageHandler);

      setWebsocket(newWebSocket);
    }

    return () => {
      if (websocket) {
        websocket.close();
      }
    };
  }, [websocket, userContext.tokens.sharedGraph]);
};
