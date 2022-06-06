export interface CalabrioFetchedUser {
  [key: string]: any,
  acdId: string,
  personId: number,
  firstName: string,
  lastName: string,
  groupId: number,
  tenantId: number,
  email: string,
  timeZone: string,
  adLogin: string,
  roles: {
    id: number,
    label: string,
    name: string,
    isAgentDefault: boolean,
    isAdminDefault: boolean,
    isSupervisorDefault: boolean
  }[],
  scope: {
    groups: number[],
    teams: number[]
  }
}

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
export interface CalabrioGroupLevel {
  GROUP: string,
  TEAM: string
}