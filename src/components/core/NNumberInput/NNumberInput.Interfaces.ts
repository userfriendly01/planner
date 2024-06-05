import { FetchUserResponse } from "services/fetchUser";

export interface ModalNNumberProps {
  disabled: boolean,
  fetchedUser: FetchUserResponse,
  label: string,
  onBlur?: () => void,
  onClear: () => void,
  onComplete: (fetchedUser: FetchUserResponse, nNumber: string) => void,
  onUpdate: (newValue: string) => void,
  value: string
}