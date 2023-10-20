export const enum StatusOptions {
  STARTED = "started",
  TIME_OUT = "timeout",
  FAIL = "fail",
  SUCCESS = "success"
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