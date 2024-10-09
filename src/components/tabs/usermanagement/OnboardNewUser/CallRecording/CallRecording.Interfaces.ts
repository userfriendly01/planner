export const calabrioGroupLevels: any = {
  TENANT: "TENANT",
  GROUP: "GROUP",
  TEAM: "TEAM"
};

export interface CalabrioGroup {
  groupId: number,
  name: string,
  displayId: null | number,
  parentGroupId: number,
  parentGroupName: string,
  groupLevel: string,
  users?: CalabrioUser[]
  checked?: boolean
}

export interface CalabrioQMView {
  id: number,
  name: string,
  mainView?: boolean
}

export interface CalabrioUser {
  [key: string]: any,
  personId: number,
  firstName: string,
  lastName: string,
  email: string,
}