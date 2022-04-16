import { apiPaths }from "globals";
import { CalabrioGroup } from "../components/usermanagement/CallRecording/CallRecording.Interfaces";
import { myAxios } from "utils";

export const getCalabrioOrg = async (): Promise<CalabrioGroup[]> => {
  const organization: any = await myAxios.get(apiPaths.GET_CALABRIO_ORG);
  console.log("ORGANIZATION: ", organization);
  return organization.map((group: CalabrioGroup) => {
    delete group.agents;
    return group;
  });
};
