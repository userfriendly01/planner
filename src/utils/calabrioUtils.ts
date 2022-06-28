import { calabrioGroupLevels } from "globals";

export interface CalabrioUser {
    [key: string]: any,
    personId: number,
    firstName: string,
    lastName: string,
    email: string,
  }
export interface CalabrioGroup {
    groupId: number,
    name: string,
    displayId: null | number,
    parentGroupId: number,
    parentGroupName: string,
    groupLevel: string,
    agents?: CalabrioUser[]
  }

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