import React, {
  ReactElement,
  useEffect,
  useState
} from "react";
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  createHttpLink
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { env } from "globals";
import {
  useAdminDispatch,
  useAdminState
} from "context/appContext";
import {
  SUBSCRIBE_CREATE_USER,
  SUBSCRIBE_UPDATE_USER,
  SUBSCRIBE_DELETE_USER
} from "globals/user";
import { useSubscription } from "hooks/useSubscription";
import { mapWorkerFromDbWorker } from "utils/graphUtils";
import {
  Action,
  LoadStatuses,
  UMUser
} from "globals/interfaces";

interface Props {
  children: ReactElement
}

// To use this, the tokenManager (defined in App.jsx)
// must get an accessToken. After this point, all 
// calls will automatically include the access token in the header.
// You can use hooks (preferred) or the apolloClient directly
export let apolloClient: ApolloClient<any>;

export const SharedGraphAPIProvider = ({ children }: Props): ReactElement => {
  const {
    userContext,
    workerContext
  } = useAdminState();
  const dispatch = useAdminDispatch();
  const [subscriptionEvents, setSubscriptionEvents] = useState<Action[]>([]);

  useEffect(() => {
    if (workerContext.loadStatus === LoadStatuses.SUCCESS && subscriptionEvents.length) {
      subscriptionEvents.forEach(action => dispatch(action));
      setSubscriptionEvents([]);
    }
  }, [workerContext.loadStatus, subscriptionEvents, dispatch, setSubscriptionEvents]);

  // We want to treat creates as updates since it could also come back when loading
  const createUpdateHandler = ((data: { item: UMUser }) => {
    setSubscriptionEvents(prev => [
      ...prev,
      {
        type: "updateWorker",
        payload: mapWorkerFromDbWorker(data.item)
      }
    ]);
  });

  useSubscription<UMUser>(SUBSCRIBE_CREATE_USER, createUpdateHandler);
  useSubscription<UMUser>(SUBSCRIBE_UPDATE_USER, createUpdateHandler);
  useSubscription<UMUser>(SUBSCRIBE_DELETE_USER, (data => {
    setSubscriptionEvents(prev => [
      ...prev,
      {
        type: "deleteWorker",
        payload: data.item.worker_sid
      }
    ]);
  }));

  const httpLink = createHttpLink({
    uri: env.GRAPH_API_URL
  });

  const authLink = setContext(async (_, { headers }) => ({
    headers: {
      ...headers,
      Authorization: `Bearer ${userContext.tokens.sharedGraph}`
    }
  }));

  apolloClient = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
    defaultOptions: {
      query: {
        errorPolicy: "all"
      },
      mutate: {
        errorPolicy: "all"
      }
    }
  });

  return (
    <ApolloProvider client={apolloClient}>
      {children}
    </ApolloProvider>
  );
};
