export enum ExtensionSearchStatuses {
  Idle = 0,
  PickANumber = 1,
  WaitingForResponse = 2,
}

export interface ExtensionStatusProps {
  searchStatus: ExtensionSearchStatuses,
  retriesRemaining: number,
  message?: string,
  isError?: boolean,
  originalExtension: string
}

export interface ModalExtensionProps {
  disabled?: boolean,
  extension: string,
  message?: string,
  isError?: boolean,
  onBlur?: () => void,
}