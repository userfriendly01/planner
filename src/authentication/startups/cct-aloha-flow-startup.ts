import { getStartupProfiles } from "authentication";

export const runAlohaFlowStartup = (dispatch: any) => {
  return Promise.all([
    Promise.resolve(getStartupProfiles().ALOHA_FLOW.name)
  ]);
};