export const calabrioGroupLevels: any = {
  TENANT: "TENANT",
  GROUP: "GROUP",
  TEAM: "TEAM"
};

export interface CalabrioFetchedUser {
  [key: string]: any,
  acdId: string,
  personId: number,
  firstName: string,
  lastName: string,
  groupId: number,
  tenantId: number,
  email: string,
  timezone: string,
  adLogin: string,
  roles: [{
    id: number,
    label: string,
    name: string,
    isAgentDefault: boolean,
    isAdminDefault: boolean,
    isSupervisorDefault: boolean
  }],
  scope: {
    groups: number[],
    teams: number[]
  }
}
export interface CalabrioGroup {
  groupId: number,
  name: string,
  displayId: null | number,
  parentGroupId: number,
  parentGroupName: string,
  groupLevel: string,
  users?: CalabrioUser[]
}
export interface CalabrioGroupLevel {
  GROUP: string,
  TEAM: string
}

export interface CalabrioUser {
  [key: string]: any,
  personId: number,
  firstName: string,
  lastName: string,
  email: string,
}