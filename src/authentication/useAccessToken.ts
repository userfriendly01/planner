import {
  useEffect,
  useState
} from "react";
import { useMsal } from "@azure/msal-react";
import { getAdGroupPermissionMapping } from "./authenticationProfiles";
import { logger } from "utils";
import { AccountInfo } from "@azure/msal-browser";

interface Auth {
  accessToken: string;
  matchedGroups: any[];
  isAuthenticated: boolean;
  isLoading: boolean;
  error?: string;
  account: AccountInfo
}

const authenticationProfiles = ()=>{
  const authProfiles = getAdGroupPermissionMapping();
  const authGroups: any[] = [];
  authProfiles?.forEach(item=>{
    if(item.startup.name === "aloha-route" || item.startup.name === "aloha-flow"){
      authGroups.push(item);
    }
  });
  return authGroups;
};

export const useAccessToken = (): Auth => {
  const { instance } = useMsal();
  const account = instance.getActiveAccount();

  const [accessToken, setAccessToken] = useState("");
  const [matchedGroups, setMatchedGroups] = useState([]);
  const [loadingToken, setLoadingToken] = useState(true);
  const [loadingGroups, setLoadingGroups] = useState(true);
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    const getMatchedGroups = async () => {
      let nextLink = "https://graph.microsoft.com/v1.0/me/memberOf?$select=displayName";
      const membershipValues = [];

      while(nextLink) {
        try {
          const response = await fetch(nextLink, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          });

          const data = await response.json();

          ({ "@odata.nextLink": nextLink } = data);

          membershipValues.push(...data.value);
        } catch(err) {
          logger.error("Azure group check failed", {});
        }
      }

      const newMatchedGroups = [] as any[];
      membershipValues.map(group => {
        authenticationProfiles().map(member => {
          if(member.adGroup.toLowerCase() === group.displayName.toLowerCase()){
            newMatchedGroups.push(member);
          }
        });
      });

      if (!newMatchedGroups.length) {
        setError("User does not have any required AD Groups");
      }

      setMatchedGroups(newMatchedGroups);
      setLoadingGroups(false);
    };

    if (accessToken) {
      setLoadingGroups(true);
      getMatchedGroups();
    }
  }, [accessToken]);

  useEffect(() => {
    const getAccessToken = async () => {
      const request = {
        account,
        scopes: ["User.Read"]
      };

      try {
        // Try to silently get token
        const { accessToken: newAccessToken } = await instance.acquireTokenSilent(request);

        setAccessToken(newAccessToken);
      } catch(_) {
        try {
          // Try to loudly get token
          const { accessToken: newAccessToken } = await instance.acquireTokenPopup(request);

          setAccessToken(newAccessToken);
        } catch(err) {
          // An authentication error has occurred
          setError((err as Error).message);
          setLoadingToken(false);
        }
      }

      setLoadingToken(false);
    };

    if (account && !accessToken) {
      setLoadingToken(true);
      getAccessToken();
    }
  }, [account, accessToken]);

  logger.info(
    "Authentication Context: ", {
      matchedGroups,
      isAuthenticated: !!matchedGroups.length,
      account
    },
    false
  );

  return {
    accessToken,
    matchedGroups,
    isAuthenticated: !!matchedGroups.length,
    isLoading: loadingGroups || loadingToken,
    error,
    account
  };
};
