export const enum StatusOptions {
  STARTED = "started",
  TIME_OUT = "timeout",
  FAIL = "fail",
  SUCCESS = "success"
}

export interface TritonPerson {
  [key: string]: any,
  ["index"]?: number,
  ["Worker Sid"]: string,
  ["N Number"]: string,
  ["Email"]: string,
  ["First Name"]: string,
  ["Last Name"]: string,
  ["Profile Id"]: string,
  ["Profile Name"]: string,
  ["Manager N Number"]: string,
  ["Manager First Name"]: string,
  ["Manager Last Name"]: string,
  ["Active"]: boolean
}

export interface QmPerson {
  [key: string]: any,
  ["index"]?: number,
  ["Acd Id"]: string,
  ["Ad Login"]: string,
  ["Email"]: string,
  ["First Name"]: string,
  ["Last Name"]: string,
  ["Team"]: string,
  ["User Id"]: number,
  ["Active"]: boolean,
}

export interface WfmPerson {
  [key: string]: any,
  ["index"]?: number,
  ["Employment Number"]: string,
  ["Identity"]: string,
  ["Email"]: string,
  ["First Name"]: string,
  ["Last Name"]: string,
  ["Business Unit Id"]: string,
  ["Team Id"]: string,
  ["Person Id"]: string,
  ["Active"]: true
}

export interface ProfileColumnProps {
  people: TritonPerson[] | QmPerson[] | WfmPerson[],
  title: string
}
export interface ResetModalProps {
  nNumber: string,
  email: string,
  workerSid: string,
  wfmPersonId: string | undefined,
  onClose: VoidFunction
}

export interface Result {
  stepNumber: number,
  description: string,
  result: string | string[]
}