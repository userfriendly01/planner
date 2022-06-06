import { calabrioGroupLevels } from "globals";
import { CalabrioGroup } from "../components/usermanagement/CallRecording/CallRecording.Interfaces";

export const formatCalabrioTeams = (groupsArray: CalabrioGroup[]): CalabrioGroup[] => {
  return groupsArray.filter((group: CalabrioGroup) => group.groupLevel === calabrioGroupLevels.TEAM);
};

export const formatCalabrioGroups = (groupsArray: CalabrioGroup[]): CalabrioGroup[] => {
  return groupsArray.filter((group: CalabrioGroup) => group.groupLevel === calabrioGroupLevels.GROUP);
};

export const formatCalabrioUsers = (groupsArray: CalabrioGroup[]): any[] => {
  const users: any[] = [];
  groupsArray.forEach((group: CalabrioGroup) => {
    if(group.agents){
      group.agents.forEach(agent => {
        users.push(agent);
      });
    }
  });
  return users;
};